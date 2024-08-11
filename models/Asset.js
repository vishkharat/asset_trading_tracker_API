const mongoose = require('mongoose');
// asset schema 
const AssetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  currentHolder: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tradingJourney: [{
    holder: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date },
    price: { type: Number }
  }],
  averageTradingPrice: { type: Number },
  lastTradingPrice: { type: Number },
  numberOfTransfers: { type: Number, default: 0 },
  isListed: { type: Boolean, default: false },
  proposals: { type: Number, default: 0 }
});

module.exports = mongoose.model('Asset', AssetSchema);
