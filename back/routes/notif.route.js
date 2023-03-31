const express = require('express')
const {sendNotif} = require('../controllers/notification')
const { isAuthorized, isAuthenticated } = require("../helper/authorization");
const router = express.Router()



router.post('/sendNotif', sendNotif);

module.exports = {
    routes : router
}
