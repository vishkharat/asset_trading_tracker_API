///request routes 

const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const authMiddleware = require('../middleware/authMiddleware');

// Route for negotiating a purchase request
router.post('/requests/:id/negotiate', authMiddleware, requestController.negotiateRequest);

// Route for accepting a purchase request
router.put('/requests/:id/accept', authMiddleware, requestController.acceptRequest);

// Route for denying a purchase request
router.post('/requests/:id/deny', authMiddleware, requestController.denyRequest);

// Route for getting user requests
router.get('/requests/users/:id/requests', authMiddleware, requestController.getUserRequests);

module.exports = router;
