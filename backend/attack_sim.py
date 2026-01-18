import time
import json
import random
import paho.mqtt.client as mqtt

# Configuration
BROKER = "127.0.0.1"
PORT = 1884 
TOPIC = "network/logs"

# === DATASET ===
SAFE_LOGS = [
    "GET /index.html 200 OK - User: Rayan",
    "POST /api/login 200 OK - User: Admin",
    "GET /images/logo.png 200 OK",
    "GET /dashboard 200 OK",
    "GET /api/v1/status 200 OK",
    "POST /user/update_profile 201 Created"
]

THREAT_LOGS = [
    "SELECT * FROM users WHERE '1'='1' -- SQL Injection Detected",
    "<script>alert('hacked')</script> XSS Payload in comment",
    "GET /../../etc/passwd Directory Traversal Attempt",
    "Failed login attempt 999 from IP 192.168.0.666 (Brute Force)",
    "DDOS Attack: 10,000 requests/sec from Botnet IP"
]

# Connection Callback
def on_connect(client, userdata, flags, rc, properties=None):
    if rc == 0:
        print(f"✅ CONNECTED TO SOLACE BROKER!")
    else:
        print(f"❌ CONNECTION FAILED (Code: {rc})")

# Init MQTT
client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
client.on_connect = on_connect

print("⏳ Connecting to Event Mesh...")

# Retry Loop
connected = False
while not connected:
    try:
        client.connect(BROKER, PORT, 60)
        connected = True
    except Exception as e:
        print("zzZ Broker not ready... Retrying in 3s.")
        time.sleep(3)

client.loop_start()

print("🚀 TRAFFIC SIMULATION STARTED...")

try:
    while True:
        # 20% chance of attack
        is_threat = random.random() < 0.3
        
        if is_threat:
            log = random.choice(THREAT_LOGS)
            print(f"🔴 [THREAT] {log}")
        else:
            log = random.choice(SAFE_LOGS)
            print(f"🟢 [SAFE]   {log}")

        client.publish(TOPIC, log)
        
        # Random speed for realism
        time.sleep(random.uniform(0.5, 1.5))

except KeyboardInterrupt:
    print("\n🛑 Simulation Stopped.")
    client.loop_stop()