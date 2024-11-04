var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController.js');
var auth = require('../auth.js');
var multer = require('multer');
var upload = multer({dest: 'public/images/'});


/*
 * GET
 */

router.get('/logout', userController.logout);
router.get('/profile', auth.requiresLogin, userController.profile);
router.get('/leaderboards', userController.leaderboards);
router.get('/:id', userController.show);

/*
 * POST
 */
router.post('/', userController.create);
router.post('/login', userController.login);
router.post('/update', auth.requiresLogin, upload.single('image'), userController.update);

/*
 * PUT
 */
router.put('/:id', userController.update);

/*
 * DELETE
 */
router.delete('/:id', auth.requiresLogin, userController.remove);

module.exports = router;
