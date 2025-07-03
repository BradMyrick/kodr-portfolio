'use client';

import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useAppStore } from '@/stores/useAppStore';
import { generateId } from '@/utils';

export default function ResourcesPage() {
  const { addNotification } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleComingSoon = (feature: string) => {
    addNotification({
      id: generateId(),
      type: 'info',
      title: 'Feature Coming Soon',
      message: `${feature} will be available in the next release!`,
      read: false,
      userId: 'temp',
      createdAt: new Date().toISOString(),
    });
  };

  const categories = [
    { id: 'all', name: 'All Resources', count: 24 },
    { id: 'templates', name: 'Templates', count: 8 },
    { id: 'docs', name: 'Documentation', count: 6 },
    { id: 'assets', name: 'Design Assets', count: 10 },
  ];

  const resources = [
    {
      title: 'Smart Contract Templates',
      description: 'Pre-built contract templates for common collaboration scenarios',
      category: 'templates',
      icon: '📋',
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'API Documentation',
      description: 'Complete guide to integrating with Kodr.pro APIs',
      category: 'docs',
      icon: '📚',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Design System',
      description: 'UI components and design guidelines for your projects',
      category: 'assets',
      icon: '🎨',
      color: 'from-green-500 to-teal-500'
    },
    {
      title: 'Project Templates',
      description: 'Kickstart your projects with proven templates',
      category: 'templates',
      icon: '🚀',
      color: 'from-orange-500 to-red-500'
    },
    {
      title: 'Code Examples',
      description: 'Sample code and integration examples',
      category: 'docs',
      icon: '💻',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      title: 'Brand Assets',
      description: 'Logos, icons, and brand guidelines',
      category: 'assets',
      icon: '🎯',
      color: 'from-pink-500 to-rose-500'
    },
  ];

  const filteredResources = selectedCategory === 'all' 
    ? resources 
    : resources.filter(r => r.category === selectedCategory);

  return (
    <Layout requireAuth showSidebar>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Resources
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Templates, documentation, and assets to accelerate your projects
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-2"
            >
              {category.name}
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                {category.count}
              </span>
            </Button>
          ))}
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource, i) => (
            <Card 
              key={i} 
              className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900"
              onClick={() => handleComingSoon(resource.title)}
            >
              <Card.Content className="p-6">
                <div className={`w-16 h-16 bg-gradient-to-br ${resource.color} rounded-2xl flex items-center justify-center mb-4 text-2xl shadow-lg`}>
                  {resource.icon}
                </div>
                <Card.Title className="mb-3 text-lg font-bold">
                  {resource.title}
                </Card.Title>
                <Card.Description className="text-sm leading-relaxed mb-4">
                  {resource.description}
                </Card.Description>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 capitalize">
                    {resource.category}
                  </span>
                  <Button size="sm" variant="ghost">
                    View →
                  </Button>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>

        {/* Coming Soon Banner */}
        <div className="mt-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            🚀 More Resources Coming Soon
          </h3>
          <p className="text-purple-100 mb-6">
            We're building an extensive library of templates, tools, and resources to help you build faster.
          </p>
          <Button 
            className="bg-white text-purple-600 hover:bg-gray-100"
            onClick={() => handleComingSoon('Resource Requests')}
          >
            Request a Resource
          </Button>
        </div>
      </div>
    </Layout>
  );
}
