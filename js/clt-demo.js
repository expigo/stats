// Central Limit Theorem Interactive Demo

document.addEventListener('DOMContentLoaded', () => {
    const updateButton = document.getElementById('update-clt');
    const sampleSizeSlider = document.getElementById('sample-size');
    const numSamplesSlider = document.getElementById('num-samples');
    const sampleSizeValue = document.getElementById('sample-size-value');
    const numSamplesValue = document.getElementById('num-samples-value');

    if (!updateButton) return; // Not on home page

    // Update slider values
    sampleSizeSlider.addEventListener('input', (e) => {
        sampleSizeValue.textContent = e.target.value;
    });

    numSamplesSlider.addEventListener('input', (e) => {
        numSamplesValue.textContent = e.target.value;
    });

    // Initial visualization
    updateCLTVisualization();

    // Update on button click
    updateButton.addEventListener('click', updateCLTVisualization);
});

function updateCLTVisualization() {
    const sampleSize = parseInt(document.getElementById('sample-size').value);
    const numSamples = parseInt(document.getElementById('num-samples').value);

    // Generate sample means from exponential distribution
    const sampleMeans = [];
    const lambda = 1; // rate parameter for exponential

    for (let i = 0; i < numSamples; i++) {
        let sum = 0;
        for (let j = 0; j < sampleSize; j++) {
            // Generate exponential random variable
            sum += -Math.log(1 - Math.random()) / lambda;
        }
        sampleMeans.push(sum / sampleSize);
    }

    // Create histogram of sample means
    const trace1 = {
        x: sampleMeans,
        type: 'histogram',
        name: 'Sample Means',
        opacity: 0.7,
        marker: {
            color: '#2563eb'
        },
        nbinsx: 50
    };

    // Theoretical normal distribution
    const theoreticalMean = 1 / lambda; // mean of exponential
    const theoreticalStd = (1 / lambda) / Math.sqrt(sampleSize); // std of sample mean

    const x = [];
    const y = [];
    const min = Math.min(...sampleMeans);
    const max = Math.max(...sampleMeans);

    for (let i = 0; i < 100; i++) {
        const xVal = min + (max - min) * i / 100;
        x.push(xVal);
        // Normal PDF
        const yVal = (1 / (theoreticalStd * Math.sqrt(2 * Math.PI))) *
                     Math.exp(-0.5 * Math.pow((xVal - theoreticalMean) / theoreticalStd, 2));
        y.push(yVal * numSamples * (max - min) / 50); // Scale to match histogram
    }

    const trace2 = {
        x: x,
        y: y,
        type: 'scatter',
        mode: 'lines',
        name: 'Normal Distribution',
        line: {
            color: '#7c3aed',
            width: 3
        }
    };

    const layout = {
        title: {
            text: `Central Limit Theorem Demo<br><sub>Sample means from Exponential(λ=${lambda}) distribution</sub>`,
            font: { size: 18 }
        },
        xaxis: {
            title: 'Sample Mean',
            gridcolor: '#e2e8f0'
        },
        yaxis: {
            title: 'Frequency',
            gridcolor: '#e2e8f0'
        },
        showlegend: true,
        plot_bgcolor: '#f8fafc',
        paper_bgcolor: '#ffffff',
        margin: { t: 80, r: 50, b: 50, l: 50 },
        annotations: [{
            text: `n = ${sampleSize}, N = ${numSamples}<br>` +
                  `Theoretical: μ = ${theoreticalMean.toFixed(3)}, σ = ${theoreticalStd.toFixed(3)}<br>` +
                  `Observed: μ = ${Stats.mean(sampleMeans).toFixed(3)}, σ = ${Stats.std(sampleMeans).toFixed(3)}`,
            xref: 'paper',
            yref: 'paper',
            x: 0.98,
            y: 0.98,
            xanchor: 'right',
            yanchor: 'top',
            showarrow: false,
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            bordercolor: '#2563eb',
            borderwidth: 2,
            borderpad: 10,
            font: { size: 12 }
        }]
    };

    const config = {
        responsive: true,
        displayModeBar: true,
        displaylogo: false,
        modeBarButtonsToRemove: ['lasso2d', 'select2d']
    };

    Plotly.newPlot('clt-demo', [trace1, trace2], layout, config);
}
