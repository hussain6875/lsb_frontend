import React from "react";
import { FaLinkedin, FaInstagram, FaYoutube, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => (
  <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-200 mt-16">
    <div className="container mx-auto px-6 py-12">
      <div className="grid gap-10 md:grid-cols-3 lg:gap-12">
        
        {/* Contact Section */}
        <div className="space-y-4">
          <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
            <span className="w-8 h-0.5 bg-blue-500"></span>
            Contact Us
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 group">
              <FaEnvelope className="text-blue-400 mt-1 flex-shrink-0" />
              <a 
                href="mailto:lsb@gmail.com" 
                className="text-slate-300 hover:text-blue-400 transition-colors duration-200"
              >
                lsb@gmail.com
              </a>
            </div>
            <div className="flex items-start gap-3 group">
              <FaPhone className="text-blue-400 mt-1 flex-shrink-0" />
              <a 
                href="tel:+917923333339" 
                className="text-slate-300 hover:text-blue-400 transition-colors duration-200"
              >
                +91 79233 33339
              </a>
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div className="space-y-4">
          <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
            <span className="w-8 h-0.5 bg-blue-500"></span>
            Location
          </h3>
          <div className="flex items-start gap-3">
            <FaMapMarkerAlt className="text-blue-400 mt-1 flex-shrink-0" />
            <div className="text-slate-300 leading-relaxed">
              <p className="font-medium text-white mb-1">Ernakulam, India</p>
              <p>No. IX/159 A, Infopark Expy,</p>
              <p>Infopark Campus, Kakkanad</p>
              <p>Ernakulam - 682030</p>
            </div>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="space-y-4">
          <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
            <span className="w-8 h-0.5 bg-blue-500"></span>
            Follow Us
          </h3>
          <div className="flex gap-4">
            <a 
              href="https://www.linkedin.com" 
              aria-label="LinkedIn" 
              className="w-12 h-12 bg-slate-700 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/50"
            >
              <FaLinkedin className="text-xl text-white" />
            </a>
            <a 
              href="https://www.instagram.com" 
              aria-label="Instagram" 
              className="w-12 h-12 bg-slate-700 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-pink-500/50"
            >
              <FaInstagram className="text-xl text-white" />
            </a>
            <a 
              href="https://www.youtube.com" 
              aria-label="YouTube" 
              className="w-12 h-12 bg-slate-700 hover:bg-red-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-red-500/50"
            >
              <FaYoutube className="text-xl text-white" />
            </a>
          </div>
          <p className="text-slate-400 text-sm mt-4">
            Stay connected for updates and exclusive content
          </p>
        </div>
      </div>
    </div>

    {/* Bottom Bar */}
    <div className="border-t border-slate-700">
      <div className="container mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
          <p>
            © {new Date().getFullYear()} <span className="font-semibold text-white">LocalService</span>. All rights reserved.
          </p>
          <p>
            Built with <span className="text-blue-400 font-medium">React</span> & <span className="text-blue-400 font-medium">Tailwind CSS</span>
          </p>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;