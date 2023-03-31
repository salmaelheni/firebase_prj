require('dotenv').config()
const assert = require('assert')

assert(process.env.PORT,'PORT is required')
assert(process.env.HOST, 'HOST is required')




module.exports = {
    port: process.env.PORT,
    host: process.env.HOST,
    url: process.env.HOST_URL,
    

}

