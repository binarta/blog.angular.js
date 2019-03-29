describe('blog', function () {
    var scope, ctrl, config, $rootScope, i18n, $q, moment, $compile, binarta, topicRegistry;

    beforeEach(module('blog.templates'));
    beforeEach(module('blog.controllers'));
    beforeEach(module('blog'));

    beforeEach(inject(function (_config_, _$rootScope_, _i18n_, _$q_, _moment_, _$compile_, _binarta_, _topicRegistry_) {
        config = _config_;
        $rootScope = _$rootScope_;
        i18n = _i18n_;
        $q = _$q_;
        moment = _moment_;
        $compile = _$compile_;
        binarta = _binarta_;
        topicRegistry = _topicRegistry_;
        scope = {};
    }));

    it('blog searchSettings are in config', function () {
        expect(config.searchSettings).toEqual({
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

    describe('BinBlog component', function () {
        beforeEach(inject(function ($componentController) {
            ctrl = $componentController('binBlog');
        }));

        it('default partition', function () {
            expect(ctrl.partition).toEqual('/blog/');
        });

        it('do not use a blogType by default', function () {
            expect(ctrl.blogType).toBeUndefined();
        });

        it('when blogType is in routeParams', inject(function ($routeParams, $componentController) {
            $routeParams.blogType = 'type';
            var newCtrl = $componentController('binBlog');

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
                    ctrl.isAllowed(function (check) {
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
                    ctrl.isAllowed(function (check) {
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
                    ctrl.isAllowed(function (check) {
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
                    ctrl.isAllowed(function (check) {
                        allowed = check;
                    });

                    $rootScope.$digest();

                    expect(allowed).toEqual(false);
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

    describe('binBlogAddArticleButton component', function () {
        var $ctrl, addCatalogItem, blogCtrl;

        beforeEach(inject(function ($componentController, _addCatalogItem_) {
            binarta.application.setProfile({supportedLanguages: ['N', 'E']});
            binarta.application.setLocaleForPresentation('E');
            addCatalogItem = _addCatalogItem_;
            blogCtrl = {
                partition: 'partition',
                blogType: 'blog-type',
                isAllowed: jasmine.createSpy('isAllowed'),
                addArticle: jasmine.createSpy('addArticle')
            };
            $ctrl = $componentController('binBlogAddArticleButton', null, {blogCtrl: blogCtrl});
        }));

        describe('and user has no permission', function () {
            beforeEach(function () {
                binarta.checkpoint.registrationForm.submit({username: 'u', password: 'p'});
                $ctrl.$onInit();
            });

            it('is not permitted', function () {
                expect($ctrl.permitted).toBeFalsy();
            });

            it('add article does nothing', function () {
                $ctrl.addArticle();
                expect(blogCtrl.addArticle).not.toHaveBeenCalled();
            });

            describe('on destroy', function () {
                beforeEach(function () {
                    blogCtrl.isAllowed.calls.reset();
                    $ctrl.$onDestroy();
                });

                it('profile observer is disconnected', function () {
                    binarta.checkpoint.profile.signout();
                    binarta.checkpoint.signinForm.submit({username: 'u', password: 'p'});
                    expect(blogCtrl.isAllowed).not.toHaveBeenCalled();
                });
            });
        });

        describe('and user has catalog.item.add permission', function () {
            beforeEach(function () {
                binarta.checkpoint.gateway.addPermission('catalog.item.add');
                binarta.checkpoint.registrationForm.submit({username: 'u', password: 'p'});
                $ctrl.$onInit();
            });

            it('is permitted', function () {
                expect($ctrl.permitted).toBeTruthy();
            });

            it('listens to edit-mode changes', function () {
                expect(topicRegistry.subscribe).toHaveBeenCalledWith('edit.mode', jasmine.any(Function));
                topicRegistry.subscribe.calls.argsFor(0)[1](true);
                expect($ctrl.editing).toBeTruthy();
                topicRegistry.subscribe.calls.argsFor(0)[1](false);
                expect($ctrl.editing).toBeFalsy();
            });

            it('check if adding new article is allowed', function () {
                expect(blogCtrl.isAllowed).toHaveBeenCalled();
            });

            describe('when adding is not allowed', function () {
                beforeEach(function () {
                    blogCtrl.isAllowed.calls.mostRecent().args[0](false);
                });

                it('is not allowed', function () {
                    expect($ctrl.allowed).toBeFalsy();
                });

                it('primary language is available', function () {
                    expect($ctrl.primaryLanguage).toEqual('N');
                });

                it('add article does nothing', function () {
                    $ctrl.addArticle();
                    expect(blogCtrl.addArticle).not.toHaveBeenCalled();
                });
            });

            describe('when adding is allowed', function () {
                beforeEach(function () {
                    blogCtrl.isAllowed.calls.mostRecent().args[0](true);
                });

                it('is allowed', function () {
                    expect($ctrl.allowed).toBeTruthy();
                });

                describe('on add article', function () {
                    it('with default settings', function () {
                        $ctrl.addArticle();
                        expect(addCatalogItem).toHaveBeenCalledWith({
                            item: {
                                type: 'blog',
                                blogType: 'blog-type',
                                partition: 'partition',
                                locale: 'default'
                            },
                            redirectToView: true,
                            editMode: true
                        });
                    });

                    it('with custom blogType', function () {
                        $ctrl.blogType = 'custom';
                        $ctrl.addArticle();
                        expect(addCatalogItem).toHaveBeenCalledWith({
                            item: {
                                type: 'blog',
                                blogType: 'custom',
                                partition: 'partition',
                                locale: 'default'
                            },
                            redirectToView: true,
                            editMode: true
                        });
                    });

                    it('use fallback blog-type when non is given', function () {
                        $ctrl.blogType = undefined;
                        $ctrl.blogCtrl.blogType = undefined;
                        $ctrl.addArticle();
                        expect(addCatalogItem).toHaveBeenCalledWith({
                            item: {
                                type: 'blog',
                                blogType: 'blog',
                                partition: 'partition',
                                locale: 'default'
                            },
                            redirectToView: true,
                            editMode: true
                        });
                    });

                    it('when blog is multilingual', function () {
                        $ctrl.blogCtrl.multilingual = true;
                        $ctrl.addArticle();
                        expect(addCatalogItem).toHaveBeenCalledWith({
                            item: {
                                type: 'blog',
                                blogType: 'blog-type',
                                partition: 'partition',
                                locale: 'E'
                            },
                            redirectToView: true,
                            editMode: true
                        });
                    });
                });
            });

            describe('when signed out', function () {
                beforeEach(function () {
                    binarta.checkpoint.profile.signout();
                });

                it('is not permitted', function () {
                    expect($ctrl.permitted).toBeFalsy();
                });

                it('edit-mode listener is unsubscribed', function () {
                    var listener = topicRegistry.subscribe.calls.mostRecent().args[1];
                    expect(topicRegistry.unsubscribe).toHaveBeenCalledWith('edit.mode', listener);
                });

                it('add article does nothing', function () {
                    $ctrl.addArticle();
                    expect(blogCtrl.addArticle).not.toHaveBeenCalled();
                });
            });

            describe('on destroy', function () {
                beforeEach(function () {
                    blogCtrl.isAllowed.calls.reset();
                    $ctrl.$onDestroy();
                });

                it('edit-mode listener is unsubscribed', function () {
                    var listener = topicRegistry.subscribe.calls.mostRecent().args[1];
                    expect(topicRegistry.unsubscribe).toHaveBeenCalledWith('edit.mode', listener);
                });

                it('profile observer is disconnected', function () {
                    binarta.checkpoint.profile.signout();
                    binarta.checkpoint.signinForm.submit({username: 'u', password: 'p'});
                    expect(blogCtrl.isAllowed).not.toHaveBeenCalled();
                });
            });
        });
    });

    describe('binBlogDrafts component', function () {
        var $ctrl, blogCtrl;

        beforeEach(inject(function ($componentController) {
            blogCtrl = {
                partition: 'partition',
                blogType: 'blog-type',
                isAllowed: jasmine.createSpy('isAllowed')
            };
            $ctrl = $componentController('binBlogDrafts', null, {blogCtrl: blogCtrl});
        }));

        describe('and user has no permission', function () {
            beforeEach(function () {
                binarta.checkpoint.registrationForm.submit({username: 'u', password: 'p'});
                $ctrl.$onInit();
            });

            it('is not permitted', function () {
                expect($ctrl.permitted).toBeFalsy();
            });

            describe('on destroy', function () {
                beforeEach(function () {
                    blogCtrl.isAllowed.calls.reset();
                    $ctrl.$onDestroy();
                });

                it('profile observer is disconnected', function () {
                    binarta.checkpoint.profile.signout();
                    binarta.checkpoint.signinForm.submit({username: 'u', password: 'p'});
                    expect(blogCtrl.isAllowed).not.toHaveBeenCalled();
                });
            });
        });

        describe('and user has blog.drafts.view permission', function () {
            beforeEach(function () {
                binarta.checkpoint.gateway.addPermission('blog.drafts.view');
                binarta.checkpoint.registrationForm.submit({username: 'u', password: 'p'});
                $ctrl.$onInit();
            });

            it('is permitted', function () {
                expect($ctrl.permitted).toBeTruthy();
            });

            it('listens to edit-mode changes', function () {
                expect(topicRegistry.subscribe).toHaveBeenCalledWith('edit.mode', jasmine.any(Function));
                topicRegistry.subscribe.calls.argsFor(0)[1](true);
                expect($ctrl.editing).toBeTruthy();
                topicRegistry.subscribe.calls.argsFor(0)[1](false);
                expect($ctrl.editing).toBeFalsy();
            });

            it('check if viewing drafts is allowed', function () {
                expect(blogCtrl.isAllowed).toHaveBeenCalled();
            });

            describe('when viewing drafts is not allowed', function () {
                beforeEach(function () {
                    blogCtrl.isAllowed.calls.mostRecent().args[0](false);
                });

                it('is not allowed', function () {
                    expect($ctrl.allowed).toBeFalsy();
                });
            });

            describe('when viewing drafts is allowed', function () {
                beforeEach(function () {
                    blogCtrl.isAllowed.calls.mostRecent().args[0](true);
                });

                it('is allowed', function () {
                    expect($ctrl.allowed).toBeTruthy();
                });

                it('partition is available on controller', function () {
                    expect($ctrl.partition).toEqual('partition');
                });

                it('use default locale by default', function () {
                    expect($ctrl.locale).toEqual('default');
                });
            });

            describe('when blog is multilingual', function () {
                beforeEach(function () {
                    blogCtrl.multilingual = true;
                });

                describe('and viewing drafts is allowed', function () {
                    beforeEach(function () {
                        blogCtrl.isAllowed.calls.mostRecent().args[0](true);
                    });

                    it('do not override locale', function () {
                        expect($ctrl.locale).toBeUndefined();
                    });
                });
            });

            describe('when signed out', function () {
                beforeEach(function () {
                    binarta.checkpoint.profile.signout();
                });

                it('is not permitted', function () {
                    expect($ctrl.permitted).toBeFalsy();
                });

                it('edit-mode listener is unsubscribed', function () {
                    var listener = topicRegistry.subscribe.calls.mostRecent().args[1];
                    expect(topicRegistry.unsubscribe).toHaveBeenCalledWith('edit.mode', listener);
                });
            });

            describe('on destroy', function () {
                beforeEach(function () {
                    blogCtrl.isAllowed.calls.reset();
                    $ctrl.$onDestroy();
                });

                it('edit-mode listener is unsubscribed', function () {
                    var listener = topicRegistry.subscribe.calls.mostRecent().args[1];
                    expect(topicRegistry.unsubscribe).toHaveBeenCalledWith('edit.mode', listener);
                });

                it('profile observer is disconnected', function () {
                    binarta.checkpoint.profile.signout();
                    binarta.checkpoint.signinForm.submit({username: 'u', password: 'p'});
                    expect(blogCtrl.isAllowed).not.toHaveBeenCalled();
                });
            });
        });
    });
});

angular.module('blog.types', [])
    .factory('blogTypesLoader', BlogTypeLoaderStubFactory);

function BlogTypeLoaderStubFactory() {
    return function () {
        return ['blog-type-1', 'blog-type-2'];
    }
}