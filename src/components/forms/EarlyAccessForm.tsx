'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { motion } from 'framer-motion';

interface EarlyAccessFormProps {
  className?: string;
}

const EarlyAccessForm: React.FC<EarlyAccessFormProps> = ({ className = '' }) => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    company: '',
    role: '',
    languages: [] as string[],
    useCase: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const languages = [
    { value: 'rust', label: '🦀 Rust' },
    { value: 'go', label: '🐹 Go' },
    { value: 'python', label: '🐍 Python' },
    { value: 'javascript', label: '⚡ JavaScript' },
    { value: 'typescript', label: '💙 TypeScript' },
    { value: 'other', label: '➕ Other' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Convert early access form data to contact format
      const message = `
Early Access Request

Company: ${formData.company || 'Not specified'}
Role: ${formData.role || 'Not specified'}
Languages: ${formData.languages.length > 0 ? formData.languages.join(', ') : 'Not specified'}

Use Case:
${formData.useCase || 'Not specified'}
      `.trim();

      const contactData = {
        name: formData.name,
        email: formData.email,
        subject: 'Early Access Request',
        message: message
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit');
      }

      setSuccess(true);
      setFormData({
        email: '',
        name: '',
        company: '',
        role: '',
        languages: [],
        useCase: ''
      });

      // Track conversion event
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'conversion', {
          'send_to': 'early_access_signup',
          'value': 1.0,
          'currency': 'USD'
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong. Please try again or email us directly at contact@kodr.pro';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleLanguage = (lang: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter(l => l !== lang)
        : [...prev.languages, lang]
    }));
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-700 rounded-xl p-8 text-center ${className}`}
      >
        <div className="text-4xl mb-4">🎉</div>
        <h3 className="text-2xl font-bold text-white mb-2">You're on the list!</h3>
        <p className="text-gray-300 mb-4">
          Thank you for your interest in Kodr.pro! We've received your early access request and will reach out soon.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="text-cyan-400 hover:text-cyan-300 underline text-sm"
        >
          Submit another request
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Name *
          </label>
          <Input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="John Doe"
            className="w-full bg-gray-900 border-gray-700 text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email *
          </label>
          <Input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="john@company.com"
            className="w-full bg-gray-900 border-gray-700 text-white"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Company
          </label>
          <Input
            type="text"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder="Acme Corp"
            className="w-full bg-gray-900 border-gray-700 text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Role
          </label>
          <Input
            type="text"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            placeholder="Engineering Lead"
            className="w-full bg-gray-900 border-gray-700 text-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Languages you work with
        </label>
        <div className="flex flex-wrap gap-2">
          {languages.map((lang) => (
            <button
              key={lang.value}
              type="button"
              onClick={() => toggleLanguage(lang.value)}
              className={`px-4 py-2 rounded-lg border transition-all ${formData.languages.includes(lang.value)
                  ? 'bg-cyan-600 border-cyan-500 text-white'
                  : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-600'
                }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          What would you build with Kodr.pro?
        </label>
        <textarea
          value={formData.useCase}
          onChange={(e) => setFormData({ ...formData, useCase: e.target.value })}
          placeholder="Tell us about your use case..."
          rows={3}
          className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
        />
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-700 text-red-400 px-4 py-2 rounded-lg">
          {error}
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={loading}
        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Get Early Access'}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        We respect your privacy. No spam, ever. By submitting, you agree to receive updates about Kodr.pro.
      </p>
    </form>
  );
};

export default EarlyAccessForm;
