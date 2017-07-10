/**
 *
 * plugin to get lessons from learning platform
 * @class lessonBrowser
 * @extends org.ekstep.contenteditor.basePlugin
 * @author G S Bajaj
 */
org.ekstep.contenteditor.basePlugin.extend({
    type: 'lessonbrowser',
    initData: undefined,
    repos: [],

    /**
    *   registers events
    *   @memberof lessonBrowser
    *
    */
    initialize: function() {
        // Listen if someone calls for lesson browser
        org.ekstep.contenteditor.api.addEventListener(this.manifest.id + ":show", this.initPreview, this);

        var templatePath = org.ekstep.contenteditor.api.resolvePluginResource("org.ekstep.lessonbrowser", "1.0", "editor/lessonBrowser.html");
        var controllerPath = org.ekstep.contenteditor.api.resolvePluginResource("org.ekstep.lessonbrowser", "1.0", "editor/lessonBrowserApp.js");
        org.ekstep.contenteditor.api.getService('popup').loadNgModules(templatePath, controllerPath);

        this.registerRepo(this.getEkstepRepo());
    },

    registerRepo: function(repo) {
        var instance = this;
        org.ekstep.contenteditor.api.getService('popup').loadNgModules(repo.templateUrl, repo.controllerUrl).then(
            function() {
                instance.repos.push(repo);
            }, function() {
                throw "unable to load controller :" + repo.controllerUrl;
        });

    },

    /**
    *   load html template to show the popup
    *   @param event {Object} event
    *   @param cb {Function} callback to be fired when asset is available.
    */
    initPreview: function(event, cb) {
        var instance = this;
        cb = cb || function() {};

        org.ekstep.contenteditor.api.getService('popup').open({
            template: 'partials/lessonbrowser.html',
            controller: 'lessonController',
            controllerAs: '$ctrl',
            resolve: {
                'instance': function() {
                    return instance;
                },
                'callback': function() {
                    return cb;
                }
            },
            showClose: false,
            closeByDocument: false,
            closeByEscape: false,
            width: 851,
            className: 'ngdialog-theme-plain'
        });
    },

    getEkstepRepo: function() {
        var repo = new(org.ekstep.collectioneditor.contentProviderRepo.extend({
                id: 'ekstep',
                label: 'EkStep',
                templateUrl: undefined,
                controllerUrl: undefined,

                init: function() {
                    this.templateUrl = org.ekstep.contenteditor.api.resolvePluginResource("org.ekstep.lessonbrowser", "1.0", "editor/repoEkstep.html");
                    this.controllerUrl = org.ekstep.contenteditor.api.resolvePluginResource("org.ekstep.lessonbrowser", "1.0", "editor/repoEkstepApp.js");
                },
                getFilters: function(){
                    return {"language":[], "grade": [], "lessonType": [], "domain": []};
                }
            }));

        return repo;
    }
});
//# sourceURL=lessonbrowserplugin.js