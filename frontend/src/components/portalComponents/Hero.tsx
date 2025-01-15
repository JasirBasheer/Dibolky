import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import React from 'react';

const Hero = () => {
  useGSAP(()=>{
    gsap.from('.slideUp',{
      y:100,
      opacity:0,
      duration:0.9,
    })
  })
  return (
    <div className='bg-[#EFF4FF] sm:min-h-[31rem] min-h-[34rem] px-4 sm:px-6 py-16 sm:py-20'>
      <div className='max-w-7xl mx-auto grid grid-cols-12 gap-4'>
        <div className="slideUp col-span-12 lg:col-span-10 lg:col-start-2 flex flex-col items-center text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl  font-bold text-[#2563EB] leading-tight">
            Scale Your Platform With
            <br/>
             Confidence
          </h1>
          
          <p className="text-gray-600 text-lg sm:text-xl max-w-3xl">
            The all-in-one platform that helps you manage clients, automate workflows, and grow your agency – all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
            <button className="bg-[#2563EB] text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200 text-base sm:text-lg font-medium">
              Start 14-Day Free Trial
            </button>
            <button className="border border-[#2563EB] text-[#2563EB] px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors duration-200 text-base sm:text-lg font-medium">
              Watch Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;