//marketplace routes


const express = require('express');

const router = express.Router();
const marketplaceController = require('../controllers/marketplaceController');

router.get('/assets', marketplaceController.getAssetsOnMarketplace);

module.exports = router;
