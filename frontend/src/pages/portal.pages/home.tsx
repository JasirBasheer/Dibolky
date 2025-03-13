import React from 'react'
import Navbar from '../../components/portalComponents/Navbar'
import Hero from '../../components/portalComponents/Hero'
import Plans from '../../components/portalComponents/Plans'
import { AnimatedBeamMultipleOutputDemo } from '@/components/portalComponents/dibolky.animation'
import { AnimatedBeamDemo } from '@/components/portalComponents/messages.animation'
import { MarqueeDemo } from '@/components/portalComponents/feedback'

const Home: React.FC = () => {

  return (
    <div >
      <Navbar animation={true} />
      <Hero />
      <Plans />
      <MarqueeDemo />
      <AnimatedBeamMultipleOutputDemo />
      <AnimatedBeamDemo />
    </div>
  )
}

export default Home