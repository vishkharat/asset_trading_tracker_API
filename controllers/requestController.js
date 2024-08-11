const PurchaseRequest = require('../models/PurchaseRequest');
const Asset = require('../models/Asset'); 
const User = require('../models/User');

// request to negotiate 
exports.negotiateRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const newProposedPrice = req.body.newProposedPrice; 

    if (newProposedPrice <= 0) {
      return res.status(400).json({ message: 'Proposed price must be greater than zero' });
    }

    const request = await PurchaseRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request is not open for negotiation' });
    }

    request.proposedPrice = newProposedPrice;
    await request.save();

    res.status(200).json({ message: 'Negotiation updated' });
  } catch (error) {
    console.error('Error negotiating purchase request:', error);
    res.status(500).json({ message: 'Error negotiating purchase request', error: error.message });
  }
};

//request to accept
exports.acceptRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const userId = req.userId;

    const request = await PurchaseRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request is not open for acceptance' });
    }

    if (request.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to accept this request' });
    }

    
    const asset = await Asset.findById(request.assetId);
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    
    request.status = 'accepted';
    await request.save();

    
    asset.currentHolder = userId;
    await asset.save();

    res.status(200).json({ message: 'Request accepted, holder updated' });
  } catch (error) {
    console.error('Error accepting purchase request:', error);
    res.status(500).json({ message: 'Error accepting purchase request', error: error.message });
  }
};

// request to deny
exports.denyRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    
    const request = await PurchaseRequest.findById(requestId);
    

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request is not open for denial' });
    }

    request.status = 'denied';
    await request.save();

    res.status(200).json({ message: 'Request denied' });
  } catch (error) {
    console.error('Error denying purchase request:', error);
    res.status(500).json({ message: 'Error denying purchase request', error: error.message });
  }
};




// Get user purchase requests
exports.getUserRequests = async (req, res) => {
  try {
    const userId = req.params.id; 
    const requests = await PurchaseRequest.find({ userId }); 

    
    const formattedRequests = requests.map(request => ({
      requestId: request._id,
      assetId: request.assetId,
      proposedPrice: request.proposedPrice,
      status: request.status
    }));

    res.status(200).json(formattedRequests); 
  } catch (error) {
    console.error('Error retrieving user requests:', error); 
    res.status(500).json({ message: 'Error retrieving user requests', error: error.message });
  }
};
