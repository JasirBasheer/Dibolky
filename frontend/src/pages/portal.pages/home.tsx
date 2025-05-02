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
        <Navbar/>
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
              <AccordionTrigger>What is Dibolky and how does it help with social media management?</AccordionTrigger>
              <AccordionContent>
              Dibolky is your all-in-one social media buddy! We help you create, schedule, and publish content across all your social accounts from one easy dashboard. No more jumping between apps or missing posts - we've got you covered whether you're an agency managing clients or an influencer working with your team.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>Which social media platforms does Dibolky support?</AccordionTrigger>
              <AccordionContent>
              We play nice with all the popular platforms you love! That includes Facebook, Instagram, Twitter/X, LinkedIn, TikTok, Pinterest, and YouTube. Post everywhere with just a few clicks!
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>How secure is my social media data on Dibolky?</AccordionTrigger>
              <AccordionContent>
              Your data's safety is our top priority! We use super secure encryption and never store your passwords. Only the people you specifically authorize can access your accounts, and we follow all the major privacy regulations. Your social media is safe with us!
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>Can I try Dibolky before purchasing a subscription?</AccordionTrigger>
              <AccordionContent>
              Absolutely! Jump in with our 30-day free trial - no credit card needed. Take Dibolky for a spin with your team and see how much easier life gets when you're not juggling multiple social platforms manually.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>What makes Dibolky different from other social media management tools? </AccordionTrigger>
              <AccordionContent>
              We're built for real teamwork! Whether you're an agency, client, influencer, or account manager, we've created specific interfaces for how YOU work. Plus, our analytics actually make sense, and our permission settings let you control exactly who can do what. We're like the other tools, but actually designed for how people really use social media!
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger>Does Dibolky offer customer support if I need help?</AccordionTrigger>
              <AccordionContent>
              You bet! We're real humans ready to help whenever you get stuck. Reach out through our live chat, email us, or browse our help center full of guides and videos. We're always just a message away and love helping our users succeed!RetryClaude can make mistakes. Please double-check responses.              </AccordionContent>
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