const express = require('express');
const router = express.Router();

const multer = require('multer');
var path = require('path');

var storage = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, path.join(__dirname, '../assets/images/gallery')); // set the destination
    },
    filename: function(req, file, callback){
        callback(null, 'images' + new Date().toISOString().replace(/:/g,'-') + '.jpg'); // set the file name and extension
    }
});

var upload = multer({storage: storage});

// Require the controllers WHICH WE DID NOT CREATE YET!!
const menu_item = require('../controllers/menu-item.controller');


// a simple test url to check that all of our files are communicating correctly.
router.post('/write', upload.single('file'), menu_item.write);
router.get('/read', menu_item.read);
router.get('/find/:menuItemId', menu_item.find);
router.put('/update/:menuItemId', upload.single("file"), menu_item.update);
router.delete('/delete/:menuItemId', menu_item.delete);
module.exports = router;