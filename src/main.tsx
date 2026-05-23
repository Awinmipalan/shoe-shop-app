import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ShoeProvider } from './context/ShoeContext';
import { CartProvider } from './context/CartContext';
import '@google/model-viewer';

// Suppress the Lit/model-viewer dev-mode warnings to keep the console clean and professional
const originalWarn = console.warn;
console.warn = (...args) => {
  if (
    args.some(
      (arg) =>
        typeof arg === 'string' &&
        (arg.includes('Lit is in dev mode') || arg.includes('lit-html') || arg.includes('custom elements') || arg.includes('change-in-update') || arg.includes('scheduled an update'))
    )
  ) {
    return;
  }
  originalWarn(...args);
};

import { lazy, Suspense } from 'react';
import App from './App.tsx';
const Admin = lazy(() => import('./pages/Admin.tsx'));
const Cart = lazy(() => import('./pages/Cart.tsx'));
import './index.css';

const PageLoader = () => (
  <div className="min-h-screen bg-[#080808] flex items-center justify-center font-['Syne']">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-[#FF4D00]/20 border-t-[#FF4D00] rounded-full animate-spin"></div>
      <span className="text-white/40 text-xs tracking-widest font-['DM_Mono'] uppercase">TONYI FOOTWEAR...</span>
    </div>
  </div>
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ShoeProvider>
      <CartProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/cart" element={<Cart />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </CartProvider>
    </ShoeProvider>
  </StrictMode>,
);

if ('serviceWorker' in navigator) {
  const isDevHost = 
    window.location.hostname.includes('localhost') || 
    window.location.hostname.includes('127.0.0.1') || 
    window.location.hostname.includes('ais-dev-') || 
    window.location.hostname.includes('ais-pre-') ||
    window.location.hostname.includes('.run.app') ||
    (import.meta as any).env.DEV;

  if (isDevHost) {
    // Unregister active service worker during development to prevent caching conflicts with Vite's dev server & Fast Refresh
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister().then(() => {
          console.log('[Dev Service Worker] Unregistered active worker to prevent Fast Refresh / preamble caching conflicts');
          if ('caches' in window) {
            caches.delete('tonyi-footwear-cache-v1');
          }
        });
      }
    });
  } else {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => console.log('Service Worker registered successfully with scope: ', reg.scope))
        .catch((err) => console.error('Service Worker registration failure: ', err));
    });
  }
}

