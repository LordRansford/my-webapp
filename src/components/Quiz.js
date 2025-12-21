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

  const answeredCount = questions.reduce((acc, q) => acc + (answers[q.id] ? 1 : 0), 0);
  const correctCount = questions.reduce((acc, q) => acc + (getStatus(q) === "correct" ? 1 : 0), 0);

  return (
    <div className="panel quiz">
      <p className="eyebrow">{title}</p>
      <div className="quiz-summary" aria-live="polite">
        <span className="quiz-summary__label">Score</span>
        <span className="quiz-summary__value">
          {answeredCount === 0 ? `0/${questions.length}` : `${correctCount}/${questions.length}`}
        </span>
        <span className="quiz-summary__hint">{answeredCount === 0 ? "Answer a question to see your score." : "Updates as you answer."}</span>
      </div>
      <div className="quiz-list">
        {questions.map((question) => {
          const status = getStatus(question);
          const chosenId = answers[question.id];
          const correctOption = question.options.find((opt) => opt.correct);
          return (
            <div key={question.id} className="quiz-item">
              <p className="quiz-question">{question.prompt}</p>
              <div className="quiz-options">
                {question.options.map((opt) => (
                  <label
                    key={opt.id}
                    className={`quiz-option ${chosenId === opt.id ? "is-selected" : ""} ${
                      chosenId ? (opt.correct ? "is-correct" : chosenId === opt.id ? "is-incorrect" : "") : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name={`quiz-${question.id}`}
                      value={opt.id}
                      checked={chosenId === opt.id}
                      onChange={() => handleSelect(question.id, opt.id)}
                    />
                    <span>{opt.text}</span>
                  </label>
                ))}
              </div>
              {status && (
                <p className={`quiz-feedback ${status === "correct" ? "ok" : "warn"}`}>
                  {status === "correct" ? "Correct." : "Not quite."}{" "}
                  {question.options.find((opt) => opt.id === chosenId)?.explanation || ""}
                  {status === "incorrect" && correctOption ? (
                    <>
                      {" "}
                      <span className="quiz-feedback__answer">Correct answer: {correctOption.text}</span>
                    </>
                  ) : null}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
