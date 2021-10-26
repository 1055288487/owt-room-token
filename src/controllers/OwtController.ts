import * as koa from 'koa';
import * as Router from 'koa-router';
import * as Joi from 'joi';
import { BaseController } from './BaseController';
import config from '../config'
const validate = require('koa2-validation'); // 1. import the koa2-validation
// const icsREST = require('nuve');
const icsREST = require('owt_api');
icsREST.API.init(config.owt.superserviceID, config.owt.superserviceKey, config.owt.api, false);

export class OwtController extends BaseController implements IRouter {

    init(router: Router): void {
        // 'body', 'query', 'params'

        router.post('/owt/createRoom', validate({
            body: {
                name: Joi.string().required(),
            }
        }), this.createRoom);

        router.post('/owt/createToken', validate({
            // params: {
            //     id: Joi.string().required(),
            // },
            body: {
                room: Joi.string().required(),
                username: Joi.string().required(),
                role: Joi.string().required(),
            }
        }), this.createToken);

        router.get('/owt/detail', validate({
        }), this.detail);


    }


    async createRoom(ctx: koa.Context) {
        let name = ctx.request.body.name;
        let options = { views: [] };
        icsREST.API.init(config.owt.superserviceID, config.owt.superserviceKey, config.owt.api, false);
        return new Promise((resolve, reject) => {
            icsREST.API.getRooms({ page: 1, per_page: 1000000 }, function (rooms: any) {
                if (rooms && rooms.length > 0) {
                    let names = rooms.map((e: any) => e.name)
                    if (names.indexOf(name) > -1) {
                        for (let i of rooms) {
                            if (i.name === name) {
                                resolve(i)
                            }
                        }
                        // resolve(rooms.map((e: any) => e.name === name))
                    } else {
                        icsREST.API.createRoom(name, options, function (response: any) {
                            resolve(response)
                        }, function (e: Error) {
                            reject(e)
                        });
                    }
                } else {
                    icsREST.API.createRoom(name, options, function (response: any) {
                        resolve(response)
                    }, function (e: Error) {
                        reject(e)
                    });
                }
                // resolve(rooms)
            }, function (err: Error) {
                reject(err);
            });

        })
            .then((roomID: any) => {
                ctx.body = super.ok(roomID)
            })
    }



    async createToken(ctx: koa.Context) {
        let room = ctx.request.body.room || 'sampleRoom',
            username = ctx.request.body.username,
            role = ctx.request.body.role;
        let preference = { isp: 'isp', region: 'region' };
        return new Promise((resolve, reject) => {
            icsREST.API.createToken(room, username, role, preference, function (token: any) {
                resolve(token)
            }, (e: Error) => {
                reject(e)
            })
        }).then((token: any) => {
            ctx.body = super.ok(token)
        })
    }

    async detail(ctx: koa.Context) {
        return ctx.body = super.ok({
            iceServers: ["stun:47.104.154.192:3478"],
            fluent: {  // 流畅
                "resolution": "176*144",   // 分辨率
                "bitrate": 200,   // 码率
                "frameRate": 5   // 帧率
            },
            SD: {   // 标清
                "resolution": "640*480",
                "bitrate": 800,
                "frameRate": 15
            },
            HD: {    // 高清
                "resolution": "1080*720",
                "bitrate": 2000,
                "frameRate": 30
            }
        })
    }



}

export default new OwtController();