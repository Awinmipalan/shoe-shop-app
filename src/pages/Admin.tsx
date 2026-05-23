import React, { useState } from 'react';
import { useShoes } from '../context/ShoeContext';
import { LogOut, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ADMIN_USERNAME, ADMIN_PASSWORD } from '../config';

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { shoes, addShoe, deleteShoe } = useShoes();
  const navigate = useNavigate();

  // New shoe form state
  const [newShoe, setNewShoe] = useState({
    name: '',
    price: '',
    category: 'Running',
    tag: 'NEW',
    accent: '#000000',
    bg: 'linear-gradient(135deg, #444 0%, #111 100%)',
    img: '',
    desc: '',
    sizes: '40, 41, 42',
    colors: 'Black',
    outOfStock: false
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('Invalid credentials');
    }
  };

  const handleAddShoe = (e: React.FormEvent) => {
    e.preventDefault();
    addShoe({
      name: newShoe.name,
      price: Number(newShoe.price) || 0,
      category: newShoe.category,
      tag: newShoe.tag,
      accent: newShoe.accent,
      bg: newShoe.bg,
      img: newShoe.img,
      desc: newShoe.desc,
      sizes: newShoe.sizes.split(',').map(s => parseInt(s.trim())).filter(s => !isNaN(s)),
      colors: newShoe.colors.split(',').map(c => c.trim()).filter(Boolean),
      outOfStock: newShoe.outOfStock
    });
    setNewShoe({
      name: '',
      price: '',
      category: 'Running',
      tag: 'NEW',
      accent: '#000000',
      bg: 'linear-gradient(135deg, #444 0%, #111 100%)',
      img: '',
      desc: '',
      sizes: '40, 41, 42',
      colors: 'Black',
      outOfStock: false
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center p-4">
        <div className="bg-[#111] p-8 rounded-2xl w-full max-w-md border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6 text-center font-['Syne']">Admin Access</h2>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="text-white/60 text-xs mb-1 block font-['DM_Mono']">USERNAME</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-[#222] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/30"
                placeholder="Enter username"
              />
            </div>
            <div>
              <label className="text-white/60 text-xs mb-1 block font-['DM_Mono']">PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-[#222] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/30"
                placeholder="Enter password"
              />
            </div>
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            <button
              type="submit"
              className="mt-4 bg-white text-black font-bold py-3 rounded-lg hover:bg-white/90 transition-colors font-['Syne']"
            >
              LOGIN
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="mt-2 text-white/60 text-sm py-2 hover:text-white transition-colors"
            >
              Return to Store
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white p-6 md:p-12 font-['Syne']">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-black font-['Bebas_Neue'] tracking-wide">STORE ADMIN</h1>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="text-white/60 hover:text-white transition-colors text-sm font-['DM_Mono']">
              VIEW STORE
            </button>
            <button
              onClick={() => setIsLoggedIn(false)}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
            >
              <LogOut size={16} /> <span className="text-sm font-bold">LOGOUT</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1 border border-white/10 rounded-2xl p-6 bg-[#111]">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
              <Plus size={20} /> Add New Collection
            </h2>
            <form onSubmit={handleAddShoe} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-white/60 text-xs mb-1 block">NAME</label>
                  <input required type="text" value={newShoe.name} onChange={e => setNewShoe({...newShoe, name: e.target.value})} className="w-full bg-[#222] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-white/30 outline-none" />
                </div>
                <div>
                  <label className="text-white/60 text-xs mb-1 block">PRICE (₦)</label>
                  <input required type="number" value={newShoe.price} onChange={e => setNewShoe({...newShoe, price: e.target.value})} className="w-full bg-[#222] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-white/30 outline-none" />
                </div>
                <div>
                  <label className="text-white/60 text-xs mb-1 block">CATEGORY</label>
                  <input required type="text" value={newShoe.category} onChange={e => setNewShoe({...newShoe, category: e.target.value})} className="w-full bg-[#222] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-white/30 outline-none" />
                </div>
                <div>
                  <label className="text-white/60 text-xs mb-1 block">TAG</label>
                  <input type="text" value={newShoe.tag} onChange={e => setNewShoe({...newShoe, tag: e.target.value})} className="w-full bg-[#222] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-white/30 outline-none" />
                </div>
                <div>
                  <label className="text-white/60 text-xs mb-1 block">ACCENT HEX</label>
                  <input type="text" value={newShoe.accent} onChange={e => setNewShoe({...newShoe, accent: e.target.value})} className="w-full bg-[#222] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-white/30 outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="text-white/60 text-xs mb-1 block">BG GRADIENT</label>
                  <input type="text" value={newShoe.bg} onChange={e => setNewShoe({...newShoe, bg: e.target.value})} className="w-full bg-[#222] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-white/30 outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="text-white/60 text-xs mb-1 block">IMAGE (URL OR UPLOAD)</label>
                  <div className="flex gap-2">
                    <input required={!newShoe.img} type="text" placeholder="https://..." value={newShoe.img.startsWith('data:image') ? '' : newShoe.img} onChange={e => setNewShoe({...newShoe, img: e.target.value})} className="flex-1 bg-[#222] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-white/30 outline-none" />
                    <input type="file" id="imageUpload" accept="image/*" className="hidden" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setNewShoe({...newShoe, img: reader.result as string});
                        reader.readAsDataURL(file);
                      }
                    }} />
                    <label htmlFor="imageUpload" className="bg-[#333] hover:bg-[#444] text-white px-4 py-2 rounded-lg cursor-pointer whitespace-nowrap transition-colors flex items-center justify-center text-sm font-bold border border-white/10">
                      UPLOAD
                    </label>
                  </div>
                  {newShoe.img && newShoe.img.startsWith('data:image') && (
                     <div className="mt-2 text-xs text-green-400">✓ Image file attached</div>
                  )}
                </div>
                <div className="col-span-2">
                  <label className="text-white/60 text-xs mb-1 block">DESCRIPTION</label>
                  <textarea required value={newShoe.desc} onChange={e => setNewShoe({...newShoe, desc: e.target.value})} className="w-full bg-[#222] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-white/30 outline-none min-h-[60px]" />
                </div>
                <div className="col-span-2">
                  <label className="text-white/60 text-xs mb-1 block">SIZES (comma separated)</label>
                  <input required type="text" value={newShoe.sizes} onChange={e => setNewShoe({...newShoe, sizes: e.target.value})} className="w-full bg-[#222] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-white/30 outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="text-white/60 text-xs mb-1 block">COLORS (comma separated)</label>
                  <input required type="text" value={newShoe.colors} onChange={e => setNewShoe({...newShoe, colors: e.target.value})} className="w-full bg-[#222] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-white/30 outline-none" />
                </div>
                <div className="col-span-2 flex items-center gap-2 mt-2">
                  <input type="checkbox" id="outOfStock" checked={newShoe.outOfStock} onChange={e => setNewShoe({...newShoe, outOfStock: e.target.checked})} className="w-4 h-4 rounded border-white/10" />
                  <label htmlFor="outOfStock" className="text-sm">Out of Stock</label>
                </div>
              </div>
              <button type="submit" className="mt-4 bg-white text-black font-bold py-3 rounded-lg hover:bg-white/90 transition-colors">
                Add Collection Item
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 border border-white/10 rounded-2xl p-6 bg-[#111] overflow-x-auto">
            <h2 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">Manage Collections</h2>
            <div className="grid gap-4">
              {shoes.map(shoe => (
                <div key={shoe.id} className="flex items-center justify-between p-4 bg-[#222] rounded-xl border border-white/5">
                  <div className="flex items-center gap-4">
                    <img src={shoe.img} alt={shoe.name} className="w-16 h-16 object-cover rounded-lg bg-black" />
                    <div>
                      <h3 className="font-bold text-lg font-['Bebas_Neue'] tracking-wider">{shoe.name}</h3>
                      <p className="text-white/60 text-xs font-['DM_Mono']">
                        ₦{(shoe.price * 1600).toLocaleString()} • {shoe.category} • Sizes: {shoe.sizes.join(', ')} 
                        {shoe.outOfStock && <span className="ml-2 text-red-400">OUT OF STOCK</span>}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteShoe(shoe.id)}
                    className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors shrink-0"
                    title="Delete"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
              {shoes.length === 0 && (
                <p className="text-center text-white/40 py-10 font-['DM_Mono']">No shoes in collection</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
