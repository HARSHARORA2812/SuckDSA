import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ArrowRight, Brain, Zap, Trophy, Star, MessageSquare, BookOpen, Users, Sparkles, LogOut, User } from "lucide-react";

const HomePage = () => {
  const navigate = useNavigate();
  const featuresRef = useRef(null);
  const { user, logout, isAuthenticated } = useAuth();

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/10 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                SuckDSA
              </div>
              <Badge className="bg-orange-500/20 text-orange-300 border-orange-400/30">
                AI Powered
              </Badge>
            </div>
            <div className="flex items-center space-x-6">
              <button 
                onClick={scrollToFeatures}
                className="text-white/80 hover:text-white transition-colors duration-200"
              >
                Features
              </button>
              
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-white/80">
                    <User className="w-4 h-4" />
                    <span className="text-sm">Welcome, {user?.name}!</span>
                  </div>
                  <Button 
                    onClick={() => navigate('/chat')}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    data-testid="start-learning-nav"
                  >
                    Continue Learning
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button 
                    onClick={handleLogout}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10 transition-all duration-200"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={() => navigate('/chat')}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  data-testid="start-learning-nav"
                >
                  Start Learning
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent z-0"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1508361727343-ca787442dcd7')" }}
        ></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-orange-500/20 text-orange-300 border-orange-400/30 text-sm">
                  🔥 Savage Learning Experience
                </Badge>
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Master DSA with
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                    Savage AI
                  </span>
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed max-w-xl">
                  Learn Data Structures & Algorithms through brutally honest, hilarious AI explanations. 
                  Get roasted while you master concepts with Indian cultural humor.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => navigate('/chat')}
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-lg px-8 py-6"
                  data-testid="get-roasted-button"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Get Roasted & Learn
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={scrollToFeatures}
                  className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 text-lg px-8 py-6"
                  data-testid="see-features-button"
                >
                  <MessageSquare className="mr-2 h-5 w-5" />
                  See Features
                </Button>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-full border-2 border-white"></div>
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full border-2 border-white"></div>
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-cyan-500 rounded-full border-2 border-white"></div>
                  </div>
                  <span className="text-white/80 text-sm">1000+ students roasted</span>
                </div>
                <div className="flex items-center space-x-1">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="h-4 w-4 fill-orange-400 text-orange-400" />
                  ))}
                  <span className="text-white/80 text-sm ml-2">4.9/5 savage rating</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl">
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-10 rounded-2xl"
                  style={{ backgroundImage: "url('https://images.unsplash.com/photo-1677691820099-a6e8040aa077')" }}
                ></div>
                <div className="relative space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                      <Brain className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">SuckDSA AI</p>
                      <p className="text-green-400 text-sm">● Online</p>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-4 border-l-4 border-orange-500">
                    <p className="text-white/90 text-sm leading-relaxed">
                      "Arre yaar! Still asking about arrays? Your DSA prep is like chai without sugar - basic hi missing hai! 
                      <br /><br />
                      Arrays are like PG beds in one corridor - reach any bed instantly, but shifting beds is dard-e-disco! 🔥"
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg px-4 py-2">
                      <p className="text-white text-sm">Explain stacks to me</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-orange-500/20 text-orange-300 border-orange-400/30 mb-4">
              Why Choose SuckDSA?
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Revolutionary AI-Powered Learning
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the future of DSA education with our savage AI teacher that makes learning unforgettable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 transition-all duration-300 group hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-4 group-hover:shadow-lg transition-shadow">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white text-xl">Savage AI Responses</CardTitle>
                <CardDescription className="text-gray-300">
                  Get brutally honest explanations with Indian cultural humor that makes DSA concepts stick in your memory forever.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 transition-all duration-300 group hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4 group-hover:shadow-lg transition-shadow">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white text-xl">Interactive Learning</CardTitle>
                <CardDescription className="text-gray-300">
                  Chat-first approach with topic selection, real-time explanations, and personalized learning paths.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 transition-all duration-300 group hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4 group-hover:shadow-lg transition-shadow">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white text-xl">Desi Analogies</CardTitle>
                <CardDescription className="text-gray-300">
                  Learn through familiar references - hostel mess, cricket, Bollywood, and daily Indian life scenarios.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 transition-all duration-300 group hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center mb-4 group-hover:shadow-lg transition-shadow">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white text-xl">GPT-5 Powered</CardTitle>
                <CardDescription className="text-gray-300">
                  Latest AI technology ensures accurate, contextual, and creatively savage explanations for all DSA concepts.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 transition-all duration-300 group hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mb-4 group-hover:shadow-lg transition-shadow">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white text-xl">Conversational UI</CardTitle>
                <CardDescription className="text-gray-300">
                  Modern, fluid chat interface with topic shortcuts, history, and seamless learning experience.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 transition-all duration-300 group hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mb-4 group-hover:shadow-lg transition-shadow">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white text-xl">Student Focused</CardTitle>
                <CardDescription className="text-gray-300">
                  Built for Indian CS students, interview preparation, and anyone who learns better with humor and cultural context.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 relative">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-5"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1605647540924-852290f6b0d5')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-orange-500/20 text-orange-300 border-orange-400/30 mb-4">
              Student Success
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Getting Roasted Never Felt So Good
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white/5 backdrop-blur-lg border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="h-4 w-4 fill-orange-400 text-orange-400" />
                  ))}
                </div>
                <p className="text-white/90 mb-4">
                  "Finally understood stacks through the 'hostel mess plates' analogy! This AI is savage but brilliant. Got my dream job at Google!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-semibold">
                    A
                  </div>
                  <div className="ml-3">
                    <p className="text-white font-semibold">Arjun Sharma</p>
                    <p className="text-gray-400 text-sm">SDE at Google</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-lg border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="h-4 w-4 fill-orange-400 text-orange-400" />
                  ))}
                </div>
                <p className="text-white/90 mb-4">
                  "The desi analogies are pure gold! Never thought learning DSA could be this entertaining. Aced my Microsoft interview!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    P
                  </div>
                  <div className="ml-3">
                    <p className="text-white font-semibold">Priya Patel</p>
                    <p className="text-gray-400 text-sm">SDE at Microsoft</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-lg border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="h-4 w-4 fill-orange-400 text-orange-400" />
                  ))}
                </div>
                <p className="text-white/90 mb-4">
                  "This AI teacher is ruthless but effective! The cricket analogies for graphs made everything click. Cleared Amazon L5!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
                    R
                  </div>
                  <div className="ml-3">
                    <p className="text-white font-semibold">Rahul Singh</p>
                    <p className="text-gray-400 text-sm">SDE-2 at Amazon</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Get Roasted?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of students who mastered DSA through savage AI teaching. Start your brutally effective learning journey today.
          </p>
          <Button 
            onClick={() => navigate('/chat')}
            size="lg"
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 text-xl px-12 py-8"
            data-testid="start-learning-cta"
          >
            <Sparkles className="mr-3 h-6 w-6" />
            Start Learning with SuckDSA
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/50 backdrop-blur-lg border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                SuckDSA
              </div>
              <Badge className="bg-orange-500/20 text-orange-300 border-orange-400/30">
                Savage Learning
              </Badge>
            </div>
            <p className="text-gray-400">
              © 2025 SuckDSA. Built with 🔥 for Indian developers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;