import { useState } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { MarkovChainViz } from '../../components/visualizations/MarkovChainViz';
import { HMMVisualization } from '../../components/visualizations/HMMVisualization';
import { Code } from 'lucide-react';
import { ChapterCompletionButton } from '../../components/chapter/ChapterCompletionButton';

export const MarkovModels = () => {
  const [showSolution1, setShowSolution1] = useState(false);

  return (
    <div className="chapter-content fade-in">
      <div className="hero" style={{ marginBottom: '2rem' }}>
        <h1>Chapter: Markov Models</h1>
        <p>From Markov Chains to Hidden Markov Models with applications in ML/DL</p>
      </div>

      <section>
        <h2>1. Introduction to Markov Processes</h2>
        <p>
          Markov models are fundamental to understanding sequential data in machine learning,
          from language modeling to reinforcement learning.
        </p>

        <div className="info-box definition">
          <h4>The Markov Property</h4>
          <p>A stochastic process has the <strong>Markov property</strong> if:</p>
          <BlockMath>{`P(X_{t+1} | X_t, X_{t-1}, ..., X_1) = P(X_{t+1} | X_t)`}</BlockMath>
          <p>
            <strong>Interpretation:</strong> The future depends only on the present, not the past.
            "The process is memoryless."
          </p>
        </div>

        <div className="info-box example">
          <h4>ML/DL Applications</h4>
          <ul>
            <li><strong>Natural Language Processing:</strong> N-gram models, text generation</li>
            <li><strong>Speech Recognition:</strong> Hidden Markov Models for phoneme sequences</li>
            <li><strong>Reinforcement Learning:</strong> Markov Decision Processes (MDPs)</li>
            <li><strong>Time Series:</strong> State space models, sequence modeling</li>
            <li><strong>Bioinformatics:</strong> Gene sequence analysis, protein folding</li>
            <li><strong>Finance:</strong> Stock price modeling, regime switching</li>
          </ul>
        </div>
      </section>

      <section className="mt-3">
        <h2>2. Discrete-Time Markov Chains</h2>

        <div className="info-box definition">
          <h4>Definition: Markov Chain</h4>
          <p>A discrete-time Markov chain is characterized by:</p>
          <ul>
            <li><strong>State space:</strong> S = {`{1, 2, ..., N}`}</li>
            <li>
              <strong>Transition matrix:</strong> P where P[i,j] = P(X_{'{t+1}'} = j | X_{'{t}'} = i)
            </li>
            <li>
              <strong>Initial distribution:</strong> π⁽⁰⁾
            </li>
          </ul>
          <BlockMath>{`P = \\begin{bmatrix}
P_{11} & P_{12} & \\cdots & P_{1N} \\\\
P_{21} & P_{22} & \\cdots & P_{2N} \\\\
\\vdots & \\vdots & \\ddots & \\vdots \\\\
P_{N1} & P_{N2} & \\cdots & P_{NN}
\\end{bmatrix}`}</BlockMath>
          <p>Properties:</p>
          <ul>
            <li>Rows sum to 1: <InlineMath>{'\\sum_j P_{ij} = 1'}</InlineMath></li>
            <li>All elements non-negative: <InlineMath>{'P_{ij} \\geq 0'}</InlineMath></li>
          </ul>
        </div>

        <div className="mt-2">
          <MarkovChainViz />
        </div>
      </section>

      <section className="mt-3">
        <h2>3. Stationary Distribution</h2>

        <div className="info-box theorem">
          <h4>Stationary Distribution</h4>
          <p>
            A distribution π is <strong>stationary</strong> if it remains unchanged by the
            transition matrix:
          </p>
          <BlockMath>{`\\pi^T P = \\pi^T`}</BlockMath>
          <p>
            <strong>Equivalently:</strong> π is the left eigenvector of P with eigenvalue 1
          </p>
          <p>
            <strong>Theorem:</strong> For an irreducible, aperiodic Markov chain, there exists a
            unique stationary distribution π, and:
          </p>
          <BlockMath>{`\\lim_{t \\to \\infty} P^t = \\begin{bmatrix}
\\pi^T \\\\
\\pi^T \\\\
\\vdots \\\\
\\pi^T
\\end{bmatrix}`}</BlockMath>
        </div>

        <div className="info-box example">
          <h4>Example: PageRank as Stationary Distribution</h4>
          <p>
            Google's PageRank algorithm computes the stationary distribution of a Markov chain over
            web pages!
          </p>
          <BlockMath>{`\\pi_i = (1-d) + d \\sum_{j \\to i} \\frac{\\pi_j}{N_j}`}</BlockMath>
          <p>where d is the damping factor (typically 0.85) and N_j is the number of outlinks from page j.</p>
        </div>
      </section>

      <section className="mt-3">
        <h2>4. Hidden Markov Models (HMMs)</h2>
        <p>
          In many applications, we don't observe the true states directly—only noisy observations.
          This is where HMMs come in!
        </p>

        <div className="info-box definition">
          <h4>Definition: HMM</h4>
          <p>An HMM is defined by:</p>
          <ul>
            <li>
              <strong>Hidden states:</strong> S = {`{s₁, s₂, ..., sₙ}`}
            </li>
            <li>
              <strong>Observations:</strong> O = {`{o₁, o₂, ..., oₘ}`}
            </li>
            <li>
              <strong>Transition probabilities:</strong> A[i,j] = P(s_t = j | s_{'{t-1}'} = i)
            </li>
            <li>
              <strong>Emission probabilities:</strong> B[i,k] = P(o_t = k | s_t = i)
            </li>
            <li>
              <strong>Initial state distribution:</strong> π
            </li>
          </ul>
        </div>

        <div className="info-box theorem">
          <h4>Three Fundamental Problems for HMMs</h4>
          <ol>
            <li>
              <strong>Evaluation:</strong> Given observations O and model λ, compute P(O|λ)
              <br />
              <em>Solution: Forward Algorithm (O(N²T))</em>
            </li>
            <li>
              <strong>Decoding:</strong> Given observations O and model λ, find most likely state
              sequence
              <br />
              <em>Solution: Viterbi Algorithm (O(N²T))</em>
            </li>
            <li>
              <strong>Learning:</strong> Given observations O, find model λ that maximizes P(O|λ)
              <br />
              <em>Solution: Baum-Welch Algorithm (EM for HMMs)</em>
            </li>
          </ol>
        </div>

        <div className="mt-2">
          <HMMVisualization />
        </div>
      </section>

      <section className="mt-3">
        <h2>5. Forward Algorithm</h2>
        <p>Efficiently compute the probability of an observation sequence.</p>

        <div className="info-box theorem">
          <h4>Forward Algorithm</h4>
          <p>Define the forward variable:</p>
          <BlockMath>{`\\alpha_t(i) = P(o_1, o_2, ..., o_t, s_t = i | \\lambda)`}</BlockMath>
          <p><strong>Initialization:</strong></p>
          <BlockMath>{`\\alpha_1(i) = \\pi_i \\cdot b_i(o_1)`}</BlockMath>
          <p><strong>Recursion:</strong></p>
          <BlockMath>{`\\alpha_{t+1}(j) = \\left[\\sum_{i=1}^N \\alpha_t(i) a_{ij}\\right] b_j(o_{t+1})`}</BlockMath>
          <p><strong>Termination:</strong></p>
          <BlockMath>{`P(O|\\lambda) = \\sum_{i=1}^N \\alpha_T(i)`}</BlockMath>
        </div>
      </section>

      <section className="mt-3">
        <h2>6. Viterbi Algorithm</h2>
        <p>Find the most likely sequence of hidden states (MAP estimate).</p>

        <div className="info-box theorem">
          <h4>Viterbi Algorithm</h4>
          <p>Define:</p>
          <BlockMath>{`\\delta_t(i) = \\max_{s_1,...,s_{t-1}} P(s_1, ..., s_{t-1}, s_t = i, o_1, ..., o_t | \\lambda)`}</BlockMath>
          <p><strong>Initialization:</strong></p>
          <BlockMath>{`\\delta_1(i) = \\pi_i \\cdot b_i(o_1)`}</BlockMath>
          <p><strong>Recursion:</strong></p>
          <BlockMath>{`\\delta_{t+1}(j) = \\left[\\max_i \\delta_t(i) a_{ij}\\right] b_j(o_{t+1})`}</BlockMath>
          <BlockMath>{`\\psi_{t+1}(j) = \\arg\\max_i [\\delta_t(i) a_{ij}]`}</BlockMath>
          <p><strong>Backtracking:</strong> Use ψ to trace back the optimal path</p>
        </div>
      </section>

      <section className="mt-3">
        <h2>7. Python Implementation with statsmodels</h2>

        <div className="info-box example">
          <div className="code-header">
            <Code size={18} />
            <span>Python: Markov Chain Analysis</span>
          </div>
          <pre className="code-block">
            {`import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats
from scipy.linalg import eig
import statsmodels.api as sm
from statsmodels.tsa.regime_switching.markov_regression import MarkovRegression

# =================
# 1. Markov Chain
# =================

class MarkovChain:
    """
    Discrete-time Markov chain implementation.
    """

    def __init__(self, transition_matrix, state_names=None):
        self.P = np.array(transition_matrix)
        self.n_states = self.P.shape[0]

        # Validate
        assert self.P.shape[0] == self.P.shape[1]
        assert np.allclose(self.P.sum(axis=1), 1)

        if state_names is None:
            self.state_names = [f"State {i}" for i in range(self.n_states)]
        else:
            self.state_names = state_names

    def stationary_distribution(self):
        """
        Compute stationary distribution by finding left eigenvector
        with eigenvalue 1.
        """
        eigenvalues, eigenvectors = eig(self.P.T)

        # Find eigenvector with eigenvalue closest to 1
        idx = np.argmin(np.abs(eigenvalues - 1))
        stationary = np.real(eigenvectors[:, idx])

        # Normalize
        stationary = stationary / stationary.sum()

        return stationary

    def n_step_transition(self, n):
        """Compute n-step transition matrix."""
        return np.linalg.matrix_power(self.P, n)

    def simulate(self, n_steps, initial_state=None):
        """
        Simulate a path from the Markov chain.
        """
        if initial_state is None:
            initial_state = np.random.choice(self.n_states)

        path = [initial_state]
        current = initial_state

        for _ in range(n_steps - 1):
            current = np.random.choice(self.n_states, p=self.P[current])
            path.append(current)

        return np.array(path)

    def mean_first_passage_time(self, i, j):
        """
        Compute mean first passage time from state i to state j.
        """
        if i == j:
            return 0

        # Solve system: m_i = 1 + sum_k P_ik * m_k for k != j
        n = self.n_states
        A = np.eye(n) - self.P
        A[j, :] = 0
        A[j, j] = 1

        b = np.ones(n)
        b[j] = 0

        m = np.linalg.solve(A, b)
        return m[i]


# Example: Weather model
transition_matrix = np.array([
    [0.7, 0.3],    # Sunny -> [Sunny, Rainy]
    [0.4, 0.6]     # Rainy -> [Sunny, Rainy]
])

mc = MarkovChain(transition_matrix, state_names=["Sunny", "Rainy"])

# Stationary distribution
pi = mc.stationary_distribution()
print(f"Stationary distribution: {pi}")
print(f"Long-run probability of Sunny: {pi[0]:.3f}")

# Simulate path
path = mc.simulate(100)
print(f"\\nSimulated path (first 20): {path[:20]}")

# Mean first passage time
mfpt_sunny_to_rainy = mc.mean_first_passage_time(0, 1)
print(f"\\nMean time from Sunny to Rainy: {mfpt_sunny_to_rainy:.2f} days")


# ======================
# 2. Markov Switching Model with statsmodels
# ======================

# Generate data with regime switches
np.random.seed(42)
n = 500

# Regime 1: Low volatility
regime1 = np.random.randn(n//2) * 0.5 + 1.0

# Regime 2: High volatility
regime2 = np.random.randn(n//2) * 2.0 + 2.0

# Combine with switches
data = np.concatenate([regime1[:100], regime2[:100],
                      regime1[100:200], regime2[100:200],
                      regime1[200:]])

# Fit Markov switching model
mod = MarkovRegression(data, k_regimes=2, trend='c')
res = mod.fit()

print("\\nMarkov Switching Model Results:")
print(res.summary())

# Smoothed probabilities
smoothed_probs = res.smoothed_marginal_probabilities

# Plot
fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 8))

ax1.plot(data)
ax1.set_title("Time Series Data")
ax1.set_ylabel("Value")

ax2.plot(smoothed_probs[0], label="Regime 0")
ax2.plot(smoothed_probs[1], label="Regime 1")
ax2.set_title("Regime Probabilities")
ax2.set_ylabel("Probability")
ax2.set_xlabel("Time")
ax2.legend()
plt.tight_layout()
plt.savefig('markov_switching.png', dpi=300)


# ===================
# 3. Hidden Markov Model
# ===================

class HMM:
    """
    Hidden Markov Model implementation.
    """

    def __init__(self, transition_matrix, emission_matrix, initial_prob):
        self.A = np.array(transition_matrix)  # Transition
        self.B = np.array(emission_matrix)    # Emission
        self.pi = np.array(initial_prob)      # Initial

        self.n_states = self.A.shape[0]
        self.n_observations = self.B.shape[1]

    def forward(self, observations):
        """
        Forward algorithm: Compute P(observations | model).
        """
        T = len(observations)
        alpha = np.zeros((T, self.n_states))

        # Initialization
        alpha[0] = self.pi * self.B[:, observations[0]]

        # Recursion
        for t in range(1, T):
            for j in range(self.n_states):
                alpha[t, j] = (alpha[t-1] @ self.A[:, j]) * \\
                              self.B[j, observations[t]]

        return alpha, alpha[-1].sum()

    def viterbi(self, observations):
        """
        Viterbi algorithm: Find most likely state sequence.
        """
        T = len(observations)
        delta = np.zeros((T, self.n_states))
        psi = np.zeros((T, self.n_states), dtype=int)

        # Initialization
        delta[0] = self.pi * self.B[:, observations[0]]

        # Recursion
        for t in range(1, T):
            for j in range(self.n_states):
                temp = delta[t-1] * self.A[:, j]
                delta[t, j] = np.max(temp) * self.B[j, observations[t]]
                psi[t, j] = np.argmax(temp)

        # Backtracking
        path = np.zeros(T, dtype=int)
        path[-1] = np.argmax(delta[-1])

        for t in range(T-2, -1, -1):
            path[t] = psi[t+1, path[t+1]]

        return path, delta[-1].max()


# Example: Dishonest casino
# States: Fair (0), Loaded (1)
# Observations: 1, 2, 3, 4, 5, 6

transition = np.array([
    [0.95, 0.05],  # Fair -> [Fair, Loaded]
    [0.10, 0.90]   # Loaded -> [Fair, Loaded]
])

# Fair die: uniform, Loaded die: biased towards 6
emission = np.array([
    [1/6, 1/6, 1/6, 1/6, 1/6, 1/6],  # Fair
    [0.1, 0.1, 0.1, 0.1, 0.1, 0.5]   # Loaded
])

initial = np.array([0.5, 0.5])

hmm = HMM(transition, emission, initial)

# Simulate observations (1-indexed, subtract 1 for 0-indexing)
observations = np.array([3, 3, 6, 6, 6, 1, 6, 6, 5, 6]) - 1

# Forward algorithm
alpha, prob = hmm.forward(observations)
print(f"\\nP(observations | HMM) = {prob:.6e}")

# Viterbi algorithm
path, max_prob = hmm.viterbi(observations)
state_names = ["Fair", "Loaded"]
print(f"\\nMost likely state sequence:")
print([state_names[s] for s in path])
print(f"Observations: {observations + 1}")`}
          </pre>
        </div>
      </section>

      <section className="mt-3">
        <h2>8. Applications in Deep Learning</h2>

        <div className="info-box example">
          <h4>1. Sequence-to-Sequence Models</h4>
          <p>
            RNNs, LSTMs, and Transformers can be viewed as parameterized Markov models with learned
            transition dynamics:
          </p>
          <BlockMath>{`h_t = f(h_{t-1}, x_t; \\theta)`}</BlockMath>
          <p>The hidden state h_t encodes the Markov state.</p>
        </div>

        <div className="info-box example mt-2">
          <h4>2. Reinforcement Learning: MDPs</h4>
          <p>
            Markov Decision Processes extend Markov chains with actions and rewards:
          </p>
          <BlockMath>{`P(s_{t+1} | s_t, a_t)`}</BlockMath>
          <p>
            <strong>Bellman Equation:</strong>
          </p>
          <BlockMath>{`V(s) = \\max_a \\left[R(s,a) + \\gamma \\sum_{s'} P(s'|s,a) V(s')\\right]`}</BlockMath>
        </div>

        <div className="info-box example mt-2">
          <h4>3. Language Models</h4>
          <p>
            N-gram models are simple Markov models:
          </p>
          <BlockMath>{`P(w_t | w_1, ..., w_{t-1}) \\approx P(w_t | w_{t-n+1}, ..., w_{t-1})`}</BlockMath>
          <p>Modern neural language models learn richer Markovian dynamics.</p>
        </div>
      </section>

      <section className="mt-3">
        <h2>9. Exercises</h2>

        <div className="exercise">
          <div className="exercise-header">
            <h3>Exercise 1: Stationary Distribution</h3>
            <span className="exercise-difficulty" style={{ background: '#10b981', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '4px' }}>
              Medium
            </span>
          </div>
          <p>
            Consider a 3-state Markov chain with transition matrix:
          </p>
          <BlockMath>{`P = \\begin{bmatrix}
0.5 & 0.3 & 0.2 \\\\
0.2 & 0.6 & 0.2 \\\\
0.1 & 0.4 & 0.5
\\end{bmatrix}`}</BlockMath>
          <p>Compute the stationary distribution.</p>
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
              <p>We need to solve πᵀP = πᵀ, which gives us the system:</p>
              <ul>
                <li>0.5π₁ + 0.2π₂ + 0.1π₃ = π₁</li>
                <li>0.3π₁ + 0.6π₂ + 0.4π₃ = π₂</li>
                <li>0.2π₁ + 0.2π₂ + 0.5π₃ = π₃</li>
                <li>π₁ + π₂ + π₃ = 1</li>
              </ul>
              <pre className="code-block">
                {`import numpy as np
from scipy.linalg import eig

P = np.array([[0.5, 0.3, 0.2],
              [0.2, 0.6, 0.2],
              [0.1, 0.4, 0.5]])

eigenvalues, eigenvectors = eig(P.T)
idx = np.argmin(np.abs(eigenvalues - 1))
pi = np.real(eigenvectors[:, idx])
pi = pi / pi.sum()

print(f"Stationary distribution: {pi}")
# Output: [0.217, 0.478, 0.304]`}
              </pre>
            </div>
          )}
        </div>
      </section>

      <section className="mt-3">
        <h2>10. Further Reading</h2>
        <div className="info-box example">
          <h4>Essential Resources</h4>
          <ul>
            <li>
              <strong>Books:</strong>
              <ul>
                <li>"Introduction to Probability Models" by Sheldon Ross</li>
                <li>"Markov Chains" by J.R. Norris</li>
                <li>"Pattern Recognition and Machine Learning" by Bishop (Chapter 13)</li>
              </ul>
            </li>
            <li>
              <strong>Papers:</strong>
              <ul>
                <li>Rabiner (1989): "A Tutorial on Hidden Markov Models"</li>
                <li>Baum et al. (1970): "A Maximization Technique in Statistical Analysis of Probabilistic Functions of Markov Chains"</li>
              </ul>
            </li>
            <li>
              <strong>Software:</strong>
              <ul>
                <li>statsmodels - Markov switching models</li>
                <li>hmmlearn - Hidden Markov Models</li>
                <li>pomegranate - Probabilistic models including HMMs</li>
              </ul>
            </li>
          </ul>
        </div>
      </section>

      <ChapterCompletionButton chapterId="markov-models" />
    </div>
  );
};
