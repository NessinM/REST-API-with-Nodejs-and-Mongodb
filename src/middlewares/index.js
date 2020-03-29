import jwt       from  'jsonwebtoken'
import config    from  '../utils/config'
import general   from '../utils/general'
import api       from '../api'

export const isLogged = async (req, res, next) => {
  const documento = req.body.documento || req.query.documento
  if (!documento) {
    res.send(general.trowError('[No se puede realizar la solicitud  HTTP]: por que el header no cuenta con el numero de identificacion ', 302))
    return
  }
  const resultado = await api.mongo.user.action('findOne', { documento })
  const response  = resultado[0]
  if (!response.status) res.send(general.trowError('[No se puede realizar la solicitud  HTTP]: por que el numero de identificacon del header no es Valido ', 302))
  else {
    jwt.verify(response.data.token_session, config.secret, (err, decoded) => {
      if (err) res.send(general.trowError( `El usuario ${response.data.nombre} no tiene ninguna session activa en la aplicación`, 302))
      else {
        req.decoded = decoded
        next()
      }
    })
  }
}
