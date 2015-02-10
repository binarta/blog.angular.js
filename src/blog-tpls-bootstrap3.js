angular.module("blog.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("bin-blog-add.html","<div class=\"container bin-blog bin-blog-add\"><div class=row><div class=\"col-sm-8 col-sm-offset-2\"><div ng-controller=AddBlogController><form ng-controller=AddToCatalogController ng-init=\"init({partition:\'/blog/\', type:\'blog\', redirectToView:true})\" ng-submit=\"settings.useBlogTypes || (item.blogType = \'blog\');submit()\"><div class=row ng-if=settings.useBlogTypes><div class=col-sm-4><div class=\"form-group has-{{errorClassFor[\'blogType\']}}\"><label class=control-label for=blogType>Type</label><select id=blogType class=form-control ng-model=item.blogType ng-options=\"b.code as b.label for b in blogTypes\"><option>--- Please Select ---</option></select><span ng-repeat=\"v in violations[\'blogType\']\" class=help-block><i18n code={{v}} default={{v}} ng-if=\"v!=\'required\'\">{{var}}</i18n></span></div></div></div><div class=\"form-group has-{{errorClassFor[\'defaultName\']}}\"><label class=control-label for=title>Title</label> <input type=text id=title ng-model=item.defaultName class=form-control> <span ng-repeat=\"v in violations[\'defaultName\']\" class=help-block><i18n code={{v}} default={{v}} ng-if=\"v!=\'required\'\">{{var}}</i18n></span></div><div class=\"form-group has-{{errorClassFor[\'lead\']}}\"><label class=control-label for=lead>Lead</label> <textarea id=lead class=form-control ui-tinymce=\"{ plugins: [\'link fullscreen textcolor paste table\'], toolbar: \'undo redo | styleselect | bold italic | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent table | link | fullscreen\', theme_advanced_resizing: true, theme_advanced_resizing_use_cookie : false, height:\'100\', menubar:false }\" ng-model=item.lead></textarea> <span ng-repeat=\"v in violations[\'lead\']\" class=help-block><i18n code={{v}} default={{v}} ng-if=\"v!=\'required\'\">{{var}}</i18n></span></div><div class=\"form-group has-{{errorClassFor[\'body\']}}\"><label class=control-label for=body>Body</label> <textarea id=body class=form-control ui-tinymce=\"{ plugins: [\'link fullscreen textcolor paste table\'], toolbar: \'undo redo | styleselect | bold italic | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent table | link | fullscreen\', theme_advanced_resizing: true, theme_advanced_resizing_use_cookie : false, height:\'180\', menubar:false }\" ng-model=item.body></textarea> <span ng-repeat=\"v in violations[\'body\']\" class=help-block><i18n code={{v}} default={{v}} ng-if=\"v!=\'required\'\">{{var}}</i18n></span></div><div class=checkbox><label><input id=status type=checkbox ng-model=item.status ng-true-value=published ng-false-value=draft> Published</label></div><button type=submit class=\"btn btn-success\" ng-disabled=working><span ng-if=!working><i class=\"fa fa-plus fa-fw\"></i></span> <span ng-if=working><i class=\"fa fa-spinner fa-spin fa-fw\"></i></span> Add article</button> <a ng-if=settings.multiLanguage class=\"btn btn-danger\" href=#!/{{locale}}/blog><i class=\"fa fa-times fa-fw\"></i> Cancel</a> <a ng-if=!settings.multiLanguage class=\"btn btn-danger\" href=#!/blog><i class=\"fa fa-times fa-fw\"></i> Cancel</a></form></div></div></div></div>");
$templateCache.put("bin-blog-drafts.html","<div ng-if=editing ng-controller=BinartaSearchController ng-init=\"init({ entity:\'catalog-item\', context:\'search\', filters:{ type:\'blog\', status:\'draft\', sortings: [ {on:\'creationTime\', orientation:\'desc\'} ] }, autosearch:true, subset:{count:20}})\"><div class=\"container bin-blog bin-blog-drafts\" ng-if=\"results.length != 0\"><div class=row><div class=\"col-sm-8 col-sm-offset-4\"><div class=well><h2>Drafts</h2><div class=\"bin-draft clearfix\" ng-repeat=\"item in results track by item.id\"><hr><div class=row><div class=col-xs-4><i class=\"fa fa-calendar fa-fw\"></i> {{item.creationTime | amDateFormat:\'MMMM DD, YYYY\'}}</div><div class=col-xs-8><a ng-if=settings.multiLanguage i18n=\"\" read-only=\"\" code={{item.id}} href=#!/{{locale}}/view{{item.id}}>{{var}}</a> <a ng-if=!settings.multiLanguage i18n=\"\" read-only=\"\" code={{item.id}} href=#!/view{{item.id}}>{{var}}</a></div></div></div><div ng-if=\"results.length >= 20\"><button type=button class=\"btn btn-primary\" ng-click=searchForMore() ng-disabled=working i18n=\"\" code=button.view.older.articles default=\"View older articles\"><span ng-if=!working><i class=\"fa fa-arrow-circle-o-down fa-fw\"></i></span> <span ng-if=working><i class=\"fa fa-spinner fa-spin fa-fw\"></i></span> {{var}}</button></div></div></div></div></div></div>");
$templateCache.put("bin-blog-previews.html","<div class=\"container bin-blog bin-blog-previews\" ng-controller=BinartaSearchController ng-init=\"init({ entity:\'catalog-item\', context:\'search\', filters:{ type:\'blog\', blogType: settings.blogType, status:\'published\', sortings: [ {on:\'creationTime\', orientation:\'desc\'} ] }, autosearch:true, subset:{count:5}})\"><div class=row ng-if=editing><div class=\"col-sm-8 col-sm-offset-4\"><div class=bin-add-article-button-wrapper><a ng-if=settings.multiLanguage class=\"btn btn-primary bin-add-article-button\" href=#!/{{locale}}/blog/add><i class=\"fa fa-plus fa-fw\"></i> Add new article</a> <a ng-if=!settings.multiLanguage class=\"btn btn-primary bin-add-article-button\" href=#!/blog/add><i class=\"fa fa-plus fa-fw\"></i> Add new article</a></div><hr></div></div><article class=\"row bin-article\" ng-repeat=\"item in results track by item.id\" i18n=\"\" code={{item.id}}.body var=body read-only=\"\"><div class=col-sm-4><div class=bin-article-image-wrapper><image-show ng-if=\"body && settings.multiLanguage\" path=images{{item.id}}/cover.img alt=\"blog post cover image\" link=#!/{{locale}}/view{{item.id}} image-class=img-responsive></image-show><image-show ng-if=\"body && !settings.multiLanguage\" path=images{{item.id}}/cover.img alt=\"blog post cover image\" link=#!/view{{item.id}} image-class=img-responsive></image-show><image-show ng-if=!body path=images{{item.id}}/cover.img alt=\"blog post cover image\" image-class=img-responsive></image-show></div></div><div class=col-sm-8><div class=\"well clearfix\"><div class=row><div ng-class=\"editing ? \'col-sm-8\' : \'col-sm-12\'\"><h2 class=\"inline bin-article-title\" i18n=\"\" code={{item.id}} default={{item.id}} ng-if=\"body && settings.i18nEnabled\"><a ng-if=settings.multiLanguage href=#!/{{locale}}/view{{item.id}}>{{var}}</a> <a ng-if=!settings.multiLanguage href=#!/view{{item.id}}>{{var}}</a></h2><h2 class=\"inline bin-article-title\" i18n=\"\" code={{item.id}} default={{item.id}} ng-if=\"!body && settings.i18nEnabled\">{{var}}</h2><h2 class=bin-article-title ng-if=\"body && !settings.i18nEnabled\"><a ng-if=settings.multiLanguage href=#!/{{locale}}/view{{item.id}}>{{item.defaultName}}</a> <a ng-if=!settings.multiLanguage href=#!/view{{item.id}}>{{item.defaultName}}</a></h2><h2 class=bin-article-title ng-if=\"!body && !settings.i18nEnabled\">{{item.defaultName}}</h2><ul class=list-inline><li><i class=\"fa fa-clock-o fa-fw\"></i> {{item.creationTime | amDateFormat:\'MMMM DD, YYYY\'}}</li><li ng-if=settings.useBlogTypes><i class=\"fa fa-tag fa-fw\"></i><i18n class=inline code=blog.type.{{item.blogType}} default={{item.blogType}}>{{var}}</i18n></li></ul></div><div class=col-sm-4 ng-if=editing><div class=\"pull-right bin-article-buttons\"><div class=btn-group-vertical><a ng-if=settings.multiLanguage class=\"btn btn-success\" href=#!/{{locale}}/view{{item.id}}><i class=\"fa fa-level-down fa-fw\"></i> Go to view</a> <a ng-if=!settings.multiLanguage class=\"btn btn-success\" href=#!/view{{item.id}}><i class=\"fa fa-level-down fa-fw\"></i> Go to view</a> <button class=\"btn btn-danger\" checkpoint-permission-for=catalog.item.remove ng-show=permitted ng-controller=RemoveItemFromCatalogController ng-init=init({noredirect:true,success:item.remove}) ng-click-confirm=submit(item.id) ng-disabled=working><span ng-if=!working><i class=\"fa fa-times fa-fw\"></i></span> <span ng-if=working><i class=\"fa fa-spinner fa-spin fa-fw\"></i></span> Remove</button></div></div></div></div></div><div ng-if=settings.i18nEnabled><p class=bin-article-lead i18n=\"\" code={{item.id}}.lead editor=full ng-bind-html=var|trust></p></div><div ng-if=!settings.i18nEnabled><p class=bin-article-lead ng-bind-html=item.lead|trust></p></div><span class=inline i18n=\"\" code=blog.read.more default=\"Read More...\" ng-if=body><a ng-if=settings.multiLanguage href=#!/{{locale}}/view{{item.id}} class=read-more title=\"Read More\">{{var}}</a> <a ng-if=!settings.multiLanguage href=#!/view{{item.id}} class=read-more title=\"Read More\">{{var}}</a></span></div><div class=\"col-xs-8 col-sm-offset-4\"><hr></div></article><div class=row ng-if=\"results.length == 0 && !working\"><div class=\"col-xs-12 text-center\"><p i18n=\"\" code=blog.no.articles.found default=\"No articles found...\">{{var}}</p></div></div><div class=row ng-if=\"results.length >= 5\"><div class=\"col-sm-8 col-sm-offset-4\"><hr><i18n class=inline code=button.view.older.articles default=\"View older articles\"><button type=button class=\"btn btn-primary\" ng-click=searchForMore() ng-disabled=working in-view=\"$inview ? searchForMore() : $inview\"><span ng-if=!working><i class=\"fa fa-arrow-circle-o-down fa-fw\"></i></span> <span ng-if=working><i class=\"fa fa-spinner fa-spin fa-fw\"></i></span> {{var}}</button></i18n></div></div></div>");
$templateCache.put("bin-blog-view.html","<div checkpoint-permission-for=blog.drafts.view><article class=\"container bin-blog bin-blog-view\" ng-if=\"(item.status != \'published\' && permitted) || (item.status == \'published\')\"><div class=row><div class=\"col-sm-8 col-sm-offset-2\"><div class=bin-article-image-wrapper><image-show path=images{{item.id}}/cover.img alt=\"blog post cover image\" image-class=img-responsive></image-show></div></div><div class=\"col-sm-8 col-sm-offset-2\"><div class=\"alert alert-info\" ng-if=\"item.status != \'published\'\"><i class=\"fa fa-square fa-fw\"></i> DRAFT</div><div class=row><div ng-class=\"editing ? \'col-sm-8\' : \'col-sm-12\'\"><h2 class=\"inline bin-article-title\" ng-if=settings.i18nEnabled i18n=\"\" code={{item.id}} default={{item.id}}>{{var}}</h2><h2 class=bin-article-title ng-if=!settings.i18nEnabled>{{item.defaultName}}</h2><ul class=list-inline><li><i class=\"fa fa-clock-o fa-fw\"></i> {{item.creationTime | amDateFormat:\'MMMM DD, YYYY\'}}</li><li ng-if=settings.useBlogTypes><i class=\"fa fa-tag\"></i><i18n class=inline code=blog.type.{{item.blogType}} default={{item.blogType}}><a ng-if=settings.multiLanguage href=#!/{{locale}}/blog/{{var}}>{{var}}</a> <a ng-if=!settings.multiLanguage href=#!/blog/{{var}}>{{var}}</a></i18n></li></ul></div><div class=col-sm-4 ng-if=editing><div class=\"pull-right bin-article-buttons\"><div class=btn-group-vertical ng-if=item><button class=\"btn btn-success\" ng-click=\"item.status = \'published\'; update();\" ng-controller=UpdateCatalogItemController ng-init=init(item) ng-if=\"item.status != \'published\' && permitted\" ng-disabled=working><span ng-if=!working><i class=\"fa fa-eye fa-fw\"></i></span> <span ng-if=working><i class=\"fa fa-spinner fa-spin fa-fw\"></i></span> Publish</button> <button class=\"btn btn-success\" ng-click=\"item.status = \'draft\'; update();\" ng-controller=UpdateCatalogItemController ng-init=init(item) ng-if=\"item.status == \'published\' && permitted\" ng-disabled=working><span ng-if=!working><i class=\"fa fa-eye-slash fa-fw\"></i></span> <span ng-if=working><i class=\"fa fa-spinner fa-spin fa-fw\"></i></span> Unpublish</button> <button class=\"btn btn-danger\" checkpoint-permission-for=catalog.item.remove ng-show=permitted ng-controller=RemoveItemFromCatalogController ng-init=\"init({redirect:(locale =! \'default\' ? locale : \'\') + \'/blog\'})\" ng-click-confirm=submit(item.id) ng-disabled=working><span ng-if=!working><i class=\"fa fa-times fa-fw\"></i></span> <span ng-if=working><i class=\"fa fa-spinner fa-spin fa-fw\"></i></span> Remove</button></div></div></div></div><hr></div></div><div class=row><div class=\"col-sm-8 col-sm-offset-2\" ng-if=!editing><div ng-if=settings.i18nEnabled><p class=bin-article-lead i18n=\"\" code={{item.id}}.lead editor=full ng-bind-html=var|trust></p></div><div ng-if=!settings.i18nEnabled><p class=bin-article-lead ng-bind-html=item.lead|trust></p></div><div ng-if=settings.i18nEnabled><i18n class=inline code={{item.id}}.body editor=full><span class=\"btn btn-success\" ng-if=\"editing && !var\"><i class=\"fa fa-plus fa-fw\"></i> Add a body</span><p class=bin-article-body ng-if=var ng-bind-html=var|trust></p></i18n></div><div ng-if=!settings.i18nEnabled><span class=\"btn btn-success\" ng-if=\"editing && !item.body\"><i class=\"fa fa-plus fa-fw\"></i> Add a body</span><p class=bin-article-body ng-if=item.body ng-bind-html=item.body|trust></p></div></div><div class=\"col-sm-8 col-sm-offset-2\" ng-if=editing><form ng-controller=UpdateCatalogItemController ng-init=init(item) ng-submit=update() class=highlight-on-dirty><div class=row ng-if=settings.useBlogTypes><div class=col-sm-4 ng-controller=BlogTypesController><div class=\"form-group has-{{errorClassFor[\'blogType\']}}\"><label class=control-label for=blogType>Type</label><select id=blogType class=form-control ng-model=item.blogType ng-options=\"b.code as b.label for b in blogTypes\"><option>--- Please Select ---</option></select><span ng-repeat=\"v in violations[\'blogType\']\" class=help-block><i18n code={{v}} default={{v}} ng-if=\"v!=\'required\'\">{{var}}</i18n></span></div></div></div><div class=\"form-group has-{{errorClassFor[\'defaultName\']}}\"><label class=control-label for=title>Title</label> <input type=text id=title ng-model=item.defaultName class=form-control> <span ng-repeat=\"v in violations[\'defaultName\']\" class=help-block><i18n code={{v}} default={{v}} ng-if=\"v!=\'required\'\">{{var}}</i18n></span></div><div class=\"form-group has-{{errorClassFor[\'lead\']}}\"><label class=control-label for=lead>Lead</label> <textarea id=lead class=form-control ui-tinymce=\"{ plugins: [\'link fullscreen textcolor paste table\'], toolbar: \'undo redo | styleselect | bold italic | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent table | link | fullscreen\', theme_advanced_resizing: true, theme_advanced_resizing_use_cookie : false, height:\'100\', menubar:false }\" ng-model=item.lead></textarea> <span ng-repeat=\"v in violations[\'lead\']\" class=help-block><i18n code={{v}} default={{v}} ng-if=\"v!=\'required\'\">{{var}}</i18n></span></div><div class=\"form-group has-{{errorClassFor[\'body\']}}\"><label class=control-label for=body>Body</label> <textarea id=body class=form-control ui-tinymce=\"{ plugins: [\'link fullscreen textcolor paste table\'], toolbar: \'undo redo | styleselect | bold italic | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent table | link | fullscreen\', theme_advanced_resizing: true, theme_advanced_resizing_use_cookie : false, height:\'180\', menubar:false }\" ng-model=item.body></textarea> <span ng-repeat=\"v in violations[\'body\']\" class=help-block><i18n code={{v}} default={{v}} ng-if=\"v!=\'required\'\">{{var}}</i18n></span></div><div class=form-group><button type=submit class=\"btn btn-success\" ng-disabled=\"unchanged || working\"><span ng-if=!working><i class=\"fa fa-check fa-fw\"></i></span> <span ng-if=working><i class=\"fa fa-spinner fa-spin fa-fw\"></i></span> Save</button> <button type=button class=\"btn btn-warning\" ng-click=cancel() ng-disabled=\"unchanged || working\"><i class=\"fa fa-refresh fa-fw\"></i> Undo</button></div></form></div></div></article></div>");}]);