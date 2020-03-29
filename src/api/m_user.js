import { connect }  from '../services/database'
import general      from '../utils/general'
import { ObjectID } from 'mongodb'

const collection = 'user'

export const action = async (method = 'find', params = {}) => {
  console.log( `action [${method}] of collection ${collection} parameters ${JSON.stringify(params)}`)
  let resultado      = null
  let columns     = {}
  const keys      = Object.keys(params)
  if (keys.length > 0) {
    if ( keys[0] === '_id') {
      const length = params._id.length
      if (length > 24 ) return [{...general.trowError( `[${length}] Error : El argumento pasado debe ser una sola cadena de 24 caracteres hexadecimales`)}]
      columns = {_id: ObjectID(params._id) }
    } else columns = params
  }
  let connection = await connect()
  if (connection.status === 0) {
    const response = [ {...connection } ]
    return response
  } else {
    const col        = await connection.db.collection(collection)
    if (method === 'updateOne') {
      const {_id, ...oUpdate} = params
      resultado       = await col[method]({_id : columns._id}, {$set : oUpdate })
    } else resultado  = await col[method](columns)
    if (resultado) {
      const response = [
        {
          status : 1,
          data : keys[0] ? await resultado : await resultado.toArray()
        }
      ]
      return response
    } else return [{...general.trowError(`Ningún dato encontrado en la BD : datos enviados  ${JSON.stringify(params)}`)}]
  }
}
