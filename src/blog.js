(function () {
    angular.module('blog', ['ngRoute', 'config', 'blog.controllers', 'i18n', 'catalog', 'momentx', 'toggle.edit.mode',
        'angular.usecase.adapter', 'bin.edit', 'notifications', 'binarta-checkpointjs-angular1', 'binarta-applicationjs-angular1'])
        .config(['$routeProvider', 'configProvider', function ($routeProvider, configProvider) {
            $routeProvider
                .when('/add/blog', {templateUrl: 'partials/blog/add.html'})
                .when('/:locale/add/blog', {templateUrl: 'partials/blog/add.html'})
                .when('/blog/add', {templateUrl: 'partials/blog/add.html'})
                .when('/:locale/blog/add', {templateUrl: 'partials/blog/add.html'})
                .when('/blog', {templateUrl: 'partials/blog/index.html'})
                .when('/:locale/blog', {templateUrl: 'partials/blog/index.html'})
                .when('/blog/:blogType', {
                    templateUrl: 'partials/blog/index.html',
                    controller: ['$scope', '$routeParams', BlogTypeController]
                })
                .when('/:locale/blog/:blogType', {
                    templateUrl: 'partials/blog/index.html',
                    controller: ['$scope', '$routeParams', BlogTypeController]
                });

            configProvider.add({
                searchSettings: {
                    blog: {
                        entity: 'catalog-item',
                        context: 'search',
                        filters: {
                            type: 'blog',
                            sortings: [
                                {on: 'publicationTime', orientation: 'desc'}
                            ]
                        },
                        autosearch: true,
                        subset: {count: 12},
                        noMoreResultsNotification: false
                    }
                }
            });
        }])
        .component('binBlog', new BinBlogComponent())
        .component('binBlogAddArticleButton', new BinBlogAddArticleButtonComponent())
        .component('binBlogDrafts', new BinBlogDraftsComponent())
        .directive('binBlogPreviews', BinBlogPreviewsDirective)
        .run(['binarta', '$rootScope', 'editModeRenderer', '$templateCache', InstallPublicationTimePrompt]);

    angular.module('blog.controllers', ['blog.types'])
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

        function publish() {
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

    function BinBlogComponent() {
        this.bindings = {
            partition: '@',
            blogType: '@',
            multilingual: '@',
            count: '@'
        };

        this.controller = ['$routeParams', 'i18n', function ($routeParams, i18n) {
            var self = this;
            self.partition = self.partition || '/blog/';
            self.blogType = self.blogType || $routeParams.blogType;

            this.isAllowed = function (callback) {
                if (self.multilingual) callback(true);
                else {
                    i18n.getMainLanguage().then(function (mainLocale) {
                        i18n.getExternalLocale().then(function (externalLocale) {
                            callback(mainLocale == externalLocale);
                        }, function () {
                            callback(true);
                        });
                    });
                }
            };
        }];
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
                if (ctrl.count) settings.subset = {count: parseInt(ctrl.count)};

                scope.searchCtrl.init(settings);
            }
        };
    }

    function BinBlogAddArticleButtonComponent() {
        this.templateUrl = 'bin-blog-add-article-button.html';

        this.require = {
            blogCtrl: '^^binBlog'
        };

        this.bindings = {
            blogType: '@'
        };

        this.controller = ['topicRegistry', 'binarta', 'addCatalogItem', function (topics, binarta, addCatalogItem) {
            var $ctrl = this,
                profile = binarta.checkpoint.profile,
                profileObserver;

            this.$onInit = function () {
                profileObserver = profile.eventRegistry.observe({
                    signedin: checkPermission,
                    signedout: reset
                });

                function checkPermission() {
                    profile.hasPermission('catalog.item.add') ? isPermitted() : reset();
                }

                checkPermission();
            };

            function isPermitted() {
                $ctrl.permitted = true;
                listenForEditModeEvent();
                $ctrl.blogCtrl.isAllowed(function (allowed) {
                    $ctrl.allowed = allowed;
                    if (allowed) $ctrl.addArticle = addArticle;
                    else {
                        $ctrl.addArticle = dummy;
                        $ctrl.primaryLanguage = binarta.application.primaryLanguage();
                    }
                });
            }

            function addArticle() {
                $ctrl.working = true;

                var item = {
                    type: 'blog',
                    blogType: $ctrl.blogType || $ctrl.blogCtrl.blogType || 'blog',
                    partition: $ctrl.blogCtrl.partition
                };
                item.locale = $ctrl.blogCtrl.multilingual ? binarta.application.localeForPresentation() : item.locale = 'default';

                addCatalogItem({item: item, redirectToView: true, editMode: true});
            }

            function listenForEditModeEvent() {
                topics.subscribe('edit.mode', editModeListener);
            }

            function editModeListener(editModeActive) {
                $ctrl.editing = editModeActive;
            }

            function reset() {
                $ctrl.permitted = false;
                $ctrl.addArticle = dummy;
                topics.unsubscribe('edit.mode', editModeListener);
            }

            function dummy() {
            }

            this.$onDestroy = function () {
                reset();
                profileObserver.disconnect();
            };
        }];
    }

    function BinBlogDraftsComponent() {
        this.templateUrl = 'bin-blog-drafts.html';

        this.require = {
            blogCtrl: '^^binBlog'
        };

        this.controller = ['topicRegistry', 'binarta', function (topics, binarta) {
            var $ctrl = this,
                profileObserver;

            this.$onInit = function () {
                profileObserver = binarta.checkpoint.profile.eventRegistry.observe({
                    signedin: checkPermission,
                    signedout: reset
                });

                function checkPermission() {
                    binarta.checkpoint.profile.hasPermission('blog.drafts.view') ? isPermitted() : reset();
                }

                checkPermission();
            };

            function isPermitted() {
                $ctrl.permitted = true;
                listenForEditModeEvent();
                $ctrl.blogCtrl.isAllowed(function (allowed) {
                    $ctrl.allowed = allowed;
                    $ctrl.partition = $ctrl.blogCtrl.partition;
                    if (!$ctrl.blogCtrl.multilingual) $ctrl.locale = 'default';
                });
            }

            function listenForEditModeEvent() {
                topics.subscribe('edit.mode', editModeListener);
            }

            function editModeListener(editModeActive) {
                $ctrl.editing = editModeActive;
            }

            function reset() {
                $ctrl.permitted = false;
                topics.unsubscribe('edit.mode', editModeListener);
            }

            this.$onDestroy = function () {
                reset();
                profileObserver.disconnect();
            };
        }];
    }

    function InstallPublicationTimePrompt(binarta, $scope, editModeRenderer, $templateCache) {
        binarta.schedule(function() {
            binarta.publisher.ui.promptForPublicationTime = function (response, timestamp) {
                var scope = $scope.$new();
                scope.publicationTime = timestamp ? moment(timestamp) : moment();

                scope.submit = function () {
                    editModeRenderer.close();
                    response.success(scope.publicationTime);
                };

                scope.cancel = function () {
                    editModeRenderer.close();
                    response.cancel();
                };

                editModeRenderer.open({
                    template: $templateCache.get('bin-blog-update-status.html'),
                    scope: scope
                });
            };
        });
    }
})();