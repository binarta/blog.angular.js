angular.module('blog', ['ngRoute', 'blog.controllers'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/:locale/media/blog', {templateUrl:'partials/blog/index.html'});
    }]);

angular.module('blog.controllers', ['blog.types'])
    .controller('AddBlogController', ['$scope', 'blogTypesLoader', AddBlogController]);

function AddBlogController($scope, blogTypesLoader) {
    $scope.blogTypes = blogTypesLoader();
}