var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 常用的游戏内工具
 */
var CommonUtil = (function () {
    function CommonUtil() {
    }
    //数字发生改变时，先消失，再渐现
    CommonUtil.valueFadeTween = function (displayObj, bRemoveTween) {
        if (bRemoveTween === void 0) { bRemoveTween = true; }
        if (bRemoveTween) {
            egret.Tween.removeTweens(displayObj);
        }
        displayObj.alpha = 0;
        egret.Tween.get(displayObj).to({ alpha: 1 }, 1000).call(function () {
            if (bRemoveTween) {
                egret.Tween.removeTweens(this);
            }
        }, displayObj);
    };
    //放大消失的动画(bAppear：出现还是消失)
    CommonUtil.scaleFadeTween = function (displayObj, bAppear, bRemoveTween) {
        if (bRemoveTween === void 0) { bRemoveTween = true; }
        if (bRemoveTween) {
            egret.Tween.removeTweens(displayObj);
        }
        var scaleCoefficient = displayObj.scaleX - 1;
        var startScale = 0.68 + scaleCoefficient;
        displayObj.scaleX = displayObj.scaleY = startScale;
    };
    //老虎机格子的放大抖动效果
    CommonUtil.getSlotShakeTween = function (displayObj, bRemoveTween) {
        if (bRemoveTween === void 0) { bRemoveTween = true; }
        if (bRemoveTween) {
            egret.Tween.removeTweens(displayObj);
        }
        var scaleCoefficient = displayObj.scaleX - 1;
        var startScale = 0.68 + scaleCoefficient;
        var bigScale = 1.2 + scaleCoefficient;
        var normalScale = 1 + scaleCoefficient;
        var rotation = 2.5;
        displayObj.scaleX = displayObj.scaleY = startScale;
        egret.Tween.get(displayObj).to({
            scaleX: bigScale,
            scaleY: bigScale
        }, 200).to({
            scaleX: normalScale,
            scaleY: normalScale
        }, 100).to({
            scaleX: bigScale,
            scaleY: bigScale
        }, 100).to({
            scaleX: normalScale, scaleY: normalScale
        }, 100).to({
            rotation: -rotation
        }, 100).to({
            rotation: rotation
        }, 100).to({
            rotation: 0
        }, 100).wait(1500).call(function () {
            if (bRemoveTween) {
                egret.Tween.removeTweens(this);
            }
        }, displayObj);
    };
    CommonUtil.initWinLineColor = function (totalLine) {
        var color = 0x000000;
        var offsetColor = 0xffffff / totalLine;
        for (var i = 0; i < totalLine; i++) {
            color += offsetColor;
            GameUtil.winLineColor["pattern" + i] = color;
        }
    };
    CommonUtil.trans1ToA = function (num) {
        if (num < 0 || num >= CommonConst.SLOT_INDEX.length) {
            console.error("invalid num! num=" + num);
            return null;
        }
        return CommonConst.SLOT_INDEX[num];
    };
    //大于下注额30倍mega win 大于10倍 big win
    CommonUtil.getAwardLevel = function (betCount, awardCount) {
        var level = AWARD_LEVEL.NORMAL;
        if (awardCount >= betCount * 10) {
            if (awardCount < betCount * 30) {
                level = AWARD_LEVEL.BIG_WIN;
            }
            else {
                level = AWARD_LEVEL.MEGA_WIN;
            }
        }
        return level;
    };
    //播放粒子转圈特效
    CommonUtil.surroundParticleEffect = function (speedTag, bVisible, particleObj, startX, startY, trackArr, speed) {
        if (startX === void 0) { startX = -1; }
        if (startY === void 0) { startY = -1; }
        if (trackArr === void 0) { trackArr = null; }
        if (speed === void 0) { speed = 100; }
        if (bVisible) {
            particleObj.start();
            particleObj.emitterX = startX;
            particleObj.emitterY = startY;
            var tween = egret.Tween.get(particleObj, { loop: true });
            for (var i = 0; i < trackArr.length; i++) {
                tween.to(trackArr[i], speedTag ? speed / 1.5 : speed); //TODO 这里需要改为动态计算
            }
        }
        else {
            particleObj.stop();
            egret.Tween.removeTweens(particleObj);
            if (particleObj.parent) {
                particleObj.parent.removeChild(particleObj);
            }
        }
    };
    //超过10万 会对值/1000 向上取整
    CommonUtil.valueFormat1000 = function (value) {
        if (value > 100000) {
            return Math.ceil(value / 1000) + "K";
        }
        else {
            return this.valueFormatDecimals(value, 2) + "";
        }
    };
    //保留小数点后两位（但如果保留后和整数一样，则返回整数，如：1.01返回1.01 ， 1.001返回1,而不是返回1.00, 1.10返回1.1）
    CommonUtil.valueFormatDecimals = function (value, decimals) {
        //因为编译后value有可能传进来的是string
        value = +value;
        if (!value)
            return value;
        if (decimals == 0)
            return +value.toFixed(0);
        var preNum = null;
        var nextNum = null;
        for (var i = decimals; i >= 0; i--) {
            nextNum = value.toFixed(i);
            if (!preNum) {
                preNum = nextNum;
                continue;
            }
            if (nextNum != preNum) {
                return +preNum;
            }
        }
        return value;
    };
    //根据name关键字创建一个Bitmap对象
    CommonUtil.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        result.texture = RES.getRes(name);
        return result;
    };
    CommonUtil.loadTextureFromUrl = function (url, onLoadComplete, thisObj, tag) {
        if (tag === void 0) { tag = ""; }
        var loader = new egret.URLLoader();
        loader["tag"] = tag;
        loader.dataFormat = egret.URLLoaderDataFormat.TEXTURE;
        loader.addEventListener(egret.Event.COMPLETE, onLoadComplete, thisObj);
        var request = new egret.URLRequest(url);
        loader.load(request);
    };
    //获取url的参数
    CommonUtil.getAllParam = function (key) {
        if (key === void 0) { key = null; }
        if (egret.Capabilities.runtimeType != egret.RuntimeType.WEB)
            return {};
        var url = location.search;
        url = decodeURIComponent(url);
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            var strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                var tmpStrs = strs[i].split("=");
                if (tmpStrs.length > 2) {
                    var string = strs[i].split(tmpStrs[0] + "=");
                    theRequest[tmpStrs[0]] = string[1];
                }
                else {
                    theRequest[tmpStrs[0]] = tmpStrs[1];
                }
            }
        }
        if (key) {
            return theRequest[key];
        }
        else {
            return theRequest;
        }
    };
    //设置wing里创建的TweenGroup的循环播放
    CommonUtil.playTweenGroup = function (target, isLoop) {
        if (isLoop) {
            for (var key in target.items) {
                target.items[key].props = { loop: true };
            }
        }
        target.play(0);
    };
    //根据字符串获取相加后的unicode码
    CommonUtil.getStringUnicode = function (str) {
        var code = 0;
        for (var i = 0; i < str.length; i++) {
            code += str.charCodeAt(i);
        }
        return code;
    };
    //获得min和maxInclud之间的随机整数（包括minInclud，maxInclud）
    CommonUtil.randomInteger = function (minInclude, maxInclude, bInteger) {
        if (bInteger === void 0) { bInteger = true; }
        if (bInteger) {
            return parseInt(Math.random() * (maxInclude - minInclude + 1) + minInclude);
        }
        else {
            var Range = maxInclude - minInclude;
            var Rand = Math.random();
            var num = minInclude + Rand * Range;
            return num;
        }
    };
    //json to url
    CommonUtil.json2url = function (json) {
        var arr = [];
        for (var name in json) {
            arr.push(name + '=' + json[name]);
        }
        return arr.join('&');
    };
    //是否是数组
    CommonUtil.isArray = function (obj) {
        return Array.isArray(obj) || Object.prototype.toString.call(obj) === '[object Array]';
    };
    //是否是数字 
    CommonUtil.isNumber = function (value) {
        // isNaN()函数 把空串 空格 以及NUll 按照0来处理 所以先去除  
        if (value === "" || value == null)
            return false;
        if (value.indexOf(" ") >= 0 || value.indexOf("+") >= 0 || value.indexOf("-") >= 0)
            return false;
        if (!isNaN(value)) {
            return true;
        }
        else {
            return false;
        }
    };
    //copy文本到系统剪贴板
    CommonUtil.copy2Clipboard = function (text) {
        var input = document.createElement("input");
        input.value = text;
        document.body.appendChild(input);
        input.select();
        input.setSelectionRange(0, input.value.length);
        document.execCommand('Copy');
        document.body.removeChild(input);
        window.alert(Game.getLanguage("copy2Clipboard succuss"));
    };
    /**
     * 生成二维码 QR（Quick Response）code
     * msg ： 地址
     * width,height 二维码宽度，高度
     *
     * errorCorrectLevel:
     * level L : 最大 7% 的错误能够被纠正；
     * level M : 最大 15% 的错误能够被纠正；
     * level Q : 最大 25% 的错误能够被纠正；
     * level H : 最大 30% 的错误能够被纠正；
     *
     * typeNumber:
     * QR图的大小(size)被定义为版本（Version)，版本号从1到40。版本1就是一个21*21的矩阵，每增加一个版本号，矩阵的大小就增加4个模块(Module)，
     * 因此，版本40就是一个177*177的矩阵。（版本越高，意味着存储的内容越多，纠错能力也越强）。
     * color 颜色 0x111111 十六进制
     * */
    CommonUtil.createQR = function (url, width, height, typeNumer, errorCorrectLevel, color) {
        if (width === void 0) { width = 400; }
        if (height === void 0) { height = 400; }
        if (typeNumer === void 0) { typeNumer = 15; }
        if (errorCorrectLevel === void 0) { errorCorrectLevel = qr.QRErrorCorrectLevel.M; }
        if (color === void 0) { color = 0; }
        return qr.QRCode.create(url, width, height, errorCorrectLevel, typeNumer, color);
    };
    //临时接口，在界面上显示选择服务器、帐号、密码
    CommonUtil.showTestLoginEnter = function (ui) {
        ViewManager.instance.hideLoading();
        var webSocketAdrressConfig = {
            "131": "http://192.168.0.131:8080",
            "134": "http://192.168.0.134:8080",
            "out": "https://awg.aiwingaming.com:8181"
        };
        var group = new egret.DisplayObjectContainer();
        var serverIDInput = new eui.TextInput();
        serverIDInput.text = egret.localStorage.getItem("testServerType") ? egret.localStorage.getItem("testServerType") : "";
        serverIDInput.y = 100;
        var serverIDLab = new eui.Label("服务器类型（直接填代号：如 131 134 out）out 代表外网");
        serverIDLab.x = 350;
        serverIDLab.y = 100;
        var accountInput = new eui.TextInput();
        accountInput.text = egret.localStorage.getItem("testAccount") ? egret.localStorage.getItem("testAccount") : "";
        accountInput.y = 200;
        var accountLab = new eui.Label("帐号");
        accountLab.x = 350;
        accountLab.y = 200;
        var passwordInput = new eui.TextInput();
        passwordInput.text = egret.localStorage.getItem("testPassword") ? egret.localStorage.getItem("testPassword") : "";
        passwordInput.y = 300;
        var passwordLab = new eui.Label("密码");
        passwordLab.x = 350;
        passwordLab.y = 300;
        var loginBtn = new eui.Button();
        loginBtn.label = "登录";
        loginBtn.x = 200;
        loginBtn.y = 500;
        loginBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            var url = webSocketAdrressConfig[serverIDInput.text] + "/GameLobby/login.htm?operatorKey=Casino1&username=" + accountInput.text + "&password=" + passwordInput.text;
            WebUtil.load(url, "", function (data) {
                data = JSON.parse(data);
                if (data.code != 0) {
                    ViewManager.alert("登录失败！(错误码：" + data.code + ", 原因：" + data.message);
                    return;
                }
                //获取平台url参数
                Game.urlData.address = webSocketAdrressConfig[serverIDInput.text];
                Game.urlData.sessionKey = data.sessionKey;
                Game.urlData.operatorKey = data.operatorKey;
                Game.urlData.gameId = CommonConst.GAME_ID;
                MessageUtil.Login();
                group.parent.removeChild(group);
                egret.localStorage.setItem("testServerType", serverIDInput.text);
                egret.localStorage.setItem("testAccount", accountInput.text);
                egret.localStorage.setItem("testPassword", passwordInput.text);
            }, this, egret.HttpMethod.POST);
        }, null);
        var logoutBtn = new eui.Button();
        logoutBtn.label = "登出";
        logoutBtn.x = 400;
        logoutBtn.y = 500;
        logoutBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            var url = webSocketAdrressConfig[serverIDInput.text] + "/GameLobby/logout.htm?operatorKey=Casino1&username=" + accountInput.text + "&password=" + passwordInput.text;
            WebUtil.load(url);
        }, null);
        group.addChild(serverIDInput);
        group.addChild(accountInput);
        group.addChild(passwordInput);
        group.addChild(serverIDLab);
        group.addChild(accountLab);
        group.addChild(passwordLab);
        group.addChild(loginBtn);
        group.addChild(logoutBtn);
        group.x = 50;
        ui.addChild(group);
    };
    //一键jackpot freespin
    CommonUtil.testSlotResult = function () {
        var hintStr = null;
        window.addEventListener('keypress', function (e) {
            var status = -1;
            if (e.keyCode == 97) {
                status = 1;
                hintStr = "下一轮将获得FreeSpin";
            }
            else if (e.keyCode == 98) {
                status = 2;
                hintStr = "下一轮将必中奖";
            }
            else if (e.keyCode == 99) {
                status = 3;
                hintStr = "下一轮将获得Jackpot";
            }
            if (status == -1)
                return;
            if (hintStr != null)
                egret.log(hintStr);
            var url = Game.urlData.address + "/GameLobby/updateResult.game?operatorKey=Casino1&sessionKey=" + Game.urlData.sessionKey + "&gameKey=" + Game.urlData.gameId
                + "&status=" + status;
            WebUtil.load(url);
        }, false);
    };
    //打印带时间的日志
    CommonUtil.log = function (str, bTime) {
        if (bTime === void 0) { bTime = true; }
        if (bTime) {
            var date = new Date();
            var milliseconds = "" + date.getMilliseconds();
            var time = date.toLocaleString() + " " + milliseconds.substr(milliseconds.length - 3);
            egret.log(time + "   " + str);
        }
        else {
            egret.log(str);
        }
    };
    //对slot进行层次排序
    CommonUtil.setSlotLayer = function (spinGroup, forceTopSlotArr) {
        if (forceTopSlotArr === void 0) { forceTopSlotArr = null; }
        if (!CommonConst.B_SLOT_LAYER)
            return;
        var slotArr = [];
        for (var i = 0; i < (forceTopSlotArr ? forceTopSlotArr.length : spinGroup.numChildren); i++) {
            var slot = (forceTopSlotArr ? forceTopSlotArr[i] : spinGroup.getChildAt(i));
            slotArr.push({ slotLayer: slot.getLayer(), slotObj: slot });
        }
        var i = slotArr.length, j;
        var tempObj;
        while (i > 0) {
            for (j = 0; j < i - 1; j++) {
                if (slotArr[j].slotLayer > slotArr[j + 1].slotLayer) {
                    tempObj = slotArr[j];
                    slotArr[j] = slotArr[j + 1];
                    slotArr[j + 1] = tempObj;
                }
            }
            i--;
        }
        for (var key in slotArr) {
            spinGroup.setChildIndex(slotArr[key].slotObj, slotArr[key].slotLayer);
        }
    };
    //灰度滤镜
    CommonUtil.greyColorFlilter = new egret.ColorMatrixFilter([
        0.3, 0.6, 0, 0, 0,
        0.3, 0.6, 0, 0, 0,
        0.3, 0.6, 0, 0, 0,
        0, 0, 0, 1, 0
    ]);
    //调暗滤镜
    CommonUtil.darkColorFlilter = new egret.ColorMatrixFilter([
        0.6, 0, 0, 0, 0,
        0, 0.6, 0, 0, 0,
        0, 0, 0.6, 0, 0,
        0, 0, 0, 1, 0
    ]);
    return CommonUtil;
}());
__reflect(CommonUtil.prototype, "CommonUtil");
//# sourceMappingURL=CommonUtil.js.map