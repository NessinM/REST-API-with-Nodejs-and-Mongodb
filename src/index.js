import "@babel/polyfill";
import app        from './server'
import config     from './utils/config'

const main = async () => {
  const port = process.env.PORT || config.port
  await app.listen(port);
  console.log(`Servidor Inicializado en entorno ${config.env} en el puerto ${port}`);
}

main()