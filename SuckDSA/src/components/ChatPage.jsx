import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { ArrowLeft, Home, User, LogOut } from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://suckdsa-backend.onrender.com';
const API = `${BACKEND_URL}/api`;

const ChatPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [topics, setTopics] = useState([]);
  const messagesEndRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetchTopics();
    // Add welcome message with user's name
    setMessages([{
      id: "welcome",
      type: "ai", 
      content: `Arre ${user?.name || 'yaar'}! Welcome to SuckDSA! 🔥\n\nI'm your savage DSA teacher who'll roast you while teaching you. Ask me anything about Data Structures & Algorithms - arrays, stacks, trees, whatever. Let's see if your brain runs faster than JioFiber or hangs like BSNL! 😏\n\nGo ahead, ask me something...`
    }]);
  }, [user]);

  const fetchTopics = async () => {
    try {
      const response = await axios.get(`${API}/topics`);
      setTopics(response.data);
    } catch (error) {
      console.error("Error fetching topics:", error);
    }
  };

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;

    const messageToSend = currentMessage.trim();
    const userMessage = {
      id: Date.now().toString(),
      type: "user",
      content: messageToSend
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage("");
    setIsLoading(true);

    try {
      const response = await axios.post(`${API}/chat`, {
        message: messageToSend,
        session_id: sessionId
      });

      if (!sessionId) {
        setSessionId(response.data.session_id);
      }

      const aiMessage = {
        id: Date.now().toString() + "_ai",
        type: "ai",
        content: response.data.response
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = {
        id: Date.now().toString() + "_error",
        type: "ai",
        content: "Oops! Savage teacher crashed harder than Internet Explorer. Try again! 😅"
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const selectTopic = (topic) => {
    setCurrentMessage(`Explain ${topic.name} to me`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-orange-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-gray-900"
                data-testid="back-to-home"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Home
              </Button>
              <div className="flex items-center space-x-3">
                <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  SuckDSA
                </div>
                <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-300">
                  Savage Mode 🔥
                </Badge>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <User className="w-4 h-4" />
                <span className="text-sm">Welcome, {user?.name}!</span>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900 border-gray-300"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Topics Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white/70 backdrop-blur-sm border-orange-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-orange-800 text-lg">DSA Topics</CardTitle>
                <CardDescription>Pick your poison 😈</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {topics.map((topic, index) => (
                  <div
                    key={index}
                    onClick={() => selectTopic(topic)}
                    className="p-3 rounded-lg bg-gradient-to-r from-orange-100 to-red-100 hover:from-orange-200 hover:to-red-200 cursor-pointer transition-all duration-200 border border-orange-200 hover:border-orange-300"
                    data-testid={`topic-${topic.name.toLowerCase()}`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{topic.icon}</span>
                      <div>
                        <div className="font-medium text-orange-800">{topic.name}</div>
                        <div className="text-xs text-gray-600">{topic.savage_intro}</div>
                        <Badge variant="outline" className="mt-1 text-xs border-orange-300 text-orange-600">
                          {topic.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="bg-white/70 backdrop-blur-sm border-orange-200 shadow-xl h-[600px] flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="text-orange-800">Savage Chat</CardTitle>
                <CardDescription>Get roasted while learning DSA 🌶️</CardDescription>
              </CardHeader>
              
              {/* Messages Area */}
              <CardContent className="flex-1 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-orange-300 scrollbar-track-orange-100">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-2xl ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white ml-4'
                          : 'bg-white border border-orange-200 text-gray-800 mr-4 shadow-md'
                      }`}
                      data-testid={`message-${message.type}`}
                    >
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-orange-200 p-4 rounded-2xl mr-4 shadow-md">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        <span className="text-sm text-gray-600 ml-2">Savage teacher is typing...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </CardContent>

              <Separator className="bg-orange-200" />
              
              {/* Input Area */}
              <div className="p-4">
                <div className="flex space-x-2">
                  <Input
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me about DSA... I dare you 😏"
                    className="flex-1 border-orange-200 focus:ring-orange-500 focus:border-orange-500"
                    disabled={isLoading}
                    data-testid="chat-input"
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={isLoading || !currentMessage.trim()}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6"
                    data-testid="send-button"
                  >
                    Send 🚀
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;