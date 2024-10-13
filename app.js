const BASE_URL = "https://api.coingecko.com/api";
const loaderContainer = document.querySelector("#loader-container");
const prevBtn = document.getElementById("prev-button");
const nextBtn = document.getElementById("next-button");
const loader = document.querySelector(".loader");
const tableBody = document.querySelector("#crypto-table tbody");
const searchBox = document.getElementById("search-box");
const sortPriceAsc = document.getElementById("sort-price-asc");
const sortPriceDesc = document.getElementById("sort-price-desc");
const sortVolumeAsc = document.getElementById("sort-volume-asc");
const sortVolumeDesc = document.getElementById("sort-volume-desc");
const sortMarketCapAsc = document.getElementById("sort-market-cap-asc");
const sortMarketCapDesc = document.getElementById("sort-market-cap-desc");

const itemsPerPage = 10;
let currentPage = 1;
let coins = [];
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    "x-cg-demo-api-key": "CG-Bb9rEGQ8GToBChJ3n2xaLHi3",
  },
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

const saveFavCoin = (favourites) => {
  localStorage.setItem("favCoin", JSON.stringify(favourites));
};

const toggleFavorite = (coinId) => {
  let favCoins = getFavCoin();
  if (favCoins.includes(coinId)) {
    favCoins = favCoins.filter((id) => id !== coinId);
  } else {
    favCoins.push(coinId);
  }
  return favCoins;
};

const handleFavoriteClick = (coinId) => {
  let favCoins = toggleFavorite(coinId);
  saveFavCoin(favCoins);
  renderCoins(coins, currentPage);
};

const fetchCoins = async (page = 1) => {
  try {
    showLoader();
    const response = await fetch(
      `${BASE_URL}/v3/coins/markets?vs_currency=usd&per_page=${itemsPerPage}&page=${page}`,
      options
    );
    coins = await response.json();
    return coins;
  } catch (error) {
    console.log(error);
  } finally {
    hideLoader();
  }
};

const renderCoins = (coinsToDisplay, page) => {
  tableBody.innerHTML = "";
  const favCoins = getFavCoin();
  const start = (page - 1) * itemsPerPage + 1;
  coinsToDisplay.forEach((coin, index) => {
    const row = document.createElement("tr");
    const isFavorite = favCoins.includes(coin.id);
    row.innerHTML = `
    <td>${start + index}</td>
    <td><img src="${coin.image ?? coin.thumb}" alt="${
      coin.name
    }" width="24" height="24" /></td>
    <td>${coin.name}</td>
    <td>$${coin.current_price.toLocaleString()}</td>
    <td>$${coin.total_volume.toLocaleString()}</td>
    <td>$${coin.market_cap.toLocaleString()}</td>
    <td>
         <i class="fas fa-star favorite-icon ${
           isFavorite ? "favorite" : ""
         }" data-id="${coin.id}"></i>
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

const handlePrevButtonClick = async () => {
  if (currentPage > 1) {
    currentPage--;
    await fetchCoins(currentPage);
    renderCoins(coins, currentPage);
    updatePaginationControls();
  }
};

const handleNextButtonClick = async () => {
  currentPage++;
  await fetchCoins(currentPage);
  renderCoins(coins, currentPage);
  updatePaginationControls();
};

const updatePaginationControls = () => {
  if (currentPage === 1) {
    prevBtn.disabled = true;
    prevBtn.classList.add("disabled");
  } else {
    prevBtn.disabled = false;
    prevBtn.classList.remove("disabled");
  }

  if (coins.length < 10) {
    nextBtn.disabled = true;
    nextBtn.classList.add("disabled");
  } else {
    nextBtn.disabled = false;
    nextBtn.classList.remove("disabled");
  }
};

const fetchSearchCoinsByIds = async (coinIds) => {
  try {
    const response = await fetch(
      `${BASE_URL}/v3/coins/markets?vs_currency=usd&ids=${coinIds.join(",")}`,
      options
    );
    const fetchedCoins = await response.json();
    return fetchedCoins;
  } catch (error) {
    console.log(error);
  }
};

const fetchSearchResults = async (searchQuery) => {
  try {
    showLoader();
    const response = await fetch(
      `${BASE_URL}/v3/search?query=${searchQuery}`,
      options
    );
    const data = await response.json();
    const filteredCoins = data.coins.map((coin) => coin.id);
    const finalCoinsData = await fetchSearchCoinsByIds(filteredCoins);
    return finalCoinsData;
  } catch (error) {
    console.log(error);
    hideLoader();
  }
};

const handleSearchInput = async (e) => {
  let searchQuery = e.target.value;
  if (searchQuery.length > 1) {
    const coinsData = await fetchSearchResults(searchQuery);
    renderCoins(coinsData, 1);
    updatePaginationControls();
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";
    hideLoader();
  }
};

const sortCoinsByPrice = (order) => {
  coins.sort((a, b) =>
    order === "asc"
      ? a.current_price - b.current_price
      : b.current_price - a.current_price
  );
  renderCoins(coins, currentPage);
  updatePaginationControls();
};

const sortCoinsByVolume = (order) => {
  coins.sort((a, b) =>
    order === "asc"
      ? a.total_volume - b.total_volume
      : b.total_volume - a.total_volume
  );
  renderCoins(coins, currentPage);
  updatePaginationControls();
};

const sortCoinsByMarketCap = (order) => {
  coins.sort((a, b) =>
    order === "asc" ? a.market_cap - b.market_cap : b.market_cap - a.market_cap
  );
  renderCoins(coins, currentPage);
  updatePaginationControls();
};

searchBox.addEventListener("keyup", handleSearchInput);
prevBtn.addEventListener("click", handlePrevButtonClick);
nextBtn.addEventListener("click", handleNextButtonClick);
sortPriceAsc.addEventListener("click", () => sortCoinsByPrice("asc"));
sortPriceDesc.addEventListener("click", () => sortCoinsByPrice("desc"));
sortVolumeAsc.addEventListener("click", () => sortCoinsByVolume("asc"));
sortVolumeDesc.addEventListener("click", () => sortCoinsByVolume("desc"));
sortMarketCapAsc.addEventListener("click", () => sortCoinsByMarketCap("asc"));
sortMarketCapDesc.addEventListener("click", () => sortCoinsByMarketCap("desc"));

window.onload = async () => {
  const coinsData = await fetchCoins(1);
  renderCoins(coinsData, 1);
  updatePaginationControls();
};

// document.addEventListener("DOMContentLoaded", () => {
//    fetchCoins(2);
//   renderCoins();
// });
