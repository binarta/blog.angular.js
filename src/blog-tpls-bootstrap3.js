angular.module("blog.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("bin-blog-add-article-button.html","<div class=\"bin-add-article-button\" ng-if=\"permitted && editing\"><button type=\"button\" class=\"bin-btn bin-btn-primary bin-btn-floated\" ng-disabled=\"working\" ng-if=\"allowed\" ng-click=\"addArticle()\" i18n=\"\" code=\"blog.article.add.{{first ? \'first\' : \'new\'}}.button\" read-only=\"\" watch-on-code=\"\"><span ng-hide=\"working\"><i class=\"fa fa-plus fa-fw\"></i></span> <span ng-show=\"working\"><i class=\"fa fa-spinner fa-spin fa-fw\"></i></span> <span ng-bind=\"var\"></span></button><div class=\"alert alert-info\" ng-if=\"allowed == false\" i18n=\"\" code=\"blog.article.main.language.restriction.message\" read-only=\"\"><i class=\"fa fa-info-circle fa-fw\"></i> {{::var}} ({{mainLocale|toLanguageName}})</div></div>");
$templateCache.put("bin-blog-drafts.html","<div ng-if=\"allowed && permitted && editing\" ng-controller=\"BinartaSearchController as draftsCtrl\" ng-init=\"draftsCtrl.init({ settings: \'blog\', filters:{partition: partition, status:\'draft\', locale:locale}, subset:{count:20}})\"><div class=\"bin-blog bin-blog-drafts\" ng-if=\"draftsCtrl.results.length != 0\"><div class=\"panel panel-default\"><div class=\"panel-heading\" i18n=\"\" code=\"blog.drafts.title\" read-only=\"\" ng-bind=\"::var\"></div><div class=\"panel-body\"><div class=\"bin-draft\" ng-repeat=\"item in draftsCtrl.results track by item.id\"><div class=\"row\"><div class=\"col-xs-4\" ng-bind=\"::item.creationTime | amDateFormat:\'LL\'\"></div><div class=\"col-xs-8\"><a i18n=\"\" read-only=\"\" no-locale=\"\" code=\"{{::item.id}}\" ng-href=\"{{::\'/view\' + item.id | i18nRoute}}\" ng-bind=\"::var\"></a></div></div></div><div class=\"text-center\" ng-if=\"draftsCtrl.results.length >= 20\"><button type=\"button\" class=\"btn btn-link\" ng-click=\"draftsCtrl.searchForMore()\" ng-disabled=\"draftsCtrl.working\" i18n=\"\" code=\"button.view.older.articles\" read-only=\"\"><span ng-if=\"!draftsCtrl.working\"><i class=\"fa fa-arrow-circle-o-down fa-fw\"></i></span> <span ng-if=\"draftsCtrl.working\"><i class=\"fa fa-spinner fa-spin fa-fw\"></i></span> {{::var}}</button></div></div></div></div></div>");
$templateCache.put("bin-blog-previews.html","<article class=\"row bin-article\" ng-repeat=\"item in searchCtrl.results track by item.id\" i18n=\"\" code=\"{{::item.id}}.body\" var=\"body\" read-only=\"\" no-locale=\"\"><div class=\"col-sm-4\"><div class=\"bin-article-image-wrapper\"><span ng-if=\"body != \'\' || editing\"><a ng-href=\"{{::\'/view\' + item.id | i18nRoute}}\"><img class=\"img-responsive\" bin-image=\"images{{::item.id}}/cover.img\" alt=\"blog post cover image\"></a></span> <span ng-if=\"body == \'\' && !editing\"><img class=\"img-responsive\" bin-image=\"images{{::item.id}}/cover.img\" alt=\"blog post cover image\"></span></div></div><div class=\"col-sm-8\"><div class=\"well clearfix bin-article-heading\"><div class=\"row\"><div class=\"col-sm-12\"><h2 class=\"inline bin-article-title\"><a ng-href=\"{{::\'/view\' + item.id | i18nRoute}}\" ng-if=\"body != \'\' || editing\" i18n=\"\" code=\"{{::item.id}}\" default=\"{{::item.id}}\" read-only=\"\" no-locale=\"\">{{::var}}</a> <span ng-if=\"body == \'\' && !editing\" i18n=\"\" code=\"{{::item.id}}\" default=\"{{::item.id}}\" read-only=\"\" no-locale=\"\">{{::var}}</span></h2><ul class=\"list-inline\"><li><i class=\"fa fa-clock-o fa-fw\"></i> {{::item.creationTime | amDateFormat:\'LL\'}}</li><!--<li ng-if=\"settings.useBlogTypes\">--><!--<i class=\"fa fa-tag fa-fw\"></i>--><!--<i18n class=\"inline\" code=\"blog.type.{{item.blogType}}\" default=\"{{item.blogType}}\" read-only>{{::var}}</i18n>--><!--</li>--></ul></div></div></div><p class=\"bin-article-lead\" i18n=\"\" code=\"{{::item.id}}.lead\" editor=\"full\" read-only=\"\" no-locale=\"\" ng-bind-html=\"::var|trust\"></p><span i18n=\"\" code=\"blog.read.more\" read-only=\"\" ng-if=\"body != \'\'\"><a ng-href=\"{{::\'/view\' + item.id | i18nRoute}}\" class=\"read-more\" title=\"Read More\">{{::var}}</a></span></div><div class=\"col-sm-8 col-sm-offset-4\"><hr></div></article>");
$templateCache.put("bin-blog-view.html","<div checkpoint-permission-for=\"blog.drafts.view\"><div class=\"container bin-blog bin-blog-view\" ng-if=\"(item.status != \'published\' && permitted) || (item.status == \'published\')\"><article class=\"bin-article\"><div class=\"row\"><div class=\"col-xs-12 col-sm-8 col-sm-offset-2\"><div class=\"bin-article-image-wrapper\"><img class=\"img-responsive\" bin-image=\"images{{::item.id}}/cover.img\" alt=\"blog post cover image\" seo-image=\"\"></div></div><div class=\"col-xs-12 col-sm-8 col-sm-offset-2\"><div class=\"alert alert-info\" ng-if=\"item.status != \'published\'\" i18n=\"\" code=\"blog.article.draft.label\" default=\"DRAFT\" read-only=\"\"><i class=\"fa fa-square fa-fw\"></i> {{::var}}</div><div class=\"row\"><div class=\"col-xs-12\" ng-class=\"editing ? \'col-sm-8\' : \'col-sm-12\'\"><div class=\"bin-article-heading\"><h2 class=\"inline bin-article-title\" i18n=\"\" code=\"{{::item.id}}\" default=\"{{::item.id}}\" var=\"itemTitle\" no-locale=\"\" seo-title=\"\">{{var}}</h2><ul class=\"list-inline\"><li><i class=\"fa fa-clock-o fa-fw\"></i> {{::item.creationTime | amDateFormat:\'LL\'}}</li><li ng-if=\"settings.useBlogTypes\"><i class=\"fa fa-tag\"></i><i18n class=\"inline\" code=\"blog.type.{{item.blogType}}\" default=\"{{item.blogType}}\"><a ng-href=\"#!{{::localePrefix}}/blog/{{var}}\">{{var}}</a></i18n></li></ul></div></div><div class=\"col-xs-12 col-sm-4\" ng-if=\"editing\"><div class=\"pull-right bin-article-buttons\" i18n=\"\" code=\"blog.article.remove.confirm\" default=\"Are you sure?\" read-only=\"\"><div class=\"btn-group-vertical\" ng-if=\"item\"><button class=\"btn btn-success\" ng-click=\"item.status = (item.status == \'draft\' ? \'published\' : \'draft\'); update();\" ng-controller=\"UpdateCatalogItemController\" ng-init=\"init(item)\" ng-disabled=\"working\"><span ng-show=\"working\"><i class=\"fa fa-spinner fa-spin fa-fw\"></i></span> <span ng-hide=\"working\"><i class=\"fa fa-eye fa-fw\"></i></span> <span ng-show=\"item.status == \'draft\'\" class=\"inline\" i18n=\"\" code=\"blog.article.publish.button\" default=\"Publish\" read-only=\"\" ng-bind=\"::var\"></span> <span ng-show=\"item.status == \'published\'\" class=\"inline\" i18n=\"\" code=\"blog.article.unpublish.button\" default=\"Unpublish\" read-only=\"\" ng-bind=\"::var\"></span></button> <button class=\"btn btn-danger\" checkpoint-permission-for=\"catalog.item.remove\" ng-show=\"permitted\" ng-controller=\"RemoveItemFromCatalogController\" ng-init=\"init({redirect:item.partition})\" ng-click-confirm=\"submit(item.id)\" confirm-message=\"{{::var}}\" ng-if=\"var\" ng-disabled=\"working\"><span ng-if=\"!working\"><i class=\"fa fa-times fa-fw\"></i></span> <span ng-if=\"working\"><i class=\"fa fa-spinner fa-spin fa-fw\"></i></span> <span class=\"inline\" i18n=\"\" code=\"blog.article.remove.button\" default=\"Remove\" read-only=\"\">{{::var}}</span></button></div></div></div></div><hr></div></div><div class=\"row\"><div class=\"col-xs-12 col-sm-8 col-sm-offset-2\"><p class=\"bin-article-lead\" i18n=\"\" code=\"{{::item.id}}.lead\" var=\"itemLead\" editor=\"full\" no-locale=\"\" ng-bind-html=\"var|trust\" seo-description=\"\"></p><p class=\"bin-article-body\" i18n=\"\" code=\"{{::item.id}}.body\" var=\"itemBody\" editor=\"full-media\" no-locale=\"\"><span class=\"btn btn-success btn-block\" ng-if=\"editing && !var\"><i class=\"fa fa-plus fa-fw\"></i> <span class=\"inline\" i18n=\"\" code=\"blog.article.add.body.button\" read-only=\"\">{{::var}}</span></span> <span ng-if=\"var\" ng-bind-html=\"var|trust\"></span></p></div></div></article><div class=\"row\"><div class=\"col-xs-12 col-sm-8 col-sm-offset-2\"><hr><a ng-href=\"{{item.partition | i18nRoute}}\" i18n=\"\" code=\"blog.back\" read-only=\"\"><i class=\"fa fa-angle-left fa-fw\"></i> {{::var}}</a></div></div></div></div>");
$templateCache.put("unavailable/bin-blog-drafts.html","");
$templateCache.put("unavailable/bin-blog-previews.html","<ng-include src=\"\'blog-unavailable.html\'\"></ng-include>");
$templateCache.put("unavailable/bin-blog-view.html","<ng-include src=\"\'blog-unavailable.html\'\"></ng-include>");
$templateCache.put("unavailable/blog-unavailable.html","<div checkpoint-permission-for=\"edit.mode\"><section class=\"bin-catalog\" ng-if=\"permitted\"><div class=\"container\"><div class=\"row\"><div class=\"col-xs-12 col-sm-6 col-sm-offset-3\"><div class=\"alert alert-info alert-unavailable\" i18n=\"\" code=\"blog.unavailable.message\" read-only=\"\"><i class=\"fa fa-info-circle fa-fw\"></i> {{::var}}<hr><a ng-href=\"{{::binartaUpgradeUri}}\" target=\"_blank\" class=\"btn btn-success\" i18n=\"\" code=\"blog.upgrade.button\" read-only=\"\">{{::var}}</a></div></div></div></div></section></div>");}]);