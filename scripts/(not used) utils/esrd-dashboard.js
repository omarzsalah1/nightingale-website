// ESRD Dashboard - FIXED VERSION WITH PROPER ANIMATIONS
document.addEventListener('DOMContentLoaded', function() {
    // Wait for Chart.js to be loaded
    function waitForChartJS() {
        if (typeof Chart === 'undefined') {
            setTimeout(waitForChartJS, 100);
            return;
        }
        renderEsrdDashboard();
    }
    
    function renderEsrdDashboard() {
        const root = document.getElementById("records");
        if (!root) return;

        // --- Critical / Warning / Normal tiles with animation
        const critCount = document.getElementById("crit-count");
        const warnCount = document.getElementById("warn-count");
        const normalCount = document.getElementById("normal-count");
        
        // Fixed counts based on the data
        const criticalLabsCount = 3;
        const warningLabsCount = 4;
        const normalLabsCount = 2;
        
        // Animate count up effect
        if (critCount) animateValue(critCount, 0, criticalLabsCount, 1500);
        if (warnCount) animateValue(warnCount, 0, warningLabsCount, 1500);
        if (normalCount) animateValue(normalCount, 0, normalLabsCount, 1500);

        // --- Trend Chart with progressive line-draw animation
        const canvas = document.getElementById("esrdTrend");
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Create gradient for Hemoglobin
        const gradient = ctx.createLinearGradient(0, 0, 0, 260);
        gradient.addColorStop(0, '#ff758c');
        gradient.addColorStop(1, '#ff7eb3');
        
        // Initial data structure with empty points
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
        
        // Create the chart with custom animations
        const chart = new Chart(ctx, {
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
                        
                        // Draw progressive lines with clipping
                        chart.data.datasets.forEach((dataset, datasetIndex) => {
                            const meta = chart.getDatasetMeta(datasetIndex);
                            
                            // Calculate dataset progress with stagger
                            const staggerDelay = 0.083; // 200ms / 2400ms
                            const datasetProgress = Math.max(0, Math.min(1, 
                                (animation.currentStep / animation.numSteps - datasetIndex * staggerDelay) / (1 - staggerDelay * 2)
                            ));
                            
                            if (datasetProgress > 0) {
                                // Draw partial line
                                ctx.save();
                                
                                // Create clipping path
                                const clipWidth = chartArea.width * datasetProgress;
                                ctx.beginPath();
                                ctx.rect(chartArea.left, chartArea.top, clipWidth, chartArea.height);
                                ctx.clip();
                                
                                // Show points progressively
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
                        // Show all points and add glow
                        const chart = animation.chart;
                        chart.data.datasets.forEach((dataset, datasetIndex) => {
                            const meta = chart.getDatasetMeta(datasetIndex);
                            meta.data.forEach(point => {
                                point.options.pointRadius = 5;
                            });
                        });
                        chart.update('none');
                        
                        // Add glow effect
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
        
        // --- Detail table with hover effects and trends
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

        // Add intersection observer for fade-in animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, { threshold: 0.1 });

        root.querySelectorAll('.tile, .chart-container, .table-wrapper, .florence-summary').forEach(el => {
            observer.observe(el);
        });
    }

    // Count up animation for KPI tiles
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
    waitForChartJS();
});