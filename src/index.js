import "@babel/polyfill"
require('dotenv').config()

import app        from './server'
import config     from './utils/config'

const main =  () => {
  // console.log(JSON.parse(process.env.HELLO))
  const server = app.listen(process.env.PORT || config.port)
  console.log(`[${config.env}] Servidor Inicializado  en el puerto [${server.address().port}]`)
}

main()