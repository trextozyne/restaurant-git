
const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const city = require('../controllers/city.controller');


// a simple test url to check that all of our files are communicating correctly.
router.post('/write', city.write);
router.get('/read', city.read);
router.get('/find/:id', city.find);
router.put('/update/:id',  city.update);
router.delete('/delete/:id', city.delete);
module.exports = router;