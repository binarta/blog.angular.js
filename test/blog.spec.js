describe('blog', function () {
    var scope, ctrl;

    beforeEach(module('blog.controllers'));
    beforeEach(module('blog'));
    angular.module('angularx', []);

    beforeEach(function () {
        scope = {};
    });

    describe('AddBlogController', function () {
        beforeEach(inject(function ($controller) {
            ctrl = $controller(AddBlogController, {$scope: scope})
        }));

        it('should expose blog types on scope', inject(function (blogTypesLoader) {
            expect(scope.blogTypes).toEqual(blogTypesLoader());
        }));
    });

    describe('blog-template directive', function () {
        var html, scope, directive, templateSpy, templateArgs;

        beforeEach(inject(function ($rootScope) {
            scope = $rootScope.$new();
            templateArgs = {};
            templateSpy = {
                setTemplateUrl: function(args) {
                    templateArgs = args;
                }
            };
            directive = new BlogTemplateService(templateSpy);
        }));

        it('restricted to attribute', function () {
            expect(directive.restrict).toEqual('A');
        });

        it('creates a child scope', function () {
            expect(directive.scope).toEqual(true);
        });

        it('template', function () {
            expect(directive.template).toEqual('<div ng-include="templateUrl"></div>');
        });

        describe('on link', function () {
            describe('set template settings to scope', function () {
                beforeEach(function () {
                    directive.link(scope, null, {
                        settings: '{setting: true}'
                    });
                });

                it('should be on scope', function () {
                    expect(scope.settings).toEqual({setting: true});
                });
            });

            describe('with template', function () {
                beforeEach(function () {
                    directive.link(scope, null, {
                        blogTemplate: 'template'
                    });
                });

                it('setTemplateUrl is called', function () {
                    expect(templateArgs).toEqual({
                        scope: scope,
                        module: 'blog',
                        name: 'template.html',
                        permission: undefined
                    });
                });
            });

            describe('drafts', function () {
                beforeEach(function () {
                    directive.link(scope, null, {
                        blogTemplate: 'drafts'
                    });
                });

                it('setTemplateUrl is called', function () {
                    expect(templateArgs).toEqual({
                        scope: scope,
                        module: 'blog',
                        name: 'drafts.html',
                        permission: 'blog.drafts.view'
                    });
                });
            });

            describe('add', function () {
                beforeEach(function () {
                    directive.link(scope, null, {
                        blogTemplate: 'add'
                    });
                });

                it('setTemplateUrl is called', function () {
                    expect(templateArgs).toEqual({
                        scope: scope,
                        module: 'blog',
                        name: 'add.html',
                        permission: 'catalog.item.add'
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