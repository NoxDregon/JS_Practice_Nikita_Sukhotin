const UPDATE_INTERVAL_MS = 5000;
const MAX_DATA_POINTS = 30;

let chart = null;
let labels = [];
let cpuData = [];
let totalRequests = 0;
let errorRequests = 0;
let lastValidCpu = 50;
let isFetching = false;


function emulateApiResponse() {
    return new Promise((resolve) => {
        setTimeout(() => {
            const random = Math.random();
            const isError = random < 0.05; 
            
            if (isError) {
                resolve('0'); 
            } else {
                let newValue;
                if (lastValidCpu === 50) {
                    newValue = Math.floor(Math.random() * 60) + 20;
                } else {
                    const change = (Math.random() - 0.5) * 30;
                    newValue = lastValidCpu + change;
                    newValue = Math.min(95, Math.max(5, newValue));
                    newValue = Math.floor(newValue);
                }
                resolve(newValue.toString());
            }
        }, 100);
    });
}
function updateStatsUI() {
    document.getElementById('totalRequests').innerText = totalRequests;
    document.getElementById('errorCount').innerText = errorRequests;
    let percent = totalRequests === 0 ? 0 : (errorRequests / totalRequests) * 100;
    document.getElementById('errorPercent').innerText = percent.toFixed(2) + '%';
}

function updateLastValueUI(value) {
    document.getElementById('lastValue').innerHTML = value !== null ? `${value}%` : '—';
}

function addDataPoint(cpuValue) {
    const now = new Date();
    const timeLabel = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    labels.push(timeLabel);
    cpuData.push(cpuValue);
    
    if (labels.length > MAX_DATA_POINTS) {
        labels.shift();
        cpuData.shift();
    }
    
    if (chart) {
        chart.data.labels = labels;
        chart.data.datasets[0].data = cpuData;
        chart.update('none');
    }
    
    updateLastValueUI(cpuValue);
}

async function fetchCpuLoad() {
    if (isFetching) return;
    isFetching = true;
    
    try {
        const text = await emulateApiResponse();
        const rawValue = parseInt(text.trim(), 10);
        
        totalRequests++;
        
        let finalCpu = null;

        if (isNaN(rawValue)) {
            errorRequests++;
            finalCpu = lastValidCpu;
        } else if (rawValue === 0) {
            errorRequests++;
            finalCpu = lastValidCpu;
        } else {
            finalCpu = rawValue;
            lastValidCpu = finalCpu;
        }
        
        addDataPoint(finalCpu);
        updateStatsUI();
        
    } catch (err) {
        console.error("Критическая ошибка:", err);
        totalRequests++;
        errorRequests++;
        addDataPoint(lastValidCpu);
        updateStatsUI();
    } finally {
        isFetching = false;
    }
}

function initChart() {
    const ctx = document.getElementById('cpuChart').getContext('2d');
    
    const initialTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    labels = [initialTime];
    cpuData = [50];
    lastValidCpu = 50;
    updateLastValueUI(50);
    
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Загрузка процессора (%)',
                    data: cpuData,
                    borderColor: '#f97316',
                    backgroundColor: 'rgba(249, 115, 22, 0.1)',
                    borderWidth: 3,
                    pointRadius: 5,
                    pointHoverRadius: 8,
                    pointBackgroundColor: '#fb923c',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    tension: 0.3,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            animation: {
                duration: 500
            },
            plugins: {
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    titleColor: '#f97316',
                    bodyColor: '#ffffff',
                    callbacks: {
                        label: (context) => `CPU: ${context.raw}%`
                    }
                },
                legend: {
                    labels: {
                        color: '#cbd5e6',
                        font: { weight: 'bold', size: 12 }
                    },
                    position: 'top'
                }
            },
            scales: {
                y: {
                    min: 0,
                    max: 100,
                    grid: { color: 'rgba(148, 163, 184, 0.2)' },
                    title: {
                        display: true,
                        text: 'Загрузка процессора (%)',
                        color: '#94a3b8',
                        font: { weight: 'bold' }
                    },
                    ticks: { 
                        color: '#cbd5e6', 
                        stepSize: 20,
                        callback: (value) => `${value}%`
                    }
                },
                x: {
                    grid: { display: false },
                    ticks: { 
                        color: '#94a3b8',
                        maxRotation: 45,
                        autoSkip: true,
                        maxTicksLimit: 8
                    },
                    title: {
                        display: true,
                        text: 'Время измерения',
                        color: '#94a3b8'
                    }
                }
            },
            interaction: { 
                mode: 'nearest', 
                axis: 'x', 
                intersect: false 
            }
        }
    });
}

function startPolling() {
    fetchCpuLoad();
    setInterval(() => {
        fetchCpuLoad();
    }, UPDATE_INTERVAL_MS);
}

initChart();
startPolling();