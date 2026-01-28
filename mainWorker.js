
const builds = [
    { name: "Solo", points: 1, count: 0, title: "Одиночка" },
    { name: "Easy", points: 3, count: 0, title: "Легкий" },
    { name: "Base", points: 5, count: 0, title: "Базовий" },
    { name: "Hard", points: 7, count: 0, title: "Сложный" },
    { name: "MaxHard", points: 10, count: 0, title: "Максимальный" },
    { name: "Fans", points: 1, count: 0, title: "Кулеры" },
    { name: "DubleTower", points: 4, count: 0, title: "Двойная башня" },
    { name: "Liquid1", points: 2, count: 0, title: "Водянка 1 секция" },
    { name: "Liquid2", points: 3, count: 0, title: "2 секции" },
    { name: "Liquid3", points: 4, count: 0, title: "3 секции" },
    { name: "Controller", points: 1, count: 0, title: "Контроллер" },
    { name: "Adapter", points: 1, count: 0, title: "Переходник" },
    { name: "Switcher5V", points: 1, count: 0, title: "Разветлитель 5В" },
    { name: "HDD", points: 1, count: 0, title: "HDD" },
    { name: "2SSD", points: 1, count: 0, title: "2SSD" },
    { name: "Raizer", points: 1, count: 0, title: "Райзер" },
    { name: "RaizerHolder", points: 2, count: 0, title: "Райзер с держателем" },
    { name: "ManipulationsWithPC", points: 1, count: 0, title: "Манипуляция с корпусом" },
    { name: "Screen", points: 1, count: 0, title: "Экран" },
    { name: "Photo", points: 3, count: 0, title: "Фото"},
    { name: "review", points: 10, count: 0, title: "Обзор" },
    { name: "SocketIntel", points: 1, count: 0, title: "Сокет интел" },
    { name: "RGB", points: 7, count: 0, title: "РГБ лента" },
    { name: "Box", points: 1, count: 0, title: "Коробки"},
    { name: "WIFI", points: 1, count: 0, title: "WI-Fi"},
    { name: "NoteBook", points: 2, count: 0, title: "Ноутбук" },
    { name: "NoteBookWindows", points: 3, count: 0, title: "Ноутбук с виндой" },
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
let pricePoint = 15;
pricePointInput.value = pricePoint;

let allSalaryLabel = document.getElementById("allPayDay");
let allSalary = 0;

pricePointInput.addEventListener("change", e => {
    pricePoint = Number(e.target.value);

    resPayDay();

    console.log(e.target.value);//debug
    console.log("->p", pricePoint);//debug
})

// ------


// function

function resum () {
    let counterPoint = 0;
    builds.forEach(build => {
        counterPoint += build.points * build.count;
        allCountPointLabel.textContent = `Всего поинтов: ${counterPoint}`;
    })
    allCountPoint = counterPoint;
    counterPoint = 0;
}

function resPayDay () {
    let payDayCounter = 0;
    payDayCounter = allCountPoint * pricePoint;
    allSalaryLabel.textContent = `Ожидаемая мотивация: ${payDayCounter}`;
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
        <span>${build.title}</span>
        <input id="${build.name}" class="count${build.name} countCard" value="${build.count}">
        <span class="point">point > ${build.points}<span/>
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
  