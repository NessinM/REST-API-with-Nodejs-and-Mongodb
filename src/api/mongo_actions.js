import chalk from 'chalk'
import { connect }  from "../services/database"
import { ObjectID } from "mongodb"
import config       from '../utils/config'

const log = console.log;

export const find = async (collection = ``, query = {}, debug = false ) => {
  log(`action ${chalk.yellow('find')} in the collection ${chalk.green(collection)} of the ${chalk.green(config.mongodb.name)} database `)
  if (debug && config.dev) log(query)
  const { status, db, message } = await connect()
  if (!status)  return [{ status, message }]
  else {
    let data = []
    await db.collection(collection).find(query).toArray()
            .then(result => data = result )
            .catch(err => console.error(`Error al encontrar el documento : ${err}`))
    return [{ status,  data }]
  }
}

export const findOne = async (collection = ``, query = {}, debug = false ) => {
  log(`action ${chalk.yellow('findOne')} in the collection ${chalk.green(collection)} of the ${chalk.green(config.mongodb.name)} database `)
  if (debug && config.dev) log(query)
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

export const insert = async (collection = ``, columns = {}, debug = false ) => {
  log(`action ${chalk.yellow('insert')} in the collection ${chalk.green(collection)} of the ${chalk.green(config.mongodb.name)} database `)
  if (debug && config.dev) log(columns)
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

export const updateOne = async (collection = ``, columns = {}, debug = false ) => {
  log(`action ${chalk.yellow('updateOne')} in the collection ${chalk.green(collection)} of the ${chalk.green(config.mongodb.name)} database `)
  if (debug && config.dev) log(columns)
  const { status, db, message } = await connect()
  if (!status)  return [{ status, message }]
  else {
    let response = { status : 0 }
    const {_id, ...oUpdate} = columns
    await db.collection(collection).updateOne({ _id : ObjectID(columns._id) }, { $set : oUpdate })
            .then(result => { response.status = 1, response.data = result } )
            .catch(err =>  response.message = err.errmsg)
    return [response]
  }
}

export const deleteOne = async (collection = ``, query = {}, debug = false ) => {
  log(`action ${chalk.yellow('deleteOne')} in the collection ${chalk.green(collection)} of the ${chalk.green(config.mongodb.name)} database `)
  if (debug && config.dev) log(query)
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


