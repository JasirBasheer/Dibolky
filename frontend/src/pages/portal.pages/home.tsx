import React from 'react'
import Navbar from '../../components/portalComponents/Navbar'
import Hero from '../../components/portalComponents/Hero'
import Plans from '../../components/portalComponents/Plans'

const Home: React.FC = () => {

  return (
    <div >
      <Navbar animation={true} />
      <Hero />
      <Plans />
    </div>
  )
}

export default Home