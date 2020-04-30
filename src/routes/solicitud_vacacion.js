import { Router }  from 'express'
const router  = Router()

const mw                 = require('../middlewares')
const solicitud_vacacion = require('../models/solicitud_vacacion')

router.get('/',          mw.isLogged, solicitud_vacacion.getAll)
router.get('/equipo',    mw.isLogged, solicitud_vacacion.equipo)
router.post('/',         mw.isLogged, solicitud_vacacion.add)
router.put('/',          mw.isLogged, solicitud_vacacion.update)
router.post('/rechazar', mw.isLogged, solicitud_vacacion.rechazar)
router.post('/aprobar',  mw.isLogged, solicitud_vacacion.aprobar)
router.delete('/',       mw.isLogged, solicitud_vacacion.remove)

module.exports = router
