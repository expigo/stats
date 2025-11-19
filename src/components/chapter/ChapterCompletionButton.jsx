import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';
import './ChapterCompletionButton.css';

export const ChapterCompletionButton = ({ chapterId }) => {
  const { getChapterProgress, markChapterComplete } = useProgress();
  const [showConfetti, setShowConfetti] = useState(false);
  const isCompleted = getChapterProgress(chapterId);

  const handleComplete = () => {
    if (!isCompleted) {
      markChapterComplete(chapterId);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  return (
    <div className="chapter-completion-section">
      {showConfetti && (
        <div className="confetti-container">
          <div className="confetti">🎉</div>
          <div className="confetti">🌟</div>
          <div className="confetti">✨</div>
          <div className="confetti">🎊</div>
          <div className="confetti">⭐</div>
        </div>
      )}

      <button
        onClick={handleComplete}
        className={`completion-button ${isCompleted ? 'completed' : ''}`}
        disabled={isCompleted}
      >
        <CheckCircle size={20} />
        {isCompleted ? 'Chapter Completed!' : 'Mark Chapter as Complete'}
      </button>

      {isCompleted && (
        <p className="completion-message">
          Great work! Check your progress dashboard to see your achievements.
        </p>
      )}
    </div>
  );
};
