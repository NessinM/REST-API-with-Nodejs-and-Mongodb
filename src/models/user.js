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
  const { documento, password, tipo_documento } = req.body
  //obtener usuario para comparar datos y generar el token
  const [{message, status, data }] = await api.mongo.actions.find(collection, { documento, tipo_documento })
  if (!status) res.send({ status, message })
  else {
    if (data.length === 0)  res.send({ status : 0, message : `El numero de ${tipo_documento} no se encuentra registrado`})
    else {
      console.log('data', data)
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
  const { nombre,
          apellidos,
          reporta_a,
          email,
          oficina,
          equipos,
          ultimos_cambios,
          fecha_nacimiento,
          genero,
          nacionalidad,
          telefono,
          numero_iban,
          documento,
          direccion_1,
          direccion_2,
          ciudad,
          codigo_postal,
          region,
          pais,
          nombre_emergencia,
          telefono_emergencia,
          contrato_actual,
          fecha_registro,
          cargo,
          tipo_salario,
          monto_salario,
          horas_a_laborar,
          unidad_a_laborar,
          dias_a_laborar,
          compensasiones_variables,
          usuario,
          password,
          perfil,
          tipo_documento,
          activo,
          reset_token,
          session_token,
          contrato_indeterminado,
          regimen,
          avatar,
          area  }  = req.body
  console.log('req.body', req.body)

  // const  new_user  = {
  //   codigo  : parametros.ultimo_codigo_usuario + 1,
  //   usuario : usuario.toLocaleLowerCase(),
  //   password: bcrypt.hashSync('123456', bsalt),
  //   perfil  : perfil.toLocaleLowerCase(),
  //   nombre,
  //   apellido_materno,
  //   apellido_paterno,
  //   area,
  //   cargo,
  //   email,
  //   tipo_documento,
  //   documento,
  //   periodo_actual  : 1,
  //   dias_reales     : 30,
  //   dias_disponibles: 30,
  //   jefe : datos_jefe,
  //   fecha_ingreso,
  //   fantasma,
  //   activo,
  //   reset_token  : '',
  //   token_session: '',
  //   contrato_indeterminado,
  //   fecha_fin_contrato,
  //   regimen,
  //   reemplazo_vacaciones : reemplazos,
  //   avatar : avatar.toUpperCase(),
  //   genero
  // }

  // const resultado_insert          = await api.mongo.actions.insert(collection, new_user)
  // const { message, status, data } = resultado_insert[0]
  // if (!status) res.send({ status, message })
  // else {
  //   const new_parametro = {
  //     _id                  : parametros._id,
  //     ultimo_codigo_usuario: parametros.ultimo_codigo_usuario + 1
  //   }

  //   const resultado_update = await api.mongo.actions.updateOne('parametros', { ...new_parametro })
  //   const response_update  = resultado_update[0]
  //   if (!response_update.status) res.send({ status, message : response_update.message })
  //   else res.send(response_update)
  // }
}