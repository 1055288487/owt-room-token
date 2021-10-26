"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
const mongodb_1 = require("mongodb");
const config_1 = require("./config");
const fs = require('fs'), mkdirp = require('mkdirp'), { promisify } = require('util'), DEBUG = require('debug'), debug = DEBUG('fs:debug'), logError = DEBUG('fs:error');
const jwt = require('jsonwebtoken'); // 用于签发、解析`token`
const readFileAsync = promisify(fs.readFile), renameAsync = promisify(fs.rename), existsAsync = promisify(fs.exists), deleteAsync = promisify(fs.unlink), mkdirpAsync = promisify(mkdirp);
class default_1 {
    /**
     * 创建文件夹，支持逐级创建,创建成功返回 true,失败返回 false
     * @param path 文件夹路径
     */
    static mkdir(path) {
        return this.exists(path).then((e) => {
            // debug('mkdir exists:%s - %s', path, e);
            if (e)
                return true;
            return mkdirpAsync(path).then((p) => {
                debug('mkdir %s success.', p);
                return true;
            }).catch((err) => {
                logError('mkdir Error:%s', err);
                return false;
            });
        });
    }
    /**
     * 读取文件
     * @param path
     */
    static readFile(path, encoding = 'utf8') {
        return readFileAsync(path, { encoding: encoding, flag: 'r' }).then((data) => {
            return data;
        }).catch((err) => {
            logError('readFile Error:%s', err);
            return null;
        });
    }
    /**
     *  删除文件
     * @param path 文件路径
     */
    static delete(path) {
        return deleteAsync(path).then(() => true).catch((err) => {
            logError('delete Error:%s', err);
            return false;
        });
    }
    /**
     * 判断文件或者文件夹是否存在
     * @param path
     */
    static exists(path) {
        return existsAsync(path);
    }
    /**
     * 重命名文件
     * @param sourcePath 原文件路径
     * @param dest 目标文件路径
     */
    static rename(sourcePath, dest) {
        return renameAsync(sourcePath, dest).then(() => true).catch((err) => {
            logError('rename error:%s', err);
            return false;
        });
    }
    /**
     * 取MD5前5位生成路径 如：E96261B90BE7B1895E9193D9CB9AAC5A -> /E/9/6/2/6/
     * @param md5 32位md5
     */
    static md5toPath(md5) {
        if (md5.length < 5)
            return '';
        let p = [], path = '';
        for (let i = 0; i < 5; i++)
            p.push(md5[i]);
        path = path + p.join('/');
        return '/' + path + '/';
    }
    static uuid(len = 32) {
        return crypto.randomBytes(len / 2).toString('hex');
    }
    static uuidBySix() {
        return Math.random().toString().slice(-6);
    }
    static uuidByNine() {
        return Math.random().toString().slice(-9);
    }
    static md5(value) {
        return crypto.createHash('md5').update(value).digest('hex');
    }
    /**
     * 创建文件夹，支持逐级创建,创建成功返回 true,失败返回 false
     * @param path 文件夹路径
     */
    // public static mkdir(path: string): Promise<boolean> {
    //   return this.exists(path).then((e: boolean) => {
    //     debug('mkdir exists:%s - %s', path, e);
    //     if (e) return true;
    //     return mkdirpAsync(path).then((p: string) => {
    //       debug('mkdir %s success.', p);
    //       return true;
    //     }).catch((err: Error) => {
    //       logError('mkdir Error:%s', err);
    //       return false;
    //     });
    //   });
    // }
    /**
   * 判断文件或者文件夹是否存在
   * @param path
   */
    // public static exists(path: string): Promise<boolean> {
    //   return existsAsync(path);
    // }
    static hashPassword(_password, _salt) {
        return this.md5(_password + ':' + _salt);
    }
    static filterBody(value, allowFields) {
        if (!value)
            return;
        let keys = Object.keys(value);
        keys.forEach(e => {
            if ((allowFields && allowFields.indexOf(e) === -1) || value[e] === undefined) {
                delete value[e];
            }
        });
    }
    /**
     * 字符串数组去重
     * @param items
     */
    static unique(items) {
        let result = [];
        if (!items || !items.length)
            return result;
        items.forEach(item => {
            if (result.indexOf(item) === -1)
                result.push(item);
        });
        return result;
    }
    static filterQuery(value, allowFields) {
        if (!value)
            return;
        let keys = Object.keys(value);
        keys.forEach(e => {
            if ((allowFields && allowFields.indexOf(e) === -1) || value[e] === undefined || !value[e].length) {
                delete value[e];
            }
        });
    }
    static TryPrase(id) {
        if (!id)
            return null;
        if (!mongodb_1.ObjectID.isValid(id))
            return null;
        if (id instanceof mongodb_1.ObjectID)
            return id;
        return new mongodb_1.ObjectID(id);
    }
    static renameFile(oldPath, newPath) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield fs.renameSync(oldPath, newPath);
        });
    }
    // 时间戳转时分秒
    static date_format(timeStamp) {
        // 总秒数
        let second = Math.floor(timeStamp / 1000);
        // 天数
        let day = Math.floor(second / 3600 / 24);
        // 小时
        let hr = Math.floor(second / 3600 % 24);
        if ((hr + '').length < 2) {
            hr = '0' + hr;
        }
        // 分钟
        let min = Math.floor(second / 60 % 60);
        if ((min + '').length < 2) {
            min = '0' + min;
        }
        // 秒
        let sec = Math.floor(second % 60);
        if ((sec + '').length < 2) {
            sec = '0' + sec;
        }
        if (!day) {
            return hr + ':' + min + ':' + sec;
        }
        // return day + '天' + hr + '小时' + min + '分钟' + sec + '秒';
        return day + ':' + hr + ':' + min + ':' + sec;
    }
    // 时间戳转年月日
    static timestampToTime(timestamp) {
        let date = new Date(timestamp); // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
        let Y = date.getFullYear() + '' + '-';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '' + '-';
        if (M.length === 1) {
            M = '0' + M;
        }
        let D = date.getDate() + ' ';
        if (D.length === 2) {
            D = '0' + D;
        }
        let h = date.getHours() + '' + ':';
        if (h.length === 1) {
            h = '0' + h;
        }
        let m = date.getMinutes() + '';
        if (m.length === 1) {
            m = '0' + m;
        }
        //     s = date.getSeconds();
        return Y + M + D + h + m; // 时分秒可以根据自己的需求加上
    }
    static timestampToHM(timestamp) {
        let date = new Date(timestamp);
        let h = date.getHours() + '' + ':';
        if (h.length === 1) {
            h = '0' + h;
        }
        let m = date.getMinutes() + '';
        if (m.length === 1) {
            m = '0' + m;
        }
        return h + m;
    }
    static timestampToTiming(timestamp) {
        let date = new Date(timestamp); // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
        let Y = date.getFullYear();
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
        let D = date.getDate();
        let h = date.getHours();
        let m = date.getMinutes();
        let s = date.getSeconds();
        return new Date(Y, Number(M) - 1, D, h, m, s);
    }
    static timestampToYMD(timestamp) {
        let date = new Date(timestamp); // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
        let Y = date.getFullYear() + '' + '-';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '' + '-';
        if (M.length === 1) {
            M = '0' + M;
        }
        let D = date.getDate() + '';
        if (D.length === 1) {
            D = '0' + D;
        }
        return Y + M + D; // 时分秒可以根据自己的需求加上
    }
    static removeDuplicates(data) {
        let hash = {};
        let arr = data.reduce(function (item, next) {
            hash[next.id] ? '' : hash[next.id] = true && item.push(next);
            return item;
        }, []);
        return arr;
    }
    static objKeySort(obj) {
        let newkey = Object.keys(obj).sort();
        let newObj = {};
        for (let i = 0; i < newkey.length; i++) {
            newObj[newkey[i]] = obj[newkey[i]];
        }
        return newObj;
    }
    static getToken(payload = {}) {
        return jwt.sign(payload, config_1.default.secret, { expiresIn: '720h' });
    }
    static getJWTPayload(token) {
        // 验证并解析JWT
        return jwt.verify(token.split(' ')[1], config_1.default.secret);
    }
    static getTime(n) {
        let now = new Date();
        let year = now.getFullYear();
        // 因为月份是从0开始的,所以获取这个月的月份数要加1才行
        let month = now.getMonth() + 1;
        // let date = now.getDate();
        let day = now.getDay();
        // console.log(date);
        // 判断是否为周日,如果不是的话,就让今天的day-1(例如星期二就是2-1)
        if (day !== 0) {
            n = n + (day - 1);
        }
        else {
            n = n + day;
        }
        if (day) {
            // 这个判断是为了解决跨年的问题
            if (month > 1) {
                month = month;
            }
            else {
                year = year - 1;
                month = 12;
            }
        }
        now.setDate(now.getDate() - n);
        return now.getTime();
    }
    static getDays(year, month) {
        if (month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12) {
            return 31;
        }
        else if (month === 4 || month === 6 || month === 9 || month === 11) {
            return 30;
        }
        else if (month === 2) {
            if ((year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0)) {
                return 29;
            }
            else {
                return 28;
            }
        }
        return 31;
    }
}
exports.default = default_1;
//# sourceMappingURL=util.js.map