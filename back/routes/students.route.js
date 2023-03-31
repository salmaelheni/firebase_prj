const express = require('express')
const {getAllStudent,updateStudent,deleteStudent,getStudentById,getAllUsers,getOneUser,UpdateUser,DeleteUser,deleteAllUsers,UserWithCourse,AllUsersCourses
} = require('../controllers/UserController')
const { isAuthorized, isAuthenticated } = require("../helper/authorization");
const router = express.Router()

router.get('/students',getAllStudent)
router.put('/student/update/:id', updateStudent);
router.delete('/student/:id',[isAuthenticated,isAuthorized], deleteStudent);
router.delete('/userDelete/:id',[isAuthenticated,isAuthorized], DeleteUser);
router.delete('/deleteAllUsers',[isAuthenticated,isAuthorized], deleteAllUsers);
router.get('/student/:id', getStudentById);
router.get('/users',[isAuthenticated,isAuthorized], getAllUsers);
router.get('/user/:id', getOneUser);
router.patch('/UpdateUser/:id', UpdateUser);
router.get('/all', AllUsersCourses);
router.get('/:idUser', UserWithCourse);

module.exports = {
    routes : router
}
