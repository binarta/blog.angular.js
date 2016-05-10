describe('blog', function () {
    var scope, ctrl;

    beforeEach(module('blog.controllers'));
    beforeEach(module('blog'));
    angular.module('angularx', []);
    angular.module('angularMoment', []);

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

    describe('BlogTypesController', function () {
        beforeEach(inject(function ($controller) {
            ctrl = $controller(BlogTypesController, {$scope: scope})
        }));

        it('should expose blog types on scope', inject(function (blogTypesLoader) {
            expect(scope.blogTypes).toEqual(blogTypesLoader());
        }));
    });

    describe('BlogTypeController', function () {
        var blogType = 'foo';

        beforeEach(inject(function ($controller) {
            ctrl = $controller(BlogTypeController, {$scope: scope, $routeParams: {blogType: blogType}})
        }));

        it('should expose blog type on scope', function () {
            expect(scope.blogType).toEqual(blogType);
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