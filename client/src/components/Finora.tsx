import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, ArrowLeft, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getState } from "@/store";

interface Message {
  id: string;
  text: string;
  sender: "user" | "finora";
  timestamp: number;
}

const STORAGE_KEY = "finora_chat_history";
const STORAGE_VERSION_KEY = "finora_chat_version";
const CURRENT_VERSION = "2"; // Incremented to clear emoji-containing messages

const SUGGESTED_PROMPTS = [
  "How much did I spend on food this month?",
  "Which category exceeded my budget?",
  "What's my total spending this month?",
];

export default function Finora() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  
  // Separate refs for mobile and desktop
  const mobileMessagesEndRef = useRef<HTMLDivElement>(null);
  const mobileMessagesContainerRef = useRef<HTMLDivElement>(null);
  const desktopMessagesEndRef = useRef<HTMLDivElement>(null);
  const desktopMessagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load chat history from localStorage
  useEffect(() => {
    try {
      const storedVersion = localStorage.getItem(STORAGE_VERSION_KEY);
      const stored = localStorage.getItem(STORAGE_KEY);
      
      // Clear old data if version doesn't match
      if (storedVersion !== CURRENT_VERSION) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION);
      }
      
      if (stored && storedVersion === CURRENT_VERSION) {
        setMessages(JSON.parse(stored));
      } else {
        // Welcome message
        setMessages([
          {
            id: "welcome",
            text: "Hi! I'm Finora, your financial assistant. Ask me anything about your spending, budget, or financial insights!",
            sender: "finora",
            timestamp: Date.now(),
          },
        ]);
      }
    } catch (error) {
      console.warn("Failed to load chat history:", error);
    }
  }, []);

  // Save chat history to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } catch (error) {
        console.error("Failed to save chat history:", error);
      }
    }
  }, [messages]);

  // Auto-scroll to bottom with improved reliability
  useEffect(() => {
    const scrollToEnd = () => {
      // Scroll mobile if it exists (mobile view active)
      if (mobileMessagesEndRef.current) {
        mobileMessagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }
      // Scroll desktop if it exists (desktop view active)
      if (desktopMessagesEndRef.current) {
        desktopMessagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    };
    
    // Double RAF ensures layout is complete
    requestAnimationFrame(() => {
      requestAnimationFrame(scrollToEnd);
    });
  }, [messages, isTyping]);

  // Detect scroll position to show/hide scroll-to-latest button
  const handleMobileScroll = () => {
    if (mobileMessagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = mobileMessagesContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    }
  };

  const handleDesktopScroll = () => {
    if (desktopMessagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = desktopMessagesContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    }
  };

  const scrollToBottom = () => {
    // Scroll mobile if active
    if (mobileMessagesEndRef.current) {
      mobileMessagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
    // Scroll desktop if active
    if (desktopMessagesEndRef.current) {
      desktopMessagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };

  // Lock/unlock page scroll when chat opens/closes
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('finora-lock-scroll');
    } else {
      document.body.classList.remove('finora-lock-scroll');
    }
    
    // Cleanup on unmount
    return () => {
      document.body.classList.remove('finora-lock-scroll');
    };
  }, [isOpen]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const processUserQuery = (query: string): string => {
    const state = getState();
    const { derived, transactions } = state;
    const lowerQuery = query.toLowerCase();

    // Total spending
    if (lowerQuery.includes("total") && lowerQuery.includes("spend")) {
      const total = derived.totalSpentThisMonth;
      const budget = derived.monthlyBudget;
      const percent = derived.spentPercent;
      return `So far, you've spent ₹${total.toLocaleString()} out of your ₹${budget.toLocaleString()} budget — about ${Math.round(percent)}% used. ${percent > 90 ? "Warning: You're close to your limit!" : percent > 70 ? "You're doing well, but watch your spending!" : "Great job managing your budget!"}`;
    }

    // Budget status
    if (lowerQuery.includes("budget") && (lowerQuery.includes("exceed") || lowerQuery.includes("over"))) {
      const categories = Array.from(derived.spendByCategory.entries())
        .sort((a, b) => b[1] - a[1]);
      
      if (derived.spentPercent >= 100) {
        return `Warning: You've exceeded your monthly budget! You've spent ₹${derived.totalSpentThisMonth.toLocaleString()} out of ₹${derived.monthlyBudget.toLocaleString()}. Your top spending categories are ${categories.slice(0, 2).map(c => c[0]).join(" and ")}.`;
      } else if (derived.spentPercent >= 90) {
        return `Warning: You're at ${Math.round(derived.spentPercent)}% of your budget. Watch your spending to avoid going over!`;
      } else {
        return `Good news! You haven't exceeded your budget yet. You've used ${Math.round(derived.spentPercent)}% so far.`;
      }
    }

    // Food spending
    if (lowerQuery.includes("food") || lowerQuery.includes("swiggy") || lowerQuery.includes("zomato")) {
      const foodSpend = derived.spendByCategory.get("Food") || 0;
      const foodTxs = transactions.filter(tx => tx.category === "Food");
      const topMerchants = foodTxs.reduce((acc, tx) => {
        acc[tx.merchant] = (acc[tx.merchant] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      const topMerchant = Object.entries(topMerchants).sort((a, b) => b[1] - a[1])[0];
      
      return `You've spent ₹${foodSpend.toLocaleString()} on Food this month${topMerchant ? `, mostly via ${topMerchant[0]}` : ""}.`;
    }

    // Shopping spending
    if (lowerQuery.includes("shopping") || lowerQuery.includes("amazon") || lowerQuery.includes("flipkart")) {
      const shoppingSpend = derived.spendByCategory.get("Shopping") || 0;
      return `You've spent ₹${shoppingSpend.toLocaleString()} on Shopping this month.`;
    }

    // Entertainment spending
    if (lowerQuery.includes("entertainment") || lowerQuery.includes("netflix") || lowerQuery.includes("movie")) {
      const entertainmentSpend = derived.spendByCategory.get("Entertainment") || 0;
      return `You've spent ₹${entertainmentSpend.toLocaleString()} on Entertainment this month.`;
    }

    // Travel spending
    if (lowerQuery.includes("travel") || lowerQuery.includes("uber") || lowerQuery.includes("ola")) {
      const travelSpend = derived.spendByCategory.get("Travel") || 0;
      return `You've spent ₹${travelSpend.toLocaleString()} on Travel this month.`;
    }

    // Category breakdown
    if (lowerQuery.includes("category") || lowerQuery.includes("categories") || lowerQuery.includes("breakdown")) {
      const categories = Array.from(derived.spendByCategory.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);
      
      const breakdown = categories.map(([cat, amount]) => `${cat}: ₹${amount.toLocaleString()}`).join(", ");
      return `Your top spending categories this month are: ${breakdown}.`;
    }

    // Recent transactions
    if (lowerQuery.includes("recent") || lowerQuery.includes("last")) {
      const recentTxs = transactions
        .sort((a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime())
        .slice(0, 3);
      
      const txList = recentTxs.map(tx => `₹${tx.amount} at ${tx.merchant}`).join(", ");
      return `Your most recent transactions: ${txList}.`;
    }

    // Remaining budget
    if (lowerQuery.includes("remain") || lowerQuery.includes("left")) {
      const remaining = derived.monthlyBudget - derived.totalSpentThisMonth;
      return `You have ₹${remaining.toLocaleString()} remaining in your budget this month${remaining < 0 ? " (Warning: You're over budget!)" : "."}.`;
    }

    // Savings
    if (lowerQuery.includes("save") || lowerQuery.includes("saving")) {
      const saved = derived.monthlyBudget - derived.totalSpentThisMonth;
      if (saved > 0) {
        return `Great! If you maintain your current spending, you'll save ₹${saved.toLocaleString()} this month.`;
      } else {
        return `You're currently over budget by ₹${Math.abs(saved).toLocaleString()}. Try cutting back on non-essential spending!`;
      }
    }

    // Default fallback
    return `I'm not sure about that, but I can help you with:
• Your total spending and budget
• Spending by category (Food, Shopping, Travel, etc.)
• Recent transactions
• Budget insights and savings tips

Try asking me something like "How much did I spend on food?" or "What's my budget status?"`;
  };

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: messageText,
      sender: "user",
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI thinking delay
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 800));

    // Generate AI response
    const responseText = processUserQuery(messageText);
    
    const finoraMessage: Message = {
      id: `finora-${Date.now()}`,
      text: responseText,
      sender: "finora",
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, finoraMessage]);
    setIsTyping(false);
  };

  const handleSuggestedPrompt = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Bubble - WhatsApp AI Style */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          data-testid="button-open-finora"
          aria-label="Open Finora chat assistant"
          title="Chat with Finora"
          className="fixed bottom-4 right-4 md:bottom-6 md:right-6 w-14 h-14 rounded-full cursor-pointer transition-all duration-300 hover:scale-105 z-[1200]"
          style={{
            background: 'linear-gradient(135deg, #007AFF, #9A6CFF)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.25), 0 0 20px rgba(154, 108, 255, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.25)';
          }}
        >
          <MessageCircle className="h-6 w-6 text-white mx-auto" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <>
          {/* Mobile: Full-screen modal */}
          <div className="md:hidden fixed inset-0 bg-background z-[1100] flex flex-col animate-in slide-in-from-bottom duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary/10 to-purple-600/10">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Finora</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                data-testid="button-close-finora-mobile"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Close chat</span>
              </Button>
            </div>

            {/* Messages */}
            <div 
              ref={mobileMessagesContainerRef}
              onScroll={handleMobileScroll}
              className="flex-1 overflow-y-auto p-4 space-y-4 pb-3 relative"
              style={{ scrollBehavior: 'smooth' }}
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-primary to-purple-600 text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={mobileMessagesEndRef} />
            </div>

            {/* Scroll to Latest Button - Mobile */}
            {showScrollButton && (
              <button
                onClick={scrollToBottom}
                className="absolute bottom-24 right-4 w-10 h-10 rounded-full bg-primary/90 hover:bg-primary shadow-lg flex items-center justify-center transition-all z-10 animate-in fade-in duration-200"
                aria-label="Scroll to latest message"
                data-testid="button-scroll-to-latest-mobile"
              >
                <ArrowDown className="h-5 w-5 text-primary-foreground" />
              </button>
            )}

            {/* Suggested Prompts (only show if no messages yet besides welcome) */}
            {messages.length <= 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-2">
                {SUGGESTED_PROMPTS.map((prompt, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => handleSuggestedPrompt(prompt)}
                    data-testid={`button-prompt-${idx}`}
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask Finora about your spending…"
                  className="flex-1"
                  data-testid="input-finora-message"
                />
                <Button
                  size="icon"
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim()}
                  data-testid="button-send-message"
                >
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send message</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Desktop: Floating window */}
          <Card className="hidden md:flex fixed bottom-6 right-6 w-[420px] max-h-[70vh] shadow-2xl z-[1100] flex-col animate-in fade-in slide-in-from-bottom-4 duration-300 relative overflow-hidden rounded-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary/10 to-purple-600/10">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Finora</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsOpen(false)}
                data-testid="button-close-finora-desktop"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close chat</span>
              </Button>
            </div>

            {/* Messages */}
            <div 
              ref={desktopMessagesContainerRef}
              onScroll={handleDesktopScroll}
              className="flex-1 overflow-y-auto p-4 space-y-4 pb-3 max-h-full"
              style={{ scrollBehavior: 'smooth' }}
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-primary to-purple-600 text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={desktopMessagesEndRef} />
            </div>

            {/* Scroll to Latest Button - Desktop */}
            {showScrollButton && (
              <button
                onClick={scrollToBottom}
                className="absolute bottom-28 right-4 w-10 h-10 rounded-full bg-primary/90 hover:bg-primary shadow-lg flex items-center justify-center transition-all z-10 animate-in fade-in duration-200"
                aria-label="Scroll to latest message"
                data-testid="button-scroll-to-latest-desktop"
              >
                <ArrowDown className="h-5 w-5 text-primary-foreground" />
              </button>
            )}

            {/* Suggested Prompts (only show if no messages yet besides welcome) */}
            {messages.length <= 1 && (
              <div className="px-4 pb-2 flex flex-col gap-2">
                {SUGGESTED_PROMPTS.map((prompt, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    className="text-xs text-left justify-start h-auto py-2"
                    onClick={() => handleSuggestedPrompt(prompt)}
                    data-testid={`button-prompt-${idx}`}
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask Finora about your spending…"
                  className="flex-1"
                  data-testid="input-finora-message"
                />
                <Button
                  size="icon"
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim()}
                  data-testid="button-send-message"
                >
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send message</span>
                </Button>
              </div>
            </div>
          </Card>
        </>
      )}
    </>
  );
}
