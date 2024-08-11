// PurchaseRequests schema
const mongoose = require('mongoose');

const purchaseRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  assetId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Asset' },
  proposedPrice: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['pending', 'accepted', 'denied'], default: 'pending' }
  

});

module.exports = mongoose.model('PurchaseRequest', purchaseRequestSchema);
