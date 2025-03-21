import React from 'react'
import Navbar from '../../components/portal.components/Navbar'
import Hero from '../../components/portal.components/Hero'
import Plans from '../../components/portal.components/Plans'
import { AnimatedBeamMultipleOutput } from '@/components/portal.components/dibolky.animation'
import { AnimatedBeamDemo } from '@/components/portal.components/messages.animation'
import TestimonialsSection from '@/components/portal.components/feedback'
import { GridPattern } from '@/components/magic.ui/box.pattern'
import { FeaturesCard } from '@/components/portal.components/bento.grid'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const Home: React.FC = () => {
  return (
    <div className='dark:bg-[#14181f] light:bg-white overflow-hidden min-h-screen'>
      <GridPattern
        width={40}
        height={40}
        x={-1}
        y={-1}
        className="[mask-image:linear-gradient(to_bottom,white,transparent)] opacity-20"
      />

      <div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[90%] h-96 pointer-events-none z-10"
        style={{
          background: 'radial-gradient(circle at center top, rgba(85, 115, 201, 0.2) 0%, rgba(59, 130, 246, 0.1) 30%, transparent 60%)',
        }}
      />

      <div className="relative z-20">
        <Navbar animation={true} />
        <Hero />
        <FeaturesCard />
        <AnimatedBeamMultipleOutput />
        <AnimatedBeamDemo />
        <Plans />
        <TestimonialsSection />
        <div className="md:px-96 px-10 mt-24 max-w-7xl mx-auto">
          <p className='text-2xl text-center mb-6 font-bold font-lazare text-foreground/90'>FAQ Questions</p>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Is it accessible?</AccordionTrigger>
              <AccordionContent>
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>Is it accessible?</AccordionTrigger>
              <AccordionContent>
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>Is it accessible?</AccordionTrigger>
              <AccordionContent>
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>Is it accessible?</AccordionTrigger>
              <AccordionContent>
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>Is it accessible?</AccordionTrigger>
              <AccordionContent>
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger>Is it accessible?</AccordionTrigger>
              <AccordionContent>
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <footer className="py-4 mt-28">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center text-center">
              <p className="text-sm text-gray-600">
                © {new Date().getFullYear()} Dibolky. All rights reserved.
              </p>
              <div className="flex items-center gap-4 mt-2">
                <a className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                  Terms of Service
                </a>
                <span className="text-gray-400">•</span>
                <a className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                  Privacy Policy
                </a>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </div>
  )
}

export default Home