//asset route
const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, assetController.createAsset);
router.post('/:id', authMiddleware, assetController.updateAsset);
router.put('/:id/publish', authMiddleware, assetController.publishAsset);
router.get('/:id', assetController.getAssetDetails);
router.get('/users/:id/assets', authMiddleware, assetController.getUserAssets);
// Route for requesting to buy an asset
router.post('/:id/request', authMiddleware, assetController.requestToBuyAsset);

module.exports = router;
