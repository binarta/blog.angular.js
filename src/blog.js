angular.module('blog', ['ngRoute', 'blog.controllers', 'angularx'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/add/blog', {templateUrl:'partials/blog/add.html'})
            .when('/:locale/add/blog', {templateUrl: 'partials/blog/add.html'})
            .when('/blog/add', {templateUrl: 'partials/blog/add.html'})
            .when('/:locale/blog/add', {templateUrl: 'partials/blog/add.html'})
            .when('/blog', {templateUrl:'partials/blog/index.html'})
            .when('/:locale/blog', {templateUrl:'partials/blog/index.html'})
            .when('/blog/:blogType', {templateUrl:'partials/blog/index.html', controller: BlogTypeController})
            .when('/:locale/blog/:blogType', {templateUrl:'partials/blog/index.html', controller: BlogTypeController})
    }])
    .directive('blogTemplate', ['binTemplate', BlogTemplateService]);

angular.module('blog.controllers', ['blog.types'])
    .controller('AddBlogController', ['$scope', 'blogTypesLoader', AddBlogController])
    .controller('BlogTypesController', ['$scope', 'blogTypesLoader', BlogTypesController]);

function AddBlogController($scope, blogTypesLoader) {
    $scope.blogTypes = blogTypesLoader();
}

function BlogTypesController($scope, blogTypesLoader) {
    $scope.blogTypes = blogTypesLoader();
}

function BlogTypeController($scope, $routeParams) {
    $scope.blogType = $routeParams.blogType;
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