const express = require('express');
const router = express.Router();
const Form = require('../models/Form');
const { auth, permit } = require('../middleware/auth');

// Create a form (admin or faculty)
router.post('/', auth, permit('admin', 'faculty'), async (req, res) => {
  try {
    const { title, description, questions, target, allowMultipleSubmissions } = req.body;

    if (!title || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: 'Title and questions are required' });
    }

    const mappedQuestions = questions.map(q => ({
      qid: q.qid,
      label: q.label?.trim() || 'Untitled Question',
      type: q.type,
      required: !!q.required,
      options: Array.isArray(q.options) ? q.options.filter(Boolean) : []
    }));

    console.log('Mapped questions:', mappedQuestions); // debug

    const form = new Form({
      title: title.trim(),
      description: description?.trim() || '',
      target: target || 'general',
      allowMultipleSubmissions: !!allowMultipleSubmissions,
      questions: mappedQuestions,
      createdBy: req.user._id
    });

    await form.save();
    res.status(201).json(form);
  } catch (err) {
    console.error('Error creating form:', err);
    res.status(500).json({ message: 'Error creating form', error: err.message });
  }
});

// Edit form
router.put('/:id', auth, async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ message: 'Form not found' });

    const isCreator = form.createdBy?.toString() === req.user._id.toString();
    if (!isCreator && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

    Object.assign(form, req.body);
    await form.save();
    res.json(form);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating form' });
  }
});

// Get all forms
router.get('/', auth, async (req, res) => {
  try {
    const filter = {};
    if (req.query.target) filter.target = req.query.target;
    const forms = await Form.find(filter).sort({ createdAt: -1 });
    res.json(forms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching forms' });
  }
});

// Get single form
router.get('/:id', auth, async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ message: 'Form not found' });
    res.json(form);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching form' });
  }
});

module.exports = router;
