loaderContainer = document.querySelector("#loader-container");
loader = document.querySelector(".loader");
const coinImage = document.getElementById("coin-image");
const coinName = document.querySelector("#coin-name");
const coinPrice = document.querySelector("#coin-price");
const coinMarketCap = document.querySelector("#coin-market-cap");
const coinDesc = document.querySelector("#coin-description");
const coinRank = document.querySelector("#coin-rank");
const ctx = document.querySelector("#coin-chart");
const twentyFourBtn = document.getElementById("24h");
const thirtyDaysBtn = document.getElementById("30d");
const threeMonthsBtn = document.getElementById("3m");
const buttons = document.querySelectorAll(".button-container button");

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    buttons.forEach((btn) => {
      btn.classList.remove("active");
    });
    button.classList.add("active");
  });
});

let coinChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Price (USD)",
        data: [],
        fill: false,
        borderColor: "rgb(15, 182, 182)",
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      x: {
        display: true,
      },
      y: {
        display: true,
        beginAtZero: false,
        ticks: {
          callback: function (value) {
            return `$${value}`;
          },
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            return `$${context.parsed.y}`;
          },
        },
      },
    },
  },
});

const BASE_URL = "https://api.coingecko.com/api";
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    "x-cg-demo-api-key": "CG-Bb9rEGQ8GToBChJ3n2xaLHi3",
  },
};

const showLoader = () => {
  loaderContainer.style.display = "flex";
};

const hideLoader = () => {
  loaderContainer.style.display = "none";
};

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

const fetchCoinDataById = async () => {
  try {
    showLoader();
    const response = await fetch(`${BASE_URL}/v3/coins/${id}`, options);
    const coin = await response.json();
    hideLoader();
    return coin;
  } catch (error) {
    console.log(error);
    hideLoader();
  }
};

const displayCoinData = (coin) => {
  coinImage.src = coin.image.large;
  coinImage.alt = coin.name;
  coinName.textContent = coin.name;
  coinDesc.innerHTML = coin.description.en.split(".")[0];
  coinRank.textContent = coin.market_cap_rank;
  coinPrice.textContent = `$${coin.market_data.current_price.usd.toLocaleString()}`;
  coinMarketCap.textContent = `$${coin.market_data.market_cap.usd.toLocaleString()}`;
};

const fetchChart = async (days) => {
  try {
    const response = await fetch(
      `${BASE_URL}/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}&interval=daily`,
      options
    );
    const pricesData = await response.json();
    updateChart(pricesData.prices);
  } catch (error) {
    console.log(error);
  }
};

const updateChart = (pricesData) => {
  const labels = pricesData.map((price) => {
    let date = new Date(price[0]);
    return date.toLocaleDateString();
  });

  const data = pricesData.map((price) => price[1]);

  coinChart.data.labels = labels;
  coinChart.data.datasets[0].data = data;
  coinChart.update();
};

twentyFourBtn.addEventListener("click", () => {
  fetchChart("1");
});

thirtyDaysBtn.addEventListener("click", () => {
  fetchChart("30");
});

threeMonthsBtn.addEventListener("click", () => {
  fetchChart("90");
});

window.onload = async () => {
  const coinData = await fetchCoinDataById();
  displayCoinData(coinData);
  twentyFourBtn.click();
};
