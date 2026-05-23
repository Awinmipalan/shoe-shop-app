import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Shoe {
  id: number;
  name: string;
  price: number;
  category: string;
  tag: string;
  accent: string;
  bg: string;
  img: string;
  desc: string;
  sizes: number[];
  colors?: string[]; // optional for backward compatibility
  outOfStock?: boolean;
}

const defaultShoes: Shoe[] = [
  {
    id: 1, name: "AIR VORTEX X", price: 249, category: "Running",
    tag: "NEW DROP", accent: "#FF4D00",
    bg: "linear-gradient(135deg, #1a0a00 0%, #3d1a00 100%)",
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop",
    desc: "Carbon-plated speed machine",
    sizes: [40, 41, 42, 43, 44],
    colors: ["Red", "Black"],
    outOfStock: false,
  },
  {
    id: 2, name: "PHANTOM DRIFT", price: 189, category: "Lifestyle",
    tag: "BESTSELLER", accent: "#00E5FF",
    bg: "linear-gradient(135deg, #000d1a 0%, #001f3d 100%)",
    img: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&auto=format&fit=crop",
    desc: "Street-ready silhouette",
    sizes: [39, 40, 42, 43],
    colors: ["Blue", "White"],
    outOfStock: false,
  },
  {
    id: 3, name: "TERRA FORCE", price: 219, category: "Trail",
    tag: "LIMITED", accent: "#B8FF57",
    bg: "linear-gradient(135deg, #0d1a00 0%, #1f3d00 100%)",
    img: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=500&auto=format&fit=crop",
    desc: "All-terrain dominance",
    sizes: [40, 41, 42, 44, 45],
    colors: ["Green", "Black"],
    outOfStock: false,
  },
  {
    id: 4, name: "CHROME SLIP", price: 159, category: "Lifestyle",
    tag: "SALE −20%", accent: "#E040FB",
    bg: "linear-gradient(135deg, #1a001f 0%, #3d0050 100%)",
    img: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&auto=format&fit=crop",
    desc: "Minimal luxury form",
    sizes: [38, 39, 40, 41],
    colors: ["Purple", "Black"],
    outOfStock: false,
  },
  {
    id: 5, name: "HYPER COURT", price: 279, category: "Basketball",
    tag: "NEW DROP", accent: "#FFD600",
    bg: "linear-gradient(135deg, #1a1500 0%, #3d3000 100%)",
    img: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=500&auto=format&fit=crop",
    desc: "Court-engineered traction",
    sizes: [41, 42, 43, 44, 45],
    colors: ["Yellow", "Black"],
    outOfStock: false,
  },
  {
    id: 6, name: "STEALTH RUN", price: 199, category: "Running",
    tag: "EDITORS' PICK", accent: "#FF80AB",
    bg: "linear-gradient(135deg, #1a0010 0%, #3d0025 100%)",
    img: "https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=500&auto=format&fit=crop",
    desc: "Ghost-weight responsive",
    sizes: [39, 40, 41, 42, 43],
    colors: ["Pink", "Black"],
    outOfStock: false,
  },
  {
    id: 7, name: "OBSIDIAN LOW", price: 169, category: "Lifestyle",
    tag: "CLASSIC", accent: "#78FFD6",
    bg: "linear-gradient(135deg, #001a15 0%, #003d30 100%)",
    img: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&auto=format&fit=crop",
    desc: "Clean lines. Zero noise.",
    sizes: [40, 41, 42, 43],
    colors: ["Teal", "Black"],
    outOfStock: false,
  },
  {
    id: 8, name: "APEX TRAIL GT", price: 239, category: "Trail",
    tag: "NEW DROP", accent: "#FF6E40",
    bg: "linear-gradient(135deg, #1a0800 0%, #3d1500 100%)",
    img: "https://images.unsplash.com/photo-1542219550-37153d387c27?w=500&auto=format&fit=crop",
    desc: "Grip. Go. Repeat.",
    sizes: [41, 42, 43, 44, 45],
    colors: ["Orange", "Grey"],
    outOfStock: false,
  },
];

interface ShoeContextType {
  shoes: Shoe[];
  addShoe: (shoe: Omit<Shoe, 'id'>) => void;
  deleteShoe: (id: number) => void;
}

const ShoeContext = createContext<ShoeContextType | undefined>(undefined);

export const ShoeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shoes, setShoes] = useState<Shoe[]>(() => {
    try {
      const stored = localStorage.getItem('tonyiShoes');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }
    return defaultShoes;
  });

  useEffect(() => {
    localStorage.setItem('tonyiShoes', JSON.stringify(shoes));
  }, [shoes]);

  const addShoe = (newShoe: Omit<Shoe, 'id'>) => {
    setShoes(prev => {
      const maxId = prev.reduce((max, s) => Math.max(max, s.id), 0);
      return [{ ...newShoe, id: maxId + 1 }, ...prev];
    });
  };

  const deleteShoe = (id: number) => {
    setShoes(prev => prev.filter(s => s.id !== id));
  };

  return (
    <ShoeContext.Provider value={{ shoes, addShoe, deleteShoe }}>
      {children}
    </ShoeContext.Provider>
  );
};

export const useShoes = () => {
  const context = useContext(ShoeContext);
  if (!context) {
    throw new Error('useShoes must be used within a ShoeProvider');
  }
  return context;
};
