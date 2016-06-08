(function () {
    angular.module('blog', ['ngRoute', 'config', 'blog.controllers', 'i18n', 'catalog', 'momentx', 'toggle.edit.mode', 'angular.usecase.adapter', 'bin.edit'])
        .config(['$routeProvider', 'configProvider', function($routeProvider, configProvider) {
            $routeProvider
                .when('/add/blog', {templateUrl:'partials/blog/add.html'})
                .when('/:locale/add/blog', {templateUrl: 'partials/blog/add.html'})
                .when('/blog/add', {templateUrl: 'partials/blog/add.html'})
                .when('/:locale/blog/add', {templateUrl: 'partials/blog/add.html'})
                .when('/blog', {templateUrl:'partials/blog/index.html'})
                .when('/:locale/blog', {templateUrl:'partials/blog/index.html'})
                .when('/blog/:blogType', {templateUrl:'partials/blog/index.html', controller: ['$scope', '$routeParams', BlogTypeController]})
                .when('/:locale/blog/:blogType', {templateUrl:'partials/blog/index.html', controller: ['$scope', '$routeParams', BlogTypeController]});

            configProvider.add({
                searchSettings: {
                    blog: {
                        entity:'catalog-item',
                        context:'search',
                        filters:{
                            type:'blog',
                            sortings: [
                                {on:'publicationTime', orientation:'desc'}
                            ]
                        },
                        autosearch:true,
                        subset:{count:12},
                        noMoreResultsNotification: false
                    }
                }
            });
        }])
        .directive('binBlog', [BinBlogDirective])
        .directive('binBlogPreviews', BinBlogPreviewsDirective)
        .directive('binBlogAddArticleButton', ['$templateCache', 'ngRegisterTopicHandler', 'activeUserHasPermission', BinBlogAddArticleButtonDirective])
        .directive('binBlogDrafts', ['$templateCache', 'ngRegisterTopicHandler', 'activeUserHasPermission', BinBlogDraftsDirective]);

    angular.module('blog.controllers', ['blog.types'])
        .controller('BinBlogController', ['$q', '$routeParams', 'i18n', 'addCatalogItem', BinBlogController])
        .controller('BinBlogPostController', ['$scope', '$templateCache', 'editModeRenderer', 'updateCatalogItem', 'usecaseAdapterFactory', 'moment', BinBlogPostController])
        .controller('AddBlogController', ['$scope', 'blogTypesLoader', AddBlogController])
        .controller('BlogTypesController', ['$scope', 'blogTypesLoader', BlogTypesController])
        .controller('BlogTypeController', ['$scope', '$routeParams', BlogTypeController]);

    function AddBlogController($scope, blogTypesLoader) {
        $scope.blogTypes = blogTypesLoader();
    }

    function BlogTypesController($scope, blogTypesLoader) {
        $scope.blogTypes = blogTypesLoader();
    }

    function BlogTypeController($scope, $routeParams) {
        $scope.blogType = $routeParams.blogType;
    }

    function BinBlogController($q, $routeParams, i18n, addCatalogItem) {
        var self = this;
        self.partition = self.partition || '/blog/';
        self.blogType = self.blogType || $routeParams.blogType;

        this.isAllowed = function () {
            var deferred = $q.defer();
            if (self.multilingual) deferred.resolve(true);
            else {
                i18n.getMainLanguage().then(function (mainLocale) {
                    i18n.getExternalLocale().then(function (externalLocale) {
                        deferred.resolve(mainLocale == externalLocale);
                    }, function () {
                        deferred.resolve(true);
                    });
                });
            }

            return deferred.promise;
        };

        this.getMainLocale = i18n.getMainLanguage;

        this.addArticle = function (blogType) {
            var item = {
                type: 'blog',
                blogType: blogType || self.blogType || 'blog',
                partition: self.partition
            };
            if (!self.multilingual) item.locale = 'default';

            return addCatalogItem({
                item: item,
                redirectToView: true,
                editMode: true
            });
        };
    }

    function BinBlogPostController($scope, $templateCache, editModeRenderer, updateCatalogItem, usecaseAdapterFactory, moment) {
        var self = this;
        var published = 'published', draft = 'draft';
        var timeFormat = 'lll';

        this.init = function (item) {
            self.item = item;
            updateItemStatus();
        };

        function updateItemStatus() {
            self.updateStatus = self.item.status == published ? unPublish : publish;
        }

        function publish() {
            var scope = $scope.$new();
            scope.publicationTime = self.item.publicationTime ? moment(self.item.publicationTime) : moment();

            scope.submit = function () {
                var time = moment(scope.publicationTime, timeFormat).format();
                
                var ctx = usecaseAdapterFactory(scope);
                ctx.data = {
                    id: self.item.id,
                    type: self.item.type,
                    blogType: self.item.blogType,
                    context: 'update',
                    status: published,
                    publicationTime: time
                };
                ctx.success = function () {
                    self.item.status = published;
                    self.item.publicationTime = time;
                    updateItemStatus();
                    editModeRenderer.close();
                };
                updateCatalogItem(ctx);
            };
            
            scope.cancel = editModeRenderer.close;

            editModeRenderer.open({
                template: $templateCache.get('bin-blog-update-status.html'),
                scope: scope
            });
        }

        function unPublish() {
            var ctx = usecaseAdapterFactory($scope);
            ctx.data = {
                id: self.item.id,
                type: self.item.type,
                blogType: self.item.blogType,
                context: 'update',
                status: draft
            };
            ctx.success = function () {
                self.item.status = draft;
                updateItemStatus();
            };
            updateCatalogItem(ctx);
        }
    }

    function BinBlogDirective() {
        return {
            restrict: 'E',
            scope: {
                partition: '@',
                blogType: '@',
                multilingual: '@',
                count: '@'
            },
            controller: 'BinBlogController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }

    function BinBlogPreviewsDirective() {
        return {
            restrict: 'E',
            scope: true,
            require: '^^binBlog',
            controller: 'BinartaSearchController',
            controllerAs: 'searchCtrl',
            bindToController: true,
            link: function (scope, el, attrs, ctrl) {
                var filters = {status: 'published', published: true};
                if (ctrl.partition) filters.partition = ctrl.partition;
                if (ctrl.blogType) filters.blogType = ctrl.blogType;
                if (!ctrl.multilingual) filters.locale = 'default';

                var settings = {
                    settings: 'blog',
                    filters: filters
                };
                if(ctrl.count) settings.subset = {count:parseInt(ctrl.count)};

                scope.searchCtrl.init(settings);
            }
        };
    }

    function BinBlogAddArticleButtonDirective($templateCache, topics, activeUserHasPermission) {
        return {
            restrict: 'E',
            scope: {
                blogType: '@'
            },
            require: ['^^binBlog', '^^?binBlogPreviews'],
            template: $templateCache.get('bin-blog-add-article-button.html'),
            link: function (scope, el, attrs, ctrl) {
                var blog = ctrl[0];
                var previews = ctrl[1];

                if (previews) {
                    scope.$watchCollection(function () {
                        return previews.results;
                    }, function (results) {
                        if (results) scope.first = results.length == 0;
                    });
                }

                topics(scope, 'edit.mode', function (editModeActive) {
                    scope.editing = editModeActive;
                });

                activeUserHasPermission({
                    no: function () {
                        scope.permitted = false;
                    },
                    yes: function () {
                        scope.permitted = true;
                    },
                    scope: scope
                }, 'catalog.item.add');

                blog.isAllowed().then(function (allowed) {
                    scope.allowed = allowed;

                    if(!allowed) {
                        blog.getMainLocale().then(function (locale) {
                            scope.mainLocale = locale;
                        });
                    }
                });

                scope.addArticle = function () {
                    scope.working = true;
                    blog.addArticle(scope.blogType).finally(function () {
                        scope.working = false;
                    });
                };
            }
        };
    }

    function BinBlogDraftsDirective($templateCache, topics, activeUserHasPermission) {
        return {
            restrict: 'E',
            scope: {},
            require: '^^binBlog',
            template: $templateCache.get('bin-blog-drafts.html'),
            link: function (scope, el, attrs, ctrl) {
                scope.partition = ctrl.partition;
                if (!ctrl.multilingual) scope.locale = 'default';

                topics(scope, 'edit.mode', function (editModeActive) {
                    scope.editing = editModeActive;
                });

                activeUserHasPermission({
                    no: function () {
                        scope.permitted = false;
                    },
                    yes: function () {
                        scope.permitted = true;
                    },
                    scope: scope
                }, 'blog.drafts.view');

                ctrl.isAllowed().then(function (allowed) {
                    scope.allowed = allowed;
                });
            }
        };
    }
})();