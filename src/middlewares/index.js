import jwt       from  'jsonwebtoken'
import config    from  '../utils/config'

export const isLogged = (req, res, next) => {
  next()
  // const token = req.body.token || req.query.token;
  // jwt.verify(token, config.secret, (err, decoded) => {
  //   let response = { status: -1, message: 'No ha ingresado al sistema' }
  //   if (err) res.send(response)
  //   else {
  //     req.decoded = decoded
  //     next()
  //   }
  // })
}
