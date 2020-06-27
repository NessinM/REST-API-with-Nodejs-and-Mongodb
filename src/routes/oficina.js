import { Router }  from 'express'
const router  = Router()

const mw       = require('../middlewares')
const oficina  = require('../models/oficina')

router.get('/',        mw.isLogged, oficina.get)

module.exports = router
