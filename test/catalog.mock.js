angular.module('catalog', [])
    .factory('addCatalogItem', function () {
        return jasmine.createSpy('addCatalogItem');
    })
    .factory('updateCatalogItem', function () {
        return jasmine.createSpy('updateCatalogItem');
    });