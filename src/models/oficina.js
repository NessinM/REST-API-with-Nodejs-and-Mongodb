import bcrypt  from 'bcryptjs'
import config  from '../utils/config'
import api     from '../api'

const collection = 'oficinas'

export const get =  async (req, res) => {
  const { _id }                     = req.query
  const [{ message, status, data }] = !_id ? await api.mongo.actions.find(collection) : await api.mongo.actions.findOne(collection, { _id })
  !status ?  res.send({ status, message }) : res.send({ status, data })
}