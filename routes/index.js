const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const roleController = require('../controllers/role.controller');

router.get('/', userController.index);

router.get('/manage_user', userController.manage_user);
router.get('/author_user/:id', userController.author_user);

router.get('/manage_role', roleController.manage_role);
router.get('/create_role', roleController.create_role);
router.get('/update_role/:id', roleController.update_role);

router.post('/author_user/:id', userController.handle_author_user);
router.post('/create_role', roleController.handle_create_role);
router.post('/update_role/:id', roleController.handle_update_role);
router.post('/delete_role/:id', roleController.handle_delete_role);

module.exports = router;
