import * as koa from 'koa';
import * as Router from 'koa-router';
import { BaseController } from './BaseController';
export declare class OwtController extends BaseController implements IRouter {
    init(router: Router): void;
    createRoom(ctx: koa.Context): Promise<void>;
    createToken(ctx: koa.Context): Promise<void>;
    detail(ctx: koa.Context): Promise<IResult<{
        iceServers: string[];
        fluent: {
            resolution: string;
            bitrate: number;
            frameRate: number;
        };
        SD: {
            resolution: string;
            bitrate: number;
            frameRate: number;
        };
        HD: {
            resolution: string;
            bitrate: number;
            frameRate: number;
        };
    }>>;
}
declare const _default: OwtController;
export default _default;
