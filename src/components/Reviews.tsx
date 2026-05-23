import React, { useState, useEffect, useRef } from 'react';
import { Star, UploadCloud, X, Camera, Check, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Review {
  id: string | number;
  name: string;
  handle: string;
  text: string;
  rating: number;
  img: string;
  date: string;
  verified: boolean;
}

const DEFAULT_REVIEWS: Review[] = [
  { 
    id: 1, 
    name: "David O.", 
    handle: "@davido_kicks", 
    text: "Yo! The delivery was crazy fast and the fit is 10/10. Definitely coming back for the Neons.", 
    rating: 5,
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800",
    date: "May 12, 2026",
    verified: true
  },
  { 
    id: 2, 
    name: "Sarah J.", 
    handle: "@sarah_j", 
    text: "Absolutely love them 😭 The texture is exactly what was shown on the 3D model. Highly recommend Tonyi Footwear!", 
    rating: 5,
    img: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=800",
    date: "May 18, 2026",
    verified: true
  },
  { 
    id: 2.5, 
    name: "Michael B.", 
    handle: "@mike_b", 
    text: "My collection is finally complete. These Spectras are too clean. Respect 💯", 
    rating: 5,
    img: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=800",
    date: "May 20, 2026",
    verified: true
  },
];

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // New review form states
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);
  const [imageString, setImageString] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load reviews from localStorage on initialization
  useEffect(() => {
    const saved = localStorage.getItem('tonyi_user_reviews');
    if (saved) {
      try {
        setReviews(JSON.parse(saved));
      } catch (e) {
        setReviews(DEFAULT_REVIEWS);
      }
    } else {
      setReviews(DEFAULT_REVIEWS);
    }
  }, []);

  // Save reviews whenever state changes
  const saveReviews = (updatedReviews: Review[]) => {
    setReviews(updatedReviews);
    localStorage.setItem('tonyi_user_reviews', JSON.stringify(updatedReviews));
  };

  // Convert File to Base64 String safely
  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload a valid image file (jpeg, png, webp).');
      return;
    }
    if (file.size > 8 * 1024 * 1024) { // 8MB limit
      setErrorMessage('File size must be smaller than 8MB.');
      return;
    }

    setErrorMessage('');
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setImageString(reader.result);
      }
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  // Drag & Drop Triggers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setImageString('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please provide your name.');
      return;
    }
    if (!text.trim()) {
      setErrorMessage('Please write a short comment about your purchase.');
      return;
    }
    if (!imageString) {
      setErrorMessage('Please select or upload a image file for your comment.');
      return;
    }

    // Prepare clean handle
    const cleanHandle = handle.trim() 
      ? (handle.trim().startsWith('@') ? handle.trim() : `@${handle.trim()}`)
      : `@${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_vouch`;

    const newReview: Review = {
      id: `review_${Date.now()}`,
      name: name.trim(),
      handle: cleanHandle,
      text: text.trim(),
      rating,
      img: imageString,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      verified: true
    };

    const updated = [newReview, ...reviews];
    saveReviews(updated);

    // Show Success states
    setSubmitSuccess(true);
    setName('');
    setHandle('');
    setText('');
    setRating(5);
    setImageString('');
    
    setTimeout(() => {
      setSubmitSuccess(false);
      setShowAddForm(false);
    }, 1800);
  };

  return (
    <div className="bg-[#080808] text-white py-24 pb-16 font-['Syne'] border-t border-white/5 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute right-[-10%] top-[20%] w-[350px] h-[350px] rounded-full bg-[#FF4D00]/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute left-[-15%] bottom-[10%] w-[400px] h-[400px] rounded-full bg-[#FF4D00]/3 blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-1.5 mb-3 text-[#FF4D00]">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="currentColor" className="text-[#FF4D00]" />)}
              <span className="text-white/40 text-[11px] font-['DM_Mono'] uppercase tracking-widest ml-2">Over 1,200 Vouches</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black font-['Bebas_Neue'] tracking-wide uppercase leading-none">
              Buyer <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.8)' }}>Vouches</span>
            </h2>
            <p className="text-white/50 text-sm mt-2 max-w-xl">
              Authentic on-feet community snapshots. Share a custom photograph of your sneakers to post your vouch directly.
            </p>
          </div>

          <div>
            <button
              onClick={() => {
                setShowAddForm(!showAddForm);
                setErrorMessage('');
              }}
              className={`px-6 py-3.5 rounded-xl text-xs uppercase font-bold tracking-widest transition-all active:scale-95 flex items-center gap-2 border font-['DM_Mono'] ${
                showAddForm 
                  ? 'bg-zinc-900 border-white/10 text-white/55 hover:text-white' 
                  : 'bg-white text-black hover:bg-white/90 border-white shadow-lg'
              }`}
            >
              <Camera size={14} />
              {showAddForm ? 'Close Form' : 'Vouch with Photo'}
            </button>
          </div>
        </div>

        {/* Form Container */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-xl mx-auto mb-16 bg-[#111] border border-white/10 rounded-2xl p-6 relative"
            >
              {submitSuccess ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-[#FF4D00]/10 border-2 border-[#FF4D00] text-[#FF4D00] rounded-full flex items-center justify-center animate-bounce">
                    <Check size={32} />
                  </div>
                  <h3 className="text-xl font-bold uppercase tracking-wider font-['Bebas_Neue']">VOUCH SUBMITTED</h3>
                  <p className="text-white/60 text-xs font-['DM_Mono'] max-w-xs">
                    Your photo review has been added to our live customer vouch grid.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5">
                    <Sparkles className="text-[#FF4D00] w-5 h-5 animate-pulse" />
                    <span className="text-sm font-bold uppercase tracking-widest font-['Bebas_Neue']">Leave a review with your photograph</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-['DM_Mono'] tracking-widest text-white/40 block">Name</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. David J."
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs outline-none text-white font-['DM_Mono']"
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-['DM_Mono'] tracking-widest text-white/40 block">Social Handle</label>
                      <input
                        type="text"
                        value={handle}
                        onChange={(e) => setHandle(e.target.value)}
                        placeholder="e.g. @david_j"
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs outline-none text-white font-['DM_Mono']"
                      />
                    </div>
                  </div>

                  {/* Rating Selector */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-['DM_Mono'] tracking-widest text-white/40 block">Rating</label>
                    <div className="flex items-center gap-1.5 bg-black/20 p-2.5 rounded-xl border border-white/5 w-fit">
                      {[1, 2, 3, 4, 5].map((stars) => (
                        <button
                          key={stars}
                          type="button"
                          onClick={() => setRating(stars)}
                          className="hover:scale-110 active:scale-95 transition-transform"
                        >
                          <Star
                            size={20}
                            fill={stars <= rating ? "#FF4D00" : "transparent"}
                            className={stars <= rating ? "text-[#FF4D00]" : "text-white/20"}
                          />
                        </button>
                      ))}
                      <span className="text-[10px] text-white/50 font-['DM_Mono'] uppercase ml-2">({rating}/5 Rating)</span>
                    </div>
                  </div>

                  {/* Text Details */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-['DM_Mono'] tracking-widest text-white/40 block">Comment / Vouch</label>
                    <textarea
                      required
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Share your experience with the sneaker quality, comfort, and fitting..."
                      rows={3}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs outline-none text-white resize-none"
                    />
                  </div>

                  {/* Drag and Drop area for file uploads */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-['DM_Mono'] tracking-widest text-white/40 block">Upload Kick Picture</label>
                    
                    {!imageString ? (
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                          isDragging 
                            ? 'border-[#FF4D00] bg-[#FF4D00]/5 text-white' 
                            : 'border-white/10 bg-black/40 text-white/40 hover:border-white/20 hover:text-white/60'
                        }`}
                      >
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept="image/*"
                          className="hidden"
                        />
                        <UploadCloud size={24} className="mb-2 text-[#FF4D00]" />
                        <span className="text-xs font-bold uppercase tracking-wider block mb-0.5">Drag & Drop Image Here</span>
                        <span className="text-[10px] font-['DM_Mono'] text-white/30 block">or click to choose image</span>
                      </div>
                    ) : (
                      <div className="relative border border-white/10 rounded-xl overflow-hidden bg-black/60 p-2 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img 
                            src={imageString} 
                            alt="Upload preview" 
                            className="w-12 h-12 object-cover rounded-lg border border-white/10" 
                          />
                          <div className="space-y-0.5">
                            <span className="text-xs font-bold text-white block font-['DM_Mono']">sneaker_attached.jpg</span>
                            <span className="text-[10px] text-emerald-400 block font-['DM_Mono']">Ready for submission</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="p-1.5 bg-white/5 border border-white/10 text-white/60 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                  </div>

                  {errorMessage && (
                    <div className="text-xs text-red-400 bg-red-400/5 border border-red-400/10 p-3 rounded-lg">
                      {errorMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-[#FF4D00] text-white font-bold py-3.5 rounded-xl hover:bg-[#e04300] tracking-widest text-xs uppercase font-['DM_Mono'] transition-colors flex items-center justify-center gap-2"
                  >
                    Post Review
                  </button>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {reviews.map((r) => (
              <motion.div
                key={r.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                className="bg-[#111] rounded-2xl overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="p-6 border-b border-white/5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FF4D00] to-orange-400 flex items-center justify-center font-bold text-black font-['Bebas_Neue'] text-xl">
                          {r.name[0]}
                        </div>
                        <div>
                          <div className="font-bold text-sm tracking-widest">{r.name}</div>
                          <div className="text-xs text-white/40 font-['DM_Mono']">{r.handle}</div>
                        </div>
                      </div>
                      
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            size={12} 
                            fill={i < r.rating ? "currentColor" : "none"} 
                            className={i < r.rating ? "text-[#FF4D00]" : "text-white/10"} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-white/80 text-sm leading-relaxed italic">"{r.text}"</p>
                  </div>
                  
                  <div className="text-[10px] text-white/30 font-['DM_Mono'] uppercase mt-4 block text-right">
                    {r.date}
                  </div>
                </div>

                <div className="aspect-[4/3] bg-[#0a0a0a] relative flex items-center justify-center p-4">
                  <div className="w-full h-full border border-white/10 rounded-xl overflow-hidden relative group">
                    <img 
                      src={r.img} 
                      alt="Review snapshot" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                    <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-['DM_Mono'] tracking-widest border border-white/10 flex items-center gap-1">
                      <Check size={10} className="text-green-400" /> Verified Purchase
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
