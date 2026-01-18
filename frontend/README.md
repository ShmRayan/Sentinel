# 🖥️ Sentinel Dashboard: Mission Control

A real-time cybersecurity dashboard built with Next.js 14 and Tailwind CSS. It connects directly to the Solace Event Mesh via WebSockets to visualize threats as they are neutralized.

## ⚡ Features

*   **Live Event Streaming:** Subscribes to Solace topics `network/logs` (raw traffic) and `sentinel/alerts` (AI verdicts).
*   **Zero-Latency Updates:** Uses `mqtt` client over WebSockets for instant UI updates without page reloads.
*   **Dynamic UI:**
    *   **Green Stream:** Validated traffic.
    *   **Red Alert:** Threats detected by AI (SQLi, XSS, DDoS) with Confidence Score.
*   **Cyberpunk Aesthetic:** Full dark mode design for high-contrast monitoring.

## 🛠️ Tech Stack

*   **Framework:** Next.js (App Router)
*   **Styling:** Tailwind CSS
*   **Connectivity:** MQTT.js (WebSocket Secure)

## 🚀 How to Run

1. Install Dependencies
npm install
2. Start Development Server
npm run dev
Open http://localhost:3000 to see the dashboard.
Note: Ensure the Backend (Docker) is running on port 8001 for the dashboard to receive data.