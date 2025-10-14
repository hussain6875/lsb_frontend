import React from "react";

const Footer = () => (
  <footer className="bg-slate-50 border-t mt-12">
    <div className="container mx-auto px-4 py-6 text-center text-sm text-slate-600">
      © {new Date().getFullYear()} LocalService — Built with{" "}
      <span className="font-semibold">React & Tailwind</span>
    </div>
  </footer>
);

export default Footer;
