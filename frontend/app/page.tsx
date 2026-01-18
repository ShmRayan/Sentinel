"use client";
import { useEffect, useState } from "react";
import mqtt from "mqtt";

export default function SentinelDashboard() {
  const [logs, setLogs] = useState<any[]>([]);
  const [stats, setStats] = useState({ safe: 0, threats: 0 });
  const [status, setStatus] = useState("INITIALIZING...");

  useEffect(() => {
    // Connect to Solace Web Messaging (Port 8001)
    const client = mqtt.connect("ws://localhost:8001", {
        clientId: "dash_" + Math.random().toString(16).substr(2, 8)
    });

    client.on("connect", () => {
      console.log("✅ DASHBOARD CONNECTED");
      setStatus("SYSTEM ONLINE");
      // Listening to the Python stream
      client.subscribe("network/logs");
    });

    client.on("message", (topic, message) => {
      const msg = message.toString();
      
      // Real-time analysis simulation for visualization
      const isThreat = msg.includes("SQL") || msg.includes("hacked") || msg.includes("passwd") || msg.includes("DDOS") || msg.includes("Failed");
      
      if (isThreat) {
        setStats(s => ({ ...s, threats: s.threats + 1 }));
      } else {
        setStats(s => ({ ...s, safe: s.safe + 1 }));
      }

      const newLog = {
        time: new Date().toLocaleTimeString(),
        msg: msg,
        isThreat: isThreat
      };
      
      // Keep only last 15 logs for performance
      setLogs(prev => [newLog, ...prev].slice(0, 15));
    });

    return () => { client.end(); };
  }, []);

  return (
    <main className="min-h-screen bg-black text-green-500 font-mono p-6 overflow-hidden">
      
      {/* HEADER */}
      <header className="flex justify-between border-b-2 border-green-800 pb-4 mb-6 items-end">
        <div>
          <h1 className="text-5xl font-black text-white tracking-widest">SENTINEL</h1>
          <p className="text-xs text-green-600 mt-1 tracking-[0.3em]">AUTONOMOUS CYBER-DEFENSE MESH</p>
        </div>
        <div className="text-right">
          <div className={`text-xl font-bold animate-pulse ${status === "SYSTEM ONLINE" ? "text-green-400" : "text-red-500"}`}>
            ● {status}
          </div>
          <div className="text-xs text-gray-500">SOLACE EVENT BROKER: ACTIVE</div>
        </div>
      </header>

      {/* STATS PANEL */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-900/50 border border-green-900 p-6 rounded text-center">
          <h3 className="text-gray-400 text-xs tracking-widest mb-2">VERIFIED TRAFFIC</h3>
          <div className="text-5xl font-bold text-green-400">{stats.safe}</div>
        </div>
        <div className={`bg-gray-900/50 border p-6 rounded text-center transition-all duration-200 ${stats.threats > 0 ? "border-red-600 bg-red-900/10 shadow-[0_0_20px_rgba(220,38,38,0.2)]" : "border-gray-800"}`}>
          <h3 className="text-gray-400 text-xs tracking-widest mb-2">THREATS NEUTRALIZED</h3>
          <div className="text-5xl font-bold text-red-500">{stats.threats}</div>
        </div>
      </div>

      {/* LOGS TERMINAL */}
      <div className="space-y-2 font-mono text-sm">
        <div className="flex justify-between text-gray-600 text-xs border-b border-gray-800 pb-2 mb-2 px-2">
            <span>TIMESTAMP</span>
            <span>PAYLOAD ANALYSIS</span>
            <span>ACTION</span>
        </div>
        
        {logs.length === 0 && (
            <div className="text-center py-20 text-gray-700 animate-pulse italic">
                WAITING FOR NETWORK TRAFFIC...
            </div>
        )}

        {logs.map((log, i) => (
          <div key={i} className={`flex items-center p-3 border-l-4 transition-all duration-300 ${
            log.isThreat 
            ? "border-red-600 bg-red-950/30 text-red-300 animate-in slide-in-from-left-2" 
            : "border-green-600 bg-green-950/10 text-green-400 animate-in slide-in-from-top-1"
          }`}>
            <span className="w-24 text-xs opacity-50">{log.time}</span>
            <span className="flex-1 truncate pr-4 font-bold tracking-wide">{log.msg}</span>
            {log.isThreat ? (
                <span className="bg-red-600 text-black px-3 py-1 text-xs font-black rounded animate-pulse">
                    BLOCK_IP
                </span>
            ) : (
                <span className="text-green-600 text-xs border border-green-800 px-2 py-1 rounded opacity-50">
                    ALLOWED
                </span>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}