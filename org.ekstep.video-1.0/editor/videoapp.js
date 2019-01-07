'use strict';
angular.module('videoApp', [])
    .controller('videoCtrl', ['$scope', '$injector', 'instance', '$http', function($scope, $injector, instance, $http) {
        var ctrl = this;
        ctrl.videoUrl = '';
        ctrl.show = 'message';
        ctrl.messageDiv = true;
        ctrl.formaterror = false;
        ctrl.result = '';

        ctrl.previewVideo = function() {
            ctrl.messageDiv = true;
            ctrl.show = 'loader';
            var link = ctrl.videoUrl;
            if (link.indexOf('drive') != -1) {
                var gdrive = link.replace('/view?usp=sharing', '').replace('open?id=', 'uc?export=download&id=').replace('file/d/', 'uc?export=download&id=').replace('/edit?usp=sharing', '');
                ctrl.videoUrl = gdrive;
                ctrl.loadGdrivefile(link);
            } else {
                ctrl.checkfileformat(link);
            }
        };

        ctrl.loadGdrivefile = function (link) {
            var reslink = link.split('id=');
            $http({
                method : "GET",
                url : "https://www.googleapis.com/drive/v3/files/"+ reslink[1]  + "?key=" + org.ekstep.contenteditor.config.googleAPIKey
            }).then(function mySuccess(response) {
                ctrl.result = response.data;
                console.log(ctrl.result);
                ctrl.checkfileformat(link, ctrl.result.mimeType);
            }, function myError(response) {
                ctrl.result = response.statusText;
                console.log(ctrl.result);
            });
        };

        ctrl.checkfileformat = function(link, gdriveformat) {
            if (link.indexOf('mp4') != -1 || link.indexOf('webm') != -1 || gdriveformat === 'video/mp4' || gdriveformat === 'video/webm') {
                ctrl.formaterror = false;
                var videoelement = ctrl.creteVideoElement(ctrl.videoUrl);
                ecEditor.jQuery('.content .container #previewVideo').html(videoelement);
                var video = document.getElementsByTagName('video')[0];
                video.play()
                    .then(function() {
                        var scope = angular.element(ecEditor.jQuery("#addToLesson")).scope();
                        scope.$apply(function() {
                            ctrl.messageDiv = false;
                            ctrl.showAddLessonBtn = true;
                        });
                        console.log("Valid URL:", video);
                    })
                    .catch(function(err) {
                        var scope = angular.element(ecEditor.jQuery("#addToLesson")).scope();
                        scope.$apply(function() {
                            ctrl.show = 'error';
                            ctrl.messageDiv = true;
                            ctrl.showAddLessonBtn = false;
                        });
                        var pkgVersion = ecEditor.getService('content').getContentMeta(org.ekstep.contenteditor.api.getContext('contentId')).pkgVersion;
                        var object = {
                            id: org.ekstep.contenteditor.api.getContext('contentId'),
                            ver: !_.isUndefined(pkgVersion) && pkgVersion.toString() || '0',
                            type: 'Content'
                        }
                        org.ekstep.contenteditor.api.getService(ServiceConstants.TELEMETRY_SERVICE).error({"err": err.code || '', "errtype": 'CONTENT', "stacktrace": err.toString(), "pageid": ecEditor.getCurrentStage().id, "object":object, "plugin": {id: instance.manifest.id, ver: instance.manifest.ver, category: 'core'} }); 
                        console.log("Invalid URL:", err);
                    });
            } else {
                console.log('Un-supported file');
                ctrl.formaterror = true;
                ctrl.show = 'error';
                ctrl.messageDiv = true;
                ctrl.showAddLessonBtn = false;
            }
        };

        ctrl.creteVideoElement = function(url) {
            var element = document.createElement('video');
            element.src = url;
            element.width = '400';
            element.height = '200';
            element.controls = true;
            element.autoplay = 'autoplay';
            return element;
        };

        ctrl.addVideo = function() {
            $scope.closeThisDialog();
            ecEditor.dispatchEvent("org.ekstep.video:create", {
                "y": 7.9,
                "x": 10.97,
                "w": 78.4,
                "h": 79.51,
                "config": {
                    "autoplay": true,
                    "controls": false,
                    "muted": false,
                    "visible": true,
                    "url": ctrl.videoUrl
                }
            });
        };

        ctrl.generateTelemetry = function(data) {
            if (data) org.ekstep.contenteditor.api.getService(ServiceConstants.TELEMETRY_SERVICE).interact({
                "type": data.type, 
                "subtype": data.subtype, 
                "target": data.target, 
                "pluginid": instance.manifest.id,
                "pluginver": instance.manifest.ver,
                "objectid": "",
                "stage": ecEditor.getCurrentStage().id
            }) 
        }
    }]);
//# sourceURL=videopluginapp.js