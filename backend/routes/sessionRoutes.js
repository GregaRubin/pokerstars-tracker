var express = require('express');
var multer = require('multer');
var auth = require('../auth.js');
var upload = multer({dest: 'public/sessionLogs/'});

var router = express.Router();
var sessionController = require('../controllers/sessionController.js');

//router.get('/', sessionController.listOwn);
router.get('/listOwn', auth.requiresLogin, sessionController.listOwn);
router.get('/stats', auth.requiresLogin, sessionController.stats);
//router.get('/:id', sessionController.show);

router.post('/', auth.requiresLogin, upload.array('files'), sessionController.upload);


//router.delete('/:id', sessionController.remove);

module.exports = router;