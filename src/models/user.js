import bcrypt  from 'bcryptjs'
import moment from 'moment'
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
  const { documento, password, tipo_documento } = req.body
  //obtener usuario para comparar datos y generar el token
  const [{message, status, data }] = await api.mongo.actions.find(collection, { documento, tipo_documento })
  if (!status) res.send({ status, message })
  else {
    if (data.length === 0)  res.send({ status : 0, message : `El numero de ${tipo_documento} no se encuentra registrado`})
    else {
      let [usuario] = data
      userPasswordIsMatch(password, usuario.password, async error => {
        if (error) res.send({ status : 0, message : error})
        else {
          const { password, session_token, ...objJWT } = usuario
          const token                                  = jwt.sign(objJWT, config.secret)
          const new_token                              = { session_token : token, _id : usuario._id }
          const [{message, status }]                   = await api.mongo.actions.updateOne(collection, { ...new_token })
          if (!status) res.send({ status, message })
          else {
            usuario.session_token = token
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

export const add =  async (req, res) => {
  const { tipo_documento, documento, nombre, apellidos, email  }  = req.body
  const new_user = {
    nombre,
    apellidos,
    email,
    tipo_documento,
    documento,
    avatar                  : `${nombre.toUpperCase().substr(0, 1)}${apellidos.toUpperCase().substr(0, 1)}`,
    reporta_a               : '',
    oficina                 : '',
    equipos                 : [],
    ultimos_cambios         : [],
    fecha_nacimiento        : '',
    genero                  : '',
    nacionalidad            : '',
    telefono                : '',
    numero_iban             : '',
    direccion_1             : '',
    direccion_2             : '',
    ciudad                  : '',
    codigo_postal           : '',
    region                  : '',
    pais                    : '',
    nombre_emergencia       : '',
    telefono_emergencia     : '',
    contrato_actual         : '',
    fecha_creacion          : moment().format('DD/MM/YYYY HH:ss'),
    compensasiones_variables: [],
    usuario                 : `${nombre.toUpperCase().substr(0, 1)}_liatris`,
    password                : bcrypt.hashSync('123456', bsalt),
    perfil                  : 'usuario',
    activo                  : true,
    reset_token             : '',
    session_token           : '',
    regimen                 : 'General',
    area                    : '',
    url_image               : '',
  }


  const [{message, status, data }] = await api.mongo.actions.insert(collection, { ...new_user })
  !status ? res.send({ status, message }) : res.send({status, data})
}

export const update =  async (req, res) => {
  const o_usuario = req.body
  const new_user  = { ...o_usuario }
  if (o_usuario.nombre) {
    new_user.usuario = `${o_usuario.nombre.substr(0, 1)}_liatris`
    new_user.avatar  = `${o_usuario.nombre.toUpperCase().substr(0, 1)}${o_usuario.apellidos.toUpperCase().substr(0, 1)}`
  }
  const [{message, status, data }]          = await api.mongo.actions.updateOne(collection, new_user)
  !status ?  res.send({ status, message }) : res.send({ status, data })
}
