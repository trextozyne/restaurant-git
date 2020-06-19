const express = require('express');
const router = express.Router();

const multer = require('multer');
var path = require('path');

var storage = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, path.join(__dirname, '../assets/images/customer')); // set the destination
    },
    filename: function(req, file, callback){
        callback(null, 'images' + new Date().toISOString().replace(/:/g,'-') + '.jpg'); // set the file name and extension
    }
});

var upload = multer({storage: storage});

// Require the controllers WHICH WE DID NOT CREATE YET!!
const customer = require('../controllers/customer.controller');


// a simple test url to check that all of our files are communicating correctly.
router.post('/write', upload.single('file'), customer.write);
router.get('/read', customer.read);
router.get('/find/:id', customer.find);
router.put('/update/:id', upload.single("file"), customer.update);
router.delete('/delete/:id', customer.delete);
module.exports = router;