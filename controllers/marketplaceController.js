
// marketplaceControl
const Asset = require('../models/Asset');

exports.getAssetsOnMarketplace = async (req, res) => {
  try {
    // Fetch all assets that are listed
    const assets = await Asset.find({ status: 'published' });

    
    if (assets.length === 0) {
      return res.status(404).json({ message: 'No assets found on the marketplace' });
    }

    
    res.status(200).json(assets.map(asset => ({
      id: asset._id,
      name: asset.name,
      description: asset.description,
      image: asset.image,
      currentHolder: asset.currentHolder,
      price: asset.averageTradingPrice,
      proposals: asset.proposals
    })));
  } catch (error) {
    console.error('Error fetching marketplace assets:', error);
    res.status(500).json({ message: 'Error fetching marketplace assets', error });
  }
};

