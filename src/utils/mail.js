var email  = require('emailjs')
  , pug    = require('pug')
  , config = require('../utils/config').default
  , path   = require('path')
  ;

var send = function({ data, template, to, prefix, subject, bcc,  }, callback) {
  var server        = email.server.connect(config.auth.mails.config)
  var plantillaMail = path.join(process.cwd(), 'template_mail', `${template}.pug`);
  var options       = { obj: data }

  var body = pug.renderFile(plantillaMail, options);

  if (config.dev)  to = 'nalvarado@datacont.com'

  var mensaje =   {
    text      : `${prefix} ${subject}`,
    from      : `LIATRIS HR ${nombreFull}`,
    to        : to,
    bcc       : bcc,
    subject   : subject,
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