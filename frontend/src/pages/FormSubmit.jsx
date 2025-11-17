import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import './FormSubmit.css'; // new CSS file for styling

export default function FormSubmit() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchForm();
  }, [id]);

  const fetchForm = async () => {
    try {
      const res = await API.get(`/forms/${id}`);
      setForm(res.data);

      // Initialize answers
      const init = {};
      res.data.questions.forEach(q => init[q.qid] = q.type === 'checkbox' ? [] : '');
      setAnswers(init);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (qid, value, type) => {
    if (type === 'checkbox') {
      const arr = answers[qid] || [];
      const exists = arr.includes(value);
      setAnswers(prev => ({ ...prev, [qid]: exists ? arr.filter(a => a !== value) : [...arr, value] }));
    } else {
      setAnswers(prev => ({ ...prev, [qid]: value }));
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const payload = { answers: Object.keys(answers).map(qid => ({ qid, value: answers[qid] })) };
      await API.post(`/submissions/${id}`, payload);
      setMessage('Thanks — your response was recorded.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Submission failed.');
    }
  };

  if (!form) return <div className="loading">Loading form...</div>;

  return (
    <div className="formsubmit-page">
      <div className="formsubmit-container">
        <h2 className="formsubmit-title">{form.title}</h2>
        <p className="formsubmit-desc">{form.description}</p>

        {message && <div className="formsubmit-message">{message}</div>}

        <form onSubmit={submit} className="formsubmit-form">
          {form.questions.map(q => (
            <div key={q.qid} className="formsubmit-question">
              <label className="question-label">
                {q.label} {q.required && <span className="required">*</span>}
              </label>

              {q.type === 'text' && (
                <input
                  type="text"
                  value={answers[q.qid]}
                  onChange={e => handleChange(q.qid, e.target.value, q.type)}
                  required={q.required}
                  className="form-input"
                />
              )}

              {q.type === 'textarea' && (
                <textarea
                  value={answers[q.qid]}
                  onChange={e => handleChange(q.qid, e.target.value, q.type)}
                  required={q.required}
                  className="form-textarea"
                />
              )}

              {(q.type === 'radio' || q.type === 'checkbox') && (
                <div className="form-options">
                  {q.options.map(opt => (
                    <label key={opt} className="form-option">
                      <input
                        type={q.type}
                        name={q.type === 'radio' ? q.qid : opt}
                        value={opt}
                        checked={
                          q.type === 'radio'
                            ? answers[q.qid] === opt
                            : (answers[q.qid] || []).includes(opt)
                        }
                        onChange={() => handleChange(q.qid, opt, q.type)}
                        required={q.type === 'radio' ? q.required : false}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              )}

              {q.type === 'rating' && (
                <select
                  value={answers[q.qid]}
                  onChange={e => handleChange(q.qid, Number(e.target.value), q.type)}
                  required={q.required}
                  className="form-select"
                >
                  <option value="">Select rating</option>
                  {[1, 2, 3, 4, 5].map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              )}
            </div>
          ))}

          <button type="submit" className="submit-btn bounce-hover">
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
}
