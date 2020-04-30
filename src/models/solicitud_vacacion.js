
import api      from '../api'
import moment   from 'moment'
import { send } from "../utils/mail"
import config   from '../utils/config'

const collection = 'solicitud_vacaciones'

export const getAll =  async (req, res) => {
  const { codigo }                = req.decoded
  const { _id, abierto, estado }  = req.query
  let   resultado                 = []
  if    (!_id) resultado          = await api.mongo.actions.find(collection, {
    codigo_empleado: codigo,
    abierto        : +abierto,
    $or            : [ { estado : +estado[0] }, { estado : +estado[1] }, { estado : +estado[2] },  { estado : +estado[3] }]
  })
  else  resultado                 = await api.mongo.actions.findOne(collection, {_id })
  const { message, status, data } = resultado[0]
  console.log('resultado', resultado)
  !status ?  res.send({ status, message }) : res.send({ status, data })
}

export const equipo =  async (req, res) => {
  const { _id }     = req.decoded
  const { abierto } = req.query
  let   query       = { id_jefe: _id, abierto:  +abierto, estado : { $eq : 3} }
  let   resultado   = await api.mongo.actions.find(collection, {...query})
  const { message, status, data } = resultado[0]
  !status ?  res.send({ status, message }) : res.send({ status, data })
}

export const add =  async (req, res) => {
  const { desde, hasta, retorno, dias }                                                                                = req.body
  const { _id, usuario, codigo, perfil, nombre,  apellido_materno,  apellido_paterno, email, avatar, cargo, jefe } = req.decoded

  const empleado_resultado = await api.mongo.actions.findOne('empleado', { _id })
  const empleado_response  = empleado_resultado[0]
  if (!empleado_response.status) res.send({ status : empleado_response.status, message : empleado_response.message})
  else {
    const dias_disponibles = empleado_response.data.dias_disponibles
    if (dias_disponibles < dias) res.send({ status : 0 , message : 'No cuentas con dias disponibles para registrar esta solicitud'})
    else {
      let accion       = {
        _id,
        message   : 'Creo la solicitud el ',
        type_alert: 'info',
        color     : 'primary white--text',
        codigo,
        perfil,
        nombre,
        apellido_paterno,
        apellido_materno,
        email,
        avatar,
        cargo,
        fecha : moment().format('DD/MM/YYYY HH:mm:ss')
      }

      const new_solicitud = {
        _id_empleado   : _id,
        codigo_empleado: codigo,
        nombre_empleado: `${nombre}  ${apellido_paterno}  ${apellido_materno}`,
        avatar_empleado: avatar,
        id_jefe : jefe._id,
        desde,
        hasta,
        retorno,
        dias,
        estado          : 1,
        abierto         : 1,
        acciones        : [accion],
        remplazo_elegido: '',
        creado          : moment().format('DD/MM/YYYY HH:mm:ss'),
        creado_por      : usuario,
        modificado      : moment().format('DD/MM/YYYY HH:mm:ss'),
        modificado_por  : usuario
      }

      const v_resultado = await api.mongo.actions.insert(collection, new_solicitud)
      const { status, message, data }  = v_resultado[0]
      if (!status) res.send({ status, message })
      else {
        const new_empleado = {
          _id,
          dias_disponibles : dias_disponibles  - dias
        }
        const update_resultado = await api.mongo.actions.updateOne('empleado', { ...new_empleado })
        const update_response  = update_resultado[0]
        if (!update_response.status) res.send({ status : update_response.status, message : update_response.message})
        else res.send({ status : update_response.status, data : update_response })
      }
    }
  }
}

export const update =  async (req, res) => {
  const { usuario } = req.decoded
  const _id         = req.body._id
  const desde       = req.body.desde
  const hasta       = req.body.hasta
  const retorno     = req.body.retorno
  const dias        = req.body.dias

  let new_solicitud             = {
    _id    ,
    desde  ,
    hasta  ,
    retorno,
    dias   ,
    modificado    : moment().format('DD/MM/YYYY HH:mm:ss'),
    modificado_por: usuario
  }

  const v_resultado = await  api.mongo.actions.updateOne(collection , { ...new_solicitud })
  const { message, status, data } = v_resultado[0]
  !status ?  res.send({ status, message }) : res.send({ status, data })
}

export const rechazar =  async (req, res) => {
  let {_id, estado } = req.body
  const { usuario,
          codigo,
          perfil,
          nombre,
          apellido_materno,
          apellido_paterno,
          email, avatar,
          cargo
        } = req.decoded

  const resultado_sv = await api.mongo.actions.findOne(collection, { _id })
  let { acciones, _id_empleado, dias } = resultado_sv[0].data
  let accion       = {
    _id       : req.decoded._id,
    message   : 'Rechazó la solicitúd el ',
    type_alert: 'error',
    color     : 'error white--text',
    codigo,
    perfil,
    nombre,
    apellido_paterno,
    apellido_materno,
    email,
    avatar,
    cargo,
    fecha : moment().format('DD/MM/YYYY HH:mm:ss')
  }

  const new_solicitud   = {
    _id,
    estado,
    abierto       : 0,
    acciones      : [...acciones, accion ],
    modificado    : moment().format('DD/MM/YYYY HH:mm:ss'),
    modificado_por: usuario
  }

  const v_resultado               = await  api.mongo.actions.updateOne(collection, { ...new_solicitud })
  const { message, status, data } = v_resultado[0]
  if (!status ) res.send({ status, message })
  else {

    const empleado_resultado = await  api.mongo.actions.findOne('empleado', { _id : _id_empleado  })
    const response_empleado  = empleado_resultado[0]
    if (!response_empleado.status ) res.send({ status : response_empleado.status, message : response_empleado.message })
    else {
      const new_empleado = {
        _id             : _id_empleado,
        dias_disponibles: response_empleado.data.dias_disponibles + dias
      }

      console.log('data>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', new_empleado)

      const v_resultado               = await  api.mongo.actions.updateOne('empleado', { ...new_empleado })
      const { message, status, data } = v_resultado[0]
      if (!status ) res.send({ status, message })
      else res.send({ status, data })
    }
  }
}

export const remove =  async (req, res) => {
  const { _id }                   = req.query
  const resultado                 = await api.mongo.actions.deleteOne(collection, { _id })
  const { message, status, data } = resultado[0]
  !status ? res.send({ status, message }) : res.send({ status, data })
}

export const aprobar =  async (req, res) => {
  const {_id, estado, remplazo_elegido } = req.body
  const id_usuario                       = req.decoded._id
  const {
    usuario,
    codigo,
    perfil,
    nombre,
    apellido_materno,
    apellido_paterno,
    email,
    avatar,
    cargo,
    jefe
  } = req.decoded


  const datos_usuario_v = {
    codigo,
    perfil,
    nombre,
    apellido_paterno,
    apellido_materno,
    email,
    avatar,
    cargo
  }
  const resultado_sv         = await api.mongo.actions.findOne(collection, { _id })
  let   response_vacaciones  = resultado_sv[0]
  let   solicitud_vacaciones = response_vacaciones.data
  if (!response_vacaciones.status) res.send({ status : response_vacaciones.status , message : response_vacaciones.message })
  else {

    if (estado === 3) {
      if (solicitud_vacaciones._id_empleado !== id_usuario) {
        res.send({ status : 0, message : 'No tienes permisos para aprobar esta solicitud' })
        return
      }
    }

    if (estado === 5) {
      if (solicitud_vacaciones.id_jefe !== id_usuario) {
        res.send({ status : 0, message : 'No tienes permisos para aprobar esta solicitud' })
        return
      }
    }

    if (solicitud_vacaciones.abierto === 0) {
      res.send({ status : 0, message : 'La solicitud ya se encuentra cerrada' })
      return
    }

    console.log('PASOOOOOOOOOOOOOO>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')

    let accion       = {
      _id       : id_usuario,
      message   : 'Aprobó la solicitúd el ',
      type_alert: 'success',
      color     : 'success white--text',
      ...datos_usuario_v,
      fecha : moment().format('DD/MM/YYYY HH:mm:ss')
    }

    let accion_aprobacion = [...solicitud_vacaciones.acciones, accion]


    if (estado === 5 ) {
      const accion_vacaciones       = {
        _id       : id_usuario,
        message   : 'Se convirtio en una vacacion ',
        type_alert: 'warning',
        color     : 'warning white--text',
        ...datos_usuario_v,
        fecha         : moment().format('DD/MM/YYYY HH:mm:ss')
      }

      accion_aprobacion.push(accion_vacaciones)
    }

    let new_solicitud     = {
      _id,
      estado,
      remplazo_elegido: remplazo_elegido || '',
      acciones        : accion_aprobacion,
      modificado      : moment().format('DD/MM/YYYY HH:mm:ss'),
      modificado_por  : usuario
    }

    const v_resultado               = await  api.mongo.actions.updateOne(collection, {...new_solicitud })
    const { message, status, data } = v_resultado[0]
    if (!status) res.send({ status, message })
    else {
      const resultado_jefe = await  api.mongo.actions.findOne('empleado', { _id : jefe._id })
      const response_jefe  = resultado_jefe[0]
      const datos_jefe     = response_jefe.data
      if (!response_jefe.status) res.send({ status : response_jefe.status, message : response_jefe.message })
      else {
        if (estado === 5) {
          let new_vacaciones = {
            _id_empleado   : solicitud_vacaciones._id_empleado,
            codigo_empleado: solicitud_vacaciones.codigo_empleado,
            nombre_empleado: `${solicitud_vacaciones.nombre} ${solicitud_vacaciones.apellido_paterno} ${solicitud_vacaciones.apellido_materno}`,
            avatar_empleado: solicitud_vacaciones.avatar,
            desde          : solicitud_vacaciones.desde,
            hasta          : solicitud_vacaciones.hasta,
            retorno        : solicitud_vacaciones.retorno,
            dias           : solicitud_vacaciones.dias,
            id_solicitud   : solicitud_vacaciones._id,
            fecha_creacion : moment().format('DD/MM/YYYY HH:mm:ss'),
            estado         : 1
          }
          const resultado_insert = await api.mongo.actions.insert('vacaciones', new_vacaciones)
          const response_insert  = resultado_insert[0]
          if (!response_insert.status) res.send({ status : response_insert.status, message : response_insert.message })
          else {

            const resultado_empleado= await  api.mongo.actions.findOne('empleado', { _id : solicitud_vacaciones._id_empleado })
            const response_empleado  = resultado_empleado[0]
            if (!response_empleado.status) res.send({ status : response_empleado.status, message : response_empleado.message })
            else {
              const update_empleado = {
                _id        : solicitud_vacaciones._id_empleado,
                dias_reales: response_empleado.data.dias_reales - solicitud_vacaciones.dias
              }

              const resultado_update_empleado = await api.mongo.actions.updateOne('empleado', { ...update_empleado })
              const response_update_empleado  = resultado_update_empleado[0]
              if (!response_update_empleado.status) res.send({ status : response_update_empleado.status, message : response_update_empleado.message })
              else {
                res.send({ status : response_update_empleado.status, data : response_update_empleado.data})
                var  obj_email      = {
                  template   : 'aprobacion_creacion_vacacion',
                  subject    : 'Tu vacacion esta lista',
                  to         : email,
                  nombre_jefe: `${datos_jefe.nombre} ${datos_jefe.apellido_paterno} ${datos_jefe.apellido_materno}`,
                  fecha      : new_vacaciones.fecha_creacion,
                  id_vacacion: 55555555
                }
              }
            }
          }
        } else {
          res.send({ status, data })
          var   obj_email      = {
            template: 'aprobacion_solicitud_vacacion',
            subject : 'Nueva solicitud de vacaciones',
            to      : datos_jefe.email,
            avatar,
            nombre,
            apellido_materno,
            apellido_paterno,
            desde        : solicitud_vacaciones.desde,
            hasta        : solicitud_vacaciones.hasta,
            retorno      : solicitud_vacaciones.retorno,
            isLogged     : datos_jefe.token_session ? true : false,
            url_solicitud: `${config.api_router_client}/vacaciones-equipo?_id=${_id}`,
            url_login    : `${config.api_router_client}`,
            url_aprobar  : `${config.api_router_client}/vacaciones-equipo?_id=${_id}&action=1`,
            url_rechazar : `${config.api_router_client}/vacaciones-equipo?_id=${_id}&action=0`,
            nombre_jefe  : `${datos_jefe.nombre} ${datos_jefe.apellido_paterno} ${datos_jefe.apellido_materno}`
          }
        }
        notification_email_aprobacion(obj_email, error => {
          if (error) console.error('Error al enviar email:', error.message)
          else console.log('El correo se envio correctamente')
        })
      }
    }
  }
}

const notification_email_aprobacion = (obj, callback) => {
  let mail_data = {
    template: obj.template,
    subject : obj.subject,
    data    : obj,
    to      : obj.to,
    bcc     : '',
    prefix  : '[SELF SERVICE]'
  }
  send(mail_data, err =>  callback(err))
}
