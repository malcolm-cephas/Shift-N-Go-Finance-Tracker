# 🏎️ Shift N Go - Dealership Finance Tracker

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Framework: Next.js](https://img.shields.io/badge/Framework-Next.js%2015-black?logo=next.js)](https://nextjs.org/)
[![Styling: Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS%204-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

**Shift N Go** is a premium, offline-first business management application designed specifically for pre-owned car dealerships. Streamline your inventory, track sales, and manage your financial metrics all in one sleek, modern dashboard.

---

## ✨ Key Features

- **📊 Comprehensive Dashboard**: Get a birds-eye view of your dealership's health with real-time financial metrics.
- **🏷️ Inventory Management**: Log and track vehicles, purchase costs, and sales prices seamlessly.
- **💰 Balance Sheets & Unit Management**: Manage multi-account financial tracking tailored for dealership operations.
- **🛞 Spinning Tyre UX**: A unique interactive brand element providing quick navigation back to the dashboard.
- **🌓 Adaptive Theme**: Sleek dark mode and light mode support with glassmorphism aesthetics.
- **⚡ Offline-First Design**: Designed to work reliably even in low-connectivity environments.
- **📈 Analytics & Reporting**: Built-in charts (Chart.js) to visualize sales performance and inventory turns.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | [Next.js 15](https://nextjs.org/) (App Router), [React 19](https://react.dev/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) |
| **Database** | [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/) |
| **Authentication** | [Auth0 / NextJS Auth0](https://auth0.com/) |
| **Visualization** | [Chart.js](https://www.chartjs.org/) & `react-chartjs-2` |
| **Utilities** | `date-fns`, `chartjs-adapter-date-fns` |

---

## 🚀 Getting Started

### Prerequisites

- Node.js (Active LTS recommended)
- MongoDB instance (Local or Atlas)
- Auth0 Account (for optional authentication)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/malcolm-cephas/shift-n-go-finance.git
    cd shift-n-go-finance
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env.local` file in the root directory and add your credentials:
    ```env
    MONGODB_URI=your_mongodb_uri
    AUTH0_SECRET='use [openssl rand -hex 32] to generate'
    AUTH0_BASE_URL='http://localhost:3000'
    AUTH0_ISSUER_BASE_URL='https://your-domain.auth0.com'
    AUTH0_CLIENT_ID='your_client_id'
    AUTH0_CLIENT_SECRET='your_client_secret'
    ```

4.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📜 Usage

- **Inventory Dashboard**: Click the "Inventory" tab to log new vehicle acquisitions and sales.
- **Balance Sheet**: Monitor your dealership's cash flow and unit-specific profitability.
- **Settings**: Adjust currencies and theme preferences to suit your local market.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git origin push feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

Private & Confidential. Prepared for investor review by Shift N Go.
© 2026 Shift N Go.