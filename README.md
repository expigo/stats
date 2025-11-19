# 📊 Statistics for Machine Learning & Deep Learning - React Edition

> **A comprehensive, interactive statistics course built with React, featuring rigorous theory, extensive visualizations, and practical Python implementations using statsmodels.**

## 🎯 What's New in React Edition

This modernized version brings significant improvements:

- **⚛️ React 18** - Modern, component-based UI for better interactivity
- **📈 statsmodels Integration** - Extensive use of statsmodels for statistical analysis
- **🔄 Comprehensive Bayesian Chapter** - Complete treatment of Bayesian inference, MCMC, and applications
- **🎲 Markov Models Chapter** - From Markov chains to Hidden Markov Models with real applications
- **📦 uv Package Manager** - Modern, fast Python package management
- **🎨 Interactive Visualizations** - React-powered visualizations with Plotly.js

## 🚀 Quick Start

### Frontend (React App)

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Visit `http://localhost:5173` to see the application.

### Python Examples

```bash
# Install uv (if not already installed)
curl -LsSf https://astral.sh/uv/install.sh | sh

# Sync Python dependencies
uv sync

# Run Bayesian examples
uv run python python_examples/bayesian/bayesian_inference_statsmodels.py

# Run Markov models examples
uv run python python_examples/markov_models/markov_chains_hmm_statsmodels.py
```

## 📚 Course Content

### ✅ Chapter 1: Foundations of Probability Theory
- Sample spaces and σ-algebras
- Kolmogorov's axioms
- Conditional probability & Bayes' theorem
- **Interactive**: Venn diagrams, Bayesian update simulator, CLT demo

### ✅ Chapter 2: Random Variables & Distributions
- Discrete & continuous distributions
- Moment generating functions
- Multivariate distributions
- **Interactive**: Distribution explorers with parameter sliders

### 🆕 Chapter 3: Bayesian Probability *(NEW!)*
- **Comprehensive Bayesian inference framework**
- **Conjugate priors** (Beta-Binomial, Normal-Normal, etc.)
- **MCMC methods** (Metropolis-Hastings, Gibbs sampling)
- **Variational inference** (ELBO, connection to VAEs)
- **Hierarchical models** (partial pooling)
- **Model comparison** (Bayes factors, WAIC)
- **Applications**: Bayesian neural networks, Gaussian processes
- **Python**: Full implementation with statsmodels and PyMC

### 🆕 Chapter 4: Markov Models *(NEW!)*
- **Discrete-time Markov chains**
- **Stationary distributions** (eigenvector computation)
- **Hidden Markov Models (HMM)**
  - Forward algorithm
  - Viterbi algorithm
  - Baum-Welch (EM for HMMs)
- **Markov Switching Models** with statsmodels
- **Applications**: Finance (regime switching), NLP, sequence modeling
- **Python**: Complete implementations with statsmodels, hmmlearn

## 🔬 Why This Course?

### For ML/DL Researchers

Every concept connects directly to modern machine learning:

- **Bayesian Methods** → Bayesian neural networks, uncertainty quantification, VAEs
- **Markov Models** → RNNs, LSTMs, reinforcement learning (MDPs)
- **statsmodels** → Production-ready statistical modeling
- **Rigorous Theory** → Understanding why algorithms work

### Key Features

| Feature | Description |
|---------|-------------|
| 📊 Interactive Viz | React + Plotly.js for dynamic, responsive visualizations |
| 🐍 Production Code | NumPy, SciPy, Pandas, **statsmodels**, PyMC |
| 📈 Real Applications | Finance, NLP, time series, causal inference |
| 🎓 Rigorous Theory | Proofs, derivations, and mathematical foundations |
| ✏️ Exercises | Practice problems with detailed solutions |
| 🔗 Curated Resources | Papers, books, and courses for deeper learning |

## 💻 Tech Stack

### Frontend
- **React 18** - Component-based UI
- **Vite** - Lightning-fast build tool
- **Plotly.js** - Interactive plotting
- **KaTeX** - Beautiful math rendering
- **React Router** - Client-side routing
- **Lucide React** - Modern icons

### Python
- **uv** - Modern Python package manager (10-100x faster than pip!)
- **statsmodels** - Statistical modeling and hypothesis testing
- **PyMC** - Probabilistic programming for Bayesian inference
- **arviz** - Bayesian inference diagnostics
- **hmmlearn** - Hidden Markov Models
- **networkx** - Graph analysis for Markov chains
- **NumPy, SciPy, Pandas** - Scientific computing stack

## 📂 Project Structure

```
stats/
├── src/                          # React frontend
│   ├── components/
│   │   ├── layout/              # Navigation, layout
│   │   ├── visualizations/      # Plotly visualizations
│   │   └── common/              # Reusable components
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── chapters/
│   │   │   ├── BayesianProbability.jsx  # NEW!
│   │   │   ├── MarkovModels.jsx         # NEW!
│   │   │   └── ...
│   │   └── ...
│   └── styles/
│
├── python_examples/             # Python implementations
│   ├── bayesian/
│   │   └── bayesian_inference_statsmodels.py  # NEW!
│   ├── markov_models/
│   │   └── markov_chains_hmm_statsmodels.py   # NEW!
│   └── utils/
│
├── pyproject.toml              # Python dependencies (uv)
├── package.json                # Node dependencies
├── vite.config.js              # Vite configuration
└── README.md                   # This file
```

## 🎓 Learning Path

### Beginner Track
1. Chapter 1: Probability Foundations
2. Chapter 2: Random Variables & Distributions

### Intermediate Track (ML Focus)
3. **Chapter 3: Bayesian Probability** ⭐ NEW!
4. **Chapter 4: Markov Models** ⭐ NEW!

### Advanced Track (Research)
5. Statistical Learning Theory
6. Experimental Design & Causal Inference

## 📝 Python Examples

### Bayesian Inference

```python
from bayesian import BayesianLinearRegression

# Fit Bayesian linear regression
blr = BayesianLinearRegression(noise_precision=4.0)
blr.fit(X, y)

# Make predictions with uncertainty
y_pred, y_std = blr.predict(X_test, return_std=True)

# Sample from posterior
posterior_samples = blr.sample_parameters(n_samples=1000)
```

### Markov Chains

```python
from markov_models import MarkovChain

# Define transition matrix
P = np.array([[0.7, 0.3], [0.4, 0.6]])
mc = MarkovChain(P, state_names=["Sunny", "Rainy"])

# Compute stationary distribution
pi = mc.stationary_distribution()

# Simulate paths
path = mc.simulate(n_steps=100)

# Mean first passage time
mfpt = mc.mean_first_passage_time(start=0, end=1)
```

### Markov Switching Models

```python
from statsmodels.tsa.regime_switching import MarkovRegression

# Fit regime-switching model
mod = MarkovRegression(data, k_regimes=2, trend='c')
res = mod.fit()

# Get smoothed regime probabilities
smoothed_probs = res.smoothed_marginal_probabilities
```

## 🔧 Development

### Run Tests

```bash
# Python tests
uv run pytest

# Type checking
uv run mypy python_examples/

# Linting
uv run ruff check python_examples/
```

### Code Formatting

```bash
# Format Python code
uv run black python_examples/

# Format React code
npm run lint
```

## 📊 Visualizations

All Python examples generate publication-quality visualizations:

- `visualizations/bayesian_linear_regression.png`
- `visualizations/bayesian_model_comparison.png`
- `visualizations/hierarchical_bayesian_model.png`
- `visualizations/markov_chain_analysis.png`
- `visualizations/hidden_markov_model.png`
- `visualizations/markov_switching_regression.png`
- `visualizations/financial_regime_switching.png`

## 📚 Recommended Reading

### Bayesian Methods
- Gelman et al. (2020). "Bayesian Data Analysis" (3rd ed.)
- Murphy, Kevin (2022). "Probabilistic Machine Learning: Advanced Topics"
- McElreath, Richard (2020). "Statistical Rethinking"

### Markov Models
- Ross, Sheldon (2014). "Introduction to Probability Models"
- Rabiner, Lawrence (1989). "A Tutorial on Hidden Markov Models"
- Hamilton, James (1994). "Time Series Analysis" (Markov switching models)

### Machine Learning
- Bishop, Christopher (2006). "Pattern Recognition and Machine Learning"
- Goodfellow et al. (2016). "Deep Learning"
- Hastie et al. (2009). "The Elements of Statistical Learning"

## 🤝 Contributing

Contributions are welcome! Areas where you can help:

- 🎨 Additional interactive visualizations
- 📝 More exercises and solutions
- 🐛 Bug fixes and improvements
- 📚 Additional chapters
- 🌐 Translations

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- Built with modern web and data science technologies
- Inspired by excellent courses from MIT, Stanford, and Brown University
- Special thanks to the statsmodels, PyMC, and React communities

## 🌟 Star History

If this resource helps your learning journey, please give it a star!

---

**Made with ⚛️ React and 🐍 Python (uv) for aspiring ML/DL researchers**

## 📧 Support

For questions or issues, please open a GitHub issue.

---

## Quick Reference Card

```bash
# Frontend
npm install          # Install deps
npm run dev          # Development server
npm run build        # Production build

# Python
uv sync              # Install/sync deps
uv run python <file> # Run Python script
uv add <package>     # Add new dependency

# Examples
uv run python python_examples/bayesian/bayesian_inference_statsmodels.py
uv run python python_examples/markov_models/markov_chains_hmm_statsmodels.py
```

Happy learning! 📊🎓
