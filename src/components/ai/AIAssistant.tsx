'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '@/stores/useAppStore';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Avatar from '@/components/ui/Avatar';
import { cn, generateId } from '@/utils';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
}

interface AIAssistantProps {
  className?: string;
  compact?: boolean;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ 
  className, 
  compact = false 
}) => {
  const user = useUser();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: generateId(),
      content: "Hi! I'm your AI assistant. I can help you with brainstorming ideas, code suggestions, documentation, and project planning. What would you like to work on today?",
      isUser: false,
      timestamp: new Date().toISOString(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mock AI responses based on keywords
  const generateMockResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('idea') || message.includes('brainstorm')) {
      return "Great! Here are some creative ideas to consider:\n\n• **User Experience Enhancement**: Focus on intuitive design patterns and accessibility\n• **AI Integration**: Consider adding smart automation features\n• **Community Features**: Build social elements to increase engagement\n• **Performance Optimization**: Implement caching and lazy loading strategies\n\nWhich of these resonates with your project goals?";
    }
    
    if (message.includes('code') || message.includes('programming')) {
      return "I'd be happy to help with coding! Here are some suggestions:\n\n• **Clean Architecture**: Use modular design patterns for maintainability\n• **Testing Strategy**: Implement unit tests with Jest and integration tests\n• **Error Handling**: Add comprehensive error boundaries and logging\n• **Documentation**: Write clear JSDoc comments and README files\n\nWhat specific coding challenge are you facing?";
    }
    
    if (message.includes('plan') || message.includes('strategy')) {
      return "Let's create a solid project plan:\n\n• **Phase 1**: Define requirements and user stories\n• **Phase 2**: Create wireframes and technical specifications\n• **Phase 3**: Develop MVP with core features\n• **Phase 4**: Test, iterate, and gather feedback\n• **Phase 5**: Launch and monitor performance\n\nWould you like me to elaborate on any of these phases?";
    }
    
    if (message.includes('help') || message.includes('stuck')) {
      return "I'm here to help! Here are some ways I can assist:\n\n• **Problem Solving**: Break down complex issues into manageable steps\n• **Research**: Provide insights on best practices and trends\n• **Code Review**: Suggest improvements and optimizations\n• **Documentation**: Help create clear and comprehensive docs\n\nWhat specific challenge would you like to tackle together?";
    }
    
    if (message.includes('design') || message.includes('ui') || message.includes('ux')) {
      return "Design is crucial for user engagement! Consider these principles:\n\n• **Consistency**: Use a cohesive design system and style guide\n• **Accessibility**: Ensure WCAG compliance for inclusive design\n• **User Journey**: Map out clear paths for user interactions\n• **Visual Hierarchy**: Guide attention with typography and spacing\n• **Mobile First**: Design for mobile devices then scale up\n\nWhat aspect of design would you like to explore further?";
    }
    
    // Default response
    return "That's an interesting point! I can help you explore this further. Here are some questions to consider:\n\n• What specific outcomes are you hoping to achieve?\n• Are there any constraints or requirements to keep in mind?\n• How does this align with your overall project goals?\n\nFeel free to share more details, and I'll provide more targeted suggestions!";
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: generateId(),
      content: inputValue.trim(),
      isUser: true,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI processing time
    setTimeout(() => {
      const aiResponse: Message = {
        id: generateId(),
        content: generateMockResponse(userMessage.content),
        isUser: false,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500 + Math.random() * 1000); // 1.5-2.5 second delay
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { label: 'Brainstorm Ideas', prompt: 'Help me brainstorm innovative ideas for my project' },
    { label: 'Code Review', prompt: 'Can you help me review my code and suggest improvements?' },
    { label: 'Plan Strategy', prompt: 'I need help creating a project plan and strategy' },
    { label: 'Design Feedback', prompt: 'Can you provide feedback on my UI/UX design?' }
  ];

  const handleQuickAction = (prompt: string) => {
    setInputValue(prompt);
  };

  return (
    <Card className={cn('flex flex-col', compact ? 'h-96' : 'h-[600px]', className)}>
      <Card.Header className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <Card.Title className="text-lg">AI Assistant</Card.Title>
            <Card.Description>Your intelligent collaboration partner</Card.Description>
          </div>
          <div className="ml-auto">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-500 dark:text-gray-400">Online</span>
            </div>
          </div>
        </div>
      </Card.Header>

      <Card.Content className="flex-1 flex flex-col p-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex items-start space-x-3',
                message.isUser ? 'flex-row-reverse space-x-reverse' : ''
              )}
            >
              {!message.isUser && (
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
              )}
              
              {message.isUser && user && (
                <Avatar
                  src={user.avatar}
                  name={user.name}
                  size="sm"
                />
              )}

              <div
                className={cn(
                  'max-w-xs lg:max-w-md px-4 py-2 rounded-lg',
                  message.isUser
                    ? 'bg-blue-600 text-white ml-auto'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                )}
              >
                <div className="whitespace-pre-wrap text-sm">
                  {message.content}
                </div>
                <div className={cn(
                  'text-xs mt-1',
                  message.isUser ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                )}>
                  {new Date(message.timestamp).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        {messages.length <= 1 && (
          <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Quick actions:</p>
            <div className="flex flex-wrap gap-1">
              {quickActions.map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAction(action.prompt)}
                  className="text-xs"
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your project..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="px-3"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </Button>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};

export default AIAssistant;
