/**
 * 
 * plugin to add assessments to stage
 * @class assessment
 * @extends EkstepEditor.basePlugin
 * @author Manju dr <manjunathd@ilimi.in>
 * @fires org.ekstep.assessmentbrowser:show
 * @fires org.ekstep.quiz:add 
 * @listens org.ekstep.image:assessment:showPopup
 */
EkstepEditor.basePlugin.extend({
    /**
     * This expains the type of the plugin 
     * @member {String} type
     * @memberof assessment
     */
     type: "org.ekstep.quiz",
    /**
    *  
    * Registers events.
    * @memberof assessment
    */
    initialize: function() {
        EkstepEditorAPI.addEventListener(this.manifest.id + ":showPopup", this.openAssessmentBrowser, this);
    },
    
    // Add assesment to the stage
    newInstance: function() {
        var instance = this,attributes = instance.attributes,templateArray =[],question=[],templateIds=[],resCount =0;
        if (isNaN(attributes.w)) {
            attributes.w = attributes.h = 70;
        }
        for (var i = 0; i < attributes.length - 1; i++) {
            if (!_.isUndefined(attributes[i].question)) {
                attributes[i].question = instance.parseObject(attributes[i].question);
            }
            question.push(attributes[i].question);
            templateIds.push(attributes[i].question.template_id);
            instance.addMediatoManifest(attributes[i].question.media);
        }
        templateIds = _.uniq(templateIds);
        for (var index = 0; index < templateIds.length; index++) {
            if (!_.isUndefined(templateIds[index])) {
                EkstepEditor.assessmentService.getTemplate(templateIds[index], function(err, res) {
                    if (res) {
                        // TODO : need to refactor of this API Call it  should not be a count .
                        resCount = resCount + 1;
                        templateArray.push(instance.xml2json(res));
                        if (resCount == templateIds.length) {
                            instance.setQuizdata(question, attributes, templateArray);
                        }
                    } else {
                        console.error("Template Response is faild:", err);
                    }
                });
            }
        }
        instance.percentToPixel(attributes);
        var props = instance.convertToFabric(attributes),
        itemLength = attributes.length -1, 
        count = attributes[itemLength].total_items +"/" + itemLength,
        maxscore = attributes[itemLength].max_score,
        title = attributes[itemLength].title;
        instance.editorObj = instance.showProperties(props,title, count, maxscore);
        instance.setConfig({"type": "items","var": "item"});
        delete instance.attributes;
    },
    setQuizdata: function(question,attributes,templateArray) {
        var instance = this, questionSets = {}, configItem ={},controller = {},templates=[],templateObj={};
        templateArray.forEach(function(element, index) {
            if (!_.isNull(element)) {
                templates.push(element.template);
                if (!_.isUndefined(element.manifest)) {
                    instance.addMediatoManifest(element.manifest.media);
                }
            }
        });
        templateObj["template"] = templates;
        questionSets[attributes[0].question.identifier] = question;
        configItem["items"] = questionSets;
        configItem["item_sets"] = [{"count": attributes[attributes.length -1].total_items,"id": attributes[0].question.identifier}];
        controller["controller"] = Object.assign(configItem,attributes[attributes.length -1]);
        instance.setData(Object.assign(controller, templateObj));
    },
    parseObject: function(item) {
        $.each(item, function(key, value) {
            if (key === 'options' || key === "lhs_options" || key === 'rhs_options' || key === 'model' || key === 'answer' || key === 'media') {
                item[key] = !_.isObject(item[key]) ? JSON.parse(item[key]) : item[key];
            }
        });
        return item;
    },
    addMediatoManifest: function(media) {
        // Adding all media to the manifest.
        var instance = this;
        if (!_.isUndefined(media)) {
            if (_.isArray(media)) {
                media.forEach(function(ele, index) {
                    if (!_.isNull(media[index].id)) {
                        instance.addMedia(media[index]);
                    }
                });
            } else {
                instance.addMedia(media);
            }
        }
    },
    xml2json: function(res) {
        var data, x2js = new X2JS({
            attributePrefix: 'none'
        });
        if (!_.isNull(res)) {
            data = x2js.xml_str2json(res.data.result.content.body);
            console.info(data);
            return data.theme;
        }
    },
    showProperties: function(props, qTittle, qCount, maxscore) {
        // Display the all properties on the editor
        props.fill = "#EDC06D";
        var rect = new fabric.Rect(props);
        qTittle = new fabric.Text(qTittle, {fontSize: 30, fill:'black',textAlign:'center',textDecoration:'underline', top: 80, left: 150} );
        qCount = new fabric.Text("QUESTIONS : " + qCount, {fontSize: 20,fill:'black',top: 120,left: 150});
        maxscore = new fabric.Text("TOTAL MARKS : "+maxscore, {fontSize: 20, fill:'black', top: 150,left: 150,});
        fabricGroup = new fabric.Group([rect, qTittle, qCount, maxscore], {left: 110, top: 50});
        return fabricGroup;
    },
    /**    
    *      
    * open assessment browser to get assessment data. 
    * @memberof assessment
    * 
    */
    openAssessmentBrowser: function(event, callback) {
        var instance = this,set = [];
        var callback = function(items, config) {
            items.push(config);
            set.push(items);
            EkstepEditorAPI.dispatchEvent(instance.manifest.id + ':create', set);
        };
        EkstepEditorAPI.dispatchEvent("org.ekstep.assessmentbrowser:show", callback);
    }
});
//# sourceURL=quizPlugin.js