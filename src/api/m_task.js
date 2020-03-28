import { connect }  from '../services/database'
import { ObjectID } from 'mongodb'

const collection = 'task'

// Este metodo es generico para CRUD
export const action = async (method = 'find', params = {}) => {
  console.log( `action [${method}] from collection ${collection}`)
  let result      = null
  let columns     = {}
  const keys      = Object.keys(params)
  if (keys.length > 0) columns = keys[0] === '_id' ? { _id: ObjectID(params._id) } : params
  const connection = await connect()
  if (!connection.status) return connection
  const col        = await connection.db.collection(collection)
  if (method === 'updateOne') {
    const { _id, ...oUpdate } = params
    result       = await col[method]({_id: ObjectID(_id)}, {$set : oUpdate })
  } else result  = await col[method](columns)
  const response = await keys[0] ? result : result.toArray()
  return response
}
