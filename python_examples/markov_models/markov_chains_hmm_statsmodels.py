"""
Comprehensive Markov Models with statsmodels
=============================================

Complete implementation of Markov chains, Hidden Markov Models,
and Markov Switching Models using statsmodels.

Topics:
1. Discrete-time Markov chains
2. Stationary distributions
3. Hidden Markov Models (HMM)
4. Markov Switching Regression (statsmodels)
5. Applications in finance, NLP, and time series

Author: Statistics for ML/DL Course
Requirements: uv sync
"""

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats
from scipy.linalg import eig
import statsmodels.api as sm
from statsmodels.tsa.regime_switching.markov_regression import MarkovRegression
from statsmodels.tsa.regime_switching.markov_autoregression import MarkovAutoregression
from hmmlearn import hmm
import networkx as nx

# Configuration
np.random.seed(42)
sns.set_style("whitegrid")
plt.rcParams['figure.figsize'] = (14, 6)


# ============================================================================
# 1. MARKOV CHAIN IMPLEMENTATION
# ============================================================================

class MarkovChain:
    """
    Comprehensive discrete-time Markov chain implementation.

    Applications:
    - PageRank algorithm
    - Markov Chain Monte Carlo (MCMC)
    - Sequence modeling
    """

    def __init__(self, transition_matrix, state_names=None):
        """
        Parameters:
        -----------
        transition_matrix : array-like
            Transition probability matrix P where P[i,j] = P(X_{t+1}=j | X_t=i)
        state_names : list, optional
            Names for each state
        """
        self.P = np.array(transition_matrix)
        self.n_states = self.P.shape[0]

        # Validation
        assert self.P.shape[0] == self.P.shape[1], "Transition matrix must be square"
        assert np.allclose(self.P.sum(axis=1), 1), "Rows must sum to 1"
        assert np.all(self.P >= 0), "Probabilities must be non-negative"

        self.state_names = state_names or [f"State {i}" for i in range(self.n_states)]

    def stationary_distribution(self):
        """
        Compute stationary distribution π where π^T P = π^T.

        This is the left eigenvector with eigenvalue 1.
        """
        eigenvalues, eigenvectors = eig(self.P.T)

        # Find eigenvector corresponding to eigenvalue 1
        idx = np.argmin(np.abs(eigenvalues - 1.0))
        stationary = np.real(eigenvectors[:, idx])

        # Normalize to probability distribution
        stationary = stationary / stationary.sum()

        return stationary

    def is_irreducible(self):
        """Check if the Markov chain is irreducible."""
        # A chain is irreducible if all states communicate
        # This is true if (I + P)^{n-1} has all positive entries
        n = self.n_states
        temp = np.linalg.matrix_power(np.eye(n) + self.P, n - 1)
        return np.all(temp > 0)

    def period(self, state):
        """Compute period of a state."""
        # Period = gcd of return times
        # Simplified: if P^n[state, state] > 0 for consecutive n, period = 1
        max_iter = 100
        periods = []

        for n in range(1, max_iter + 1):
            P_n = np.linalg.matrix_power(self.P, n)
            if P_n[state, state] > 1e-10:
                periods.append(n)

        if len(periods) == 0:
            return np.inf

        return np.gcd.reduce(periods)

    def is_aperiodic(self):
        """Check if chain is aperiodic (all states have period 1)."""
        return all(self.period(i) == 1 for i in range(self.n_states))

    def n_step_transition(self, n):
        """Compute n-step transition matrix P^n."""
        return np.linalg.matrix_power(self.P, n)

    def mean_first_passage_time(self, start_state, end_state):
        """
        Compute mean first passage time from start_state to end_state.

        This is the expected number of steps to reach end_state from start_state.
        """
        if start_state == end_state:
            return 0

        n = self.n_states

        # Solve: m_i = 1 + sum_k P_ik * m_k for k != j
        # Set up system of equations
        A = np.eye(n) - self.P
        A[end_state, :] = 0
        A[end_state, end_state] = 1

        b = np.ones(n)
        b[end_state] = 0

        m = np.linalg.solve(A, b)
        return m[start_state]

    def simulate(self, n_steps, initial_state=None, return_path=True):
        """
        Simulate a path from the Markov chain.

        Parameters:
        -----------
        n_steps : int
            Number of steps to simulate
        initial_state : int, optional
            Starting state (random if None)
        return_path : bool
            If True, return full path; otherwise return final state

        Returns:
        --------
        path : array if return_path=True, else int
        """
        if initial_state is None:
            initial_state = np.random.choice(self.n_states)

        if return_path:
            path = [initial_state]
            current = initial_state

            for _ in range(n_steps - 1):
                current = np.random.choice(self.n_states, p=self.P[current])
                path.append(current)

            return np.array(path)
        else:
            # Just simulate final state (more efficient)
            current = initial_state
            for _ in range(n_steps - 1):
                current = np.random.choice(self.n_states, p=self.P[current])
            return current

    def hitting_probability(self, start_state, target_states):
        """
        Compute probability of hitting target_states from start_state.
        """
        target_states = set(target_states)
        n = self.n_states

        # Set up absorption problem
        # Transient states: not in target_states
        # Absorbing states: in target_states

        transient = [i for i in range(n) if i not in target_states]
        absorbing = list(target_states)

        if start_state in absorbing:
            return 1.0

        # Fundamental matrix: N = (I - Q)^{-1}
        Q = self.P[np.ix_(transient, transient)]
        I = np.eye(len(transient))

        try:
            N = np.linalg.inv(I - Q)
        except np.linalg.LinAlgError:
            return 0.0

        # Absorption probabilities
        R = self.P[np.ix_(transient, absorbing)]
        B = N @ R

        # Find index of start_state in transient states
        idx = transient.index(start_state)

        return B[idx].sum()


def example_markov_chain():
    """Demonstrate Markov chain analysis."""
    print("=" * 80)
    print("EXAMPLE 1: Markov Chain Analysis")
    print("=" * 80)

    # Example: Weather model
    # States: 0=Sunny, 1=Cloudy, 2=Rainy
    P = np.array([
        [0.7, 0.2, 0.1],  # Sunny -> [Sunny, Cloudy, Rainy]
        [0.3, 0.4, 0.3],  # Cloudy -> [Sunny, Cloudy, Rainy]
        [0.2, 0.3, 0.5]   # Rainy -> [Sunny, Cloudy, Rainy]
    ])

    mc = MarkovChain(P, state_names=["Sunny", "Cloudy", "Rainy"])

    print("\nTransition Matrix:")
    print(pd.DataFrame(P, index=mc.state_names, columns=mc.state_names))

    # Stationary distribution
    pi = mc.stationary_distribution()
    print(f"\nStationary distribution:")
    for state, prob in zip(mc.state_names, pi):
        print(f"  {state}: {prob:.4f}")

    # Check properties
    print(f"\nIrreducible: {mc.is_irreducible()}")
    print(f"Aperiodic: {mc.is_aperiodic()}")

    # Mean first passage times
    print(f"\nMean First Passage Times:")
    for i in range(3):
        for j in range(3):
            if i != j:
                mfpt = mc.mean_first_passage_time(i, j)
                print(f"  {mc.state_names[i]} → {mc.state_names[j]}: {mfpt:.2f} days")

    # Simulate path
    path = mc.simulate(100)

    # Visualize convergence to stationary distribution
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))

    # Simulate many paths to show convergence
    n_simulations = 1000
    n_steps = 100
    state_counts = np.zeros((n_steps, 3))

    for _ in range(n_simulations):
        path = mc.simulate(n_steps)
        for t in range(n_steps):
            state_counts[t, path[t]] += 1

    state_freqs = state_counts / n_simulations

    # Plot convergence
    for i, state in enumerate(mc.state_names):
        ax1.plot(state_freqs[:, i], label=state, linewidth=2)
        ax1.axhline(pi[i], linestyle='--', alpha=0.5)

    ax1.set_xlabel('Time Step')
    ax1.set_ylabel('State Frequency')
    ax1.set_title('Convergence to Stationary Distribution')
    ax1.legend()
    ax1.grid(True, alpha=0.3)

    # Visualize as graph
    G = nx.DiGraph()
    for i in range(3):
        G.add_node(i, label=mc.state_names[i])

    for i in range(3):
        for j in range(3):
            if P[i, j] > 0:
                G.add_edge(i, j, weight=P[i, j])

    pos = nx.spring_layout(G, seed=42)
    nx.draw_networkx_nodes(G, pos, node_color='lightblue',
                          node_size=2000, ax=ax2)
    nx.draw_networkx_labels(G, pos, {i: mc.state_names[i] for i in range(3)},
                           font_size=10, ax=ax2)

    # Draw edges with labels
    edges = G.edges()
    weights = [G[u][v]['weight'] for u, v in edges]
    nx.draw_networkx_edges(G, pos, width=[w*3 for w in weights],
                          edge_color='gray', arrows=True,
                          arrowsize=20, ax=ax2,
                          connectionstyle='arc3,rad=0.1')

    # Edge labels
    edge_labels = {(i, j): f'{P[i,j]:.2f}' for i in range(3) for j in range(3) if P[i,j] > 0}
    nx.draw_networkx_edge_labels(G, pos, edge_labels, font_size=8, ax=ax2)

    ax2.set_title('State Transition Diagram')
    ax2.axis('off')

    plt.tight_layout()
    plt.savefig('visualizations/markov_chain_analysis.png', dpi=300, bbox_inches='tight')
    print("\nSaved: visualizations/markov_chain_analysis.png")


# ============================================================================
# 2. HIDDEN MARKOV MODEL
# ============================================================================

def example_hidden_markov_model():
    """Demonstrate HMM with hmmlearn library."""
    print("\n" + "=" * 80)
    print("EXAMPLE 2: Hidden Markov Model")
    print("=" * 80)

    # Example: Dishonest Casino
    # Hidden states: Fair die (0), Loaded die (1)
    # Observations: Dice rolls (0-5 for faces 1-6)

    # True model parameters
    startprob = np.array([0.5, 0.5])
    transmat = np.array([
        [0.95, 0.05],  # Fair -> [Fair, Loaded]
        [0.10, 0.90]   # Loaded -> [Fair, Loaded]
    ])

    # Emission probabilities
    # Fair: uniform, Loaded: biased towards 6
    emissionprob = np.array([
        [1/6, 1/6, 1/6, 1/6, 1/6, 1/6],  # Fair
        [0.1, 0.1, 0.1, 0.1, 0.1, 0.5]   # Loaded
    ])

    # Create and train HMM
    model = hmm.CategoricalHMM(n_components=2, n_features=6)
    model.startprob_ = startprob
    model.transmat_ = transmat
    model.emissionprob_ = emissionprob

    # Simulate data
    n_samples = 300
    true_states, observations = model.sample(n_samples)

    print(f"\nGenerated {n_samples} observations")
    print(f"Observation sequence (first 20): {observations[:20].ravel() + 1}")  # +1 for 1-6 dice
    print(f"True states (first 20): {['Fair' if s==0 else 'Loaded' for s in true_states[:20].ravel()]}")

    # Inference: Decode most likely state sequence (Viterbi)
    decoded_states = model.predict(observations)

    print(f"\nDecoded states (first 20): {['Fair' if s==0 else 'Loaded' for s in decoded_states[:20]]}")

    # Accuracy
    accuracy = np.mean(decoded_states == true_states.ravel())
    print(f"\nDecoding accuracy: {accuracy:.2%}")

    # Compute log probability
    log_prob = model.score(observations)
    print(f"Log probability of observations: {log_prob:.2f}")

    # Visualize
    fig, axes = plt.subplots(3, 1, figsize=(14, 10))

    # Observations
    axes[0].plot(observations + 1, 'o-', markersize=3, alpha=0.7)
    axes[0].set_ylabel('Dice Roll')
    axes[0].set_title('Observations (Dice Rolls)')
    axes[0].set_ylim(0.5, 6.5)
    axes[0].grid(True, alpha=0.3)

    # True states
    axes[1].plot(true_states, 'g-', linewidth=2, label='True States')
    axes[1].set_ylabel('State')
    axes[1].set_yticks([0, 1])
    axes[1].set_yticklabels(['Fair', 'Loaded'])
    axes[1].set_title('True Hidden States')
    axes[1].grid(True, alpha=0.3)

    # Decoded states
    axes[2].plot(decoded_states, 'r-', linewidth=2, label='Decoded States')
    axes[2].set_xlabel('Time')
    axes[2].set_ylabel('State')
    axes[2].set_yticks([0, 1])
    axes[2].set_yticklabels(['Fair', 'Loaded'])
    axes[2].set_title('Viterbi Decoded States')
    axes[2].grid(True, alpha=0.3)

    plt.tight_layout()
    plt.savefig('visualizations/hidden_markov_model.png', dpi=300, bbox_inches='tight')
    print("\nSaved: visualizations/hidden_markov_model.png")


# ============================================================================
# 3. MARKOV SWITCHING MODEL WITH STATSMODELS
# ============================================================================

def example_markov_switching_regression():
    """Demonstrate Markov switching regression with statsmodels."""
    print("\n" + "=" * 80)
    print("EXAMPLE 3: Markov Switching Regression (statsmodels)")
    print("=" * 80)

    # Generate data with regime switches
    # Regime 0: Low volatility, mean 2
    # Regime 1: High volatility, mean 5

    n = 500
    np.random.seed(42)

    # Simulate regime switches
    true_regimes = []
    current_regime = 0

    for i in range(n):
        # Regime transition probabilities
        if current_regime == 0:
            if np.random.rand() < 0.05:  # 5% chance to switch
                current_regime = 1
        else:
            if np.random.rand() < 0.10:  # 10% chance to switch back
                current_regime = 0

        true_regimes.append(current_regime)

    true_regimes = np.array(true_regimes)

    # Generate observations based on regime
    y = np.zeros(n)
    for i in range(n):
        if true_regimes[i] == 0:
            y[i] = 2.0 + np.random.randn() * 0.5
        else:
            y[i] = 5.0 + np.random.randn() * 2.0

    # Fit Markov switching model
    mod = MarkovRegression(y, k_regimes=2, trend='c', switching_variance=True)
    res = mod.fit()

    print("\nModel Summary:")
    print(res.summary())

    # Get smoothed probabilities
    smoothed_probs = res.smoothed_marginal_probabilities

    # Plot results
    fig, axes = plt.subplots(3, 1, figsize=(14, 12))

    # Data
    axes[0].plot(y, alpha=0.7)
    axes[0].set_ylabel('Value')
    axes[0].set_title('Time Series with Regime Switches')
    axes[0].grid(True, alpha=0.3)

    # True regimes
    axes[1].plot(true_regimes, 'g-', linewidth=2)
    axes[1].set_ylabel('Regime')
    axes[1].set_yticks([0, 1])
    axes[1].set_title('True Regimes')
    axes[1].grid(True, alpha=0.3)

    # Inferred regime probabilities
    axes[2].plot(smoothed_probs[0], label='P(Regime 0)', linewidth=2)
    axes[2].plot(smoothed_probs[1], label='P(Regime 1)', linewidth=2)
    axes[2].fill_between(range(n), 0, smoothed_probs[1], alpha=0.3)
    axes[2].set_xlabel('Time')
    axes[2].set_ylabel('Probability')
    axes[2].set_title('Inferred Regime Probabilities (Smoothed)')
    axes[2].legend()
    axes[2].grid(True, alpha=0.3)

    plt.tight_layout()
    plt.savefig('visualizations/markov_switching_regression.png', dpi=300, bbox_inches='tight')
    print("\nSaved: visualizations/markov_switching_regression.png")

    # Print regime characteristics
    print("\nEstimated Regime Characteristics:")
    print(f"Regime 0 - Mean: {res.params[0]:.3f}, Variance: {res.params[2]:.3f}")
    print(f"Regime 1 - Mean: {res.params[1]:.3f}, Variance: {res.params[3]:.3f}")


# ============================================================================
# 4. APPLICATION: FINANCIAL TIME SERIES
# ============================================================================

def example_financial_regime_switching():
    """Apply Markov switching to financial returns (bull/bear markets)."""
    print("\n" + "=" * 80)
    print("EXAMPLE 4: Financial Regime Switching")
    print("=" * 80)

    # Simulate stock returns with bull/bear regimes
    n = 1000

    # Bull market: high mean, low volatility
    # Bear market: negative mean, high volatility

    bull_returns = np.random.normal(0.10/252, 0.15/np.sqrt(252), n//2)  # Annualized
    bear_returns = np.random.normal(-0.05/252, 0.30/np.sqrt(252), n//2)

    # Combine with switches
    returns = np.concatenate([
        bull_returns[:150], bear_returns[:100],
        bull_returns[150:250], bear_returns[100:200],
        bull_returns[250:]
    ])

    # Convert to price series
    prices = 100 * np.exp(np.cumsum(returns))

    # Fit Markov switching autoregressive model
    mod = MarkovAutoregression(returns * 100, k_regimes=2, order=1,
                               switching_variance=True)
    res = mod.fit()

    print("\nModel Summary:")
    print(res.summary())

    # Get regime probabilities
    smoothed_probs = res.smoothed_marginal_probabilities

    # Identify bull/bear regimes (higher mean = bull)
    regime_means = [res.params[f'const[{i}]'] for i in range(2)]
    bull_regime = np.argmax(regime_means)
    bear_regime = 1 - bull_regime

    # Plot
    fig, axes = plt.subplots(3, 1, figsize=(14, 12))

    # Price series
    axes[0].plot(prices)
    axes[0].set_ylabel('Price')
    axes[0].set_title('Simulated Stock Price')
    axes[0].grid(True, alpha=0.3)

    # Returns
    axes[1].plot(returns * 100, alpha=0.7)
    axes[1].axhline(0, color='black', linestyle='--', linewidth=1)
    axes[1].set_ylabel('Returns (%)')
    axes[1].set_title('Daily Returns')
    axes[1].grid(True, alpha=0.3)

    # Regime probabilities
    axes[2].fill_between(range(n), 0, smoothed_probs[bull_regime],
                        alpha=0.5, color='green', label='Bull Market Probability')
    axes[2].fill_between(range(n), smoothed_probs[bull_regime], 1,
                        alpha=0.5, color='red', label='Bear Market Probability')
    axes[2].set_xlabel('Time (days)')
    axes[2].set_ylabel('Probability')
    axes[2].set_title('Market Regime Probabilities')
    axes[2].legend()
    axes[2].grid(True, alpha=0.3)

    plt.tight_layout()
    plt.savefig('visualizations/financial_regime_switching.png', dpi=300, bbox_inches='tight')
    print("\nSaved: visualizations/financial_regime_switching.png")


# ============================================================================
# MAIN EXECUTION
# ============================================================================

def main():
    """Run all Markov model examples."""
    print("\n" + "=" * 80)
    print("MARKOV MODELS WITH STATSMODELS")
    print("=" * 80 + "\n")

    # Create visualizations directory
    import os
    os.makedirs('visualizations', exist_ok=True)

    # Run examples
    example_markov_chain()
    example_hidden_markov_model()
    example_markov_switching_regression()
    example_financial_regime_switching()

    print("\n" + "=" * 80)
    print("ALL EXAMPLES COMPLETED!")
    print("Check 'visualizations/' directory for plots.")
    print("=" * 80 + "\n")


if __name__ == "__main__":
    main()
