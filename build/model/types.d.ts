import * as Router from 'koa-router';
declare global {
    /**
     * 路由注册
     */
    interface IRouter {
        init(router: Router): void;
    }
    interface IResult<T> {
        ret: number;
        msg: string;
        data?: any;
    }
}
export {};
