import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, ArrowRight, Footprints, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ShoeCollection from './components/ShoeCollection';
import { useCart } from './context/CartContext';
import Reviews from './components/Reviews';
import Contact from './pages/Contact';
import CacheManager from './components/CacheManager';
import { CONTACT_PHONE } from './config';

const IMAGES = [
  { id: 0, title: 'LUMEN RUNNER', src: '/models/shoe_1.glb', bg: '#9BA4B5', panel: '#27374D' },
  { id: 1, title: 'NEON GLIDE', src: '/models/shoe_2.glb', bg: '#B2C9AB', panel: '#3C2A21' },
  { id: 2, title: 'PUMA LATEST', src: '/models/shoe_3.glb', bg: '#FCD1D1', panel: '#27374D' },
  { id: 3, title: 'SPECTRA STRIDE', src: '/models/shoe_4.glb', bg: '#B9D7EA', panel: '#3C2A21' },
];

const GRAIN_SVG = "data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E";

export default function App() {
  const navigateReactRouter = useNavigate();
  const { cartCount } = useCart();
  const [showIntro, setShowIntro] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navigate = useCallback((direction: 'next' | 'prev') => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    setActiveIndex((prev) => {
      if (direction === 'next') return (prev + 1) % 4;
      return (prev + 3) % 4;
    });

    setTimeout(() => {
      setIsAnimating(false);
    }, 650);
  }, [isAnimating]);

  const getRoleStyle = (index: number) => {
    const isCenter = index === activeIndex;
    const isLeft = index === (activeIndex + 3) % 4;
    const isRight = index === (activeIndex + 1) % 4;
    const isBack = index === (activeIndex + 2) % 4;

    const baseTransition = 'transform 650ms cubic-bezier(0.4, 0, 0.2, 1), filter 650ms cubic-bezier(0.4, 0, 0.2, 1), opacity 650ms cubic-bezier(0.4, 0, 0.2, 1), left 650ms cubic-bezier(0.4, 0, 0.2, 1), bottom 650ms cubic-bezier(0.4, 0, 0.2, 1), height 650ms cubic-bezier(0.4, 0, 0.2, 1)';
    const willChange = 'transform, filter, opacity, left, bottom, height';

    if (isCenter) {
      return {
        transform: `translateX(-50%) scale(${isMobile ? 1.25 : 1.68})`,
        filter: 'blur(0px)',
        opacity: 1,
        zIndex: 20,
        left: '50%',
        height: isMobile ? '60%' : '92%',
        bottom: isMobile ? '22%' : '0%',
        transition: baseTransition,
        willChange
      };
    }
    if (isLeft) {
      return {
        transform: 'translateX(-50%) scale(1)',
        filter: 'blur(2px)',
        opacity: 0.85,
        zIndex: 10,
        left: isMobile ? '20%' : '30%',
        height: isMobile ? '16%' : '28%',
        bottom: isMobile ? '32%' : '12%',
        transition: baseTransition,
        willChange
      };
    }
    if (isRight) {
      return {
        transform: 'translateX(-50%) scale(1)',
        filter: 'blur(2px)',
        opacity: 0.85,
        zIndex: 10,
        left: isMobile ? '80%' : '70%',
        height: isMobile ? '16%' : '28%',
        bottom: isMobile ? '32%' : '12%',
        transition: baseTransition,
        willChange
      };
    }
    // isBack
    return {
      transform: 'translateX(-50%) scale(1)',
      filter: 'blur(4px)',
      opacity: 0, // In user's prompt wait... Let me re-read prompt. Prompt says: opacity 1
      zIndex: 5,
      left: '50%',
      height: isMobile ? '13%' : '22%',
      bottom: isMobile ? '32%' : '12%',
      transition: baseTransition,
      willChange
    };
  };

  // Re-adjusting the opacity for back item
  const getRoleStyleCorrected = (index: number) => {
    const style = getRoleStyle(index);
    if (index === (activeIndex + 2) % 4) {
       style.opacity = 0; // Wait, actually I will change it to opacity 1 in the logic below.
    }
    return style;
  };

  const getActualStyles = (index: number) => {
    const isCenter = index === activeIndex;
    const isLeft = index === (activeIndex + 3) % 4;
    const isRight = index === (activeIndex + 1) % 4;
    const isBack = index === (activeIndex + 2) % 4;

    const baseTransition = 'transform 650ms cubic-bezier(0.4, 0, 0.2, 1), filter 650ms cubic-bezier(0.4, 0, 0.2, 1), opacity 650ms cubic-bezier(0.4, 0, 0.2, 1), left 650ms cubic-bezier(0.4, 0, 0.2, 1), bottom 650ms cubic-bezier(0.4, 0, 0.2, 1), height 650ms cubic-bezier(0.4, 0, 0.2, 1), width 650ms cubic-bezier(0.4, 0, 0.2, 1)';
    const willChange = 'transform, filter, opacity, left, bottom, height, width';

    if (isCenter) {
      return {
        transform: `translateX(-50%) scale(${isMobile ? 1.25 : 1.68})`,
        filter: 'blur(0px)',
        opacity: 1,
        zIndex: 20,
        left: '50%',
        height: isMobile ? '60%' : '92%',
        width: isMobile ? '36%' : '55.2%',
        bottom: isMobile ? '22%' : '0',
        transition: baseTransition,
        willChange
      };
    }
    if (isLeft) {
      return {
        transform: 'translateX(-50%) scale(1)',
        filter: 'blur(2px)',
        opacity: 0.85,
        zIndex: 10,
        left: isMobile ? '20%' : '30%',
        height: isMobile ? '16%' : '28%',
        width: isMobile ? '9.6%' : '16.8%',
        bottom: isMobile ? '32%' : '12%',
        transition: baseTransition,
        willChange
      };
    }
    if (isRight) {
      return {
        transform: 'translateX(-50%) scale(1)',
        filter: 'blur(2px)',
        opacity: 0.85,
        zIndex: 10,
        left: isMobile ? '80%' : '70%',
        height: isMobile ? '16%' : '28%',
        width: isMobile ? '9.6%' : '16.8%',
        bottom: isMobile ? '32%' : '12%',
        transition: baseTransition,
        willChange
      };
    }
    // isBack
    return {
      transform: 'translateX(-50%) scale(1)',
      filter: 'blur(4px)',
      opacity: 1,
      zIndex: 5,
      left: '50%',
      height: isMobile ? '13%' : '22%',
      width: isMobile ? '7.8%' : '13.2%',
      bottom: isMobile ? '32%' : '12%',
      transition: baseTransition,
      willChange
    };
  };

  if (showIntro) {
    return (
      <div className="relative w-full h-[100vh] bg-[#080808] overflow-hidden flex flex-col font-['Syne']">
        <video 
          ref={(ref) => {
            if (ref) {
              ref.defaultMuted = true;
              ref.muted = true;
              ref.play().catch(e => console.log('Video autoplay blocked:', e));
            }
          }}
          src="/intro.mp4" 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-luminosity pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-[#080808]/80" />
        
        {/* Header */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Footprints className="text-[#FF4D00] w-8 h-8" />
            <span className="font-['Bebas_Neue'] text-2xl tracking-widest mt-1 text-white">TONYI FOOTWEAR</span>
          </div>
          <div className="hidden sm:flex items-center gap-8 text-white/80 font-bold text-sm tracking-widest uppercase">
            <button onClick={() => setShowIntro(false)} className="hover:text-white transition-colors">Store</button>
            <button onClick={() => {
               setShowIntro(false);
               setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 100);
            }} className="hover:text-white transition-colors">Contact</button>
            <button onClick={() => navigateReactRouter('/cart')} className="hover:text-white flex gap-2 items-center transition-colors">
              <ShoppingCart size={16} /> Cart ({cartCount})
            </button>
          </div>
        </div>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center -mt-20 sm:-mt-10">
          <div className="font-['DM_Mono'] text-[#FF4D00] tracking-[0.3em] text-xs sm:text-sm mb-4 sm:mb-6 animate-fade-in text-center">WELCOME TO THE NEW ERA</div>
          <h1 
            className="text-white uppercase mb-8 text-center px-4 leading-[0.9] font-['Bebas_Neue']"
            style={{ fontSize: 'clamp(70px, 16vw, 160px)', textShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
          >
            DISCOVER<br/>THE <span className="text-transparent" style={{ WebkitTextStroke: '2px white' }}>KICKS</span>
          </h1>
          <button 
            onClick={() => setShowIntro(false)}
            className="group px-8 py-4 sm:px-10 sm:py-5 bg-white text-black font-bold uppercase tracking-[0.2em] text-xs sm:text-sm hover:bg-white/90 transition-all rounded-full flex items-center gap-3 sm:gap-4 hover:scale-105 active:scale-95"
          >
            Enter Collection
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        
        {/* Bottom stats / info */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 py-8 flex flex-col sm:flex-row justify-between items-center text-white/40 font-['DM_Mono'] text-[10px] sm:text-xs uppercase tracking-widest gap-4">
           <span>Premium Footwear</span>
           <div className="flex gap-4">
             <a href={`https://wa.me/${CONTACT_PHONE}`} target="_blank" rel="noreferrer" className="hover:text-[#25D366] transition-colors">WhatsApp Order</a>
           </div>
           <span>Nigeria / Worldwide</span>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: IMAGES[activeIndex].bg,
        transition: 'background-color 650ms cubic-bezier(0.4, 0, 0.2, 1)',
        fontFamily: "'Inter', sans-serif"
      }}
      className="relative w-full overflow-hidden"
    >
      <div className="relative w-full h-[100vh] overflow-hidden">
        
        {/* Grain overlay */}
        <div 
          className="absolute inset-0 pointer-events-none z-[50] opacity-30 mix-blend-overlay"
          style={{
            backgroundImage: `url("${GRAIN_SVG}")`,
            backgroundSize: '200px 200px',
            backgroundRepeat: 'repeat'
          }}
        />

        {/* Giant ghost text */}
        <div 
          className="absolute inset-x-0 flex items-center justify-center pointer-events-none select-none z-[2]"
          style={{ top: '18%' }}
        >
          <span 
            className="uppercase whitespace-nowrap"
            style={{ 
              fontFamily: "'Anton', sans-serif",
              fontSize: 'clamp(90px, 28vw, 380px)',
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: '-0.02em',
              opacity: 0.25,
              color: 'white',
              mixBlendMode: 'overlay'
            }}
          >
            TONYI
          </span>
        </div>

        {/* Top-left brand label */}
        <div className="absolute top-6 left-4 sm:left-8 z-[60] flex items-center gap-2">
          <Footprints style={{ color: IMAGES[activeIndex].panel }} className="w-6 h-6 sm:w-8 sm:h-8" />
          <span 
            className="text-sm font-bold uppercase tracking-[0.2em]"
            style={{ color: IMAGES[activeIndex].panel }}
          >
            TONYI FOOTWEAR STORE
          </span>
        </div>

        {/* Top-right nav links */}
        <div className="absolute top-6 right-4 sm:right-8 z-[60] flex items-center gap-6">
          <button
            className="text-sm font-bold uppercase tracking-[0.1em] hover:opacity-75 transition-opacity hidden sm:block"
            style={{ color: IMAGES[activeIndex].panel }}
            onClick={() => {
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Contact
          </button>
          <button
            className="text-sm font-bold uppercase tracking-[0.1em] hover:opacity-75 transition-opacity flex items-center gap-2"
            style={{ color: IMAGES[activeIndex].panel }}
            onClick={() => navigateReactRouter('/cart')}
          >
            <ShoppingCart size={18} />
            <span className="bg-black/20 px-2 py-0.5 rounded-full text-xs">{cartCount}</span>
          </button>
          <button
            className="text-sm font-bold uppercase tracking-[0.1em] hover:opacity-75 transition-opacity hidden sm:block"
            style={{ color: IMAGES[activeIndex].panel }}
            onClick={() => {
              document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Store
          </button>
          <button
            className="text-sm font-bold uppercase tracking-[0.1em] hover:opacity-75 transition-opacity"
            style={{ color: IMAGES[activeIndex].panel }}
            onClick={() => navigateReactRouter('/admin')}
          >
            Admin
          </button>
        </div>

        {/* Carousel */}
        <div className="absolute inset-0 z-[3]">
          {IMAGES.map((img, index) => {
            const styles = getActualStyles(index);
            return (
              <div 
                key={img.id}
                className="absolute"
                style={styles}
              >
                <model-viewer 
                  src={img.src} 
                  alt={img.title}
                  auto-rotate="true"
                  camera-controls="true"
                  disable-zoom="true"
                  shadow-intensity="1"
                  loading={index === activeIndex ? "eager" : "lazy"}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    pointerEvents: index === activeIndex ? 'auto' : 'none',
                    outline: 'none'
                  }}
                >
                  <div slot="poster" className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/5" style={{ backdropFilter: 'blur(4px)' }}>
                    <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                  </div>
                </model-viewer>
              </div>
            );
          })}
        </div>

        {/* Bottom-left text + nav buttons */}
        <div className="absolute bottom-6 left-4 sm:bottom-20 sm:left-24 z-[60] max-w-[320px]">
          <p 
            className="font-bold uppercase mb-2 sm:mb-3 text-base sm:text-[22px]"
            style={{ 
              letterSpacing: '0.02em',
              color: IMAGES[activeIndex].panel 
            }}
          >
            {IMAGES[activeIndex].title}
          </p>
          <p 
            className="hidden sm:block text-xs sm:text-sm leading-relaxed mb-4 sm:mb-5"
            style={{ color: `${IMAGES[activeIndex].panel}CC` }} // 80% opacity
          >
            These sneakers are stunning, crafted to perfection. Step up your game with absolute comfort and iconic design. Shop the exclusive drop now.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('prev')}
              className="group flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 transition-all duration-150 active:scale-95 z-[60] relative"
              style={{ 
                transitionProperty: 'transform, background-color, border-color',
                borderColor: IMAGES[activeIndex].panel,
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${IMAGES[activeIndex].panel}1A`; // 10% opacity
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <ArrowLeft 
                size={26} 
                strokeWidth={2.25} 
                className="transform transition-transform duration-150 group-hover:scale-[1.08]" 
                style={{ color: IMAGES[activeIndex].panel }}
              />
            </button>
            <button
              onClick={() => navigate('next')}
              className="group flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 transition-all duration-150 active:scale-95 z-[60] relative"
              style={{ 
                transitionProperty: 'transform, background-color, border-color',
                borderColor: IMAGES[activeIndex].panel,
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${IMAGES[activeIndex].panel}1A`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <ArrowRight 
                size={26} 
                strokeWidth={2.25} 
                className="transform transition-transform duration-150 group-hover:scale-[1.08]" 
                style={{ color: IMAGES[activeIndex].panel }}
              />
            </button>
          </div>
        </div>

        {/* Bottom-right link */}
        <a 
          href="#collection"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="absolute bottom-6 right-4 sm:bottom-20 sm:right-10 z-[60] flex items-center gap-2 sm:gap-4 transition-opacity duration-200 uppercase"
          style={{ color: IMAGES[activeIndex].panel }}
        >
          <span 
            style={{ 
              fontFamily: "'Anton', sans-serif",
              fontSize: 'clamp(20px, 4vw, 56px)',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              lineHeight: 1
            }}
          >
            DISCOVER IT
          </span>
          <ArrowRight className="w-5 h-5 sm:w-8 sm:h-8" strokeWidth={2.25} />
        </a>

      </div>

      <ShoeCollection />
      <Contact />
      <Reviews />
      <CacheManager />
      
      {/* Footer */}
      <footer className="border-t border-white/10 py-12 bg-[#080808] text-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-['Bebas_Neue'] tracking-widest text-2xl text-white/40">TONYI FOOTWEAR © 2026</div>
          <div className="flex gap-6 text-sm font-bold text-white/60 uppercase tracking-widest text-xs">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
