import MongoClient from 'mongodb'
import config      from '../utils/config'

export const connect = async () => {
  let response  = {}
  try {
    const client    = await MongoClient.connect(config.mongodb.url, config.mongodb.use)
    const db        = client.db(config.mongodb.name)
    response.status = 1
    response.db     = db
  } catch(e) {
    response =  { status : 0, message : `Error al intentar conectar con la BD ${config.mongodb.name}, Verificar si los servicios de MongoDB se encuentrán Inicializados, de no ser asi ejecutar (mongod)` }
  } finally {
    return response
  }
}