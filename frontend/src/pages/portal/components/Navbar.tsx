import React, { useState } from "react";
import { X } from "lucide-react";
import { RiMenu2Fill } from "react-icons/ri";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  animation?: boolean;
  showNavItems?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({
  animation = true,
  showNavItems = true,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const navItems = [
    { label: "Features", tag: "#features" },
    { label: "Pricing", tag: "#pricing" },
    { label: "Reviews", tag: "#reviews" },
  ];

  useGSAP(() => {
    gsap.from(".sligeRight", {
      x: -100,
      opacity: 0,
      duration: 0.9,
    });
    gsap.from(".slideLeft", {
      x: 100,
      opacity: 0,
      duration: 0.9,
    });
  });


  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    tag: string
  ) => {
    e.preventDefault();
    const targetElement = document.querySelector(tag);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      window.history.pushState(null, tag);
    }
  };



  return (
    <div className="relative z-50">
      <nav className={`w-full px-6 py-5 shadow-sm ${isOpen ? "bg-[#ffff]":""}`} >
        <div className=" max-w-7xl mx-auto grid grid-cols-12 items-center gap-4">
          <div
            className={`${
              animation ? "sligeRight" : ""
            } col-span-6 md:col-span-8 flex items-center`}
          >
            <p
              className="light:text-blue-600 text-2xl font-lazare font-bold mr-8 cursor-pointer"
              onClick={() => navigate("/")}
            >
              Dibolky
            </p>
            {showNavItems && (
              <div className="hidden md:flex items-center space-x-8 cursor-pointer">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    onClick={(e) => handleNavClick(e, item.tag)}
                    className="text-gray-600 dark:text-white  transition-colors duration-200"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div
            className={`${
              animation ? "slideLeft" : ""
            } hidden md:flex col-span-4 items-center justify-end space-x-4`}
          >
            <a
              href="/login"
              className="dark:text-white text-gray-700 transition-colors duration-200"
            >
              Login
            </a>
            {/* <a
              onClick={() => navigate("/trial")}
              className="dark:bg-[#202d42ea] bg-[#1c1e21f3] border border-[#8c9ab03f] light:bg-blue-600 text-white px-4 py-2 rounded-[25rem] transition-colors duration-200"
            >
              Start Free Trial
            </a> */}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`${
              animation ? "slideLeft" : ""
            } md:hidden col-span-6 flex justify-end text-gray-600 hover:text-gray-800 transition-colors duration-200`}
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
        className={`md:hidden z-10 absolute top-full left-0 w-full bg-white shadow-lg transition-all duration-200 ease-in-out ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="grid grid-cols-1 gap-4 px-6 py-4">
          {navItems.map((item) => (
            <a
              key={item.label}
              className="light:text-gray-600  cursor-pointer text-black hover:text-gray-800 transition-colors duration-200"
            >
              {item.label}
            </a>
          ))}

          <div className="grid grid-cols-1 gap-4 pt-4 border-t border-gray-100">
  
            <a
              onClick={() => navigate("/login")}
              className="text-center bg-[#1c1e21f3] border cursor-pointer border-[#8c9ab03f] rounded text-white px-4 py-2  transition-colors duration-200"
            >
              Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
