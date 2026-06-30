import React, { useState, useEffect } from 'react';
import { apiService } from '../services/ApiService';

export default function NodesView() {
  const [nodes, setNodes] = useState([]);

  useEffect(() => {
    const loadNodes = async () => {
      try {
        const data = await apiService.fetchJson('/api/nodes');
        setNodes(Array.isArray(data) ? data : []);
      } catch (e) {}
    };
    loadNodes();
  }, []);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <h2 className="text-md font-bold text-[#D0BCFF]">🌐 Подключенные узлы и серверные ноды</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {nodes.length === 0 ? (
          <div className="col-span-full py-12 text-center text-xs text-gray-500 border border-dashed border-[#2B2930] rounded-2xl">
            Узлы пока не передавали сигналы. Запустите vpn-node на сервере.
          </div>
        ) : (
          nodes.map((node, idx) => (
            <div key={idx} className="bg-[#1D1B20] p-5 rounded-[24px] border border-[#2B2930] flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm text-[#E6E1E5]">{node.id}</h3>
                <span className="text-[10px] text-gray-400 font-mono block mt-1">{node.ip}</span>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                node.status === 'online' ? 'bg-[#2E3C30] text-[#A3CFB1]' : 'bg-[#3C2E30] text-[#F2B8B5]'
              }`}>
                {node.status}
              </span>
            </div>
          ))
        )}
      </div>
    </main>
  );
}