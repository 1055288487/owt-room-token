export declare class Cache {
    put<T>(key: string, value: T, ts?: number): void;
    get<T>(key: string): T;
    remove(key: string): void;
}
declare const _default: Cache;
export default _default;
