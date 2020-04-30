var email  = require('emailjs')
  , pug    = require('pug')
  , config = require('../utils/config').default
  , path   = require('path')
  ;

var send = function(obj, callback) {
  var nombreFull = config.empresa.nombre
  obj.logo       = config.empresa.logo
  obj.data.logo  = config.empresa.logo
  obj.data.color = config.empresa.color

  var server        = email.server.connect(config.auth.mails.nalvarado)
  var plantillaMail = path.join(process.cwd(), 'template_mail', `${obj.template}.pug`);
  var options       = { obj: obj.data }

  var body = pug.renderFile(plantillaMail, options);

  if (config.dev)  obj.to = 'nalvarado@datacont.com'

  var mensaje =   {
    text      : `${obj.prefix} ${obj.subject}`,
    from      : `SELF SERVICE ${nombreFull} `,
    to        : obj.to,
    bcc       : obj.bcc,
    subject   : `${obj.subject}`,
    attachment:
    [
      {
        data       : body,
        alternative: true
      }
    ]
  }

  server.send(mensaje, (err, message)  => {
    err ? callback(err) : callback()
  })
}

exports.send = send