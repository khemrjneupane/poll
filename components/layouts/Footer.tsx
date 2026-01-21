"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

const Footer = () => {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (currentScrollY > lastScrollY + 5) {
            // scrolling down → hide
            setVisible(false);
          } else if (currentScrollY < lastScrollY - 5) {
            // scrolling up → show
            setVisible(true);
          }
          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      animate={{
        opacity: visible ? 1 : 0,
        y: visible ? 0 : 40,
        backgroundColor: visible
          ? "rgba(15, 23, 42, 0.8)" // bright when visible
          : "rgba(15, 23, 42, 0.5)", // dim when hidden
      }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="fixed bottom-0 left-0 w-full z-40 backdrop-blur-lg shadow-xl text-white"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-center md:text-left opacity-90">
            &copy; {new Date().getFullYear()} VoteNepal.net. All rights
            reserved.
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-blue-700/40">
          <div className="flex flex-wrap justify-center gap-6 text-xs opacity-80">
            <Link
              href="/about"
              className="hover:text-blue-200 transition-colors"
            >
              About Us
            </Link>
            <Link
              href="/privacy"
              className="hover:text-blue-200 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-blue-200 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/contact"
              className="hover:text-blue-200 transition-colors"
            >
              ContactUs
            </Link>
            <Link href="/faq" className="hover:text-blue-200 transition-colors">
              FAQs
            </Link>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
