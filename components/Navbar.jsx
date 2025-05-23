"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import {
  BellRing,
  ChevronDown,
  ListCollapse,
  LogIn,
  Menu,
} from "lucide-react";
import logo from "../public/logo.png";
import { Drawer, Box } from "@mui/material";

const ProfileDropdownNavbar = () => {
  const [showNav, setShowNav] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { data: session } = useSession();

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const navItems = [
    { text: "HOME", url: "/" },
    { text: "ABOUT", url: "/about" },
    { text: "BLOG", url: "/blog" },
    // { text: "POST", url: "/upload-to-blog" },
    { text: "CONTACT", url: "/contact" },
    { text: "SERVICES", url: "/#services-section" },
    { text: "NEWS", url: "/news" },
    { text: "DEVELOPERS", url: "/developers" },
    { text: "PROJECTS", url: "/projects" },
    { text: "YOUTUBE", url: "/youtubevideos" },
  ];

  return (
    <main className="fixed w-full bg-gradient-to-r from-gray-900 via-black to-gray-800 shadow-lg z-50">
      <section className="px-5 py-4 flex items-center justify-between">
        {/* Logo */}
        <span className="flex items-center border px-2 border-gray-800 rounded-md font-extralight">
          <Link href="/">
            <Image
              src={logo}
              width={50}
              height={50}
              alt="WebWiz Logo"
              className="rounded-full shadow-xl hover:scale-110 transition-transform duration-100 z-50"
            />
          </Link>
          <h1 className="text-white -ml-5">WebWiz</h1>
        </span>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.url}
              className="text-md text-gray-200 font-semibold hover:text-cyan-400 hover:underline transition-all duration-300 z-50"
            >
              {item.text}
            </Link>
          ))}
        </div>

        {/* Desktop Avatar + Drawer */}
        <div className="hidden lg:flex items-center gap-4">
          {session ? (
            <>
              <button
                onClick={toggleDrawer(true)}
                className="flex items-center gap-2 focus:outline-none"
              >
                <div className="relative">
                  <img
                    src={session?.user?.image || "/default-avatar.png"}
                    alt={session?.user?.name}
                    width={40}
                    height={40}
                    className="rounded-full shadow-md hover:shadow-lg transition-shadow duration-300 object-cover"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-gray-900"></span>
                </div>
                <span className="text-sm font-semibold text-gray-200 hover:text-cyan-400 transition-colors duration-300 hidden md:inline-block">
                  {session?.user?.name}
                </span>
                <ChevronDown className="text-xl text-cyan-400 transition-transform duration-200" />
              </button>

              <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
                <Box
                  sx={{
                    width: 280,
                    bgcolor: "#1f2937",
                    color: "white",
                    height: "100%",
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                  role="presentation"
                  onClick={toggleDrawer(false)}
                  onKeyDown={toggleDrawer(false)}
                >
                  <div>
                    <p className="font-semibold text-base truncate">{session.user.name}</p>
                    <p className="text-gray-400 text-xs truncate mb-4">{session.user.email}</p>
                    <hr className="my-4 border-gray-600" />
                    <nav className="flex flex-col space-y-2 text-gray-300 text-sm font-normal">
                      <Link href="/profile" className="hover:text-cyan-400 transition-colors duration-200">
                        My Profile
                      </Link>
                      <Link href="/blog" className="hover:text-cyan-400 transition-colors duration-200">
                        Blog
                      </Link>
                      <Link href="/news" className="hover:text-cyan-400 transition-colors duration-200">
                        News
                      </Link>
                      <Link href="/notifications" className="hover:text-cyan-400 transition-colors duration-200">
                        Notifications
                      </Link>
                    </nav>
                  </div>
                  <button
                    onClick={signOut}
                    className="mt-6 w-full py-2 rounded bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition"
                    aria-label="Sign out"
                  >
                    Sign Out
                  </button>
                </Box>
              </Drawer>
            </>
          ) : (
            <Link
              href="/auth/signin"
              className="text-md py-2 px-6 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-gray-200 rounded-lg hover:text-cyan-400 hover:bg-cyan-500 transition-all duration-300 shadow-md"
            >
              <LogIn className="inline-block mr-2 text-gray-400" size={16} />
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Avatar Drawer Toggle */}
        {session && (
          <button
            onClick={toggleDrawer(true)}
            className="lg:hidden focus:outline-none mr-4 z-50"
          >
            <img
              src={session.user.image || "/default-avatar.png"}
              alt={session.user.name}
              width={36}
              height={36}
              className="rounded-full shadow-md hover:shadow-lg object-cover border border-gray-500"
            />
          </button>
        )}

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setShowNav(!showNav)}
          className="lg:hidden text-3xl text-orange-400 focus:outline-none z-50"
          aria-label="Toggle navigation menu"
        >
          {showNav ? (
            <ListCollapse className="text-white" />
          ) : (
            <Menu className="text-white" />
          )}
        </button>
      </section>

      {/* Mobile Navigation Overlay */}
      <div
        className={`fixed top-0 left-0 w-full h-full bg-black/90 text-white flex flex-col items-center justify-center z-40 transition-transform duration-500 ${
          showNav ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex items-center justify-center mb-5">
          <div className="h-10 w-10 rounded-full bg-orange-400 shadow-[0_0_80px_40px_rgba(255,165,0,0.8)] animate-pulse"></div>
        </div>

        {session?.user?.image && (
          <img
            src={session.user.image}
            alt={session.user.name}
            className="rounded-full mb-5 shadow-2xl max-w-[80px] max-h-[80px] object-cover"
          />
        )}

        {navItems.map((item, index) => (
          <Link
            key={index}
            href={item.url}
            onClick={() => setShowNav(false)}
            className="text-lg font-semibold mb-4 hover:text-orange-400 transition duration-300"
          >
            {item.text}
          </Link>
        ))}

        {session ? (
          <button
            onClick={() => {
              signOut();
              setShowNav(false);
            }}
            className="text-md py-2 px-6 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-gray-200 rounded-lg hover:text-cyan-400 hover:bg-cyan-500 transition-all duration-300 shadow-md mt-4"
          >
            Sign Out
          </button>
        ) : (
          <Link
            href="/auth/signin"
            onClick={() => setShowNav(false)}
            className="text-md py-2 px-6 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-gray-200 rounded-lg hover:text-cyan-400 hover:bg-cyan-500 transition-all duration-300 shadow-md mt-4"
          >
            Sign In
          </Link>
        )}
      </div>
    </main>
  );
};

export default ProfileDropdownNavbar;
