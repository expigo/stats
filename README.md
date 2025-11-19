# 📊 Statistics for Machine Learning & Deep Learning

A comprehensive, rigorous statistics course designed for aspiring researchers in Machine Learning, Deep Learning, and Data Science. This interactive learning platform combines theoretical foundations with practical applications, featuring extensive visualizations, Python code examples, exercises, and quizzes.

## 🎯 Features

- **Rigorous Theory**: Deep dive into mathematical foundations with proofs and derivations
- **Interactive Visualizations**: Hundreds of interactive plots using Plotly.js to build intuition
- **Python Implementation**: Production-ready code using NumPy, SciPy, Pandas, and scikit-learn
- **ML/DL Focus**: Direct connections to modern machine learning and deep learning applications
- **Exercises & Quizzes**: Practice problems with detailed solutions and interactive quizzes
- **Curated Resources**: Links to papers, books, and courses for deeper exploration

## 📚 Course Content

### Chapter 1: Foundations of Probability Theory
- Sample spaces and events
- Axioms of probability (Kolmogorov)
- Conditional probability and independence
- Bayes' theorem
- Law of total probability
- **ML Applications**: Bayesian inference, probabilistic models

### Chapter 2: Random Variables & Distributions
- Discrete and continuous random variables
- Common distributions (Normal, Binomial, Poisson, Beta, etc.)
- Expectation, variance, and moments
- Moment generating functions
- Multivariate distributions
- **ML Applications**: Weight initialization, VAEs, Gaussian processes

### Chapter 3: Statistical Inference
- Point estimation (MLE, MoM)
- Properties of estimators (bias, consistency, efficiency)
- Confidence intervals
- Bootstrap methods
- Asymptotic theory
- **ML Applications**: Parameter estimation, model fitting

### Chapter 4: Hypothesis Testing
- Null and alternative hypotheses
- Type I and Type II errors
- Common tests (t-test, χ², ANOVA)
- p-values and significance
- Multiple testing correction
- **ML Applications**: A/B testing, model comparison

### Chapter 5: Regression Analysis
- Simple and multiple linear regression
- Ordinary least squares
- Regularization (Ridge, Lasso, Elastic Net)
- Generalized linear models
- **ML Applications**: Foundation of supervised learning

### Chapter 6: Bayesian Statistics
- Bayesian inference framework
- Prior, likelihood, and posterior
- Conjugate priors
- MCMC methods
- Bayesian model comparison
- **ML Applications**: Bayesian neural networks, probabilistic programming

### Chapter 7: Multivariate Statistics
- Multivariate normal distribution
- Principal Component Analysis (PCA)
- Factor analysis
- Canonical correlation
- **ML Applications**: Dimensionality reduction, feature extraction

### Chapter 8: Time Series Analysis
- Stationarity and autocorrelation
- ARMA and ARIMA models
- Seasonal decomposition
- Forecasting methods
- **ML Applications**: Sequential models, RNNs, LSTMs

### Chapter 9: Statistical Learning Theory
- Bias-variance tradeoff
- PAC learning framework
- VC dimension
- Information theory (Entropy, KL divergence)
- Concentration inequalities
- **ML Applications**: Model selection, generalization bounds

### Chapter 10: Experimental Design & Causal Inference
- Design of experiments
- A/B testing
- Causal inference frameworks
- Propensity score matching
- **ML Applications**: Treatment effect estimation, fairness

## 🚀 Getting Started

### Prerequisites

- Python 3.8 or higher
- Modern web browser (Chrome, Firefox, Safari, or Edge)
- Basic understanding of calculus and linear algebra

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd stats
   ```

2. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Open the website**:
   Simply open `index.html` in your web browser, or use a local server:
   ```bash
   python -m http.server 8000
   ```
   Then navigate to `http://localhost:8000`

### Running Python Examples

Navigate to the `python-examples` directory and run any example:

```bash
cd python-examples
python 01_probability_basics.py
python 02_distributions.py
```

These scripts will:
- Run comprehensive examples
- Generate visualizations in the `visualizations/` directory
- Print detailed explanations and results

## 📂 Project Structure

```
stats/
├── index.html                 # Main landing page
├── chapters/                  # Course chapters
│   ├── 01-probability-foundations.html
│   ├── 02-random-variables.html
│   └── ...
├── css/
│   └── style.css             # Styling for all pages
├── js/
│   ├── main.js               # Core JavaScript functionality
│   ├── clt-demo.js           # Central Limit Theorem demo
│   ├── probability-viz.js    # Chapter 1 visualizations
│   └── distributions-viz.js  # Chapter 2 visualizations
├── python-examples/          # Comprehensive Python examples
│   ├── 01_probability_basics.py
│   ├── 02_distributions.py
│   └── ...
├── visualizations/           # Generated plots (from Python examples)
├── exercises/                # Additional exercises
├── quizzes/                  # Interactive quizzes
├── data/                     # Sample datasets
├── requirements.txt          # Python dependencies
└── README.md                 # This file
```

## 💻 Technology Stack

### Frontend
- **HTML5/CSS3**: Modern, responsive design
- **JavaScript (ES6+)**: Interactive elements and visualizations
- **Plotly.js**: Interactive plotting library
- **MathJax**: Beautiful LaTeX rendering
- **Prism.js**: Syntax highlighting for code

### Backend/Computation
- **Python 3.8+**: Primary language for examples
- **NumPy**: Numerical computing
- **SciPy**: Scientific computing and statistics
- **Matplotlib/Seaborn**: Static visualizations
- **Pandas**: Data manipulation

## 📖 How to Use This Course

### For Self-Study

1. **Start with Chapter 1** and progress sequentially
2. **Read the theory** carefully, working through the proofs
3. **Interact with visualizations** to build intuition
4. **Run Python code examples** to see concepts in action
5. **Complete exercises** before checking solutions
6. **Take quizzes** to test understanding
7. **Explore linked resources** for deeper knowledge

### For Instructors

This material can be used as:
- **Primary course content** for a statistics course
- **Supplementary material** for ML/AI courses
- **Reference resource** for students
- **Interactive demonstrations** in lectures

Feel free to adapt and extend the content for your needs.

## 🎓 Learning Outcomes

By completing this course, you will be able to:

1. ✅ Understand and apply rigorous probability theory
2. ✅ Work confidently with common probability distributions
3. ✅ Perform statistical inference and hypothesis testing
4. ✅ Understand the theoretical foundations of machine learning
5. ✅ Implement statistical methods in Python
6. ✅ Interpret and apply statistical concepts in ML/DL research
7. ✅ Make principled decisions based on data and uncertainty

## 📚 Recommended Textbooks

- **Probability Theory**:
  - "Probability Theory: The Logic of Science" by E.T. Jaynes
  - "A First Course in Probability" by Sheldon Ross

- **Statistics**:
  - "All of Statistics" by Larry Wasserman
  - "Statistical Inference" by Casella & Berger

- **Machine Learning**:
  - "Pattern Recognition and Machine Learning" by Christopher Bishop
  - "Deep Learning" by Goodfellow, Bengio, and Courville
  - "The Elements of Statistical Learning" by Hastie, Tibshirani, and Friedman

## 🔗 Online Resources

- [MIT OpenCourseWare - Probability](https://ocw.mit.edu/6-041)
- [Seeing Theory (Brown University)](https://seeing-theory.brown.edu/)
- [Stanford CS229: Machine Learning](http://cs229.stanford.edu/)
- [Fast.ai - Practical Deep Learning](https://www.fast.ai/)

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Report bugs** or suggest improvements via issues
2. **Add new examples** or visualizations
3. **Improve explanations** or fix typos
4. **Translate content** to other languages
5. **Create additional exercises** or quizzes

Please ensure:
- Code follows PEP 8 style guidelines
- Mathematical notation is clear and consistent
- Visualizations are informative and aesthetically pleasing
- All claims are backed by theory or empirical evidence

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by excellent resources from MIT, Stanford, and Brown University
- Built with modern web technologies and Python scientific computing stack
- Special thanks to the open-source community for amazing tools

## 📧 Contact

For questions, suggestions, or collaboration opportunities, please open an issue on GitHub.

---

**Happy Learning! May the posterior be with you.** 📊🎓

## 🌟 Star History

If you find this resource helpful, please consider giving it a star! It helps others discover this project.

---

## Quick Start Checklist

- [ ] Clone the repository
- [ ] Install Python dependencies
- [ ] Open `index.html` in browser
- [ ] Read Chapter 1
- [ ] Run `python-examples/01_probability_basics.py`
- [ ] Complete exercises for Chapter 1
- [ ] Take Chapter 1 quiz
- [ ] Move to Chapter 2
- [ ] Continue through all chapters
- [ ] Apply knowledge to your ML/DL projects!
