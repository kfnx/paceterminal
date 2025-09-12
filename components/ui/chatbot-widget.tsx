'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  RiCloseLine,
  RiDeleteBin6Line,
  RiMessage3Line,
  RiRobot2Line,
  RiSendPlane2Line,
} from '@remixicon/react';

import { cn } from '@/utils/cn';
import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

type ChatbotWidgetProps = {
  className?: string;
};

export function ChatbotWidget({ className }: ChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        "Hi! I'm PACETERMINAL AI. Ask me anything about crypto, memecoins, or our platform!",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('paceterminal-chat-messages');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        if (parsed.length > 0) {
          setMessages(parsed);
        }
      } catch (error) {
        console.error('Failed to load chat history:', error);
      }
    }
  }, []);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(
        'paceterminal-chat-messages',
        JSON.stringify(messages),
      );
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
      };

      setMessages((prev) => [...prev, assistantMessage]);

      const decoder = new TextDecoder();
      let accumulatedContent = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });

          // AI SDK streams plain text, not JSON
          accumulatedContent += chunk;
          setMessages((prev) => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            if (lastMessage.role === 'assistant') {
              lastMessage.content = accumulatedContent;
            }
            return newMessages;
          });
        }
      } catch (streamError) {
        console.error('Stream reading error:', streamError);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const clearChatHistory = () => {
    const welcomeMessage = {
      id: '1',
      role: 'assistant' as const,
      content:
        "Hi! I'm PACETERMINAL AI. Ask me anything about crypto, memecoins, or our platform!",
    };
    setMessages([welcomeMessage]);
    localStorage.setItem(
      'paceterminal-chat-messages',
      JSON.stringify([welcomeMessage]),
    );
  };

  return (
    <div className={cn('fixed bottom-4 right-4 z-50', className)}>
      {/* Chat Window */}
      {isOpen && (
        <div className='shadow-2xl mb-4 flex h-[500px] w-[380px] flex-col overflow-hidden rounded-2xl border border-stroke-soft-200 bg-bg-white-0'>
          {/* Header */}
          <div className='flex items-center justify-between border-b border-stroke-soft-200 bg-bg-white-0 px-4 py-3'>
            <div className='flex items-center gap-2'>
              <div className='from-amber-400 relative flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br to-orange-500'>
                <Image
                  src='/images/semar.png'
                  alt='Semar AI'
                  width={20}
                  height={20}
                  className='h-5 w-5 object-contain drop-shadow-sm'
                />
              </div>
              <span className='text-label-sm font-medium text-text-strong-950'>
                PACETERMINAL AI
              </span>
            </div>
            <div className='flex items-center gap-1'>
              <Button.Root
                variant='neutral'
                mode='ghost'
                size='xxsmall'
                onClick={clearChatHistory}
                className='text-text-sub-600 hover:bg-bg-weak-50 hover:text-text-strong-950'
                title='Clear chat history'
              >
                <Button.Icon as={RiDeleteBin6Line} />
              </Button.Root>
              <Button.Root
                variant='neutral'
                mode='ghost'
                size='xxsmall'
                onClick={toggleChat}
                className='text-text-sub-600 hover:bg-bg-weak-50 hover:text-text-strong-950'
              >
                <Button.Icon as={RiCloseLine} />
              </Button.Root>
            </div>
          </div>

          {/* Messages */}
          <div className='flex-1 overflow-y-auto bg-bg-white-0 p-4'>
            <div className='space-y-3'>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex',
                    message.role === 'user' ? 'justify-end' : 'justify-start',
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[280px] rounded-2xl px-3 py-2 text-paragraph-sm',
                      message.role === 'user'
                        ? 'bg-primary-base text-static-white'
                        : 'bg-bg-weak-50 text-text-strong-950',
                    )}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className='flex justify-start'>
                  <div className='max-w-[280px] rounded-2xl bg-bg-weak-50 px-3 py-2'>
                    <div className='flex items-center gap-2'>
                      <div className='flex space-x-1'>
                        <div className='h-2 w-2 animate-bounce rounded-full bg-text-sub-600 [animation-delay:-0.3s]' />
                        <div className='h-2 w-2 animate-bounce rounded-full bg-text-sub-600 [animation-delay:-0.15s]' />
                        <div className='h-2 w-2 animate-bounce rounded-full bg-text-sub-600' />
                      </div>
                      <span className='text-paragraph-sm text-text-sub-600'>
                        Thinking...
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <div className='border-t border-stroke-soft-200 bg-bg-white-0 p-4'>
            <form onSubmit={handleSubmit}>
              <Input.Root size='small'>
                <Input.Wrapper>
                  <Input.Input
                    ref={inputRef}
                    placeholder='Ask about crypto, memecoins, or PACETERMINAL...'
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    disabled={isLoading}
                    className='bg-bg-white-0 text-text-strong-950 placeholder:text-text-sub-600'
                  />
                  <Button.Root
                    variant='primary'
                    mode='ghost'
                    size='xxsmall'
                    type='submit'
                    disabled={!input.trim() || isLoading}
                    className='text-primary-base hover:bg-primary-alpha-10 disabled:text-text-disabled-300'
                  >
                    <Button.Icon as={RiSendPlane2Line} />
                  </Button.Root>
                </Input.Wrapper>
              </Input.Root>
            </form>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <div
        onClick={toggleChat}
        className='shadow-2xl group h-16 w-16 cursor-pointer rounded-full border border-stroke-soft-200 bg-bg-white-0 transition-all duration-200 hover:scale-105 hover:bg-bg-weak-50'
      >
        <div className='flex h-full w-full items-center justify-center'>
          {isOpen ? (
            <RiCloseLine className='h-6 w-6 text-text-strong-950 transition-colors' />
          ) : (
            <div className='from-amber-400 dark:from-amber-600 relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br to-orange-500 transition-all group-hover:scale-110 dark:to-orange-700'>
              <Image
                src='/images/semar.png'
                alt='Semar AI'
                width={48}
                height={48}
                className='h-12 w-12 object-contain drop-shadow-sm'
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
