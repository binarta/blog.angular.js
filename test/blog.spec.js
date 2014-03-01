describe('blog', function () {
    var scope, ctrl;

    beforeEach(module('blog.controllers'));
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
});

angular.module('blog.types', [])
    .factory('blogTypesLoader', BlogTypeLoaderStubFactory);

function BlogTypeLoaderStubFactory() {
    return function() {
        return ['blog-type-1', 'blog-type-2'];
    }
}