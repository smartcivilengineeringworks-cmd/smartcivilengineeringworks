import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { projectsList } from '../data/projectsData';

const XIcon = () => (
  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);


const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });

  const [botcheck, setBotcheck] = useState(false);

  const [formStatus, setFormStatus] = useState({
    submitting: false,
    success: false,
    error: null
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = 'Full name is required';
    if (!formData.email.trim()) {
      tempErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Email address is invalid';
    }
    if (!formData.phone.trim()) {
      tempErrors.phone = 'Phone number is required';
    } else if (!/^\+?[0-9]{9,15}$/.test(formData.phone.replace(/\s+/g, ''))) {
      tempErrors.phone = 'Invalid phone number format';
    }
    if (!formData.message.trim()) tempErrors.message = 'Message content cannot be empty';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setFormStatus({ submitting: true, success: false, error: null });

    // Spam honeypot check
    if (botcheck) {
      setTimeout(() => {
        setFormStatus({
          submitting: false,
          success: true,
          error: null
        });
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: 'General Inquiry',
          message: ''
        });
        setBotcheck(false);
      }, 1000);
      return;
    }

    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

    try {
      // 1. Save lead to Neon PostgreSQL database
      const neonRes = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message
        })
      });

      // 2. Also forward to Web3Forms if valid key is set
      if (accessKey && accessKey !== 'YOUR_ACCESS_KEY_HERE') {
        fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_key: accessKey,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            subject: formData.subject,
            message: formData.message,
            from_name: 'Smart Civil Engineering Works Website'
          })
        }).catch((e) => console.warn('Web3Forms forwarding error:', e));
      }

      setFormStatus({
        submitting: false,
        success: true,
        error: null
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'General Inquiry',
        message: ''
      });
    } catch (err) {
      setFormStatus({
        submitting: false,
        success: false,
        error: 'Network error occurred. Please verify your connection and try again.'
      });
    }
  };

  return (
    <div className="pt-16 bg-warm-bg text-slate-700 font-sans">

      {/* Header */}
      <section className="bg-navy text-white py-16 md:py-24 relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-cover bg-center opacity-15" style={{ backgroundImage: `url('${projectsList.find(p => p.id === 1)?.image || ''}')` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/90 to-navy/40" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-accent text-[10px] sm:text-xs font-bold tracking-widest uppercase bg-accent/15 px-4 py-1.5 rounded-full border border-accent/25">
            Contact us
          </span>
          <h1 className="text-3xl md:text-5xl font-serif font-black tracking-tight uppercase leading-tight text-white">
            Let's Discuss Your Project
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-medium">
            Fill out the form below or use our contact information to connect with our engineering offices.
          </p>
        </div>
      </section>

      {/* Main Grid Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 bg-warm-bg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">

          {/* Left Column: Contact Cards Info */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-2xl md:text-3xl font-serif font-black text-navy uppercase leading-snug">
              Contact Details
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
              If you have standard project requests, bidding invitations, or structural audit briefs, reach out directly.
            </p>

            <div className="space-y-4">

              {/* Phone card */}
              <div className="bg-white border border-slate-200/50 p-5 md:p-6 rounded-2xl flex items-start space-x-4 shadow-md hover:border-accent/10 transition-all duration-300">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent border border-accent/20">
                  <Phone className="h-4.5 w-4.5" />
                </div>
                <div className="space-y-1">
                  <span className="text-slate-500 text-[10px] font-bold tracking-wider uppercase block">Direct Phone</span>
                  <span className="text-navy font-black text-sm sm:text-base block">+250 788 326 103</span>
                </div>
              </div>

              {/* Email card */}
              <div className="bg-white border border-slate-200/50 p-5 md:p-6 rounded-2xl flex items-start space-x-4 shadow-md hover:border-accent/10 transition-all duration-300">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent border border-accent/20">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <div className="space-y-1">
                  <span className="text-slate-500 text-[10px] font-bold tracking-wider uppercase block">Email Address</span>
                  <span className="text-navy font-black text-xs sm:text-sm block break-all">smartcivilengineeringworks@gmail.com</span>
                </div>
              </div>

              {/* Address card */}
              <div className="bg-white border border-slate-200/50 p-5 md:p-6 rounded-2xl flex items-start space-x-4 shadow-md hover:border-accent/10 transition-all duration-300">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent border border-accent/20">
                  <MapPin className="h-4.5 w-4.5" />
                </div>
                <div className="space-y-1">
                  <span className="text-slate-500 text-[10px] font-bold tracking-wider uppercase block">Headquarters</span>
                  <p className="text-navy text-xs sm:text-sm font-bold leading-relaxed">
                    Kabeza Village, Kigarama Cell, Kigarama Sector, Kicukiro District, Kigali City, Rwanda
                  </p>
                </div>
              </div>

              {/* Hours card */}
              <div className="bg-white border border-slate-200/50 p-5 md:p-6 rounded-2xl flex items-start space-x-4 shadow-md hover:border-accent/10 transition-all duration-300">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent border border-accent/20">
                  <Clock className="h-4.5 w-4.5" />
                </div>
                <div className="space-y-1 text-xs sm:text-sm">
                  <span className="text-slate-500 text-[10px] font-bold tracking-wider uppercase block">Office Hours</span>
                  <div className="flex flex-col text-navy font-black space-y-0.5 mt-1">
                    <span>Monday - Friday: 8:00 AM - 5:00 PM</span>
                    <span>Saturday: 9:00 AM - 1:00 PM</span>
                    <span className="text-slate-450 font-semibold">Sunday: Closed</span>
                  </div>
                </div>
              </div>

              {/* Social Connect card */}
              <div className="bg-white border border-slate-200/50 p-5 md:p-6 rounded-2xl flex flex-col space-y-3.5 shadow-md hover:border-accent/10 transition-all duration-300">
                <span className="text-slate-500 text-[10px] font-bold tracking-wider uppercase block">Follow Our Works</span>
                <div className="flex items-center space-x-3.5">
                  <a
                    href="https://x.com/smartcivileng"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-50 hover:bg-accent hover:text-white border border-slate-200/50 transition-all text-xs font-bold text-navy"
                  >
                    <XIcon />
                    <span>smartcivileng</span>
                  </a>
                  <a
                    href="https://www.instagram.com/smartcivilengineeringworks?igsh=MWR2NjhwbmpnYW96bA=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-50 hover:bg-accent hover:text-white border border-slate-200/50 transition-all text-xs font-bold text-navy"
                  >
                    <InstagramIcon />
                    <span>Instagram</span>
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-white border border-slate-200/50 p-6 md:p-8 rounded-2xl shadow-md relative text-slate-750">
            <h3 className="text-navy font-serif font-black text-lg sm:text-xl uppercase border-b border-slate-100 pb-3 mb-4">
              Send Us a Message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Honeypot Spam Protection */}
              <input
                type="checkbox"
                name="botcheck"
                checked={botcheck}
                onChange={(e) => setBotcheck(e.target.checked)}
                className="hidden"
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
              />

              {/* Form Status Messages */}
              {formStatus.success && (
                <div className="bg-emerald-50 border border-emerald-250 p-3 rounded-lg flex items-center space-x-2.5 text-emerald-700 text-xs sm:text-sm font-semibold">
                  <CheckCircle className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                  <span>Your message was sent successfully! We will get back to you shortly.</span>
                </div>
              )}

              {formStatus.error && (
                <div className="bg-rose-50 border border-rose-200 p-3 rounded-lg flex items-center space-x-2.5 text-rose-700 text-xs sm:text-sm font-semibold">
                  <AlertCircle className="h-4.5 w-4.5 text-rose-600 shrink-0 animate-bounce" />
                  <span>{formStatus.error}</span>
                </div>
              )}

              {/* Grid Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-semibold">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-slate-500 font-bold text-[10px] sm:text-xs tracking-wide uppercase">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border bg-slate-50 text-slate-800 text-sm focus:outline-none transition-all ${errors.name ? 'border-accent bg-accent/5' : 'border-slate-200 focus:border-accent focus:bg-white'
                      }`}
                    placeholder="John Doe"
                  />
                  {errors.name && <span className="text-accent text-xs font-semibold flex items-center space-x-1"><AlertCircle className="h-3.5 w-3.5 inline shrink-0" /> <span>{errors.name}</span></span>}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-slate-500 font-bold text-[10px] sm:text-xs tracking-wide uppercase">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border bg-slate-50 text-slate-800 text-sm focus:outline-none transition-all ${errors.email ? 'border-accent bg-accent/5' : 'border-slate-200 focus:border-accent focus:bg-white'
                      }`}
                    placeholder="john@example.com"
                  />
                  {errors.email && <span className="text-accent text-xs font-semibold flex items-center space-x-1"><AlertCircle className="h-3.5 w-3.5 inline shrink-0" /> <span>{errors.email}</span></span>}
                </div>
              </div>

              {/* Grid Phone + Subject */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-semibold">
                <div className="space-y-1.5">
                  <label htmlFor="phone" className="text-slate-500 font-bold text-[10px] sm:text-xs tracking-wide uppercase">Phone Number</label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border bg-slate-50 text-slate-800 text-sm focus:outline-none transition-all ${errors.phone ? 'border-accent bg-accent/5' : 'border-slate-200 focus:border-accent focus:bg-white'
                      }`}
                    placeholder="+250 788 326 103"
                  />
                  {errors.phone && <span className="text-accent text-xs font-semibold flex items-center space-x-1"><AlertCircle className="h-3.5 w-3.5 inline shrink-0" /> <span>{errors.phone}</span></span>}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="subject" className="text-slate-500 font-bold text-[10px] sm:text-xs tracking-wide uppercase">Subject</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-sm focus:outline-none focus:border-accent focus:bg-white transition-all font-semibold"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Residential Construction">Residential Construction</option>
                    <option value="Commercial Construction">Commercial Construction</option>
                    <option value="Infrastructure Project">Infrastructure Project</option>
                    <option value="Interior & Finishing">Interior & Finishing</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-1.5 font-semibold">
                <label htmlFor="message" className="text-slate-500 font-bold text-[10px] sm:text-xs tracking-wide uppercase">Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border bg-slate-50 text-slate-800 text-sm focus:outline-none transition-all ${errors.message ? 'border-accent bg-accent/5' : 'border-slate-200 focus:border-accent focus:bg-white'
                    }`}
                  placeholder="Describe your project..."
                />
                {errors.message && <span className="text-accent text-xs font-semibold flex items-center space-x-1"><AlertCircle className="h-3.5 w-3.5 inline shrink-0" /> <span>{errors.message}</span></span>}
              </div>

              {/* Submit button */}
              <div className="pt-2 font-semibold">
                <button
                  type="submit"
                  disabled={formStatus.submitting}
                  className="flex items-center justify-center space-x-2 w-full py-3.5 bg-accent hover:bg-navy text-white font-bold text-xs sm:text-sm tracking-wider uppercase rounded-full transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01]"
                >
                  {formStatus.submitting ? (
                    <span>Submitting Message...</span>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

        </div>
      </section>

      {/* Map Embed Section */}
      <section className="bg-white border-t border-slate-200/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-2xl md:text-3xl font-serif font-black text-navy uppercase tracking-wide">
              Smart Civil Works Location
            </h3>
            <p className="text-slate-600 font-sans text-xs sm:text-sm font-medium">
              Our headquarters are located in Kicukiro District, Kabeza Village, Kigarama Cell.
            </p>
          </div>

          <div className="w-full h-96 bg-slate-50 border border-slate-200/50 rounded-2xl overflow-hidden shadow-lg relative">
            <iframe
              title="Smart Civil Engineering Works Office Map"
              src="https://www.google.com/maps?q=-1.9794705,30.0763459&z=17&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

    </div>
  );
};

export default Contact;
