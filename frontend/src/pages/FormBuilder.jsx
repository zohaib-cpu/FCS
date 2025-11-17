import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import './FormBuilder.css';

export default function FormBuilder() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  // Add new question
  const addQuestion = () => {
    setQuestions(prev => [
      ...prev,
      { qid: uuidv4(), label: '', type: 'text', options: [], required: false }
    ]);
  };

  // Update a question
  const updateQuestion = (idx, patch) => {
    setQuestions(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], ...patch };
      return copy;
    });
  };

  // Remove a question
  const removeQuestion = (idx) => setQuestions(prev => prev.filter((_, i) => i !== idx));

  // Submit form
  const submit = async (e) => {
    e.preventDefault();

    // Ensure all question labels are filled
    if (questions.some(q => !q.label.trim())) {
      alert('Please fill in all question labels.');
      return;
    }

    // Proper payload (send as object, NOT string)
    const payload = {
      title: title.trim(),
      description: description.trim(),
      questions: questions.map(q => ({
        qid: q.qid,
        label: q.label.trim(),
        type: q.type,
        required: q.required || false,
        options: Array.isArray(q.options) ? q.options : []
      }))
    };

    try {
      await API.post('/forms', payload); // ✅ correct
      alert('Form created');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to create form');
    }
  };

  return (
    <div className="formbuilder-page">
      <h1 className="formbuilder-header">Feedback Collection System</h1>
      <div className="formbuilder-container">
        <h3 className="formbuilder-title">Create New Form</h3>
        <form onSubmit={submit}>
          <div className="form-group">
            <label>Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} />
          </div>

          <div className="questions-section">
            <h4>Questions</h4>
            <button type="button" className="submit-btn bounce-hover" onClick={addQuestion}>
              Add Question
            </button>

            {questions.map((q, idx) => (
              <div key={q.qid} className="question-card">
                <div className="form-group">
                  <label>Label</label>
                  <input
                    value={q.label}
                    onChange={e => updateQuestion(idx, { label: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Type</label>
                  <select
                    value={q.type}
                    onChange={e => updateQuestion(idx, { type: e.target.value })}
                  >
                    <option value="text">Text</option>
                    <option value="textarea">Long text</option>
                    <option value="radio">Single choice</option>
                    <option value="checkbox">Multiple choice</option>
                    <option value="rating">Rating (1-5)</option>
                  </select>
                </div>

                {(q.type === 'radio' || q.type === 'checkbox') && (
                  <div className="form-group">
                    <label>Options (comma separated)</label>
                    <input
                      value={q.options?.join(',') || ''}
                      onChange={e => {
                        const val = e.target.value;
                        updateQuestion(idx, {
                          options: val
                            ? val.split(',').map(s => s.trim()).filter(Boolean)
                            : []
                        });
                      }}
                    />
                  </div>
                )}

                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={q.required || false}
                      onChange={e => updateQuestion(idx, { required: e.target.checked })}
                    />{' '}
                    Required
                  </label>
                </div>

                <button type="button" className="remove-btn" onClick={() => removeQuestion(idx)}>
                  Remove
                </button>
              </div>
            ))}
          </div>

          <button type="submit" className="submit-btn bounce-hover">Create Form</button>
        </form>
      </div>
    </div>
  );
}
