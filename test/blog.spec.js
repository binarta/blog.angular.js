describe('blog', function () {
    var scope, ctrl, config, $rootScope, i18n, $q, moment;

    beforeEach(module('blog.controllers'));
    beforeEach(module('blog'));

    beforeEach(inject(function (_config_, _$rootScope_, _i18n_, _$q_, _moment_) {
        config = _config_;
        $rootScope = _$rootScope_;
        i18n = _i18n_;
        $q = _$q_;
        moment = _moment_;
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
                        {on:'publicationTime', orientation:'desc'}
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

        it('do not use a blogType by default', function () {
            expect(ctrl.blogType).toBeUndefined();
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
                i18n.getMainLanguage.and.returnValue(mainLocale.promise);
                i18n.getExternalLocale.and.returnValue(externalLocale.promise);
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
                addCatalogItem.and.returnValue('return');
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

    describe('BinBlogPostController', function () {
        var editModeRenderer, updateCatalogItem;

        beforeEach(inject(function ($controller, _editModeRenderer_, _updateCatalogItem_) {
            editModeRenderer = _editModeRenderer_;
            updateCatalogItem = _updateCatalogItem_;
            scope = $rootScope.$new();

            ctrl = $controller('BinBlogPostController', {
                $scope: scope
            });
        }));

        describe('with item in draft', function () {
            var item;

            beforeEach(function () {
                item = {
                    id: 'id',
                    type: 'blog',
                    blogType: 'blogType',
                    status: 'draft'
                };

                ctrl.init(item);
            });

            describe('on updateStatus', function () {
                var currentTime;

                beforeEach(function () {
                    currentTime = moment();

                    ctrl.updateStatus();
                });

                it('editModeRenderer is opened', function () {
                    expect(editModeRenderer.open).toHaveBeenCalled();
                });

                describe('with renderer scope', function () {
                    beforeEach(function () {
                        scope = editModeRenderer.open.calls.first().args[0].scope;
                    });

                    it('publication time is on scope and set to current date and time', function () {
                        expect(scope.publicationTime).toEqual(currentTime);
                    });

                    describe('on submit', function () {
                        var newTime = 'May 31, 2016 10:00 AM';

                        beforeEach(function () {
                            scope.publicationTime = newTime;

                            scope.submit();
                        });

                        it('handle with usecase adapter', function () {
                            updateCatalogItem.calls.first().args[0].start();
                            expect(scope.working).toBeTruthy();

                            updateCatalogItem.calls.first().args[0].stop();
                            expect(scope.working).toBeFalsy();
                        });

                        it('update catalog item', function () {
                            expect(updateCatalogItem.calls.first().args[0].data).toEqual({
                                id: item.id,
                                type: item.type,
                                blogType: item.blogType,
                                context: 'update',
                                status: 'published',
                                publicationTime: moment(newTime, 'lll').format()
                            });
                        });

                        describe('on success', function () {
                            beforeEach(function () {
                                updateCatalogItem.calls.first().args[0].success();
                            });

                            it('update item', function () {
                                expect(ctrl.item.status).toEqual('published');
                                expect(ctrl.item.publicationTime).toEqual(moment(newTime, 'lll').format());
                            });

                            it('close editMode renderer', function () {
                                expect(editModeRenderer.close).toHaveBeenCalled();
                            });

                            it('calling updateStatus again unPublishes the item', function () {
                                ctrl.updateStatus();

                                expect(updateCatalogItem.calls.mostRecent().args[0].data).toEqual({
                                    id: item.id,
                                    type: item.type,
                                    blogType: item.blogType,
                                    context: 'update',
                                    status: 'draft'
                                });
                            });
                        });
                    });

                    it('on cancel', function () {
                        scope.cancel();

                        expect(editModeRenderer.close).toHaveBeenCalled();
                    });
                });
            });
        });

        describe('with item in draft and previous publication time', function () {
            var item;
            var time = '2016-05-31T08:00:00Z';

            beforeEach(function () {
                item = {
                    id: 'id',
                    type: 'blog',
                    blogType: 'blogType',
                    status: 'draft',
                    publicationTime: time
                };

                ctrl.init(item);
            });

            describe('on updateStatus', function () {

                beforeEach(function () {
                    ctrl.updateStatus();
                    scope = editModeRenderer.open.calls.first().args[0].scope;
                });

                it('publication time is on scope', function () {
                    expect(scope.publicationTime).toEqual(moment(time));
                });
            });
        });

        describe('with publisched item', function () {
            var item;
            var time = '2016-05-31T08:00:00Z';

            beforeEach(function () {
                item = {
                    id: 'id',
                    type: 'blog',
                    blogType: 'blogType',
                    status: 'published',
                    publicationTime: time
                };

                ctrl.init(item);
            });

            describe('on updateStatus', function () {
                beforeEach(function () {
                    ctrl.updateStatus();
                });

                it('unPublishe the item', function () {
                    expect(updateCatalogItem.calls.first().args[0].data).toEqual({
                        id: item.id,
                        type: item.type,
                        blogType: item.blogType,
                        context: 'update',
                        status: 'draft'
                    });
                });

                describe('on success', function () {
                    beforeEach(function () {
                        updateCatalogItem.calls.first().args[0].success();
                    });

                    it('update item', function () {
                        expect(ctrl.item.status).toEqual('draft');
                    });

                    it('calling updateStatus again opens the editMode renderer for publishing the item', function () {
                        ctrl.updateStatus();

                        expect(editModeRenderer.open).toHaveBeenCalled();
                    });
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