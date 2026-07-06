import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Send,
  Github,
  Twitter,
  Instagram,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { GlassCard, GlassButton } from '../components/ui/GlassCard';

const ContactPage: React.FC = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate sending
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setStatus('success');
    setIsSubmitting(false);
    setForm({ name: '', email: '', message: '' });
  };

  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
  ];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary-sky to-primary-lavender flex items-center justify-center shadow-lg"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Mail className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="heading-lg text-dark dark:text-white mb-4">Get in Touch</h1>
          <p className="body-md max-w-2xl mx-auto">
            Have questions, suggestions, or just want to say hello? We'd love to hear from you.
          </p>
        </motion.div>

        {/* Contact form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard>
            {status === 'success' ? (
              <motion.div
                className="text-center py-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring' }}
                >
                  <CheckCircle className="w-16 h-16 text-primary-mint mx-auto mb-4" />
                </motion.div>
                <h3 className="font-poppins font-semibold text-dark dark:text-white mb-2">
                  Message Sent!
                </h3>
                <p className="text-secondary dark:text-slate-400 mb-6">
                  Thank you for reaching out. We'll get back to you soon.
                </p>
                <GlassButton variant="primary" onClick={() => setStatus('idle')}>
                  Send Another Message
                </GlassButton>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="input-glass"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    className="input-glass"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                    Message
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                    rows={5}
                    className="input-glass resize-none"
                    placeholder="Your message..."
                  />
                </div>

                {status === 'error' && (
                  <motion.div
                    className="flex items-center gap-2 text-red-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <AlertCircle className="w-5 h-5" />
                    Something went wrong. Please try again.
                  </motion.div>
                )}

                <GlassButton
                  variant="primary"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                      </motion.div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </GlassButton>
              </form>
            )}
          </GlassCard>
        </motion.div>

        {/* Social links */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="font-poppins font-semibold text-dark dark:text-white mb-4">
            Connect with us
          </h3>
          <div className="flex justify-center gap-4">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                className="w-12 h-12 rounded-xl glass flex items-center justify-center text-secondary dark:text-slate-400 hover:text-primary-sky dark:hover:text-primary-sky transition-colors"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                aria-label={label}
              >
                <Icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;
