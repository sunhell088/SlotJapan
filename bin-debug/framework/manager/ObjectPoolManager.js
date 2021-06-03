var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var ObjectPoolManager = (function () {
    function ObjectPoolManager() {
        this._UsedPool = {}; //使用中的对象
        this._IdlePool = {}; //未使用的对象
    }
    Object.defineProperty(ObjectPoolManager, "instance", {
        get: function () {
            if (!ObjectPoolManager._instance)
                ObjectPoolManager._instance = new ObjectPoolManager();
            return ObjectPoolManager._instance;
        },
        enumerable: true,
        configurable: true
    });
    //根据类型获得池里的对象
    ObjectPoolManager.getObject = function (objectClass) {
        return ObjectPoolManager.instance.getObject(objectClass);
    };
    //归还对象
    ObjectPoolManager.backObject = function (obj) {
        ObjectPoolManager.instance.backObject(obj);
    };
    ObjectPoolManager.prototype.getObject = function (objectClass) {
        var className = egret.getQualifiedClassName(objectClass);
        if (!this._IdlePool[className]) {
            this._IdlePool[className] = {};
        }
        var subIdlePool = this._IdlePool[className];
        if (!this._UsedPool[className]) {
            this._UsedPool[className] = {};
        }
        var subUsedPool = this._UsedPool[className];
        var obj;
        for (var key in subIdlePool) {
            obj = subIdlePool[key];
            break;
        }
        if (obj) {
            //从idle移除，往used里添加
            delete subIdlePool[obj.hashc];
            subUsedPool[obj.hashc] = obj;
        }
        else {
            obj = new objectClass();
            //往used里添加
            subUsedPool[obj.hashc] = obj;
        }
        return obj;
    };
    ObjectPoolManager.prototype.backObject = function (obj) {
        var className = egret.getQualifiedClassName(obj);
        if (!this._IdlePool[className]) {
            this._IdlePool[className] = {};
        }
        var subIdlePool = this._IdlePool[className];
        if (!this._UsedPool[className]) {
            this._UsedPool[className] = {};
        }
        var subUsedPool = this._UsedPool[className];
        //是否正确的存在在 已使用的池里
        var bExist = false;
        for (var key in subUsedPool) {
            if (subUsedPool[key].hashc == obj.hashc) {
                bExist = true;
                break;
            }
        }
        if (bExist) {
            //从used移除，往idle里添加
            delete subUsedPool[obj.hashc];
            subIdlePool[obj.hashc] = obj;
        }
        else {
            egret.error("Object is not exist in used pool! hashCode=" + obj.hashc);
        }
    };
    return ObjectPoolManager;
}());
__reflect(ObjectPoolManager.prototype, "ObjectPoolManager");
//# sourceMappingURL=ObjectPoolManager.js.map