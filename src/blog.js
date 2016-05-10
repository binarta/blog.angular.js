(function () {
    angular.module('blog', ['ngRoute', 'config', 'blog.controllers', 'i18n', 'catalog', 'angularMoment'])
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
                                {on:'creationTime', orientation:'desc'}
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
        self.blogType = self.blogType || $routeParams.blogType || 'blog';

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
                blogType: blogType || self.blogType,
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
                var filters = {status: 'published'};
                if (ctrl.partition) filters.partition = ctrl.partition;
                if (ctrl.blogType) filters.blogType = ctrl.blogType;
                if (!ctrl.multilingual) filters.locale = 'default';

                var settings = {
                    settings: 'blog',
                    filters: filters
                };
                if(ctrl.count) settings.subset = {count:ctrl.count};

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