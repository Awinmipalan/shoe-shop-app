import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag, Wallet, MessageSquare, ExternalLink, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CONTACT_PHONE, MERCHANT_WALLET } from '../config';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();
  const navigate = useNavigate();

  // Checkout states
  const [checkoutMethod, setCheckoutMethod] = useState<'whatsapp' | 'crypto'>('whatsapp');
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [walletError, setWalletError] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [transactionHash, setTransactionHash] = useState<string>('');

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

  const connectWallet = async () => {
    setWalletError('');
    setIsConnecting(true);
    try {
      const provider = (window as any).ethereum;
      if (!provider) {
        throw new Error("NoWeb3Provider");
      }
      
      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      if (accounts && accounts.length > 0) {
        setWalletAddress(accounts[0]);
      } else {
        throw new Error("NoAccountsFound");
      }
    } catch (err: any) {
      console.error("MetaMask connection error:", err);
      // Under sandboxed iframes, window.ethereum calls may fail with message or code restrictions
      if (err.message === "NoWeb3Provider") {
        setWalletError("MetaMask extension not found. Please install the MetaMask extension or check if it's disabled.");
      } else if (err.code === 4001) {
        setWalletError("Connection request was rejected. Please open MetaMask and click connect.");
      } else {
        setWalletError(
          "Connection failed. Since you are in the AI Studio preview window, MetaMask may be blocked by iframe sandboxing. Click 'Open in New Tab' at the top-right and try again!"
        );
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const processCryptoPayment = async () => {
    if (!walletAddress) return;
    setWalletError('');
    setIsConnecting(true);
    try {
      const provider = (window as any).ethereum;
      if (!provider) throw new Error("NoWeb3Provider");

      // Demo merchant wallet address
      const merchantAddress = MERCHANT_WALLET;
      
      // Calculate total amount in ETH (1 ₦ = 0.0000002 ETH approx ratio)
      const ethVal = Math.max(0.001, parseFloat((cartTotal / 5000000).toFixed(4)));
      const hexValue = "0x" + Math.round(ethVal * 1e18).toString(16);

      const transactionParameters = {
        to: merchantAddress,
        from: walletAddress,
        value: hexValue,
      };

      const txHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });

      setTransactionHash(txHash);
      setPaymentSuccess(true);
    } catch (err: any) {
      console.error("MetaMask transaction error:", err);
      if (err.code === 4001) {
        setWalletError("The transaction was rejected in MetaMask.");
      } else {
        setWalletError(
          err.message || "Failed to submit transaction. Verify your MetaMask balance and try again."
        );
      }
    } finally {
      setIsConnecting(false);
    }
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
                    <span className="font-['DM_Mono']">{checkoutMethod === 'whatsapp' ? 'Calculated on WhatsApp' : 'Calculated in transaction'}</span>
                  </div>
                </div>
                
                <div className="border-t border-white/10 pt-4 mb-8">
                  <div className="flex justify-between items-end">
                    <span className="font-bold text-lg">TOTAL</span>
                    <span className="font-bold text-2xl sm:text-3xl font-['Bebas_Neue'] tracking-wide text-white">₦{cartTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Choose Checkout Option */}
                <div className="mb-6">
                  <label className="text-white/40 text-xs font-['DM_Mono'] uppercase tracking-widest block mb-3">
                    Choose Payment Method
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCheckoutMethod('whatsapp');
                        setWalletError('');
                      }}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                        checkoutMethod === 'whatsapp'
                          ? 'border-[#FF4D00] bg-[#FF4D00]/5 text-white'
                          : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <MessageSquare size={18} className="mb-1" />
                      <span className="text-xs uppercase font-bold tracking-wider">WhatsApp</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => {
                        setCheckoutMethod('crypto');
                        setWalletError('');
                      }}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                        checkoutMethod === 'crypto'
                          ? 'border-[#FF4D00] bg-[#FF4D00]/5 text-white'
                          : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <Wallet size={18} className="mb-1" />
                      <span className="text-xs uppercase font-bold tracking-wider">MetaMask</span>
                    </button>
                  </div>
                </div>

                {/* Render WhatsApp and Web3 Actions */}
                {checkoutMethod === 'whatsapp' ? (
                  <>
                    <button 
                      onClick={handleCheckout}
                      className="w-full bg-[#25D366] text-black font-bold py-4 rounded-xl hover:bg-[#20ba59] transition-colors uppercase tracking-widest text-sm flex items-center justify-center gap-2"
                    >
                      <MessageSquare size={18} /> ORDER VIA WHATSAPP
                    </button>
                    <p className="text-center text-[11px] text-white/40 mt-4 font-['DM_Mono']">
                      You will be redirected to WhatsApp to complete your order securely.
                    </p>
                  </>
                ) : (
                  <div className="space-y-4">
                    {paymentSuccess ? (
                      <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
                        <CheckCircle className="text-green-400 mx-auto mb-2" size={32} />
                        <h4 className="text-sm font-bold text-green-400 uppercase tracking-widest mb-1">Payment Completed!</h4>
                        <p className="text-xs text-white/60 mb-2">Your kicks order has been authenticated on the blockchain.</p>
                        {transactionHash && (
                          <div className="bg-[#222] p-2 rounded text-[10px] text-white/40 select-all font-['DM_Mono'] break-all">
                            TX: {transactionHash}
                          </div>
                        )}
                        <button
                          onClick={() => {
                            setPaymentSuccess(false);
                            setTransactionHash('');
                          }}
                          className="mt-3 text-xs uppercase font-bold tracking-wider text-[#FF4D00] hover:underline"
                        >
                          Make New Transaction
                        </button>
                      </div>
                    ) : (
                      <>
                        {walletAddress ? (
                          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs text-white/40 font-['DM_Mono']">WALLET CONNECTED</span>
                              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                            </div>
                            <div className="font-['DM_Mono'] text-xs text-[#FF4D00] truncate bg-black/40 p-2 rounded">
                              {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
                            </div>
                            <div className="mt-3 flex justify-between text-xs text-white/60">
                              <span>Estimated Cost</span>
                              <span className="font-bold text-white font-['DM_Mono']">
                                ~{(cartTotal / 5000000).toFixed(4)} ETH
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-white/60 space-y-2">
                            <span className="font-bold text-white block uppercase tracking-wider">Metamask Web3 Payment</span>
                            <p>You can pay instantly using Ethereum via your browser extension wallet.</p>
                          </div>
                        )}

                        {walletError && (
                          <div className="bg-red-400/10 border border-red-400/20 text-red-400 p-4 rounded-xl text-xs space-y-2 leading-relaxed">
                            <p className="font-bold">⚠️ MetaMask Connection Hint:</p>
                            <p>{walletError}</p>
                            <a
                              href={window.location.href}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-white hover:underline mt-1 bg-white/10 px-2.5 py-1.5 rounded"
                            >
                              Open in New Tab <ExternalLink size={12} />
                            </a>
                          </div>
                        )}

                        {!walletAddress ? (
                          <button
                            onClick={connectWallet}
                            disabled={isConnecting}
                            className="w-full bg-[#FF4D00] text-white font-bold py-4 rounded-xl hover:bg-[#e04300] transition-colors uppercase tracking-widest text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                          >
                            <Wallet size={18} /> {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
                          </button>
                        ) : (
                          <button
                            onClick={processCryptoPayment}
                            disabled={isConnecting}
                            className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-white/90 transition-colors uppercase tracking-widest text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                          >
                            <ShoppingBag size={18} /> {isConnecting ? 'Processing...' : 'Pay with MetaMask'}
                          </button>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
