import "@babel/polyfill";
import app        from './server'
import config     from './utils/config'

const main = async () => {
  const server = await app.listen(process.env.PORT || config.port)
  console.log(`[${config.env}] Servidor Inicializado en el puerto [${server.address().port}]`)
}

main()