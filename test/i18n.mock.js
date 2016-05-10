angular.module('i18n', [])
    .service('i18n', function () {
        this.getMainLanguage = jasmine.createSpy('getMainLanguage');
        this.getExternalLocale = jasmine.createSpy('getExternalLocale');
    });