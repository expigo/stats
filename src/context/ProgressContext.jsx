import { createContext, useContext, useState, useEffect } from 'react';

const ProgressContext = createContext();

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

export const ProgressProvider = ({ children }) => {
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem('courseProgress');
    return saved ? JSON.parse(saved) : {
      chaptersCompleted: [],
      quizzesCompleted: [],
      exercisesCompleted: [],
      lastVisited: null,
      totalTimeSpent: 0,
      achievements: [],
      startDate: new Date().toISOString(),
    };
  });

  useEffect(() => {
    localStorage.setItem('courseProgress', JSON.stringify(progress));
  }, [progress]);

  const markChapterComplete = (chapterId) => {
    setProgress((prev) => {
      if (prev.chaptersCompleted.includes(chapterId)) {
        return prev;
      }

      const newProgress = {
        ...prev,
        chaptersCompleted: [...prev.chaptersCompleted, chapterId],
      };

      // Check for achievements
      const newAchievements = [...prev.achievements];

      if (newProgress.chaptersCompleted.length === 1 && !prev.achievements.includes('first-chapter')) {
        newAchievements.push('first-chapter');
      }

      if (newProgress.chaptersCompleted.length === 3 && !prev.achievements.includes('halfway')) {
        newAchievements.push('halfway');
      }

      if (newProgress.chaptersCompleted.length === 5 && !prev.achievements.includes('completion')) {
        newAchievements.push('completion');
      }

      return {
        ...newProgress,
        achievements: newAchievements,
      };
    });
  };

  const markQuizComplete = (quizId, score) => {
    setProgress((prev) => {
      const quizRecord = { id: quizId, score, completedAt: new Date().toISOString() };
      const filtered = prev.quizzesCompleted.filter(q => q.id !== quizId);

      const newProgress = {
        ...prev,
        quizzesCompleted: [...filtered, quizRecord],
      };

      // Achievement for perfect quiz score
      const newAchievements = [...prev.achievements];
      if (score === 100 && !prev.achievements.includes('perfect-quiz')) {
        newAchievements.push('perfect-quiz');
      }

      return {
        ...newProgress,
        achievements: newAchievements,
      };
    });
  };

  const markExerciseComplete = (exerciseId) => {
    setProgress((prev) => ({
      ...prev,
      exercisesCompleted: prev.exercisesCompleted.includes(exerciseId)
        ? prev.exercisesCompleted
        : [...prev.exercisesCompleted, exerciseId],
    }));
  };

  const updateLastVisited = (chapterId) => {
    setProgress((prev) => ({
      ...prev,
      lastVisited: chapterId,
    }));
  };

  const resetProgress = () => {
    setProgress({
      chaptersCompleted: [],
      quizzesCompleted: [],
      exercisesCompleted: [],
      lastVisited: null,
      totalTimeSpent: 0,
      achievements: [],
      startDate: new Date().toISOString(),
    });
  };

  const getChapterProgress = (chapterId) => {
    return progress.chaptersCompleted.includes(chapterId);
  };

  const getOverallProgress = () => {
    const totalChapters = 5;
    return Math.round((progress.chaptersCompleted.length / totalChapters) * 100);
  };

  return (
    <ProgressContext.Provider
      value={{
        progress,
        markChapterComplete,
        markQuizComplete,
        markExerciseComplete,
        updateLastVisited,
        resetProgress,
        getChapterProgress,
        getOverallProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};
