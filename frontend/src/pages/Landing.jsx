import React from 'react'
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/featuresSection';

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col">

      <main className="grow">
        <HeroSection />
        <FeaturesSection />
      </main>

    </div>
  )
}

export default Landing