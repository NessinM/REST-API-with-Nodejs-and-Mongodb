import bcrypt  from 'bcryptjs'
import jwt     from 'jsonwebtoken'
import config  from '../utils/config'
import api     from '../api'

const bsalt      = bcrypt.genSaltSync(config.auth.bcrypt.salt)
const collection = 'empleado'

export const getAll =  async (req, res) => {
  const { _id }                   = req.query
  let   resultado                 = []
  if    (!_id) resultado          = await api.mongo.actions.find(collection)
  else  resultado                 = await api.mongo.actions.findOne(collection, {_id})
  const { message, status, data } = resultado[0]
  !status ?  res.send({ status, message }) : res.send({ status, data })
}

export const add =  async (req, res) => {
  const { nombre              ,
        tipo_documento        ,
        documento             ,
        email                 ,
        fecha_fin_contrato    ,
        fecha_ingreso         ,
        perfil                ,
        cargo                 ,
        activo                ,
        regimen               ,
        area,
        jefe               ,
        contrato_indeterminado,
        fantasma              ,
        reemplazo_vacaciones  ,
        apellido_materno      ,
        apellido_paterno      ,
        genero                }  = req.body

  let usuario  = `${nombre.substr(0, 1)}${apellido_paterno}`
  let avatar   = `${nombre.substr(0, 1)}${apellido_paterno.substr(0, 1)}`

  const response_parametros       = await api.mongo.actions.find('parametros')
  let   { message, status, data } = response_parametros[0]
  const parametros = data[0]
  if (!status)  res.send({ status, message })
  else {

    let reemplazos = []
    let datos_jefe = {
      _id             : jefe._id,
      nombre          : jefe.nombre,
      apellido_paterno: jefe.apellido_paterno,
      apellido_materno: jefe.apellido_materno,
      avatar          : jefe.avatar,
      cargo           : jefe.cargo,
      email           : jefe.email,
      area            : jefe.area
    }


    reemplazo_vacaciones.forEach(e => {
      reemplazos.push({
        _id   : e._id,
        nombre: `${e.nombre} ${e.apellido_paterno} ${e.apellido_materno}`,
        avatar: e.avatar,
        cargo : e.cargo,
        email : e.email,
        area  : e.area
      })
    })

    const  new_user  = {
      codigo  : parametros.ultimo_codigo_usuario + 1,
      usuario : usuario.toLocaleLowerCase(),
      password: bcrypt.hashSync('123456', bsalt),
      perfil  : perfil.toLocaleLowerCase(),
      nombre,
      apellido_materno,
      apellido_paterno,
      area,
      cargo,
      email,
      tipo_documento,
      documento,
      periodo_actual  : 1,
      dias_reales     : 30,
      dias_disponibles: 30,
      jefe : datos_jefe,
      fecha_ingreso,
      fantasma,
      activo,
      reset_token  : '',
      token_session: '',
      contrato_indeterminado,
      fecha_fin_contrato,
      regimen,
      reemplazo_vacaciones : reemplazos,
      avatar : avatar.toUpperCase(),
      genero
    }

    const resultado_insert          = await api.mongo.actions.insert(collection, new_user)
    const { message, status, data } = resultado_insert[0]
    if (!status) res.send({ status, message })
    else {
      const new_parametro = {
        _id                  : parametros._id,
        ultimo_codigo_usuario: parametros.ultimo_codigo_usuario + 1
      }

      const resultado_update = await api.mongo.actions.updateOne('parametros', { ...new_parametro })
      const response_update  = resultado_update[0]
      if (!response_update.status) res.send({ status, message : response_update.message })
      else res.send(response_update)
    }
  }
}

export const update =  async (req, res) => {
  const { _id                 ,
        nombre                ,
        tipo_documento        ,
        documento             ,
        email                 ,
        fecha_fin_contrato    ,
        fecha_ingreso         ,
        perfil,
        area,
        cargo                 ,
        activo                ,
        regimen               ,
        jefe           ,
        contrato_indeterminado,
        fantasma              ,
        reemplazo_vacaciones  ,
        apellido_materno      ,
        apellido_paterno      ,
        genero                }  = req.body

  let usuario    = `${nombre.substr(0, 1)}${apellido_paterno}`
  let avatar     = `${nombre.substr(0, 1)}${apellido_paterno.substr(0, 1)}`
  let reemplazos = []
  let datos_jefe = {
    _id             : jefe._id,
    nombre          : jefe.nombre,
    apellido_paterno: jefe.apellido_paterno,
    apellido_materno: jefe.apellido_materno,
    avatar          : jefe.avatar,
    cargo           : jefe.cargo,
    email           : jefe.email,
    area            : jefe.area
  }


  reemplazo_vacaciones.forEach(e => {
    reemplazos.push({
      _id   : e._id,
      nombre: `${e.nombre} ${e.apellido_paterno} ${e.apellido_materno}`,
      avatar: e.avatar,
      cargo : e.cargo,
      email : e.email,
      area  : e.area
    })
  })

  let   new_user  = {
    _id,
    usuario: usuario.toLocaleLowerCase(),
    perfil : perfil.toLocaleLowerCase(),
    nombre,
    apellido_materno,
    apellido_paterno,
    area,
    cargo,
    email,
    tipo_documento,
    documento,
    jefe: datos_jefe,
    fecha_ingreso,
    fantasma,
    activo,
    token_session: '',
    contrato_indeterminado,
    fecha_fin_contrato,
    regimen,
    reemplazo_vacaciones : reemplazos,
    avatar: avatar.toUpperCase(),
    genero
  }

  const resultado_insert          = await api.mongo.actions.updateOne(collection, { ...new_user })
  const { message, status, data } = resultado_insert[0]
  !status ?  res.send({ status, message }) : res.send({ status, data })
}

export const remove =  async (req, res) => {
  const { _id }                   = req.query
  const resultado                 = await api.mongo.actions.deleteOne(collection, { _id })
  const { message, status, data } = resultado[0]
  !status ? res.send({ status, message }) : res.send({ status, data })
}

const userPasswordIsMatch = (password, hash, callback) => {
  bcrypt.compare(password, hash, (err, isMatch) =>  {
    if (err) callback('No se pudo decifrar el password')
    else (!isMatch) ? callback('¡La contraseña ingresada no coincide!') : callback(null)
  })
}

export const login = async (req, res) => {
  const { documento, password } = req.body

  console.log('documento', documento)
  console.log('password', password)

  if (!documento) {
    res.send( { status : 0, message : 'El numero de identidad no puede estar vacio'})
    return
  }

  if (!password) {
    res.send( { status : 0, message : 'Es necesario ingresar una contraseña'})
    return
  }

  //obtener usuario para comparar datos y generar el token
  const resultado = await api.mongo.actions.find(collection, { documento })
  const { message, status, data } = resultado[0]
  if (!status)  res.send({ status, message : `El documento #${documento} no existe`})
  else {
    userPasswordIsMatch(password, data[0].password, async error => {
      if (error) res.send({  status : 0, message : error})
      else {
        const { password, token_session, ...objJWT } = data[0]
        const token                                  = jwt.sign(objJWT, config.secret)
        const new_user                               = { token_session : token, _id : data[0]._id, }
        const resultado_update                       = await api.mongo.actions.updateOne(collection, { ...new_user })
        const response_update                        = resultado_update[0]
        if (!response_update.status)  res.send({status: 0, message:  response_update.message})
        else {
          data[0].token_session = token
          res.send({ status, ...data[0] })
        }
      }
    })
  }
}

export const logout = async (req, res) => {
  const { _id }                   = req.decoded
  const new_user                  = { token_session : '', _id }
  const resultado                 = await api.mongo.actions.updateOne(collection, { ...new_user })
  const { message, status, data } = resultado[0]
  !status ?  res.send({ status, message }) : res.send({ status, data })
}

export const getJefes =  async (req, res) => {
  const response_jefes            = await api.mongo.actions.find(collection, { perfil : "jefe" })
  const { message, status, data } = response_jefes[0]
  !status ?  res.send({ status, message }) : res.send({ status, data })
}

export const getAdmins =  async (req, res) => {
  const response_gerente            = await api.mongo.actions.find(collection, { perfil : "admin" })
  const { message, status, data } = response_gerente[0]
  !status ?  res.send({ status, message }) : res.send({ status, data })
}
