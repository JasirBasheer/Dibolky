import React, { useState } from 'react';
import { X } from 'lucide-react';
import { RiMenu2Fill } from "react-icons/ri";
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

interface NavbarProps {
  animation: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ animation }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const navItems = [
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Contact', href: '/contact' }
  ];

  useGSAP(() => {
    gsap.from('.sligeRight', {
      x: -100,
      opacity: 0,
      duration: 0.9,
    })
    gsap.from('.slideLeft', {
      x: 100,
      opacity: 0,
      duration: 0.9,
    })
  })

  return (
    <div className="relative">
      <nav className="w-full px-6 py-5 bg-white shadow-sm">
        <div className=" max-w-7xl mx-auto grid grid-cols-12 items-center gap-4">
          <div className={`${animation ? "sligeRight" : ""} col-span-6 md:col-span-8 flex items-center`}>
            <a href="/" className="text-blue-600 text-2xl font-bold mr-8">
              Dibolky
            </a>

            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div className={`${animation ? "slideLeft" : ""} hidden md:flex col-span-4 items-center justify-end space-x-4`}>
            <a
              href="/login"
              className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              Login
            </a>
            <a
              href="/trial"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-[25rem] transition-colors duration-200"
            >
              Start Free Trial
            </a>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`${animation ? "slideLeft" : ""} md:hidden col-span-6 flex justify-end text-gray-600 hover:text-gray-800 transition-colors duration-200`}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <RiMenu2Fill className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      <div
        className={`md:hidden z-10 absolute top-full left-0 w-full bg-white shadow-lg transition-all duration-200 ease-in-out ${isOpen
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 -translate-y-2 pointer-events-none'
          }`}
      >
        <div className="grid grid-cols-1 gap-4 px-6 py-4">
          {navItems.map((item) => (
            <a key={item.label}
              href={item.href}
              className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              {item.label}
            </a>
          ))}

          <div className="grid grid-cols-1 gap-4 pt-4 border-t border-gray-100">
            <a
              href="/login"
              className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              Login
            </a>
            <a
              href="/trial"
              className="text-center bg-blue-600 hover:bg-blue-700 rounded text-white px-4 py-2  transition-colors duration-200"
            >
              Start Free Trial
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;