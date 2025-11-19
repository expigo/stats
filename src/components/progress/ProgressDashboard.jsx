import { useProgress } from '../../context/ProgressContext';
import { Award, BookOpen, CheckCircle, Target, Trophy, Zap } from 'lucide-react';
import './ProgressDashboard.css';

export const ProgressDashboard = () => {
  const { progress, getOverallProgress } = useProgress();

  const achievements = [
    {
      id: 'first-chapter',
      title: 'First Steps',
      description: 'Complete your first chapter',
      icon: BookOpen,
      color: '#3b82f6',
    },
    {
      id: 'halfway',
      title: 'Halfway There',
      description: 'Complete 3 chapters',
      icon: Target,
      color: '#f59e0b',
    },
    {
      id: 'completion',
      title: 'Course Master',
      description: 'Complete all 5 chapters',
      icon: Trophy,
      color: '#10b981',
    },
    {
      id: 'perfect-quiz',
      title: 'Perfect Score',
      description: 'Score 100% on a quiz',
      icon: Zap,
      color: '#8b5cf6',
    },
  ];

  const overallProgress = getOverallProgress();

  return (
    <div className="progress-dashboard">
      <h2 className="dashboard-title">
        <Award size={28} />
        Your Learning Progress
      </h2>

      {/* Overall Progress */}
      <div className="progress-section">
        <h3>Overall Completion</h3>
        <div className="progress-bar-container">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${overallProgress}%` }}
            >
              <span className="progress-text">{overallProgress}%</span>
            </div>
          </div>
        </div>
        <div className="progress-stats">
          <div className="stat-item">
            <BookOpen size={20} />
            <span>{progress.chaptersCompleted.length}/5 Chapters</span>
          </div>
          <div className="stat-item">
            <CheckCircle size={20} />
            <span>{progress.quizzesCompleted.length} Quizzes</span>
          </div>
          <div className="stat-item">
            <Target size={20} />
            <span>{progress.exercisesCompleted.length} Exercises</span>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="achievements-section">
        <h3>Achievements</h3>
        <div className="achievements-grid">
          {achievements.map((achievement) => {
            const Icon = achievement.icon;
            const unlocked = progress.achievements.includes(achievement.id);

            return (
              <div
                key={achievement.id}
                className={`achievement-card ${unlocked ? 'unlocked' : 'locked'}`}
              >
                <div
                  className="achievement-icon"
                  style={{ backgroundColor: unlocked ? achievement.color : '#cbd5e1' }}
                >
                  <Icon size={24} color="white" />
                </div>
                <div className="achievement-info">
                  <h4>{achievement.title}</h4>
                  <p>{achievement.description}</p>
                </div>
                {unlocked && <CheckCircle className="unlock-badge" size={20} />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Chapter Progress */}
      <div className="chapters-progress-section">
        <h3>Chapter Progress</h3>
        <div className="chapters-list">
          {[
            { id: 'probability-foundations', name: 'Foundations of Probability Theory' },
            { id: 'random-variables', name: 'Random Variables & Distributions' },
            { id: 'bayesian-probability', name: 'Bayesian Probability' },
            { id: 'markov-models', name: 'Markov Models' },
            { id: 'statistical-learning', name: 'Statistical Learning Theory' },
          ].map((chapter) => (
            <div key={chapter.id} className="chapter-progress-item">
              <span className="chapter-name">{chapter.name}</span>
              {progress.chaptersCompleted.includes(chapter.id) ? (
                <CheckCircle size={20} className="completed-icon" />
              ) : (
                <div className="incomplete-circle"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quiz Scores */}
      {progress.quizzesCompleted.length > 0 && (
        <div className="quiz-scores-section">
          <h3>Recent Quiz Scores</h3>
          <div className="quiz-scores-list">
            {progress.quizzesCompleted
              .slice(-5)
              .reverse()
              .map((quiz, idx) => (
                <div key={idx} className="quiz-score-item">
                  <span className="quiz-name">Quiz {quiz.id}</span>
                  <span
                    className="quiz-score"
                    style={{
                      color: quiz.score >= 80 ? '#10b981' : quiz.score >= 60 ? '#f59e0b' : '#ef4444'
                    }}
                  >
                    {quiz.score}%
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Motivational Message */}
      <div className="motivation-box">
        {overallProgress === 0 && (
          <p>🚀 Start your journey to mastering statistics for ML/DL!</p>
        )}
        {overallProgress > 0 && overallProgress < 50 && (
          <p>📚 Great start! Keep going to unlock more achievements!</p>
        )}
        {overallProgress >= 50 && overallProgress < 100 && (
          <p>🔥 You're making excellent progress! Almost there!</p>
        )}
        {overallProgress === 100 && (
          <p>🎉 Congratulations! You've completed the entire course!</p>
        )}
      </div>
    </div>
  );
};
