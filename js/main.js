// Main JavaScript for Statistics Learning Platform

// Search functionality
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search');

    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }

    // Progress bar for reading
    window.addEventListener('scroll', updateProgressBar);

    // Initialize solutions toggle
    initializeSolutions();

    // Initialize quiz interactions
    initializeQuizzes();

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Search handler
function handleSearch(event) {
    const query = event.target.value.toLowerCase();
    console.log('Searching for:', query);
    // TODO: Implement search across chapters
    // This would typically integrate with a search index
}

// Update reading progress bar
function updateProgressBar() {
    const progressBar = document.querySelector('.progress-bar');
    if (!progressBar) return;

    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrolled = window.scrollY;
    const progress = (scrolled / documentHeight) * 100;

    progressBar.style.width = progress + '%';
}

// Initialize solution toggles
function initializeSolutions() {
    const toggleButtons = document.querySelectorAll('.solution-toggle');

    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const exercise = this.closest('.exercise');
            const solution = exercise.querySelector('.solution');

            if (solution.classList.contains('show')) {
                solution.classList.remove('show');
                this.textContent = 'Show Solution';
            } else {
                solution.classList.add('show');
                this.textContent = 'Hide Solution';
            }
        });
    });
}

// Initialize quiz interactions
function initializeQuizzes() {
    const quizOptions = document.querySelectorAll('.quiz-option');

    quizOptions.forEach(option => {
        option.addEventListener('click', function() {
            if (this.classList.contains('selected')) return;

            const isCorrect = this.dataset.correct === 'true';
            const allOptions = this.parentElement.querySelectorAll('.quiz-option');

            // Disable all options
            allOptions.forEach(opt => opt.classList.add('selected'));

            // Mark correct/incorrect
            if (isCorrect) {
                this.classList.add('correct');
                showFeedback(this, 'Correct! ' + (this.dataset.explanation || ''));
            } else {
                this.classList.add('incorrect');
                // Show the correct answer
                allOptions.forEach(opt => {
                    if (opt.dataset.correct === 'true') {
                        opt.classList.add('correct');
                    }
                });
                showFeedback(this, 'Incorrect. ' + (this.dataset.explanation || ''));
            }
        });
    });
}

// Show feedback for quiz
function showFeedback(element, message) {
    const feedback = document.createElement('div');
    feedback.className = 'quiz-feedback';
    feedback.textContent = message;
    feedback.style.cssText = 'margin-top: 1rem; padding: 1rem; border-radius: 8px; background: rgba(0,0,0,0.05);';

    const container = element.parentElement.parentElement;
    const existingFeedback = container.querySelector('.quiz-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }
    container.appendChild(feedback);
}

// MathJax configuration
window.MathJax = {
    tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']],
        processEscapes: true,
        processEnvironments: true
    },
    options: {
        skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre']
    }
};

// Utility function to generate random data from various distributions
const Stats = {
    // Generate random normal data
    randomNormal: function(mean = 0, std = 1, size = 100) {
        const data = [];
        for (let i = 0; i < size; i++) {
            // Box-Muller transform
            const u1 = Math.random();
            const u2 = Math.random();
            const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
            data.push(mean + std * z0);
        }
        return data;
    },

    // Generate random uniform data
    randomUniform: function(min = 0, max = 1, size = 100) {
        const data = [];
        for (let i = 0; i < size; i++) {
            data.push(min + Math.random() * (max - min));
        }
        return data;
    },

    // Generate random exponential data
    randomExponential: function(lambda = 1, size = 100) {
        const data = [];
        for (let i = 0; i < size; i++) {
            data.push(-Math.log(1 - Math.random()) / lambda);
        }
        return data;
    },

    // Calculate mean
    mean: function(data) {
        return data.reduce((a, b) => a + b, 0) / data.length;
    },

    // Calculate standard deviation
    std: function(data) {
        const m = this.mean(data);
        const variance = data.reduce((sum, x) => sum + Math.pow(x - m, 2), 0) / data.length;
        return Math.sqrt(variance);
    },

    // Calculate histogram bins
    histogram: function(data, bins = 30) {
        const min = Math.min(...data);
        const max = Math.max(...data);
        const binWidth = (max - min) / bins;

        const hist = new Array(bins).fill(0);
        const edges = [];

        for (let i = 0; i <= bins; i++) {
            edges.push(min + i * binWidth);
        }

        data.forEach(value => {
            const binIndex = Math.min(Math.floor((value - min) / binWidth), bins - 1);
            hist[binIndex]++;
        });

        return { counts: hist, edges: edges };
    }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Stats;
}
