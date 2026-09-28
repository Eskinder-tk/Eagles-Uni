"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="relative z-50 bg-white dark:bg-gray-800 dark:text-gray-300 text-gray-600 px-6 py-0 rounded-full flex items-center justify-between shadow-md mb-3.5">
      <Link href="/" className="flex items-center group">
        <Image
          src="/Eagle_Logo.png"
          alt="Eagles University Logo"
          width={300}
          height={80}
          priority
          className="h-auto w-auto"
        />
      </Link>

      <div className="hidden lg:flex items-end gap-6 font-medium text-sm md:text-base ml-auto mr-4">
        <Link
          href="/"
          className="hover:text-blue-500 dark:hover:text-[#094d7a] transition-colors"
        >
          Home
        </Link>

        <span className="text-gray-300">|</span>

        <Link
          href="/News"
          className="hover:text-blue-500 dark:hover:text-[#094d7a] transition-colors"
        >
          News
        </Link>

        <span className="text-gray-300">|</span>

        <Link
          href="/Admission"
          className="hover:text-blue-500 dark:hover:text-[#094d7a] transition-colors"
        >
          Admission
        </Link>

        <span className="text-gray-300">|</span>

        <Link
          href="/Programs"
          className="hover:text-blue-500 dark:hover:text-[#094d7a] transition-colors"
        >
          Programs
        </Link>
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-100 lg:hidden text-2xl hover:text-blue-800 ml-auto mr-3"
      >
        ☰
      </button>
      <ThemeToggle />

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full z-50 w-48 rounded-b-md bg-white  dark:bg-gray-800 dark:text-gray-300 shadow-lg lg:hidden">
          <div className="flex flex-col">
            <Link
              href="/"
              className="px-6 py-4 hover:bg-gray-100 hover:text-blue-500"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>

            <hr />

            <Link
              href="/News"
              className="px-6 py-4 hover:bg-gray-100 hover:text-blue-500"
              onClick={() => setIsOpen(false)}
            >
              News
            </Link>

            <hr />

            <Link
              href="/Admission"
              className="px-6 py-4 hover:bg-gray-100 hover:text-blue-500"
              onClick={() => setIsOpen(false)}
            >
              Admission
            </Link>

            <hr />

            <Link
              href="/Programs"
              className="px-6 py-4 hover:bg-gray-100 hover:text-blue-500"
              onClick={() => setIsOpen(false)}
            >
              Programs
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
