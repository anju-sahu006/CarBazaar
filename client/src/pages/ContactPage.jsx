import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { validateEmail } from '../utils/validation';

export default function ContactPage() {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !validateEmail(email) || !message.trim()) {
      showToast('Please enter your name, a valid email, and a message.', 'error');
      return;
    }
    setSubmitted(true);
    showToast('Thank you for contacting CarBazaar! Our support team will reply soon.', 'success');
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="section">
      <div className="container">
        <div className="section-header">
          <div>
            <div className="section-eyebrow">Support &amp; Enquiries</div>
            <h1 className="section-title">Contact CarBazaar</h1>
            <p className="section-desc">
              Have questions about buying, selling, or listing verification? Reach out to our team.
            </p>
          </div>
        </div>

        <div className="grid-2" style={{ alignItems: 'start' }}>
          <form onSubmit={handleSubmit} className="card" style={{ padding: '28px' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '18px' }}>Send Us a Message</h2>
            {submitted && (
              <div
                style={{
                  background: 'var(--success-bg)',
                  color: '#15803D',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  fontSize: '0.9rem',
                  fontWeight: 600
                }}
              >
                Your message has been received. Our team will get back to you within 24 hours.
              </div>
            )}
            <div className="filter-group">
              <label className="filter-label" htmlFor="c-name">Full Name</label>
              <input
                id="c-name"
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            <div className="filter-group">
              <label className="filter-label" htmlFor="c-email">Email Address</label>
              <input
                id="c-email"
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div className="filter-group">
              <label className="filter-label" htmlFor="c-subject">Subject</label>
              <input
                id="c-subject"
                type="text"
                className="form-control"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="How can we help?"
              />
            </div>
            <div className="filter-group">
              <label className="filter-label" htmlFor="c-msg">Message</label>
              <textarea
                id="c-msg"
                rows={4}
                className="form-control"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your query here..."
              />
            </div>
            <button type="submit" className="btn btn-accent btn-lg">
              <Send size={17} />
              <span>Send Message</span>
            </button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '14px' }}>Customer Support Desk</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Phone size={18} color="var(--secondary)" />
                  <span>+91 1800-202-4545 (Mon–Sat, 9 AM – 7 PM)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Mail size={18} color="var(--secondary)" />
                  <span>support@carbazaar.com</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <MapPin size={18} color="var(--secondary)" />
                  <span>Tower B, DLF Cyber Hub, Gurugram, Haryana 122002</span>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '24px', background: 'var(--primary)', color: '#FFFFFF' }}>
              <h3 style={{ color: '#FFFFFF', marginBottom: '8px' }}>Demo Credentials</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', marginBottom: '12px' }}>
                Testing CarBazaar for evaluation? Use our built-in demo accounts on the Login page:
              </p>
              <ul style={{ listStyle: 'none', fontSize: '0.86rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li><strong>Buyer:</strong> buyer@carbazaar.com / Buyer123</li>
                <li><strong>Seller:</strong> seller@carbazaar.com / Seller123</li>
                <li><strong>Admin:</strong> admin@carbazaar.com / Admin123</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
