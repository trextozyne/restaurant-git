const express = require('express');
const router = express.Router();

const multer = require('multer');
var path = require('path');

var storage = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, path.join(__dirname, '../assets/images/restaurant_register')); // set the destination
    },
    filename: function(req, file, callback){
        callback(null, 'images' + new Date().toISOString().replace(/:/g,'-') + '.jpg'); // set the file name and extension
    }
});

var upload = multer({storage: storage});

// Require the controllers WHICH WE DID NOT CREATE YET!!
const restaurant_register = require('../controllers/restaurant_register.controller');


// a simple test url to check that all of our files are communicating correctly.
router.post('/write', upload.single('file'), restaurant_register.write);
router.get('/read', restaurant_register.read);
router.get('/find/:id', restaurant_register.find);
router.put('/update/:id', upload.single("file"), restaurant_register.update);
router.delete('/delete/:id', restaurant_register.delete);
module.exports = router;