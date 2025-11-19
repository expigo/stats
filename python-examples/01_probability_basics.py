"""
Probability Theory Basics - Python Implementation
==================================================

This module demonstrates fundamental probability concepts with practical
implementations for machine learning applications.

Topics Covered:
1. Sample spaces and events
2. Probability calculations
3. Conditional probability
4. Bayes' theorem
5. Independence testing

Author: Statistics for ML/DL Course
"""

import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from typing import List, Set, Callable, Dict
from collections import defaultdict

# Set random seed for reproducibility
np.random.seed(42)
sns.set_style("whitegrid")


class ProbabilitySpace:
    """
    A class to represent and work with finite probability spaces.

    This is useful for discrete probability problems and serves as
    a foundation for understanding measure-theoretic probability.
    """

    def __init__(self, outcomes: List, probabilities: List[float] = None):
        """
        Initialize a probability space.

        Parameters:
        -----------
        outcomes : list
            List of all possible outcomes (sample space Ω)
        probabilities : list of float, optional
            Probability of each outcome. If None, assumes uniform distribution.

        Examples:
        ---------
        >>> # Fair die
        >>> die = ProbabilitySpace([1, 2, 3, 4, 5, 6])
        >>> # Biased coin
        >>> coin = ProbabilitySpace(['H', 'T'], [0.6, 0.4])
        """
        self.outcomes = outcomes
        n = len(outcomes)

        if probabilities is None:
            self.probabilities = np.ones(n) / n
        else:
            assert len(probabilities) == n, "Probabilities must match outcomes"
            assert np.allclose(sum(probabilities), 1.0), "Probabilities must sum to 1"
            assert all(p >= 0 for p in probabilities), "Probabilities must be non-negative"
            self.probabilities = np.array(probabilities)

        self.prob_dict = dict(zip(outcomes, self.probabilities))

    def P(self, event):
        """
        Calculate probability of an event.

        Parameters:
        -----------
        event : set, list, or callable
            Event (subset of sample space) or predicate function

        Returns:
        --------
        float : Probability of the event

        Examples:
        ---------
        >>> die = ProbabilitySpace([1, 2, 3, 4, 5, 6])
        >>> die.P({2, 4, 6})  # P(even)
        0.5
        >>> die.P(lambda x: x > 4)  # P(roll > 4)
        0.333...
        """
        if callable(event):
            # Event defined by predicate function
            event = [o for o in self.outcomes if event(o)]

        return sum(self.prob_dict.get(outcome, 0) for outcome in event)

    def conditional_prob(self, A, B):
        """
        Calculate conditional probability P(A|B) = P(A ∩ B) / P(B).

        Parameters:
        -----------
        A : set, list, or callable
            Event A
        B : set, list, or callable
            Event B (conditioning event)

        Returns:
        --------
        float : P(A|B)

        Raises:
        -------
        ValueError : If P(B) = 0

        Examples:
        ---------
        >>> die = ProbabilitySpace([1, 2, 3, 4, 5, 6])
        >>> die.conditional_prob({2, 4, 6}, {4, 5, 6})  # P(even | > 3)
        0.333...
        """
        A_set = set(A) if not callable(A) else set([o for o in self.outcomes if A(o)])
        B_set = set(B) if not callable(B) else set([o for o in self.outcomes if B(o)])

        P_B = self.P(B_set)
        if P_B == 0:
            raise ValueError("P(B) = 0: conditional probability undefined")

        A_and_B = A_set.intersection(B_set)
        return self.P(A_and_B) / P_B

    def are_independent(self, A, B, tolerance=1e-10):
        """
        Test if events A and B are independent.

        Parameters:
        -----------
        A, B : events
        tolerance : float
            Numerical tolerance for equality check

        Returns:
        --------
        bool : True if A and B are independent
        """
        A_set = set(A) if not callable(A) else set([o for o in self.outcomes if A(o)])
        B_set = set(B) if not callable(B) else set([o for o in self.outcomes if B(o)])

        P_A = self.P(A_set)
        P_B = self.P(B_set)
        P_A_and_B = self.P(A_set.intersection(B_set))

        return abs(P_A_and_B - P_A * P_B) < tolerance


def bayes_theorem(prior: float, likelihood: float, evidence: float) -> float:
    """
    Apply Bayes' theorem to calculate posterior probability.

    P(H|E) = P(E|H) * P(H) / P(E)

    Parameters:
    -----------
    prior : float
        P(H) - prior probability of hypothesis
    likelihood : float
        P(E|H) - likelihood of evidence given hypothesis
    evidence : float
        P(E) - marginal probability of evidence

    Returns:
    --------
    float : P(H|E) - posterior probability

    Examples:
    ---------
    >>> # Medical test example
    >>> P_disease = 0.01  # 1% prevalence
    >>> P_pos_given_disease = 0.95  # 95% sensitivity
    >>> P_pos_given_healthy = 0.10  # 10% false positive rate
    >>> P_pos = P_pos_given_disease * P_disease + P_pos_given_healthy * (1 - P_disease)
    >>> posterior = bayes_theorem(P_disease, P_pos_given_disease, P_pos)
    >>> print(f"P(disease | positive test) = {posterior:.4f}")
    """
    return (likelihood * prior) / evidence


def law_of_total_probability(event_probs: Dict, conditional_probs: Dict) -> float:
    """
    Calculate P(A) using law of total probability.

    P(A) = Σ P(A|B_i) * P(B_i)

    Parameters:
    -----------
    event_probs : dict
        Dictionary mapping events to their probabilities P(B_i)
    conditional_probs : dict
        Dictionary mapping events to conditional probabilities P(A|B_i)

    Returns:
    --------
    float : Total probability P(A)

    Examples:
    ---------
    >>> # Manufacturing example: defect rates from 3 factories
    >>> factory_probs = {'F1': 0.3, 'F2': 0.5, 'F3': 0.2}
    >>> defect_rates = {'F1': 0.02, 'F2': 0.01, 'F3': 0.03}
    >>> total_defect_rate = law_of_total_probability(factory_probs, defect_rates)
    >>> print(f"Overall defect rate: {total_defect_rate:.4f}")
    """
    return sum(conditional_probs[event] * event_probs[event]
               for event in event_probs)


class MonteCarloSimulator:
    """
    Monte Carlo simulation for probability estimation.

    This is essential for ML applications where analytical solutions
    are intractable.
    """

    @staticmethod
    def estimate_probability(event_function: Callable,
                            num_samples: int = 100000) -> Dict:
        """
        Estimate probability using Monte Carlo simulation.

        Parameters:
        -----------
        event_function : callable
            Function that returns True if event occurs
        num_samples : int
            Number of Monte Carlo samples

        Returns:
        --------
        dict : Contains probability estimate and confidence interval
        """
        successes = sum(1 for _ in range(num_samples) if event_function())
        p_estimate = successes / num_samples

        # Calculate 95% confidence interval using normal approximation
        std_error = np.sqrt(p_estimate * (1 - p_estimate) / num_samples)
        ci_lower = p_estimate - 1.96 * std_error
        ci_upper = p_estimate + 1.96 * std_error

        return {
            'estimate': p_estimate,
            'std_error': std_error,
            'ci_95': (ci_lower, ci_upper),
            'num_samples': num_samples
        }


# ============================================================================
# EXAMPLES AND APPLICATIONS
# ============================================================================

def example_1_dice_probabilities():
    """Example: Calculate various probabilities for dice rolls."""
    print("=" * 70)
    print("EXAMPLE 1: Dice Probabilities")
    print("=" * 70)

    # Single die
    die = ProbabilitySpace([1, 2, 3, 4, 5, 6])

    print("\nSingle die probabilities:")
    print(f"P(roll is even) = {die.P({2, 4, 6}):.4f}")
    print(f"P(roll > 4) = {die.P(lambda x: x > 4):.4f}")
    print(f"P(roll is 3) = {die.P({3}):.4f}")

    # Conditional probability
    greater_than_3 = {4, 5, 6}
    even = {2, 4, 6}
    p_even_given_greater_3 = die.conditional_prob(even, greater_than_3)
    print(f"\nP(even | roll > 3) = {p_even_given_greater_3:.4f}")

    # Independence test
    is_independent = die.are_independent(even, greater_than_3)
    print(f"Are 'even' and '> 3' independent? {is_independent}")


def example_2_medical_diagnosis():
    """Example: Medical diagnosis with Bayes' theorem (real-world ML application)."""
    print("\n" + "=" * 70)
    print("EXAMPLE 2: Medical Diagnosis (Bayes' Theorem)")
    print("=" * 70)

    # Problem setup
    P_disease = 0.01  # 1% prevalence (prior)
    sensitivity = 0.95  # P(positive | disease)
    specificity = 0.90  # P(negative | no disease)

    # Calculate evidence P(positive test)
    P_positive = sensitivity * P_disease + (1 - specificity) * (1 - P_disease)

    # Apply Bayes' theorem
    P_disease_given_positive = bayes_theorem(P_disease, sensitivity, P_positive)

    print(f"\nDisease prevalence: {P_disease * 100:.1f}%")
    print(f"Test sensitivity: {sensitivity * 100:.1f}%")
    print(f"Test specificity: {specificity * 100:.1f}%")
    print(f"\nP(positive test) = {P_positive:.4f}")
    print(f"P(disease | positive test) = {P_disease_given_positive:.4f}")
    print(f"\nConclusion: Only {P_disease_given_positive * 100:.2f}% of positive")
    print("tests actually indicate disease!")

    # Visualize
    fig, ax = plt.subplots(figsize=(10, 6))
    labels = ['Prior\nP(Disease)', 'Posterior\nP(Disease|Positive)']
    values = [P_disease, P_disease_given_positive]
    colors = ['#3498db', '#e74c3c']

    bars = ax.bar(labels, values, color=colors, alpha=0.7, edgecolor='black', linewidth=2)
    ax.set_ylabel('Probability', fontsize=12)
    ax.set_title('Bayesian Update: Medical Diagnosis', fontsize=14, fontweight='bold')
    ax.set_ylim(0, max(values) * 1.2)

    # Add value labels on bars
    for bar in bars:
        height = bar.get_height()
        ax.text(bar.get_x() + bar.get_width()/2., height,
                f'{height:.4f}',
                ha='center', va='bottom', fontsize=11, fontweight='bold')

    plt.tight_layout()
    plt.savefig('../visualizations/bayes_medical_diagnosis.png', dpi=300, bbox_inches='tight')
    print("\nVisualization saved to: visualizations/bayes_medical_diagnosis.png")


def example_3_monty_hall():
    """Example: Monty Hall problem - classic probability puzzle."""
    print("\n" + "=" * 70)
    print("EXAMPLE 3: Monty Hall Problem")
    print("=" * 70)

    def monty_hall_simulation(strategy='switch', num_trials=10000):
        """
        Simulate Monty Hall problem.

        Parameters:
        -----------
        strategy : str
            'switch' or 'stay'
        num_trials : int
            Number of simulations
        """
        wins = 0

        for _ in range(num_trials):
            # Setup
            doors = [0, 1, 2]
            car_door = np.random.choice(doors)
            initial_choice = np.random.choice(doors)

            # Host opens a door (not car, not chosen)
            available_doors = [d for d in doors
                             if d != car_door and d != initial_choice]
            if available_doors:
                host_opens = np.random.choice(available_doors)
            else:
                # If initial choice is correct, host can open either other door
                host_opens = np.random.choice([d for d in doors
                                              if d != initial_choice])

            # Final choice based on strategy
            if strategy == 'switch':
                final_choice = [d for d in doors
                              if d != initial_choice and d != host_opens][0]
            else:
                final_choice = initial_choice

            if final_choice == car_door:
                wins += 1

        return wins / num_trials

    # Run simulations
    p_win_stay = monty_hall_simulation('stay')
    p_win_switch = monty_hall_simulation('switch')

    print(f"\nSimulation results (10,000 trials):")
    print(f"P(win | stay) = {p_win_stay:.4f}")
    print(f"P(win | switch) = {p_win_switch:.4f}")
    print(f"\nTheoretical values:")
    print(f"P(win | stay) = 0.3333")
    print(f"P(win | switch) = 0.6667")
    print(f"\nConclusion: Always switch! You double your chances of winning.")


def example_4_monte_carlo_pi():
    """Example: Estimate π using Monte Carlo (demonstrates MC methods for ML)."""
    print("\n" + "=" * 70)
    print("EXAMPLE 4: Estimate π using Monte Carlo")
    print("=" * 70)

    def estimate_pi(num_samples):
        """Estimate π by sampling points in unit square."""
        # Generate random points in [0, 1] x [0, 1]
        x = np.random.uniform(0, 1, num_samples)
        y = np.random.uniform(0, 1, num_samples)

        # Check if inside unit circle
        inside_circle = (x**2 + y**2) <= 1

        # π ≈ 4 * (points inside circle) / (total points)
        pi_estimate = 4 * np.sum(inside_circle) / num_samples

        return pi_estimate, x, y, inside_circle

    # Run simulation
    n = 10000
    pi_est, x, y, inside = estimate_pi(n)

    print(f"\nNumber of samples: {n:,}")
    print(f"Estimated π: {pi_est:.6f}")
    print(f"Actual π: {np.pi:.6f}")
    print(f"Error: {abs(pi_est - np.pi):.6f}")

    # Visualize
    fig, ax = plt.subplots(figsize=(8, 8))
    ax.scatter(x[inside], y[inside], c='#3498db', s=1, alpha=0.5, label='Inside circle')
    ax.scatter(x[~inside], y[~inside], c='#e74c3c', s=1, alpha=0.5, label='Outside circle')

    # Draw quarter circle
    theta = np.linspace(0, np.pi/2, 100)
    ax.plot(np.cos(theta), np.sin(theta), 'k-', linewidth=2)

    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.set_aspect('equal')
    ax.legend()
    ax.set_title(f'Monte Carlo Estimation of π\n'
                f'Estimate = {pi_est:.6f}, True value = {np.pi:.6f}',
                fontsize=12, fontweight='bold')
    ax.grid(True, alpha=0.3)

    plt.tight_layout()
    plt.savefig('../visualizations/monte_carlo_pi.png', dpi=300, bbox_inches='tight')
    print("\nVisualization saved to: visualizations/monte_carlo_pi.png")


if __name__ == "__main__":
    # Run all examples
    example_1_dice_probabilities()
    example_2_medical_diagnosis()
    example_3_monty_hall()
    example_4_monte_carlo_pi()

    print("\n" + "=" * 70)
    print("All examples completed successfully!")
    print("=" * 70)
