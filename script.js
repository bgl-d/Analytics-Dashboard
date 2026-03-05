async function loadKPIs(period) {
    try {
        const response = await fetch('data/kpi.json');
        
        if (!response.ok) throw new Error('Ошибка загрузки файла');
        
        const data = await response.json();

        document.getElementById('Revenue').textContent = `$ ${data[period].Revenue.toLocaleString()}`;
        document.getElementById('AOV').textContent = `$ ${data[period].AOV.toFixed(1)}`;
        document.getElementById('RPR').textContent = `${data[period].RPR.toFixed(1)}%`;
        document.getElementById('CR').textContent = `${data[period].CR.toFixed(1)}%`;
        

        const changeElements = document.querySelectorAll('.metric-change');

        if (period != 'all_time') {
            changeElements.forEach(el => {
                const metricName = el.dataset.metric.replace('-change', ''); 
                
                let current = data[period][metricName];
                let previous = data[`previous_${period.replace('current_','')}`][metricName];
                
                if (current && previous) {
                    let delta = ((current / previous - 1) * 100).toFixed(0);
                    let prefix = delta > 0 ? '+' : '';
                    const symbol = delta > 0 ? '▲' : (delta < 0 ? '▼' : '');
                    el.className = delta > 0 ? 'metric-change positive' : (delta < 0 ? 'metric-change negative' : 'metric-change')
                    el.textContent = `${symbol} ${prefix}${delta}% over previous ${period.replace('current_','')}`;
                }
            });
        } else {
            changeElements.forEach(el => el.textContent = '-');
        }

    } catch (error) {
        console.error('Ошибка:', error);
        document.getElementById('Revenue').textContent = 'Не удалось загрузить данные.';
    }
}

const btnEl = document.querySelectorAll('.btn-period');

btnEl.forEach(button => {
    button.addEventListener('click', (e) => {
        btnEl.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        const periodId = e.target.getAttribute('id');
        loadKPIs(periodId);
        loadRevenueChart(periodId);
        loadTrafficChart(periodId);
        loadCategoryChart(periodId)

    });
});

const initialPeriod = "current_month";
loadKPIs(initialPeriod);


// Functions for plotting graphs
// Revenue line graph
let revenueChart;
async function loadRevenueChart(period) {
    try {
        const response = await fetch('data/revenue.json');
        
        if (!response.ok) throw new Error('Ошибка загрузки файла');
        
        const data = await response.json();
        
        const ctx = document.getElementById('revenueChart').getContext('2d');
        if (revenueChart) {
            revenueChart.destroy();
        }
        revenueChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data[period][period === 'current_month' ? 'Day' : 'Month'],
                datasets: [{
                    label: 'Revenue',
                    data: data[period].Revenue,
                    borderColor: '#36a3ebdf',
                    backgroundColor: '#36a3eb19',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 2
                }]
            },
            options: {
                layout: {
                    padding: {
                        left: 0,
                        right: 0,
                        bottom: 30,
                        top: 0
                    }
                },
                maintainAspectRatio: false,
                responsive: true,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return 'Revenue: $' + context.parsed.y.toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {                
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Ошибка:', error);
        document.getElementById('Revenue').textContent = 'Не удалось загрузить данные.';
    }
}

loadRevenueChart(initialPeriod);

// Generated traffic pie chart
let trafficChart;
async function loadTrafficChart(period) {
    try {
        const response = await fetch('data/traffic.json');
        
        if (!response.ok) throw new Error('Ошибка загрузки файла');
        
        const data = await response.json();
        
        const ctx = document.getElementById('trafficChart').getContext('2d');
        if (trafficChart) {
            trafficChart.destroy();
        }
        trafficChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: data[period].Source,
                datasets: [{
                    label: 'Traffic',
                    data: data[period].Traffic,
                    backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',  // Soft Red
                    'rgba(54, 162, 235, 0.8)',  // Soft Blue
                    'rgba(255, 206, 86, 0.8)',  // Soft Yellow
                    'rgba(75, 192, 192, 0.8)',  // Teal/Green
                    'rgba(153, 102, 255, 0.8)'  // Soft Purple
                    ],
                    borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                aspectRatio: 1, 
                layout: {
                    padding: {
                        left: 0,
                        right: 0,
                        bottom: 30,
                        top: 0
                    }
                },
            }
        });
    } catch (error) {
        console.error('Ошибка:', error);
        document.getElementById('Revenue').textContent = 'Не удалось загрузить данные.';
    }
}

loadTrafficChart(initialPeriod);

// Generated traffic pie chart
let categoryChart;
async function loadCategoryChart(period) {
    try {
        const response = await fetch('data/category.json');
        
        if (!response.ok) throw new Error('Ошибка загрузки файла');
        
        const data = await response.json();
        
        const ctx = document.getElementById('categoryChart').getContext('2d');
        if (categoryChart) {
            categoryChart.destroy();
        }
        categoryChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data[period].Category,
                datasets: [{
                    label: 'Revenue',
                    data: data[period].Revenue,
                    backgroundColor: 'rgba(54, 162, 235, 0.8)',
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                aspectRatio: 1, 
                layout: {
                    padding: {
                        left: 0,
                        right: 0,
                        bottom: 20,
                        top: 0
                    }
                },
            }
        });
    } catch (error) {
        console.error('Ошибка:', error);
        document.getElementById('Revenue').textContent = 'Не удалось загрузить данные.';
    }
}

loadCategoryChart(initialPeriod);

