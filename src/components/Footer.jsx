import React from "react";
import { FaLinkedin, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => (
  <footer className="bg-slate-50 border-t mt-12">
    <div className="container mx-auto px-4 py-10 grid gap-8 md:grid-cols-3 text-slate-700 text-sm">
      
      {/* Contact Section */}
      <div>
        <h3 className="font-semibold text-slate-800 mb-2 text-base">Contact Us</h3>
        <p>Email: <a href="mailto:lsb@gmail.com" className="text-blue-600 hover:underline">lsb@gmail.com</a></p>
        <p>Phone: <a href="tel:+917923333339" className="text-blue-600 hover:underline">+91 79233 33339</a></p>
      </div>

      {/* Location Section */}
      <div>
        <h3 className="font-semibold text-slate-800 mb-2 text-base">Location</h3>
        <p>Ernakulam, India</p>
        <p>No. IX/159 A, Infopark Expy, Infopark Campus,</p>
        <p>Kakkanad, Ernakulam - 682030</p>
      </div>

      {/* Social Media Section */}
      <div>
        <h3 className="font-semibold text-slate-800 mb-2 text-base">Follow Us</h3>
       <div className="flex justify-center md:justify-start gap-4 text-2xl">
  <a href="https://www.linkedin.com" aria-label="LinkedIn" className="text-blue-700 hover:text-blue-900"><FaLinkedin /></a>
  <a href="https://www.instagram.com" aria-label="Instagram" className="text-pink-600 hover:text-pink-800"><FaInstagram /></a>
  <a href="https://www.youtube.com" aria-label="YouTube" className="text-red-600 hover:text-red-800"><FaYoutube /></a>
</div>

      </div>
    </div>

    <div className="border-t text-center text-slate-600 py-4 text-sm">
      © {new Date().getFullYear()} <span className="font-semibold">LocalService</span> — Built with{" "}
      <span className="font-semibold">React & Tailwind</span>
    </div>
  </footer>
);

export default Footer;
