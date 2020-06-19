import jwt       from  'jsonwebtoken'
import config    from  '../utils/config'

export const isLogged = async (req, res, next) => {
  const { token } = req.headers
  if (token) {
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) res.send({ status : 302, message  : 'El token no es valido, Verificar!' })
      else {
        req.decoded = decoded
        next()
      }
    })
  } else res.send({ status : 302, message  : 'El token de la session no puede estar vacio' })
}
