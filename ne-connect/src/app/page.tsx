"use client"

import Link from "next/link"
import { ArrowRight, Star, Zap, Wrench, Hammer, Sparkles, Wind, Smartphone, Shield, Clock, ThumbsUp } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground overflow-hidden">
      {/* 1. Hero Section */}
      <section className="relative px-4 py-32 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex flex-col items-center text-center min-h-[80vh] justify-center">
        {/* Decorative background blur */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold tracking-wide uppercase mb-8">
            <Sparkles size={14} className="text-primary" />
            <span>Discover NE-Connect</span>
          </div>
          
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl text-primary max-w-5xl leading-tight">
            Find Trusted Local Services <br className="hidden sm:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Across Northeast India</span>
          </h1>
          
          <p className="mt-8 text-xl text-secondary max-w-2xl font-medium">
            Book electricians, plumbers, carpenters, and more with verified, top-rated professionals.
          </p>
          
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/services"
              className="inline-flex h-14 items-center justify-center rounded-xl bg-primary px-8 text-base font-bold text-background shadow-lg transition-all hover:scale-105"
            >
              Book a Service
            </Link>
            <Link
              href="/onboarding"
              className="inline-flex h-14 items-center justify-center rounded-xl border border-border bg-surface px-8 text-base font-bold text-primary shadow-sm transition-all hover:bg-background hover:scale-105"
            >
              Become a Provider
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Services Section */}
      <section className="bg-surface border-y border-border py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-extrabold text-primary tracking-tight">Popular Services</h2>
            <Link href="/services" className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 flex items-center gap-1 transition-colors">
              View all <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Electrician", icon: Zap, price: "₹299", rating: "4.8", color: "bg-amber-500/10 text-amber-500" },
              { title: "Plumber", icon: Wrench, price: "₹199", rating: "4.7", color: "bg-blue-500/10 text-blue-500" },
              { title: "Carpenter", icon: Hammer, price: "₹349", rating: "4.9", color: "bg-orange-500/10 text-orange-500" },
              { title: "House Cleaning", icon: Sparkles, price: "₹599", rating: "4.8", color: "bg-emerald-500/10 text-emerald-500" },
              { title: "AC Repair", icon: Wind, price: "₹499", rating: "4.7", color: "bg-cyan-500/10 text-cyan-500" },
              { title: "Mobile Repair", icon: Smartphone, price: "₹399", rating: "4.6", color: "bg-purple-500/10 text-purple-500" },
            ].map((service) => (
              <Link 
                href={`/services?query=${encodeURIComponent(service.title)}`}
                key={service.title} 
                className="group relative flex flex-col p-8 rounded-2xl bg-background border border-border hover:border-indigo-500/30 shadow-sm hover:shadow-md transition-all active:scale-95"
              >
                <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${service.color} mb-6`}>
                  <service.icon size={28} />
                </div>
                
                <h3 className="text-xl font-bold text-primary mb-2">{service.title}</h3>
                <div className="flex items-center justify-between mt-auto">
                  <div className="text-secondary text-sm font-medium">
                    Starts at <span className="text-primary font-bold">{service.price}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-surface px-2.5 py-1 rounded-full border border-border">
                    <Star fill="currentColor" size={12} className="text-yellow-400" />
                    <span className="text-xs font-bold text-primary">{service.rating}</span>
                  </div>
                </div>
                
                <div className="absolute top-8 right-8 text-primary/0 group-hover:text-primary/50 transition-all">
                  <ArrowRight size={20} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. How It Works */}
      <section id="how-it-works" className="py-32 bg-background relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl font-extrabold text-primary mb-20 tracking-tight">How it works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { step: "1", title: "Choose a service", desc: "Browse through our wide range of professional services." },
              { step: "2", title: "Select a provider", desc: "Compare ratings, prices, and reviews for the perfect match." },
              { step: "3", title: "Book instantly", desc: "Confirm your booking and get the job done reliably." },
            ].map((s) => (
              <div key={s.step} className="flex flex-col items-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-background font-bold text-2xl shadow-md">
                  {s.step}
                </div>
                <h3 className="mt-8 text-xl font-bold text-primary">{s.title}</h3>
                <p className="mt-3 text-base text-secondary max-w-xs text-center leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured Providers */}
      <section className="bg-surface border-y border-border py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-primary mb-12 tracking-tight">Featured Professionals</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "John Doe", profession: "Master Electrician", location: "Guwahati", rating: "4.9", exp: "8 yrs" },
              { name: "Sarah Smith", profession: "Professional Cleaner", location: "Shillong", rating: "4.8", exp: "5 yrs" },
              { name: "Rajesh Kumar", profession: "Expert Plumber", location: "Kohima", rating: "4.7", exp: "12 yrs" },
              { name: "Anita Devi", profession: "Appliance Tech", location: "Imphal", rating: "4.9", exp: "6 yrs" },
            ].map((provider) => (
              <div 
                key={provider.name} 
                className="flex flex-col rounded-2xl border border-border bg-background p-6 shadow-sm transition-all"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-12 w-12 rounded-full border border-border bg-surface flex items-center justify-center text-primary font-bold">
                    {provider.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-primary">{provider.name}</h3>
                    <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">{provider.profession}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-secondary mb-6 bg-surface p-3 rounded-lg">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold tracking-wider mb-0.5">Location</span>
                    <span className="font-medium text-primary">{provider.location}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase font-bold tracking-wider mb-0.5">Exp</span>
                    <span className="font-medium text-primary">{provider.exp}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1.5 text-primary font-bold">
                    <Star fill="currentColor" size={16} className="text-yellow-400" />
                    <span>{provider.rating}</span>
                  </div>
                  <Link 
                    href={`/providers?search=${encodeURIComponent(provider.name)}`}
                    className="text-xs font-bold text-primary border border-border px-3 py-1.5 rounded-full hover:bg-surface transition-colors active:scale-95"
                  >
                    View Pro
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Trust / Why Us */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: Shield, title: "Verified Professionals", desc: "Every provider goes through a strict background check and skill verification process.", color: "text-emerald-500", bg: "bg-emerald-500/10" },
              { icon: Clock, title: "Transparent Pricing", desc: "No hidden fees. See upfront pricing and get exactly what you pay for.", color: "text-blue-500", bg: "bg-blue-500/10" },
              { icon: ThumbsUp, title: "Quality Guarantee", desc: "If you are not satisfied with the service, we will make it right guaranteed.", color: "text-purple-500", bg: "bg-purple-500/10" },
            ].map((f) => (
              <div 
                key={f.title} 
                className="flex flex-col p-6 rounded-2xl bg-surface/50 border border-border"
              >
                <div className={`p-4 rounded-xl ${f.bg} mb-6 w-fit`}>
                  <f.icon size={32} className={f.color} />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">{f.title}</h3>
                <p className="text-base text-secondary leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Footer Base */}
      <footer className="border-t border-border bg-background pt-16 pb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-background font-black text-sm shadow-md">NE</div>
                <span className="font-extrabold text-primary text-xl tracking-tight">Connect</span>
              </div>
              <p className="text-sm text-secondary pr-4 leading-relaxed">Connecting Northeast India with trusted local professionals in seconds.</p>
            </div>
            <div>
              <h4 className="font-bold text-primary mb-4">Company</h4>
              <ul className="space-y-3 text-sm font-medium text-secondary">
                <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-primary mb-4">Services</h4>
              <ul className="space-y-3 text-sm font-medium text-secondary">
                <li><Link href="/services" className="hover:text-primary transition-colors">All Services</Link></li>
                <li><Link href="/providers" className="hover:text-primary transition-colors">Browse Providers</Link></li>
                <li><Link href="/onboarding" className="hover:text-primary transition-colors">Join as Professional</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-primary mb-4">Support</h4>
              <ul className="space-y-3 text-sm font-medium text-secondary">
                <li><Link href="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm font-medium text-secondary">© 2026 NE-Connect. All rights reserved.</p>
            <div className="flex gap-6">
              <span className="text-sm font-bold text-secondary hover:text-primary cursor-pointer transition-colors">X / Twitter</span>
              <span className="text-sm font-bold text-secondary hover:text-primary cursor-pointer transition-colors">LinkedIn</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
