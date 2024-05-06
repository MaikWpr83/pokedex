//add statistic in the bar chart
let chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false,
        },
        title: {
            display: false,
            text: "Stats",
            font: {
            size: 24,
            },
        },
    },
    indexAxis: "x",
    scales: {
        y: {
            skipLabels: true,
            beginAtZero: true,
            ticks: {
                autoSkip: false,
            },
        },
        x: {
            max: 120,
            ticks: {
                stepSize: 20,
                autoSkip: false,
            },
        },
    },
};

//transparent background color of bar chart  
let backgroundColor = [
    'rgba(255, 99, 132, 0.3)',
    'rgba(255, 159, 64, 0.3)',
    'rgba(255, 205, 86, 0.3)',
    'rgba(75, 192, 192, 0.3)',
    'rgba(54, 162, 235, 0.3)',
    'rgba(153, 102, 255, 0.3)',
    'rgba(201, 203, 207, 0.3)'
];

//background color of bar chart  
let borderColor = [
    'rgb(255, 99, 132)',
    'rgb(255, 159, 64)',
    'rgb(255, 205, 86)',
    'rgb(75, 192, 192)',
    'rgb(54, 162, 235)',
    'rgb(153, 102, 255)',
    'rgb(201, 203, 207)'
];

//render chart bar
function renderChart(){
    const ctx = document.getElementById('myChart');
    let baseStats = [];
    for (let i = 0; i < pokemonStats.length; i++) {
        baseStats.push(pokemonStats[i][0]['base_stat'], pokemonStats[i][1]['base_stat'], pokemonStats[i][2]['base_stat'], pokemonStats[i][3]['base_stat'], pokemonStats[i][4]['base_stat'], pokemonStats[i][5]['base_stat']);
    }
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Hit-Points', 'Attack', 'Defense', 'Special-Attack', 'Special-Defense', 'Speed'],      //labeling of the bar chart
            datasets: [{
                data: baseStats,
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                borderWidth: 1
            }]
        },
        options: chartOptions,
    });
}