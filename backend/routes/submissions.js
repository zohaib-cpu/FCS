const express = require('express');
const router = express.Router();
const Response = require('../models/Response');
const Form = require('../models/Form');
const { auth, permit } = require('../middleware/auth');

// Submit a response to a form
router.post('/:formId', auth, async (req, res) => {
  try {
    const { formId } = req.params;
    const { answers } = req.body;

    const form = await Form.findById(formId);
    if (!form) return res.status(404).json({ message: 'Form not found' });

    // optionally enforce single submission
    const allowMultiple = form.allowMultipleSubmissions;
    if (!allowMultiple) {
      const existing = await Response.findOne({ form: formId, submittedBy: req.user._id });
      if (existing) return res.status(400).json({ message: 'You have already submitted this form' });
    }

    const response = new Response({
      form: formId,
      submittedBy: req.user._id,
      answers: answers || []
    });

    await response.save();
    res.status(201).json({ message: 'Response saved', id: response._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving response' });
  }
});

// Get responses for a form (admin/faculty/creator)
router.get('/form/:formId', auth, async (req, res) => {
  try {
    const form = await Form.findById(req.params.formId);
    if (!form) return res.status(404).json({ message: 'Form not found' });

    // Only creator, admin, or faculty can view responses
    const isCreator = form.createdBy?.toString() === req.user._id.toString();
    if (!isCreator && req.user.role === 'student') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const responses = await Response.find({ form: req.params.formId }).populate('submittedBy', 'name email role');
    res.json(responses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching responses' });
  }
});

module.exports = router;
