import { ObjectID } from 'mongodb';
export default class {
    /**
     * 创建文件夹，支持逐级创建,创建成功返回 true,失败返回 false
     * @param path 文件夹路径
     */
    static mkdir(path: string): Promise<boolean>;
    /**
     * 读取文件
     * @param path
     */
    static readFile<T>(path: string, encoding?: string): Promise<T>;
    /**
     *  删除文件
     * @param path 文件路径
     */
    static delete(path: string): Promise<boolean>;
    /**
     * 判断文件或者文件夹是否存在
     * @param path
     */
    static exists(path: string): Promise<boolean>;
    /**
     * 重命名文件
     * @param sourcePath 原文件路径
     * @param dest 目标文件路径
     */
    static rename(sourcePath: string, dest: string): Promise<boolean>;
    /**
     * 取MD5前5位生成路径 如：E96261B90BE7B1895E9193D9CB9AAC5A -> /E/9/6/2/6/
     * @param md5 32位md5
     */
    static md5toPath(md5: string): string;
    static uuid(len?: number): string;
    static uuidBySix(): string;
    static uuidByNine(): string;
    static md5(value: string): string;
    /**
     * 创建文件夹，支持逐级创建,创建成功返回 true,失败返回 false
     * @param path 文件夹路径
     */
    /**
   * 判断文件或者文件夹是否存在
   * @param path
   */
    static hashPassword(_password: string, _salt: string): string;
    static filterBody(value: any, allowFields?: string[]): void;
    /**
     * 字符串数组去重
     * @param items
     */
    static unique(items: string[]): string[];
    static filterQuery(value: any, allowFields?: string[]): void;
    static TryPrase(id: any): ObjectID | null;
    static renameFile(oldPath: string, newPath: string): Promise<any>;
    static date_format(timeStamp: number): string;
    static timestampToTime(timestamp: any): string;
    static timestampToHM(timestamp: any): string;
    static timestampToTiming(timestamp: any): Date;
    static timestampToYMD(timestamp: any): string;
    static removeDuplicates(data: any): any;
    static objKeySort(obj: any): any;
    static getToken(payload?: {}): any;
    static getJWTPayload(token: string): any;
    static getTime(n: number): number;
    static getDays(year: number, month: number): Number;
}
