import React from 'react'
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';

import Footer from '../components/Footer';
const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      
      {/* Page Content */}
      <main className="grow">
        <HeroSection />
        <FeaturesSection />
      </main>

      {/* Footer */}
      <Footer />

    </div>
  )
}

export default Landing