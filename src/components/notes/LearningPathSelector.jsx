import { useState } from 'react';
import Link from 'next/link';
import SafeIcon from '@/components/content/SafeIcon';

const LEARNING_PATHS = {
  'security-engineer': {
    id: 'security-engineer',
    title: 'Security Engineer Track',
    icon: 'code',
    duration: '10 weeks',
    difficulty: 'intermediate-to-advanced',
    description: 'Deep technical focus on secure systems, cryptography, and DevSecOps. Best for developers transitioning to security engineering roles.',
    skills: ['Threat modeling', 'Secure architecture', 'Cryptography', 'DevSecOps', 'Incident response'],
    modules: [
      { week: 1, title: 'Foundations: Data & Networks', route: '/cybersecurity/beginner', focus: 'Quick review if confident, focus on data integrity concepts' },
      { week: 2, title: 'Applied: Threat Modeling & Attack Surfaces', route: '/cybersecurity/intermediate', focus: 'Core skill for engineers' },
      { week: 3, title: 'Applied: Vulnerability Classes', route: '/cybersecurity/intermediate', focus: 'Understanding common failures' },
      { week: 4, title: 'Applied: Auth & Identity', route: '/cybersecurity/intermediate', focus: 'Critical for app security' },
      { week: 5, title: 'Practice: Cryptography', route: '/cybersecurity/advanced', focus: 'Crypto in practice' },
      { week: 6, title: 'Practice: Secure Architecture', route: '/cybersecurity/advanced', focus: 'Zero trust design' },
      { week: 7, title: 'Practice: DevSecOps', route: '/cybersecurity/advanced', focus: 'Security in SDLC' },
      { week: 8, title: 'Practice: Detection & Response', route: '/cybersecurity/advanced', focus: 'Operational security' },
      { week: 9, title: 'Capstone Project', route: '/cybersecurity/summary', focus: 'Design secure system architecture' },
      { week: 10, title: 'Review & Certification Prep', route: '/cybersecurity/summary', focus: 'Consolidate learning' },
    ]
  },
  'security-analyst': {
    id: 'security-analyst',
    title: 'Security Analyst Track',
    icon: 'activity',
    duration: '8 weeks',
    difficulty: 'beginner-to-intermediate',
    description: 'Focus on threat detection, log analysis, incident triage, and security operations. Ideal for SOC analyst roles.',
    skills: ['Log analysis', 'Threat detection', 'Incident triage', 'Alert investigation', 'Security monitoring'],
    modules: [
      { week: 1, title: 'Foundations: Complete', route: '/cybersecurity/beginner', focus: 'Build baseline understanding' },
      { week: 2, title: 'Foundations: Threats & Defenses', route: '/cybersecurity/beginner', focus: 'Recognizing attack patterns' },
      { week: 3, title: 'Applied: Threat Modeling', route: '/cybersecurity/intermediate', focus: 'Understanding attacker perspective' },
      { week: 4, title: 'Applied: Attack Surfaces & Vulns', route: '/cybersecurity/intermediate', focus: 'What to look for' },
      { week: 5, title: 'Applied: Logging & Monitoring', route: '/cybersecurity/intermediate', focus: 'Core analyst skill' },
      { week: 6, title: 'Practice: Detection & Response', route: '/cybersecurity/advanced', focus: 'Operational procedures' },
      { week: 7, title: 'Practice: Incident Handling', route: '/cybersecurity/advanced', focus: 'Triage and containment' },
      { week: 8, title: 'Capstone: IR Scenarios', route: '/cybersecurity/summary', focus: 'Practice under pressure' },
    ]
  },
  'manager-essentials': {
    id: 'manager-essentials',
    title: 'Security Manager Essentials',
    icon: 'users',
    duration: '4 weeks',
    difficulty: 'beginner-to-intermediate',
    description: 'Risk communication, governance, team leadership, and security strategy. For managers and leaders overseeing security teams.',
    skills: ['Risk communication', 'Governance', 'Team leadership', 'Strategy', 'Stakeholder management'],
    modules: [
      { week: 1, title: 'Foundations: Why Cyber Matters', route: '/cybersecurity/beginner', focus: 'Business impact understanding' },
      { week: 1, title: 'Foundations: CIA Triad & Risk', route: '/cybersecurity/beginner', focus: 'Skip deep technical labs' },
      { week: 2, title: 'Applied: Threat Modeling', route: '/cybersecurity/intermediate', focus: 'Strategic view' },
      { week: 2, title: 'Applied: Risk Trade-offs', route: '/cybersecurity/intermediate', focus: 'Decision-making framework' },
      { week: 3, title: 'Practice: Governance & Compliance', route: '/cybersecurity/advanced', focus: 'Frameworks and policy' },
      { week: 3, title: 'Practice: Incident Response', route: '/cybersecurity/advanced', focus: 'Leadership during incidents' },
      { week: 4, title: 'Communication Scenarios', route: '/cybersecurity/summary', focus: 'Board and stakeholder comms' },
    ]
  },
  'compliance-specialist': {
    id: 'compliance-specialist',
    title: 'Compliance & GRC Track',
    icon: 'shield',
    duration: '6 weeks',
    difficulty: 'intermediate',
    description: 'Deep dive into governance, risk, compliance frameworks (NIST, ISO 27001, GDPR, Cyber Essentials). For GRC professionals.',
    skills: ['Framework mapping', 'Risk assessment', 'Audit preparation', 'Policy development', 'Compliance reporting'],
    modules: [
      { week: 1, title: 'Foundations: Risk & Controls', route: '/cybersecurity/beginner', focus: 'Risk fundamentals' },
      { week: 2, title: 'Applied: Risk Trade-offs', route: '/cybersecurity/intermediate', focus: 'Control selection' },
      { week: 3, title: 'Practice: Governance', route: '/cybersecurity/advanced', focus: 'Frameworks (NIST, CISSP domains)' },
      { week: 4, title: 'Practice: Cyber Essentials Plus', route: '/cybersecurity/advanced', focus: 'UK baseline controls' },
      { week: 5, title: 'Practice: Audit & Evidence', route: '/cybersecurity/advanced', focus: 'Documentation and proof' },
      { week: 6, title: 'Framework Mapping Exercise', route: '/cybersecurity/summary', focus: 'Map controls to requirements' },
    ]
  },
  'express-overview': {
    id: 'express-overview',
    title: 'Express 2-Week Overview',
    icon: 'zap',
    duration: '2 weeks',
    difficulty: 'any',
    description: 'Rapid overview hitting the most critical concepts from all three levels. Great for busy professionals needing quick foundation.',
    skills: ['Core concepts', 'Quick wins', 'Essential awareness', 'Risk basics', 'Common threats'],
    modules: [
      { week: 1, title: 'Foundations Highlights', route: '/cybersecurity/beginner', focus: 'CIA triad, basic threats, passwords, MFA' },
      { week: 1, title: 'Applied Highlights', route: '/cybersecurity/intermediate', focus: 'Threat modeling basics, common vulns' },
      { week: 2, title: 'Practice Highlights', route: '/cybersecurity/advanced', focus: 'Governance, frameworks, incident basics' },
      { week: 2, title: 'Summary & Next Steps', route: '/cybersecurity/summary', focus: 'Where to go deeper' },
    ]
  },
  'custom': {
    id: 'custom',
    title: 'Build Your Own Path',
    icon: 'map',
    duration: 'flexible',
    difficulty: 'any',
    description: 'Mix and match modules based on your specific needs. Work through at your own pace, jumping to topics that matter most.',
    skills: ['Self-directed', 'Flexible', 'Personalized'],
    modules: [
      { title: 'Choose modules à la carte', route: '/cybersecurity', focus: 'Follow your curiosity and job requirements' },
    ]
  }
};

export default function LearningPathSelector() {
  const [selectedPath, setSelectedPath] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  
  // Simple recommendation quiz
  const [quizAnswers, setQuizAnswers] = useState({});
  const quizQuestions = [
    {
      id: 'role',
      question: 'What best describes your current or target role?',
      options: [
        { value: 'engineer', label: 'Developer / Engineer', points: { 'security-engineer': 3 } },
        { value: 'analyst', label: 'Security Analyst / SOC', points: { 'security-analyst': 3 } },
        { value: 'manager', label: 'Manager / Leader', points: { 'manager-essentials': 3 } },
        { value: 'grc', label: 'GRC / Compliance', points: { 'compliance-specialist': 3 } },
        { value: 'other', label: 'Career changer / Exploring', points: { 'express-overview': 2, 'custom': 1 } },
      ]
    },
    {
      id: 'time',
      question: 'How much time can you commit per week?',
      options: [
        { value: 'limited', label: '2-3 hours (busy schedule)', points: { 'express-overview': 2, 'manager-essentials': 1 } },
        { value: 'moderate', label: '5-7 hours (steady pace)', points: { 'security-analyst': 2, 'compliance-specialist': 2 } },
        { value: 'intensive', label: '10+ hours (focused learning)', points: { 'security-engineer': 2 } },
      ]
    },
    {
      id: 'focus',
      question: 'What interests you most?',
      options: [
        { value: 'technical', label: 'Deep technical details', points: { 'security-engineer': 3 } },
        { value: 'operations', label: 'Detecting and responding to threats', points: { 'security-analyst': 3 } },
        { value: 'strategy', label: 'Strategy and governance', points: { 'manager-essentials': 2, 'compliance-specialist': 2 } },
        { value: 'balanced', label: 'Balanced mix of everything', points: { 'custom': 2 } },
      ]
    }
  ];

  const handleQuizAnswer = (questionId, optionValue, points) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: { value: optionValue, points }
    }));
  };

  const calculateRecommendation = () => {
    const scores = {};
    Object.values(quizAnswers).forEach(answer => {
      Object.entries(answer.points).forEach(([pathId, points]) => {
        scores[pathId] = (scores[pathId] || 0) + points;
      });
    });
    
    const recommended = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
    return recommended ? recommended[0] : 'custom';
  };

  const allQuestionsAnswered = Object.keys(quizAnswers).length === quizQuestions.length;

  return (
    <div className="my-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Choose Your Learning Path</h2>
        <p className="mt-2 text-gray-600">
          Different paths optimize for different goals and time commitments. 
          Select a path that matches your needs, or take the quick quiz for a recommendation.
        </p>
      </div>

      {/* Quiz Toggle */}
      <div className="mb-6">
        <button
          onClick={() => setShowQuiz(!showQuiz)}
          className="rounded-lg border-2 border-blue-600 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
        >
          {showQuiz ? 'Hide Quiz' : '🎯 Take Quick Quiz for Recommendation'}
        </button>
      </div>

      {/* Recommendation Quiz */}
      {showQuiz && (
        <div className="mb-8 rounded-xl border border-blue-200 bg-blue-50 p-6">
          <h3 className="mb-4 text-lg font-bold text-gray-900">Path Recommendation Quiz</h3>
          
          {quizQuestions.map((q, qIndex) => (
            <div key={q.id} className="mb-6">
              <p className="mb-3 font-semibold text-gray-800">
                {qIndex + 1}. {q.question}
              </p>
              <div className="space-y-2">
                {q.options.map(option => (
                  <label
                    key={option.value}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-300 bg-white p-3 transition hover:border-blue-500 hover:bg-blue-50"
                  >
                    <input
                      type="radio"
                      name={q.id}
                      value={option.value}
                      checked={quizAnswers[q.id]?.value === option.value}
                      onChange={() => handleQuizAnswer(q.id, option.value, option.points)}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          {allQuestionsAnswered && (
            <div className="mt-6 rounded-lg bg-green-50 border border-green-200 p-4">
              <p className="font-semibold text-green-900">
                ✓ Based on your answers, we recommend:{' '}
                <span className="text-green-700">
                  {LEARNING_PATHS[calculateRecommendation()].title}
                </span>
              </p>
              <button
                onClick={() => {
                  setSelectedPath(calculateRecommendation());
                  setShowQuiz(false);
                }}
                className="mt-3 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
              >
                Select This Path
              </button>
            </div>
          )}
        </div>
      )}

      {/* Path Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Object.values(LEARNING_PATHS).map(path => (
          <div
            key={path.id}
            className={`cursor-pointer rounded-xl border-2 p-4 transition ${
              selectedPath === path.id
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
            }`}
            onClick={() => setSelectedPath(path.id)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <SafeIcon name={path.icon} size={20} color="#2563EB" style={{ marginRight: 0 }} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">{path.title}</h3>
                  <p className="text-xs text-gray-600">{path.duration} • {path.difficulty}</p>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-gray-700 mb-3">{path.description}</p>
            
            <div className="flex flex-wrap gap-1 mb-3">
              {path.skills.slice(0, 3).map(skill => (
                <span key={skill} className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700">
                  {skill}
                </span>
              ))}
              {path.skills.length > 3 && (
                <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600">
                  +{path.skills.length - 3} more
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Path Details */}
      {selectedPath && (
        <div className="mt-8 rounded-xl border-2 border-blue-600 bg-gradient-to-br from-blue-50 to-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">
              Your Selected Path: {LEARNING_PATHS[selectedPath].title}
            </h3>
            <button
              onClick={() => setSelectedPath(null)}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Change path
            </button>
          </div>

          <p className="mb-4 text-gray-700">{LEARNING_PATHS[selectedPath].description}</p>

          <div className="mb-4">
            <p className="font-semibold text-gray-900 mb-2">Skills you'll develop:</p>
            <div className="flex flex-wrap gap-2">
              {LEARNING_PATHS[selectedPath].skills.map(skill => (
                <span key={skill} className="rounded-lg bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-white p-4">
            <p className="font-semibold text-gray-900 mb-3">Your roadmap:</p>
            <div className="space-y-3">
              {LEARNING_PATHS[selectedPath].modules.map((module, index) => (
                <div key={index} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                    {module.week || index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{module.title}</p>
                    <p className="text-xs text-gray-600 mt-1">Focus: {module.focus}</p>
                    {module.route && (
                      <Link
                        href={module.route}
                        className="mt-2 inline-flex items-center text-xs font-medium text-blue-600 hover:text-blue-800"
                      >
                        Go to module →
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Link
              href={LEARNING_PATHS[selectedPath].modules[0]?.route || '/cybersecurity/beginner'}
              className="flex-1 rounded-lg bg-blue-600 px-6 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
            >
              Start This Path
            </Link>
            <button
              onClick={() => {
                localStorage.setItem('selected_learning_path', selectedPath);
                alert('Path saved! We\'ll track your progress along this route.');
              }}
              className="rounded-lg border-2 border-blue-600 px-6 py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
            >
              Save Path
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
