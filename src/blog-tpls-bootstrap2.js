angular.module("blog.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("bin-blog-add.html","<div checkpoint-permission-for=catalog.item.add><div class=\"container bin-blog bin-blog-add\" ng-if=permitted><div class=row ng-if=\"locale != mainLocale\"><div class=\"span8 offset2\"><div class=\"alert alert-info\" i18n=\"\" code=blog.article.main.language.restriction.message read-only=\"\"><i class=\"fa fa-info-circle fa-fw\"></i> {{var}} ({{mainLocale | toLanguageName}})</div></div></div><div class=row ng-if=\"locale == mainLocale\"><div class=\"span8 offset2\"><div ng-controller=AddBlogController><form ng-controller=AddToCatalogController ng-init=\"init({partition:\'/blog/\', type:\'blog\', redirectToView:true})\" ng-submit=submit()><div ng-if=item.type ng-init=\"item.blogType = blogTypes[0].code\"></div><div class=\"control-group {{errorClassFor[\'blogType\']}}\" ng-if=settings.useBlogTypes><label class=control-label for=blogType i18n=\"\" code=blog.article.add.type.label default=Type read-only=\"\">{{var}}</label><div class=controls><select id=blogType ng-model=item.blogType ng-options=\"b.code as b.label for b in blogTypes\"></select><span ng-repeat=\"v in violations[\'blogType\']\" class=help-block><i18n code={{v}} default={{v}} ng-if=\"v!=\'required\'\">{{var}}</i18n></span></div></div><div class=\"control-group {{errorClassFor[\'defaultName\']}}\"><label class=control-label for=title i18n=\"\" code=blog.article.add.title.label default=Title read-only=\"\">{{var}}</label><div class=controls><input type=text id=title ng-model=item.defaultName class=input-block-level> <span ng-repeat=\"v in violations[\'defaultName\']\" class=help-block><i18n code={{v}} default={{v}} ng-if=\"v!=\'required\'\">{{var}}</i18n></span></div></div><div class=\"control-group {{errorClassFor[\'lead\']}}\"><label class=control-label for=lead i18n=\"\" code=blog.article.add.lead.label default=Lead read-only=\"\">{{var}}</label><div class=controls><textarea id=lead ui-tinymce=\"{ plugins: [\'link fullscreen textcolor paste table\'], toolbar: \'undo redo | styleselect | bold italic | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent table | link | fullscreen\', theme_advanced_resizing: true, theme_advanced_resizing_use_cookie : false, height:\'100\', menubar:false }\" ng-model=item.lead></textarea> <span ng-repeat=\"v in violations[\'lead\']\" class=help-block><i18n code={{v}} default={{v}} ng-if=\"v!=\'required\'\">{{var}}</i18n></span></div></div><div class=\"control-group {{errorClassFor[\'body\']}}\"><label class=control-label for=body i18n=\"\" code=blog.article.add.body.label default=Body read-only=\"\">{{var}}</label><div class=controls><textarea id=body ui-tinymce=\"{ plugins: [\'link fullscreen textcolor paste table\'], toolbar: \'undo redo | styleselect | bold italic | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent table | link | fullscreen\', theme_advanced_resizing: true, theme_advanced_resizing_use_cookie : false, height:\'180\', menubar:false }\" ng-model=item.body></textarea> <span ng-repeat=\"v in violations[\'body\']\" class=help-block><i18n code={{v}} default={{v}} ng-if=\"v!=\'required\'\">{{var}}</i18n></span></div></div><div class=control-group><div class=controls><label class=checkbox i18n=\"\" code=blog.article.add.published.checkbox default=Published read-only=\"\"><input id=status class=custom-checkbox type=checkbox ng-model=item.status ng-true-value=\"\'published\'\" ng-false-value=\"\'draft\'\"> {{var}}</label></div></div><div class=control-group><div class=controls><button type=submit class=\"btn btn-success\" ng-disabled=working><span ng-if=!working><i class=\"fa fa-plus fa-fw\"></i></span> <span ng-if=working><i class=\"fa fa-spinner fa-spin fa-fw\"></i></span> <span class=inline i18n=\"\" code=blog.article.add.button default=\"Add article\" read-only=\"\">{{var}}</span></button> <a class=\"btn btn-danger\" ng-href=#!{{localePrefix}}/blog><i class=\"fa fa-times fa-fw\"></i> <span class=inline i18n=\"\" code=blog.article.cancel.button default=Cancel read-only=\"\">{{var}}</span></a></div></div></form></div></div></div></div></div>");
$templateCache.put("bin-blog-drafts.html","<div checkpoint-permission-for=blog.drafts.view><div ng-if=permitted ng-controller=BinartaSearchController ng-init=\"init({ entity:\'catalog-item\', context:\'search\', filters:{ type:\'blog\', blogType: settings.blogType, status:\'draft\', locale: \'default\', sortings: [ {on:\'creationTime\', orientation:\'desc\'} ] }, autosearch:true, subset:{count:20}})\"><div class=\"container bin-blog bin-blog-drafts\" ng-if=\"results.length != 0\"><div class=row><div class=\"span8 offset4\"><div class=well><h2 i18n=\"\" code=blog.drafts.title default=Drafts read-only=\"\">{{var}}</h2><div class=\"bin-draft clearfix\" ng-repeat=\"item in results track by item.id\"><hr><div class=row><div class=span2><i class=\"fa fa-calendar fa-fw\"></i> {{item.creationTime | amDateFormat:\'MMMM DD, YYYY\'}}</div><div class=span5><a i18n=\"\" read-only=\"\" no-locale=\"\" code={{item.id}} ng-href=#!{{localePrefix}}/view{{item.id}}>{{var}}</a></div></div></div><div ng-if=\"results.length >= 20\"><button type=button class=\"btn btn-primary\" ng-click=searchForMore() ng-disabled=working i18n=\"\" code=button.view.older.articles default=\"View older articles\"><span ng-if=!working><i class=\"fa fa-arrow-circle-o-down fa-fw\"></i></span> <span ng-if=working><i class=\"fa fa-spinner fa-spin fa-fw\"></i></span> {{var}}</button></div></div></div></div></div></div></div>");
$templateCache.put("bin-blog-previews.html","<div class=\"container bin-blog bin-blog-previews\" ng-controller=BinartaSearchController ng-init=\"init({ entity:\'catalog-item\', context:\'search\', filters:{ type:\'blog\', blogType: settings.blogType, status:\'published\', locale: \'default\', sortings: [ {on:\'creationTime\', orientation:\'desc\'} ] }, autosearch:true, subset:{count:5}})\"><div checkpoint-permission-for=catalog.item.add><div class=row ng-if=permitted><div class=\"span8 offset4\"><div class=bin-add-article-button-wrapper i18n=\"\" code=blog.article.add.new.button default=\"Add new article\" read-only=\"\"><a class=\"btn btn-primary bin-add-article-button\" ng-href=#!{{localePrefix}}/add/blog><i class=\"fa fa-plus fa-fw\"></i> {{var}}</a></div><hr></div></div></div><article class=\"row bin-article\" ng-repeat=\"item in results track by item.id\" i18n=\"\" code={{item.id}}.body var=body read-only=\"\" no-locale=\"\"><div class=span4><div class=\"img-polaroid bin-article-image-wrapper\" checkpoint-permission-for=edit.mode><a ng-href=#!{{localePrefix}}/view{{item.id}} ng-if=\"body != \'\' || permitted\"><img class=bin-article-image bin-image=images{{item.id}}/cover.img alt=\"blog post cover image\"></a> <img class=bin-article-image bin-image=images{{item.id}}/cover.img alt=\"blog post cover image\" ng-if=\"body == \'\' && !permitted\"></div></div><div class=span8><div class=\"well clearfix\"><div checkpoint-permission-for=edit.mode><h2 class=\"inline bin-article-title\" i18n=\"\" code={{item.id}} default={{item.id}} no-locale=\"\" ng-if=\"body != \'\' || permitted\"><a ng-href=#!{{localePrefix}}/view{{item.id}}>{{var}}</a></h2><h2 class=\"inline bin-article-title\" i18n=\"\" code={{item.id}} default={{item.id}} no-locale=\"\" ng-if=\"body == \'\' && !permitted\">{{var}}</h2></div><div><ul class=inline><li><i class=\"fa fa-calendar fa-fw\"></i> {{item.creationTime | amDateFormat:\'MMMM DD, YYYY\'}}</li><li ng-if=settings.useBlogTypes><i class=\"fa fa-tag fa-fw\"></i><i18n class=inline code=blog.type.{{item.blogType}} default={{item.blogType}}>{{var}}</i18n></li></ul></div></div><p class=bin-article-lead i18n=\"\" code={{item.id}}.lead editor=full no-locale=\"\" ng-bind-html=var|trust></p><span class=inline i18n=\"\" code=blog.read.more default=\"Read More...\" ng-if=\"body != \'\'\"><a class=read-more ng-href=#!{{localePrefix}}/view{{item.id}} title=\"Read More\">{{var}}</a></span></div></article><div class=row><div class=\"span8 offset4\" ng-if=\"results.length >= 5\"><hr><i18n class=inline code=button.view.older.articles default=\"View older articles\"><button type=button class=\"btn btn-primary\" ng-click=searchForMore() ng-disabled=working in-view=\"$inview ? searchForMore() : $inview\"><span ng-if=!working><i class=\"fa fa-arrow-circle-o-down fa-fw\"></i></span> <span ng-if=working><i class=\"fa fa-spinner fa-spin fa-fw\"></i></span> {{var}}</button></i18n></div></div></div>");
$templateCache.put("bin-blog-view.html","<div class=\"container bin-blog bin-blog-view\"><div class=row><article><div class=\"span8 offset2\"><div class=\"well clearfix\"><div class=\"alert alert-info\" ng-if=\"item.status != \'published\'\" i18n=\"\" code=blog.article.draft.label default=DRAFT read-only=\"\"><i class=\"fa fa-square fa-fw\"></i> {{var}}</div><h2 class=\"inline bin-article-title\" i18n=\"\" code={{item.id}} default={{item.id}} no-locale=\"\">{{var}}</h2><div checkpoint-permission-for=edit.mode><div class=\"pull-right text-right bin-article-buttons\" ng-if=permitted><form ng-if=item ng-controller=UpdateCatalogItemController ng-init=init(item)><div ng-if=\"item.status != \'published\'\"><button class=\"btn btn-success\" ng-click=\"item.status = \'published\'; update();\" ng-disabled=working><span ng-if=!working><i class=\"fa fa-eye fa-fw\"></i></span> <span ng-if=working><i class=\"fa fa-spinner fa-spin fa-fw\"></i></span> <span class=inline i18n=\"\" code=blog.article.publish.button default=Publish read-only=\"\">{{var}}</span></button></div><div ng-if=\"item.status == \'published\'\"><button class=\"btn btn-success\" ng-click=\"item.status = \'draft\'; update();\" ng-disabled=working><span ng-if=!working><i class=\"fa fa-eye-slash fa-fw\"></i></span> <span ng-if=working><i class=\"fa fa-spinner fa-spin fa-fw\"></i></span> <span class=inline i18n=\"\" code=blog.article.unpublish.button default=Unpublish read-only=\"\">{{var}}</span></button></div></form><div checkpoint-permission-for=catalog.item.remove><form ng-if=permitted ng-controller=RemoveItemFromCatalogController ng-init=\"init({redirect:(locale != \'default\' ? locale : \'\') + \'/blog\'})\"><i18n code=blog.article.remove.confirm default=\"Are you sure?\" read-only=\"\"><button class=\"btn btn-danger\" ng-click-confirm=submit(item.id) confirm-message={{var}} ng-if=var ng-disabled=working><span ng-if=!working><i class=\"fa fa-times fa-fw\"></i></span> <span ng-if=working><i class=\"fa fa-spinner fa-spin fa-fw\"></i></span> <span class=inline i18n=\"\" code=blog.article.remove.button default=Remove read-only=\"\">{{var}}</span></button></i18n></form></div></div></div><ul class=inline><li><i class=\"fa fa-calendar fa-fw\"></i> {{item.creationTime | amDateFormat:\'MMMM DD, YYYY\'}} |</li><li ng-if=settings.useBlogTypes><i class=\"fa fa-tag\"></i><i18n class=inline code=blog.type.{{item.blogType}} default={{item.blogType}}>{{var}}</i18n>|</li><li><span i18n=\"\" code=blog.back default=back class=inline><a ng-href=#!{{localePrefix}}/blog><i class=\"fa fa-caret-left\"></i> {{var}}</a></span></li></ul></div></div><div class=\"span8 offset2\"><p class=\"bin-article-lead lead\" i18n=\"\" code={{item.id}}.lead editor=full no-locale=\"\" ng-bind-html=var|trust></p><i18n class=inline code={{item.id}}.body editor=full no-locale=\"\"><span class=\"btn btn-success\" ng-if=\"editing && !var\"><i class=\"fa fa-plus fa-fw\"></i> <span class=inline i18n=\"\" code=blog.article.add.body.button default=\"Add a body\" read-only=\"\">{{var}}</span></span><p class=bin-article-body ng-if=var ng-bind-html=var|trust></p></i18n></div><div class=\"span8 offset2 text-center\"><div class=bin-article-image-wrapper><img class=\"bin-article-image img-polaroid\" bin-image=images{{item.id}}/cover.img alt=\"blog post cover image\"></div></div></article></div></div>");}]);