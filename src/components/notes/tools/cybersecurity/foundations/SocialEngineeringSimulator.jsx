"use client";

import { use_tool_state } from "@/components/notes/hooks/use_tool_state";
import ToolStateActions from "@/components/notes/ToolStateActions";

export default function SocialEngineeringSimulator() {
  const { state, set_state, reset, copy_share_link, export_json, import_json, is_ready } = use_tool_state({
    tool_id: "social-engineering-simulator",
    initial_state: { currentScenario: 0, choices: {} },
  });

  if (!is_ready) return <p className="text-sm text-gray-600">Loading...</p>;

  const scenarios = [
    {
      id: 1,
      type: "Pretexting",
      situation: "You receive a call from someone claiming to be from IT support. They say they detected suspicious activity on your account and need your password to secure it.",
      choices: [
        { text: "Give them your password to fix the issue", safe: false, feedback: "❌ Never give passwords over the phone. IT never needs your password." },
        { text: "Hang up and call IT using the official number", safe: true, feedback: "✅ Correct! Always verify through official channels." },
        { text: "Ask them to send an email request", safe: false, feedback: "⚠️ Better than giving the password, but they could fake an email too. Always verify directly." },
      ]
    },
    {
      id: 2,
      type: "Tailgating",
      situation: "You're entering your secure office building. Someone in delivery uniform carrying packages is behind you. They ask you to hold the door as their hands are full.",
      choices: [
        { text: "Hold the door open for them", safe: false, feedback: "❌ This is tailgating. Even if polite, they should use their own badge." },
        { text: "Politely decline and ask them to badge in", safe: true, feedback: "✅ Correct! Security over politeness. They should have proper access." },
        { text: "Let them in but escort them to reception", safe: false, feedback: "⚠️ Better than just letting them in, but they still bypassed badge control." },
      ]
    },
    {
      id: 3,
      type: "Quid Pro Quo",
      situation: "You get an email offering a free $100 Amazon gift card for completing a quick 5-minute survey about your company's IT infrastructure and security practices.",
      choices: [
        { text: "Complete the survey to get the gift card", safe: false, feedback: "❌ This is information gathering. Attackers use free offers to extract valuable data." },
        { text: "Ignore and delete the email", safe: true, feedback: "✅ Correct! Free offers requesting company information are red flags." },
        { text: "Forward to colleagues so they can get gift cards too", safe: false, feedback: "❌ Definitely not! This spreads the attack and puts more people at risk." },
      ]
    },
  ];

  const currentScenario = scenarios[state.currentScenario] || scenarios[0];
  const userChoice = state.choices[currentScenario.id];

  function makeChoice(choiceIndex) {
    const choice = currentScenario.choices[choiceIndex];
    set_state({
      ...state,
      choices: {
        ...state.choices,
        [currentScenario.id]: { choiceIndex, ...choice }
      }
    });
  }

  function nextScenario() {
    if (state.currentScenario < scenarios.length - 1) {
      set_state({ ...state, currentScenario: state.currentScenario + 1 });
    }
  }

  function previousScenario() {
    if (state.currentScenario > 0) {
      set_state({ ...state, currentScenario: state.currentScenario - 1 });
    }
  }

  const safeChoices = Object.values(state.choices).filter(c => c.safe).length;
  const totalChoices = Object.keys(state.choices).length;

  return (
    <div className="space-y-4 text-sm">
      <div className="p-3 bg-slate-100 rounded-lg flex justify-between items-center">
        <div>
          <div className="font-semibold">Scenario {state.currentScenario + 1} of {scenarios.length}</div>
          <div className="text-xs text-slate-600">Type: {currentScenario.type}</div>
        </div>
        {totalChoices > 0 && (
          <div className="text-right">
            <div className="text-xs text-slate-600">Safe Choices</div>
            <div className="font-bold text-lg">{safeChoices}/{totalChoices}</div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white rounded-lg border border-slate-200">
        <div className="font-semibold mb-3">Situation:</div>
        <p className="text-sm text-slate-700">{currentScenario.situation}</p>
      </div>

      {!userChoice ? (
        <div className="space-y-2">
          <div className="font-semibold">What do you do?</div>
          {currentScenario.choices.map((choice, index) => (
            <button
              key={index}
              onClick={() => makeChoice(index)}
              className="w-full p-3 text-left bg-white border border-slate-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition"
            >
              {choice.text}
            </button>
          ))}
        </div>
      ) : (
        <div className={`p-4 rounded-lg border ${userChoice.safe ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
          <div className={`font-semibold mb-2 ${userChoice.safe ? 'text-green-900' : 'text-red-900'}`}>
            Your Choice: {userChoice.text}
          </div>
          <p className={`text-sm ${userChoice.safe ? 'text-green-800' : 'text-red-800'}`}>
            {userChoice.feedback}
          </p>
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={previousScenario}
          disabled={state.currentScenario === 0}
          className="px-4 py-2 bg-slate-200 rounded-md disabled:opacity-50"
        >
          ← Previous
        </button>
        <button
          onClick={nextScenario}
          disabled={state.currentScenario === scenarios.length - 1}
          className="px-4 py-2 bg-slate-200 rounded-md disabled:opacity-50"
        >
          Next →
        </button>
      </div>

      {safeChoices === scenarios.length && (
        <div className="p-4 bg-green-50 border border-green-300 rounded-lg">
          <div className="font-semibold text-green-900 mb-1">🎉 Perfect Score!</div>
          <p className="text-xs text-green-800">
            You made safe choices in all scenarios. Remember: verify identity, never bypass security controls, and question requests that seem unusual.
          </p>
        </div>
      )}

      <ToolStateActions
        onReset={reset}
        onCopy={copy_share_link}
        onExport={export_json}
        onImport={import_json}
      />
    </div>
  );
}
