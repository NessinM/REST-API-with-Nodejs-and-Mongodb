import MongoClient from 'mongodb'
import config      from '../utils/config'
import general     from '../utils/general'

export const connect = async () => {
  let response  = {}
  try {
    const client    = await MongoClient.connect(config.mongodb.url, config.mongodb.use)
    const db        = client.db(config.mongodb.name)
    response.status = 1
    response.db     = db
  } catch(e) {
    response = general.trowError(`Error al intentar conectar con la BD ${config.mongodb.name}, Verificar si los servicios de MongoDB se encuentran Inicializados`)
  } finally {
    return response
  }
}