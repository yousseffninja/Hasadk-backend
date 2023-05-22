const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const upload = require('../utils/multer');


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

// router.use(authController.protect);

router.patch(
    '/updateMyPassword',
    authController.protect,
    authController.updatePassword
);

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

// router.use(authController.restrictTo('admin'));

router
    .route('/uploadPersonalPhoto')
    .patch(
        upload.single('image'),
        authController.protect,
        userController.uploadPersonalPhoto
    )

router
    .route('/')
    .get(
        authController.protect,
        userController.getUsers
    )
    .post(userController.createUser);


router
    .route('/:id')
    .get(userController.getUser)
    .patch(
        authController.restrictTo('admin', 'seller', 'partners'),
        userController.updateUser
    )
    .delete(
        authController.restrictTo('admin', 'seller', 'partners'),
        userController.deleteUser
    );

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