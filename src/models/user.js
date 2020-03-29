import bcrypt  from 'bcryptjs'
import jwt     from 'jsonwebtoken'
import config  from '../utils/config'
import general from '../utils/general'
import api     from '../api'

const bsalt = bcrypt.genSaltSync(config.auth.bcrypt.salt);

export const getAll =  async (req, res) => {
  const resultado = await api.mongo.user.action('find')
  const response  = await resultado[0]
  if (!response.status)  res.send(general.trowError(response.message))
  else {
    response.status = response.status
    response.data   = response.data
    res.send(response)
  }
}

export const getOne =   async (req, res) => {
  const id       = req.params.id
  const resultado = await api.mongo.user.action('findOne', {_id : id})
  const response  = await resultado[0]
  if (!response.status)  res.send(general.trowError(response.message))
  else {
    response.status = response.status
    response.data   = response.data
    res.send(response)
  }
}

export const add =  async (req, res) => {
  const user      = req.body.user
  const nombre    = req.body.nombre
  const apellido  = req.body.apellido
  const email     = req.body.email
  const password  = req.body.password
  const role      = req.body.role
  const documento = req.body.documento

  const new_user = {
    user,
    nombre  ,
    apellido,
    email   ,
    password : bcrypt.hashSync(password, bsalt),
    role,
    documento
  }

  const resultado = await api.mongo.user.action('insert', new_user)
  const response  = await resultado[0]
  if (!response.status)  res.send(general.trowError(response.message))
  else {
    response.status = response.status
    response.data   = response.data
    res.send(response)
  }
}

export const remove =  async (req, res) => {
  const id       = req.params.id
  const resultado = await api.mongo.user.action('remove', {_id : id })
  const response  = await resultado[0]
  if (!response.status)  res.send(general.trowError(response.message))
  else {
    response.status = response.status
    response.data   = response.data
    res.send(response)
  }
}

export const update =  async (req, res) => {
  const id       = req.params.id
  const user     = req.body.user
  const nombre   = req.body.nombre
  const apellido = req.body.apellido
  const email    = req.body.email
  const password = req.body.password
  const role     = req.body.role

  const new_user = {
    user,
    nombre  ,
    apellido,
    email   ,
    password : bcrypt.hashSync(password, bsalt),
    role
  }

  const resultado = await api.mongo.user.action('updateOne', {_id : id, ...new_user})
  const response  = await resultado[0]
  if (!response.status)  res.send(general.trowError(response.message))
  else {
    response.status = response.status
    response.data   = response.data
    res.send(response)
  }
}

const userPasswordIsMatch = (password, hash, callback) => {
  bcrypt.compare(password, hash, (err, isMatch) =>  {
    if (err) callback('No se pudo decifrar el password')
    else (!isMatch) ? callback('¡La contraseña no coincide!') : callback(null)
  })
}

export const login = async (req, res) => {
  const documento = req.body.documento
  const password  = req.body.password
  const resultado = await api.mongo.user.action('findOne', { documento })
  const response  = await resultado[0]
  if (!response.status)  res.send(general.trowError(response.message))
  else {
    userPasswordIsMatch(password, response.data.password, error => {
      if (error) res.send(general.trowError(error))
      else {
        response.status = response.status
        response.data   = response.data
        res.send(response)
      }
    })
  }
}

// VALIDAR QUE EXISTA EL USUARIO POR QUE SE CAE CUANDO


