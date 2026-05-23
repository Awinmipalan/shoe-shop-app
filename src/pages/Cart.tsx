import React from 'react';
import { useCart } from '../context/CartContext';
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CONTACT_PHONE } from '../config';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cart.length === 0) return;

    let message = "Hello! I would like to place an order for the following items:%0A%0A";
    
    cart.forEach(item => {
      message += `- *${item.shoe.name}*%0A`;
      message += `  Size: ${item.size}%0A`;
      message += `  Quantity: ${item.quantity}%0A`;
      message += `  Price: ₦${(item.shoe.price * 1600 * item.quantity).toLocaleString()}%0A%0A`;
    });

    message += `*Total Amount:* ₦${cartTotal.toLocaleString()}`;

    window.open(`https://wa.me/${CONTACT_PHONE}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white p-6 md:p-12 font-['Syne']">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
          <button 
            onClick={() => navigate('/')} 
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft />
          </button>
          <h1 className="text-3xl sm:text-4xl font-black font-['Bebas_Neue'] tracking-wide uppercase flex-1">Shopping Cart</h1>
          
          <button onClick={() => navigate('/contact')} className="hidden sm:inline-flex items-center gap-2 text-sm font-bold font-['Syne'] uppercase bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full transition-colors tracking-widest text-[#f0f0f0]">
            Track Order
          </button>
          
          <div className="bg-white/10 px-4 py-2 rounded-full font-['DM_Mono'] text-sm">
            {cartCount} ITEMS
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag size={48} className="text-white/20" />
            </div>
            <h2 className="text-2xl font-bold mb-4 font-['Bebas_Neue'] tracking-wider">Your cart is empty</h2>
            <p className="text-white/60 mb-8 max-w-md">Looks like you haven't added any kicks to your cart yet. Discover our latest collections.</p>
            <button 
              onClick={() => navigate('/')}
              className="bg-white text-black font-bold py-3 px-8 rounded-full hover:bg-white/90 transition-colors uppercase tracking-widest text-sm"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 flex flex-col gap-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-[#111] border border-white/10 rounded-2xl p-4 flex gap-4 sm:gap-6 items-center">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl bg-[#222] shrink-0 overflow-hidden flex items-center justify-center relative">
                    <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <img src={item.shoe.img} alt={item.shoe.name} className="w-[120%] h-auto object-contain -rotate-[15deg] filter drop-shadow-2xl z-10 scale-110" />
                  </div>
                  
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="text-xs font-['DM_Mono'] mb-1" style={{ color: item.shoe.accent }}>{item.shoe.category}</div>
                      <h3 className="font-black text-xl sm:text-2xl font-['Bebas_Neue'] tracking-wider leading-none mb-2 text-white">{item.shoe.name}</h3>
                      <div className="text-sm text-white/60 font-['DM_Mono']">SIZE: {item.size}</div>
                      <div className="text-lg font-bold mt-2 hidden sm:block">₦{(item.shoe.price * 1600).toLocaleString()}</div>
                    </div>
                    
                    <div className="flex items-center gap-4 sm:gap-6 justify-between sm:justify-end">
                      <div className="text-lg font-bold sm:hidden">₦{(item.shoe.price * 1600).toLocaleString()}</div>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3 bg-[#222] rounded-lg p-1 border border-white/10">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="font-['DM_Mono'] w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-400/80 hover:text-red-400 p-2 hover:bg-red-400/10 rounded-lg transition-colors"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-[#111] border border-white/10 rounded-2xl p-6 sticky top-6">
                <h3 className="font-bold text-lg mb-6 border-b border-white/10 pb-4">ORDER SUMMARY</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-white/80">
                    <span>Subtotal ({cartCount} items)</span>
                    <span className="font-['DM_Mono']">₦{cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-white/80">
                    <span>Shipping</span>
                    <span className="font-['DM_Mono']">Calculated on WhatsApp</span>
                  </div>
                </div>
                
                <div className="border-t border-white/10 pt-4 mb-8">
                  <div className="flex justify-between items-end">
                    <span className="font-bold text-lg">TOTAL</span>
                    <span className="font-bold text-2xl sm:text-3xl font-['Bebas_Neue'] tracking-wide text-white">₦{cartTotal.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <button 
                    onClick={handleCheckout}
                    className="w-full bg-[#25D366] text-black font-bold py-4 rounded-xl hover:bg-[#20ba59] transition-colors uppercase tracking-widest text-sm flex items-center justify-center gap-2"
                  >
                    <MessageSquare size={18} /> ORDER VIA WHATSAPP
                  </button>
                  <p className="text-center text-[11px] text-white/40 mt-4 font-['DM_Mono']">
                    You will be redirected to WhatsApp to complete your order securely.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
