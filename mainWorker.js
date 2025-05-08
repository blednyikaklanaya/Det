
const builds = [
    { name: "NoteBook", points: 3, count: 0 },
    { name: "NoteBookWindows", points: 4, count: 0 },
    { name: "DeepCool-ch360-NotBP", points: 7, count: 0 },
    { name: "Forge-120A-MAG-650W", points: 6, count: 0 },
    { name: "Prologic-E109-2ssd", points: 4, count: 0 },
    { name: "Prologic-E125-400w", points: 2, count: 0 },
    { name: "X5", points: 5, count: 0 },
    { name: "D5", points: 5, count: 0 },
    { name: "E106-Slim-1SDD", points: 2, count: 0 },
    { name: "Mono-disassembly", points: 4, count: 0 }
];

const savedBuilds = localStorage.getItem('builds');

if (savedBuilds) {
    builds.splice(0, builds.length, ...JSON.parse(savedBuilds));
}

let allHardLabel = document.getElementById("statHard");
let allHard = 0;
let allEasyLabel = document.getElementById("statEasy");
let allEasy = 0;

let allCountPointLabel = document.getElementById("allCountPoint");
let allCountPoint = 0;

let pricePointInput = document.getElementById("pricePointInput");
let pricePoint = 13;
pricePointInput.value = pricePoint;

let allSalaryLabel = document.getElementById("allPayDay");
let allSalary = 0;

pricePointInput.addEventListener("change", e => {
    pricePoint = Number(e.target.value);

    resPayDay();

    console.log(e.target.value);//debug
    console.log("->p", pricePoint);//debug
})

console.log(pricePoint);
// ------


// function

function resum () {
    let counterPoint = 0;
    builds.forEach(build => {
        counterPoint += build.points * build.count;
        allCountPointLabel.textContent = `All points: ${counterPoint}`;
    })
    allCountPoint = counterPoint;
    counterPoint = 0;
}

function resPayDay () {
    let payDayCounter = 0;
    payDayCounter = allCountPoint * pricePoint;
    allSalaryLabel.textContent = `All salary: ${payDayCounter}`;
    allSalary = payDayCounter;
    payDayCounter = 0;
}

function saveBuildsToLocalStorage () {
    localStorage.setItem('builds', JSON.stringify(builds));
}

resum();
resPayDay();

// -----------

// cards

let divCards = document.getElementsByClassName("cards")[0];
console.log(divCards);


builds.forEach((build, index) => {
    const card = document.createElement("div");
    card.classList.add(build.name);
    card.innerHTML = `
        <span>${build.name}</span>
        <input id="${build.name}" class="count${build.name} countCard" value="${build.count}">
        <button class="incCount${build.name}">+</button>
        <button class="decCount${build.name}">-</button>
    `;

    const inputChangeCount = card.querySelector(`.count${build.name}`);
    inputChangeCount.addEventListener("change", e => {
        builds[index].count = Number(e.target.value);
        resum();
        resPayDay();
        saveBuildsToLocalStorage();
        resArrayForChart();
    });

    const plusBtn = card.querySelector(`.incCount${build.name}`);
    const minusBtn = card.querySelector(`.decCount${build.name}`);

    plusBtn.addEventListener("click", () => {
        builds[index].count += 1;
        card.querySelector(`.count${build.name}`).value = builds[index].count;
        resum();
        resPayDay();
        saveBuildsToLocalStorage();
        resArrayForChart();
    })

    minusBtn.addEventListener("click", () => {
        builds[index].count -= 1;
        card.querySelector(`.count${build.name}`).value = builds[index].count;
        resum();
        resPayDay();
        saveBuildsToLocalStorage();
        resArrayForChart();
    })

    divCards.appendChild(card);
})
// -----------

// CHART.js

let chartArrayNameBuild = [];
let chartArrayCountBuilt = [];

const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: chartArrayNameBuild,
        datasets: [{
            label: 'Количество сборок',
            data: chartArrayCountBuilt,
            backgroundColor: [
                '#3498db', '#e67e22', '#2ecc71', '#9b59b6',
                '#f1c40f', '#e74c3c', '#1abc9c', '#34495e'
            ]
        }]
    },
    options: {
        responsive: true,
        animation: {
            duration: 1000,
            easing: 'easeOutBounce'
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1
                }
            }
        },
        plugins: {
            legend: {
                labels: {
                    font: {
                        size: 16
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0,0,0,0.7)',
                titleFont: { size: 16 },
                bodyFont: { size: 14 }
            }
        }
    }
});


function flashBars() {
    const originalColors = ['#3498db', '#e67e22', '#2ecc71', '#9b59b6', '#1abc9c', '#f39c12', '#34495e', '#e74c3c'];
    const flashColor = '#ffffff';

    // Установим цвет вспышки
    myChart.data.datasets[0].backgroundColor = builds.map(() => flashColor);
    myChart.update();

    // Через 300ms вернем обратно
    setTimeout(() => {
        myChart.data.datasets[0].backgroundColor = builds.map((_, i) => originalColors[i % originalColors.length]);
        myChart.update({
            duration: 800,
            easing: 'easeInOutCubic'
        });
    }, 100);
}

function resArrayForChart () {
    myChart.data.labels = builds.map(build => build.name);
    myChart.data.datasets[0].data = builds.map(build => build.count);
    myChart.update();
    flashBars();
}
resArrayForChart()


// ------------




if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('SW registered', reg))
        .catch(err => console.error('SW registration failed', err));
    });
  }
  