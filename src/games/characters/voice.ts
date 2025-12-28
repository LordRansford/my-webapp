// Charis voice system using Web Speech API

export type VoiceLineType = "briefing" | "warning" | "encouragement" | "taunt" | "victory" | "failure" | "milestone";

export type VoiceLine = {
  type: VoiceLineType;
  text: string;
  priority: number; // Higher = more important
};

const VOICE_LINES: Record<VoiceLineType, string[]> = {
  briefing: [
    "Welcome, agent. This mission won't be easy, but I believe you can do it.",
    "Charis here. I've prepared something special for you. Don't disappoint me.",
    "Listen carefully. The obstacles are getting smarter. Stay sharp.",
    "This is your moment to prove yourself. Show me what you're made of.",
    "I've seen many agents attempt this. Most fail. Will you be different?",
  ],
  warning: [
    "Watch out! Danger ahead!",
    "Incoming! Move now!",
    "That was close. Stay focused.",
    "Don't get complacent. It gets harder.",
    "Multiple threats detected. Be careful.",
  ],
  encouragement: [
    "Good work! Keep it up!",
    "You're doing great. Stay calm.",
    "Excellent dodge! That's what I like to see.",
    "You're getting the hang of this. Don't stop now.",
    "Impressive. Charis would be proud.",
  ],
  taunt: [
    "Too slow! Can you keep up?",
    "Is that the best you can do?",
    "I expected more from you.",
    "Come on, agent. Show me something.",
    "This is too easy for you, isn't it?",
  ],
  victory: [
    "Outstanding! You've completed the mission!",
    "Well done, agent. You've earned my respect.",
    "Congratulations! Charis is impressed.",
    "Mission complete. You're ready for the next challenge.",
    "Excellent work. You've proven yourself worthy.",
  ],
  failure: [
    "Mission failed. Try again when you're ready.",
    "Not this time. Learn from your mistakes.",
    "You were close. Don't give up.",
    "Failure is part of learning. Try again.",
    "Charis says: one more attempt. You can do this.",
  ],
  milestone: [
    "Quarter way there. Keep going!",
    "Halfway point. You're doing well.",
    "Three quarters done. Almost there!",
    "Final stretch. Don't give up now!",
    "You're in the home stretch. Finish strong!",
  ],
};

export class CharisVoice {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private queue: VoiceLine[] = [];
  private isSpeaking = false;
  private voice: SpeechSynthesisVoice | null = null;

  constructor() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      this.synth = window.speechSynthesis;
      this.initializeVoice();
    }
  }

  private initializeVoice() {
    if (!this.synth) return;

    // Try to find a female voice (Charis)
    const voices = this.synth.getVoices();
    const preferredVoices = [
      "Google UK English Female",
      "Microsoft Zira - English (United States)",
      "Samantha",
      "Victoria",
      "Karen",
    ];

    for (const preferred of preferredVoices) {
      const found = voices.find((v) => v.name.includes(preferred) || v.name.toLowerCase().includes("female"));
      if (found) {
        this.voice = found;
        break;
      }
    }

    // Fallback to any available voice
    if (!this.voice && voices.length > 0) {
      this.voice = voices[0];
    }

    // If voices aren't loaded yet, wait for them
    if (voices.length === 0) {
      this.synth.onvoiceschanged = () => {
        this.initializeVoice();
      };
    }
  }

  speak(text: string, priority = 0, interrupt = false) {
    if (!this.synth || !this.voice) return;

    const line: VoiceLine = { type: "briefing", text, priority };

    if (interrupt) {
      this.stop();
      this.queue = [line];
      this.processQueue();
    } else {
      this.queue.push(line);
      this.queue.sort((a, b) => b.priority - a.priority);
      if (!this.isSpeaking) {
        this.processQueue();
      }
    }
  }

  speakLine(type: VoiceLineType, interrupt = false) {
    const lines = VOICE_LINES[type];
    if (lines.length === 0) return;

    const text = lines[Math.floor(Math.random() * lines.length)];
    this.speak(text, this.getPriority(type), interrupt);
  }

  speakCustom(type: VoiceLineType, text: string, interrupt = false) {
    this.speak(text, this.getPriority(type), interrupt);
  }

  private getPriority(type: VoiceLineType): number {
    switch (type) {
      case "briefing":
        return 10;
      case "warning":
        return 8;
      case "victory":
        return 9;
      case "failure":
        return 7;
      case "milestone":
        return 5;
      case "encouragement":
        return 4;
      case "taunt":
        return 3;
      default:
        return 0;
    }
  }

  private processQueue() {
    if (this.queue.length === 0 || !this.synth || !this.voice) {
      this.isSpeaking = false;
      return;
    }

    const line = this.queue.shift()!;
    this.isSpeaking = true;

    const utterance = new window.SpeechSynthesisUtterance(line.text);
    utterance.voice = this.voice;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 0.8;

    utterance.onend = () => {
      this.isSpeaking = false;
      this.processQueue();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      this.processQueue();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  stop() {
    if (this.synth && this.currentUtterance) {
      this.synth.cancel();
      this.currentUtterance = null;
      this.isSpeaking = false;
      this.queue = [];
    }
  }

  dispose() {
    this.stop();
    this.synth = null;
    this.voice = null;
  }
}

