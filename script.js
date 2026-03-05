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
    });
});

const initialPeriod = "current_month";
loadKPIs(initialPeriod);

const config = {
  type: 'line',
  data: data,
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chart.js Line Chart'
      }
    }
  },
};


const labels = jsonData.map(item => item.month);
const values = jsonData.map(item => item.sales);

async function loadRevenueGraph(period) {
    try {
        const response = await fetch('data/Revenue.json');
        
        if (!response.ok) throw new Error('Ошибка загрузки файла');
        
        const data = await response.json();

    } catch (error) {
        console.error('Ошибка:', error);
        document.getElementById('Revenue').textContent = 'Не удалось загрузить данные.';
    }
}