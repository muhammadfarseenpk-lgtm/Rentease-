import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Star, X } from "lucide-react";
import { motion } from "motion/react";
import { toINR } from "@/lib/utils";
import { useApp } from "@/hooks/useApp";

export default function Plans() {
  const { user } = useApp();
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Basic",
      priceMonthly: 9.99,
      priceAnnual: 7.99,
      description: "Perfect for occasional renters.",
      features: ["Access to basic items", "Standard delivery (3-5 days)", "Email support", "No minimum commitment"],
      diffFeatures: [],
      popular: false,
    },
    {
      name: "Premium",
      priceMonthly: 29.99,
      priceAnnual: 23.99,
      description: "Best value for regular users.",
      features: ["Access to premium items", "Free next-day delivery", "24/7 Priority support", "Free returns & exchanges", "Damage waiver included"],
      diffFeatures: ["Premium items access", "Next-day delivery", "24/7 Support", "Damage waiver"],
      popular: true,
    },
    {
      name: "Business",
      priceMonthly: 99.99,
      priceAnnual: 79.99,
      description: "For corporate and bulk needs.",
      features: ["Bulk discounts", "Dedicated account manager", "Custom delivery schedules", "White-glove installation", "Flexible terms"],
      diffFeatures: ["Dedicated manager", "White-glove install", "Bulk discounts"],
      popular: false,
    }
  ];

  const comparisonFeatures = [
    { name: "Product Catalog", basic: "Basic Only", premium: "Full Access", business: "Full Access + Custom" },
    { name: "Delivery Speed", basic: "3-5 Days", premium: "Next Day", business: "Scheduled" },
    { name: "Support", basic: "Email Only", premium: "24/7 Priority", business: "Account Manager" },
    { name: "Maintenance", basic: `${toINR(50)} per visit`, premium: "Free", business: "Free + Preventative" },
    { name: "Damage Waiver", basic: false, premium: true, business: true },
    { name: "Early Cancellation", basic: "Fee Applies", premium: "Free", business: "Free" },
  ];

  return (
    <div className="bg-[#fdfaf8] min-h-screen py-20">
      <div className="container">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="mx-auto flex max-w-3xl flex-col items-center text-center mb-16 space-y-6"
        >
          <div className="inline-flex items-center gap-2 bg-orange-100 text-brand text-[10px] font-bold uppercase tracking-widest rounded-full px-3 py-1 shadow-sm">
            Subscription Tiers
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-[1.1]">
            Simple, <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-rose-400">transparent pricing</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl leading-relaxed">
            Choose the plan that fits your renting lifestyle. Upgrade or downgrade at any time with zero hassle.
          </p>

          {/* Monthly / Annual Toggle */}
          <div className="flex items-center gap-4 mt-8 bg-white p-2 rounded-full border border-gray-200 shadow-sm relative z-10">
            <button 
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${!isAnnual ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
              onClick={() => setIsAnnual(false)}
            >
              Monthly
            </button>
            <div className="relative">
              <button 
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${isAnnual ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
                onClick={() => setIsAnnual(true)}
              >
                Annually
              </button>
              <div className="absolute -top-3 -right-2 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shadow-sm border border-green-200 animate-bounce">
                Save 20%
              </div>
            </div>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-3 items-end mb-32">
          {plans.map((plan, i) => (
            <motion.div 
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative bg-white rounded-[2.5rem] p-8 flex flex-col h-full ${plan.popular ? 'border-2 border-brand shadow-2xl scale-100 lg:scale-105 z-10 overflow-hidden' : 'border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300'}`}
            >
              {plan.popular && (
                <>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full blur-3xl -z-10 opacity-50" />
                  <div className="absolute top-6 right-6">
                    <span className="flex items-center gap-1 bg-brand text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                      <Star className="h-3 w-3 fill-current" /> Most Popular
                    </span>
                  </div>
                </>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <p className="text-sm text-gray-500 mt-2">{plan.description}</p>
              </div>

              <div className="mb-8">
                <div className="flex items-end gap-1">
                  <span className="text-5xl font-bold text-gray-900 tracking-tight">
                    {toINR(isAnnual ? plan.priceAnnual : plan.priceMonthly)}
                  </span>
                  <span className="text-lg text-gray-400 font-medium mb-1">/mo</span>
                </div>
                {isAnnual && (
                  <p className="text-xs text-green-600 font-bold mt-2 bg-green-50 inline-block px-2 py-1 rounded-md">
                    Billed {toINR(Math.round(plan.priceAnnual * 12))} yearly
                  </p>
                )}
              </div>

              <ul className="flex-1 space-y-4 mb-8">
                {plan.features.map((feature, idx) => {
                  const isDiff = plan.diffFeatures.includes(feature);
                  return (
                    <li key={idx} className="flex items-start gap-3">
                      <div className={`mt-1 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${isDiff ? 'bg-brand/10' : 'bg-green-50'}`}>
                        <Check className={`h-3 w-3 font-bold ${isDiff ? 'text-brand' : 'text-green-600'}`} />
                      </div>
                      <span className={`text-sm leading-relaxed ${isDiff ? 'text-gray-900 font-bold' : 'text-gray-600'}`}>
                        {feature}
                      </span>
                    </li>
                  )
                })}
              </ul>

              <Button 
                asChild 
                size="lg" 
                className={`w-full h-14 rounded-2xl font-bold text-lg transition-all duration-300 ${plan.popular ? 'bg-gradient-to-r from-brand to-orange-400 hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] text-white' : 'bg-gray-50 text-gray-900 hover:bg-gray-100 border border-gray-200'}`}
              >
                <Link to={user ? "/profile" : "/login"}>{user ? "Switch Plan" : plan.popular ? "Get Started" : "Choose Plan"}</Link>
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Comparison Table */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="max-w-5xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Compare Plans In-Depth</h2>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="p-6 text-sm font-bold text-gray-400 uppercase tracking-widest w-1/4">Feature</th>
                    <th className="p-6 text-lg font-bold text-gray-900 w-1/4 text-center">Basic</th>
                    <th className="p-6 text-lg font-bold text-brand w-1/4 text-center bg-orange-50/50">Premium</th>
                    <th className="p-6 text-lg font-bold text-gray-900 w-1/4 text-center">Business</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {comparisonFeatures.map((feat, i) => (
                    <motion.tr 
                      key={i} 
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="p-6 text-sm font-bold text-gray-700">{feat.name}</td>
                      <td className="p-6 text-sm text-gray-600 text-center">
                        {typeof feat.basic === 'boolean' ? (
                          feat.basic ? <Check className="w-5 h-5 mx-auto text-green-500" /> : <X className="w-5 h-5 mx-auto text-gray-300" />
                        ) : feat.basic}
                      </td>
                      <td className="p-6 text-sm font-bold text-brand text-center bg-orange-50/50">
                        {typeof feat.premium === 'boolean' ? (
                          feat.premium ? <Check className="w-5 h-5 mx-auto text-brand" /> : <X className="w-5 h-5 mx-auto text-gray-300" />
                        ) : feat.premium}
                      </td>
                      <td className="p-6 text-sm text-gray-600 text-center">
                        {typeof feat.business === 'boolean' ? (
                          feat.business ? <Check className="w-5 h-5 mx-auto text-green-500" /> : <X className="w-5 h-5 mx-auto text-gray-300" />
                        ) : feat.business}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
