"""
Comprehensive Bayesian Inference with statsmodels
===================================================

This module demonstrates Bayesian methods using statsmodels and PyMC.
Covers conjugate priors, MCMC, variational inference, and applications.

Topics:
1. Bayesian linear regression
2. Hierarchical models
3. Model comparison
4. Bayesian time series
5. Applications in ML/DL

Author: Statistics for ML/DL Course
Requirements: uv sync
"""

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats
import statsmodels.api as sm
from statsmodels.regression.linear_model import OLS, WLS
from statsmodels.tsa.statespace.sarimax import SARIMAX
import pymc as pm
import arviz as az

# Configuration
np.random.seed(42)
sns.set_style("whitegrid")
plt.rcParams['figure.figsize'] = (12, 6)


# ============================================================================
# 1. BAYESIAN LINEAR REGRESSION
# ============================================================================

class BayesianLinearRegression:
    """
    Bayesian linear regression with conjugate Normal-Inverse-Gamma prior.

    This is the foundation of many ML methods, including:
    - Ridge regression (Gaussian prior)
    - Bayesian neural networks
    - Gaussian processes
    """

    def __init__(self, prior_mean=None, prior_precision=None, noise_precision=1.0):
        """
        Parameters:
        -----------
        prior_mean : array-like
            Prior mean for coefficients
        prior_precision : array-like
            Prior precision matrix (inverse covariance)
        noise_precision : float
            Precision of observation noise (1/σ²)
        """
        self.prior_mean = prior_mean
        self.prior_precision = prior_precision
        self.noise_precision = noise_precision

        self.posterior_mean = None
        self.posterior_cov = None

    def fit(self, X, y):
        """
        Compute posterior distribution (closed form with conjugate prior).
        """
        n, p = X.shape

        # Default prior: weakly informative
        if self.prior_mean is None:
            self.prior_mean = np.zeros(p)
        if self.prior_precision is None:
            self.prior_precision = np.eye(p) * 0.01  # Weak prior

        # Posterior precision = prior precision + data precision
        data_precision = self.noise_precision * (X.T @ X)
        self.posterior_precision = self.prior_precision + data_precision

        # Posterior covariance
        self.posterior_cov = np.linalg.inv(self.posterior_precision)

        # Posterior mean
        prior_contrib = self.prior_precision @ self.prior_mean
        data_contrib = self.noise_precision * (X.T @ y)
        self.posterior_mean = self.posterior_cov @ (prior_contrib + data_contrib)

        return self

    def predict(self, X_test, return_std=False):
        """
        Make predictions with uncertainty.
        """
        # Mean prediction
        y_pred = X_test @ self.posterior_mean

        if return_std:
            # Predictive variance = epistemic + aleatoric uncertainty
            epistemic = np.sum((X_test @ self.posterior_cov) * X_test, axis=1)
            aleatoric = 1.0 / self.noise_precision
            pred_var = epistemic + aleatoric

            return y_pred, np.sqrt(pred_var)

        return y_pred

    def sample_parameters(self, n_samples=1000):
        """
        Sample from posterior distribution of parameters.
        """
        return np.random.multivariate_normal(
            self.posterior_mean, self.posterior_cov, size=n_samples
        )


def example_bayesian_linear_regression():
    """Demonstrate Bayesian linear regression with uncertainty quantification."""
    print("=" * 80)
    print("EXAMPLE 1: Bayesian Linear Regression")
    print("=" * 80)

    # Generate synthetic data
    n = 100
    X = np.random.randn(n, 3)
    X = sm.add_constant(X)  # Add intercept
    true_beta = np.array([1.0, 2.5, -1.5, 0.8])
    y = X @ true_beta + np.random.randn(n) * 0.5

    # Fit Bayesian model
    blr = BayesianLinearRegression(noise_precision=4.0)  # Known noise variance
    blr.fit(X, y)

    print("\nTrue parameters:", true_beta)
    print("Posterior mean:", blr.posterior_mean)
    print("\nPosterior std:", np.sqrt(np.diag(blr.posterior_cov)))

    # Compare with frequentist OLS
    ols_model = OLS(y, X).fit()
    print("\nOLS estimates:", ols_model.params)
    print("OLS std errors:", ols_model.bse)

    # Make predictions with uncertainty
    X_test = np.random.randn(20, 3)
    X_test = sm.add_constant(X_test)
    y_pred, y_std = blr.predict(X_test, return_std=True)

    print(f"\nPredictive uncertainty (first 5 test points):")
    for i in range(5):
        print(f"  Point {i}: {y_pred[i]:.3f} ± {1.96*y_std[i]:.3f}")

    # Visualize posterior distribution of parameters
    samples = blr.sample_parameters(n_samples=10000)

    fig, axes = plt.subplots(2, 2, figsize=(14, 10))
    axes = axes.ravel()

    for i in range(4):
        ax = axes[i]
        ax.hist(samples[:, i], bins=50, density=True, alpha=0.7,
                color='skyblue', edgecolor='black', label='Posterior samples')

        # True value
        ax.axvline(true_beta[i], color='red', linestyle='--',
                  linewidth=2, label='True value')

        # Posterior mean
        ax.axvline(blr.posterior_mean[i], color='green', linestyle='-',
                  linewidth=2, label='Posterior mean')

        # OLS estimate
        ax.axvline(ols_model.params[i], color='orange', linestyle=':',
                  linewidth=2, label='OLS')

        ax.set_xlabel(f'β{i}')
        ax.set_ylabel('Density')
        ax.set_title(f'Posterior Distribution of β{i}')
        ax.legend()
        ax.grid(True, alpha=0.3)

    plt.tight_layout()
    plt.savefig('visualizations/bayesian_linear_regression.png', dpi=300, bbox_inches='tight')
    print("\nSaved: visualizations/bayesian_linear_regression.png")


# ============================================================================
# 2. BAYESIAN MODEL COMPARISON
# ============================================================================

def example_model_comparison():
    """Demonstrate Bayesian model comparison using marginal likelihood."""
    print("\n" + "=" * 80)
    print("EXAMPLE 2: Bayesian Model Comparison")
    print("=" * 80)

    # Generate data with true polynomial degree 2
    n = 50
    x = np.linspace(0, 1, n)
    y_true = 2 - 3*x + 2*x**2
    y = y_true + np.random.randn(n) * 0.3

    # Compare polynomial models of different degrees
    degrees = [1, 2, 3, 4, 5]
    marginal_likelihoods = []

    for deg in degrees:
        # Create design matrix
        X = np.vander(x, deg + 1, increasing=True)

        # Fit with PyMC to get marginal likelihood
        with pm.Model() as model:
            # Priors
            beta = pm.Normal('beta', mu=0, sigma=5, shape=deg+1)
            sigma = pm.HalfNormal('sigma', sigma=1)

            # Likelihood
            mu = pm.math.dot(X, beta)
            y_obs = pm.Normal('y_obs', mu=mu, sigma=sigma, observed=y)

            # Sample
            trace = pm.sample(1000, tune=1000, return_inferencedata=True,
                            progressbar=False, random_seed=42)

            # Compute marginal likelihood (using WAIC as approximation)
            waic = az.waic(trace)
            marginal_likelihoods.append(-waic.elpd_waic)  # Negative for minimization

    # Plot model comparison
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))

    # WAIC scores
    ax1.plot(degrees, marginal_likelihoods, 'o-', linewidth=2, markersize=8)
    ax1.set_xlabel('Polynomial Degree')
    ax1.set_ylabel('WAIC (lower is better)')
    ax1.set_title('Bayesian Model Comparison')
    ax1.axvline(2, color='red', linestyle='--', label='True model')
    ax1.legend()
    ax1.grid(True, alpha=0.3)

    # Fit predictions for best model (degree 2)
    X_best = np.vander(x, 3, increasing=True)
    with pm.Model() as best_model:
        beta = pm.Normal('beta', mu=0, sigma=5, shape=3)
        sigma = pm.HalfNormal('sigma', sigma=1)
        mu = pm.math.dot(X_best, beta)
        y_obs = pm.Normal('y_obs', mu=mu, sigma=sigma, observed=y)
        trace_best = pm.sample(1000, tune=1000, return_inferencedata=True,
                              progressbar=False, random_seed=42)

    # Plot predictions
    ax2.scatter(x, y, alpha=0.5, label='Data')
    ax2.plot(x, y_true, 'r-', linewidth=2, label='True function')

    # Posterior predictive
    ppc = pm.sample_posterior_predictive(trace_best, progressbar=False)
    y_pred_mean = ppc.posterior_predictive['y_obs'].mean(dim=['chain', 'draw'])
    y_pred_std = ppc.posterior_predictive['y_obs'].std(dim=['chain', 'draw'])

    ax2.plot(x, y_pred_mean, 'g-', linewidth=2, label='Posterior mean')
    ax2.fill_between(x, y_pred_mean - 2*y_pred_std, y_pred_mean + 2*y_pred_std,
                     alpha=0.3, color='green', label='95% CI')

    ax2.set_xlabel('x')
    ax2.set_ylabel('y')
    ax2.set_title('Best Model Predictions (Degree 2)')
    ax2.legend()
    ax2.grid(True, alpha=0.3)

    plt.tight_layout()
    plt.savefig('visualizations/bayesian_model_comparison.png', dpi=300, bbox_inches='tight')
    print("\nSaved: visualizations/bayesian_model_comparison.png")


# ============================================================================
# 3. HIERARCHICAL BAYESIAN MODELS
# ============================================================================

def example_hierarchical_model():
    """Demonstrate hierarchical Bayesian model (partial pooling)."""
    print("\n" + "=" * 80)
    print("EXAMPLE 3: Hierarchical Bayesian Model")
    print("=" * 80)

    # Generate data: Students from different schools
    n_schools = 8
    n_students_per_school = 30

    # True school effects
    true_school_means = np.array([50, 55, 48, 52, 51, 49, 53, 50])

    data = []
    for school_id, school_mean in enumerate(true_school_means):
        scores = np.random.normal(school_mean, 10, n_students_per_school)
        for score in scores:
            data.append({'school': school_id, 'score': score})

    df = pd.DataFrame(data)

    # Fit hierarchical model with PyMC
    with pm.Model() as hierarchical_model:
        # Hyperpriors (population-level parameters)
        mu_pop = pm.Normal('mu_pop', mu=50, sigma=10)
        sigma_pop = pm.HalfNormal('sigma_pop', sigma=10)

        # School-level parameters (partially pooled)
        mu_school = pm.Normal('mu_school', mu=mu_pop, sigma=sigma_pop,
                             shape=n_schools)

        # Student-level variance
        sigma_student = pm.HalfNormal('sigma_student', sigma=10)

        # Likelihood
        school_idx = df['school'].values
        y_obs = pm.Normal('y_obs', mu=mu_school[school_idx],
                         sigma=sigma_student, observed=df['score'].values)

        # Sample
        trace = pm.sample(2000, tune=1000, return_inferencedata=True,
                        progressbar=False, random_seed=42)

    # Compare with no-pooling and complete-pooling
    no_pooling_means = df.groupby('school')['score'].mean().values
    complete_pooling_mean = df['score'].mean()

    hierarchical_means = trace.posterior['mu_school'].mean(dim=['chain', 'draw']).values

    # Plot comparison
    fig, ax = plt.subplots(figsize=(12, 6))

    x = np.arange(n_schools)
    width = 0.25

    ax.bar(x - width, true_school_means, width, label='True means',
           alpha=0.8, color='red')
    ax.bar(x, no_pooling_means, width, label='No pooling (separate)',
           alpha=0.8, color='blue')
    ax.bar(x + width, hierarchical_means, width, label='Hierarchical (partial pooling)',
           alpha=0.8, color='green')
    ax.axhline(complete_pooling_mean, color='orange', linestyle='--',
              linewidth=2, label='Complete pooling (all together)')

    ax.set_xlabel('School')
    ax.set_ylabel('Mean Score')
    ax.set_title('Hierarchical Modeling: Shrinkage Effect')
    ax.set_xticks(x)
    ax.legend()
    ax.grid(True, alpha=0.3, axis='y')

    plt.tight_layout()
    plt.savefig('visualizations/hierarchical_bayesian_model.png', dpi=300, bbox_inches='tight')
    print("\nSaved: visualizations/hierarchical_bayesian_model.png")

    print(f"\nPopulation mean estimate: {trace.posterior['mu_pop'].mean():.2f}")
    print(f"Population std estimate: {trace.posterior['sigma_pop'].mean():.2f}")


# ============================================================================
# 4. BAYESIAN TIME SERIES WITH STATSMODELS
# ============================================================================

def example_bayesian_time_series():
    """Bayesian structural time series with statsmodels."""
    print("\n" + "=" * 80)
    print("EXAMPLE 4: Bayesian Time Series Analysis")
    print("=" * 80)

    # Generate time series with trend and seasonality
    n = 200
    t = np.arange(n)

    trend = 0.5 * t
    seasonal = 10 * np.sin(2 * np.pi * t / 12)
    noise = np.random.randn(n) * 5
    y = trend + seasonal + noise

    # Fit with statsmodels SARIMAX
    # Note: statsmodels uses MLE, not fully Bayesian, but provides uncertainty
    model = SARIMAX(y, order=(1, 1, 1), seasonal_order=(1, 1, 1, 12))
    results = model.fit(disp=False)

    print("\nModel Summary:")
    print(results.summary())

    # Forecast
    forecast_steps = 20
    forecast = results.get_forecast(steps=forecast_steps)
    forecast_mean = forecast.predicted_mean
    forecast_ci = forecast.conf_int()

    # Plot
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(14, 10))

    # Time series and fit
    ax1.plot(t, y, label='Observed', alpha=0.7)
    ax1.plot(t, results.fittedvalues, label='Fitted', linewidth=2)
    ax1.set_xlabel('Time')
    ax1.set_ylabel('Value')
    ax1.set_title('Bayesian Time Series: Fitted Values')
    ax1.legend()
    ax1.grid(True, alpha=0.3)

    # Forecast
    forecast_t = np.arange(n, n + forecast_steps)
    ax2.plot(t[-50:], y[-50:], label='Historical', alpha=0.7)
    ax2.plot(forecast_t, forecast_mean, label='Forecast', linewidth=2, color='red')
    ax2.fill_between(forecast_t, forecast_ci.iloc[:, 0], forecast_ci.iloc[:, 1],
                     alpha=0.3, color='red', label='95% CI')
    ax2.set_xlabel('Time')
    ax2.set_ylabel('Value')
    ax2.set_title('Bayesian Time Series: Forecast')
    ax2.legend()
    ax2.grid(True, alpha=0.3)

    plt.tight_layout()
    plt.savefig('visualizations/bayesian_time_series.png', dpi=300, bbox_inches='tight')
    print("\nSaved: visualizations/bayesian_time_series.png")


# ============================================================================
# MAIN EXECUTION
# ============================================================================

def main():
    """Run all Bayesian inference examples."""
    print("\n" + "=" * 80)
    print("BAYESIAN INFERENCE WITH STATSMODELS & PYMC")
    print("=" * 80 + "\n")

    # Create visualizations directory
    import os
    os.makedirs('visualizations', exist_ok=True)

    # Run examples
    example_bayesian_linear_regression()
    example_model_comparison()
    example_hierarchical_model()
    example_bayesian_time_series()

    print("\n" + "=" * 80)
    print("ALL EXAMPLES COMPLETED!")
    print("Check 'visualizations/' directory for plots.")
    print("=" * 80 + "\n")


if __name__ == "__main__":
    main()
