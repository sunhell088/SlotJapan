//逻辑主程序
var mainMinJSVer = 'mainMinJSVer';
//res资源文件
window['default_res'] = 'defaultResVersion';
//引擎JS
var egretLibJSVer = 'egretLibJSVer';

//需要预加载的js文件，必须顺序加载
var libs = [];
loadJS();
function loadJS() {
    //注意，不要修改这里的顺序，因为有相互依赖关系
    var loadJS = [
        "libs/modules/egret/egret.min.js",
        "libs/modules/egret/egret.web.min.js",
        "libs/modules/eui/eui.min.js",
        "libs/modules/dragonBones/dragonBones.min.js",
        "libs/modules/res/res.min.js",
        "libs/modules/tween/tween.min.js",
        "libs/modules/game/game.min.js",
        "socket.io/bin/socket.io/socket.io.min.js",
        "promise/promise.min.js",
        "particle/bin/particle.min.js"
    ];
    for (var key in loadJS) {
        loadJS[key] = loadJS[key] + "?" + egretLibJSVer;
    }
    loadJS.push("main.min.js?" + mainMinJSVer);
    libs = libs.concat(loadJS);
    window.onload = function () {
        if (window["isDebug"]) {
            libs = [];
            onLoading();
        } else {
            includeScript(libs[0], onLoading);
        }
    }
}

function includeScript(url, callback) {
    var script = document.createElement("script");
    var doc = document.getElementsByTagName("script")[0];
    script.type = "text/javascript";
    script.src = url;
    if (url.indexOf("libs") > -1) {
        script.egret = "lib";
    }
    doc.parentNode.insertBefore(script, doc);
    if (script.readyState) {
        //IE
        script.onreadystatechange = function () {
            if (script.readyState == "loaded" || script.readyState == "complete") {
                script.onreadystatechange = null;
                try {
                    callback();
                } catch (e) {
                    console.error(e);
                }
            }
        }
    } else {
        //标准的DOM浏览器
        script.onload = function () {
            try {
                callback();
            } catch (e) {
                console.error(e);
            }
        }
    }
}

var loadedNum = 0;
function onLoading() {
    loadedNum++;
    if (loadedNum < libs.length) {
        includeScript(libs[loadedNum], onLoading);
    } else {
        /**
         * {
         * "renderMode":, //引擎渲染模式，"canvas" 或者 "webgl"
         * "audioType": 0 //使用的音频类型，0:默认，1:qq audio，2:web audio，3:audio
         * "antialias": //WebGL模式下是否开启抗锯齿，true:开启，false:关闭，默认为false
         * "retina": //是否基于devicePixelRatio缩放画布
         * }
         **/
        egret.runEgret({renderMode: "webgl", audioType: 0});
    }
}

var loadingLanguage = {"loadingText_zh": "加载中  ", "loadingText_en": "Loading..."};
