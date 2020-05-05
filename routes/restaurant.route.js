const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const restaurant = require('../controllers/restaurant.controller');


// a simple test url to check that all of our files are communicating correctly.
router.post('/write', restaurant.write);
router.get('/read', restaurant.read);
router.get('/find/:menuItemId', restaurant.find);
router.put('/update/:menuItemId', restaurant.update);
router.delete('/delete/:menuItemId', restaurant.delete);
module.exports = router;