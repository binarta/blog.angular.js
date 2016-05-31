module.exports = function(config) {
    config.set({
        basePath:'../',
        frameworks:['jasmine'],
        files:[
            {pattern:'bower_components/angular/angular.js'},
            {pattern:'bower_components/angular-route/angular-route.js'},
            {pattern:'bower_components/angular-mocks/angular-mocks.js'},
            {pattern:'bower_components/binarta.momentx.angular/src/momentx.js'},
            {pattern:'bower_components/moment/moment.js'},
            {pattern:'bower_components/angular-moment/angular-moment.js'},
            {pattern:'bower_components/binarta.usecase.adapter.angular/src/angular.usecase.adapter.js'},
            {pattern:'src/blog.js'},
            {pattern:'test/**/*.js'}
        ],
        browsers:['PhantomJS']
    });
};