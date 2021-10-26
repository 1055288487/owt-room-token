"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cache = void 0;
const memorycache = require("memory-cache");
class Cache {
    put(key, value, ts) {
        memorycache.put(key, value, ts);
    }
    get(key) {
        console.log('get cache key:', key);
        return memorycache.get(key);
    }
    //   async  getOrAdd<T>(key: string, addFun: () => T) {
    //         let result = this.get<T>(key);
    //         if (result) return result;
    //         result = await addFun();
    //         this.put(key, result);
    //         return result;
    //     }
    remove(key) {
        memorycache.del(key);
    }
}
exports.Cache = Cache;
exports.default = new Cache();
//# sourceMappingURL=cache.js.map