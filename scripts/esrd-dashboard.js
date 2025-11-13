// Updated ESRD Dashboard with Animation Integration
document.addEventListener('DOMContentLoaded', function() {
    // Wait for Chart.js to be loaded
    let chartCheckAttempts = 0;
    const maxAttempts = 50;
    
    function waitForChartJS() {
        if (typeof Chart === 'undefined') {
            chartCheckAttempts++;
            if (chartCheckAttempts > maxAttempts) {
                console.error('Chart.js failed to load after ' + maxAttempts + ' attempts');
                return;
            }
            setTimeout(waitForChartJS, 100);
            return;
        }
        console.log('Chart.js loaded successfully');
        
        // Set up intersection observer for dashboard section
        const dashboardSection = document.getElementById("records");
        if (!dashboardSection) return;
        
        const dashboardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !dashboardSection.hasAttribute('data-initialized')) {
                    dashboardSection.setAttribute('data-initialized', 'true');
                    renderEsrdDashboard();
                }
            });
        }, { threshold: 0.1 });
        
        dashboardObserver.observe(dashboardSection);
    }
    
    function renderEsrdDashboard() {
        const root = document.getElementById("records");
        if (!root) return;

        // KPI tiles - will be animated by scroll observer
        const critCount = document.getElementById("crit-count");
        const warnCount = document.getElementById("warn-count");
        const normalCount = document.getElementById("normal-count");
        
        const criticalLabsCount = 3;
        const warningLabsCount = 4;
        const normalLabsCount = 2;
        
        // Store chart instance globally for re-animation
        let chartInstance = null;

        // Trend Chart
        const canvas = document.getElementById("esrdTrend");
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, 260);
        gradient.addColorStop(0, '#ff758c');
        gradient.addColorStop(1, '#ff7eb3');
        
        const chartData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'Hemoglobin',
                    data: [11, 10.5, 9.8, 9.1, 8.7, 8.2],
                    borderColor: gradient,
                    backgroundColor: 'rgba(255, 107, 107, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 7,
                    pointBackgroundColor: '#FF6B6B',
                    pointBorderColor: '#06080E',
                    pointBorderWidth: 2,
                    fill: true,
                    clip: false
                },
                {
                    label: 'Potassium', 
                    data: [4.5, 5.3, 4.8, 5.5, 5.9, 6.3],
                    borderColor: '#FFB800',
                    backgroundColor: 'rgba(255, 184, 0, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 7,
                    pointBackgroundColor: '#FFB800',
                    pointBorderColor: '#06080E',
                    pointBorderWidth: 2,
                    fill: true,
                    clip: false
                },
                {
                    label: 'Phosphorus',
                    data: [5.5, 5.7, 6.1, 6.4, 6.8, 7.2],
                    borderColor: '#4ADE80',
                    backgroundColor: 'rgba(74, 222, 128, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 7,
                    pointBackgroundColor: '#4ADE80',
                    pointBorderColor: '#06080E',
                    pointBorderWidth: 2,
                    fill: true,
                    clip: false
                }
            ]
        };
        
        // Create chart
        chartInstance = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                animation: {
                    duration: 2400,
                    easing: 'easeOutQuart',
                    onProgress: function(animation) {
                        const chart = animation.chart;
                        const ctx = chart.ctx;
                        
                        ctx.save();
                        
                        const chartArea = chart.chartArea;
                        ctx.globalCompositeOperation = 'destination-over';
                        
                        chart.data.datasets.forEach((dataset, datasetIndex) => {
                            const meta = chart.getDatasetMeta(datasetIndex);
                            
                            const staggerDelay = 0.083;
                            const datasetProgress = Math.max(0, Math.min(1, 
                                (animation.currentStep / animation.numSteps - datasetIndex * staggerDelay) / (1 - staggerDelay * 2)
                            ));
                            
                            if (datasetProgress > 0) {
                                ctx.save();
                                
                                const clipWidth = chartArea.width * datasetProgress;
                                ctx.beginPath();
                                ctx.rect(chartArea.left, chartArea.top, clipWidth, chartArea.height);
                                ctx.clip();
                                
                                meta.data.forEach((point, index) => {
                                    const pointProgress = datasetProgress * meta.data.length;
                                    if (index < pointProgress) {
                                        point.options.pointRadius = 5;
                                    } else {
                                        point.options.pointRadius = 0;
                                    }
                                });
                                
                                ctx.restore();
                            }
                        });
                        
                        ctx.restore();
                    },
                    onComplete: function(animation) {
                        const chart = animation.chart;
                        chart.data.datasets.forEach((dataset, datasetIndex) => {
                            const meta = chart.getDatasetMeta(datasetIndex);
                            meta.data.forEach(point => {
                                point.options.pointRadius = 5;
                            });
                        });
                        chart.update('none');
                        
                        canvas.style.filter = 'drop-shadow(0 0 20px rgba(31, 201, 200, 0.3))';
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: '6-Month Lab Trends',
                        color: '#A8B2C7',
                        font: {
                            size: 16,
                            weight: '600'
                        }
                    },
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            color: '#A8B2C7',
                            padding: 20,
                            usePointStyle: true,
                            boxWidth: 12,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(6, 8, 14, 0.9)',
                        borderColor: 'rgba(31, 201, 200, 0.3)',
                        borderWidth: 1,
                        titleColor: '#FFFFFF',
                        bodyColor: '#A8B2C7',
                        padding: 12,
                        cornerRadius: 8,
                        displayColors: true,
                        callbacks: {
                            label: function(context) {
                                const units = {
                                    'Hemoglobin': 'g/dL',
                                    'Potassium': 'mmol/L',
                                    'Phosphorus': 'mg/dL'
                                };
                                return context.dataset.label + ': ' + context.parsed.y + ' ' + units[context.dataset.label];
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)',
                        },
                        ticks: {
                            color: '#A8B2C7'
                        }
                    },
                    y: {
                        beginAtZero: false,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)',
                        },
                        ticks: {
                            color: '#A8B2C7'
                        }
                    }
                }
            }
        });
        
        // Store chart instance on canvas for re-animation
        canvas.chart = chartInstance;
        
        // Table data
        const tbody = document.querySelector('#records tbody');
        if (tbody) {
            const labs = [
                { label: 'Hemoglobin', value: 8.2, unit: 'g/dL', range: '10-12', status: 'CRITICAL', action: 'Increase EPO dose', trend: '↓' },
                { label: 'Potassium', value: 6.3, unit: 'mmol/L', range: '4-6', status: 'CRITICAL', action: 'Dietary counselling', trend: '↑' },
                { label: 'Phosphorus', value: 7.2, unit: 'mg/dL', range: '3.5-5.5', status: 'CRITICAL', action: 'Increase binder', trend: '↑' },
                { label: 'Calcium', value: 8.8, unit: 'mg/dL', range: '8.4-10.2', status: 'NORMAL', action: 'Continue current', trend: '→' },
                { label: 'Albumin', value: 3.3, unit: 'g/dL', range: '3.5-5.0', status: 'WARNING', action: 'Nutritional assessment', trend: '↓' }
            ];
            
            tbody.innerHTML = labs.map((lab, index) => `
                <tr class="${lab.status}" style="animation: fadeInUp 0.6s ease-out ${index * 0.1}s both">
                    <td><strong>${lab.label}</strong></td>
                    <td>
                        <span class="current-value">${lab.value}</span> 
                        <span class="unit">${lab.unit}</span>
                        <span class="trend ${lab.trend === '↑' ? 'trending-up' : lab.trend === '↓' ? 'trending-down' : ''}">${lab.trend}</span>
                    </td>
                    <td class="target-range">${lab.range} ${lab.unit}</td>
                    <td><span class="status-badge ${lab.status.toLowerCase()}">${lab.status}</span></td>
                    <td>${lab.action}</td>
                </tr>
            `).join('');
        }
        
        // Set up count animations when tiles become visible
        const countObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = el.id === 'crit-count' ? criticalLabsCount :
                                  el.id === 'warn-count' ? warningLabsCount : normalLabsCount;
                    
                    if (window.animationHelpers && window.animationHelpers.animateValue) {
                        window.animationHelpers.animateValue(el, 0, target, 1500);
                    } else {
                        // Fallback animation
                        animateValue(el, 0, target, 1500);
                    }
                    
                    countObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });
        
        if (critCount) countObserver.observe(critCount);
        if (warnCount) countObserver.observe(warnCount);
        if (normalCount) countObserver.observe(normalCount);
        
        // Don't create Florence button here - main.js handles it
    }

    // Fallback count animation
    function animateValue(element, start, end, duration) {
        if (!element) return;
        
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            element.textContent = Math.floor(easeOutQuart * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
    
    // Start checking for Chart.js
    setTimeout(waitForChartJS, 500);
});