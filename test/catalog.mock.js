angular.module('catalog', [])
    .factory('addCatalogItem', function () {
        return jasmine.createSpy('addCatalogItem');
    });