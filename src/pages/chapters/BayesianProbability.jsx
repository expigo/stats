import { useState } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { BayesianUpdateViz } from '../../components/visualizations/BayesianUpdateViz';
import { MCMCVisualization } from '../../components/visualizations/MCMCVisualization';
import { PriorPosteriorViz } from '../../components/visualizations/PriorPosteriorViz';
import { Code } from 'lucide-react';
import { ChapterCompletionButton } from '../../components/chapter/ChapterCompletionButton';

export const BayesianProbability = () => {
  const [showSolution1, setShowSolution1] = useState(false);
  const [showSolution2, setShowSolution2] = useState(false);

  return (
    <div className="chapter-content fade-in">
      <div className="hero" style={{ marginBottom: '2rem' }}>
        <h1>Chapter: Bayesian Probability & Inference</h1>
        <p>A comprehensive treatment of Bayesian methods for machine learning</p>
      </div>

      <section>
        <h2>1. Introduction to Bayesian Inference</h2>
        <p>
          Bayesian statistics provides a principled framework for updating beliefs in light of new
          evidence. Unlike frequentist statistics, which treats parameters as fixed unknown values,
          Bayesian statistics treats parameters as random variables with probability distributions.
        </p>

        <div className="info-box definition">
          <h4>Why Bayesian Methods for ML/DL?</h4>
          <ul>
            <li>
              <strong>Uncertainty Quantification:</strong> Bayesian neural networks provide
              uncertainty estimates for predictions
            </li>
            <li>
              <strong>Regularization:</strong> Priors act as regularizers (e.g., L2 = Gaussian
              prior)
            </li>
            <li>
              <strong>Transfer Learning:</strong> Use posterior from one task as prior for another
            </li>
            <li>
              <strong>Model Selection:</strong> Bayesian model comparison via evidence
            </li>
            <li>
              <strong>Online Learning:</strong> Natural sequential updating framework
            </li>
          </ul>
        </div>
      </section>

      <section className="mt-3">
        <h2>2. Bayes' Theorem: The Foundation</h2>
        <div className="info-box theorem">
          <h4>Bayes' Theorem</h4>
          <p>For parameters θ and data D:</p>
          <BlockMath>{`P(\\theta | D) = \\frac{P(D | \\theta) \\cdot P(\\theta)}{P(D)}`}</BlockMath>
          <p>Where:</p>
          <ul>
            <li>
              <InlineMath>{'P(\\theta | D)'}</InlineMath> is the <strong>posterior</strong> (what
              we want)
            </li>
            <li>
              <InlineMath>{'P(D | \\theta)'}</InlineMath> is the <strong>likelihood</strong>{' '}
              (probability of data given parameters)
            </li>
            <li>
              <InlineMath>{'P(\\theta)'}</InlineMath> is the <strong>prior</strong> (our beliefs
              before seeing data)
            </li>
            <li>
              <InlineMath>{'P(D)'}</InlineMath> is the <strong>evidence</strong> or{' '}
              <strong>marginal likelihood</strong>
            </li>
          </ul>
        </div>

        <div className="info-box example">
          <h4>Computing the Evidence</h4>
          <p>The evidence is computed by marginalization:</p>
          <BlockMath>{`P(D) = \\int P(D | \\theta) P(\\theta) \\, d\\theta`}</BlockMath>
          <p>
            This integral is often intractable, which is why we need advanced inference methods like
            MCMC!
          </p>
        </div>
      </section>

      <section className="mt-3">
        <h2>3. Interactive Bayesian Update</h2>
        <p>
          Explore how the posterior changes as we observe more data. This demonstrates the Bayesian
          learning process in action.
        </p>
        <BayesianUpdateViz />
      </section>

      <section className="mt-3">
        <h2>4. Conjugate Priors</h2>
        <p>
          A prior distribution is <strong>conjugate</strong> to a likelihood if the posterior is in
          the same family as the prior. This allows for analytical posterior computation.
        </p>

        <div className="info-box definition">
          <h4>Common Conjugate Pairs</h4>
          <table
            style={{
              width: '100%',
              marginTop: '1rem',
              borderCollapse: 'collapse',
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: '2px solid #2563eb',
                  textAlign: 'left',
                }}
              >
                <th style={{ padding: '0.5rem' }}>Likelihood</th>
                <th style={{ padding: '0.5rem' }}>Conjugate Prior</th>
                <th style={{ padding: '0.5rem' }}>Posterior</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '0.5rem' }}>
                  Bernoulli(<InlineMath>{'\\theta'}</InlineMath>)
                </td>
                <td style={{ padding: '0.5rem' }}>
                  Beta(<InlineMath>{'\\alpha, \\beta'}</InlineMath>)
                </td>
                <td style={{ padding: '0.5rem' }}>
                  Beta(<InlineMath>{'\\alpha + k, \\beta + n - k'}</InlineMath>)
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '0.5rem' }}>
                  Normal(<InlineMath>{'\\mu, \\sigma^2'}</InlineMath>)
                </td>
                <td style={{ padding: '0.5rem' }}>
                  Normal(<InlineMath>{'\\mu_0, \\sigma_0^2'}</InlineMath>)
                </td>
                <td style={{ padding: '0.5rem' }}>Normal (closed form)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '0.5rem' }}>
                  Poisson(<InlineMath>{'\\lambda'}</InlineMath>)
                </td>
                <td style={{ padding: '0.5rem' }}>
                  Gamma(<InlineMath>{'\\alpha, \\beta'}</InlineMath>)
                </td>
                <td style={{ padding: '0.5rem' }}>
                  Gamma(<InlineMath>{'\\alpha + \\sum x_i, \\beta + n'}</InlineMath>)
                </td>
              </tr>
              <tr>
                <td style={{ padding: '0.5rem' }}>
                  Multinomial(<InlineMath>{'\\theta_1, ..., \\theta_K'}</InlineMath>)
                </td>
                <td style={{ padding: '0.5rem' }}>
                  Dirichlet(<InlineMath>{'\\alpha_1, ..., \\alpha_K'}</InlineMath>)
                </td>
                <td style={{ padding: '0.5rem' }}>
                  Dirichlet(<InlineMath>{'\\alpha_i + n_i'}</InlineMath>)
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-2">
          <PriorPosteriorViz />
        </div>
      </section>

      <section className="mt-3">
        <h2>5. Markov Chain Monte Carlo (MCMC)</h2>
        <p>
          When the posterior is intractable (most real-world cases), we use MCMC to draw samples
          from the posterior distribution.
        </p>

        <div className="info-box theorem">
          <h4>Metropolis-Hastings Algorithm</h4>
          <p>The Metropolis-Hastings algorithm generates samples from a target distribution:</p>
          <ol style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
            <li>
              Initialize <InlineMath>{'\\theta^{(0)}'}</InlineMath>
            </li>
            <li>
              For t = 0, 1, 2, ...:
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                <li>
                  Propose new state: <InlineMath>{'\\theta^* \\sim q(\\cdot | \\theta^{(t)})'}</InlineMath>
                </li>
                <li>
                  Compute acceptance ratio:
                  <BlockMath>{`\\alpha = \\min\\left(1, \\frac{P(\\theta^*|D)}{P(\\theta^{(t)}|D)} \\cdot \\frac{q(\\theta^{(t)}|\\theta^*)}{q(\\theta^*|\\theta^{(t)})}\\right)`}</BlockMath>
                </li>
                <li>
                  Accept with probability α: <InlineMath>{'\\theta^{(t+1)} = \\theta^*'}</InlineMath>, else{' '}
                  <InlineMath>{'\\theta^{(t+1)} = \\theta^{(t)}'}</InlineMath>
                </li>
              </ul>
            </li>
          </ol>
        </div>

        <div className="mt-2">
          <MCMCVisualization />
        </div>
      </section>

      <section className="mt-3">
        <h2>6. Variational Inference</h2>
        <p>
          An alternative to MCMC that frames inference as an optimization problem. This is the
          foundation of Variational Autoencoders (VAEs)!
        </p>

        <div className="info-box definition">
          <h4>Evidence Lower Bound (ELBO)</h4>
          <p>Instead of sampling, optimize a simpler distribution q(θ) to approximate p(θ|D):</p>
          <BlockMath>{`\\mathcal{L}(q) = \\mathbb{E}_{q(\\theta)}[\\log P(D|\\theta)] - D_{KL}(q(\\theta) || P(\\theta))`}</BlockMath>
          <p>Where:</p>
          <ul>
            <li>First term: Expected log-likelihood (reconstruction term in VAEs)</li>
            <li>Second term: KL divergence between approximate and prior (regularization)</li>
          </ul>
          <p className="mt-1">
            <strong>Connection to ML:</strong> This is exactly the VAE loss function!
          </p>
        </div>
      </section>

      <section className="mt-3">
        <h2>7. Bayesian Model Selection</h2>
        <p>Compare models using the Bayes factor:</p>

        <div className="info-box theorem">
          <h4>Bayes Factor</h4>
          <BlockMath>{`BF_{12} = \\frac{P(D|M_1)}{P(D|M_2)} = \\frac{\\int P(D|\\theta_1, M_1)P(\\theta_1|M_1)d\\theta_1}{\\int P(D|\\theta_2, M_2)P(\\theta_2|M_2)d\\theta_2}`}</BlockMath>
          <p>
            <strong>Interpretation:</strong> BF &gt; 10 provides strong evidence for M₁ over M₂
          </p>
        </div>
      </section>

      <section className="mt-3">
        <h2>8. Python Implementation with statsmodels</h2>
        <div className="info-box example">
          <div className="code-header">
            <Code size={18} />
            <span>Python: Bayesian Linear Regression with statsmodels</span>
          </div>
          <pre className="code-block">
            {`import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats
import statsmodels.api as sm
from statsmodels.regression.linear_model import BayesianRidge
import pymc as pm
import arviz as az

# Generate synthetic data
np.random.seed(42)
n = 100
X = np.random.randn(n, 3)
true_beta = np.array([2.5, -1.3, 0.8])
y = X @ true_beta + np.random.randn(n) * 0.5

# 1. Bayesian Linear Regression with conjugate prior
# Using Normal-Inverse-Gamma conjugacy
def bayesian_linear_regression(X, y, prior_mean=None, prior_cov=None):
    """
    Bayesian linear regression with conjugate Normal prior.
    """
    n, p = X.shape

    # Default prior: weakly informative
    if prior_mean is None:
        prior_mean = np.zeros(p)
    if prior_cov is None:
        prior_cov = np.eye(p) * 100  # Large variance = weak prior

    # Compute posterior (closed form with conjugate prior)
    prior_precision = np.linalg.inv(prior_cov)
    posterior_precision = prior_precision + X.T @ X
    posterior_cov = np.linalg.inv(posterior_precision)
    posterior_mean = posterior_cov @ (prior_precision @ prior_mean + X.T @ y)

    return posterior_mean, posterior_cov

# Compute posterior
posterior_mean, posterior_cov = bayesian_linear_regression(X, y)
posterior_std = np.sqrt(np.diag(posterior_cov))

print("Bayesian Posterior Estimates:")
print(f"Mean: {posterior_mean}")
print(f"Std:  {posterior_std}")
print(f"95% Credible Intervals:")
for i in range(len(posterior_mean)):
    ci_lower = posterior_mean[i] - 1.96 * posterior_std[i]
    ci_upper = posterior_mean[i] + 1.96 * posterior_std[i]
    print(f"  β{i}: [{ci_lower:.3f}, {ci_upper:.3f}]")


# 2. Using PyMC for more complex models
with pm.Model() as model:
    # Priors
    beta = pm.Normal('beta', mu=0, sigma=10, shape=3)
    sigma = pm.HalfNormal('sigma', sigma=1)

    # Likelihood
    mu = pm.math.dot(X, beta)
    y_obs = pm.Normal('y_obs', mu=mu, sigma=sigma, observed=y)

    # Inference
    trace = pm.sample(2000, tune=1000, return_inferencedata=True)

# Analyze results
print("\\nPyMC Posterior Summary:")
print(az.summary(trace, var_names=['beta', 'sigma']))

# Plot posterior distributions
fig, axes = plt.subplots(1, 3, figsize=(15, 4))
for i in range(3):
    az.plot_posterior(trace, var_names=['beta'],
                     coords={'beta_dim_0': i}, ax=axes[i])
    axes[i].axvline(true_beta[i], color='red',
                   linestyle='--', label='True value')
    axes[i].set_title(f'Posterior for β{i}')
    axes[i].legend()
plt.tight_layout()
plt.savefig('bayesian_posterior.png', dpi=300)


# 3. Predictive distribution
def posterior_predictive(X_new, posterior_mean, posterior_cov, sigma=1.0):
    """
    Compute posterior predictive distribution.
    """
    # Mean prediction
    y_pred_mean = X_new @ posterior_mean

    # Predictive variance = parameter uncertainty + noise
    y_pred_var = np.diag(X_new @ posterior_cov @ X_new.T) + sigma**2

    return y_pred_mean, np.sqrt(y_pred_var)

# Make predictions with uncertainty
X_test = np.random.randn(20, 3)
y_pred_mean, y_pred_std = posterior_predictive(X_test, posterior_mean,
                                                posterior_cov)

print("\\nPredictive Uncertainty:")
print(f"Mean prediction: {y_pred_mean[:5]}")
print(f"Std prediction:  {y_pred_std[:5]}")`}
          </pre>
        </div>
      </section>

      <section className="mt-3">
        <h2>9. Applications in Machine Learning</h2>

        <div className="info-box example">
          <h4>Bayesian Neural Networks</h4>
          <p>
            Instead of point estimates for weights, maintain distributions over weights to quantify
            uncertainty:
          </p>
          <BlockMath>{`P(\\mathbf{w}|\\mathcal{D}) \\propto P(\\mathcal{D}|\\mathbf{w})P(\\mathbf{w})`}</BlockMath>
          <p>
            <strong>Implementation:</strong> Use dropout as approximate Bayesian inference (Gal &
            Ghahramani, 2016)
          </p>
        </div>

        <div className="info-box example mt-2">
          <h4>Gaussian Processes</h4>
          <p>
            GPs are fully Bayesian nonparametric models that provide uncertainty estimates for free:
          </p>
          <BlockMath>{`f(\\mathbf{x}) \\sim \\mathcal{GP}(m(\\mathbf{x}), k(\\mathbf{x}, \\mathbf{x}'))`}</BlockMath>
          <p>
            <strong>Use cases:</strong> Hyperparameter optimization (Bayesian optimization),
            time-series forecasting
          </p>
        </div>
      </section>

      <section className="mt-3">
        <h2>10. Exercises</h2>

        <div className="exercise">
          <div className="exercise-header">
            <h3>Exercise 1: Beta-Binomial Model</h3>
            <span className="exercise-difficulty" style={{ background: '#10b981', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '4px' }}>
              Medium
            </span>
          </div>
          <p>
            You're testing a new ML model. Out of 10 test cases, it succeeds on 7. Assuming a
            Beta(2,2) prior on the success probability θ:
          </p>
          <ol>
            <li>Compute the posterior distribution</li>
            <li>What is the posterior mean?</li>
            <li>Compute a 95% credible interval for θ</li>
          </ol>
          <button
            className="cta-button mt-1"
            onClick={() => setShowSolution1(!showSolution1)}
          >
            {showSolution1 ? 'Hide' : 'Show'} Solution
          </button>
          {showSolution1 && (
            <div className="solution mt-2" style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px' }}>
              <p>
                <strong>Solution:</strong>
              </p>
              <p>1. The posterior is Beta(α + k, β + n - k) = Beta(2 + 7, 2 + 3) = Beta(9, 5)</p>
              <p>
                2. Posterior mean:{' '}
                <InlineMath>{'\\frac{\\alpha}{\\alpha + \\beta} = \\frac{9}{9+5} = 0.643'}</InlineMath>
              </p>
              <p>3. 95% credible interval can be computed numerically:</p>
              <pre className="code-block">
                {`from scipy.stats import beta
alpha_post, beta_post = 9, 5
ci_lower = beta.ppf(0.025, alpha_post, beta_post)
ci_upper = beta.ppf(0.975, alpha_post, beta_post)
print(f"95% CI: [{ci_lower:.3f}, {ci_upper:.3f}]")
# Output: 95% CI: [0.383, 0.857]`}
              </pre>
            </div>
          )}
        </div>

        <div className="exercise mt-2">
          <div className="exercise-header">
            <h3>Exercise 2: Bayesian A/B Testing</h3>
            <span className="exercise-difficulty" style={{ background: '#f59e0b', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '4px' }}>
              Hard
            </span>
          </div>
          <p>
            You run an A/B test: Variant A has 100 conversions out of 1000 views, Variant B has 120
            conversions out of 1000 views. Using Beta(1,1) priors, what is the probability that B is
            better than A?
          </p>
          <button
            className="cta-button mt-1"
            onClick={() => setShowSolution2(!showSolution2)}
          >
            {showSolution2 ? 'Hide' : 'Show'} Solution
          </button>
          {showSolution2 && (
            <div className="solution mt-2" style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px' }}>
              <p>
                <strong>Solution:</strong>
              </p>
              <p>Posteriors:</p>
              <ul>
                <li>A: Beta(101, 901)</li>
                <li>B: Beta(121, 881)</li>
              </ul>
              <p>We want P(θ_B &gt; θ_A). Using Monte Carlo:</p>
              <pre className="code-block">
                {`import numpy as np
from scipy.stats import beta

# Sample from posteriors
n_samples = 100000
theta_A = beta.rvs(101, 901, size=n_samples)
theta_B = beta.rvs(121, 881, size=n_samples)

# Probability B > A
prob_B_better = np.mean(theta_B > theta_A)
print(f"P(B > A) = {prob_B_better:.4f}")
# Output: P(B > A) ≈ 0.956

# This gives strong evidence that B is better!`}
              </pre>
            </div>
          )}
        </div>
      </section>

      <section className="mt-3">
        <h2>11. Further Reading</h2>
        <div className="info-box example">
          <h4>Essential Resources</h4>
          <ul>
            <li>
              <strong>Books:</strong>
              <ul>
                <li>"Bayesian Data Analysis" by Gelman et al.</li>
                <li>"Machine Learning: A Probabilistic Perspective" by Kevin Murphy</li>
                <li>"Probabilistic Machine Learning" by Kevin Murphy (2022)</li>
              </ul>
            </li>
            <li>
              <strong>Papers:</strong>
              <ul>
                <li>Gal & Ghahramani (2016): "Dropout as a Bayesian Approximation"</li>
                <li>Kingma & Welling (2013): "Auto-Encoding Variational Bayes"</li>
                <li>Blundell et al. (2015): "Weight Uncertainty in Neural Networks"</li>
              </ul>
            </li>
            <li>
              <strong>Software:</strong>
              <ul>
                <li>PyMC - Probabilistic programming in Python</li>
                <li>Stan - Statistical modeling and inference</li>
                <li>Edward/TensorFlow Probability - Bayesian deep learning</li>
              </ul>
            </li>
          </ul>
        </div>
      </section>

      <ChapterCompletionButton chapterId="bayesian-probability" />
    </div>
  );
};
