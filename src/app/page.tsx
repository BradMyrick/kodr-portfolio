'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import CodeTabs from '@/components/code/CodeTabs';
import MetricCard from '@/components/metrics/MetricCard';
import EarlyAccessForm from '@/components/forms/EarlyAccessForm';
import { motion } from 'framer-motion';
import copyContent from '../../content/copy.json';

const LandingPage = () => {
  const [showVideoModal, setShowVideoModal] = useState(false);

  const codeTabs = [
    {
      language: 'rust',
      label: 'Rust',
      icon: '🦀',
      code: copyContent.code_examples.rust
    },
    {
      language: 'go',
      label: 'Go',
      icon: '🐹',
      code: copyContent.code_examples.go
    },
    {
      language: 'python',
      label: 'Python',
      icon: '🐍',
      code: copyContent.code_examples.python
    },
    {
      language: 'javascript',
      label: 'JavaScript',
      icon: '⚡',
      code: copyContent.code_examples.javascript
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white">
      {/* Navigation Bar */}
      <nav className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <span className="font-semibold text-white text-lg">
                kodr.pro
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#performance" className="text-gray-300 hover:text-white transition-colors">Performance</a>
              <a href="#demo" className="text-gray-300 hover:text-white transition-colors">Demo</a>
              <a href="/kodr.pdf" className="text-gray-300 hover:text-white transition-colors">Whitepaper</a>
            </div>

            <div className="flex items-center space-x-4">
              <a href={process.env.NEXT_PUBLIC_GITHUB_URL} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                  ⭐ Star on GitHub
                </Button>
              </a>
              <Button
                size="sm"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                onClick={() => document.getElementById('early-access')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Get Early Access
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative overflow-hidden py-20">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse animation-delay-2000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-cyan-900 to-blue-900 text-sm font-medium text-cyan-300 border border-cyan-800"
            >
              <span className="animate-pulse mr-2">🚀</span>
              {copyContent.hero.badge}
            </motion.div>

            {/* Main headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl font-extrabold tracking-tight"
            >
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {copyContent.hero.headline}
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl md:text-2xl font-semibold text-gray-300 max-w-4xl mx-auto"
            >
              {copyContent.hero.subheading}
            </motion.p>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-lg text-gray-400 max-w-3xl mx-auto"
            >
              {copyContent.hero.description}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10"
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-xl"
                onClick={() => document.getElementById('early-access')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Get Early Access
              </Button>
              <Link href="/kodr.pdf" target="_blank">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-cyan-600 text-cyan-400 hover:bg-cyan-900/50 px-8 py-4 text-lg font-semibold"
                >
                  Read Whitepaper
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Code Tabs Demo */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-20 max-w-5xl mx-auto"
          >
            <CodeTabs tabs={codeTabs} />
          </motion.div>
        </div>
      </header>

      {/* Problem/Solution Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Problem */}
            <div>
              <h2 className="text-3xl font-bold mb-6 text-white">{copyContent.problem.title}</h2>
              <p className="text-xl mb-8 text-cyan-400">{copyContent.problem.subtitle}</p>
              <div className="space-y-4">
                {copyContent.problem.points.map((point, i) => (
                  <div key={i} className="flex gap-4">
                    <span className="text-red-500 text-2xl">✗</span>
                    <div>
                      <h3 className="font-semibold text-white mb-1">{point.title}</h3>
                      <p className="text-gray-400 text-sm">{point.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Solution */}
            <div>
              <h2 className="text-3xl font-bold mb-6 text-white">{copyContent.solution.title}</h2>
              <p className="text-xl mb-8 text-cyan-400">{copyContent.solution.subtitle}</p>
              <div className="space-y-4">
                {copyContent.solution.points.map((point, i) => (
                  <div key={i} className="flex gap-4">
                    <span className="text-green-500 text-2xl">✓</span>
                    <div>
                      <h3 className="font-semibold text-white mb-1">{point.title}</h3>
                      <p className="text-gray-400 text-sm">{point.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-950 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              Core Platform Features
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Everything you need to build, deploy, and scale polyglot applications
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {copyContent.features.map((feature, i) => (
              <Card key={i} className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-800 bg-gray-900">
                <Card.Content className="p-6">
                  <div className="text-4xl mb-4">
                    {feature.icon}
                  </div>
                  <Card.Title className="mb-3 text-lg font-bold text-white">{feature.title}</Card.Title>
                  <Card.Description className="text-sm leading-relaxed text-gray-400 mb-3">
                    {feature.description}
                  </Card.Description>
                  <div className="text-cyan-400 text-sm font-semibold">
                    {feature.metrics}
                  </div>
                </Card.Content>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Performance Metrics Section */}
      <section id="performance" className="bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              {copyContent.performance.title}
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              {copyContent.performance.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {copyContent.performance.metrics.map((metric, i) => (
              <MetricCard
                key={i}
                label={metric.label}
                value={metric.value}
                comparison={metric.comparison}
                color={['blue', 'green', 'purple', 'orange'][i] as 'blue' | 'green' | 'purple' | 'orange'}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Technical Credibility Section */}
      <section className="bg-gray-950 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              {copyContent.technical.title}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {copyContent.technical.points.map((point, i) => (
              <Card key={i} className="text-center border border-gray-800 bg-gray-900">
                <Card.Content className="p-8">
                  <div className="text-4xl mb-4">{point.icon}</div>
                  <Card.Title className="mb-3 text-xl font-bold text-white">{point.title}</Card.Title>
                  <Card.Description className="text-gray-400">
                    {point.description}
                  </Card.Description>
                </Card.Content>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Target Markets Section */}
      <section className="bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              {copyContent.markets.title}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {copyContent.markets.segments.map((segment, i) => (
              <div key={i} className="bg-gray-950 rounded-xl p-8 border border-gray-800 hover:border-cyan-600 transition-all">
                <div className="text-4xl mb-4">{segment.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{segment.title}</h3>
                <p className="text-gray-400">{segment.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Kodr.pro Section */}
      <section className="bg-gray-950 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              {copyContent.differentiators.title}
            </h2>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {copyContent.differentiators.points.map((point, i) => (
                <div key={i} className="flex items-start gap-4">
                  <span className="text-cyan-400 text-2xl mt-1">✓</span>
                  <p className="text-lg text-gray-300">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Early Access Section */}
      <section id="early-access" className="bg-gradient-to-br from-gray-900 via-cyan-950 to-gray-900 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              {copyContent.cta.title}
            </h2>
            <p className="text-xl text-cyan-300 mb-2">
              {copyContent.cta.subtitle}
            </p>
            <p className="text-gray-400">
              Be among the first to experience the future of polyglot development.
            </p>
          </div>

          <div className="bg-gray-950/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800">
            <EarlyAccessForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-300 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">K</span>
                </div>
                <span className="font-semibold text-white text-lg">
                  Kodr.pro
                </span>
              </div>
              <p className="text-gray-400">
                {copyContent.footer.tagline}
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tutorials</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 Kodr.pro. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
