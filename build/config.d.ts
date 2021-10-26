declare const _default: {
    server: {
        port: number;
    };
    codeExpire: number;
    secret: string;
    uploadDir: string;
    maxFileSize: number;
    tempFileSize: number;
    loginApi: string;
    meetingReminderTime: number;
    isEmail: RegExp;
    mongodb: {
        connection: string;
    };
    owt: {
        api: string;
        superserviceID: string;
        superserviceKey: string;
        getMeetingFlow: string;
        getMeetingUserFlow: string;
        addService: string;
        iceServices: string;
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
    };
    iosVersion: {
        '1.1.0': number;
    };
};
export default _default;
