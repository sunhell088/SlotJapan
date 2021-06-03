/**
 * 对象池管理类和接口
 */
interface IPoolObject {
    hashc:number; //hashCode
    dispose():void; //释放对象内部引用
}

class ObjectPoolManager {
    private static _instance:ObjectPoolManager;

    private _UsedPool:Object = {}; //使用中的对象
    private _IdlePool:Object = {}; //未使用的对象

    public static get instance():ObjectPoolManager {
        if (!ObjectPoolManager._instance)
            ObjectPoolManager._instance = new ObjectPoolManager();
        return ObjectPoolManager._instance;
    }

    //根据类型获得池里的对象
    public static getObject(objectClass:any):IPoolObject {
        return ObjectPoolManager.instance.getObject(objectClass);
    }

    //归还对象
    public static backObject(obj:IPoolObject):void {
        ObjectPoolManager.instance.backObject(obj);
    }

    private getObject(objectClass:any):IPoolObject {
        var className:string = egret.getQualifiedClassName(objectClass);
        if (!this._IdlePool[className]) {
            this._IdlePool[className] = {};
        }
        var subIdlePool:{} = this._IdlePool[className];

        if (!this._UsedPool[className]) {
            this._UsedPool[className] = {};
        }
        var subUsedPool:{} = this._UsedPool[className];

        var obj:IPoolObject;
        for (var key in subIdlePool) {
            obj = subIdlePool[key];
            break;
        }
        if (obj) {
            //从idle移除，往used里添加
            delete subIdlePool[obj.hashc];
            subUsedPool[obj.hashc] = obj;
        } else {
            obj = new objectClass();
            //往used里添加
            subUsedPool[obj.hashc] = obj;
        }
        return obj;
    }

    private backObject(obj:IPoolObject):void {
        var className:string = egret.getQualifiedClassName(obj);
        if (!this._IdlePool[className]) {
            this._IdlePool[className] = {};
        }
        var subIdlePool:{} = this._IdlePool[className];

        if (!this._UsedPool[className]) {
            this._UsedPool[className] = {};
        }
        var subUsedPool:{} = this._UsedPool[className];

        //是否正确的存在在 已使用的池里
        var bExist:boolean = false;
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
        } else {
            egret.error("Object is not exist in used pool! hashCode=" + obj.hashc);
        }
    }
}