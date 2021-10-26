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
exports.OwtController = void 0;
const Joi = require("joi");
const BaseController_1 = require("./BaseController");
const config_1 = require("../config");
const validate = require('koa2-validation'); // 1. import the koa2-validation
// const icsREST = require('nuve');
const icsREST = require('owt_api');
icsREST.API.init(config_1.default.owt.superserviceID, config_1.default.owt.superserviceKey, config_1.default.owt.api, false);
class OwtController extends BaseController_1.BaseController {
    init(router) {
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
        router.get('/owt/detail', validate({}), this.detail);
    }
    createRoom(ctx) {
        const _super = Object.create(null, {
            ok: { get: () => super.ok }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let name = ctx.request.body.name;
            let options = { views: [] };
            icsREST.API.init(config_1.default.owt.superserviceID, config_1.default.owt.superserviceKey, config_1.default.owt.api, false);
            return new Promise((resolve, reject) => {
                icsREST.API.getRooms({ page: 1, per_page: 1000000 }, function (rooms) {
                    if (rooms && rooms.length > 0) {
                        let names = rooms.map((e) => e.name);
                        if (names.indexOf(name) > -1) {
                            for (let i of rooms) {
                                if (i.name === name) {
                                    resolve(i);
                                }
                            }
                            // resolve(rooms.map((e: any) => e.name === name))
                        }
                        else {
                            icsREST.API.createRoom(name, options, function (response) {
                                resolve(response);
                            }, function (e) {
                                reject(e);
                            });
                        }
                    }
                    else {
                        icsREST.API.createRoom(name, options, function (response) {
                            resolve(response);
                        }, function (e) {
                            reject(e);
                        });
                    }
                    // resolve(rooms)
                }, function (err) {
                    reject(err);
                });
            })
                .then((roomID) => {
                ctx.body = _super.ok.call(this, roomID);
            });
        });
    }
    createToken(ctx) {
        const _super = Object.create(null, {
            ok: { get: () => super.ok }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let room = ctx.request.body.room || 'sampleRoom', username = ctx.request.body.username, role = ctx.request.body.role;
            let preference = { isp: 'isp', region: 'region' };
            return new Promise((resolve, reject) => {
                icsREST.API.createToken(room, username, role, preference, function (token) {
                    resolve(token);
                }, (e) => {
                    reject(e);
                });
            }).then((token) => {
                ctx.body = _super.ok.call(this, token);
            });
        });
    }
    detail(ctx) {
        const _super = Object.create(null, {
            ok: { get: () => super.ok }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return ctx.body = _super.ok.call(this, {
                iceServers: ["stun:47.104.154.192:3478"],
                fluent: {
                    "resolution": "176*144",
                    "bitrate": 200,
                    "frameRate": 5 // 帧率
                },
                SD: {
                    "resolution": "640*480",
                    "bitrate": 800,
                    "frameRate": 15
                },
                HD: {
                    "resolution": "1080*720",
                    "bitrate": 2000,
                    "frameRate": 30
                }
            });
        });
    }
}
exports.OwtController = OwtController;
exports.default = new OwtController();
//# sourceMappingURL=OwtController.js.map