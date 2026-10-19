"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { logoutAction } from "@/app/actions";

interface User {
  email: string;
  role: string;
}

export default function PortalNavBar({ user }: { user: User }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="relative z-50 bg-white dark:bg-slate-900 dark:text-gray-300 text-gray-600 px-6 py-0 rounded-full flex items-center justify-between shadow-md mb-3.5">
      {/* Brand Logo & Portal Badge */}
      
        <Link href="/Portal/Dashboard" className="flex items-center group">
          <Image
            src="/portal_eagle1.png"
            alt="Eagles University Logo"
            width={65}
            height={10}
            priority
          />
        </Link>
        

      {/* DESKTOP PORTAL NAVIGATION */}
      <div className="hidden lg:flex items-center gap-6 font-medium text-sm ml-auto mr-6">
        <Link href="/Portal/Dashboard" className="hover:text-blue-400 transition-colors">
          Dashboard
        </Link>
        <Link href="/Portal/Register" className="hover:text-blue-400 transition-colors">
          Register
        </Link>
        
        {user.role === "instructor" ? (
          <Link href="/Portal/Grading" className="hover:text-blue-400 transition-colors">
            Gradebook
          </Link>
        ) : (
          <Link href="/Portal/Grades" className="hover:text-blue-400 transition-colors">
            Academic Transcript
          </Link>
        )}

        <Link href="/Portal/Profile" className="hover:text-blue-400 transition-colors">
          Profile Settings
        </Link>
      </div>

      {/* USER IDENTIFIER & LOGOUT */}
      <div className="hidden lg:flex items-center gap-4">
        <div className="text-right border-l border-slate-700 pl-4">
          <p className="text-xs font-medium text-slate-300">{user.email}</p>
        </div>

        <form action={logoutAction}>
          <button
            type="submit"
            className="bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all"
          >
            Sign Out
          </button>
        </form>

        <ThemeToggle />
      </div>

      {/* MOBILE HAMBURGER BUTTON */}
      <div className="flex items-center gap-2 lg:hidden ml-auto">
        <ThemeToggle />
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-2xl text-white hover:text-blue-400 p-1"
        >
          ☰
        </button>
      </div>

      {/* MOBILE PORTAL DROPDOWN */}
      {isOpen && (
        <div className="absolute right-0 top-full z-50 w-56 rounded-2xl bg-slate-800 text-slate-200 border border-slate-700 shadow-xl lg:hidden mt-2 p-2">
          <div className="flex flex-col text-sm">
            <div className="px-4 py-2 border-b border-slate-700">
              <p className="text-xs text-slate-400">Signed in as:</p>
              <p className="font-medium text-white truncate">{user.email}</p>
            </div>

            <Link
              href="/Portal/Dashboard"
              className="px-4 py-2.5 rounded-lg hover:bg-slate-700 hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/Portal/Register"
              className="px-4 py-2.5 rounded-lg hover:bg-slate-700 hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Register
            </Link>
            <Link
              href="/Portal/Profile"
              className="px-4 py-2.5 rounded-lg hover:bg-slate-700 hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Profile Settings
            </Link>

            <div className="border-t border-slate-700 mt-1 pt-1">
              <form action={logoutAction} className="w-full">
                <button
                  type="submit"
                  className="w-full text-left px-4 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 font-medium transition-colors"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}