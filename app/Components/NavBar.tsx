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
          src="/footer_Eagle.png"
          alt="Eagles University Logo"
          width={65}
          height={10}
          priority
          //className="h-auto w-auto"
        />
      </Link>

      <div className="hidden lg:flex items-end gap-6 font-medium text-sm md:text-base ml-auto mr-4">
        <Link
          href="/"
          className="hover:text-blue-500 dark:hover:text-white transition-colors"
        >
          Home
        </Link>

        <span className="text-gray-300">|</span>

        <a
          href="#News"
          className="hover:text-blue-500 dark:hover:text-white transition-colors"
        >
          News
        </a>

        <span className="text-gray-300">|</span>


        <div className="group relative">
        <button className="flex items-center gap-1 dark:hover:text-white">
          Admission <span aria-hidden>▾</span>
        </button>

        {/* pt-2 (not mt-2) keeps the hover area continuous */}
        <div
          className="invisible absolute left-0 top-full z-50 pt-2 opacity-0
                     transition-all duration-150 
                     group-hover:visible group-hover:opacity-100
                     group-focus-within:visible group-focus-within:opacity-100"
        >
          <ul className="w-48 rounded-md border bg-white dark:bg-gray-800 dark:text-gray-300 py-2 shadow-lg">
            <li><Link href="/Admission" className="block px-4 py-2 hover:bg-[#1377b1] hover:text-gray-300">
            Apply for Admission
            </Link></li>
            <li><Link href="/Admission/Status" className="block px-4 py-2 hover:bg-[#1377b1] hover:text-gray-300">Admission Status</Link></li>
          </ul>
        </div>
      </div>


        <span className="text-gray-300">|</span>

        <Link
          href="/Programs"
          className="hover:text-blue-500 dark:hover:text-white transition-colors"
        >
          Programs
        </Link>

        <span className="text-gray-300">|</span>

        <Link
          href="/Portal"
          className="hover:text-blue-500 dark:hover:text-white transition-colors"
        >
          Portal
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

            <hr />

            <Link
              href="/Portal"
              className="px-6 py-4 hover:bg-gray-100 hover:text-blue-500"
              onClick={() => setIsOpen(false)}
            >
              Portal
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
