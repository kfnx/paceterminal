'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  RiCloseLine,
  RiDeleteBin6Line,
  RiFullscreenExitLine,
  RiFullscreenLine,
  RiSendPlane2Line,
} from '@remixicon/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
  const [isMaximized, setIsMaximized] = useState(false);
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
      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_URL + '/chat',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: newMessages,
          }),
        },
      );

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
    if (!isOpen) {
      setIsMaximized(false);
    }
  };

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
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
    <div
      className={cn(
        'fixed bottom-4 right-4 z-50 flex flex-col items-end',
        className,
      )}
    >
      {/* Chat Window */}
      {isOpen && (
        <div
          className={cn(
            'shadow-2xl flex flex-col overflow-hidden border border-stroke-soft-200 bg-bg-white-0 duration-300 animate-in fade-in zoom-in-95 slide-in-from-bottom-4',
            isMaximized
              ? 'fixed inset-0 h-auto w-auto'
              : 'mb-4 h-[500px] w-[380px] rounded-2xl',
          )}
        >
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
                onClick={toggleMaximize}
                className='text-text-sub-600 hover:bg-bg-weak-50 hover:text-text-strong-950'
                title={isMaximized ? 'Exit fullscreen' : 'Maximize'}
              >
                <Button.Icon
                  as={isMaximized ? RiFullscreenExitLine : RiFullscreenLine}
                />
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
                      'prose prose-sm max-w-none rounded-2xl px-3 py-2 text-paragraph-sm',
                      isMaximized
                        ? 'min-w-[280px] max-w-[50%]'
                        : 'max-w-[280px]',
                      message.role === 'user'
                        ? 'prose-invert prose-p:text-static-white prose-li:text-static-white prose-headings:text-static-white prose-strong:text-static-white prose-code:text-static-white bg-primary-base text-static-white'
                        : 'prose-p:text-text-strong-950 prose-li:text-text-strong-950 prose-headings:text-text-strong-950 prose-strong:text-text-strong-950 prose-code:bg-bg-white-0 prose-code:text-text-strong-950 prose-code:px-1 prose-code:py-0.5 prose-code:rounded bg-bg-weak-50 text-text-strong-950',
                    )}
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ children }) => (
                          <p className='mb-2 last:mb-0'>{children}</p>
                        ),
                        ul: ({ children }) => (
                          <ul className='mb-2 ml-4 list-disc last:mb-0'>
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol className='mb-2 ml-4 list-decimal last:mb-0'>
                            {children}
                          </ol>
                        ),
                        li: ({ children }) => (
                          <li className='mb-1'>{children}</li>
                        ),
                        code: ({ inline, children, ...props }: any) =>
                          inline ? (
                            <code {...props}>{children}</code>
                          ) : (
                            <code
                              className='block whitespace-pre-wrap'
                              {...props}
                            >
                              {children}
                            </code>
                          ),
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
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
        className='shadow-2xl hover:scale-120 group h-16 w-16 cursor-pointer rounded-full border border-stroke-soft-200 bg-bg-white-0 transition-all duration-200 hover:bg-bg-weak-50'
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
