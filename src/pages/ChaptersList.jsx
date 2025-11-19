import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const ChaptersList = () => {
  const chapters = [
    {
      number: '01',
      title: 'Foundations of Probability Theory',
      path: '/chapters/probability-foundations',
      topics: ['Sample spaces', 'Axioms', 'Conditional probability', 'Bayes\' theorem'],
    },
    {
      number: '02',
      title: 'Random Variables & Distributions',
      path: '/chapters/random-variables',
      topics: ['PMF & PDF', 'Common distributions', 'Expectation & variance', 'MGFs'],
    },
    {
      number: '03',
      title: 'Bayesian Probability',
      path: '/chapters/bayesian-probability',
      topics: ['Bayesian inference', 'MCMC', 'Variational inference', 'Applications'],
      new: true,
    },
    {
      number: '04',
      title: 'Markov Models',
      path: '/chapters/markov-models',
      topics: ['Markov chains', 'Stationary distributions', 'HMMs', 'Applications'],
      new: true,
    },
    {
      number: '05',
      title: 'Statistical Learning Theory',
      path: '/chapters/statistical-learning',
      topics: ['Bias-variance tradeoff', 'Regularization', 'Cross-validation', 'PAC learning', 'VC dimension'],
      new: true,
    },
  ];

  return (
    <div className="fade-in">
      <h1>Course Chapters</h1>
      <p className="text-muted mb-3">
        Explore comprehensive statistics topics designed for ML/DL researchers
      </p>

      <div className="chapters-grid">
        {chapters.map((chapter) => (
          <div key={chapter.number} className="chapter-card">
            {chapter.new && (
              <span
                style={{
                  background: '#10b981',
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  marginBottom: '1rem',
                  display: 'inline-block',
                }}
              >
                NEW
              </span>
            )}
            <div className="chapter-number">{chapter.number}</div>
            <h3>{chapter.title}</h3>
            <ul>
              {chapter.topics.map((topic, idx) => (
                <li key={idx}>{topic}</li>
              ))}
            </ul>
            <Link to={chapter.path} className="chapter-link">
              Explore Chapter
              <ArrowRight size={16} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
