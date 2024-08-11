const Asset = require('../models/Asset');
const Request = require('../models/PurchaseRequest');
//for create asset
exports.createAsset = async (req, res) => {
  try {
    const { name, description, image, status } = req.body;
    if (!name || !description || !image || !status) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newAsset = new Asset({
      name,
      description,
      image,
      status,
      creator: req.userId
    });
    await newAsset.save();
    res.status(201).json({ message: 'Asset created successfully', assetId: newAsset._id });
  } catch (error) {
    console.error('Error creating asset:', error);
    res.status(500).json({ message: 'Error creating asset', error });
  }
};

//for update asset
exports.updateAsset = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image, status } = req.body;

    // Validate the input
    if (!name || !description || !image || !status) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Find and update the asset
    const updatedAsset = await Asset.findByIdAndUpdate(
      id,
      { name, description, image, status },
      { new: true, runValidators: true } // Return the updated asset and validate the update
    );

    if (!updatedAsset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    res.status(200).json({ message: 'Asset updated successfully', assetId: updatedAsset._id });
  } catch (error) {
    console.error('Error updating asset:', error);
    res.status(500).json({ message: 'Error updating asset', error });
  }
};

//for publish the asset on marketplace
exports.publishAsset = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Publishing Asset ID:', id);

    // Find and update the asset status to 'published'
    const updatedAsset = await Asset.findByIdAndUpdate(
      id,
      { status: 'published' },
      { new: true, runValidators: true } // Return the updated asset and validate the update
    );

    if (!updatedAsset) {
      console.log('Asset not found:', id);
      return res.status(404).json({ message: 'Asset not found' });
    }

    console.log('Updated Asset:', updatedAsset);
    res.status(200).json({ message: 'Asset published successfully' });
  } catch (error) {
    console.error('Error publishing asset:', error);
    res.status(500).json({ message: 'Error publishing asset', error });
  }
};

//for getting asstes details
exports.getAssetDetails = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch asset details by ID
    const asset = await Asset.findById(id);

    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    
    res.status(200).json({
      id: asset._id,
      name: asset.name,
      description: asset.description,
      image: asset.image,
      creator: asset.creator,
      currentHolder: asset.currentHolder,
      tradingJourney: asset.tradingJourney,
      averageTradingPrice: asset.averageTradingPrice,
      lastTradingPrice: asset.lastTradingPrice,
      numberOfTransfers: asset.numberOfTransfers,
      isListed: asset.status === 'published',
      proposals: asset.proposals
    });
  } catch (error) {
    console.error('Error fetching asset details:', error);
    res.status(500).json({ message: 'Error fetching asset details', error });
  }
};

// for getting assets of users on platform using user_ID
exports.getUserAssets = async (req, res) => {
  const { id } = req.params;

  try {
    
    const assets = await Asset.find({ creator: id });

    if (assets.length === 0) {
      return res.status(404).json({ message: 'No assets found for this user' });
    }

    
    res.status(200).json(assets.map(asset => ({
      id: asset._id,
      name: asset.name,
      description: asset.description,
      image: asset.image,
      currentHolder: asset.currentHolder,
      tradingJourney: asset.tradingJourney,
      averageTradingPrice: asset.averageTradingPrice,
      lastTradingPrice: asset.lastTradingPrice,
      numberOfTransfers: asset.numberOfTransfers,
      isListed: asset.status === 'published',
      proposals: asset.proposals
    })));
  } catch (error) {
    console.error('Error fetching user assets:', error);
    res.status(500).json({ message: 'Error fetching user assets', error });
  }
};

// for create a request to buy asset
exports.requestToBuyAsset = async (req, res) => {
  const { id } = req.params;
  const { proposedPrice } = req.body;
  const userId = req.userId; 

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    
    if (proposedPrice <= 0) {
      return res.status(400).json({ message: 'Proposed price must be greater than zero' });
    }

    
    const asset = await Asset.findById(id);
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    // Create a new purchase request
    const newRequest = new Request({
      assetId: id,
      userId: userId, // Corrected here
      proposedPrice,
      status: 'pending'
    });
    await newRequest.save();

    res.status(201).json({ message: 'Purchase request sent', requestId: newRequest._id });
  } catch (error) {
    console.error('Error requesting to buy asset:', error); 
    res.status(500).json({ message: 'Error requesting to buy asset', error: error.message });
  }
};

