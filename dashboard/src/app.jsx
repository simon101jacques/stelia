import React, { useState } from 'react';
import data from './processed_data.json';

function App() {
  const [filterLevel, setFilterLevel] = useState(null);

  const levels = [1, 2, 3, 4, 5];
  const counts = levels.map(lvl => ({
    level: lvl,
    count: data.filter(item => item.Urgency_Level === lvl).length
  }));

  const criticalCount = data.filter(item => item.Urgency_Level >= 4).length;
  const isSystemCritical = criticalCount > 0;
  
  const filteredData = filterLevel 
    ? data.filter(item => item.Urgency_Level === filterLevel)
    : data;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 font-sans">
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-sky-400">STELIA <span className="text-white">MONITOR</span></h1>
            <p className="text-gray-400 text-sm">AI-Powered Log Analysis</p>
          </div>
          
          {/* Main System Status */}
          <div className={`mt-1 flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${
            isSystemCritical 
              ? 'bg-red-500/10 border-red-500/50 text-red-500' 
              : 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500'
          }`}>
            <span className="relative flex h-2 w-2">
              {isSystemCritical && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isSystemCritical ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
            </span>
            {isSystemCritical ? 'Action Required' : 'System Healthy'}
          </div>
        </div>

        <div className="text-right">
          <div className="text-4xl font-black text-red-500 leading-none">{criticalCount}</div>
          <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Critical Alarms</div>
        </div>
      </header>

      {/* --- Interactive Bar Chart --- */}
      <div className="bg-gray-800/40 border border-gray-700 rounded-2xl p-8 mb-10 shadow-2xl">
        <div className="flex items-end justify-center gap-6 h-48 w-full max-w-2xl mx-auto">
          {counts.map((c) => {
            const barHeightPercent = Math.min((c.count / 10) * 100, 100);
            const isActive = filterLevel === c.level;
            
            return (
              <div 
                key={c.level} 
                onClick={() => setFilterLevel(isActive ? null : c.level)}
                className={`flex flex-col items-center w-20 h-full cursor-pointer transition-all duration-300
                  ${filterLevel && !isActive ? 'opacity-20 grayscale' : 'opacity-100'}`}
              >
                <span className={`text-xl font-mono mb-2 ${c.level >= 4 ? 'text-red-400 font-bold' : 'text-sky-400'}`}>
                  {c.count}
                </span>
                
                <div className={`relative w-full h-32 bg-gray-700/20 rounded-t-md border-x border-t transition-colors
                  ${isActive ? 'border-sky-400/50 bg-gray-700/40' : 'border-gray-700/50'}`}>
                   <div 
                    className={`absolute bottom-0 left-0 w-full transition-all duration-700
                      ${c.level >= 4 ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'bg-sky-500'}`}
                    style={{ height: `${barHeightPercent}%` }}
                  ></div>
                </div>
                
                <div className="mt-3 text-center">
                  <div className="text-[10px] font-black text-gray-500 uppercase">Level</div>
                  <div className={`text-sm font-bold ${isActive ? 'text-white underline underline-offset-4' : 'text-gray-300'}`}>{c.level}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- Log Feed --- */}
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">
            {filterLevel ? `Level ${filterLevel} logs only` : 'Event Log Stream'}
          </h2>
          {filterLevel && (
            <button 
              onClick={() => setFilterLevel(null)}
              className="text-[10px] bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 px-3 py-1 rounded-full uppercase font-bold transition-all"
            >
              Show All Logs
            </button>
          )}
        </div>

        <div className="grid gap-4">
          {filteredData.map((item) => (
            <div key={item.id} className={`p-4 rounded-xl border-l-4 transition-all hover:translate-x-1 ${item.Urgency_Level >= 4 ? 'bg-red-900/10 border-red-500' : 'bg-gray-800 border-sky-600'}`}>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-gray-500 uppercase">ID: {item.id}</span>
                
                {/* --- Status and Level Section --- */}
                <div className="flex items-center gap-3">
                  <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${item.Urgency_Level >= 4 ? 'text-red-400' : 'text-sky-400'}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${item.Urgency_Level >= 4 ? 'bg-red-500 animate-pulse' : 'bg-sky-400'}`}></span>
                    {item.Urgency_Level >= 4 ? 'Critical' : 'Normal'}
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded shadow-sm ${item.Urgency_Level >= 4 ? 'bg-red-500 text-white' : 'bg-sky-900 text-sky-300'}`}>
                    LVL {item.Urgency_Level}
                  </span>
                </div>
              </div>

              <p className="my-2 text-gray-200 text-sm leading-relaxed">{item.log}</p>
              
              <div className="mt-3 flex justify-between items-center text-xs border-t border-gray-700/50 pt-3">
                <span className="text-gray-500 font-medium tracking-tight">📍 {item.Postcode}</span>
                <span className="font-bold text-sky-400 bg-sky-400/5 px-2 py-1 rounded border border-sky-400/20 lowercase first-letter:uppercase">
                  {item.Recommended_Action}
                </span>
              </div>
            </div>
          ))}
          {filteredData.length === 0 && (
            <div className="text-center py-20 bg-gray-800/20 rounded-xl border border-dashed border-gray-700 text-gray-600 italic">
              No logs found for this urgency level.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;