var environment = process.env.NODE_ENV || 'production';
var config = {
  production: {
    port         : 4000,
    env          : environment,
    dev          : false,
    secret       : 'app_2021!',
    mongodb : {
      url : 'mongodb://localhost:27017',
      name: 'node-restapi',
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
    port         : 4000,
    env          : environment,
    dev          : true,
    secret       : 'app_2021!',
    mongodb : {
      url : 'mongodb://localhost:27017',
      name: 'node-restapi',
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
  }
};
module.exports = config[environment];