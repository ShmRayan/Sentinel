# ⚙️ Sentinel Backend: The Event Mesh

This directory contains the infrastructure code for Sentinel. It orchestrates the Solace Event Broker, the AI Agent, and the Traffic Simulator.

## 🏗️ Architecture

*   **Solace PubSub+ Standard:** Running in Docker. Acts as the central message router.
*   **Sentinel Agent:** A containerized python application using `solace-agent-mesh`. It acts as a specialized Cybersecurity Analyst powered by Llama 3 (via Cerebras).
*   **Attack Simulator:** A Python script that generates realistic HTTP logs (both safe and malicious) and publishes them via MQTT.

## 🔌 Port Mapping

| Service | Port (Host) | Internal Port | Description |
| :--- | :--- | :--- | :--- |
| **MQTT** | `1884` | `1883` | Input port for the Python Simulator |
| **WebSocket** | `8001` | `8000` | Output stream for the Web Dashboard |
| **Web Admin** | `9090` | `8080` | Solace Administration Console |

## 🚀 How to Run

### Prerequisites
*   Docker & Docker Desktop
*   Python 3.10+

1. Start the Infrastructure
We use Docker Compose to spin up the Broker and the AI Agent.

2. Start containers (force recreate ensures clean state)
docker-compose up -d --force-recreate


3. Configure Environment
Make sure you have a .env file with your LLM credentials:
LLM_SERVICE_API_KEY=your_cerebras_key
LLM_SERVICE_MODEL_NAME=llama3-70b-8192


4. Launch the Attack Simulation
This script acts as the "Internet". It generates random traffic and sends it to the Broker on port 1884.
pip install paho-mqtt
python attack_sim.py

You should see logs appearing:

✅ CONNECTED TO SOLACE BROKER!
🟢 [SAFE] GET /index.html 200 OK
🔴 [THREAT] SELECT * FROM users WHERE '1'='1'