import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Mail, Phone, MoveUpRight } from "lucide-react"

export function PremiumFooter() {
    return (
        <footer className="bg-white dark:bg-[#030712] pt-24 pb-12 border-t border-gray-100 dark:border-white/5 relative overflow-hidden">
            {/* Minimal Background Glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">

                    {/* Brand Column */}
                    <div className="lg:col-span-4">
                        <Link href="/" className="inline-block text-3xl font-extrabold tracking-tighter text-gray-900 dark:text-white mb-6">
                            NE<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-indigo-500">-Connect</span>
                        </Link>
                        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm leading-relaxed">
                            The ultimate digital marketplace for Northeast India. Connecting trusted local service professionals with the people who need them.
                        </p>
                        <div className="flex items-center space-x-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-500/30 transition-all hover:scale-110">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-500/30 transition-all hover:scale-110">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-500/30 transition-all hover:scale-110">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-500/30 transition-all hover:scale-110">
                                <Linkedin size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="lg:col-span-2">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-wider text-sm">Platform</h4>
                        <ul className="space-y-4">
                            <li><Link href="/services" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Explore Services</Link></li>
                            <li><Link href="/signup" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Become a Provider</Link></li>
                            <li><Link href="/about" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">About Us</Link></li>
                            <li><Link href="#" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Careers</Link></li>
                        </ul>
                    </div>

                    {/* States */}
                    <div className="lg:col-span-3">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-wider text-sm">Service Regions</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <ul className="space-y-4">
                                <li><Link href="#" className="text-gray-500 dark:text-gray-400 hover:text-emerald-500 transition-colors">Assam</Link></li>
                                <li><Link href="#" className="text-gray-500 dark:text-gray-400 hover:text-emerald-500 transition-colors">Meghalaya</Link></li>
                                <li><Link href="#" className="text-gray-500 dark:text-gray-400 hover:text-emerald-500 transition-colors">Mizoram</Link></li>
                                <li><Link href="#" className="text-gray-500 dark:text-gray-400 hover:text-emerald-500 transition-colors">Nagaland</Link></li>
                            </ul>
                            <ul className="space-y-4">
                                <li><Link href="#" className="text-gray-500 dark:text-gray-400 hover:text-emerald-500 transition-colors">Manipur</Link></li>
                                <li><Link href="#" className="text-gray-500 dark:text-gray-400 hover:text-emerald-500 transition-colors">Arunachal</Link></li>
                                <li><Link href="#" className="text-gray-500 dark:text-gray-400 hover:text-emerald-500 transition-colors">Tripura</Link></li>
                                <li><Link href="#" className="text-gray-500 dark:text-gray-400 hover:text-emerald-500 transition-colors">Sikkim</Link></li>
                            </ul>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="lg:col-span-3">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-wider text-sm">Contact Us</h4>
                        <ul className="space-y-4 mb-6">
                            <li className="flex items-start">
                                <MapPin size={18} className="text-indigo-500 mt-1 mr-3 shrink-0" />
                                <span className="text-gray-500 dark:text-gray-400">GS Road, Christian Basti<br />Guwahati, Assam 781005</span>
                            </li>
                            <li className="flex items-center">
                                <Mail size={18} className="text-indigo-500 mr-3 shrink-0" />
                                <a href="mailto:hello@neconnect.in" className="text-gray-500 dark:text-gray-400 hover:text-indigo-500 transition-colors">hello@neconnect.in</a>
                            </li>
                            <li className="flex items-center">
                                <Phone size={18} className="text-indigo-500 mr-3 shrink-0" />
                                <span className="text-gray-500 dark:text-gray-400">+91 98765 43210</span>
                            </li>
                        </ul>

                        <div className="group inline-flex items-center space-x-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors cursor-pointer">
                            <span>Get Support Now</span>
                            <MoveUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </div>
                    </div>

                </div>

                <div className="pt-8 border-t border-gray-100 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        © {new Date().getFullYear()} NE-Connect. All rights reserved.
                    </p>
                    <div className="flex items-center space-x-6 text-sm">
                        <Link href="#" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="#" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="#" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Cookie Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
