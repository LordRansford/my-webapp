"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Shield, 
  Gamepad2, 
  Lock,
  Eye,
  Heart,
  Sparkles
} from "lucide-react";
import SecureErrorBoundary from "@/components/studios/SecureErrorBoundary";
import LoadingSpinner from "@/components/ai-studio/LoadingSpinner";
import { getAudienceProfile } from "@/lib/studios/audiences";

const games = [
  {
    id: "security-superhero",
    name: "Security Superhero",
    description: "Become a security superhero and protect the digital world!",
    icon: <Shield className="w-8 h-8" />,
    color: "red",
    href: "/cyber-studio/children/security-superhero"
  },
  {
    id: "password-strength",
    name: "Password Strength Game",
    description: "Learn to create strong passwords",
    icon: <Lock className="w-8 h-8" />,
    color: "blue",
    href: "/cyber-studio/children/password-game"
  },
  {
    id: "privacy-protector",
    name: "Privacy Protector",
    description: "Learn about keeping your information safe",
    icon: <Eye className="w-8 h-8" />,
    color: "purple",
    href: "/cyber-studio/children/privacy-protector"
  },
  {
    id: "safe-internet",
    name: "Safe Internet Explorer",
    description: "Learn safe browsing practices",
    icon: <Sparkles className="w-8 h-8" />,
    color: "green",
    href: "/cyber-studio/children/safe-internet"
  }
];

export default function CyberStudioChildrenModePage() {
  const [isLoading, setIsLoading] = useState(false);
  const profile = getAudienceProfile("child");

  return (
    <SecureErrorBoundary studio="cyber-studio">
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50/30 to-rose-50">
        {isLoading ? (
          <LoadingSpinner message="Loading..." />
        ) : (
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Header */}
            <header className="mb-8 text-center">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 shadow-lg">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-slate-900">Cyber Studio for Kids</h1>
                  <p className="text-lg text-slate-600 mt-2">
                    Learn about online safety in a fun way!
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                <Shield className="w-4 h-4 text-green-600" />
                <span>Safe and secure</span>
                <span className="text-slate-300">•</span>
                <Heart className="w-4 h-4 text-pink-600" />
                <span>Made for kids</span>
              </div>
            </header>

            {/* Games Section */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">Security Games</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {games.map((game) => {
                  const colorClasses = {
                    red: "from-red-500 to-red-600",
                    blue: "from-blue-500 to-blue-600",
                    purple: "from-purple-500 to-purple-600",
                    green: "from-green-500 to-green-600"
                  };

                  return (
                    <Link
                      key={game.id}
                      href={game.href}
                      className="group rounded-3xl bg-white border-2 border-slate-200 p-8 shadow-lg hover:shadow-xl transition-all hover:scale-105"
                    >
                      <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${colorClasses[game.color as keyof typeof colorClasses]} text-white mb-6 group-hover:scale-110 transition-transform`}>
                        {game.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-3">{game.name}</h3>
                      <p className="text-base text-slate-600 mb-4">{game.description}</p>
                      <div className="flex items-center gap-2 text-red-600 font-semibold">
                        <span>Play Now</span>
                        <Gamepad2 className="w-5 h-5" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>

            {/* Safety Notice */}
            <section className="rounded-3xl bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 p-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Shield className="w-8 h-8 text-green-600" />
                <h3 className="text-2xl font-bold text-slate-900">Safe Learning Environment</h3>
              </div>
              <p className="text-base text-slate-700 max-w-2xl mx-auto">
                Learn about online safety in a fun and safe way! No real passwords, no real websites, 
                just fun games that teach you how to stay safe online.
              </p>
            </section>

            {/* Back to Regular Studio */}
            <section className="mt-8 text-center">
              <Link
                href="/cyber-studio"
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-semibold"
              >
                Go to Regular Studio
              </Link>
            </section>
          </div>
        )}
      </div>
    </SecureErrorBoundary>
  );
}


