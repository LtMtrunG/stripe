const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  goalAmount: { type: Number, required: true },
  raisedAmount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  duration: { type: String, required: true },
  status: { type: String, enum: ['pending', 'active', 'halted', 'closed'], required: true },
  charity: { type: Schema.Types.ObjectId, ref: 'Charity', required: true },
  account: { type: String },
  image: { type: [String] },
  video: { type: [String] },
  stripeId: { type: String }
});

module.exports = mongoose.model('Project', projectSchema);
