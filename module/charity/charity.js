const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const charitySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: { type: String , required: true},
  address: { type: String , required: true},
  taxCode: { type: String , required: true},
  image: { type: [String] },
  video: { type: [String] },
  description: { type: String },
  type: { type: String, enum: ['individual', 'corporate', 'non-profit'], required: true },
  stripeId: { type: String }
});

module.exports = mongoose.model('Charity', charitySchema);
