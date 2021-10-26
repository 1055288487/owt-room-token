import * as crypto from 'crypto';
import { ObjectID } from 'mongodb';
import config from './config'
const fs = require('fs'),
  mkdirp = require('mkdirp'),
  { promisify } = require('util'),
  DEBUG = require('debug'),
  debug = DEBUG('fs:debug'),
  logError = DEBUG('fs:error');
const jwt = require('jsonwebtoken'); // 用于签发、解析`token`


const readFileAsync = promisify(fs.readFile),
  renameAsync = promisify(fs.rename),
  existsAsync = promisify(fs.exists),
  deleteAsync = promisify(fs.unlink),
  mkdirpAsync = promisify(mkdirp);

export default class {
  /**
   * 创建文件夹，支持逐级创建,创建成功返回 true,失败返回 false
   * @param path 文件夹路径
   */
  public static mkdir(path: string): Promise<boolean> {
    return this.exists(path).then((e: boolean) => {
      // debug('mkdir exists:%s - %s', path, e);
      if (e) return true;
      return mkdirpAsync(path).then((p: string) => {
        debug('mkdir %s success.', p);
        return true;
      }).catch((err: Error) => {
        logError('mkdir Error:%s', err);
        return false;
      });
    });
  }

  /**
   * 读取文件
   * @param path 
   */
  public static readFile<T>(path: string, encoding: string = 'utf8'): Promise<T> {
    return readFileAsync(path, { encoding: encoding, flag: 'r' }).then((data: T) => {
      return data;
    }).catch((err: Error) => {
      logError('readFile Error:%s', err);
      return null;
    });
  }

  /**
   *  删除文件
   * @param path 文件路径
   */
  public static delete(path: string): Promise<boolean> {
    return deleteAsync(path).then(() => true).catch((err: Error) => {
      logError('delete Error:%s', err);
      return false;
    });
  }

  /**
   * 判断文件或者文件夹是否存在
   * @param path 
   */
  public static exists(path: string): Promise<boolean> {
    return existsAsync(path);
  }

  /**
   * 重命名文件
   * @param sourcePath 原文件路径
   * @param dest 目标文件路径
   */
  public static rename(sourcePath: string, dest: string): Promise<boolean> {
    return renameAsync(sourcePath, dest).then(() => true).catch((err: Error) => {
      logError('rename error:%s', err);
      return false;
    });
  }

  /**
   * 取MD5前5位生成路径 如：E96261B90BE7B1895E9193D9CB9AAC5A -> /E/9/6/2/6/
   * @param md5 32位md5
   */
  public static md5toPath(md5: string): string {
    if (md5.length < 5) return '';
    let p = [],
      path = '';
    for (let i = 0; i < 5; i++)
      p.push(md5[i]);

    path = path + p.join('/');
    return '/' + path + '/';
  }

  public static uuid(len: number = 32): string {
    return crypto.randomBytes(len / 2).toString('hex');
  }

  public static uuidBySix(): string {
    return Math.random().toString().slice(-6);
  }

  public static uuidByNine(): string {
    return Math.random().toString().slice(-9);
  }

  public static md5(value: string): string {
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


  public static hashPassword(_password: string, _salt: string): string {
    return this.md5(_password + ':' + _salt);
  }

  public static filterBody(value: any, allowFields?: string[]) {
    if (!value) return;
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
  public static unique(items: string[]): string[] {
    let result: string[] = [];
    if (!items || !items.length) return result;
    items.forEach(item => {
      if (result.indexOf(item) === -1)
        result.push(item);
    })
    return result;
  }


  public static filterQuery(value: any, allowFields?: string[]) {
    if (!value) return;
    let keys = Object.keys(value);
    keys.forEach(e => {
      if ((allowFields && allowFields.indexOf(e) === -1) || value[e] === undefined || !value[e].length) {
        delete value[e];
      }
    });
  }

  public static TryPrase(id: any) {
    if (!id) return null;
    if (!ObjectID.isValid(id)) return null;
    if (id instanceof ObjectID) return id;
    return new ObjectID(id);
  }

  public static async renameFile(oldPath: string, newPath: string) {
    return await fs.renameSync(oldPath, newPath)
  }

  // 时间戳转时分秒
  public static date_format(timeStamp: number) {
    // 总秒数
    let second = Math.floor(timeStamp / 1000);
    // 天数
    let day = Math.floor(second / 3600 / 24);
    // 小时
    let hr: any = Math.floor(second / 3600 % 24);
    if ((hr + '').length < 2) {
      hr = '0' + hr
    }
    // 分钟
    let min: any = Math.floor(second / 60 % 60);
    if ((min + '').length < 2) {
      min = '0' + min
    }
    // 秒
    let sec: any = Math.floor(second % 60);
    if ((sec + '').length < 2) {
      sec = '0' + sec
    }
    if (!day) {
      return hr + ':' + min + ':' + sec;
    }
    // return day + '天' + hr + '小时' + min + '分钟' + sec + '秒';
    return day + ':' + hr + ':' + min + ':' + sec;
  }


  // 时间戳转年月日
  public static timestampToTime(timestamp: any) {
    let date = new Date(timestamp); // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let Y = date.getFullYear() + '' + '-';
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '' + '-';
    if (M.length === 1) {
      M = '0' + M
    }
    let D = date.getDate() + ' ';
    if (D.length === 2) {
      D = '0' + D
    }
    let h = date.getHours() + '' + ':';
    if (h.length === 1) {
      h = '0' + h
    }
    let m = date.getMinutes() + '';
    if (m.length === 1) {
      m = '0' + m
    }
    //     s = date.getSeconds();
    return Y + M + D + h + m; // 时分秒可以根据自己的需求加上
  }

  public static timestampToHM(timestamp: any) {
    let date = new Date(timestamp);
    let h = date.getHours() + '' + ':';
    if (h.length === 1) {
      h = '0' + h
    }
    let m = date.getMinutes() + '';
    if (m.length === 1) {
      m = '0' + m
    }
    return h + m;
  }

  public static timestampToTiming(timestamp: any) {
    let date = new Date(timestamp); // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let Y = date.getFullYear();
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    let D = date.getDate();
    let h = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();
    return new Date(Y, Number(M) - 1, D, h, m, s)
  }

  public static timestampToYMD(timestamp: any) {
    let date = new Date(timestamp); // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let Y = date.getFullYear() + '' + '-';
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '' + '-';
    if (M.length === 1) {
      M = '0' + M
    }
    let D = date.getDate() + '';
    if (D.length === 1) {
      D = '0' + D
    }
    return Y + M + D; // 时分秒可以根据自己的需求加上
  }


  public static removeDuplicates(data: any) {
    let hash: any = {};
    let arr = data.reduce(function (item: any, next: any) {
      hash[next.id] ? '' : hash[next.id] = true && item.push(next);
      return item
    }, [])
    return arr
  }

  public static objKeySort(obj: any) {
    let newkey = Object.keys(obj).sort();
    let newObj: any = {};
    for (let i = 0; i < newkey.length; i++) {
      newObj[newkey[i]] = obj[newkey[i]];
    }
    return newObj;
  }

  public static getToken(payload = {}) {
    return jwt.sign(payload, config.secret, { expiresIn: '720h' });
  }

  public static getJWTPayload(token: string) {
    // 验证并解析JWT
    return jwt.verify(token.split(' ')[1], config.secret);
  }

  public static getTime(n: number) {
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
    } else {
      n = n + day;
    }
    if (day) {
      // 这个判断是为了解决跨年的问题
      if (month > 1) {
        month = month;
      } else {
        year = year - 1;
        month = 12;
      }
    }
    now.setDate(now.getDate() - n);
    return now.getTime();
  }

  public static getDays(year: number, month: number): Number {

    if (month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12) {
      return 31
    } else if (month === 4 || month === 6 || month === 9 || month === 11) {
      return 30
    } else if (month === 2) {
      if ((year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0)) {
        return 29
      } else {
        return 28
      }
    }
    return 31
  }
}