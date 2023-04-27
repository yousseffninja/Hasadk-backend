const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');


const router = express.Router();

router.param('id', (req, res, next, val) => {
    console.log(`user id ${val}`)
    next();
})

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/loginPhone', authController.loginMobile);
router.get('/logout', authController.logout);
router.get('/isLoggedIn',
    authController.protect,
    authController.isLoggedIn
);

router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);

router.get(
    '/me',
    authController.protect,
    userController.getMe,
    userController.getUser
);
router.patch(
    '/updateMyPassword',
    authController.protect,
    authController.updatePassword
);
router.patch(
    '/updateMe',
    authController.protect,
    userController.updateMe
);
router.delete(
    '/deleteMe',
    authController.protect,
    userController.deleteMe
);

router.use(authController.restrictTo('admin'));

router
    .route('/')
    .get(userController.getUsers)
    .post(
        authController.protect,
        authController.restrictTo('admin'),
        userController.createUser
    );


router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;