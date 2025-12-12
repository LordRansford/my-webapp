import { useState } from "react";

export default function Quiz({ title = "Quiz", questions = [] }) {
  const [answers, setAnswers] = useState({});

  const handleSelect = (qId, optionId) => {
    setAnswers((prev) => ({ ...prev, [qId]: optionId }));
  };

  const getStatus = (question) => {
    const chosen = answers[question.id];
    if (!chosen) return null;
    const option = question.options.find((opt) => opt.id === chosen);
    return option?.correct ? "correct" : "incorrect";
  };

  return (
    <div className="panel quiz">
      <p className="eyebrow">{title}</p>
      <div className="quiz-list">
        {questions.map((question) => {
          const status = getStatus(question);
          return (
            <div key={question.id} className="quiz-item">
              <p className="quiz-question">{question.prompt}</p>
              <div className="quiz-options">
                {question.options.map((opt) => (
                  <label key={opt.id} className={`quiz-option ${answers[question.id] === opt.id ? "is-selected" : ""}`}>
                    <input
                      type="radio"
                      name={`quiz-${question.id}`}
                      value={opt.id}
                      checked={answers[question.id] === opt.id}
                      onChange={() => handleSelect(question.id, opt.id)}
                    />
                    <span>{opt.text}</span>
                  </label>
                ))}
              </div>
              {status && (
                <p className={`quiz-feedback ${status === "correct" ? "ok" : "warn"}`}>
                  {status === "correct" ? "Correct." : "Not quite."}{" "}
                  {question.options.find((opt) => opt.id === answers[question.id])?.explanation || ""}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
