var environment = process.env.NODE_ENV || 'production';
var config = {
  production: {
    port         : 4000,
    env          : environment,
    dev          : false,
    secret       : 'app_2021!',
    mongodb : {
      url : 'mongodb://localhost:27017',
      name: 'self_service',
      use : {
        useUnifiedTopology: true,
        useNewUrlParser   : true
      }
    },
    auth : {
      bcrypt : {
        salt : 8
      }
    }
  },
  development: {
    port             : 4000,
    env              : environment,
    dev              : true,
    secret           : 'app_2021!',
    api_router_client: 'http://localhost:8080',
    mongodb          : {
      url : 'mongodb://localhost:27017',
      name: 'self_service',
      use : {
        useUnifiedTopology: true,
        useNewUrlParser   : true
      }
    },
    cryptojs : {
      secret : 'self_service_2021'
    },
    auth : {
      mails : {
        nalvarado : {
          user    : "nalvarado@datacont.com",
          password: "kirati#12",
          host    : "webmail.datacont.com",
          tls     : true
        }
      },
      bcrypt : {
        salt : 8
      }
    },
    empresa : {
      logo  : 'http://sil.datacont.com/static/logo.png',
      nombre: 'DATACONT SAC',
      color : '#b80813'
    }
  }
};
export default config[environment];
