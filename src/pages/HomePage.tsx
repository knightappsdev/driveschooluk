import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import LicenseProcess from '../components/LicenseProcess';
import CTABar from '../components/CTABar';
import Courses from '../components/Courses';
import ReadyToDriveCTA from '../components/ReadyToDriveCTA';
import Instructors from '../components/Instructors';
import InstructorCTA from '../components/InstructorCTA';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import ExitIntentModal from '../components/ExitIntentModal';
import WhatsAppBot from '../components/WhatsAppBot';
import ScrollToTop from '../components/ScrollToTop';

const HomePage: React.FC = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <LicenseProcess />
      <CTABar />
      <Courses />
      <ReadyToDriveCTA />
      <Instructors />
      <InstructorCTA />
      <Testimonials />
      <CTA />
      <Footer />
      <ExitIntentModal />
      <WhatsAppBot />
      <ScrollToTop />
    </>
  );
};

export default HomePage;
