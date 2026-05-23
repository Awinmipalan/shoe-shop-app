import React, { useState, useEffect } from 'react';
import { Database, CheckCircle, RefreshCcw, Trash2, ArrowUpRight, Cpu, Eye, EyeOff, Zap, ShieldAlert, CloudLightning } from 'lucide-react';

const ASSET_ITEMS = [
  { id: 'shoe_1', name: 'Lumen Runner 3D Model', path: '/models/shoe_1.glb', estimated: '1.4 MB', type: 'model' },
  { id: 'shoe_2', name: 'Neon Glide 3D Model', path: '/models/shoe_2.glb', estimated: '1.6 MB', type: 'model' },
  { id: 'shoe_3', name: 'Puma Latest 3D Model', path: '/models/shoe_3.glb', estimated: '1.2 MB', type: 'model' },
  { id: 'shoe_4', name: 'Spectra Stride 3D Model', path: '/models/shoe_4.glb', estimated: '1.8 MB', type: 'model' },
  { id: 'intro', name: 'Cinematic Store Intro', path: '/intro.mp4', estimated: '4.6 MB', type: 'video' },
];

export default function CacheManager() {
  const [isOpen, setIsOpen] = useState(false);
  const [swActive, setSwActive] = useState(false);
  const [cachedStatus, setCachedStatus] = useState<Record<string, boolean>>({});
  const [downloadProgress, setDownloadProgress] = useState<Record<string, number>>({});
  const [isPreloading, setIsPreloading] = useState<string | null>(null);
  const [cacheSize, setCacheSize] = useState<string>('0.00 MB');
  const [swMessage, setSwMessage] = useState<string>('Registering cache controller...');

  // Query cached items and storage sizes
  const checkCachedItems = async () => {
    try {
      if ('caches' in window) {
        const cache = await caches.open('tonyi-footwear-cache-v1');
        const statusUpdates: Record<string, boolean> = {};
        
        for (const item of ASSET_ITEMS) {
          const matched = await cache.match(item.path);
          statusUpdates[item.id] = !!matched;
        }
        
        setCachedStatus(statusUpdates);
        await calculateCacheSize();
      }
    } catch (err) {
      console.error('Error checking cache states:', err);
    }
  };

  // Compute storage used by our site database
  const calculateCacheSize = async () => {
    if ('navigator' in navigator && 'storage' in navigator && navigator.storage.estimate) {
      const estimate = await navigator.storage.estimate();
      const usageBytes = estimate.usage || 0;
      const mb = (usageBytes / (1024 * 1024)).toFixed(2);
      setCacheSize(`${mb} MB`);
    } else {
      // Fallback
      try {
        const cache = await caches.open('tonyi-footwear-cache-v1');
        const keys = await cache.keys();
        let totalSize = 0;
        for (const request of keys) {
          const res = await cache.match(request);
          if (res) {
            const blob = await res.blob();
            totalSize += blob.size;
          }
        }
        setCacheSize(`${(totalSize / (1024 * 1024)).toFixed(2)} MB`);
      } catch {
        setCacheSize('Local Storage Active');
      }
    }
  };

  useEffect(() => {
    // Check Service Worker status
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        setSwActive(true);
        setSwMessage('Service Worker Ready. Optimal caching active.');
        checkCachedItems();
      }).catch((err) => {
        setSwMessage('Offline capability initializing...');
        console.log('SW registration issue:', err);
      });

      // Periodic check
      const timer = setInterval(() => {
        checkCachedItems();
      }, 5000);
      return () => clearInterval(timer);
    } else {
      setSwMessage('Cache Service is unavailable in this browser context.');
    }
  }, []);

  // Preload a single asset with real-time download feedback and push to Cache Memory
  const preloadAsset = async (item: typeof ASSET_ITEMS[0]) => {
    if (isPreloading) return;
    setIsPreloading(item.id);
    setDownloadProgress((prev) => ({ ...prev, [item.id]: 1 }));

    try {
      const response = await fetch(item.path);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const contentLengthHeader = response.headers.get('content-length');
      const contentLength = contentLengthHeader ? parseInt(contentLengthHeader, 10) : 0;
      
      if (!response.body) {
        // Fallback if ReadableStream support is absent
        const cache = await caches.open('tonyi-footwear-cache-v1');
        await cache.put(item.path, response);
        setDownloadProgress((prev) => ({ ...prev, [item.id]: 100 }));
      } else {
        const reader = response.body.getReader();
        const chunks: Uint8Array[] = [];
        let receivedLength = 0;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          if (value) {
            chunks.push(value);
            receivedLength += value.length;
            
            if (contentLength > 0) {
              const pct = Math.round((receivedLength / contentLength) * 100);
              setDownloadProgress((prev) => ({ ...prev, [item.id]: Math.min(99, pct) }));
            }
          }
        }

        // Reconstruct response and write to Cache Storage API
        const blob = new Blob(chunks);
        const headers = new Headers(response.headers);
        // Explicitly format response as valid
        const cachedResponse = new Response(blob, {
          status: 200,
          statusText: 'OK',
          headers: headers,
        });

        const cache = await caches.open('tonyi-footwear-cache-v1');
        await cache.put(item.path, cachedResponse);
        setDownloadProgress((prev) => ({ ...prev, [item.id]: 100 }));
      }

      // Refresh cache flags
      await checkCachedItems();
    } catch (error) {
      console.error('Preloading failed:', error);
      alert(`Preload failed for ${item.name}. Try reloading or open in a new browser tab.`);
    } finally {
      setIsPreloading(null);
    }
  };

  // Preload all assets in sequence
  const preloadAll = async () => {
    for (const item of ASSET_ITEMS) {
      if (!cachedStatus[item.id]) {
        await preloadAsset(item);
      }
    }
  };

  // Purge the optimized Cache Memory
  const purgeCache = async () => {
    if (confirm('Are you sure you want to clear the locally saved 3D footwear models and optimize the local disk storage?')) {
      try {
        if ('caches' in window) {
          await caches.delete('tonyi-footwear-cache-v1');
          setCachedStatus({});
          setDownloadProgress({});
          setCacheSize('0.00 MB');
          alert('Local Cache Memory cleared successfully. Assets will fetch from network next time.');
        }
      } catch (err) {
        console.error('Clearing cache failed:', err);
      }
    }
  };

  const cachedCount = Object.values(cachedStatus).filter(Boolean).length;
  const isHealthy = swActive && cachedCount === ASSET_ITEMS.length;

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 right-6 z-[999] flex flex-col items-end gap-2">
        <button
          id="cache-toggle"
          onClick={() => setIsOpen(!isOpen)}
          className={`group flex items-center gap-2.5 px-4 py-3 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.4)] backdrop-blur-md border transition-all duration-300 ${
            isOpen 
              ? 'bg-[#FF4D00] text-white border-[#FF4D00]' 
              : isHealthy
                ? 'bg-emerald-950/90 text-emerald-400 border-emerald-500/30 hover:border-emerald-500/50'
                : 'bg-zinc-900/90 text-[#FF4D00] border-white/10 hover:border-[#FF4D00]/50'
          }`}
        >
          {isHealthy ? (
            <Zap className="w-5 h-5 animate-pulse text-emerald-400" />
          ) : (
            <Database className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          )}
          <span className="text-xs font-bold uppercase tracking-wider font-['DM_Mono']">
            {isHealthy ? 'Optimized ✓' : `Cache Memory (${cachedCount}/${ASSET_ITEMS.length})`}
          </span>
        </button>
      </div>

      {/* Side Slider Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[460px] bg-[#0c0c0c] border-l border-white/10 shadow-2xl z-[9999] p-6 lg:p-8 flex flex-col justify-between font-['Syne'] transition-transform duration-500 ease-out transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="space-y-6 overflow-y-auto pr-1 flex-1">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Database className="text-[#FF4D00] w-6 h-6 animate-pulse" />
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">Cache Memory Manager</h3>
              </div>
              <p className="text-xs text-white/40 font-['DM_Mono'] tracking-normal">Preload 3D components for instantaneous zero-latency navigation.</p>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/40 hover:text-white uppercase text-xs font-bold tracking-widest font-['DM_Mono'] px-2 py-1 rounded border border-white/5 bg-white/5 active:scale-95"
            >
              Close ✕
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col justify-between">
              <span className="text-[10px] text-white/40 font-['DM_Mono'] uppercase tracking-widest block mb-1">Cache Utilization</span>
              <span className="text-2xl font-bold text-white font-['Bebas_Neue'] tracking-wide">{cacheSize}</span>
              <div className="flex items-center gap-1 mt-1 text-[10px] text-emerald-400 font-['DM_Mono']">
                <CheckCircle size={10} /> Saved to disk
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col justify-between">
              <span className="text-[10px] text-white/40 font-['DM_Mono'] uppercase tracking-widest block mb-1">Controller Status</span>
              <span className="text-lg font-bold text-[#FF4D00] uppercase font-['Bebas_Neue'] tracking-wide truncate">
                {swActive ? 'OPTIMIZED' : 'STANDBY'}
              </span>
              <span className="text-[9px] text-white/40 leading-none truncate block font-['DM_Mono']">{swMessage}</span>
            </div>
          </div>

          {/* Instruction Box */}
          <div className="bg-gradient-to-br from-[#FF4D00]/5 to-zinc-950 border border-[#FF4D00]/10 rounded-xl p-4 text-xs leading-relaxed space-y-2">
            <div className="flex items-center gap-2 text-white">
              <CloudLightning className="text-[#FF4D00] w-4 h-4" />
              <span className="font-bold uppercase tracking-wide">Why pre-load footwears?</span>
            </div>
            <p className="text-white/60 font-sans">
              3D GLB footwears represent rich volumetric model setups. Running a pre-load saves them directly to your browser's persistent Cache Storage. Following pre-load, browsing colors and switching sneakers renders instantly with <strong>zero network download spikes</strong>.
            </p>
          </div>

          {/* Asset List */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs font-['DM_Mono'] uppercase text-white/40 tracking-wider">
              <span>Optimizable Footwears</span>
              <span>{cachedCount} / {ASSET_ITEMS.length} CACHED</span>
            </div>

            <div className="space-y-2.5">
              {ASSET_ITEMS.map((item) => {
                const isCached = cachedStatus[item.id];
                const progress = downloadProgress[item.id] || 0;
                const activeLoading = isPreloading === item.id;

                return (
                  <div key={item.id} className="bg-white/5 border border-white/5 rounded-xl p-3.5 flex flex-col gap-2 transition-colors hover:bg-white/10">
                    <div className="flex justify-between items-center">
                      <div className="space-y-0.5">
                        <span className="text-sm font-bold text-white tracking-widest font-['Bebas_Neue'] uppercase block">{item.name}</span>
                        <div className="flex items-center gap-2 font-['DM_Mono'] text-[10px]">
                          <span className="text-white/40 uppercase">{item.type}</span>
                          <span className="text-white/20">•</span>
                          <span className="text-white/40 uppercase">Approx {item.estimated}</span>
                        </div>
                      </div>

                      {/* Control Trigger */}
                      {isCached ? (
                        <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full text-[10px] font-bold font-['DM_Mono'] uppercase tracking-wider">
                          <CheckCircle size={12} /> Ready
                        </div>
                      ) : activeLoading ? (
                        <div className="text-[#FF4D00] text-[10px] font-bold font-['DM_Mono'] uppercase tracking-widest animate-pulse">
                          Preloading ({progress}%)
                        </div>
                      ) : (
                        <button
                          onClick={() => preloadAsset(item)}
                          disabled={isPreloading !== null}
                          className="bg-white text-black font-bold text-[10px] uppercase font-['DM_Mono'] tracking-wider px-3 py-1.5 rounded-lg transition-all hover:bg-white/80 active:scale-95 disabled:opacity-30"
                        >
                          Pull Cache
                        </button>
                      )}
                    </div>

                    {/* Progress Bar (Dynamic slider) */}
                    {activeLoading && (
                      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#FF4D00] to-orange-500 transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="border-t border-white/10 pt-4 mt-4 space-y-3">
          <div className="flex gap-2">
            <button
              onClick={preloadAll}
              disabled={isPreloading !== null || cachedCount === ASSET_ITEMS.length}
              className="flex-1 bg-white text-black font-bold uppercase tracking-wider text-xs font-['DM_Mono'] py-3.5 rounded-xl hover:bg-white/90 active:scale-95 disabled:opacity-30 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <RefreshCcw size={14} className={isPreloading ? 'animate-spin' : ''} />
              Preload All Assets
            </button>
            
            <button
              onClick={purgeCache}
              className="px-4 bg-red-950/20 text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-all border border-red-900/20 rounded-xl flex items-center justify-center active:scale-95"
              title="Clear Cache"
            >
              <Trash2 size={16} />
            </button>
          </div>

          <div className="flex justify-between text-[9px] text-white/30 font-['DM_Mono'] uppercase tracking-wider">
            <span>Powered by Service Workers</span>
            <span>TONYI Footwear Optimized 2026</span>
          </div>
        </div>
      </div>
    </>
  );
}
