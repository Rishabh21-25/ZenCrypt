const BASE_URL = "https://api.coingecko.com/api";
const tableBody = document.querySelector("#crypto-table tbody");
const loaderContainer = document.querySelector("#loader-container");
const searchBox = document.getElementById("search-box");

let coinsToDisplay = [];

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    "x-cg-demo-api-key": "CG-Bb9rEGQ8GToBChJ3n2xaLHi3",
  },
};

let debounceTimeout;
const debounce = (func, delay) => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(func, delay);
};

const showLoader = () => {
  loaderContainer.style.display = "flex";
  //console.log("loader displayed");
};

const hideLoader = () => {
  loaderContainer.style.display = "none";
  //console.log("loader hidden");
};

const getFavCoin = () => JSON.parse(localStorage.getItem("favCoin")) || [];

const fetchFavoriteCoins = async (coinIds) => {
  try {
    showLoader();
    const response = await fetch(
      `${BASE_URL}/v3/coins/markets?vs_currency=usd&ids=${coinIds.join(",")}`,
      options
    );
    const fetchedCoins = await response.json();

    // console.log(fetchedCoins);

    return fetchedCoins;
  } catch (error) {
    console.log(error);
  } finally {
    hideLoader();
  }
};

const renderCoins = (coinsToDisplay) => {
  tableBody.innerHTML = "";
  coinsToDisplay.forEach((coin, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td><img src="${coin.image ?? coin.thumb}" alt="${
      coin.name
    }" width="24" height="24" /></td>
      <td>${coin.name}</td>
      <td>$${coin.current_price.toLocaleString()}</td>
      <td>$${coin.total_volume.toLocaleString()}</td>
      <td>$${coin.market_cap.toLocaleString()}</td>
      <td>
           <i class="fas fa-star favorite-icon favorite" ></i>
        </td>
  `;
    row.addEventListener("click", (e) => {
      window.location.href = `./coins/coin.html?id=${coin.id}`;
    });
    row.querySelector(".favorite-icon").addEventListener("click", (e) => {
      e.stopPropagation();
      handleFavoriteClick(coin.id);
    });
    tableBody.appendChild(row);
  });
};

const fetchSearchResults = async (query) => {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/search?query=${query}`,
      options
    );
    const data = await response.json();
    return data.coins;
  } catch (err) {
    console.error("Error fetching search results:", err);
    return [];
  }
};

const handleSearchInput = () => {
  debounce(async () => {
    const searchQuery = searchBox.value.trim();

    const filteredCoins = getFavCoin().filter((coin) =>
      coin.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filteredCoins.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="7" class="no-fav">No Favourite Coins Added</td></tr>`;
    } else {
      coins = await fetchFavoriteCoins(filteredCoins);
      renderCoins(coins);
    }
  }, 300);
};

document.addEventListener("DOMContentLoaded", async () => {
  const favorites = getFavCoin();
  if (favorites.length === 0) {
    renderCoins([]);
  } else {
    coins = await fetchFavoriteCoins(favorites);
    renderCoins(coins);
    const searchBox = document.getElementById("search-box");
    searchBox.addEventListener("input", handleSearchInput);
  }
});

window.onload = async () => {
  const favCoins = getFavCoin();
  if (favCoins.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="7" class="no-fav">No Favourite Coins Added</td></tr>`;
    return;
  }
  let favCoinsData = await fetchFavoriteCoins(favCoins);
  coinsToDisplay = favCoinsData;
  renderCoins(favCoinsData);
};

document
  .querySelector("#sort-price-asc")
  .addEventListener("click", () => sortCoinsByPrice("asc"));
document
  .querySelector("#sort-price-desc")
  .addEventListener("click", () => sortCoinsByPrice("desc"));
document
  .querySelector("#sort-volume-asc")
  .addEventListener("click", () => sortCoinsByVolume("asc"));
document
  .querySelector("#sort-volume-desc")
  .addEventListener("click", () => sortCoinsByVolume("desc"));
document
  .querySelector("#sort-market-cap-asc")
  .addEventListener("click", () => sortCoinsByMarketCap("asc"));
document
  .querySelector("#sort-market-cap-desc")
  .addEventListener("click", () => sortCoinsByMarketCap("desc"));

const sortCoinsByPrice = (order) => {
  if (order === "asc") {
    coinsToDisplay.sort((a, b) => a.current_price - b.current_price);
  } else if (order === "desc") {
    coinsToDisplay.sort((a, b) => b.current_price - a.current_price);
  }

  renderCoins(coinsToDisplay);
};

const sortCoinsByVolume = (order) => {
  if (order === "asc") {
    coinsToDisplay.sort((a, b) => a.total_volume - b.total_volume);
  } else if (order === "desc") {
    coinsToDisplay.sort((a, b) => b.total_volume - a.total_volume);
  }

  renderCoins(coinsToDisplay);
};
const sortCoinsByMarketCap = (order) => {
  if (order === "asc") {
    coinsToDisplay.sort((a, b) => a.market_cap - b.market_cap);
  } else if (order === "desc") {
    coinsToDisplay.sort((a, b) => b.market_cap - a.market_cap);
  }

  renderCoins(coinsToDisplay);
};
