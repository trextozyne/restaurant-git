const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const category = require('../controllers/category.controller');


// a simple test url to check that all of our files are communicating correctly.
router.post('/write', category.write);
router.get('/read', category.read);
router.get('/find/:categoryId', category.find);
router.put('/update/:categoryId', category.update);
router.delete('/delete/:categoryId', category.delete);
module.exports = router;