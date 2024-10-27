# Cryptocurrency Tracker Application

## Overview

The Cryptocurrency Tracker Application is a responsive web application built using React and TypeScript that provides real-time updates on cryptocurrency prices. The app features a user-friendly interface to view detailed information about various cryptocurrencies, add them to a watchlist, and receive live price updates through WebSocket integration.

## Features

- **Shimmer UI and carousel**: added shimmer UI whenever data in table is in loading state. Also added carousel just for UI purpose(using coingenko api which give trending prices list)
- **Favorite Button animation and localstorage**: added simple animation, when adding/removing favorites and favorite status of items persists across sessions (e.g. page reload) by using local storage
- **Firebase Integration (for Authentication)**: Integrated firebase as a backend service for authentication.
- **SignIn and signup**: created sign in and signup forms using firebase for accessing watchlist using authentication.
- **Real-time Cryptocurrency Data**: Fetches and displays current prices, market cap, and rank of cryptocurrencies using the CoinCap API.
- **Pagination**: added pagination functionality to display top 100 crypto in table
- **WebSocket Integration**: Automatically updates cryptocurrency prices using WebSocket for real-time data streaming.
- **Watchlist Functionality**: Users can add or remove cryptocurrencies from their watchlist, which is saved in a Firestore database.
- **Historical Charts**: Users can view historical price charts for selected cryptocurrencies, enabling them to analyze real-time pricing trends over different time periods like 30 days, 3 months and a year using react chart-js-2 chart.js libraries.
- **Responsive Design**: The application is responsive and is optimized for both desktop and mobile devices, ensuring a seamless user experience.
- **Miscellaneous additions**: added currency dropdown header to convert USD to INR. (though functionality i have not implemented using coincap rates api ). Added watchlist (currently we are fetching values from api, and not showing real time price there as of now just for demo purpose)

### 1. Setup

- The application is built with TypeScript, ensuring type safety and improved code quality.
- Proper interfaces are defined for all objects and data, facilitating better maintainability and readability.

### 2. Table Page (First Page)

- **Fetch Real-Time Cryptocurrency Data**:

  - Utilized the CoinCap API to fetch the top 100 cryptocurrency prices
  - Displayed the data in a table format with columns for symbol, name, price, and market cap in USD.
  - Listens to WebSocket for real-time price updates
  - Implemented pagination to show 10 items per page.

- **Table Features**:

  - Allows sorting by symbol or name, ensuring that the sorting is persistent even when the data is refreshed.
  - Clicking on a currency name redirects to the details page for that cryptocurrency.

- **Favorites Feature**:
  - Implements a toggle button for each cryptocurrency to mark it as a favorite.
  - The favorite status of items persists across sessions using local storage.

### 3. Details Page (Second Page)

- Implements a detailed view for the selected cryptocurrency (e.g., Bitcoin).
- Fetches detailed information using the CoinCap API
- Utilizes dynamic route parameters to navigate to the details page for each selected item.
- Displays a simple graph showing the history of the daily average prices for the last 30 days using the history API.

### 4. Testing Framework

- Sets up a testing framework using Jest for unit testing.
- Includes tests for various components and functionalities, ensuring reliability and performance of the application.

## Technologies Used

- **Frontend**:
  - React (with Hooks)
  - TypeScript
  - Axios for API requests
  - Material-UI for UI components
- **Backend**:
  - Firebase Firestore for watchlist storage
- **WebSocket**: For live price updates
- **State Management**: Context API for global state management

### Prerequisites

Make sure you have the following installed on your local machine:

- Node.js (version 14 or higher)
- npm (Node Package Manager)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/kesalkarsaket/crypto-hunter.git
   ```
