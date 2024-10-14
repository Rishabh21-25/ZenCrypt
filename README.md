## Overview

The **Crypto Tracker App** is a web-based application built using HTML, CSS, and JavaScript, utilizing the CoinGecko API to fetch real-time cryptocurrency data. The app allows users to search, view, and manage their favorite cryptocurrencies. It also provides an interactive interface for sorting, filtering, and visualizing coin data through dynamic charts powered by Chart.js.

## Features

- **Real-time Cryptocurrency Data**: Fetches up-to-date information on various cryptocurrencies, including price, market cap, volume, and more.
- **Search with Debounce**: Optimized search functionality with debounce implementation to enhance user experience and minimize API calls.
- **Favorite Coins Management**: Users can add or remove cryptocurrencies from their favorites list, and easily track them.
- **Coin Details View**: Detailed view for each coin showing:
  - Coin's full image
  - Name, price, market cap, and volume
  - Interactive price charts with options to toggle between the last 1 month and 3 months
- **Sorting Functionality**: Users can sort the coin data by price, market cap, and volume in ascending or descending order by clicking on respective up/down arrows.
- **Pagination and Loading Optimization**: The app displays 10 coins per page, and features smooth pagination with a loading spinner when fetching new data, ensuring performance efficiency.
- **Interactive Price Chart**: Dynamic price charts for each coin, with toggling options to view historical data (1-month or 3-months).

## Technologies Used

- **HTML/CSS**: For structuring and styling the application.
- **JavaScript**: For dynamic interactivity and functionality.
- **Chart.js**: For displaying real-time coin price charts.
- **CoinGecko API**: To fetch cryptocurrency data.
- **Debounce**: To optimize search operations and reduce unnecessary API requests.
- **Pagination**: To load data efficiently, enhancing performance.

## Known Issues

### Coin Details and Chart Not Loading
If you encounter issues where the coin details or price charts are not visible upon clicking on a coin, this is due to **CORS policy restrictions** enforced by the CoinGecko API. The API blocks cross-origin requests from GitHub Pages, which causes the data to fail loading.

### Workarounds:
- **Clone and run locally**: You can clone this repository and run the app locally to bypass the CORS restriction.
- **CORS Proxy**: For testing, you can use a CORS proxy service to bypass the restriction, but this is not recommended for production.

## Getting Started

To clone and run this project locally:

1. Clone the repo:
    ```
    git clone https://github.com/yourusername/crypto-app.git
    ```

2. Navigate to the project directory:
    ```
    cd crypto-app
    ```

3. Open the `index.html` file in your browser to view the app locally.

## License

This project is licensed under the MIT License.
  
# ZenCrypt
