import React from "react";
import { Link } from "react-router-dom";
import { Heart, Gem } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-slate-900 text-slate-400 py-4 px-4 mt-auto shadow-2xl relative z-10 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
        {/* Left: Copyright & Brand */}
        <div className="text-center md:text-left flex items-center gap-2">
          <Gem className="w-4 h-4 text-amber-500" />
          <p className="tracking-wide">
            &copy; {currentYear}{" "}
            <span className="text-white font-bold tracking-wider hover:text-amber-500 transition-colors cursor-default">
              Luxe Gold & Jewelry
            </span>
            <span className="mx-2 text-slate-600">|</span>
            <span className="uppercase tracking-widest opacity-80">
              Admin Portal
            </span>
          </p>
        </div>

        {/* Right: Links & Credits */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          {/* Policy Links */}
          <div className="flex gap-4">
            <Link
              to="/privacy-policy"
              className="hover:text-white hover:underline decoration-amber-500 decoration-2 underline-offset-2 transition-all"
            >
              Privacy
            </Link>
            <Link
              to="/terms-of-service"
              className="hover:text-white hover:underline decoration-amber-500 decoration-2 underline-offset-2 transition-all"
            >
              Terms
            </Link>
          </div>

          {/* Version & Credit */}
          <div className="flex items-center gap-2 pl-0 sm:pl-6 sm:border-l border-slate-700">
            <span className="font-mono bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">
              v2.1.0
            </span>
            <span className="flex items-center gap-1">
              Made with
              <Heart className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" />
              by <span className="font-semibold text-slate-300">TechTeam</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
