import moment from 'moment'
import api     from '../api'

const collection = 'contrato'

export const get =  async (req, res) => {
  const { _id }                     = req.query
  const [{ message, status, data }] = !_id ? await api.mongo.actions.find(collection) : await api.mongo.actions.findOne(collection, { _id })
  !status ?  res.send({ status, message }) : res.send({ status, data })
}

export const getByUser =  async (req, res) => {
  const { _id, datos_empleado }                     = req.query
  const [{ message, status, data }] = await api.mongo.actions.find(collection, { id_empleado : _id })
  if (!status) res.send({ status, message })
  else {
    if (datos_empleado) {
      getEmpleado(_id, (err, empleado) => {
        err ? res.send({ status : 0, message : err}) : res.send({ status, data, empleado })
      })
    } else res.send({ status, data})
  }
}

export const add =  async (req, res) => {
  const contrato  = req.body
  const new_contrato = {
    id_empleado           : contrato.id_empleado,
    fecha_inicio_contrato : contrato.fecha_inicio_contrato,
    fecha_fin_contrato    : contrato.fecha_fin_contrato,
    cargo                 : contrato.cargo,
    contrato_indeterminado: contrato.contrato_indeterminado,
    tipo_salario          : contrato.tipo_salario,
    monto_salario         : contrato.monto_salario,
    moneda_salario        : contrato.moneda_salario,
    horas_a_laborar       : contrato.horas_a_laborar,
    unidad_a_laborar      : contrato.unidad_a_laborar,
    dias_a_laborar        : contrato.dias_a_laborar,
    fecha_creacion        : moment().format('DD/MM/YYYY HH:ss'),
    activo                : true
  }
  const [{message, status, data }] = await api.mongo.actions.insert(collection, { ...new_contrato })
  !status ? res.send({ status, message }) : res.send({status, data})
}

export const update =  async (req, res) => {
  const o_contrato = req.body
  const [{message, status, data }]          = await api.mongo.actions.updateOne(collection, o_contrato)
  !status ?  res.send({ status, message }) : res.send({ status, data })
}

export const getEmpleado =  async (_id, callback) => {
  const [{ message, status, data }] = await api.mongo.actions.findOne('user', { _id })
  !status ?  callback(message)  : callback(null, data)
}
