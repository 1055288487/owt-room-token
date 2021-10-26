export default {
  server: { port: 3003 },
  codeExpire: 180000,
  secret: 'secret',
  uploadDir: './../storage/',
  maxFileSize: 20971520,
  tempFileSize: 52428800,
  loginApi: '/api/v1/user/login',
  meetingReminderTime: 300000,
  isEmail: /^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/,
  mongodb: {
    connection: 'mongodb://localhost:27017/meeting'
  },
  owt: {
    api: 'http://localhost:3000/',
    superserviceID: '61776ef23bc39557d41c6079',
    superserviceKey: 'G35tGNeYHyn8cleKZkz0WfGWMgvzyBELM37+Oxs/dsTQ+nuriuO1oQzd7dyGk5DjsHu1JXnDDsqSDsJW6VvwYZJ9GfRGVrNAcRjm9JDPuhPJHdZD9GBng531HzgY4rTg/hvl5KhoDg9EjQAWzHXxOvQeGecnZAJ00XS2Nm7pt+k=',
    getMeetingFlow: 'https://localhost:3000/meeting/flow',
    getMeetingUserFlow: 'https://localhost:3000/user/flow',
    addService: 'http://localhost:3000/services/backstage',
    iceServices: 'http://localhost:3000/api',
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
  },
  iosVersion: {
    '1.1.0': 1
  }
};