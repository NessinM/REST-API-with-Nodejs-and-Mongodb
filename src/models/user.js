import bcrypt  from 'bcryptjs'
import jwt     from 'jsonwebtoken'
import config  from '../utils/config'
import api     from '../api'

const bsalt      = bcrypt.genSaltSync(config.auth.bcrypt.salt)
const collection = 'user'

export const get =  async (req, res) => {
  const { _id }                     = req.query
  const [{ message, status, data }] = !_id ? await api.mongo.actions.find(collection) : await api.mongo.actions.findOne(collection, { _id })
  !status ?  res.send({ status, message }) : res.send({ status, data })
}

const userPasswordIsMatch = (password, hash, callback) => {
  bcrypt.compare(password, hash, (err, isMatch) =>  {
    if (err) callback('No se pudo decifrar el password')
    else (!isMatch) ? callback('¡La contraseña ingresada no es valida!') : callback(null)
  })
}

export const login = async (req, res) => {
  const { document, password, type } = req.body
  //obtener usuario para comparar datos y generar el token
  const [{message, status, data }] = await api.mongo.actions.find(collection, { tipo_documento : type,  documento : document })
  if (!status) res.send({status, message})
  else {
    if (data.length === 0)  res.send({ status : 0, message : `El numero de ${type} no se encuentra registrado`})
    else {
      const [usuario] = data
      userPasswordIsMatch(password, usuario.password, async error => {
        if (error) res.send({ status : 0, message : error})
        else {
          const { password, token_session, ...objJWT } = usuario
          const token                                  = jwt.sign(objJWT, config.secret)
          const new_token                              = { token_session : token, _id : usuario._id }
          const [{message, status }]                   = await api.mongo.actions.updateOne(collection, { ...new_token })
          if (!status) res.send({status, message})
          else {
            usuario.token_session = token
            res.send({ status, ...usuario })
          }
        }
      })
    }
  }
}

export const logout = async (req, res) => {
  const { _id }                    = req.decoded
  const [{ message, status, data }] = await api.mongo.actions.updateOne(collection, { token_session : '', _id })
  !status ?  res.send({ status, message }) : res.send({ status, data })
}
