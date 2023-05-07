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

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

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
        userController.createUser
    );


router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

router
    .route('/seller/:id')
    .get(
        authController.protect,
        userController.getSeller
    )
    .patch(
        authController.protect,
        userController.likeSeller
    );

module.exports = router;