const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  qid: { type: String, required: true },
  label: { type: String, required: true },
  type: { 
    type: String, 
    required: true, 
    enum: ['text', 'textarea', 'radio', 'checkbox', 'rating'] 
  },
  required: { type: Boolean, default: false },
  options: { type: [String], default: [] } // for radio/checkbox
});

const FormSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  target: { type: String, default: 'general' },
  questions: { type: [QuestionSchema], default: [] },
  allowMultipleSubmissions: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Form', FormSchema);
