'use client';

import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Avatar from '@/components/ui/Avatar';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-black">
      {/* Navigation Bar */}
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white text-lg">
                Concordia.io
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative overflow-hidden flex-1">
        <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
          <div className="w-full md:w-1/2 space-y-6">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              Sync. Build. Succeed.
            </h1>
            <p className="mt-3 text-lg text-gray-600 dark:text-gray-300 sm:mt-5">
              Welcome to Concordia.io, a next-generation innovation hub enabling real-time, AI-powered collaboration for distributed teams.
              The future of building, together.
            </p>
            <div className="mt-6 space-y-2">
              <Input
                type="email"
                placeholder="Enter your email to get started"
                className="w-full"
              />
              <Link href="/auth/login">
                <Button className="w-full">
                  Get Started - It\u0026apos;s Free
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-8 md:mt-0 md:w-1/2 flex justify-center">
            <div className="w-96 h-96 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center">
              <div className="text-white text-6xl font-bold">🚀</div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="bg-white dark:bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl leading-9 font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Powerful Features for Modern Teams
          </h2>
          <p className="mt-4 text-center text-xl text-gray-600 dark:text-gray-300">
            Everything you need to transform ideas into reality
          </p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "AI-Powered Ideation",
                description: "Generate, expand, and refine ideas with our intelligent AI assistant that understands your goals.",
                icon: "🧠"
              },
              {
                title: "Real-time Collaboration",
                description: "Work together seamlessly with live editing, instant messaging, and shared whiteboards.",
                icon: "🤝"
              },
              {
                title: "Project Management",
                description: "Track progress with Kanban boards, deadlines, and automated workflows.",
                icon: "📊"
              }
            ].map((feature, i) => (
              <Card key={i} className="text-center hover:shadow-lg transition-shadow">
                <Card.Content className="p-8">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <Card.Title className="mb-4">{feature.title}</Card.Title>
                  <Card.Description className="text-base">
                    {feature.description}
                  </Card.Description>
                </Card.Content>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Loved by Teams Worldwide
          </h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                role: "Product Manager",
                company: "TechCorp",
                testimonial: "Innovation Hub transformed how our team brainstorms and executes ideas. The AI suggestions are incredibly helpful."
              },
              {
                name: "Marcus Johnson",
                role: "Engineering Lead",
                company: "StartupXYZ",
                testimonial: "The real-time collaboration features are game-changing. We can iterate on ideas faster than ever before."
              },
              {
                name: "Elena Rodriguez",
                role: "Design Director",
                company: "Creative Agency",
                testimonial: "The whiteboarding and ideation tools help us visualize concepts and align our team's creative vision."
              }
            ].map((testimonial, i) => (
              <Card key={i}>
                <Card.Content className="p-6">
                  <div className="flex items-center mb-4">
                    <Avatar
                      name={testimonial.name}
                      size="lg"
                    />
                    <div className="ml-4">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {testimonial.role} at {testimonial.company}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 italic">
                    &quot;{testimonial.testimonial}&quot;
                  </p>
                </Card.Content>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 dark:bg-blue-700 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Innovate Together?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of teams already using Concordia.io to sync, build, and succeed together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/login">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Start Free Trial
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-blue-600">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
                <span className="font-semibold text-white text-lg">
                  Concordia.io
                </span>
              </div>
              <p className="text-gray-400">
                Next-generation innovation hub enabling real-time, AI-powered collaboration for distributed teams.
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
              © 2025 Concordia.io. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
