import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, MessageCircle, FileText, Wrench, ChevronDown, MessageSquare, Paperclip, Clock, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { useApp } from "@/hooks/useApp";

export default function Support() {
  const { supportTickets, user } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const userTickets = supportTickets.filter(t => t.userId === user?.id);

  const faqs = [
    { q: "How does the rental process work?", a: "Simply choose your items, select a tenure, and checkout. We'll deliver and install everything for free." },
    { q: "Can I cancel before my tenure ends?", a: "Yes, you can cancel early. An early closure fee equivalent to 1 month's rent will apply." },
    { q: "What happens if an item gets damaged?", a: "Our Premium plan includes a damage waiver for accidental damage. For Basic plans, repair costs will be assessed." },
    { q: "Is maintenance free?", a: "Yes, we provide free annual maintenance and immediate support for any defects during your rental period." }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Ticket submitted successfully! We'll get back to you within 24 hours.");
  };

  return (
    <div className="bg-[#fdfaf8] min-h-screen pb-24">
      
      {/* Hero */}
      <div className="bg-brand text-white py-20 px-6 lg:px-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute -top-[50%] -left-[10%] w-[50%] h-[150%] rounded-full bg-white blur-[100px]" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">How can we help?</h1>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Search for answers..." 
              className="h-14 pl-12 rounded-full bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white focus:text-gray-900 focus:placeholder:text-gray-400 transition-all text-lg"
            />
          </div>
        </div>
      </div>

      <div className="container -mt-10 relative z-20">
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: <FileText className="w-6 h-6 text-brand" />, title: "Billing & Plans", desc: "Manage payments and subscriptions" },
            { icon: <Wrench className="w-6 h-6 text-brand" />, title: "Maintenance", desc: "Request repairs or service" },
            { icon: <MessageCircle className="w-6 h-6 text-brand" />, title: "General Queries", desc: "Process, delivery, and returns" }
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 flex flex-col items-center text-center hover:-translate-y-1 transition-transform cursor-pointer">
              <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-1">{item.title}</h3>
              <p className="text-gray-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          
          {/* FAQs */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                  <button 
                    className="w-full text-left p-5 font-bold text-gray-900 flex justify-between items-center"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    {faq.q}
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-5 pb-5 text-gray-600 leading-relaxed"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form & Ticket History */}
          <div className="space-y-8">
            <div className="bg-white rounded-[2.5rem] p-8 lg:p-10 border border-gray-100 shadow-sm">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Raise a Ticket</h2>
              <p className="text-gray-500 mb-8">Can't find what you're looking for? Send us a message.</p>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" defaultValue={user?.name || ""} required className="bg-gray-50 border-gray-200 h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="order">Order ID (Optional)</Label>
                    <Input id="order" className="bg-gray-50 border-gray-200 h-12 rounded-xl" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" required className="bg-gray-50 border-gray-200 h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" required className="bg-gray-50 border-gray-200 min-h-[120px] rounded-xl resize-none" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="photo" className="cursor-pointer inline-flex items-center gap-2 text-brand font-bold bg-orange-50 px-4 py-2 rounded-xl border border-orange-100 hover:bg-orange-100 transition-colors">
                    <Paperclip className="w-4 h-4" /> Attach Photo (Optional)
                  </Label>
                  <Input id="photo" type="file" accept="image/*" className="hidden" />
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-brand to-orange-400 hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] text-white h-14 rounded-2xl font-bold text-lg transition-all">
                  Submit Request
                </Button>
              </form>
            </div>

            {userTickets.length > 0 && (
              <div className="bg-white rounded-[2.5rem] p-8 lg:p-10 border border-gray-100 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Ticket History</h2>
                <div className="space-y-4">
                  {userTickets.map(ticket => (
                    <div key={ticket.id} className="p-4 rounded-2xl border border-gray-100 bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">{ticket.id}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${ticket.status === 'resolved' || ticket.status === 'closed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                            {ticket.status}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 font-medium">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h4 className="font-bold text-gray-800 text-sm mb-1">{ticket.subject}</h4>
                      <p className="text-sm text-gray-500 line-clamp-2">{ticket.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Chat Bubble */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="absolute bottom-20 right-0 w-[350px] bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col"
            >
              <div className="bg-brand p-4 text-white font-bold flex justify-between items-center">
                <span>RentEase Assistant</span>
                <button onClick={() => setIsChatOpen(false)} className="text-white/80 hover:text-white">✕</button>
              </div>
              <div className="h-[300px] bg-gray-50 p-4 overflow-y-auto flex flex-col gap-3">
                <div className="bg-white p-3 rounded-2xl rounded-tl-sm w-4/5 shadow-sm text-sm text-gray-700">
                  Hi there! 👋 How can I help you today?
                </div>
              </div>
              <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
                <Input placeholder="Type a message..." className="bg-gray-50 border-gray-200 rounded-full h-10" />
                <Button size="icon" className="bg-brand hover:bg-brand-dark rounded-full shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-16 h-16 bg-brand text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
        >
          {isChatOpen ? <span className="text-2xl font-bold">✕</span> : <MessageSquare className="w-7 h-7" />}
        </button>
      </div>

    </div>
  );
}
