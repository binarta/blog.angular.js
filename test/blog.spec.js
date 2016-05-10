describe('blog', function () {
    var scope, ctrl, config, $rootScope, i18n, $q;

    beforeEach(module('blog.controllers'));
    beforeEach(module('blog'));
    angular.module('angularMoment', []);

    beforeEach(inject(function (_config_, _$rootScope_, _i18n_, _$q_) {
        config = _config_;
        $rootScope = _$rootScope_;
        i18n = _i18n_;
        $q = _$q_;
        scope = {};
    }));

    it('blog searchSettings are in config', function () {
        expect(config.searchSettings).toEqual({
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
        });
    });

    describe('AddBlogController', function () {
        beforeEach(inject(function ($controller) {
            ctrl = $controller('AddBlogController', {$scope: scope})
        }));

        it('should expose blog types on scope', inject(function (blogTypesLoader) {
            expect(scope.blogTypes).toEqual(blogTypesLoader());
        }));
    });

    describe('BlogTypesController', function () {
        beforeEach(inject(function ($controller) {
            ctrl = $controller('BlogTypesController', {$scope: scope})
        }));

        it('should expose blog types on scope', inject(function (blogTypesLoader) {
            expect(scope.blogTypes).toEqual(blogTypesLoader());
        }));
    });

    describe('BlogTypeController', function () {
        var blogType = 'foo';

        beforeEach(inject(function ($controller) {
            ctrl = $controller('BlogTypeController', {$scope: scope, $routeParams: {blogType: blogType}})
        }));

        it('should expose blog type on scope', function () {
            expect(scope.blogType).toEqual(blogType);
        });
    });
    
    describe('BinBlogController', function () {
        var addCatalogItem;

        beforeEach(inject(function ($controller, _addCatalogItem_) {
            addCatalogItem = _addCatalogItem_;

            ctrl = $controller('BinBlogController');
        }));
        
        it('default partition', function () {
            expect(ctrl.partition).toEqual('/blog/');
        });

        it('default blogType', function () {
            expect(ctrl.blogType).toEqual('blog');
        });

        it('when blogType is in routeParams', inject(function ($routeParams, $controller) {
            $routeParams.blogType = 'type';
            var newCtrl = $controller('BinBlogController');

            expect(newCtrl.blogType).toEqual('type');
        }));

        describe('check if clerk actions are allowed in current locale', function () {
            var allowed, mainLocale, externalLocale;

            beforeEach(function () {
                allowed = undefined;
                mainLocale = $q.defer();
                externalLocale = $q.defer();
                i18n.getMainLanguage.andReturn(mainLocale.promise);
                i18n.getExternalLocale.andReturn(externalLocale.promise);
            });

            describe('when multilingualism is enabled', function () {
                beforeEach(function () {
                    ctrl.multilingual = true;
                });

                it('is allowed', function () {
                    ctrl.isAllowed().then(function (check) {
                        allowed = check;
                    });

                    $rootScope.$digest();

                    expect(allowed).toEqual(true);
                });
            });

            describe('when there is no external locale (and therefore no multilingualism)', function () {
                beforeEach(function () {
                    mainLocale.resolve('main');
                    externalLocale.reject();
                });

                it('is allowed', function () {
                    ctrl.isAllowed().then(function (check) {
                        allowed = check;
                    });

                    $rootScope.$digest();

                    expect(allowed).toEqual(true);
                });
            });

            describe('when main locale is the same as the external locale', function () {
                beforeEach(function () {
                    mainLocale.resolve('lang');
                    externalLocale.resolve('lang');
                });

                it('is allowed', function () {
                    ctrl.isAllowed().then(function (check) {
                        allowed = check;
                    });

                    $rootScope.$digest();

                    expect(allowed).toEqual(true);
                });
            });

            describe('when main locale is not the same as the external locale', function () {
                beforeEach(function () {
                    mainLocale.resolve('main');
                    externalLocale.resolve('lang');
                });

                it('is allowed', function () {
                    ctrl.isAllowed().then(function (check) {
                        allowed = check;
                    });

                    $rootScope.$digest();

                    expect(allowed).toEqual(false);
                });
            });
        });

        describe('add new article', function () {
            beforeEach(function () {
                addCatalogItem.andReturn('return');
            });

            it('with default settings', function () {
                ctrl.addArticle();

                expect(addCatalogItem).toHaveBeenCalledWith({
                    item: {
                        type: 'blog',
                        blogType: 'blog',
                        partition: '/blog/',
                        locale: 'default'
                    },
                    redirectToView: true,
                    editMode: true
                });
            });

            it('return value', function () {
                expect(ctrl.addArticle()).toEqual('return');
            });

            it('with partition', function () {
                ctrl.partition = '/partition/';

                ctrl.addArticle();

                expect(addCatalogItem).toHaveBeenCalledWith({
                    item: {
                        type: 'blog',
                        blogType: 'blog',
                        partition: '/partition/',
                        locale: 'default'
                    },
                    redirectToView: true,
                    editMode: true
                });
            });

            it('with blogType', function () {
                ctrl.blogType = 'type';

                ctrl.addArticle();

                expect(addCatalogItem).toHaveBeenCalledWith({
                    item: {
                        type: 'blog',
                        blogType: 'type',
                        partition: '/blog/',
                        locale: 'default'
                    },
                    redirectToView: true,
                    editMode: true
                });
            });

            it('with custom blogType', function () {
                ctrl.blogType = 'blog-type';

                ctrl.addArticle('type');

                expect(addCatalogItem).toHaveBeenCalledWith({
                    item: {
                        type: 'blog',
                        blogType: 'type',
                        partition: '/blog/',
                        locale: 'default'
                    },
                    redirectToView: true,
                    editMode: true
                });
            });
        });
    });
});

angular.module('blog.types', [])
    .factory('blogTypesLoader', BlogTypeLoaderStubFactory);

function BlogTypeLoaderStubFactory() {
    return function() {
        return ['blog-type-1', 'blog-type-2'];
    }
}