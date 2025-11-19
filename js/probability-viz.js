// Visualization scripts for probability chapter

// Venn diagram for set operations
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('venn-diagram')) {
        initVennDiagram();
    }

    if (document.getElementById('conditional-prob-viz')) {
        initConditionalProbViz();
    }

    if (document.getElementById('bayes-viz')) {
        initBayesViz();
    }
});

function initVennDiagram() {
    // Initial state - show union
    showSetOperation('union');
}

function showSetOperation(operation) {
    const layout = {
        title: getOperationTitle(operation),
        xaxis: { range: [0, 10], showgrid: false, showticklabels: false, zeroline: false },
        yaxis: { range: [0, 10], showgrid: false, showticklabels: false, zeroline: false },
        showlegend: true,
        plot_bgcolor: '#f8fafc',
        paper_bgcolor: '#ffffff',
        margin: { t: 50, r: 50, b: 50, l: 50 }
    };

    let shapes = [];
    let annotations = [];

    // Circle A
    const circleA = {
        type: 'circle',
        xref: 'x',
        yref: 'y',
        x0: 2,
        y0: 3,
        x1: 6,
        y1: 7,
        fillcolor: getColorForOperation(operation, 'A'),
        line: { color: '#2563eb', width: 2 },
        opacity: 0.5
    };

    // Circle B
    const circleB = {
        type: 'circle',
        xref: 'x',
        yref: 'y',
        x0: 4,
        y0: 3,
        x1: 8,
        y1: 7,
        fillcolor: getColorForOperation(operation, 'B'),
        line: { color: '#7c3aed', width: 2 },
        opacity: 0.5
    };

    shapes = [circleA, circleB];

    // Labels
    annotations = [
        {
            x: 3.5,
            y: 5,
            text: 'A',
            showarrow: false,
            font: { size: 20, color: '#2563eb' }
        },
        {
            x: 6.5,
            y: 5,
            text: 'B',
            showarrow: false,
            font: { size: 20, color: '#7c3aed' }
        }
    ];

    layout.shapes = shapes;
    layout.annotations = annotations;

    Plotly.newPlot('venn-diagram', [], layout, { displayModeBar: false });
}

function getOperationTitle(operation) {
    const titles = {
        'union': 'A ∪ B (Union): Elements in A or B',
        'intersection': 'A ∩ B (Intersection): Elements in both A and B',
        'complement': 'A<sup>c</sup> (Complement): Elements not in A',
        'difference': 'A \\ B (Difference): Elements in A but not B'
    };
    return titles[operation];
}

function getColorForOperation(operation, circle) {
    switch (operation) {
        case 'union':
            return circle === 'A' ? 'rgba(37, 99, 235, 0.5)' : 'rgba(124, 58, 237, 0.5)';
        case 'intersection':
            return circle === 'A' ? 'rgba(37, 99, 235, 0.2)' : 'rgba(124, 58, 237, 0.2)';
        case 'complement':
            return circle === 'A' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(124, 58, 237, 0.5)';
        case 'difference':
            return circle === 'A' ? 'rgba(37, 99, 235, 0.5)' : 'rgba(124, 58, 237, 0.2)';
        default:
            return 'rgba(37, 99, 235, 0.5)';
    }
}

// Conditional probability visualization
function initConditionalProbViz() {
    const probASlider = document.getElementById('prob-a');
    const probBSlider = document.getElementById('prob-b');
    const probABSlider = document.getElementById('prob-ab');

    if (!probASlider) return;

    probASlider.addEventListener('input', updateConditionalProbViz);
    probBSlider.addEventListener('input', updateConditionalProbViz);
    probABSlider.addEventListener('input', updateConditionalProbViz);

    updateConditionalProbViz();
}

function updateConditionalProbViz() {
    const probA = parseFloat(document.getElementById('prob-a').value);
    const probB = parseFloat(document.getElementById('prob-b').value);
    let probAB = parseFloat(document.getElementById('prob-ab').value);

    // Update value displays
    document.getElementById('prob-a-value').textContent = probA.toFixed(2);
    document.getElementById('prob-b-value').textContent = probB.toFixed(2);

    // Ensure P(A ∩ B) <= min(P(A), P(B))
    const maxAB = Math.min(probA, probB);
    if (probAB > maxAB) {
        probAB = maxAB;
        document.getElementById('prob-ab').value = probAB;
    }
    document.getElementById('prob-ab').max = maxAB;
    document.getElementById('prob-ab-value').textContent = probAB.toFixed(2);

    // Calculate conditional probabilities
    const probAGivenB = probB > 0 ? probAB / probB : 0;
    const probBGivenA = probA > 0 ? probAB / probA : 0;

    // Create visualization
    const data = [
        {
            x: ['P(A)', 'P(B)', 'P(A∩B)', 'P(A|B)', 'P(B|A)'],
            y: [probA, probB, probAB, probAGivenB, probBGivenA],
            type: 'bar',
            marker: {
                color: ['#2563eb', '#7c3aed', '#06b6d4', '#10b981', '#f59e0b']
            },
            text: [probA.toFixed(3), probB.toFixed(3), probAB.toFixed(3),
                   probAGivenB.toFixed(3), probBGivenA.toFixed(3)],
            textposition: 'outside'
        }
    ];

    const layout = {
        title: 'Probability Values',
        yaxis: { title: 'Probability', range: [0, 1.1] },
        plot_bgcolor: '#f8fafc',
        paper_bgcolor: '#ffffff',
        margin: { t: 50, r: 50, b: 50, l: 50 }
    };

    Plotly.newPlot('conditional-prob-viz', data, layout, { displayModeBar: false });
}

// Bayes' theorem visualization
function initBayesViz() {
    const priorSlider = document.getElementById('prior');
    const likelihoodSlider = document.getElementById('likelihood');
    const likelihoodNotSlider = document.getElementById('likelihood-not');

    if (!priorSlider) return;

    priorSlider.addEventListener('input', () => {
        document.getElementById('prior-value').textContent = parseFloat(priorSlider.value).toFixed(2);
    });

    likelihoodSlider.addEventListener('input', () => {
        document.getElementById('likelihood-value').textContent = parseFloat(likelihoodSlider.value).toFixed(2);
    });

    likelihoodNotSlider.addEventListener('input', () => {
        document.getElementById('likelihood-not-value').textContent = parseFloat(likelihoodNotSlider.value).toFixed(2);
    });

    updateBayesViz();
}

function updateBayesViz() {
    const prior = parseFloat(document.getElementById('prior').value);
    const likelihoodH = parseFloat(document.getElementById('likelihood').value);
    const likelihoodNotH = parseFloat(document.getElementById('likelihood-not').value);

    // Calculate evidence: P(E) = P(E|H)P(H) + P(E|¬H)P(¬H)
    const evidence = likelihoodH * prior + likelihoodNotH * (1 - prior);

    // Calculate posterior: P(H|E) = P(E|H)P(H) / P(E)
    const posterior = (likelihoodH * prior) / evidence;

    // Create visualization comparing prior and posterior
    const data = [
        {
            values: [prior, 1 - prior],
            labels: ['H', '¬H'],
            type: 'pie',
            name: 'Prior',
            domain: { row: 0, column: 0 },
            title: { text: 'Prior P(H)' },
            marker: {
                colors: ['#2563eb', '#e2e8f0']
            },
            textinfo: 'label+percent',
            hoverinfo: 'label+percent'
        },
        {
            values: [posterior, 1 - posterior],
            labels: ['H', '¬H'],
            type: 'pie',
            name: 'Posterior',
            domain: { row: 0, column: 1 },
            title: { text: 'Posterior P(H|E)' },
            marker: {
                colors: ['#10b981', '#e2e8f0']
            },
            textinfo: 'label+percent',
            hoverinfo: 'label+percent'
        }
    ];

    const layout = {
        title: {
            text: `Bayesian Update<br><sub>P(H|E) = ${posterior.toFixed(3)}, P(E) = ${evidence.toFixed(3)}</sub>`,
            font: { size: 18 }
        },
        grid: { rows: 1, columns: 2 },
        showlegend: false,
        plot_bgcolor: '#f8fafc',
        paper_bgcolor: '#ffffff',
        margin: { t: 80, r: 50, b: 50, l: 50 },
        annotations: [
            {
                text: `Prior → Posterior<br>Change: ${((posterior - prior) > 0 ? '+' : '')}${((posterior - prior) * 100).toFixed(1)}%`,
                showarrow: false,
                x: 0.5,
                y: -0.15,
                xref: 'paper',
                yref: 'paper',
                font: { size: 14 }
            }
        ]
    };

    Plotly.newPlot('bayes-viz', data, layout, { displayModeBar: false });
}
