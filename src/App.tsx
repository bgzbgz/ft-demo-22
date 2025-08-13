import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line
} from "recharts";
import { 
 CheckCircle2, ArrowRight, ShieldCheck, Zap, Timer, Cpu, Gauge, 
Target, Users, Lock, Mail, X, TrendingUp, AlertTriangle,
Brain, Award, Clock, Eye
} from "lucide-react";

// Fast Track Colors
const colors = {
  black: "#000000",
  white: "#ffffff", 
  accent: "#FF6B35", // Fast Track orange/red accent
  yellow: "#FFF469", // Secondary accent
  gray: "#666666",
  lightGray: "#F5F5F5"
};

// Utility functions
const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

// Enhanced question set with Fast Track intelligence
const intelligentQuestions = [
  {
    id: "industry",
    section: "BATTLEFIELD",
    text: "What industry defines your battlefield?",
    type: "single",
    options: [
      { label: "Technology/SaaS", key: "tech", weight: 8, insight: "Tech moves fast. Your execution speed is everything." },
      { label: "Manufacturing", key: "mfg", weight: 7, insight: "Operational excellence wins. Personal efficiency scales." },
      { label: "Professional Services", key: "services", weight: 6, insight: "Your people are your product. Optimize them first." },
      { label: "Healthcare", key: "health", weight: 7, insight: "Precision and speed save lives and profits." },
      { label: "Financial Services", key: "finance", weight: 9, insight: "Trust and execution drive everything in finance." }
    ]
  },
  {
    id: "competitive_response",
    section: "SPEED",
    text: "Your biggest competitor just announced a major move. How long until you respond?",
    type: "single",
    options: [
      { label: "Within 24 hours", key: "24h", weight: 10, insight: "Elite speed. You think like a champion." },
      { label: "Within 1 week", key: "1w", weight: 7, insight: "Good speed, but champions move faster." },
      { label: "Within 1 month", key: "1m", weight: 4, insight: "Too slow. Your competitors are eating your lunch." },
      { label: "3+ months", key: "3m", weight: 1, insight: "Fatal speed. You're already behind." }
    ]
  },
  {
    id: "personal_optimization",
    section: "EFFICIENCY", 
    text: "What time do you wake up? (Personal efficiency drives business results)",
    type: "single",
    options: [
      { label: "Before 5:00 AM", key: "pre5", weight: 10, insight: "Champion mindset. Personal discipline creates business discipline." },
      { label: "5:00 - 6:00 AM", key: "5to6", weight: 8, insight: "Good discipline. Room for optimization." },
      { label: "6:00 - 7:00 AM", key: "6to7", weight: 5, insight: "Average. Your competitors are already working." },
      { label: "After 7:00 AM", key: "post7", weight: 2, insight: "Behind before you start. Personal habits leak into business." }
    ]
  },
  {
    id: "strategic_focus",
    section: "EXECUTION",
    text: "How many strategic priorities is your leadership team tracking?",
    type: "single", 
    options: [
      { label: "1-3 priorities", key: "focused", weight: 10, insight: "Perfect focus. 80/20 principle in action." },
      { label: "4-7 priorities", key: "manageable", weight: 6, insight: "Manageable but not optimal. Simplify further." },
      { label: "8-15 priorities", key: "scattered", weight: 3, insight: "Scattered focus kills execution. Cut ruthlessly." },
      { label: "15+ priorities", key: "chaos", weight: 1, insight: "Execution chaos. Everything is priority = nothing is priority." }
    ]
  },
  {
    id: "talent_strategy", 
    section: "CAPABILITY",
    text: "Your last 3 senior hires - promoted internally or recruited externally?",
    type: "single",
    options: [
      { label: "All promoted internally", key: "internal", weight: 6, insight: "Good loyalty, but are you upgrading capability?" },
      { label: "Mix of internal/external", key: "mixed", weight: 9, insight: "Smart balance. Fresh thinking + cultural continuity." },
      { label: "All recruited externally", key: "external", weight: 7, insight: "New blood, but culture integration is critical." },
      { label: "Haven't hired in 12+ months", key: "stagnant", weight: 3, insight: "Stagnant capability. Growth requires new talent." }
    ]
  },
  {
    id: "execution_rate",
    section: "RESULTS",
    text: "What percentage of your strategic initiatives get fully executed?",
    type: "percentage",
    insights: {
      high: "Elite execution. You're in the top 13% of companies.",
      medium: "Good execution, but champions achieve 87%+ success rates.",
      low: "Execution betrayal. Great strategies dying in implementation."
    }
  }
];

// Industry-specific competitive intelligence
const industryBenchmarks = {
  tech: { executionRate: 65, avgGrowth: 23, topPerformer: 87 },
  mfg: { executionRate: 71, avgGrowth: 12, topPerformer: 89 },
  services: { executionRate: 58, avgGrowth: 15, topPerformer: 82 },
  health: { executionRate: 69, avgGrowth: 18, topPerformer: 86 },
  finance: { executionRate: 73, avgGrowth: 14, topPerformer: 91 }
};

// Enhanced scoring algorithm
function calculateBusinessHealth(answers) {
  let totalWeight = 0;
  let maxWeight = 0;
  const insights = [];
  const risks = [];
  const opportunities = [];

  // Calculate weighted score
  Object.entries(answers).forEach(([key, answer]) => {
    const question = intelligentQuestions.find(q => q.id === key);
    if (!question) return;

    if (question.type === 'single' && answer.weight) {
      totalWeight += answer.weight;
      maxWeight += 10;
      
      // Add insights based on answers
      if (answer.insight) insights.push(answer.insight);
      
      // Identify risks
      if (answer.weight <= 3) {
        risks.push(`${question.section}: Critical weakness identified`);
      }
      
      // Identify opportunities  
      if (answer.weight >= 8) {
        opportunities.push(`${question.section}: Competitive strength`);
      }
    } else if (question.type === 'percentage' && typeof answer === 'number') {
      const normalized = Math.round((answer / 100) * 10);
      totalWeight += normalized;
      maxWeight += 10;
      
      if (answer >= 80) insights.push(question.insights.high);
      else if (answer >= 60) insights.push(question.insights.medium);
      else insights.push(question.insights.low);
    }
  });

  const healthScore = maxWeight > 0 ? Math.round((totalWeight / maxWeight) * 100) : 0;
  
  // Get industry benchmark
  const industry = answers.industry?.key || 'tech';
  const benchmark = industryBenchmarks[industry];

  return {
    score: healthScore,
    insights: insights.slice(0, 3),
    risks: risks.slice(0, 2), 
    opportunities: opportunities.slice(0, 2),
    benchmark,
    industry
  };
}

// Real-time counter animation
function useCounter(end, duration = 2000) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime;
    let animationFrame;
    
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = (currentTime - startTime) / duration;
      
      if (progress < 1) {
        setCount(Math.floor(end * progress));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);
  
  return count;
}

// Exit intent hook
function useExitIntent(callback) {
  useEffect(() => {
    let timeoutId;
    
    const handleMouseLeave = (e) => {
      if (e.clientY <= 0 && e.relatedTarget === null) {
        timeoutId = setTimeout(callback, 1000);
      }
    };
    
    const handleMouseEnter = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    };
    
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [callback]);
}

export default function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [email, setEmail] = useState("");
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [demoStarted, setDemoStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Animated counters
  const executionCounter = useCounter(87, 2000);
  const industryCounter = useCounter(23, 2000); 
  const roiCounter = useCounter(27000, 2500);

  // Exit intent
  useExitIntent(() => {
    if (!demoStarted) setShowExitIntent(true);
  });

  // Calculate results
  const businessHealth = useMemo(() => calculateBusinessHealth(answers), [answers]);

  // Progress calculation
  const totalQuestions = intelligentQuestions.length;
  const progress = Math.round((Object.keys(answers).length / totalQuestions) * 100);

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
    
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const startDemo = () => {
    setDemoStarted(true);
    document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToDemo = () => {
    document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Radar chart data
  const radarData = [
    { subject: 'Strategy', A: Math.min(businessHealth.score / 10, 10), fullMark: 10 },
    { subject: 'Speed', A: Math.min(businessHealth.score / 12, 10), fullMark: 10 },
    { subject: 'Execution', A: Math.min(businessHealth.score / 8, 10), fullMark: 10 },
    { subject: 'Focus', A: Math.min(businessHealth.score / 11, 10), fullMark: 10 },
    { subject: 'Capability', A: Math.min(businessHealth.score / 9, 10), fullMark: 10 }
  ];

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-black rounded"></div>
              <span className="font-bold text-xl tracking-tight">FAST TRACK</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
              <a href="#blueprint" className="text-gray-600 hover:text-black transition-colors">Blueprint</a>
              <a href="#demo-section" className="text-gray-600 hover:text-black transition-colors">Demo</a>
              <a href="#engines" className="text-gray-600 hover:text-black transition-colors">Engines</a>
              <a href="#proof" className="text-gray-600 hover:text-black transition-colors">Proof</a>
            </nav>
            
            <button
              onClick={scrollToDemo}
              className="bg-black text-white px-6 py-2 rounded-full font-semibold hover:bg-gray-900 transition-colors"
            >
              Free Yourself - Take Business MRI
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-black to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-5xl lg:text-6xl font-black leading-tight uppercase tracking-tight"
              >
                You're An Imprisoned Athlete.{" "}
                <span style={{ color: colors.accent }}>We Free Champions.</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl text-gray-300 mt-6 leading-relaxed"
              >
                Former top performers trapped in complexity they created.
              </motion.p>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-lg text-gray-400 mt-4 leading-relaxed"
              >
                <strong>847 variables analyzed in 72 hours.</strong> Blind spots exposed. 
                Execution accelerated. Competitors left behind.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 mt-8"
              >
                <button
                  onClick={startDemo}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-colors flex items-center justify-center"
                >
                  Free Yourself - Take Business MRI
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
                <button className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 rounded-full font-bold text-lg transition-colors">
                  See Sample Report
                </button>
              </motion.div>
              
              {/* Stats */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-gray-700"
              >
                <div className="text-center">
                  <div className="text-4xl font-black" style={{ color: colors.accent }}>
                    {executionCounter}%
                  </div>
                  <div className="text-sm text-gray-400 uppercase tracking-wide">
                    Execution Success
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black text-gray-500">
                    {industryCounter}%
                  </div>
                  <div className="text-sm text-gray-400 uppercase tracking-wide">
                    Industry Average
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black" style={{ color: colors.yellow }}>
                    {roiCounter.toLocaleString()}%
                  </div>
                  <div className="text-sm text-gray-400 uppercase tracking-wide">
                    Personal Efficiency ROI
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Live Demo Preview */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-white text-black rounded-2xl p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-black">Live Business Health</h3>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-1" />
                  Real-time Analysis
                </div>
              </div>
              
              <div className="h-64 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" className="text-sm" />
                    <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} />
                    <Radar 
                      name="Score" 
                      dataKey="A" 
                      stroke={colors.accent} 
                      fill={colors.accent} 
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                {radarData.map((item) => (
                  <div key={item.subject} className="flex justify-between items-center">
                    <span className="text-gray-600">{item.subject}</span>
                    <span className="font-bold">{Math.round(item.A)}/10</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Business Health Score</div>
                <div className="text-3xl font-black" style={{ color: colors.accent }}>
                  {businessHealth.score}/100
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Urgency Bar */}
      <div className="bg-orange-600 text-white py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center text-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <span className="font-semibold">
              Join 12 CEOs who got clarity this week • 47 diagnostics completed this month • Your competitors aren't waiting
            </span>
          </div>
        </div>
      </div>

      {/* Blueprint Section */}
      <section id="blueprint" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tight mb-6">
              The Fast Track Business MRI Blueprint
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See what your competitors can't. Know what your board doesn't. 
              Act while others analyze.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Eye, title: "Crystal-Clear Industry Fit", desc: "See how you stack against market leaders. No blind spots." },
              { icon: Brain, title: "Deep Business Diagnosis", desc: "847 variables analyzed. Root causes exposed." },
              { icon: Target, title: "Competitor Benchmarking", desc: "Know exactly where you win and lose." },
              { icon: Cpu, title: "Hidden Patterns & Root Causes", desc: "AI reveals what human analysis misses." },
              { icon: Zap, title: "AI and Tech Readiness", desc: "Future-proof your competitive position." },
              { icon: Gauge, title: "80/20 Priority Plan", desc: "Focus on the 20% that drives 80% of results." },
              { icon: Timer, title: "Execution-Ready Roadmap", desc: "Step-by-step plan. No theory. Just action." }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <item.icon className="h-8 w-8 mr-3" style={{ color: colors.accent }} />
                  <h3 className="text-lg font-bold">{item.title}</h3>
                </div>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo-section" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tight mb-6">
              See What Your Competitors Can't
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Live business intelligence that reveals hidden opportunities and threats.
              Complete in 3 minutes.
            </p>
          </div>

          {!demoStarted ? (
            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startDemo}
                className="bg-orange-600 hover:bg-orange-700 text-white px-12 py-6 rounded-full font-bold text-xl transition-colors inline-flex items-center"
              >
                Start Your Business MRI Now
                <ArrowRight className="ml-3 h-6 w-6" />
              </motion.button>
              <p className="text-sm text-gray-500 mt-4">
                Used by 500+ CEOs • Takes 3 minutes • Instant results
              </p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Questions */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl p-8 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-sm font-semibold text-orange-600 uppercase tracking-wide">
                      Business Health Analysis
                    </div>
                    <div className="text-sm text-gray-500">
                      {Math.min(currentQuestion + 1, totalQuestions)} of {totalQuestions} • {progress}% Complete
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${progress}%`,
                          backgroundColor: colors.accent
                        }}
                      ></div>
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {!showResults && currentQuestion < totalQuestions && (
                      <motion.div
                        key={currentQuestion}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="mb-4">
                          <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                            {intelligentQuestions[currentQuestion].section}
                          </div>
                          <h3 className="text-2xl font-bold text-black mb-6">
                            {intelligentQuestions[currentQuestion].text}
                          </h3>
                        </div>

                        {intelligentQuestions[currentQuestion].type === 'single' && (
                          <div className="grid gap-3">
                            {intelligentQuestions[currentQuestion].options.map((option) => (
                              <button
                                key={option.key}
                                onClick={() => handleAnswer(intelligentQuestions[currentQuestion].id, option)}
                                className="text-left p-4 border-2 border-gray-200 rounded-lg hover:border-orange-600 hover:bg-orange-50 transition-colors group"
                              >
                                <div className="font-semibold text-black group-hover:text-orange-600">
                                  {option.label}
                                </div>
                              </button>
                            ))}
                          </div>
                        )}

                        {intelligentQuestions[currentQuestion].type === 'percentage' && (
                          <div>
                            <div className="mb-4">
                              <input
                                type="range"
                                min="0"
                                max="100"
                                step="5"
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                onChange={(e) => {
                                  const value = parseInt(e.target.value);
                                  document.getElementById('percentage-display').textContent = value;
                                }}
                              />
                              <div className="flex justify-between text-sm text-gray-500 mt-2">
                                <span>0%</span>
                                <span id="percentage-display" className="font-bold text-orange-600">50%</span>
                                <span>100%</span>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                const slider = document.querySelector('input[type="range"]');
                                handleAnswer(intelligentQuestions[currentQuestion].id, parseInt(slider.value));
                              }}
                              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                            >
                              Continue
                            </button>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {showResults && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center"
                      >
                        <h3 className="text-3xl font-bold mb-6">Analysis Complete</h3>
                        <p className="text-lg text-gray-600 mb-8">
                          Your business health score and insights are ready.
                          Enter your email to see the full analysis.
                        </p>
                        
                        <div className="max-w-md mx-auto">
                          <div className="flex gap-3 mb-4">
                            <input
                              type="email"
                              placeholder="your.email@company.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                            />
                            <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                              Get Results
                            </button>
                          </div>
                          <div className="flex items-center justify-center text-sm text-gray-500">
                            <Lock className="h-4 w-4 mr-2" />
                            We protect your data. No spam, ever.
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Live Results */}
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold">Business Health Score</h4>
                    <Gauge className="h-5 w-5 text-orange-600" />
                  </div>
                  
                  <div className="text-center mb-4">
                    <div className="text-5xl font-black mb-2" style={{ color: colors.accent }}>
                      {businessHealth.score}
                    </div>
                    <div className="text-sm text-gray-500">
                      Updates live as you answer
                    </div>
                  </div>
                  
                  <div className="h-32 mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[
                        { name: 'Industry Avg', value: businessHealth.benchmark?.executionRate || 60 },
                        { name: 'Your Score', value: businessHealth.score },
                        { name: 'Top Performer', value: businessHealth.benchmark?.topPerformer || 87 }
                      ]}>
                        <Line type="monotone" dataKey="value" stroke={colors.accent} strokeWidth={3} />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold">Live Insights</h4>
                    <Brain className="h-5 w-5 text-orange-600" />
                  </div>
                  
                  {businessHealth.insights.length > 0 ? (
                    <ul className="space-y-3 text-sm">
                      {businessHealth.insights.map((insight, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{insight}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-sm italic">
                      Answer more questions to see personalized insights
                    </p>
                  )}
                  
                  <button
                    onClick={() => setShowResults(true)}
                    className="w-full mt-4 bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                  >
                    Get Complete 48-Hour Analysis
                  </button>
                </div>

                {businessHealth.risks.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-center mb-2">
                      <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                      <h5 className="font-bold text-red-800">Critical Risks</h5>
                    </div>
                    <ul className="text-sm text-red-700 space-y-1">
                      {businessHealth.risks.map((risk, index) => (
                        <li key={index}>• {risk}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Social Proof */}
      <section id="proof" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tight mb-6">
              Why Imprisoned Athletes Become Champions
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="text-6xl font-black mb-4" style={{ color: colors.accent }}>87%</div>
              <h3 className="text-xl font-bold mb-2">Execution success vs 23% average</h3>
              <p className="text-gray-600">Fast Track clients achieve 87% execution success while industry averages 23%</p>
            </div>
            <div className="text-center">
              <div className="text-6xl font-black mb-4" style={{ color: colors.accent }}>27,000%</div>
              <h3 className="text-xl font-bold mb-2">ROI on personal efficiency</h3>
              <p className="text-gray-600">Personal optimization delivers 6,849% to 27,000% ROI on business results</p>
            </div>
            <div className="text-center">
              <div className="text-6xl font-black mb-4" style={{ color: colors.accent }}>48h</div>
              <h3 className="text-xl font-bold mb-2">Clarity delivery time</h3>
              <p className="text-gray-600">Business MRI delivered in 48 hours, not months of consulting</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-xl p-8">
              <blockquote className="text-lg text-gray-700 mb-4">
                "Fast Track didn't just find our blind spots - they showed us exactly how to exploit our competitors' weaknesses. Revenue up 31% in 90 days."
              </blockquote>
              <div className="text-sm text-gray-500">
                — CEO, Chennai Manufacturing (₹180 Cr revenue)
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-8">
              <blockquote className="text-lg text-gray-700 mb-4">
                "The personal efficiency integration was the game-changer. My energy improved, decisions got sharper, team performance exploded."
              </blockquote>
              <div className="text-sm text-gray-500">
                — Founder, Singapore Tech (Series B)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Four Engines */}
      <section id="engines" className="py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tight mb-6">
              Four Integrated Performance Engines
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              The world's first Human-Business Performance Intelligence platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Business MRI Diagnostic",
                desc: "X-ray vision for companies. 847 variables analyzed in 72 hours. See what kills execution.",
                icon: Eye
              },
              {
                title: "Strategy Engine", 
                desc: "Business crystal ball. Model infinite scenarios. Predict competitor moves 18 months early.",
                icon: Brain
              },
              {
                title: "Performance Program",
                desc: "Execution acceleration system. Move 40% faster with systematic implementation.",
                icon: Zap
              },
              {
                title: "Personal Efficiency OS",
                desc: "Human optimization platform. 27,000% ROI on peak performance habits.",
                icon: Award
              }
            ].map((engine, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-900 rounded-xl p-8 hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center mb-4">
                  <engine.icon className="h-8 w-8 mr-3" style={{ color: colors.accent }} />
                  <h3 className="text-xl font-bold">{engine.title}</h3>
                </div>
                <p className="text-gray-300">{engine.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tight mb-6">
            Your Competitors Aren't Waiting
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-3xl mx-auto">
            Every day of delay costs opportunities. Every week of confusion costs market share.
            Join 500+ CEOs who chose speed over study, action over analysis, results over reports.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button
              onClick={scrollToDemo}
              className="bg-white text-orange-600 px-12 py-4 rounded-full font-bold text-xl hover:bg-gray-100 transition-colors"
            >
              Free Yourself - Take Business MRI
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-orange-600 px-8 py-4 rounded-full font-bold text-lg transition-colors">
              See Sample Report
            </button>
          </div>
          
          <div className="flex items-center justify-center gap-8 text-sm text-orange-100">
            <div className="flex items-center">
              <ShieldCheck className="h-5 w-5 mr-2" />
              Money-back guarantee
            </div>
            <div className="flex items-center">
              <Timer className="h-5 w-5 mr-2" />
              48-hour delivery
            </div>
            <div className="flex items-center">
              <Lock className="h-5 w-5 mr-2" />
              Data protected
            </div>
          </div>
        </div>
      </section>

      {/* Exit Intent Modal */}
      <AnimatePresence>
        {showExitIntent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold">Wait! You're About to Leave Money on the Table</h3>
                <button
                  onClick={() => setShowExitIntent(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <p className="text-gray-600 mb-6">
                Take 3 minutes to see your business blind spots. Get your competitive position score and 
                2 specific moves to accelerate growth.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowExitIntent(false);
                    startDemo();
                  }}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  Show Me My Blind Spots
                </button>
                <button
                  onClick={() => setShowExitIntent(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  No Thanks
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom CSS */}
      <style jsx>{`
        .font-sans {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
      `}</style>
    </div>
  );
}
