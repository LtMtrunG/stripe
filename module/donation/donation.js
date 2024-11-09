const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const donationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'Donor' },
  project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  stripeTransactionId: { type: String , required: true}
});

module.exports = mongoose.model('Donation', donationSchema);
