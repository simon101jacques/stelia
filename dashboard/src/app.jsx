import React from 'react';
import data from './processed_data.json';

function App() {
  const criticalCount = data.filter(item => item.Urgency_Level >= 4).length;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 font-sans">
      <header className="flex justify-between items-center mb-10 border-b border-gray-700 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-sky-400">STELIA <span className="text-white">MONITOR</span></h1>
          <p className="text-gray-400">AI-Powered Log Analysis</p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-black text-red-500">{criticalCount}</div>
          <div className="text-xs uppercase tracking-widest text-gray-500">Active Alarms</div>
        </div>
      </header>

      <div className="grid gap-4">
        {data.map((item) => (
          <div key={item.id} className={`p-4 rounded-xl border-l-4 ${item.Urgency_Level >= 4 ? 'bg-red-900/20 border-red-500' : 'bg-gray-800 border-sky-500'}`}>
            <div className="flex justify-between items-start">
              <span className="text-xs font-mono text-gray-500 uppercase">ID: {item.id}</span>
              <span className={`text-xs font-bold px-2 py-1 rounded ${item.Urgency_Level >= 4 ? 'bg-red-500 text-white' : 'bg-gray-700 text-sky-300'}`}>
                Level {item.Urgency_Level}
              </span>
            </div>
            <p className="my-2 text-gray-200">{item.log}</p>
            <div className="mt-4 flex justify-between items-center text-sm">
              <span className="text-gray-500">📍 {item.Postcode}</span>
              <span className="font-semibold text-sky-400">{item.Recommended_Action}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;