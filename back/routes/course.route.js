const express = require('express')
const {createCourse,attendCourse,CourseWithUser} = require('../controllers/CoursesController')
const { isAuthorized, isAuthenticated } = require("../helper/authorization");
const router = express.Router()


router.post('/Addcourse',[isAuthenticated,isAuthorized], createCourse);
router.post('/attendCourse/:idUsers/:idCourse', attendCourse);

router.get('/:idCourse', CourseWithUser);

module.exports = {
    routes : router
}
