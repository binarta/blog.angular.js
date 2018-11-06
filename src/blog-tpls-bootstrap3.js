angular.module("blog.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("bin-blog-add-article-button.html","<div class=\"bin-add-article-button\" ng-if=\"$ctrl.permitted && $ctrl.editing\"><button type=\"button\" class=\"bin-btn bin-btn-primary bin-btn-floated\" ng-disabled=\"$ctrl.working\" ng-if=\"$ctrl.allowed\" ng-click=\"$ctrl.addArticle()\" i18n=\"\" code=\"blog.article.add.new.button\" read-only=\"\" watch-on-code=\"\"><span ng-hide=\"$ctrl.working\"><i class=\"fa fa-plus fa-fw\"></i></span> <span ng-show=\"$ctrl.working\"><i class=\"fa fa-spinner fa-spin fa-fw\"></i></span> <span ng-bind=\"var\"></span></button><div class=\"alert alert-info\" ng-if=\"$ctrl.allowed == false\" i18n=\"\" code=\"blog.article.main.language.restriction.message\" read-only=\"\"><i class=\"fa fa-info-circle fa-fw\"></i> {{::var}} ({{$ctrl.primaryLanguage|toLanguageName}})</div></div>");
$templateCache.put("bin-blog-drafts.html","<div ng-if=\"$ctrl.allowed && $ctrl.permitted && $ctrl.editing\" ng-controller=\"BinartaSearchController as draftsCtrl\" ng-init=\"draftsCtrl.init({ settings: \'blog\', filters:{partition: $ctrl.partition, status: \'draft\', locale: $ctrl.locale}, subset:{count:20}})\"><div class=\"bin-blog bin-blog-drafts\" ng-if=\"draftsCtrl.results.length > 0\"><div class=\"panel panel-default\"><div class=\"panel-heading\" i18n=\"\" code=\"blog.drafts.title\" read-only=\"\" ng-bind=\"::var\"></div><div class=\"panel-body\"><div class=\"bin-draft\" ng-repeat=\"item in draftsCtrl.results track by item.id\"><div class=\"row\"><div class=\"col-xs-12\"><a i18n=\"\" read-only=\"\" no-locale=\"\" code=\"{{::item.id}}\" bin-href=\"{{::\'/view\' + item.id}}\" ng-bind=\"::var\"></a></div></div></div><div class=\"text-center\" ng-if=\"draftsCtrl.results.length >= 20\"><button type=\"button\" class=\"btn btn-link\" ng-click=\"draftsCtrl.searchForMore()\" ng-disabled=\"draftsCtrl.working\" i18n=\"\" code=\"button.view.older.articles\" read-only=\"\"><span ng-if=\"!draftsCtrl.working\"><i class=\"fa fa-arrow-circle-o-down fa-fw\"></i></span> <span ng-if=\"draftsCtrl.working\"><i class=\"fa fa-spinner fa-spin fa-fw\"></i></span> {{::var}}</button></div></div></div></div></div>");
$templateCache.put("bin-blog-previews.html","<article class=\"row bin-article\" ng-hide=\"(item.publicationTime | amDifference : null : \'minutes\') > 0 && !editing\" ng-repeat=\"item in searchCtrl.results track by item.id\" i18n=\"\" code=\"{{::item.id}}.body\" var=\"body\" read-only=\"\" no-locale=\"\"><div class=\"col-sm-4\"><div class=\"bin-article-image-wrapper\"><span ng-if=\"body != \'\' || editing\"><a bin-href=\"{{::\'/view\' + (item.localizedId || item.id)}}\"><img class=\"img-responsive\" bin-image=\"images{{::item.id}}/cover.img\" alt=\"blog post cover image\"></a></span> <span ng-if=\"body == \'\' && !editing\"><img class=\"img-responsive\" bin-image=\"images{{::item.id}}/cover.img\" alt=\"blog post cover image\"></span></div></div><div class=\"col-sm-8\"><div class=\"well clearfix bin-article-heading\"><div class=\"row\"><div class=\"col-sm-12\"><h2 class=\"inline bin-article-title\"><a bin-href=\"{{::\'/view\' + (item.localizedId || item.id)}}\" ng-if=\"body != \'\' || editing\" i18n=\"\" code=\"{{::item.id}}\" default=\"{{::item.id}}\" read-only=\"\" no-locale=\"\">{{::var}}</a> <span ng-if=\"body == \'\' && !editing\" i18n=\"\" code=\"{{::item.id}}\" default=\"{{::item.id}}\" read-only=\"\" no-locale=\"\">{{::var}}</span></h2><ul class=\"list-inline\"><li><i class=\"fa fa-clock-o fa-fw\"></i> {{::item.publicationTime | amDateFormat:\'LL\'}} <span class=\"badge\" ng-if=\"::(item.publicationTime | amDifference : null : \'minutes\') > 0\" i18n=\"\" code=\"blog.article.scheduled.label\" read-only=\"\" ng-bind=\"::var\"></span></li></ul></div></div></div><p class=\"bin-article-lead\" i18n=\"\" code=\"{{::item.id}}.lead\" editor=\"full\" read-only=\"\" no-locale=\"\" ng-bind-html=\"::var|trust\"></p><span i18n=\"\" code=\"blog.read.more\" read-only=\"\" ng-if=\"body != \'\'\"><a bin-href=\"{{::\'/view\' + (item.localizedId || item.id)}}\" class=\"read-more\" title=\"Read More\">{{::var}}</a></span></div><div class=\"col-sm-8 col-sm-offset-4\"><hr></div></article>");
$templateCache.put("bin-blog-view.html","<div ng-controller=\"BinBlogPostController as blog\" ng-init=\"blog.init(item)\"><div checkpoint-permission-for=\"blog.drafts.view\"><div class=\"container bin-blog bin-blog-view\" ng-if=\"(blog.item.status != \'published\' && permitted) || (blog.item.status == \'published\')\"><div class=\"row\"><div class=\"col-xs-12 col-sm-8 col-sm-offset-2\"><article class=\"bin-article\"><bin-edit><bin-actions><bin-action-group><bin-action bin-action-type=\"expression\" bin-action-expression=\"blog.updateStatus()\"><span i18n=\"\" code=\"blog.article.{{blog.item.status == \'draft\' ? \'publish\' : \'unpublish\'}}.button\" watch-on-code=\"\" read-only=\"\" ng-bind=\"var\"></span></bin-action><li checkpoint-permission-for=\"catalog.item.remove\" ng-show=\"permitted\" i18n=\"\" code=\"blog.article.remove.confirm\" default=\"Are you sure?\" read-only=\"\"><button type=\"button\" class=\"bin-link bin-link-danger\" ng-controller=\"RemoveItemFromCatalogController\" ng-init=\"init({redirect:blog.item.partition})\" ng-click-confirm=\"submit(blog.item.id)\" confirm-message=\"{{::var}}\" ng-if=\"::var\" ng-disabled=\"working\"><span i18n=\"\" code=\"blog.article.remove.button\" read-only=\"\" ng-bind=\"::var\"></span></button></li></bin-action-group></bin-actions><bin-edit-header><div class=\"bin-article-image-wrapper\"><img class=\"img-responsive\" bin-image=\"images{{::blog.item.id}}/cover.img\" alt=\"blog post cover image\" seo-image=\"\"></div><div class=\"alert alert-info\" ng-if=\"blog.item.status != \'published\'\" i18n=\"\" code=\"blog.article.draft.label\" default=\"DRAFT\" read-only=\"\"><i class=\"fa fa-square fa-fw\"></i> {{::var}}</div></bin-edit-header><bin-edit-body><div class=\"bin-article-heading\"><h2 class=\"inline bin-article-title\" i18n=\"\" code=\"{{::blog.item.id}}\" default=\"{{::blog.item.id}}\" var=\"itemTitle\" no-locale=\"\" seo-title=\"\">{{var}}</h2><ul class=\"list-inline\"><li ng-if=\"blog.item.publicationTime\"><i class=\"fa fa-clock-o fa-fw\"></i> {{blog.item.publicationTime | amDateFormat:\'lll\'}} <span class=\"badge\" ng-if=\"(blog.item.publicationTime | amDifference : null : \'minutes\') > 0 && blog.item.status != \'draft\'\" i18n=\"\" code=\"blog.article.scheduled.label\" read-only=\"\" ng-bind=\"::var\"></span></li><li ng-if=\"settings.useBlogTypes\"><i class=\"fa fa-tag\"></i><i18n class=\"inline\" code=\"blog.type.{{blog.item.blogType}}\" default=\"{{blog.item.blogType}}\"><a ng-href=\"#!{{::localePrefix}}/blog/{{var}}\">{{var}}</a></i18n></li></ul></div><hr><p class=\"bin-article-lead\" i18n=\"\" code=\"{{::blog.item.id}}.lead\" var=\"itemLead\" editor=\"full\" no-locale=\"\" ng-bind-html=\"var|trust\" seo-description=\"\"></p><p class=\"bin-article-body\" i18n=\"\" code=\"{{::blog.item.id}}.body\" var=\"itemBody\" editor=\"full-media\" no-locale=\"\"><span class=\"btn btn-success btn-block\" ng-if=\"editing && !var\"><i class=\"fa fa-plus fa-fw\"></i> <span class=\"inline\" i18n=\"\" code=\"blog.article.add.body.button\" read-only=\"\">{{::var}}</span></span> <span ng-if=\"var\" ng-bind-html=\"var|trust\"></span></p></bin-edit-body></bin-edit></article></div></div><div class=\"row\"><div class=\"col-xs-12 col-sm-8 col-sm-offset-2\"><hr><a bin-href=\"{{blog.item.partition}}\" i18n=\"\" code=\"blog.back\" read-only=\"\"><i class=\"fa fa-angle-left fa-fw\"></i> {{::var}}</a></div></div></div></div></div>");
$templateCache.put("unavailable/bin-blog-drafts.html","");
$templateCache.put("unavailable/bin-blog-previews.html","<ng-include src=\"\'blog-unavailable.html\'\"></ng-include>");
$templateCache.put("unavailable/bin-blog-view.html","<ng-include src=\"\'blog-unavailable.html\'\"></ng-include>");
$templateCache.put("unavailable/blog-unavailable.html","<div checkpoint-permission-for=\"edit.mode\"><section class=\"bin-catalog\" ng-if=\"permitted\"><div class=\"container\"><div class=\"row\"><div class=\"col-xs-12 col-sm-6 col-sm-offset-3\"><div class=\"alert alert-info alert-unavailable\" i18n=\"\" code=\"blog.unavailable.message\" read-only=\"\"><i class=\"fa fa-info-circle fa-fw\"></i> {{::var}}<hr><a ng-href=\"{{::binartaUpgradeUri}}\" target=\"_blank\" class=\"btn btn-success\" i18n=\"\" code=\"blog.upgrade.button\" read-only=\"\">{{::var}}</a></div></div></div></div></section></div>");}]);