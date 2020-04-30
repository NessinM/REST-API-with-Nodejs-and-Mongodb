import api     from '../api'

const collection = 'vacaciones'

export const getAll =  async (req, res) => {
  const { codigo }                = req.decoded
  const { _id }                   = req.query
  let   resultado                 = []
  if    (!_id) resultado          = await api.mongo.actions.find(collection, { codigo_empleado : +codigo })
  else  resultado                 = await api.mongo.actions.findOne(collection, {_id})
  const { message, status, data } = resultado[0]
  !status ?  res.send({ status, message }) : res.send({ status, data })
}

export const getUso =  async (req, res) => {
  const { _id }                   = req.decoded
  const data_response             = {}
  const resultado                 = await api.mongo.actions.findOne('empleado', { _id })
  const { message, status, data } = resultado[0]
  if (!status) res.send({status, message})
  else {
    data_response.dias_disponible = data.dias_disponibles
    data_response.dias_reales     = data.dias_reales
    const resultado_sol           = await api.mongo.actions.find('solicitud_vacaciones', {_id_empleado : _id})
    const response_sol            = resultado_sol[0]
    if (!response_sol.status) res.send({status : response_sol.status, message : response_sol.message})
    else {
      const size        = response_sol.data.length
      let   solicitudes = 0
      response_sol.data.forEach(e => {
        if (e.abierto !== 0) solicitudes++
      });

      data_response.fecha_ultima_solicitud = size > 0 ? response_sol.data[size - 1].creado : ''
      data_response.id_ultima_solicitud    = size > 0 ? response_sol.data[size - 1]._id : ''
      data_response.ultima_solicitud       = size > 0 ? response_sol.data[size - 1].creado : ''
      data_response.pendientes             = size > 0 ? solicitudes : 0
      const resultado_vac                  = await api.mongo.actions.find('vacaciones', {_id_empleado : _id})
      const response_vac                   = resultado_vac[0]
      if (!response_vac.status) res.send({status : response_vac.status, message : response_vac.message})
      else {
        const size_vacaciones              = response_vac.data.length
        data_response.vacaciones           = size > 0 ? size_vacaciones : 0
        res.send({ status : response_vac.status, data : data_response })
      }
    }
  }
}