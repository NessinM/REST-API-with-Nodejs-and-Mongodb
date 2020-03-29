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
  else res.send(response)
}

export const getOne =   async (req, res) => {
  const id       = req.params.id
  const resultado = await api.mongo.user.action('findOne', {_id : id})
  const response  = await resultado[0]
  if (!response.status)  res.send(general.trowError(response.message))
  else res.send(response)
}

export const add =  async (req, res) => {
  const user      = req.body.user || ''
  const nombre    = req.body.nombre || ''
  const apellido  = req.body.apellido || ''
  const email     = req.body.email  || ''
  const password  = req.body.password || ''
  const role      = req.body.role || ''
  const documento = req.body.documento || 0

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
  else res.send(response)
}

export const remove =  async (req, res) => {
  const id       = req.params.id
  const resultado = await api.mongo.user.action('remove', {_id : id })
  const response  = await resultado[0]
  if (!response.status)  res.send(general.trowError(response.message))
  else res.send(response)
}

export const update =  async (req, res) => {
  const id        = req.params.id
  const user      = req.body.user || ''
  const nombre    = req.body.nombre || ''
  const apellido  = req.body.apellido || ''
  const email     = req.body.email  || ''
  const password  = req.body.password || ''
  const role      = req.body.role || ''
  const documento = req.body.documento || 0

  const new_user = {
    user,
    nombre  ,
    apellido,
    email   ,
    password : bcrypt.hashSync(password, bsalt),
    role,
    documento
  }

  const resultado = await api.mongo.user.action('updateOne', {_id : id, ...new_user})
  const response  = await resultado[0]
  if (!response.status) res.send(general.trowError(response.message))
  else res.send(response)
}

const userPasswordIsMatch = (password, hash, callback) => {
  bcrypt.compare(password, hash, (err, isMatch) =>  {
    if (err) callback('No se pudo decifrar el password')
    else (!isMatch) ? callback('¡La contraseña ingresada no coincide!') : callback(null)
  })
}

export const login = async (req, res) => {
  const documento = req.body.documento || 0
  const password  = req.body.password  || ''

  if (!documento) {
    res.send(general.trowError('El numero de identidad no puede estar vacio'))
    return
  }

  if (!password) {
    res.send(general.trowError('Es necesario ingresar una contraseña'))
    return
  }
  //obtener usuario para comparar datos y generar el token
  const resultado = await api.mongo.user.action('findOne', { documento })
  const response  = resultado[0]
  if (!response.status)  res.send(general.trowError(response.message))
  else {
    userPasswordIsMatch(password, response.data.password, async error => {
      if (error) res.send(general.trowError(error))
      else {
        const { password, token_session, ...objJWT } = response.data
        const token     = jwt.sign(objJWT, config.secret)
        const new_user          = { token_session : token }  //Guardar el token de la session
        const resultado_update  = await api.mongo.user.action('updateOne', {_id : response.data._id, ...new_user})
        const response_update   = resultado_update[0]
        if (!response_update.status)  res.send(general.trowError(response_update.message))
        else {
          response.data.token_session = token
          res.send(response.data)
        }
      }
    })
  }
}

export const logout = async (req, res) => {
  const documento = req.body.documento || 0

  if (!documento) {
    res.send(general.trowError('El numero de identidad no puede estar vacio'))
    return
  }

  const resultado = await api.mongo.user.action('findOne', { documento })
  const response  = resultado[0]
  if (!response.status)  res.send(general.trowError(response.message))
  else {
    const new_user         = { token_session : '' }
    const resultado_update = await api.mongo.user.action('updateOne', {_id : response.data._id, ...new_user})
    const response_update  = resultado_update[0]
    if (!response_update.status)  res.send(general.trowError(response_update.message))
    else res.send({status : response_update.status})
  }
}



