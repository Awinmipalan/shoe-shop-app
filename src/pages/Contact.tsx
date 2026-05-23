import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Phone, Mail, MapPin, Clock, ChevronDown, ChevronUp, Package, Send } from 'lucide-react';
import { CONTACT_PHONE, CONTACT_PHONE_FORMATTED } from '../config';

const faqs = [
  {
    q: "How long does delivery take?",
    a: "Standard delivery within Nigeria takes 2-5 business days. Express delivery in Lagos is available for next-day drop-off."
  },
  {
    q: "What is your return policy?",
    a: "We accept returns within 14 days of delivery. Shoes must be unworn, in their original condition and packaging."
  },
  {
    q: "How do I track my order?",
    a: "Once your order is processed via WhatsApp, our team will provide a unique tracking link and regular status updates."
  },
  {
    q: "Do you ship internationally?",
    a: "Currently, we only ship within Nigeria. We are working on expanding our delivery network soon."
  }
];

export default function Contact() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [formCategory, setFormCategory] = useState('order');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <div id="contact" className="bg-[#080808] text-white font-['Syne']">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 lg:py-24">
        
        {/* Page Title */}
        <div className="mb-16 md:mb-24 text-center max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-6">
            <MessageSquare size={32} className="text-[#FF4D00] animate-bounce" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black font-['Bebas_Neue'] tracking-wide uppercase leading-none mb-6">
            We're Here <br/><span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.8)' }}>To Help</span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl font-light">
            Need assistance with your kicks? Our team is on standby to ensure your stride is never interrupted.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#111] border border-white/5 p-8 md:p-10 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF4D00]/5 blur-[100px] rounded-full pointer-events-none"></div>
              
              <h2 className="text-2xl font-bold mb-8 font-['Bebas_Neue'] tracking-widest text-[#f0f0f0]">Send a Message</h2>
              
              {submitted ? (
                <div className="h-64 flex flex-col items-center justify-center text-center animate-fade-in">
                  <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-4">
                    <Send size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                  <p className="text-white/60">We'll get back to you within 15 minutes during business hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-white/40 text-xs tracking-widest mb-2 block font-['DM_Mono']">FIRST NAME</label>
                      <input required type="text" className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#FF4D00]/50 transition-colors" placeholder="John" />
                    </div>
                    <div>
                      <label className="text-white/40 text-xs tracking-widest mb-2 block font-['DM_Mono']">LAST NAME</label>
                      <input required type="text" className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#FF4D00]/50 transition-colors" placeholder="Doe" />
                    </div>
                  </div>

                  <div>
                    <label className="text-white/40 text-xs tracking-widest mb-2 block font-['DM_Mono']">EMAIL ADDRESS</label>
                    <input required type="email" className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#FF4D00]/50 transition-colors" placeholder="john@example.com" />
                  </div>

                  <div>
                    <label className="text-white/40 text-xs tracking-widest mb-2 block font-['DM_Mono']">INQUIRY TYPE</label>
                    <div className="relative">
                      <select 
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value)}
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#FF4D00]/50 appearance-none transition-colors"
                      >
                        <option value="order">Order Status / Tracking</option>
                        <option value="returns">Returns & Exchanges</option>
                        <option value="product">Product Information</option>
                        <option value="wholesale">Wholesale Enrollment</option>
                        <option value="other">General Inquiry</option>
                      </select>
                      <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                    </div>
                  </div>

                  {formCategory === 'order' && (
                    <div className="animate-fade-in">
                      <label className="text-white/40 text-xs tracking-widest mb-2 block font-['DM_Mono']">ORDER NUMBER (OPTIONAL)</label>
                      <input type="text" className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#FF4D00]/50 transition-colors" placeholder="#TF-10294" />
                    </div>
                  )}

                  <div>
                    <label className="text-white/40 text-xs tracking-widest mb-2 block font-['DM_Mono']">MESSAGE</label>
                    <textarea required rows={4} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#FF4D00]/50 resize-none transition-colors" placeholder="How can we help you today?"></textarea>
                  </div>

                  <button 
                    disabled={isSubmitting}
                    className="w-full bg-[#f0f0f0] text-[#080808] font-bold py-4 rounded-xl hover:bg-white transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-[#080808]/30 border-t-[#080808] rounded-full animate-spin"></div>
                    ) : (
                      <>Send Message <Send size={16} /></>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Info & Map */}
          <div className="lg:col-span-5 space-y-8">
            
            <div className="bg-[#111] border border-white/5 p-8 rounded-3xl">
              <h3 className="text-xl font-bold mb-6 font-['Bebas_Neue'] tracking-widest text-[#f0f0f0]">Fast Channels</h3>
              
              <div className="space-y-6">
                <a href={`https://wa.me/${CONTACT_PHONE}`} target="_blank" rel="noreferrer" className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-[#25D366]/10 text-[#25D366] flex items-center justify-center shrink-0 group-hover:bg-[#25D366] group-hover:text-black transition-colors">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-bold mb-1">WhatsApp Live Chat</div>
                    <div className="text-white/60 text-sm font-['DM_Mono']">{CONTACT_PHONE_FORMATTED}</div>
                    <div className="text-[#25D366] text-xs font-bold mt-1 tracking-wider uppercase">Reply within 15 mins</div>
                  </div>
                </a>

                <a href={`tel:+${CONTACT_PHONE}`} className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-white/5 text-white flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-black transition-colors">
                    <Phone size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-bold mb-1">Phone Support</div>
                    <div className="text-white/60 text-sm font-['DM_Mono']">{CONTACT_PHONE_FORMATTED}</div>
                  </div>
                </a>

                <a href="mailto:support@tonyifootwear.com" className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-white/5 text-white flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-black transition-colors">
                    <Mail size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-bold mb-1">Email Us</div>
                    <div className="text-white/60 text-sm font-['DM_Mono']">support@tonyifootwear.com</div>
                  </div>
                </a>
              </div>
            </div>

            <div className="bg-[#111] border border-white/5 p-8 rounded-3xl">
              <h3 className="text-xl font-bold mb-6 font-['Bebas_Neue'] tracking-widest text-[#f0f0f0]">Locations & Hours</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="text-white/40 pt-1 shrink-0"><MapPin size={20} /></div>
                  <div>
                    <div className="text-sm font-bold mb-1">Lagos Flagship</div>
                    <div className="text-white/60 text-sm leading-relaxed">
                      124 Kicks Avenue, Victoria Island<br />
                      Lagos, Nigeria 101241
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="text-white/40 pt-1 shrink-0"><Clock size={20} /></div>
                  <div className="flex-1">
                    <div className="text-sm font-bold mb-2">Business Hours</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-white/60">Monday - Friday</span>
                        <span className="font-['DM_Mono']">9AM - 8PM</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-white/60">Saturday</span>
                        <span className="font-['DM_Mono']">10AM - 6PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Sunday</span>
                        <span className="font-['DM_Mono']">Closed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* FAQs */}
        <div className="mt-24 max-w-4xl mx-auto">
          <h2 className="text-3xl font-black font-['Bebas_Neue'] tracking-wide uppercase text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden transition-all duration-300">
                <button 
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-bold pr-4">{faq.q}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${openFaq === i ? 'bg-white text-black rotate-180' : 'bg-white/5 text-white'}`}>
                    <ChevronDown size={16} />
                  </div>
                </button>
                <div 
                  className="px-6 text-white/50 text-sm leading-relaxed transition-all duration-300 ease-in-out overflow-hidden"
                  style={{
                    maxHeight: openFaq === i ? '200px' : '0',
                    paddingBottom: openFaq === i ? '20px' : '0',
                    opacity: openFaq === i ? 1 : 0
                  }}
                >
                  {faq.a}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
