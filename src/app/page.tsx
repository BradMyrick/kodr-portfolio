'use client';

import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Avatar from '@/components/ui/Avatar';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-purple-50 via-blue-50 to-white dark:from-gray-900 dark:via-purple-900 dark:to-black">
      {/* Navigation Bar */}
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white text-lg">
                Kodr.pro
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  Early Access
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 text-sm font-medium text-purple-800 dark:text-purple-200">
              <span className="animate-pulse mr-2">🔥</span>
              Join 100+ builders and counting
            </div>
            
            {/* Main headline */}
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
                Smart Contract-Powered
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">
                Collaboration for All Builders
              </span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl md:text-2xl font-semibold text-gray-700 dark:text-gray-300 max-w-4xl mx-auto">
              Automate trust. Collaborate globally. Get paid, instantly.
            </p>
            
            {/* Description */}
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Whether you're building tech, art, finance, literature, or anything in between—Kodr.pro connects creators with smart contracts that handle trust, payments, and licensing automatically.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10">
              <Link href="/auth/register">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-xl">
                  Start Building Now
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900 px-8 py-4 text-lg font-semibold">
                Watch Demo
              </Button>
            </div>
            
            {/* Demo visualization */}
            <div className="mt-16 max-w-4xl mx-auto">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🤝</span>
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-white">Collaborate</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Real-time editing</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">📋</span>
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-white">Auto-Contract</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Smart agreements</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">💰</span>
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-white">Get Paid</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Instant payouts</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="bg-white dark:bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl leading-9 font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Revolutionary Features That Change Everything
          </h2>
          <p className="mt-4 text-center text-xl text-gray-600 dark:text-gray-300">
            Stop dealing with lawyers, payment delays, and trust issues. Start building with confidence.
          </p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Automated Smart Contracts",
                description: "Instantly create, sign, and enforce agreements for every project. Transparent payments, universal licensing—no lawyers needed.",
                icon: "⚡",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                title: "AI-Powered Ideation",
                description: "Unlock new ideas and automate documentation with our built-in AI sidekick that understands your creative process.",
                icon: "🧠",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                title: "Real-time Collaboration",
                description: "Co-create, edit, and whiteboard with your team, anywhere in the world. Changes sync instantly across all devices.",
                icon: "🌍",
                gradient: "from-green-500 to-teal-500"
              },
              {
                title: "Project Management",
                description: "From Kanban to payouts, every workflow is automated and secure. Track progress and get paid automatically.",
                icon: "📊",
                gradient: "from-orange-500 to-red-500"
              }
            ].map((feature, i) => (
              <Card key={i} className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                <Card.Content className="p-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl shadow-lg`}>
                    {feature.icon}
                  </div>
                  <Card.Title className="mb-3 text-lg font-bold">{feature.title}</Card.Title>
                  <Card.Description className="text-sm leading-relaxed">
                    {feature.description}
                  </Card.Description>
                </Card.Content>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Builder Types Section */}
      <section className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
              Built for Every Type of Builder
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Whether you code, design, write, operate, or lead—Kodr.pro amplifies your impact with smart contracts and global collaboration.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
            {[
              { type: "Developers", icon: "💻", color: "bg-blue-500" },
              { type: "Designers", icon: "🎨", color: "bg-purple-500" },
              { type: "Writers", icon: "✍️", color: "bg-green-500" },
              { type: "Operators", icon: "⚙️", color: "bg-orange-500" },
              { type: "Executives", icon: "👔", color: "bg-red-500" },
              { type: "Artists", icon: "🎭", color: "bg-pink-500" },
              { type: "Anyone", icon: "🚀", color: "bg-indigo-500" }
            ].map((builder, i) => (
              <div key={i} className="text-center group hover:scale-105 transition-transform">
                <div className={`w-20 h-20 ${builder.color} rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl shadow-lg group-hover:shadow-xl transition-shadow`}>
                  {builder.icon}
                </div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">{builder.type}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Investor/Contributor Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              🚀 Investor or Want to Help Shape Kodr.pro?
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Join our mission to revolutionize collaboration. Reach out for early access and partnership opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="https://twitter.com/messages/compose?recipient_id=kodr_eth" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-4">
                  Partner With Us
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 font-semibold px-8 py-4">
                Request Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Early Adopters Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
              Early Builders Are Already Revolutionizing Work
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              From smart contract automation to instant global payments—see what builders are saying.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Alex Rivera",
                role: "Blockchain Developer",
                company: "DeFi Startup",
                testimonial: "Smart contracts used to take weeks to draft and deploy. Now I can create, test, and go live in minutes. Game-changing for our development cycle.",
                highlight: "⚡ 10x faster deployment"
              },
              {
                name: "Maya Patel",
                role: "Creative Director",
                company: "Design Collective",
                testimonial: "Finally, a platform where I can collaborate with developers AND get paid automatically when milestones hit. No more chasing invoices!",
                highlight: "💰 Instant payments"
              },
              {
                name: "James Kim",
                role: "Technical Writer",
                company: "Independent",
                testimonial: "I write documentation for 5 different projects now. Smart contracts handle all the licensing and royalties automatically. Pure magic.",
                highlight: "📚 Automated licensing"
              }
            ].map((testimonial, i) => (
              <Card key={i} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-white dark:bg-gray-700">
                <Card.Content className="p-6">
                  <div className="mb-4">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 text-sm font-medium text-purple-800 dark:text-purple-200 mb-4">
                      {testimonial.highlight}
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 italic mb-6 text-lg">
                    &quot;{testimonial.testimonial}&quot;
                  </p>
                  <div className="flex items-center">
                    <Avatar
                      name={testimonial.name}
                      size="md"
                      className="mr-3"
                    />
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            ))}
          </div>
          
          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "100+", label: "Early Builders" },
              { number: "$2M+", label: "Automated Payments" },
              { number: "50+", label: "Countries" },
              { number: "0", label: "Legal Disputes" }
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400">{stat.number}</div>
                <div className="text-gray-600 dark:text-gray-400 mt-2">{stat.label}</div>
              </div>
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
            Join thousands of teams already using Kodr.pro to sync, build, and succeed together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
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
                  <span className="text-white font-bold text-sm">K</span>
                </div>
                <span className="font-semibold text-white text-lg">
                  Kodr.pro
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
              © 2025 Kodr.pro. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
