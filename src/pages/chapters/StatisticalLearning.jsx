import { useState } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import Plot from 'react-plotly.js';
import { Code, TrendingUp, AlertCircle } from 'lucide-react';
import { ChapterCompletionButton } from '../../components/chapter/ChapterCompletionButton';

export const StatisticalLearning = () => {
  const [showSolution1, setShowSolution1] = useState(false);
  const [complexity, setComplexity] = useState(5);
  const [noiseLev, setNoiseLevel] = useState(0.3);

  // Generate bias-variance tradeoff data
  const generateBiasVarianceData = () => {
    const modelComplexities = Array.from({ length: 20 }, (_, i) => i + 1);

    const bias = modelComplexities.map(c => Math.max(0.5, 10 / c));
    const variance = modelComplexities.map(c => Math.min(5, c / 4));
    const totalError = bias.map((b, i) => b + variance[i]);

    return { modelComplexities, bias, variance, totalError };
  };

  const { modelComplexities, bias, variance, totalError } = generateBiasVarianceData();

  // Generate learning curves
  const generateLearningCurves = () => {
    const trainSizes = [10, 20, 50, 100, 200, 500, 1000, 2000];

    // High bias model (underfitting)
    const trainErrorHigh = trainSizes.map(n => 0.45 - 0.1 / Math.sqrt(n));
    const testErrorHigh = trainSizes.map(n => 0.50 - 0.05 / Math.sqrt(n));

    // High variance model (overfitting)
    const trainErrorLow = trainSizes.map(n => 0.05 + 0.02 * Math.log(n) / Math.log(2000));
    const testErrorLow = trainSizes.map(n => 0.80 - 0.40 / Math.sqrt(n));

    // Good fit
    const trainErrorGood = trainSizes.map(n => 0.15 + 0.05 / Math.sqrt(n));
    const testErrorGood = trainSizes.map(n => 0.20 - 0.03 / Math.sqrt(n));

    return {
      trainSizes,
      trainErrorHigh, testErrorHigh,
      trainErrorLow, testErrorLow,
      trainErrorGood, testErrorGood
    };
  };

  const learningData = generateLearningCurves();

  return (
    <div className="chapter-content fade-in">
      <div className="hero" style={{ marginBottom: '2rem' }}>
        <h1>Statistical Learning Theory</h1>
        <p>The mathematical foundations of machine learning and deep learning</p>
      </div>

      <section>
        <h2>1. The Learning Problem</h2>
        <div className="info-box definition">
          <h4>Supervised Learning Framework</h4>
          <p>Given training data <InlineMath>{'\\{(x_i, y_i)\\}_{i=1}^n'}</InlineMath> drawn i.i.d. from unknown distribution <InlineMath>{'P(X, Y)'}</InlineMath>:</p>
          <ul style={{ marginTop: '1rem' }}>
            <li><strong>Goal:</strong> Find function <InlineMath>{'f: \\mathcal{X} \\to \\mathcal{Y}'}</InlineMath> that minimizes expected loss</li>
            <li><strong>Risk (Expected Loss):</strong> <BlockMath>{'R(f) = \\mathbb{E}_{(X,Y) \\sim P}[L(Y, f(X))]'}</BlockMath></li>
            <li><strong>Empirical Risk:</strong> <BlockMath>{'\\hat{R}(f) = \\frac{1}{n} \\sum_{i=1}^n L(y_i, f(x_i))'}</BlockMath></li>
            <li><strong>Challenge:</strong> We don't have access to P, only finite sample!</li>
          </ul>
        </div>
      </section>

      <section className="mt-3">
        <h2>2. Bias-Variance Tradeoff</h2>
        <p>The fundamental tradeoff in supervised learning that explains why models generalize.</p>

        <div className="info-box theorem">
          <h4>Bias-Variance Decomposition</h4>
          <p>For squared loss, the expected test error can be decomposed as:</p>
          <BlockMath>{`\\mathbb{E}[(Y - \\hat{f}(X))^2] = \\underbrace{(\\mathbb{E}[\\hat{f}(X)] - f(X))^2}_{\\text{Bias}^2} + \\underbrace{\\mathbb{E}[(\\hat{f}(X) - \\mathbb{E}[\\hat{f}(X)])^2]}_{\\text{Variance}} + \\underbrace{\\sigma^2}_{\\text{Irreducible Error}}`}</BlockMath>
          <p style={{ marginTop: '1rem' }}><strong>Intuition:</strong></p>
          <ul>
            <li><strong>Bias:</strong> Error from wrong assumptions (underfitting)</li>
            <li><strong>Variance:</strong> Error from sensitivity to training data (overfitting)</li>
            <li><strong>Irreducible Error:</strong> Noise in data</li>
          </ul>
        </div>

        <div className="interactive-viz">
          <h3>Interactive: Bias-Variance Tradeoff</h3>
          <Plot
            data={[
              {
                x: modelComplexities,
                y: bias,
                type: 'scatter',
                mode: 'lines+markers',
                name: 'Bias²',
                line: { color: '#ef4444', width: 3 },
                marker: { size: 8 }
              },
              {
                x: modelComplexities,
                y: variance,
                type: 'scatter',
                mode: 'lines+markers',
                name: 'Variance',
                line: { color: '#3b82f6', width: 3 },
                marker: { size: 8 }
              },
              {
                x: modelComplexities,
                y: totalError,
                type: 'scatter',
                mode: 'lines+markers',
                name: 'Total Error',
                line: { color: '#10b981', width: 3, dash: 'dash' },
                marker: { size: 10, symbol: 'diamond' }
              },
              {
                x: [complexity],
                y: [bias[complexity - 1] + variance[complexity - 1]],
                type: 'scatter',
                mode: 'markers',
                name: 'Current Model',
                marker: { size: 15, color: '#f59e0b', symbol: 'star' }
              }
            ]}
            layout={{
              title: 'Bias-Variance Tradeoff',
              xaxis: { title: 'Model Complexity', gridcolor: '#e5e7eb' },
              yaxis: { title: 'Error', gridcolor: '#e5e7eb' },
              plot_bgcolor: '#f9fafb',
              paper_bgcolor: '#ffffff',
              hovermode: 'closest',
              showlegend: true
            }}
            config={{ responsive: true, displayModeBar: false }}
            style={{ width: '100%', height: '400px' }}
          />
          <div className="controls mt-2">
            <div className="control-group">
              <label>Model Complexity: {complexity}</label>
              <input
                type="range"
                min="1"
                max="20"
                value={complexity}
                onChange={(e) => setComplexity(parseInt(e.target.value))}
              />
            </div>
          </div>
          <div className="info-box warning mt-2">
            <h4>Interpretation</h4>
            <p>Current complexity: {complexity}</p>
            <p>Bias²: {bias[complexity - 1]?.toFixed(3)}</p>
            <p>Variance: {variance[complexity - 1]?.toFixed(3)}</p>
            <p>Total Error: {totalError[complexity - 1]?.toFixed(3)}</p>
            {complexity < 8 && <p><AlertCircle size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />Too simple - high bias (underfitting)</p>}
            {complexity > 12 && <p><AlertCircle size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />Too complex - high variance (overfitting)</p>}
            {complexity >= 8 && complexity <= 12 && <p><TrendingUp size={16} style={{ display: 'inline', marginRight: '0.5rem', color: '#10b981' }} />Sweet spot - good generalization!</p>}
          </div>
        </div>
      </section>

      <section className="mt-3">
        <h2>3. Learning Curves</h2>
        <p>Understanding how training set size affects model performance</p>

        <div className="interactive-viz">
          <h3>Interactive: Learning Curves for Different Scenarios</h3>
          <Plot
            data={[
              // High Bias (Underfitting)
              {
                x: learningData.trainSizes,
                y: learningData.trainErrorHigh,
                type: 'scatter',
                mode: 'lines+markers',
                name: 'High Bias - Train',
                line: { color: '#ef4444', width: 2, dash: 'dot' }
              },
              {
                x: learningData.trainSizes,
                y: learningData.testErrorHigh,
                type: 'scatter',
                mode: 'lines+markers',
                name: 'High Bias - Test',
                line: { color: '#ef4444', width: 2 }
              },
              // High Variance (Overfitting)
              {
                x: learningData.trainSizes,
                y: learningData.trainErrorLow,
                type: 'scatter',
                mode: 'lines+markers',
                name: 'High Variance - Train',
                line: { color: '#3b82f6', width: 2, dash: 'dot' }
              },
              {
                x: learningData.trainSizes,
                y: learningData.testErrorLow,
                type: 'scatter',
                mode: 'lines+markers',
                name: 'High Variance - Test',
                line: { color: '#3b82f6', width: 2 }
              },
              // Good Fit
              {
                x: learningData.trainSizes,
                y: learningData.trainErrorGood,
                type: 'scatter',
                mode: 'lines+markers',
                name: 'Good Fit - Train',
                line: { color: '#10b981', width: 3, dash: 'dot' }
              },
              {
                x: learningData.trainSizes,
                y: learningData.testErrorGood,
                type: 'scatter',
                mode: 'lines+markers',
                name: 'Good Fit - Test',
                line: { color: '#10b981', width: 3 }
              }
            ]}
            layout={{
              title: 'Learning Curves: Diagnosing Model Issues',
              xaxis: {
                title: 'Training Set Size',
                type: 'log',
                gridcolor: '#e5e7eb'
              },
              yaxis: { title: 'Error', gridcolor: '#e5e7eb' },
              plot_bgcolor: '#f9fafb',
              paper_bgcolor: '#ffffff',
              hovermode: 'closest',
              showlegend: true
            }}
            config={{ responsive: true, displayModeBar: false }}
            style={{ width: '100%', height: '450px' }}
          />
        </div>

        <div className="info-box example mt-2">
          <h4>How to Use Learning Curves</h4>
          <ul>
            <li><strong>High Bias (Red):</strong> Train and test errors converge but both high → Get more features, increase model complexity</li>
            <li><strong>High Variance (Blue):</strong> Large gap between train and test → Get more data, reduce complexity, add regularization</li>
            <li><strong>Good Fit (Green):</strong> Converging with low error → Model is appropriate!</li>
          </ul>
        </div>
      </section>

      <section className="mt-3">
        <h2>4. Regularization</h2>
        <p>Preventing overfitting by adding constraints to the optimization</p>

        <div className="info-box theorem">
          <h4>Regularized Empirical Risk Minimization</h4>
          <BlockMath>{`\\hat{f} = \\arg\\min_{f \\in \\mathcal{F}} \\left[ \\frac{1}{n} \\sum_{i=1}^n L(y_i, f(x_i)) + \\lambda \\Omega(f) \\right]`}</BlockMath>
          <p>where <InlineMath>{'\\Omega(f)'}</InlineMath> is the regularization term and <InlineMath>{'\\lambda > 0'}</InlineMath> controls regularization strength.</p>
        </div>

        <div className="chapters-grid mt-2">
          <div className="chapter-card">
            <h3>L2 Regularization (Ridge)</h3>
            <BlockMath>{'\\Omega(\\mathbf{w}) = \\|\\mathbf{w}\\|_2^2 = \\sum_{j=1}^p w_j^2'}</BlockMath>
            <p className="text-muted mt-1">Shrinks coefficients, keeps all features</p>
            <p><strong>Equivalent to:</strong> Gaussian prior on weights</p>
            <p><strong>Use when:</strong> Many correlated features</p>
          </div>

          <div className="chapter-card">
            <h3>L1 Regularization (Lasso)</h3>
            <BlockMath>{'\\Omega(\\mathbf{w}) = \\|\\mathbf{w}\\|_1 = \\sum_{j=1}^p |w_j|'}</BlockMath>
            <p className="text-muted mt-1">Promotes sparsity, feature selection</p>
            <p><strong>Equivalent to:</strong> Laplace prior on weights</p>
            <p><strong>Use when:</strong> Need feature selection</p>
          </div>

          <div className="chapter-card">
            <h3>Elastic Net</h3>
            <BlockMath>{'\\Omega(\\mathbf{w}) = \\alpha \\|\\mathbf{w}\\|_1 + (1-\\alpha) \\|\\mathbf{w}\\|_2^2'}</BlockMath>
            <p className="text-muted mt-1">Best of both worlds</p>
            <p><strong>Use when:</strong> High-dimensional data with grouped variables</p>
          </div>
        </div>
      </section>

      <section className="mt-3">
        <h2>5. Cross-Validation</h2>
        <div className="info-box definition">
          <h4>K-Fold Cross-Validation</h4>
          <ol>
            <li>Split data into K folds</li>
            <li>For each fold k:
              <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
                <li>Train on K-1 folds</li>
                <li>Validate on fold k</li>
              </ul>
            </li>
            <li>Average validation errors</li>
          </ol>
          <BlockMath>{'CV = \\frac{1}{K} \\sum_{k=1}^K \\text{Error}_k'}</BlockMath>
          <p><strong>Common choices:</strong> K = 5 or K = 10</p>
          <p><strong>Special case:</strong> Leave-One-Out CV (LOOCV) when K = n</p>
        </div>
      </section>

      <section className="mt-3">
        <h2>6. PAC Learning Framework</h2>
        <div className="info-box theorem">
          <h4>Probably Approximately Correct (PAC) Learning</h4>
          <p>A hypothesis class <InlineMath>{'\\mathcal{H}'}</InlineMath> is PAC-learnable if there exists algorithm A such that for any:</p>
          <ul>
            <li>Target concept <InlineMath>{'c \\in \\mathcal{H}'}</InlineMath></li>
            <li>Distribution P over <InlineMath>{'\\mathcal{X}'}</InlineMath></li>
            <li>Accuracy <InlineMath>{'0 < \\epsilon < 1/2'}</InlineMath></li>
            <li>Confidence <InlineMath>{'0 < \\delta < 1/2'}</InlineMath></li>
          </ul>
          <p>Algorithm A produces hypothesis h such that with probability ≥ 1-δ:</p>
          <BlockMath>{'P(h(x) \\neq c(x)) \\leq \\epsilon'}</BlockMath>
          <p>using polynomial number of samples and computation time.</p>
        </div>
      </section>

      <section className="mt-3">
        <h2>7. VC Dimension</h2>
        <div className="info-box definition">
          <h4>Vapnik-Chervonenkis (VC) Dimension</h4>
          <p>The VC dimension of hypothesis class <InlineMath>{'\\mathcal{H}'}</InlineMath> is the maximum number of points that can be shattered (perfectly classified in all possible ways) by <InlineMath>{'\\mathcal{H}'}</InlineMath>.</p>

          <div className="mt-2">
            <strong>Examples:</strong>
            <ul>
              <li>Linear classifiers in <InlineMath>{'\\mathbb{R}^d'}</InlineMath>: VC-dim = d + 1</li>
              <li>Polynomial classifiers of degree p: VC-dim = <InlineMath>{'O(d^p)'}</InlineMath></li>
              <li>Neural networks with W weights: VC-dim = <InlineMath>{'O(W \\log W)'}</InlineMath></li>
            </ul>
          </div>
        </div>

        <div className="info-box theorem mt-2">
          <h4>VC Generalization Bound</h4>
          <p>With probability at least 1-δ:</p>
          <BlockMath>{`R(h) \\leq \\hat{R}(h) + \\sqrt{\\frac{d(\\log(2n/d) + 1) + \\log(4/\\delta)}{n}}`}</BlockMath>
          <p>where d is the VC dimension and n is the sample size.</p>
          <p><strong>Key insight:</strong> Generalization depends on VC-dim / n, not just n!</p>
        </div>
      </section>

      <section className="mt-3">
        <h2>8. Python Implementation</h2>
        <div className="info-box example">
          <div className="code-header">
            <Code size={18} />
            <span>Python: Complete Statistical Learning Pipeline</span>
          </div>
          <pre className="code-block" style={{ maxHeight: '500px', overflow: 'auto' }}>
{`import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import (
    train_test_split, cross_val_score,
    learning_curve, validation_curve, GridSearchCV
)
from sklearn.linear_model import Ridge, Lasso, ElasticNet
from sklearn.preprocessing import StandardScaler, PolynomialFeatures
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_squared_error, r2_score
import statsmodels.api as sm

# Generate synthetic data with bias-variance tradeoff
np.random.seed(42)
n = 200
X = np.linspace(0, 10, n).reshape(-1, 1)
y_true = np.sin(X).ravel() + 0.5 * X.ravel()
y = y_true + np.random.randn(n) * 0.3

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42
)

# ============================================================================
# 1. BIAS-VARIANCE TRADEOFF DEMONSTRATION
# ============================================================================

def demonstrate_bias_variance():
    """Show bias-variance tradeoff with polynomial regression."""

    degrees = [1, 3, 5, 10, 15]
    fig, axes = plt.subplots(2, 3, figsize=(15, 10))
    axes = axes.ravel()

    for idx, degree in enumerate(degrees):
        ax = axes[idx]

        # Fit polynomial
        poly = PolynomialFeatures(degree)
        X_poly_train = poly.fit_transform(X_train)
        X_poly_test = poly.transform(X_test)

        model = Ridge(alpha=0.01)  # Small regularization
        model.fit(X_poly_train, y_train)

        # Predictions
        X_plot = np.linspace(0, 10, 300).reshape(-1, 1)
        X_plot_poly = poly.transform(X_plot)
        y_plot = model.predict(X_plot_poly)

        # Plot
        ax.scatter(X_train, y_train, alpha=0.5, label='Train')
        ax.scatter(X_test, y_test, alpha=0.5, label='Test', color='orange')
        ax.plot(X_plot, y_plot, 'r-', linewidth=2, label='Model')

        # Calculate errors
        train_mse = mean_squared_error(y_train, model.predict(X_poly_train))
        test_mse = mean_squared_error(y_test, model.predict(X_poly_test))

        ax.set_title(f'Degree {degree}\\nTrain MSE: {train_mse:.3f}, Test MSE: {test_mse:.3f}')
        ax.legend()
        ax.grid(True, alpha=0.3)

    axes[-1].axis('off')
    plt.tight_layout()
    plt.savefig('bias_variance_demo.png', dpi=300)
    print("Saved: bias_variance_demo.png")

# ============================================================================
# 2. LEARNING CURVES
# ============================================================================

def plot_learning_curves(estimator, X, y, title):
    """Generate and plot learning curves."""

    train_sizes, train_scores, test_scores = learning_curve(
        estimator, X, y, cv=5,
        train_sizes=np.linspace(0.1, 1.0, 10),
        scoring='neg_mean_squared_error',
        n_jobs=-1
    )

    train_mean = -train_scores.mean(axis=1)
    train_std = train_scores.std(axis=1)
    test_mean = -test_scores.mean(axis=1)
    test_std = test_scores.std(axis=1)

    plt.figure(figsize=(10, 6))
    plt.plot(train_sizes, train_mean, label='Training error', linewidth=2)
    plt.fill_between(train_sizes, train_mean - train_std,
                     train_mean + train_std, alpha=0.2)

    plt.plot(train_sizes, test_mean, label='Validation error', linewidth=2)
    plt.fill_between(train_sizes, test_mean - test_std,
                     test_mean + test_std, alpha=0.2)

    plt.xlabel('Training Set Size')
    plt.ylabel('Mean Squared Error')
    plt.title(title)
    plt.legend()
    plt.grid(True, alpha=0.3)
    plt.savefig(f'learning_curve_{title.replace(" ", "_")}.png', dpi=300)

# Example: Underfitting (high bias)
pipe_simple = Pipeline([
    ('poly', PolynomialFeatures(degree=1)),
    ('model', Ridge(alpha=1.0))
])
plot_learning_curves(pipe_simple, X, y, 'High Bias (Underfitting)')

# Example: Overfitting (high variance)
pipe_complex = Pipeline([
    ('poly', PolynomialFeatures(degree=15)),
    ('model', Ridge(alpha=0.0001))
])
plot_learning_curves(pipe_complex, X, y, 'High Variance (Overfitting)')

# Example: Good fit
pipe_good = Pipeline([
    ('poly', PolynomialFeatures(degree=5)),
    ('model', Ridge(alpha=0.1))
])
plot_learning_curves(pipe_good, X, y, 'Good Fit')

# ============================================================================
# 3. REGULARIZATION COMPARISON
# ============================================================================

def compare_regularization():
    """Compare Ridge, Lasso, and Elastic Net."""

    # Add more features
    poly = PolynomialFeatures(degree=10)
    X_poly_train = poly.fit_transform(X_train)
    X_poly_test = poly.transform(X_test)

    alphas = np.logspace(-3, 3, 100)

    models = {
        'Ridge': Ridge(),
        'Lasso': Lasso(max_iter=10000),
        'Elastic Net': ElasticNet(l1_ratio=0.5, max_iter=10000)
    }

    fig, axes = plt.subplots(1, 3, figsize=(15, 5))

    for idx, (name, model) in enumerate(models.items()):
        train_scores = []
        test_scores = []

        for alpha in alphas:
            model.set_params(alpha=alpha)
            model.fit(X_poly_train, y_train)

            train_scores.append(mean_squared_error(
                y_train, model.predict(X_poly_train)
            ))
            test_scores.append(mean_squared_error(
                y_test, model.predict(X_poly_test)
            ))

        axes[idx].semilogx(alphas, train_scores, label='Train', linewidth=2)
        axes[idx].semilogx(alphas, test_scores, label='Test', linewidth=2)
        axes[idx].set_xlabel('Alpha (Regularization Strength)')
        axes[idx].set_ylabel('MSE')
        axes[idx].set_title(name)
        axes[idx].legend()
        axes[idx].grid(True, alpha=0.3)

    plt.tight_layout()
    plt.savefig('regularization_comparison.png', dpi=300)
    print("Saved: regularization_comparison.png")

# ============================================================================
# 4. CROSS-VALIDATION
# ============================================================================

def hyperparameter_tuning_cv():
    """Use cross-validation for hyperparameter tuning."""

    pipeline = Pipeline([
        ('poly', PolynomialFeatures()),
        ('scaler', StandardScaler()),
        ('model', Ridge())
    ])

    param_grid = {
        'poly__degree': [1, 2, 3, 4, 5, 6, 7],
        'model__alpha': np.logspace(-3, 2, 20)
    }

    grid_search = GridSearchCV(
        pipeline, param_grid, cv=5,
        scoring='neg_mean_squared_error',
        n_jobs=-1, verbose=1
    )

    grid_search.fit(X_train, y_train)

    print("\\nBest parameters:", grid_search.best_params_)
    print(f"Best CV score: {-grid_search.best_score_:.4f}")

    # Test set performance
    y_pred = grid_search.predict(X_test)
    test_mse = mean_squared_error(y_test, y_pred)
    test_r2 = r2_score(y_test, y_pred)

    print(f"Test MSE: {test_mse:.4f}")
    print(f"Test R²: {test_r2:.4f}")

    return grid_search

# Run all demonstrations
demonstrate_bias_variance()
compare_regularization()
best_model = hyperparameter_tuning_cv()

print("\\nAll demonstrations complete! Check generated plots.")
`}
          </pre>
        </div>
      </section>

      <section className="mt-3">
        <h2>9. Exercises</h2>

        <div className="exercise">
          <div className="exercise-header">
            <h3>Exercise 1: Bias-Variance Analysis</h3>
            <span className="exercise-difficulty" style={{ background: '#f59e0b', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '4px' }}>
              Medium
            </span>
          </div>
          <p>
            You train two models on the same dataset:
          </p>
          <ul>
            <li>Model A: Train error = 0.15, Test error = 0.16</li>
            <li>Model B: Train error = 0.02, Test error = 0.30</li>
          </ul>
          <p>Which model has high bias? High variance? What would you do to improve each?</p>
          <button className="cta-button mt-1" onClick={() => setShowSolution1(!showSolution1)}>
            {showSolution1 ? 'Hide' : 'Show'} Solution
          </button>
          {showSolution1 && (
            <div className="solution mt-2" style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '8px' }}>
              <p><strong>Analysis:</strong></p>
              <p><strong>Model A:</strong> High Bias (Underfitting)</p>
              <ul>
                <li>Train and test errors are similar and both relatively high</li>
                <li>Model is too simple to capture the underlying pattern</li>
                <li><strong>Solutions:</strong>
                  <ul>
                    <li>Increase model complexity (more features, higher degree polynomial)</li>
                    <li>Reduce regularization</li>
                    <li>Use more complex model architecture</li>
                    <li>Engineer better features</li>
                  </ul>
                </li>
              </ul>

              <p className="mt-2"><strong>Model B:</strong> High Variance (Overfitting)</p>
              <ul>
                <li>Large gap between train (0.02) and test (0.30) errors</li>
                <li>Model memorizes training data but doesn't generalize</li>
                <li><strong>Solutions:</strong>
                  <ul>
                    <li>Get more training data</li>
                    <li>Reduce model complexity</li>
                    <li>Add regularization (L1/L2)</li>
                    <li>Use dropout (for neural networks)</li>
                    <li>Early stopping</li>
                    <li>Feature selection</li>
                  </ul>
                </li>
              </ul>
            </div>
          )}
        </div>
      </section>

      <section className="mt-3">
        <h2>10. Further Reading</h2>
        <div className="info-box example">
          <h4>Essential Resources</h4>
          <ul>
            <li><strong>Books:</strong>
              <ul>
                <li>"The Elements of Statistical Learning" by Hastie, Tibshirani & Friedman</li>
                <li>"Understanding Machine Learning" by Shalev-Shwartz & Ben-David</li>
                <li>"Pattern Recognition and Machine Learning" by Christopher Bishop</li>
              </ul>
            </li>
            <li><strong>Papers:</strong>
              <ul>
                <li>Vapnik & Chervonenkis (1971): "On the Uniform Convergence of Relative Frequencies"</li>
                <li>Valiant (1984): "A Theory of the Learnable" (PAC learning)</li>
                <li>Geman et al. (1992): "Neural Networks and the Bias/Variance Dilemma"</li>
              </ul>
            </li>
          </ul>
        </div>
      </section>

      <ChapterCompletionButton chapterId="statistical-learning" />
    </div>
  );
};
