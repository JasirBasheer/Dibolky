import React, { useEffect, useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { RiMenu2Fill } from "react-icons/ri";
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrency } from '@/redux/slices/portal.slice';

interface NavbarProps {
  animation: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ animation }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isCurrecyBarOpen, setIsCurrecyBarOpen] = useState(false);
  const currency = useSelector((state:any)=>state.portal)
  const dispatch = useDispatch()

  console.log(currency)

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


  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'INR', symbol: '₹', name: 'Rupees' },
    { code: 'AED', symbol: 'د.', name: 'Dirham' },
  ];
  const symbols:any = {
    INR:"₹",
    USD:"$",
    AED:"د."
  }

  const handleSelect = (currency: string,symbol:string) => {
    Cookies.set('userCountry',currency)
    dispatch(setCurrency({selectedCurrency:currency,currencySymbol:symbol}))
    setIsCurrecyBarOpen(false);
  };

  useEffect(()=>{
    const country = Cookies.get('userCountry')
      if(country){
      dispatch(setCurrency({selectedCurrency:country,currencySymbol:symbols[country]}))
      }else{
      dispatch(setCurrency({selectedCurrency:"USD",currencySymbol:"$"}))
      }
  },[])

  return (
    <div className="relative z-50">
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
            <div className="relative">
              <button
                onClick={() => setIsCurrecyBarOpen(!isCurrecyBarOpen)}
                className="flex items-center gap-1 px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors rounded-md"
              >
                <span className="font-medium">{currency.selectedCurrency}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isCurrecyBarOpen ? 'rotate-180' : ''}`} />
              </button>


              {isCurrecyBarOpen && (
                <AnimatePresence >
                  <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute right-0 mt-2 w-48   z-10  bg-white rounded-md shadow-lg border border-gray-200  overflow-y-auto p-4 text-sm"
                  >
                      <ul className="py-1">
                        {currencies.map((currency) => (
                          <li key={currency.code}>
                            <button
                              onClick={() => handleSelect(currency.code,currency.symbol)}
                              className="w-full px-4 py-2 text-left hover:bg-blue-50 text-gray-700 hover:text-blue-600 flex items-center justify-between"
                            >
                              <span>{currency.name}</span>
                              <span className="text-gray-500">{currency.symbol}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>

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