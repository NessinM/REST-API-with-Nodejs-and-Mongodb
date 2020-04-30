import { connect }  from "../services/database"
import { ObjectID } from "mongodb"

export const find = async (collection = ``, query = {} ) => {
  console.log(`MONGODB action  find from ${collection}`)
  const { status, db, message } = await connect()
  if (!status)  return [{ status, message }]
  else {
    let data = []
    await db.collection(collection).find(query).toArray()
            .then((result) => data = result )
            .catch((err) => console.error(`Error al encontrar el documento : ${err}`))
    return [{ status,  data }]
  }
}

export const findOne = async (collection = ``, query = {} ) => {
  console.log(`MONGODB action  findOne from ${collection}`)
  const { status, db, message } = await connect()
  if (!status)  return [{ status, message }]
  else {
    let data = {}
    await db.collection(collection).findOne({ _id: ObjectID(query._id) })
            .then(result => data = result )
            .catch(err => console.error(`Error al encontrar el documento : ${err}`))
    return [{ status, data }]
  }
}

export const insert = async (collection = ``, columns = {} ) => {
  console.log(`MONGODB action  insert from ${collection}`)
  const { status, db, message } = await connect()
  if (!status)  return [{ status, message }]
  else {
    let data = {}
    await db.collection(collection).insertOne(columns)
            .then(result => data = result )
            .catch(err => console.error(`Error al insertar el documento : ${err}`))
    return [{ status, data }]
  }
}

export const updateOne = async (collection = ``, columns = {} ) => {
  console.log(`MONGODB action  updateOne from ${collection}`)
  const { status, db, message } = await connect()
  if (!status)  return [{ status, message }]
  else {
    let data = {}
    const {_id, ...oUpdate} = columns
    await db.collection(collection).updateOne({ _id : ObjectID(columns._id) }, { $set : oUpdate })
            .then(result => data = result )
            .catch(err => console.error(`Error al actualizar el documento : ${err}`))
    return [{ status, data }]
  }
}

export const deleteOne = async (collection = ``, query = {} ) => {
  console.log(`MONGODB action  deleteOne from ${collection}`)
  const { status, db, message } = await connect()
  if (!status)  return [{ status, message }]
  else {
    let data = {}
    await db.collection(collection).deleteOne({ _id : ObjectID(query._id) })
            .then(result => data = result )
            .catch(err => console.error(`Error al eliminar el documento : ${err}`))
    return [{ status, data }]
  }
}

export const findOneAndUpdate = async (collection = ``, columns = {} ) => {
  console.log(`MONGODB action  deleteOne from ${collection}`)
  const { status, db, message } = await connect()
  if (!status)  return [{ status, message }]
  else {
    let data = {}
    const {_id, ...oUpdate} = columns
    await db.collection(collection).findOneAndUpdate({ _id : ObjectID(columns._id) }, { $set : oUpdate }, { returnNewDocument: true })
            .then(result => data = result )
            .catch(err => console.error(`Error al obtener y modificar el documento : ${err}`))
    return [{ status, data }]
  }
}

