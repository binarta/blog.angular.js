angular.module('test.module', ['blog.types'])
    .controller('AddBlogController', addBlogControllerConfig);

angular.module('blog.types', [])
    .factory('blogTypesLoader', BlogTypeLoaderStubFactory);

describe('blog', function () {
    var scope, ctrl;

    beforeEach(module('test.module'));
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

function BlogTypeLoaderStubFactory() {
    return function() {
        return ['blog-type-1', 'blog-type-2'];
    }
}