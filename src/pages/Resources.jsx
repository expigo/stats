export const Resources = () => {
  return (
    <div className="fade-in">
      <h1>Learning Resources</h1>
      <p className="text-muted mb-3">Curated books, courses, papers, and tools</p>

      <section className="mt-3">
        <h2>📚 Recommended Books</h2>
        <div className="info-box example">
          <h4>Bayesian Methods</h4>
          <ul>
            <li>Gelman et al. (2020). "Bayesian Data Analysis"</li>
            <li>Murphy, Kevin (2022). "Probabilistic Machine Learning"</li>
            <li>McElreath, Richard (2020). "Statistical Rethinking"</li>
          </ul>
        </div>

        <div className="info-box definition mt-2">
          <h4>Markov Models</h4>
          <ul>
            <li>Ross, Sheldon (2014). "Introduction to Probability Models"</li>
            <li>Rabiner, Lawrence (1989). "A Tutorial on Hidden Markov Models"</li>
            <li>Hamilton, James (1994). "Time Series Analysis"</li>
          </ul>
        </div>
      </section>

      <section className="mt-3">
        <h2>🛠️ Software & Libraries</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Python - Core</h3>
            <ul>
              <li>statsmodels - Statistical modeling</li>
              <li>PyMC - Bayesian inference</li>
              <li>NumPy, SciPy, Pandas</li>
            </ul>
          </div>
          <div className="feature-card">
            <h3>Visualization</h3>
            <ul>
              <li>Plotly - Interactive plots</li>
              <li>Matplotlib, Seaborn</li>
              <li>Bokeh</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};
