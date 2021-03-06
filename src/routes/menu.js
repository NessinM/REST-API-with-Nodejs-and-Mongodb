import { Router }  from 'express'
const router  = Router()

const mw   = require('../middlewares')
const menu = require('../models/menu')

router.get('/',  mw.isLogged, menu.get)

module.exports = router
