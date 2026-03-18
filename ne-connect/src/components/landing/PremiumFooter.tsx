import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Mail, Phone, MoveUpRight } from "lucide-react"

export function PremiumFooter() {
    return (
        <footer className="bg-background pt-24 pb-12 border-t border-border relative overflow-hidden">
            {/* Minimal Background Glow (Luxe Stone Theme) */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-stone-500/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">

                    {/* Brand Column */}
                    <div className="lg:col-span-4">
                        <Link href="/" className="inline-block text-3xl font-extrabold tracking-tighter text-foreground mb-6">
                            NE<span className="text-transparent bg-clip-text bg-gradient-to-r from-stone-900 via-stone-700 to-stone-500">-Connect</span>
                        </Link>
                        <p className="text-secondary mb-8 max-w-sm leading-relaxed font-medium">
                            The ultimate digital marketplace for Northeast India. Connecting trusted local service professionals with the people who need them.
                        </p>
                        <div className="flex items-center space-x-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-stone-50 border border-border flex items-center justify-center text-stone-500 hover:text-foreground hover:border-accent transition-all hover:scale-110">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-stone-50 border border-border flex items-center justify-center text-stone-500 hover:text-foreground hover:border-accent transition-all hover:scale-110">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-stone-50 border border-border flex items-center justify-center text-stone-500 hover:text-foreground hover:border-accent transition-all hover:scale-110">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-stone-50 border border-border flex items-center justify-center text-stone-500 hover:text-foreground hover:border-accent transition-all hover:scale-110">
                                <Linkedin size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="lg:col-span-2">
                        <h4 className="font-bold text-foreground mb-6 uppercase tracking-wider text-sm">Platform</h4>
                        <ul className="space-y-4">
                            <li><Link href="/services" className="text-secondary font-medium hover:text-foreground transition-colors text-sm">Explore Services</Link></li>
                            <li><Link href="/provider/register" className="text-secondary font-medium hover:text-foreground transition-colors text-sm">Become a Provider</Link></li>
                            <li><Link href="/about" className="text-secondary font-medium hover:text-foreground transition-colors text-sm">About Us</Link></li>
                            <li><Link href="/how-it-works" className="text-secondary font-medium hover:text-foreground transition-colors text-sm">How It Works</Link></li>
                        </ul>
                    </div>

                    {/* States */}
                    <div className="lg:col-span-3">
                        <h4 className="font-bold text-foreground mb-6 uppercase tracking-wider text-sm">Service Regions</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <ul className="space-y-4">
                                <li><Link href="#" className="text-secondary font-medium hover:text-foreground transition-colors text-sm">Assam</Link></li>
                                <li><Link href="#" className="text-secondary font-medium hover:text-foreground transition-colors text-sm">Meghalaya</Link></li>
                                <li><Link href="#" className="text-secondary font-medium hover:text-foreground transition-colors text-sm">Mizoram</Link></li>
                                <li><Link href="#" className="text-secondary font-medium hover:text-foreground transition-colors text-sm">Nagaland</Link></li>
                            </ul>
                            <ul className="space-y-4">
                                <li><Link href="#" className="text-secondary font-medium hover:text-foreground transition-colors text-sm">Manipur</Link></li>
                                <li><Link href="#" className="text-secondary font-medium hover:text-foreground transition-colors text-sm">Arunachal</Link></li>
                                <li><Link href="#" className="text-secondary font-medium hover:text-foreground transition-colors text-sm">Tripura</Link></li>
                                <li><Link href="#" className="text-secondary font-medium hover:text-foreground transition-colors text-sm">Sikkim</Link></li>
                            </ul>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="lg:col-span-3">
                        <h4 className="font-bold text-foreground mb-6 uppercase tracking-wider text-sm">Contact Us</h4>
                        <ul className="space-y-4 mb-6">
                            <li className="flex items-start">
                                <MapPin size={18} className="text-accent mt-1 mr-3 shrink-0" />
                                <span className="text-secondary font-medium text-sm">GS Road, Christian Basti<br />Guwahati, Assam 781005</span>
                            </li>
                            <li className="flex items-center">
                                <Mail size={18} className="text-accent mr-3 shrink-0" />
                                <a href="mailto:hello@neconnect.in" className="text-secondary font-medium hover:text-foreground transition-colors text-sm">hello@neconnect.in</a>
                            </li>
                            <li className="flex items-center">
                                <Phone size={18} className="text-accent mr-3 shrink-0" />
                                <span className="text-secondary font-medium text-sm">+91 98765 43210</span>
                            </li>
                        </ul>

                        <button
                            className="group inline-flex items-center space-x-2 text-sm font-bold text-accent hover:text-primary transition-colors cursor-pointer"
                        >
                            <span>Get Support Now</span>
                            <MoveUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </button>
                    </div>

                </div>

                <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-muted text-sm font-medium">
                        © {new Date().getFullYear()} NE-Connect. All rights reserved.
                    </p>
                    <div className="flex items-center space-x-6 text-sm">
                        <Link href="#" className="text-muted font-medium hover:text-foreground transition-colors">Privacy Policy</Link>
                        <Link href="#" className="text-muted font-medium hover:text-foreground transition-colors">Terms of Service</Link>
                        <Link href="#" className="text-muted font-medium hover:text-foreground transition-colors">Cookie Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
