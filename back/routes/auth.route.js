const express = require('express')
const {signupAdmin,signupUser,refreshTokenAccess,ResetPassword,signIn,signOut,resetEmail} = require('../controllers/AuthController')
const { isAuthorized, isAuthenticated } = require("../helper/authorization");
const router = express.Router()




router.post('/admin/signup', signupAdmin);
router.post('/user/signout', signOut);
router.post('/user/signin', signIn);
router.post('/user/signup',[isAuthenticated,isAuthorized], signupUser);
router.post('/refreshToken', refreshTokenAccess);
router.post('/user/restPassword',[isAuthenticated], ResetPassword);
router.post('/user/resetEmail',[isAuthenticated], resetEmail);

module.exports = {
    routes : router
}
