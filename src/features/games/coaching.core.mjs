export function coachingFromMetrics(m) {
  const insights = [];

  if ((m.overcorrectionIndex || 0) > 0.55) {
    insights.push("You change direction a lot in short bursts. That is overcorrection under pressure.");
  } else if ((m.controlScore || 0) > 72) {
    insights.push("Your control stays clean. You are not wasting movement.");
  } else {
    insights.push("Your control is workable, but it slips when hazards chain together.");
  }

  if (m.fatigueDrop != null && m.fatigueDrop > 80) {
    insights.push("Your timing stability drops late. Fatigue is pulling you into rushed inputs.");
  } else if ((m.enduranceScore || 0) < 35) {
    insights.push("Endurance is the limiter right now. Your first minute is stronger than your finish.");
  } else {
    insights.push("Your endurance is building. Keep it steady as difficulty ramps.");
  }

  if ((m.errorClustering || 0) > 0.45) insights.push("Errors are clustering. After a mistake, slow your next two decisions.");

  const headline =
    (m.overcorrectionIndex || 0) > 0.55
      ? "You react fast but you overcorrect when pressure spikes."
      : (m.controlScore || 0) > 72
        ? "Your control is strong. The next gain is anticipation."
        : "Your timing is decent, but your recovery after close calls needs work.";

  const tip =
    (m.overcorrectionIndex || 0) > 0.55
      ? "Try one input per hazard. Let the motion finish before you act again."
      : (m.errorClustering || 0) > 0.45
        ? "When you survive a close call, slow down your next two decisions."
        : "Pick one cue to watch and move early, not big.";

  return { headline, insights: insights.slice(0, 3), tip };
}


