const express = require('express')

const app = express()
const config = require('./config')
const usersRoutes = require('./routes/students.route')
const notifRoutes = require('./routes/notif.route')
const adminRoutes = require('./routes/auth.route')
const courseRoutes = require('./routes/course.route')
const bodyParser = require('body-parser')
const cors = require('cors')
const swaggerDocument = require('./swagger.js');
const swaggerJSdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
// app.use(express.json())
app.use(cors())
app.use(bodyParser.json())

// const options = {
//   definition: {
//     openapi: '3.0.0',
//     info:{
//       title: 'Node js api project',
//       version: '1.0.0'
//     },
//     servers: [
//       {
//         url:'http://localhost:5000'
//       }
//     ]
//   },
//   apis:['./routes/*.js']
// }



// const swaggerSpec = swaggerJSdoc(options)


app.use('/api/user', usersRoutes.routes )
app.use('/api/notif',notifRoutes.routes )
app.use('/api/auth', adminRoutes.routes )
app.use('/api/course', courseRoutes.routes )

app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerDocument.swagger, { explorer: true }))
app.listen(config.port,()=>console.log(`server is running on PORT http://localhost:${config.port}`))