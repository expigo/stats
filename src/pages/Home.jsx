import { Link } from 'react-router-dom';
import { BarChart3, Code, Book, Brain, Target, TrendingUp, ArrowRight, Award } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';

export const Home = () => {
  const { progress, getOverallProgress } = useProgress();
  const overallProgress = getOverallProgress();
  const features = [
    {
      icon: '📈',
      title: 'Interactive Visualizations',
      description: 'Explore concepts with dynamic, React-powered visualizations using Plotly.js',
    },
    {
      icon: '🐍',
      title: 'Python with statsmodels',
      description: 'Production-ready code using NumPy, SciPy, Pandas, and statsmodels',
    },
    {
      icon: '📚',
      title: 'Rigorous Theory',
      description: 'Deep dive into mathematical foundations with proofs and derivations',
    },
    {
      icon: '🎯',
      title: 'ML/DL Applications',
      description: 'Direct connections to modern machine learning and deep learning',
    },
    {
      icon: '🔬',
      title: 'Bayesian Methods',
      description: 'Comprehensive coverage of Bayesian probability and inference',
    },
    {
      icon: '🔄',
      title: 'Markov Models',
      description: 'Hidden Markov Models, Markov Chains, and applications',
    },
  ];

  const highlightedChapters = [
    {
      number: '03',
      title: 'Bayesian Probability',
      description: 'Comprehensive treatment of Bayesian inference, MCMC, and applications',
      path: '/chapters/bayesian-probability',
      topics: [
        'Bayesian inference framework',
        'Conjugate priors and posterior computation',
        'Markov Chain Monte Carlo (MCMC)',
        'Variational inference',
        'Bayesian model selection',
      ],
      new: true,
    },
    {
      number: '04',
      title: 'Markov Models',
      description: 'From Markov chains to Hidden Markov Models with real applications',
      path: '/chapters/markov-models',
      topics: [
        'Discrete-time Markov chains',
        'Stationary distributions',
        'Hidden Markov Models (HMM)',
        'Forward-Backward algorithm',
        'Viterbi algorithm and applications',
      ],
      new: true,
    },
  ];

  return (
    <div className="fade-in">
      <div className="hero">
        <h1>Master Statistics for Machine Learning & Deep Learning</h1>
        <p>
          A comprehensive, interactive course with rigorous theory, extensive visualizations, and
          practical Python implementations using statsmodels and modern ML libraries
        </p>
        <Link to="/chapters" className="cta-button">
          <Book size={20} />
          Start Learning
        </Link>
      </div>

      {/* Progress Widget */}
      {overallProgress > 0 && (
        <section style={{ marginTop: '2rem' }}>
          <div className="info-box example" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>Your Learning Journey</h4>
                <p style={{ margin: 0, fontSize: '1.1rem' }}>
                  {progress.chaptersCompleted.length} of 5 chapters completed
                  {progress.achievements.length > 0 && ` • ${progress.achievements.length} achievement${progress.achievements.length > 1 ? 's' : ''} unlocked`}
                </p>
              </div>
              <Link
                to="/progress"
                className="cta-button"
                style={{ background: 'white', color: '#764ba2', border: 'none' }}
              >
                <Award size={20} />
                View Progress
              </Link>
            </div>
            <div style={{ marginTop: '1rem', background: 'rgba(255,255,255,0.2)', borderRadius: '8px', height: '12px', overflow: 'hidden' }}>
              <div style={{
                width: `${overallProgress}%`,
                height: '100%',
                background: 'white',
                transition: 'width 0.5s ease',
                borderRadius: '8px'
              }}></div>
            </div>
          </div>
        </section>
      )}

      <section>
        <h2 className="text-center">Why This Course?</h2>
        <div className="features-grid">
          {features.map((feature, idx) => (
            <div key={idx} className="feature-card">
              <span className="feature-icon">{feature.icon}</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-3">
        <h2 className="text-center">Featured Chapters</h2>
        <p className="text-center text-muted mb-2">
          New comprehensive chapters on Bayesian methods and Markov models
        </p>
        <div className="chapters-grid">
          {highlightedChapters.map((chapter) => (
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
              <p className="text-muted">{chapter.description}</p>
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
      </section>

      <section className="mt-3">
        <div className="info-box example">
          <h4>Built with Modern Tools</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            <div>
              <strong>Frontend:</strong>
              <ul style={{ marginTop: '0.5rem' }}>
                <li>⚛️ React 18</li>
                <li>📊 Plotly.js</li>
                <li>🎨 Modern CSS</li>
              </ul>
            </div>
            <div>
              <strong>Python:</strong>
              <ul style={{ marginTop: '0.5rem' }}>
                <li>📦 uv package manager</li>
                <li>📈 statsmodels</li>
                <li>🔢 NumPy, SciPy, Pandas</li>
              </ul>
            </div>
            <div>
              <strong>Topics:</strong>
              <ul style={{ marginTop: '0.5rem' }}>
                <li>🎲 Bayesian inference</li>
                <li>🔄 Markov models</li>
                <li>🧠 ML applications</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-3 text-center">
        <h2>Ready to Begin?</h2>
        <p className="text-muted mb-2">
          Start your journey into the statistical foundations of machine learning
        </p>
        <Link to="/chapters" className="cta-button">
          <Book size={20} />
          View All Chapters
        </Link>
      </section>
    </div>
  );
};
