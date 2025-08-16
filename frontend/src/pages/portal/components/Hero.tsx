import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroVideoDialog } from '@/components/magic.ui/hero-video.dialog';

const Hero = () => {
  const [isDemoVideoOpen,setIsDemoVideoOpen] = useState<boolean>(false)
  const navigate = useNavigate()
  useGSAP(()=>{
    gsap.from('.slideUp',{
      y:100,
      opacity:0,
      duration:0.9,
    })
  })
  return (
  <>
  {isDemoVideoOpen && <HeroVideoDialog videoSrc="https://www.youtube.com/embed/stKv9qNSPwI?si=m4Gr4-ePBHCxHGNu" setIsDemoVideoOpen={setIsDemoVideoOpen}/>}
    <div className='sm:min-h-[36rem] min-h-[34rem] px-4 sm:px-6 py-16 sm:py-20 '>
      <div className='max-w-7xl mx-auto grid grid-cols-12 gap-4'>
        <div className="slideUp col-span-12 lg:col-span-10 lg:col-start-2 flex flex-col items-center text-center space-y-6 mt-6">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-lazare font-bold leading-tight text-black dark:bg-gradient-to-b dark:from-[#c3cacc] dark:to-[#dbe0e1] dark:text-transparent dark:bg-clip-text">

            Scale Your Platform With
            <br/>
             Confidence
          </h1>
          
          <p className="light:text-gray-600 font-lazare text-gray-500 font-bold text-lg sm:text-xl max-w-3xl">
            The all-in-one platform that helps you manage clients, automate workflows, and grow your agency – all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
            <button className="dark:bg-[#202d42ea] bg-[#1c1e21ea]  text-white px-8 py-3 rounded-lg transition-colors duration-200 text-base sm:text-lg font-medium" onClick={() => navigate('/trial')}>
              Start 30-Day Free Trial
            </button>
            <button className="border border-[#202d42ea] dark:text-white light:text-[#2563EB] px-8 py-3 rounded-lg light:hover:bg-blue-50 transition-colors duration-200 text-base sm:text-lg font-medium" onClick={() => setIsDemoVideoOpen(true)}>
              Watch Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  </>
  );
};

export default Hero;