import React, { useState, useEffect, useRef } from "react";
import { useShoes } from "../context/ShoeContext";
import { useCart } from "../context/CartContext";

const categories = ["All", "Running", "Lifestyle", "Trail", "Basketball"];
const gridSizes = ["hero", "normal", "tall", "normal", "wide", "normal", "normal", "tall"];

export default function ShoeCollection() {
  const { shoes } = useShoes();
  const { addToCart } = useCart();
  const [active, setActive] = useState("All");
  const [hovered, setHovered] = useState<number | null>(null);
  const [added, setAdded] = useState<number | null>(null);
  const [visible, setVisible] = useState<number[]>([]);
  const [selectedSize, setSelectedSize] = useState<Record<number, number>>({});
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const filtered = React.useMemo(() => {
    return active === "All" ? shoes : shoes.filter(s => s.category === active);
  }, [active]);

  useEffect(() => {
    setVisible([]);
    filtered.forEach((s, i) => {
      setTimeout(() => setVisible(prev => {
        if (!prev.includes(s.id)) {
          return [...prev, s.id];
        }
        return prev;
      }), i * 80 + 50);
    });
  }, [active, filtered]);

  const handleAdd = (shoeId: number) => {
    const shoe = shoes.find(s => s.id === shoeId);
    if (!shoe) return;
    
    // Pick selected size or default to first size
    const size = selectedSize[shoeId] || shoe.sizes[0];
    
    addToCart(shoe, size);
    
    setAdded(shoeId);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setAdded(null), 1600);
  };

  const getGridClass = (idx: number) => {
    const s = gridSizes[idx % gridSizes.length];
    if (s === "hero") return "card-hero";
    if (s === "tall") return "card-tall";
    if (s === "wide") return "card-wide";
    return "card-normal";
  };

  return (
    <div className="collection-wrapper relative z-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');

        .collection-wrapper {
          background: #080808;
          color: #f0f0f0;
          font-family: 'Syne', sans-serif;
          min-height: 100vh;
        }

        .page { background: #080808; padding: 0 0 80px; }

        /* HEADER */
        .collection-wrapper .header {
          padding: 48px 40px 0;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 24px;
        }
        .collection-wrapper .brand-label {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.3em;
          color: #666;
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .collection-wrapper .page-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(56px, 8vw, 110px);
          line-height: 0.9;
          letter-spacing: -0.02em;
          color: #f0f0f0;
        }
        .collection-wrapper .title-accent {
          color: transparent;
          -webkit-text-stroke: 1.5px #f0f0f0;
        }
        .collection-wrapper .count-badge {
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          color: #444;
          letter-spacing: 0.1em;
          align-self: flex-end;
          padding-bottom: 8px;
        }

        /* FILTERS */
        .collection-wrapper .filters {
          padding: 32px 40px 0;
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .collection-wrapper .filter-btn {
          font-family: 'Syne', sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 9px 20px;
          border-radius: 100px;
          border: 1px solid #222;
          background: transparent;
          color: #555;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
        }
        .collection-wrapper .filter-btn:hover { color: #f0f0f0; border-color: #444; }
        .collection-wrapper .filter-btn.active {
          background: #f0f0f0;
          color: #080808;
          border-color: #f0f0f0;
        }

        /* GRID */
        .collection-wrapper .grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          padding: 28px 40px 0;
        }
        @media (max-width: 1100px) {
          .collection-wrapper .grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 720px) {
          .collection-wrapper .grid { grid-template-columns: repeat(2, 1fr); padding: 20px 16px 0; }
          .collection-wrapper .header, .collection-wrapper .filters { padding-left: 16px; padding-right: 16px; }
          .collection-wrapper .card-hero { grid-column: span 2 !important; grid-row: span 1 !important; }
          .collection-wrapper .card-wide { grid-column: span 2 !important; }
          .collection-wrapper .card-tall { grid-row: span 1 !important; }
          .collection-wrapper .page-title { font-size: 52px; }
        }
        .collection-wrapper .card-hero  { grid-column: span 2; grid-row: span 2; }
        .collection-wrapper .card-tall  { grid-row: span 2; }
        .collection-wrapper .card-wide  { grid-column: span 2; }

        /* CARD */
        .collection-wrapper .card {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          min-height: 240px;
          opacity: 0;
          transform: translateY(24px) scale(0.97);
          transition:
            opacity 0.5s cubic-bezier(0.4,0,0.2,1),
            transform 0.5s cubic-bezier(0.4,0,0.2,1),
            box-shadow 0.3s ease;
        }
        .collection-wrapper .card.visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
        .collection-wrapper .card:hover {
          box-shadow: 0 28px 70px rgba(0,0,0,0.7);
          z-index: 10;
        }

        /* BG layer */
        .collection-wrapper .card-bg {
          position: absolute;
          inset: 0;
          transition: transform 0.7s cubic-bezier(0.4,0,0.2,1);
        }
        .collection-wrapper .card:hover .card-bg { transform: scale(1.05); }

        /* Dark vignette at bottom for text readability */
        .collection-wrapper .card-vignette {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(0,0,0,0) 0%,
            rgba(0,0,0,0.1) 40%,
            rgba(0,0,0,0.75) 100%
          );
          z-index: 2;
          pointer-events: none;
        }

        /* SHOE IMAGE */
        .collection-wrapper .shoe-img-wrap {
          position: absolute;
          right: -14px;
          top: 50%;
          transform: translateY(-54%) rotate(-18deg) scale(1);
          width: 62%;
          z-index: 3;
          transition: transform 0.65s cubic-bezier(0.34, 1.4, 0.64, 1),
                      filter 0.4s ease;
          filter: drop-shadow(0 20px 40px rgba(0,0,0,0.55));
          pointer-events: none;
        }
        .collection-wrapper .card-hero .shoe-img-wrap {
          width: 55%;
          right: -8px;
        }
        .collection-wrapper .card-wide .shoe-img-wrap {
          width: 38%;
        }
        .collection-wrapper .card:hover .shoe-img-wrap {
          transform: translateY(-62%) rotate(-10deg) scale(1.1);
          filter: drop-shadow(0 32px 56px rgba(0,0,0,0.7));
        }
        .collection-wrapper .shoe-img-wrap img {
          width: 100%;
          height: auto;
          display: block;
          object-fit: contain;
          border-radius: 8px;
        }

        /* Shimmer overlay on image hover */
        .collection-wrapper .shoe-img-wrap::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.12) 50%, transparent 70%);
          background-size: 200% 100%;
          background-position: -100% 0;
          border-radius: 8px;
          transition: background-position 0.6s ease;
        }
        .collection-wrapper .card:hover .shoe-img-wrap::after {
          background-position: 200% 0;
        }

        /* CARD INNER */
        .collection-wrapper .card-inner {
          position: relative;
          z-index: 4;
          height: 100%;
          min-height: inherit;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 18px 20px 20px;
        }

        /* Tag */
        .collection-wrapper .tag {
          display: inline-flex;
          align-items: center;
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 5px 10px;
          border-radius: 100px;
          border: 1px solid currentColor;
          width: fit-content;
          opacity: 0.85;
          backdrop-filter: blur(4px);
          background: rgba(0,0,0,0.2);
          transition: opacity 0.2s, background 0.2s;
        }
        .collection-wrapper .card:hover .tag {
          opacity: 1;
          background: rgba(0,0,0,0.4);
        }

        /* Bottom */
        .collection-wrapper .card-bottom { display: flex; flex-direction: column; gap: 4px; }

        .collection-wrapper .card-name {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(22px, 2.6vw, 32px);
          letter-spacing: 0.04em;
          line-height: 1;
          color: #f0f0f0;
          transition: color 0.25s;
          text-shadow: 0 2px 12px rgba(0,0,0,0.5);
        }
        .collection-wrapper .card-hero .card-name { font-size: clamp(34px, 4vw, 52px); }

        .collection-wrapper .card-desc {
          font-size: 11px;
          color: rgba(255,255,255,0.6);
          letter-spacing: 0.05em;
          max-height: 0;
          opacity: 0;
          overflow: hidden;
          transition: max-height 0.35s ease, opacity 0.3s ease;
        }
        .collection-wrapper .card:hover .card-desc { max-height: 24px; opacity: 1; }

        .collection-wrapper .card-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 6px;
        }
        .collection-wrapper .card-price {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 20px;
          letter-spacing: 0.06em;
          text-shadow: 0 2px 10px rgba(0,0,0,0.4);
        }

        /* Sizes */
        .collection-wrapper .sizes-row {
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
          margin-top: 6px;
          max-height: 0;
          opacity: 0;
          overflow: hidden;
          transition: max-height 0.4s cubic-bezier(0.4,0,0.2,1) 0.05s,
                      opacity 0.3s ease 0.1s;
        }
        .collection-wrapper .card:hover .sizes-row { max-height: 40px; opacity: 1; }

        .collection-wrapper .size-btn {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          padding: 3px 7px;
          border-radius: 4px;
          border: 1px solid rgba(255,255,255,0.2);
          background: rgba(0,0,0,0.3);
          color: rgba(255,255,255,0.6);
          cursor: pointer;
          transition: all 0.18s ease;
          backdrop-filter: blur(4px);
        }
        .collection-wrapper .size-btn:hover, .collection-wrapper .size-btn.sel {
          background: rgba(255,255,255,0.15);
          color: #f0f0f0;
          border-color: rgba(255,255,255,0.45);
        }

        /* Add button */
        .collection-wrapper .add-btn {
          font-family: 'Syne', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 8px 14px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transform: translateY(8px);
          opacity: 0;
          pointer-events: none;
          transition: transform 0.35s cubic-bezier(0.34,1.2,0.64,1) 0.1s,
                      opacity 0.3s ease 0.1s,
                      box-shadow 0.2s,
                      filter 0.15s;
          white-space: nowrap;
        }
        .collection-wrapper .card:hover .add-btn {
          transform: translateY(0);
          opacity: 1;
          pointer-events: auto;
        }
        .collection-wrapper .add-btn:hover { filter: brightness(1.12); transform: translateY(-2px) !important; }
        .collection-wrapper .add-btn:active { transform: scale(0.96) !important; }

        /* Accent bottom bar */
        .collection-wrapper .divider {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 2px;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.45s cubic-bezier(0.4,0,0.2,1);
          z-index: 5;
        }
        .collection-wrapper .card:hover .divider { transform: scaleX(1); }

        /* TOAST */
        .collection-wrapper .toast {
          position: fixed;
          bottom: 32px; right: 32px;
          background: #f0f0f0;
          color: #080808;
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 700;
          padding: 14px 22px;
          border-radius: 100px;
          letter-spacing: 0.06em;
          transform: translateY(80px);
          opacity: 0;
          transition: transform 0.4s cubic-bezier(0.34,1.4,0.64,1), opacity 0.3s ease;
          z-index: 100;
          pointer-events: none;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          cursor: pointer;
        }
        .collection-wrapper .toast.show { transform: translateY(0); opacity: 1; pointer-events: auto; }
        .collection-wrapper .toast:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.6); }

        /* MARQUEE */
        .collection-wrapper .marquee-wrap {
          overflow: hidden;
          border-top: 1px solid #151515;
          border-bottom: 1px solid #151515;
          margin: 36px 0 0;
          padding: 10px 0;
        }
        .collection-wrapper .marquee-track {
          display: flex;
          gap: 40px;
          white-space: nowrap;
          animation: marquee 20s linear infinite;
        }
        .collection-wrapper .marquee-item {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 13px;
          letter-spacing: 0.3em;
          color: #333;
          flex-shrink: 0;
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        /* CURSOR */
        .collection-wrapper .cursor-dot {
          width: 8px; height: 8px;
          background: #f0f0f0;
          border-radius: 50%;
          position: fixed;
          top: 0; left: 0;
          pointer-events: none;
          z-index: 9999;
          mix-blend-mode: difference;
          transition: width 0.2s, height 0.2s;
          transform: translate(-50%, -50%);
        }
        .collection-wrapper .cursor-dot.expand { width: 40px; height: 40px; }
      `}</style>

      <CursorDot hovered={hovered} />

      <div className="page" id="collection" style={{ minHeight: '100vh', background: '#080808', padding: '0 0 80px' }}>
        {/* Marquee */}
        <div className="marquee-wrap">
          <div className="marquee-track">
            {Array(8).fill(["NEW COLLECTION 2026", "FREE SHIPPING OVER ₦50K", "NEW DROPS EVERY FRIDAY", "EXCLUSIVE COLLABS"]).flat().map((t, i) => (
              <span key={i} className="marquee-item">— {t} </span>
            ))}
          </div>
        </div>

        {/* Header */}
        <div className="header">
          <div>
            <div className="brand-label">TONYI FOOTWEAR</div>
            <h1 className="page-title">
              STEP<br /><span className="title-accent">INTO</span><br />2026
            </h1>
          </div>
          <div className="count-badge">{filtered.length} STYLES</div>
        </div>

        {/* Filters */}
        <div className="filters">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn${active === cat ? " active" : ""}`}
              onClick={() => setActive(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid">
          {filtered.map((shoe, idx) => {
            const sizeClass = getGridClass(idx);
            const isSel = (sz: number) => selectedSize[shoe.id] === sz;
            return (
              <div
                key={shoe.id}
                className={`card ${sizeClass} ${visible.includes(shoe.id) ? "visible" : ""}`}
                style={{ transitionDelay: `${idx * 50}ms` }}
                onMouseEnter={() => setHovered(shoe.id)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Gradient background */}
                <div className="card-bg" style={{ background: shoe.bg }} />

                {/* Vignette for text contrast */}
                <div className="card-vignette" />

                {/* Bottom accent line */}
                <div className="divider" style={{ background: shoe.accent }} />

                {/* Real shoe image */}
                <div className="shoe-img-wrap">
                  <img
                    src={shoe.img}
                    alt={shoe.name}
                    loading="lazy"
                  />
                </div>

                <div className="card-inner">
                  {/* Tag */}
                  <div className="flex gap-2">
                    <div className="tag" style={{ color: shoe.accent, borderColor: shoe.accent + "55" }}>
                      {shoe.tag}
                    </div>
                    {shoe.outOfStock && (
                      <div className="tag" style={{ color: '#ff4444', borderColor: '#ff444455' }}>
                        SOLD OUT
                      </div>
                    )}
                  </div>

                  {/* Bottom info */}
                  <div className="card-bottom">
                    <div
                      className="card-name"
                      style={{ color: hovered === shoe.id ? shoe.accent : "#f0f0f0" }}
                    >
                      {shoe.name}
                    </div>
                    <div className="card-desc">{shoe.desc}</div>

                    <div className="card-row">
                      <div className="card-price" style={{ color: shoe.accent }}>
                        ₦{(shoe.price * 1600).toLocaleString()}
                      </div>
                      <button
                        className="add-btn"
                        style={{
                          background: shoe.outOfStock ? '#444' : shoe.accent,
                          color: shoe.outOfStock ? '#888' : "#080808",
                          boxShadow: shoe.outOfStock ? 'none' : `0 4px 20px ${shoe.accent}55`,
                          cursor: shoe.outOfStock ? 'not-allowed' : 'pointer'
                        }}
                        disabled={shoe.outOfStock}
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          if (!shoe.outOfStock) handleAdd(shoe.id); 
                        }}
                      >
                        {shoe.outOfStock ? "OUT OF STOCK" : (added === shoe.id ? "✓ ADDED" : "+ ADD")}
                      </button>
                    </div>

                    <div className="sizes-row">
                      {shoe.sizes.map(sz => (
                        <button
                          key={sz}
                          className={`size-btn${isSel(sz) ? " sel" : ""}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSize(prev => ({ ...prev, [shoe.id]: sz }));
                          }}
                          style={isSel(sz) ? { borderColor: shoe.accent, color: shoe.accent } : {}}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div 
        className={`toast${added ? " show" : ""}`}
        onClick={() => window.location.href = '/cart'}
      >
        ADDED TO CART ✓ (CLICK TO VIEW)
      </div>
    </div>
  );
}

function CursorDot({ hovered }: { hovered: number | null }) {
  const dotRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + "px";
        dotRef.current.style.top = e.clientY + "px";
      }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return <div ref={dotRef} className={`cursor-dot${hovered ? " expand" : ""}`} />;
}
