import { Router } from 'express'
const router = Router();

router.get('/', (req, res) => {
    res.send('Bienvenido al API de Liatris HR');
});

module.exports = router