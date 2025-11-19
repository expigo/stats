"""
Probability Distributions - Python Implementation for ML/DL
=============================================================

Comprehensive guide to working with probability distributions in Python,
with focus on machine learning and deep learning applications.

Topics:
1. Discrete distributions (Bernoulli, Binomial, Poisson, Categorical)
2. Continuous distributions (Normal, Exponential, Beta, Gamma)
3. Sampling and transformations
4. Distribution fitting
5. Maximum likelihood estimation
6. Applications in ML/DL

Author: Statistics for ML/DL Course
"""

import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats
from scipy.optimize import minimize
from typing import Tuple, List
import warnings
warnings.filterwarnings('ignore')

# Configuration
np.random.seed(42)
sns.set_style("whitegrid")
plt.rcParams['figure.figsize'] = (12, 6)


# ============================================================================
# DISCRETE DISTRIBUTIONS
# ============================================================================

class DiscreteDistributions:
    """Working with discrete probability distributions."""

    @staticmethod
    def bernoulli_demo():
        """
        Bernoulli distribution: Single binary trial.

        ML Applications:
        - Binary classification labels
        - Dropout masks in neural networks
        - Coin flips, A/B testing
        """
        print("=" * 70)
        print("BERNOULLI DISTRIBUTION")
        print("=" * 70)

        p = 0.7  # Probability of success

        # Sample
        samples = np.random.binomial(1, p, size=1000)

        print(f"\nParameter: p = {p}")
        print(f"Sample mean: {np.mean(samples):.4f} (theoretical: {p})")
        print(f"Sample variance: {np.var(samples):.4f} (theoretical: {p*(1-p):.4f})")

        # Visualize
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

        # PMF
        x = [0, 1]
        pmf = [1-p, p]
        ax1.bar(x, pmf, color=['#e74c3c', '#3498db'], alpha=0.7, edgecolor='black')
        ax1.set_xlabel('Outcome')
        ax1.set_ylabel('Probability')
        ax1.set_title(f'Bernoulli PMF (p={p})')
        ax1.set_xticks([0, 1])
        ax1.set_xticklabels(['Failure (0)', 'Success (1)'])

        # Samples histogram
        ax2.hist(samples, bins=[-0.5, 0.5, 1.5], density=True,
                color='#2ecc71', alpha=0.7, edgecolor='black')
        ax2.set_xlabel('Outcome')
        ax2.set_ylabel('Relative Frequency')
        ax2.set_title(f'Sampled Bernoulli (n={len(samples)})')
        ax2.set_xticks([0, 1])

        plt.tight_layout()
        plt.savefig('../visualizations/bernoulli_distribution.png', dpi=300, bbox_inches='tight')
        print("\nSaved: visualizations/bernoulli_distribution.png")

    @staticmethod
    def binomial_demo():
        """
        Binomial distribution: Number of successes in n trials.

        ML Applications:
        - Batch accuracy in classification
        - Number of positive samples in a batch
        """
        print("\n" + "=" * 70)
        print("BINOMIAL DISTRIBUTION")
        print("=" * 70)

        n, p = 20, 0.3

        print(f"\nParameters: n={n}, p={p}")
        print(f"E[X] = np = {n*p}")
        print(f"Var(X) = np(1-p) = {n*p*(1-p):.2f}")

        # Compare PMF for different n
        fig, axes = plt.subplots(2, 2, figsize=(14, 10))

        params = [(10, 0.5), (20, 0.5), (20, 0.3), (50, 0.1)]

        for idx, (n, p) in enumerate(params):
            ax = axes[idx // 2, idx % 2]

            x = np.arange(0, n+1)
            pmf = stats.binom.pmf(x, n, p)

            ax.bar(x, pmf, color='#3498db', alpha=0.7, edgecolor='black')
            ax.axvline(n*p, color='red', linestyle='--', linewidth=2,
                      label=f'Mean = {n*p:.1f}')
            ax.set_xlabel('Number of successes')
            ax.set_ylabel('Probability')
            ax.set_title(f'Binomial(n={n}, p={p})')
            ax.legend()
            ax.grid(True, alpha=0.3)

        plt.tight_layout()
        plt.savefig('../visualizations/binomial_comparison.png', dpi=300, bbox_inches='tight')
        print("\nSaved: visualizations/binomial_comparison.png")

    @staticmethod
    def poisson_demo():
        """
        Poisson distribution: Count of rare events.

        ML Applications:
        - Modeling word counts in NLP
        - Rare event detection
        - Traffic/network analysis
        """
        print("\n" + "=" * 70)
        print("POISSON DISTRIBUTION")
        print("=" * 70)

        lambdas = [1, 4, 10]
        x = np.arange(0, 25)

        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))

        for lam in lambdas:
            pmf = stats.poisson.pmf(x, lam)
            ax1.plot(x, pmf, marker='o', label=f'λ={lam}', linewidth=2)

        ax1.set_xlabel('k')
        ax1.set_ylabel('P(X = k)')
        ax1.set_title('Poisson PMF for Different λ')
        ax1.legend()
        ax1.grid(True, alpha=0.3)

        # Approximation to normal for large λ
        lam = 20
        x_range = np.arange(0, 45)
        poisson_pmf = stats.poisson.pmf(x_range, lam)
        normal_approx = stats.norm.pdf(x_range, lam, np.sqrt(lam))

        ax2.bar(x_range, poisson_pmf, alpha=0.5, color='blue',
               label=f'Poisson(λ={lam})', edgecolor='black')
        ax2.plot(x_range, normal_approx, 'r-', linewidth=3,
                label=f'Normal({lam}, {lam})')
        ax2.set_xlabel('k')
        ax2.set_ylabel('Probability/Density')
        ax2.set_title('Poisson → Normal Approximation (large λ)')
        ax2.legend()
        ax2.grid(True, alpha=0.3)

        plt.tight_layout()
        plt.savefig('../visualizations/poisson_distribution.png', dpi=300, bbox_inches='tight')
        print("\nSaved: visualizations/poisson_distribution.png")


# ============================================================================
# CONTINUOUS DISTRIBUTIONS
# ============================================================================

class ContinuousDistributions:
    """Working with continuous probability distributions."""

    @staticmethod
    def normal_demo():
        """
        Normal (Gaussian) distribution: Most important distribution in statistics!

        ML Applications:
        - Weight initialization (Xavier/He)
        - Noise modeling in regression
        - Variational autoencoders (VAE)
        - Gaussian processes
        - Error distributions
        """
        print("\n" + "=" * 70)
        print("NORMAL (GAUSSIAN) DISTRIBUTION")
        print("=" * 70)

        # Compare different parameters
        x = np.linspace(-8, 8, 1000)
        params = [(0, 1), (0, 2), (2, 1), (2, 0.5)]

        fig, axes = plt.subplots(2, 2, figsize=(14, 10))

        for idx, (mu, sigma) in enumerate(params):
            ax = axes[idx // 2, idx % 2]

            pdf = stats.norm.pdf(x, mu, sigma)
            ax.plot(x, pdf, linewidth=3, color='#3498db')
            ax.fill_between(x, pdf, alpha=0.3, color='#3498db')

            # Mark mean and std
            ax.axvline(mu, color='red', linestyle='--', linewidth=2, label=f'μ = {mu}')
            ax.axvline(mu - sigma, color='green', linestyle=':', linewidth=2)
            ax.axvline(mu + sigma, color='green', linestyle=':', linewidth=2,
                      label=f'μ ± σ')

            ax.set_xlabel('x')
            ax.set_ylabel('Density')
            ax.set_title(f'Normal(μ={mu}, σ²={sigma**2})')
            ax.legend()
            ax.grid(True, alpha=0.3)

        plt.suptitle('Normal Distribution: Effect of Parameters', fontsize=14, fontweight='bold', y=1.02)
        plt.tight_layout()
        plt.savefig('../visualizations/normal_distribution.png', dpi=300, bbox_inches='tight')
        print("\nSaved: visualizations/normal_distribution.png")

        # Empirical rule (68-95-99.7)
        print("\nEmpirical Rule:")
        print("68% of data within μ ± σ")
        print("95% of data within μ ± 2σ")
        print("99.7% of data within μ ± 3σ")

    @staticmethod
    def exponential_demo():
        """
        Exponential distribution: Time between events.

        ML Applications:
        - Modeling inter-arrival times
        - Survival analysis
        - Memoryless property useful in some ML contexts
        """
        print("\n" + "=" * 70)
        print("EXPONENTIAL DISTRIBUTION")
        print("=" * 70)

        lambdas = [0.5, 1, 2]
        x = np.linspace(0, 5, 1000)

        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))

        for lam in lambdas:
            # PDF
            pdf = stats.expon.pdf(x, scale=1/lam)
            ax1.plot(x, pdf, linewidth=2, label=f'λ={lam}')

            # CDF
            cdf = stats.expon.cdf(x, scale=1/lam)
            ax2.plot(x, cdf, linewidth=2, label=f'λ={lam}')

        ax1.set_xlabel('x')
        ax1.set_ylabel('Density f(x)')
        ax1.set_title('Exponential PDF')
        ax1.legend()
        ax1.grid(True, alpha=0.3)

        ax2.set_xlabel('x')
        ax2.set_ylabel('Cumulative Probability F(x)')
        ax2.set_title('Exponential CDF')
        ax2.legend()
        ax2.grid(True, alpha=0.3)

        plt.tight_layout()
        plt.savefig('../visualizations/exponential_distribution.png', dpi=300, bbox_inches='tight')
        print("\nSaved: visualizations/exponential_distribution.png")

    @staticmethod
    def beta_demo():
        """
        Beta distribution: Probability of probabilities.

        ML Applications:
        - Bayesian inference (conjugate prior for Bernoulli/Binomial)
        - Modeling click-through rates
        - A/B testing
        """
        print("\n" + "=" * 70)
        print("BETA DISTRIBUTION")
        print("=" * 70)

        x = np.linspace(0, 1, 1000)
        params = [(0.5, 0.5), (1, 1), (2, 2), (5, 2), (2, 5), (10, 10)]

        fig, axes = plt.subplots(2, 3, figsize=(15, 10))
        axes = axes.ravel()

        for idx, (alpha, beta) in enumerate(params):
            ax = axes[idx]

            pdf = stats.beta.pdf(x, alpha, beta)
            ax.plot(x, pdf, linewidth=3, color='#9b59b6')
            ax.fill_between(x, pdf, alpha=0.3, color='#9b59b6')

            mean = alpha / (alpha + beta)
            ax.axvline(mean, color='red', linestyle='--', linewidth=2,
                      label=f'Mean = {mean:.2f}')

            ax.set_xlabel('x')
            ax.set_ylabel('Density')
            ax.set_title(f'Beta(α={alpha}, β={beta})')
            ax.legend()
            ax.grid(True, alpha=0.3)

        plt.suptitle('Beta Distribution: Flexible Family for [0,1]',
                    fontsize=14, fontweight='bold', y=1.0)
        plt.tight_layout()
        plt.savefig('../visualizations/beta_distribution.png', dpi=300, bbox_inches='tight')
        print("\nSaved: visualizations/beta_distribution.png")


# ============================================================================
# SAMPLING AND TRANSFORMATIONS
# ============================================================================

class SamplingMethods:
    """Advanced sampling techniques for ML."""

    @staticmethod
    def box_muller_transform():
        """
        Box-Muller transform: Generate normal from uniform.

        This is how many random number generators create Gaussian samples!
        """
        print("\n" + "=" * 70)
        print("BOX-MULLER TRANSFORM: Uniform → Normal")
        print("=" * 70)

        n = 10000

        # Generate uniform samples
        u1 = np.random.uniform(0, 1, n)
        u2 = np.random.uniform(0, 1, n)

        # Box-Muller transform
        z1 = np.sqrt(-2 * np.log(u1)) * np.cos(2 * np.pi * u2)
        z2 = np.sqrt(-2 * np.log(u1)) * np.sin(2 * np.pi * u2)

        fig, axes = plt.subplots(2, 2, figsize=(14, 10))

        # Original uniform
        axes[0, 0].hist(u1, bins=50, density=True, alpha=0.7,
                       color='blue', edgecolor='black')
        axes[0, 0].axhline(1.0, color='red', linestyle='--', linewidth=2,
                          label='Theoretical U(0,1)')
        axes[0, 0].set_title('Input: Uniform(0, 1)')
        axes[0, 0].set_xlabel('u')
        axes[0, 0].legend()

        # Transformed normal (z1)
        axes[0, 1].hist(z1, bins=50, density=True, alpha=0.7,
                       color='green', edgecolor='black')
        x = np.linspace(-4, 4, 100)
        axes[0, 1].plot(x, stats.norm.pdf(x), 'r-', linewidth=3,
                       label='Theoretical N(0,1)')
        axes[0, 1].set_title('Output: Normal(0, 1) via Box-Muller')
        axes[0, 1].set_xlabel('z')
        axes[0, 1].legend()

        # Q-Q plot
        stats.probplot(z1, dist="norm", plot=axes[1, 0])
        axes[1, 0].set_title('Q-Q Plot: Verification of Normality')

        # 2D visualization
        axes[1, 1].scatter(z1[:1000], z2[:1000], alpha=0.3, s=10)
        axes[1, 1].set_xlabel('z1')
        axes[1, 1].set_ylabel('z2')
        axes[1, 1].set_title('2D Normal from Box-Muller')
        axes[1, 1].axis('equal')
        axes[1, 1].grid(True, alpha=0.3)

        plt.tight_layout()
        plt.savefig('../visualizations/box_muller_transform.png', dpi=300, bbox_inches='tight')
        print("\nSaved: visualizations/box_muller_transform.png")

    @staticmethod
    def central_limit_theorem_demo():
        """
        Central Limit Theorem: The foundation of statistics!

        Critical for understanding:
        - Why normal distribution is so common
        - Confidence intervals
        - Hypothesis testing
        - Neural network initialization
        """
        print("\n" + "=" * 70)
        print("CENTRAL LIMIT THEOREM")
        print("=" * 70)

        # Sample from non-normal distribution (exponential)
        n_samples = 10000
        sample_sizes = [1, 5, 10, 30]

        fig, axes = plt.subplots(2, 2, figsize=(14, 10))
        axes = axes.ravel()

        for idx, n in enumerate(sample_sizes):
            # Generate sample means
            sample_means = []
            for _ in range(n_samples):
                # Sample from Exponential(1)
                sample = np.random.exponential(1, n)
                sample_means.append(np.mean(sample))

            sample_means = np.array(sample_means)

            # Plot histogram
            ax = axes[idx]
            ax.hist(sample_means, bins=50, density=True, alpha=0.7,
                   color='skyblue', edgecolor='black',
                   label=f'Sample means (n={n})')

            # Theoretical normal distribution
            theoretical_mean = 1  # mean of Exp(1)
            theoretical_std = 1 / np.sqrt(n)  # std of sample mean

            x = np.linspace(sample_means.min(), sample_means.max(), 100)
            theoretical_pdf = stats.norm.pdf(x, theoretical_mean, theoretical_std)

            ax.plot(x, theoretical_pdf, 'r-', linewidth=3,
                   label=f'N({theoretical_mean:.1f}, {theoretical_std**2:.3f})')

            ax.set_xlabel('Sample Mean')
            ax.set_ylabel('Density')
            ax.set_title(f'Sample Size n = {n}')
            ax.legend()
            ax.grid(True, alpha=0.3)

        plt.suptitle('Central Limit Theorem: Exponential → Normal',
                    fontsize=14, fontweight='bold', y=1.0)
        plt.tight_layout()
        plt.savefig('../visualizations/central_limit_theorem.png', dpi=300, bbox_inches='tight')
        print("\nSaved: visualizations/central_limit_theorem.png")


# ============================================================================
# MAXIMUM LIKELIHOOD ESTIMATION
# ============================================================================

class MaximumLikelihoodEstimation:
    """MLE - Fundamental parameter estimation method in ML."""

    @staticmethod
    def mle_normal():
        """
        Maximum Likelihood Estimation for Normal distribution.

        This is the theoretical foundation for:
        - Linear regression
        - Many neural network loss functions
        """
        print("\n" + "=" * 70)
        print("MAXIMUM LIKELIHOOD ESTIMATION: Normal Distribution")
        print("=" * 70)

        # Generate data from known distribution
        true_mu, true_sigma = 5, 2
        n = 100
        data = np.random.normal(true_mu, true_sigma, n)

        # MLE estimates (analytical solution)
        mu_mle = np.mean(data)
        sigma_mle = np.std(data, ddof=0)  # MLE uses n, not n-1

        print(f"\nTrue parameters: μ = {true_mu}, σ = {true_sigma}")
        print(f"MLE estimates: μ̂ = {mu_mle:.4f}, σ̂ = {sigma_mle:.4f}")
        print(f"Sample size: n = {n}")

        # Visualize likelihood surface
        mu_range = np.linspace(true_mu - 1, true_mu + 1, 100)
        sigma_range = np.linspace(true_sigma - 1, true_sigma + 1, 100)
        MU, SIGMA = np.meshgrid(mu_range, sigma_range)

        # Calculate log-likelihood for each (mu, sigma)
        log_likelihood = np.zeros_like(MU)
        for i in range(len(mu_range)):
            for j in range(len(sigma_range)):
                ll = -n/2 * np.log(2 * np.pi * sigma_range[j]**2) - \
                     np.sum((data - mu_range[i])**2) / (2 * sigma_range[j]**2)
                log_likelihood[j, i] = ll

        # Plot
        fig = plt.figure(figsize=(14, 6))

        # 3D surface
        ax1 = fig.add_subplot(121, projection='3d')
        surf = ax1.plot_surface(MU, SIGMA, log_likelihood,
                               cmap='viridis', alpha=0.8)
        ax1.scatter([mu_mle], [sigma_mle], [log_likelihood.max()],
                   color='red', s=100, label='MLE')
        ax1.set_xlabel('μ')
        ax1.set_ylabel('σ')
        ax1.set_zlabel('Log-Likelihood')
        ax1.set_title('Log-Likelihood Surface')

        # Contour plot
        ax2 = fig.add_subplot(122)
        contour = ax2.contour(MU, SIGMA, log_likelihood, levels=20, cmap='viridis')
        ax2.clabel(contour, inline=True, fontsize=8)
        ax2.plot(mu_mle, sigma_mle, 'r*', markersize=20, label='MLE')
        ax2.plot(true_mu, true_sigma, 'go', markersize=10, label='True')
        ax2.set_xlabel('μ')
        ax2.set_ylabel('σ')
        ax2.set_title('Log-Likelihood Contours')
        ax2.legend()
        ax2.grid(True, alpha=0.3)

        plt.tight_layout()
        plt.savefig('../visualizations/mle_normal.png', dpi=300, bbox_inches='tight')
        print("\nSaved: visualizations/mle_normal.png")


# ============================================================================
# MAIN EXECUTION
# ============================================================================

def main():
    """Run all distribution examples."""

    print("\n" + "=" * 70)
    print("PROBABILITY DISTRIBUTIONS FOR MACHINE LEARNING")
    print("=" * 70 + "\n")

    # Discrete distributions
    discrete = DiscreteDistributions()
    discrete.bernoulli_demo()
    discrete.binomial_demo()
    discrete.poisson_demo()

    # Continuous distributions
    continuous = ContinuousDistributions()
    continuous.normal_demo()
    continuous.exponential_demo()
    continuous.beta_demo()

    # Sampling methods
    sampling = SamplingMethods()
    sampling.box_muller_transform()
    sampling.central_limit_theorem_demo()

    # MLE
    mle = MaximumLikelihoodEstimation()
    mle.mle_normal()

    print("\n" + "=" * 70)
    print("ALL EXAMPLES COMPLETED SUCCESSFULLY!")
    print("Check the 'visualizations/' directory for plots.")
    print("=" * 70 + "\n")


if __name__ == "__main__":
    main()
