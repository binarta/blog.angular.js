angular.module("blog.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("bin-blog-drafts.html","<div checkpoint-permission-for=blog.drafts.view><div ng-if=permitted ng-controller=BinartaSearchController ng-init=\"init({ entity:\'catalog-item\', context:\'search\', filters:{ type:\'blog\', blogType: settings.blogType, status:\'draft\', locale: settings.multilingualism ? \'locale\' : \'default\', sortings: [ {on:\'creationTime\', orientation:\'desc\'} ] }, autosearch:true, subset:{count:20}})\"><div class=\"container bin-blog bin-blog-drafts\" ng-if=\"results.length != 0\"><div class=row><div class=\"col-sm-8 col-sm-offset-4\"><div class=well><h2 i18n=\"\" code=blog.drafts.title default=Drafts read-only=\"\">{{var}}</h2><div class=\"bin-draft clearfix\" ng-repeat=\"item in results track by item.id\"><hr><div class=row><div class=col-xs-4><i class=\"fa fa-calendar fa-fw\"></i> {{item.creationTime | amDateFormat:\'MMMM DD, YYYY\'}}</div><div class=col-xs-8><a i18n=\"\" read-only=\"\" no-locale=\"\" code={{item.id}} ng-href=#!{{localePrefix}}/view{{item.id}}>{{var}}</a></div></div></div><div ng-if=\"results.length >= 20\"><button type=button class=\"btn btn-primary\" ng-click=searchForMore() ng-disabled=working i18n=\"\" code=button.view.older.articles default=\"View older articles\"><span ng-if=!working><i class=\"fa fa-arrow-circle-o-down fa-fw\"></i></span> <span ng-if=working><i class=\"fa fa-spinner fa-spin fa-fw\"></i></span> {{var}}</button></div></div></div></div></div></div></div>");
$templateCache.put("bin-blog-previews.html","<div class=\"container bin-blog bin-blog-previews\" ng-controller=BinartaSearchController ng-init=\"init({ entity:\'catalog-item\', context:\'search\', filters:{ type:\'blog\', blogType: settings.blogType, status:\'published\', locale: settings.multilingualism ? \'locale\' : \'default\', sortings: [ {on:\'creationTime\', orientation:\'desc\'} ] }, autosearch:true, subset:{count:5}})\"><div checkpoint-permission-for=catalog.item.add><div class=row ng-if=permitted><div class=\"col-sm-8 col-sm-offset-4\" ng-controller=AddToCatalogController ng-init=\"init({partition:\'/blog/\', type:\'blog\', redirectToView:true, editMode:true})\"><div class=bin-add-article-button-wrapper ng-controller=AddBlogController><div class=\"alert alert-info\" ng-if=\"mainLocale != locale\" i18n=\"\" code=blog.article.main.language.restriction.message read-only=\"\"><i class=\"fa fa-info-circle fa-fw\"></i> {{var}} ({{mainLocale|toLanguageName}})</div><a class=\"btn btn-primary bin-add-article-button\" ng-if=\"mainLocale == locale\" ng-click=\"item.blogType = blogTypes[0].code;submit()\" ng-disabled=working i18n=\"\" code=blog.article.add.new.button read-only=\"\"><span ng-hide=working><i class=\"fa fa-plus fa-fw\"></i> {{var}}</span> <span ng-show=working><i class=\"fa fa-spinner fa-spin fa-fw\"></i></span></a></div><hr></div></div></div><article class=\"row bin-article\" ng-repeat=\"item in results track by item.id\" i18n=\"\" code={{item.id}}.body var=body read-only=\"\" no-locale=\"\"><div class=col-sm-4><div class=bin-article-image-wrapper checkpoint-permission-for=edit.mode><span ng-if=\"body != \'\' || permitted\"><a ng-href=#!{{localePrefix}}/view{{item.id}}><img class=img-responsive bin-image=images{{item.id}}/cover.img alt=\"blog post cover image\"></a></span> <span ng-if=\"body == \'\' && !permitted\"><img class=img-responsive bin-image=images{{item.id}}/cover.img alt=\"blog post cover image\"></span></div></div><div class=col-sm-8><div class=\"well clearfix bin-article-heading\"><div class=row><div class=col-sm-12><h2 class=\"inline bin-article-title\" i18n=\"\" code={{item.id}} default={{item.id}} no-locale=\"\" checkpoint-permission-for=edit.mode><a ng-href=#!{{localePrefix}}/view{{item.id}} ng-if=\"body != \'\' || permitted\">{{var}}</a> <span ng-if=\"body == \'\' && !permitted\">{{var}}</span></h2><ul class=list-inline><li><i class=\"fa fa-clock-o fa-fw\"></i> {{item.creationTime | amDateFormat:\'MMMM DD, YYYY\'}}</li><li ng-if=settings.useBlogTypes><i class=\"fa fa-tag fa-fw\"></i><i18n class=inline code=blog.type.{{item.blogType}} default={{item.blogType}}>{{var}}</i18n></li></ul></div></div></div><p class=bin-article-lead i18n=\"\" code={{item.id}}.lead editor=full no-locale=\"\" ng-bind-html=var|trust></p><span class=inline i18n=\"\" code=blog.read.more default=\"Read More...\" ng-if=\"body != \'\'\"><a ng-href=#!{{localePrefix}}/view{{item.id}} class=read-more title=\"Read More\">{{var}}</a></span></div><div class=\"col-sm-8 col-sm-offset-4\"><hr></div></article><div class=row ng-if=\"results.length == 0 && !working\"><div class=\"col-xs-12 text-center\"><p i18n=\"\" code=blog.no.articles.found default=\"No articles found...\">{{var}}</p></div></div><div class=row ng-if=\"results.length >= 5\"><div class=\"col-sm-8 col-sm-offset-4\"><hr><i18n class=inline code=button.view.older.articles default=\"View older articles\"><button type=button class=\"btn btn-primary\" ng-click=searchForMore() ng-disabled=working in-view=\"$inview ? searchForMore() : $inview\"><span ng-if=!working><i class=\"fa fa-arrow-circle-o-down fa-fw\"></i></span> <span ng-if=working><i class=\"fa fa-spinner fa-spin fa-fw\"></i></span> {{var}}</button></i18n></div></div></div>");
$templateCache.put("bin-blog-view.html","<div checkpoint-permission-for=blog.drafts.view><div class=\"container bin-blog bin-blog-view\" ng-if=\"(item.status != \'published\' && permitted) || (item.status == \'published\')\"><article class=bin-article><div class=row><div class=\"col-sm-8 col-sm-offset-2\"><div class=bin-article-image-wrapper><img class=img-responsive bin-image=images{{item.id}}/cover.img alt=\"blog post cover image\"></div></div><div class=\"col-sm-8 col-sm-offset-2\"><div class=\"alert alert-info\" ng-if=\"item.status != \'published\'\" i18n=\"\" code=blog.article.draft.label default=DRAFT read-only=\"\"><i class=\"fa fa-square fa-fw\"></i> {{var}}</div><div class=row checkpoint-permission-for=edit.mode><div ng-class=\"permitted ? \'col-sm-8\' : \'col-sm-12\'\"><div class=bin-article-heading><h2 class=\"inline bin-article-title\" i18n=\"\" code={{item.id}} default={{item.id}} no-locale=\"\">{{var}}</h2><ul class=list-inline><li><i class=\"fa fa-clock-o fa-fw\"></i> {{item.creationTime | amDateFormat:\'MMMM DD, YYYY\'}}</li><li ng-if=settings.useBlogTypes><i class=\"fa fa-tag\"></i><i18n class=inline code=blog.type.{{item.blogType}} default={{item.blogType}}><a ng-href=#!{{localePrefix}}/blog/{{var}}>{{var}}</a></i18n></li></ul></div></div><div class=col-sm-4 ng-if=permitted><div class=\"pull-right bin-article-buttons\" i18n=\"\" code=blog.article.remove.confirm default=\"Are you sure?\" read-only=\"\"><div class=btn-group-vertical ng-if=item><button class=\"btn btn-success\" ng-click=\"item.status = \'published\'; update();\" ng-controller=UpdateCatalogItemController ng-init=init(item) ng-if=\"item.status != \'published\' && permitted\" ng-disabled=working><span ng-if=!working><i class=\"fa fa-eye fa-fw\"></i></span> <span ng-if=working><i class=\"fa fa-spinner fa-spin fa-fw\"></i></span> <span class=inline i18n=\"\" code=blog.article.publish.button default=Publish read-only=\"\">{{var}}</span></button> <button class=\"btn btn-success\" ng-click=\"item.status = \'draft\'; update();\" ng-controller=UpdateCatalogItemController ng-init=init(item) ng-if=\"item.status == \'published\' && permitted\" ng-disabled=working><span ng-if=!working><i class=\"fa fa-eye-slash fa-fw\"></i></span> <span ng-if=working><i class=\"fa fa-spinner fa-spin fa-fw\"></i></span> <span class=inline i18n=\"\" code=blog.article.unpublish.button default=Unpublish read-only=\"\">{{var}}</span></button> <button class=\"btn btn-danger\" checkpoint-permission-for=catalog.item.remove ng-show=permitted ng-controller=RemoveItemFromCatalogController ng-init=\"init({redirect:(locale =! \'default\' ? locale : \'\') + \'/blog\'})\" ng-click-confirm=submit(item.id) confirm-message={{var}} ng-if=var ng-disabled=working><span ng-if=!working><i class=\"fa fa-times fa-fw\"></i></span> <span ng-if=working><i class=\"fa fa-spinner fa-spin fa-fw\"></i></span> <span class=inline i18n=\"\" code=blog.article.remove.button default=Remove read-only=\"\">{{var}}</span></button></div></div></div></div><hr></div></div><div class=row><div class=\"col-sm-8 col-sm-offset-2\"><p class=bin-article-lead i18n=\"\" code={{item.id}}.lead editor=full no-locale=\"\" ng-bind-html=var|trust></p><p class=bin-article-body i18n=\"\" code={{item.id}}.body editor=full-media no-locale=\"\"><span class=\"btn btn-success btn-block\" ng-if=\"editing && !var\"><i class=\"fa fa-plus fa-fw\"></i> <span class=inline i18n=\"\" code=blog.article.add.body.button read-only=\"\">{{var}}</span></span> <span ng-if=var ng-bind-html=var|trust></span></p></div></div></article></div></div>");}]);