var addBlogControllerConfig = ['$scope', AddBlogController];

angular.module('blog', ['ngRoute', 'blog.types'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/:locale/media/blog', {templateUrl:'bower_components/blog.angular/partials/index.html', controller: addBlogControllerConfig});
    }]);

function AddBlogController($scope, blogTypesLoader) {
    $scope.blogTypes = blogTypesLoader();
}