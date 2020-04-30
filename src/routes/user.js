import { Router }  from 'express'
const router  = Router()

const mw   = require('../middlewares')
const user = require('../models/user')

router.post('/login',  user.login)
router.get('/',        mw.isLogged, user.getAll)
router.post('/',       mw.isLogged, user.add)
router.put('/',        mw.isLogged, user.update)
router.get('/jefes',   mw.isLogged, user.getJefes)
router.get('/admins',   mw.isLogged, user.getAdmins)
router.post('/logout', mw.isLogged, user.logout)
router.delete('/',     mw.isLogged, user.remove)

module.exports = router
