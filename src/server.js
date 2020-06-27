import express, { urlencoded, json } from 'express'
import cors                          from 'cors'
const app = express();
// Middlewares
app.use(urlencoded({ extended: false }))
app.use(json())
app.use(cors())

// Routes
app.use('/',                   require('./routes'))
app.use('/menu',               require('./routes/menu'))
app.use('/user',               require('./routes/user'))
app.use('/oficina',            require('./routes/oficina'))
app.use('/contrato',           require('./routes/contrato'))
// app.use('/vacacion',           require('./routes/vacacion'))
// app.use('/solicitud_vacacion', require('./routes/solicitud_vacacion'))

export default app;