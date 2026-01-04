import { useState } from 'react';
import SafeIcon from '@/components/content/SafeIcon';

export default function WhatsNewBanner({ onDismiss }) {
  const [isDismissed, setIsDismissed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('whats_new_dismissed') === 'true';
  });

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('whats_new_dismissed', 'true');
    if (onDismiss) onDismiss();
  };

  if (isDismissed) return null;

  const improvements = [
    {
      icon: 'book-open',
      title: 'Real-World Case Studies',
      description: 'Learn from major breaches: British Airways, Twitter, Equifax, and SolarWinds with detailed analysis',
      color: 'blue'
    },
    {
      icon: 'award',
      title: 'Achievement System',
      description: '18+ badges to earn as you progress through the course, with points and streak tracking',
      color: 'amber'
    },
    {
      icon: 'map',
      title: 'Personalized Learning Paths',
      description: '6 specialized paths for different roles: Engineer, Analyst, Manager, GRC, and more',
      color: 'green'
    }
  ];

  const colorStyles = {
    blue: 'from-blue-500 to-blue-600',
    amber: 'from-amber-500 to-amber-600',
    green: 'from-green-500 to-green-600'
  };

  return (
    <div className="relative my-6 overflow-hidden rounded-2xl border-2 border-blue-500 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6 shadow-xl">
      {/* Dismiss Button */}
      <button
        onClick={handleDismiss}
        className="absolute right-3 top-3 rounded-full bg-white/80 p-2 text-gray-600 transition hover:bg-white hover:text-gray-900"
        aria-label="Dismiss banner"
      >
        <SafeIcon name="x" size={16} color="currentColor" style={{ marginRight: 0 }} />
      </button>

      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg">
          <SafeIcon name="sparkles" size={24} color="white" style={{ marginRight: 0 }} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">What's New in the Course!</h2>
          <p className="text-sm text-gray-600">We've made significant improvements based on feedback</p>
        </div>
      </div>

      {/* Improvements Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {improvements.map((item, index) => (
          <div
            key={index}
            className="rounded-xl border border-gray-200 bg-white/90 p-4 shadow-sm backdrop-blur transition hover:shadow-md"
          >
            <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${colorStyles[item.color]} shadow-md`}>
              <SafeIcon name={item.icon} size={20} color="white" style={{ marginRight: 0 }} />
            </div>
            <h3 className="mb-2 text-base font-bold text-gray-900">{item.title}</h3>
            <p className="text-sm text-gray-700">{item.description}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-6 flex flex-col items-center justify-center gap-3 rounded-xl border border-blue-200 bg-white/80 p-4 sm:flex-row">
        <p className="text-sm font-semibold text-gray-900">
          Ready to explore the improvements?
        </p>
        <button
          onClick={handleDismiss}
          className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2 font-semibold text-white shadow-md transition hover:shadow-lg"
        >
          Let's Go! →
        </button>
      </div>

      {/* Background Decoration */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-gradient-to-br from-pink-400/20 to-purple-400/20 blur-3xl" />
    </div>
  );
}
