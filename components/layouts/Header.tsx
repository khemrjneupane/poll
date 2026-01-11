"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ElectionCountdown from "@/components/timer/ElectionCountDown";
import {
  Menu,
  X,
  User,
  LogOut,
  Settings,
  Vote,
  Award,
  Info,
  Home,
  Newspaper,
} from "lucide-react";

const Header = () => {
  const [isProfileClicked, setIsProfileClicked] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const userRole = session?.user?.role?.toLocaleLowerCase();
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Detect scroll direction and show on hover near top
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 5);

      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (currentScrollY > lastScrollY + 5) {
            setVisible(true); // scrolling down → hide
          } else if (currentScrollY < lastScrollY - 5) {
            setVisible(false); // scrolling up → show
          }
          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    // 👇 Show header if mouse is near top of viewport
    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY < 90) {
        setVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [lastScrollY]);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logoutHandler = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  const getInitials = (name?: string) => {
    if (!name) return "";
    const words = name.trim().split(" ");
    const initials = words.map((word) => word[0].toUpperCase());
    return initials.slice(0, 3).join("");
  };

  const toggleProfile = () => setIsProfileClicked((prev) => !prev);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileClicked(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fixed navigation items with unique keys

  const navItems = [
    {
      href: "/",
      label: "Home",
      icon: Home,
      id: "home",
    },
    {
      href: session ? "/nominees" : "/login",
      label: "Nominate",
      icon: Award,
      requiresAuth: true,
      id: "nominate",
    },
    {
      //href: session ? "/vote" : "/login",
      href: "/vote",
      label: "Vote",
      icon: Vote,
      requiresAuth: true,
      id: "vote",
    },
    { href: "/results", label: "Results", icon: Home, id: "results" },
    { href: "/news", label: "News", icon: Newspaper, id: "news" },
  ];

  // Fixed variants with proper TypeScript typing
  const menuVariants = {
    closed: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: "easeInOut" as const,
      },
    },
    open: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut" as const,
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    closed: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2,
      },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut" as const,
      },
    },
  };

  const dropdownVariants = {
    closed: {
      opacity: 0,
      scale: 0.8,
      y: 10,
      transition: {
        duration: 0.2,
        ease: "easeInOut" as const,
      },
    },
    open: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: 50 }}
      animate={{
        opacity: visible ? 1 : 0,
        y: visible ? 0 : 40,
        backgroundColor: visible
          ? "rgba(15, 23, 42, 0.8)" // bright when visible
          : "rgba(15, 23, 42, 0.5)", // dim when hidden
      }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="fixed top-0 left-0 w-full z-50 backdrop-blur-lg shadow-xl text-white p-4"
    >
      <div className="mx-auto flex justify-between items-center px-4 md:px-6 gap-2">
        {/* Logo + Title */}
        <motion.div whileHover={{ scale: 1.02 }} className="">
          <Link href="/" className="flex justify-between items-center gap-1">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Image
                src="https://c.tenor.com/9Rt9JC45-54AAAAC/nepal-nepali.gif"
                alt="Nepal flag"
                width={120}
                height={120}
                className={`rounded-full border-1 border-blue-500 transition-all duration-300 ${
                  isScrolled ? "w-12 h-12" : "w-16 h-14"
                }`}
              />
            </motion.div>

            <motion.span
              whileHover={{ color: "#f4e9ff" }}
              className={`font-bold text-slate-100 tracking-wide transition-all duration-300 ${
                isScrolled ? "text-sm" : "text-md"
              }`}
            >
              PRE-ELECTION 2025
            </motion.span>
          </Link>
        </motion.div>
        <div className="hidden xl:block">
          <ElectionCountdown />
        </div>
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={item.href}>
                <motion.div
                  whileHover={{
                    scale: 1.05,
                    y: -2,
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group"
                >
                  <item.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <div className={`${isScrolled ? "text-sm" : "text-md"}`}>
                    {item.label}
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}

          {/* User Profile/Dropdown */}
          {session?.user ? (
            <motion.div
              className="relative ml-2 z-[80]"
              ref={dropdownRef}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleProfile}
                className="h-14 w-14 flex items-center justify-center cursor-pointer rounded-full bg-gradient-to-r from-blue-100 to-blue-200 border border-blue-300"
              >
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    width={100}
                    height={100}
                    className={`${
                      isScrolled ? " w-12 h-12" : " w-16 h-14"
                    } p-1 rounded-full border-1 border-blue-500`}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold text-sm">
                    {getInitials(session.user.name || "")}
                  </div>
                )}
              </motion.div>

              <AnimatePresence>
                {isProfileClicked && (
                  <motion.div
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={dropdownVariants}
                    className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-xl shadow-2xl rounded-xl overflow-hidden border border-gray-200 z-50"
                  >
                    <div className="p-2">
                      <motion.div
                        whileHover={{ x: 5 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 17,
                        }}
                      >
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-3 py-2 hover:bg-blue-50 rounded-lg text-gray-700 transition-colors group"
                          onClick={() => setIsProfileClicked(false)}
                        >
                          <User className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
                          <span>Profile</span>
                        </Link>
                      </motion.div>

                      {userRole === "admin" && (
                        <motion.div
                          whileHover={{ x: 5 }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 17,
                          }}
                        >
                          <Link
                            href="/admin"
                            className="flex items-center gap-3 px-3 py-2 hover:bg-blue-50 rounded-lg text-gray-700 transition-colors group"
                            onClick={() => setIsProfileClicked(false)}
                          >
                            <Settings className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
                            <span>Admin Control</span>
                          </Link>
                        </motion.div>
                      )}

                      <motion.div
                        whileHover={{ x: 5 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 17,
                        }}
                      >
                        <button
                          onClick={() => {
                            setIsProfileClicked(false);
                            logoutHandler();
                          }}
                          className="flex items-center gap-3 w-full text-left px-3 py-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors group"
                        >
                          <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          <span>Logout</span>
                        </button>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Link href="/login">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`${
                    isScrolled ? "text-sm" : "text-md"
                  } bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-2 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300`}
                >
                  Login
                </motion.div>
              </Link>
            </motion.div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <motion.div
          className="flex items-center gap-2 md:hidden relative z-[70]"
          ref={mobileMenuRef}
        >
          {session?.user && (
            <motion.div
              whileTap={{ scale: 0.9 }}
              onClick={toggleProfile}
              className="cursor-pointer"
            >
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  width={40}
                  height={40}
                  className="w-8 h-8 rounded-full border-2 border-blue-500"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  {getInitials(session.user.name || "")}
                </div>
              )}
            </motion.div>
          )}
          <AnimatePresence>
            {isProfileClicked && (
              <motion.div
                initial="closed"
                animate="open"
                exit="closed"
                variants={dropdownVariants}
                className="absolute top-13 right-0 mt-2 w-48 bg-white/95 backdrop-blur-xl shadow-2xl rounded-xl overflow-hidden border border-gray-200 z-50"
              >
                <div className="p-2">
                  <motion.div
                    whileHover={{ x: 5 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 17,
                    }}
                  >
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-3 py-2 hover:bg-blue-50 rounded-lg text-gray-700 transition-colors group"
                      onClick={() => setIsProfileClicked(false)}
                    >
                      <User className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
                      <span>Profile</span>
                    </Link>
                  </motion.div>

                  {userRole === "admin" && (
                    <motion.div
                      whileHover={{ x: 5 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 17,
                      }}
                    >
                      <Link
                        href="/admin"
                        className="flex items-center gap-3 px-3 py-2 hover:bg-blue-50 rounded-lg text-gray-700 transition-colors group"
                        onClick={() => setIsProfileClicked(false)}
                      >
                        <Settings className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
                        <span>Admin Control</span>
                      </Link>
                    </motion.div>
                  )}

                  <motion.div
                    whileHover={{ x: 5 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 17,
                    }}
                  >
                    <button
                      onClick={() => {
                        setIsProfileClicked(false);
                        logoutHandler();
                      }}
                      className="flex items-center gap-3 w-full text-left px-3 py-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors group"
                    >
                      <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span>Logout</span>
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </motion.button>
        </motion.div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            ref={mobileMenuRef}
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="md:hidden bg-white/95 backdrop-blur-xl shadow-2xl border-t border-gray-200 absolute top-full left-0 right-0 z-40"
          >
            <motion.div className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <motion.div key={item.id} variants={itemVariants}>
                  {" "}
                  {/* Use unique ID */}
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <motion.div
                      whileHover={{ x: 10 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium transition-colors group"
                    >
                      <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span>{item.label}</span>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}

              {!session && (
                <motion.div variants={itemVariants} key="login-mobile">
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <motion.div
                      whileHover={{ x: 10 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium shadow-md"
                    >
                      <User className="w-5 h-5" />
                      <span>Login</span>
                    </motion.div>
                  </Link>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export { Header };
