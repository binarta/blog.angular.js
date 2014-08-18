angular.module('blog', ['ngRoute', 'blog.controllers', 'angularx'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/blog', {templateUrl:'partials/blog/index.html'})
            .when('/:locale/blog', {templateUrl:'partials/blog/index.html'})
    }])
    .directive('blogTemplate', ['binTemplate', BlogTemplateService]);

angular.module('blog.controllers', ['blog.types'])
    .controller('AddBlogController', ['$scope', 'blogTypesLoader', AddBlogController]);

function AddBlogController($scope, blogTypesLoader) {
    $scope.blogTypes = blogTypesLoader();
}

function BlogTemplateService(binTemplate) {
    return {
        scope: true,
        restrict: 'A',
        template: '<div ng-include="templateUrl"></div>',
        link: function (scope, el, attrs) {
            if (attrs.settings) scope.settings = scope.$eval(attrs.settings);

            var permission;
            if (attrs.blogTemplate == 'drafts') permission = 'blog.drafts.view';
            if (attrs.blogTemplate == 'add') permission = 'catalog.item.add';

            binTemplate.setTemplateUrl({
                scope: scope,
                module: 'blog',
                name: attrs.blogTemplate + '.html',
                permission: permission
            });
        }
    };
}