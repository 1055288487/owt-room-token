import * as memorycache from 'memory-cache';

export class Cache {

    put<T>(key: string, value: T, ts?: number) {
        memorycache.put(key, value, ts);
    }

    get<T>(key: string): T {
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

    remove(key: string) {
        memorycache.del(key);
    }
}

export default new Cache();