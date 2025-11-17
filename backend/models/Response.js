const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  form: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  answers: [
    {
      qid: String,
      value: mongoose.Schema.Types.Mixed // support string, number, array
    }
  ],
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Response', responseSchema);
