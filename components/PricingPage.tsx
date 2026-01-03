import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { NeoButton, NeoCard } from './NeoComponents';
import { Check, X as XIcon, HelpCircle, MoveLeft, Star, Github } from 'lucide-react';

interface PricingPageProps {
    onBack: () => void;
    onNavigate: (page: 'landing' | 'templates' | 'showcase' | 'pricing' | 'about') => void;
}

export default function PricingPage({ onBack, onNavigate }: PricingPageProps) {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

    const toggleBilling = () => {
        setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly');
    };

    const plans = [
        {
            name: 'Free',
            price: '$0',
            period: '/ forever',
            description: 'Perfect for hobbyists and beginners.',
            features: [
                'Create up to 3 roadmaps',
                'Access to official templates',
                'Basic node types',
                'Export as PNG',
                'Community support'
            ],
            cta: 'Get Started',
            variant: 'secondary' as const,
            popular: false
        },
        {
            name: 'Pro',
            price: billingCycle === 'monthly' ? '$9' : '$90',
            period: billingCycle === 'monthly' ? '/ month' : '/ year',
            description: 'For serious learners and creators.',
            features: [
                'Unlimited roadmaps',
                'All node types & customizations',
                'Import from URLs (AI Powered)',
                'Export as PNG, PDF, JSON',
                'Priority support',
                'Remove watermark',
                'Advanced analytics',
                'Custom themes'
            ],
            cta: 'Start Pro Trial',
            variant: 'primary' as const,
            popular: true
        },
        {
            name: 'Team',
            price: billingCycle === 'monthly' ? '$29' : '$290',
            period: billingCycle === 'monthly' ? '/ month' : '/ year',
            description: 'Collaborate and grow together.',
            features: [
                'Everything in Pro',
                'Real-time collaboration (up to 10 users)',
                'Team workspaces',
                'Admin controls',
                'Shared template library',
                'Priority support',
                'Custom branding'
            ],
            cta: 'Contact Sales',
            variant: 'accent' as const,
            popular: false
        }
    ];

    const faqs = [
        { q: "Can I upgrade/downgrade anytime?", a: "Yes, you can change your plan at any time. Changes take effect at the next billing cycle." },
        { q: "What payment methods do you accept?", a: "We accept all major credit cards (Visa, Mastercard, Amex), PayPal, and Stripe." },
        { q: "Is there a free trial for Pro?", a: "Absolutely! You get a 14-day free trial of Pro features. No credit card required to start." },
        { q: "Can I cancel anytime?", a: "Yes, cancel via your dashboard settings. You'll keep access until the end of your billing period." },
        { q: "Do you offer student discounts?", a: "Yes! Students with a valid .edu email get 50% off the Pro plan. Contact support to apply." }
    ];

    return (
        <div className="min-h-screen bg-neo-offwhite font-sans flex flex-col">
            {/* Navbar */}
            <nav className="relative z-10 flex justify-between items-center px-8 py-6 border-b-2 border-black bg-neo-offwhite">
                <div className="flex items-center gap-6">
                    <div onClick={() => onNavigate('landing')} className="flex items-center gap-3 cursor-pointer">
                        <div className="w-10 h-10 rounded-full bg-neo-cyan border-2 border-black"></div>
                        <div className="flex flex-col">
                            <span className="text-xl font-black tracking-tight leading-none">RoadmapKit</span>
                            <span className="text-[10px] font-bold text-gray-600 leading-none mt-0.5">Simple, clear, developer-friendly</span>
                        </div>
                    </div>
                </div>
                <div className="hidden md:flex gap-8 font-bold text-sm uppercase tracking-wide">
                    <button onClick={() => onNavigate('templates')} className="hover:text-neo-pink transition-colors">Templates</button>
                    <button onClick={() => onNavigate('showcase')} className="hover:text-neo-pink transition-colors">Showcase</button>
                    <button onClick={() => onNavigate('pricing')} className="text-neo-pink transition-colors">Pricing</button>
                    <button onClick={() => onNavigate('about')} className="hover:text-neo-pink transition-colors">About</button>
                </div>
                <div className="flex gap-4 items-center">
                     <a 
                        href="https://github.com/Ramphoogat/RoadmapKit" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-10 h-10 flex items-center justify-center border-2 border-black bg-white hover:bg-neo-offwhite shadow-neo transition-all active:translate-y-[2px] active:shadow-none"
                     >
                        <Github size={20} />
                     </a>
                     <NeoButton onClick={onBack} variant="ghost" className="!px-4 !py-2 !border-2 !border-black" icon={<MoveLeft size={16}/>}>Back</NeoButton>
                </div>
            </nav>

            <main className="flex-1 flex flex-col items-center p-6 text-center">
                <div className="max-w-7xl w-full mb-12 mt-8">
                    
                    {/* Hero */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-16"
                    >
                        <h1 className="text-5xl md:text-7xl font-bold mb-4 text-black tracking-tight">
                            Simple, Transparent <span className="text-neo-pink">Pricing</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8">Choose the plan that fits your learning journey</p>

                        {/* Toggle */}
                        <div className="flex justify-center items-center gap-4 mb-12">
                            <span className={`font-bold ${billingCycle === 'monthly' ? 'text-black' : 'text-gray-400'}`}>Monthly</span>
                            <div 
                                onClick={toggleBilling}
                                className="w-16 h-8 bg-white border-2 border-black rounded-full flex items-center px-1 cursor-pointer shadow-neo"
                            >
                                <motion.div 
                                    layout
                                    className={`w-5 h-5 rounded-full border-2 border-black ${billingCycle === 'monthly' ? 'bg-gray-400' : 'bg-neo-cyan'}`}
                                    style={{ marginLeft: billingCycle === 'monthly' ? '0' : 'auto', marginRight: billingCycle === 'monthly' ? 'auto' : '0' }}
                                />
                            </div>
                            <span className={`font-bold ${billingCycle === 'yearly' ? 'text-black' : 'text-gray-400'}`}>Yearly <span className="text-neo-pink text-xs ml-1">(Save 20%)</span></span>
                        </div>
                    </motion.div>

                    {/* Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 items-start">
                        {plans.map((plan, index) => (
                            <motion.div
                                key={plan.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className={`
                                    relative bg-white border-2 border-black p-8 text-left flex flex-col h-full transition-all hover:-translate-y-2 hover:shadow-neo-xl
                                    ${plan.popular ? 'shadow-neo-xl scale-105 z-10' : 'shadow-neo'}
                                `}>
                                    {plan.popular && (
                                        <div className="absolute -top-4 -right-4 bg-neo-yellow border-2 border-black px-4 py-1 font-black text-sm uppercase shadow-sm flex items-center gap-1">
                                            <Star size={12} fill="black" /> Most Popular
                                        </div>
                                    )}
                                    <div className={`w-full h-2 mb-6 border-2 border-black ${
                                        plan.name === 'Free' ? 'bg-neo-green' : 
                                        plan.name === 'Pro' ? 'bg-neo-cyan' : 'bg-neo-orange'
                                    }`}></div>
                                    
                                    <h3 className="text-2xl font-black uppercase mb-2">{plan.name}</h3>
                                    <p className="text-gray-500 text-sm font-medium mb-6 min-h-[40px]">{plan.description}</p>
                                    
                                    <div className="mb-8">
                                        <span className="text-5xl font-black">{plan.price}</span>
                                        <span className="text-gray-500 font-bold">{plan.period}</span>
                                    </div>

                                    <NeoButton variant={plan.variant} className="w-full mb-8">{plan.cta}</NeoButton>

                                    <div className="space-y-3 flex-1">
                                        {plan.features.map((feature, i) => (
                                            <div key={i} className="flex items-start gap-3 text-sm font-bold">
                                                <div className="mt-0.5 bg-black text-white p-0.5 rounded-none shrink-0">
                                                    <Check size={10} strokeWidth={4} />
                                                </div>
                                                <span>{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* FAQ */}
                    <div className="max-w-3xl mx-auto mb-20 text-left">
                        <h2 className="text-4xl font-black mb-8 text-center uppercase">Frequently Asked Questions</h2>
                        <div className="space-y-4">
                            {faqs.map((faq, i) => (
                                <details key={i} className="group bg-white border-2 border-black shadow-neo open:bg-neo-offwhite transition-all">
                                    <summary className="font-bold text-lg p-6 cursor-pointer list-none flex justify-between items-center">
                                        {faq.q}
                                        <span className="group-open:rotate-180 transition-transform">▼</span>
                                    </summary>
                                    <div className="px-6 pb-6 text-gray-700 font-medium leading-relaxed border-t-2 border-black/10 pt-4">
                                        {faq.a}
                                    </div>
                                </details>
                            ))}
                        </div>
                    </div>

                    {/* Trust */}
                    <div className="flex flex-col md:flex-row justify-center items-center gap-8 opacity-60 font-bold uppercase tracking-wider text-sm">
                         <div className="flex items-center gap-2"><Check size={16}/> 30-day money-back guarantee</div>
                         <div className="flex items-center gap-2"><Check size={16}/> Secure SSL Payment</div>
                         <div className="flex items-center gap-2"><Check size={16}/> Cancel anytime</div>
                    </div>

                </div>
            </main>

            <footer className="relative z-10 p-8 text-center font-bold border-t-2 border-black bg-neo-offwhite text-sm">
                <p>DESIGNED BY ROADMAPKIT TEAM © 2024</p>
            </footer>
        </div>
    );
}