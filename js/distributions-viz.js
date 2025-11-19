// Visualization scripts for distributions chapter

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('binomial-viz')) {
        initBinomialViz();
    }

    if (document.getElementById('normal-viz')) {
        initNormalViz();
    }
});

// Factorial function
function factorial(n) {
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

// Binomial coefficient
function binomialCoeff(n, k) {
    if (k < 0 || k > n) return 0;
    return factorial(n) / (factorial(k) * factorial(n - k));
}

// Binomial PMF
function binomialPMF(k, n, p) {
    return binomialCoeff(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
}

// Normal PDF
function normalPDF(x, mu, sigma) {
    const coefficient = 1 / (sigma * Math.sqrt(2 * Math.PI));
    const exponent = -Math.pow(x - mu, 2) / (2 * Math.pow(sigma, 2));
    return coefficient * Math.exp(exponent);
}

// Initialize Binomial visualization
function initBinomialViz() {
    const nSlider = document.getElementById('binomial-n');
    const pSlider = document.getElementById('binomial-p');

    if (!nSlider) return;

    nSlider.addEventListener('input', () => {
        document.getElementById('binomial-n-value').textContent = nSlider.value;
    });

    pSlider.addEventListener('input', () => {
        document.getElementById('binomial-p-value').textContent = parseFloat(pSlider.value).toFixed(2);
    });

    updateBinomialViz();
}

function updateBinomialViz() {
    const n = parseInt(document.getElementById('binomial-n').value);
    const p = parseFloat(document.getElementById('binomial-p').value);

    const k_values = [];
    const pmf_values = [];
    const cdf_values = [];

    let cumulative = 0;
    for (let k = 0; k <= n; k++) {
        k_values.push(k);
        const pmf = binomialPMF(k, n, p);
        pmf_values.push(pmf);
        cumulative += pmf;
        cdf_values.push(cumulative);
    }

    // Calculate mean and variance
    const mean = n * p;
    const variance = n * p * (1 - p);
    const std = Math.sqrt(variance);

    // PMF trace
    const tracePMF = {
        x: k_values,
        y: pmf_values,
        type: 'bar',
        name: 'PMF',
        marker: { color: '#2563eb' }
    };

    // CDF trace
    const traceCDF = {
        x: k_values,
        y: cdf_values,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'CDF',
        yaxis: 'y2',
        line: { color: '#7c3aed', width: 2 },
        marker: { size: 6 }
    };

    // Mean line
    const traceMean = {
        x: [mean, mean],
        y: [0, Math.max(...pmf_values)],
        type: 'scatter',
        mode: 'lines',
        name: 'Mean',
        line: { color: '#ef4444', width: 2, dash: 'dash' }
    };

    const layout = {
        title: {
            text: `Binomial Distribution: n=${n}, p=${p}<br><sub>Mean = ${mean.toFixed(2)}, Std = ${std.toFixed(2)}</sub>`,
            font: { size: 18 }
        },
        xaxis: {
            title: 'k (number of successes)',
            gridcolor: '#e2e8f0'
        },
        yaxis: {
            title: 'Probability Mass Function',
            gridcolor: '#e2e8f0'
        },
        yaxis2: {
            title: 'Cumulative Distribution Function',
            overlaying: 'y',
            side: 'right',
            range: [0, 1.1]
        },
        showlegend: true,
        plot_bgcolor: '#f8fafc',
        paper_bgcolor: '#ffffff',
        margin: { t: 80, r: 80, b: 50, l: 50 }
    };

    const config = {
        responsive: true,
        displayModeBar: true,
        displaylogo: false
    };

    Plotly.newPlot('binomial-viz', [tracePMF, traceCDF, traceMean], layout, config);
}

// Initialize Normal distribution visualization
function initNormalViz() {
    const muSlider = document.getElementById('normal-mu');
    const sigmaSlider = document.getElementById('normal-sigma');

    if (!muSlider) return;

    muSlider.addEventListener('input', () => {
        document.getElementById('normal-mu-value').textContent = parseFloat(muSlider.value).toFixed(1);
    });

    sigmaSlider.addEventListener('input', () => {
        document.getElementById('normal-sigma-value').textContent = parseFloat(sigmaSlider.value).toFixed(1);
    });

    updateNormalViz();
}

function updateNormalViz() {
    const mu = parseFloat(document.getElementById('normal-mu').value);
    const sigma = parseFloat(document.getElementById('normal-sigma').value);

    // Generate x values
    const xMin = mu - 4 * sigma;
    const xMax = mu + 4 * sigma;
    const x_values = [];
    const pdf_values = [];
    const steps = 500;

    for (let i = 0; i <= steps; i++) {
        const x = xMin + (xMax - xMin) * i / steps;
        x_values.push(x);
        pdf_values.push(normalPDF(x, mu, sigma));
    }

    // PDF trace
    const tracePDF = {
        x: x_values,
        y: pdf_values,
        type: 'scatter',
        mode: 'lines',
        name: 'PDF',
        line: { color: '#2563eb', width: 3 },
        fill: 'tozeroy',
        fillcolor: 'rgba(37, 99, 235, 0.2)'
    };

    // Mean line
    const traceMean = {
        x: [mu, mu],
        y: [0, normalPDF(mu, mu, sigma)],
        type: 'scatter',
        mode: 'lines',
        name: 'Mean (μ)',
        line: { color: '#ef4444', width: 2, dash: 'dash' }
    };

    // Standard deviation markers
    const traceStdPlus = {
        x: [mu + sigma, mu + sigma],
        y: [0, normalPDF(mu + sigma, mu, sigma)],
        type: 'scatter',
        mode: 'lines',
        name: 'μ ± σ',
        line: { color: '#10b981', width: 2, dash: 'dot' }
    };

    const traceStdMinus = {
        x: [mu - sigma, mu - sigma],
        y: [0, normalPDF(mu - sigma, mu, sigma)],
        type: 'scatter',
        mode: 'lines',
        showlegend: false,
        line: { color: '#10b981', width: 2, dash: 'dot' }
    };

    // Empirical rule regions (68-95-99.7)
    const region68_x = x_values.filter(x => x >= mu - sigma && x <= mu + sigma);
    const region68_y = region68_x.map(x => normalPDF(x, mu, sigma));

    const trace68 = {
        x: region68_x,
        y: region68_y,
        type: 'scatter',
        mode: 'none',
        name: '68% (μ±σ)',
        fill: 'tozeroy',
        fillcolor: 'rgba(16, 185, 129, 0.3)'
    };

    const layout = {
        title: {
            text: `Normal Distribution: μ=${mu.toFixed(1)}, σ=${sigma.toFixed(1)}<br><sub>68% within [${(mu-sigma).toFixed(1)}, ${(mu+sigma).toFixed(1)}]</sub>`,
            font: { size: 18 }
        },
        xaxis: {
            title: 'x',
            gridcolor: '#e2e8f0',
            zeroline: true
        },
        yaxis: {
            title: 'Probability Density',
            gridcolor: '#e2e8f0'
        },
        showlegend: true,
        plot_bgcolor: '#f8fafc',
        paper_bgcolor: '#ffffff',
        margin: { t: 80, r: 50, b: 50, l: 50 },
        annotations: [
            {
                x: mu,
                y: normalPDF(mu, mu, sigma) * 1.1,
                text: `Peak = ${normalPDF(mu, mu, sigma).toFixed(3)}`,
                showarrow: true,
                arrowhead: 2,
                ax: 0,
                ay: -40
            }
        ]
    };

    const config = {
        responsive: true,
        displayModeBar: true,
        displaylogo: false
    };

    Plotly.newPlot('normal-viz', [tracePDF, trace68, traceMean, traceStdPlus, traceStdMinus], layout, config);
}
