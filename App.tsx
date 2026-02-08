import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { AboutPage } from './components/AboutPage';
import { Services } from './components/Services';
import { HowItWorks } from './components/HowItWorks';
import { Portfolio } from './components/Portfolio';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Marquee } from './components/Marquee';
import { Lab } from './components/Lab';
import { CreativeBlend } from './components/CreativeBlend';
import { ProjectsPage } from './components/ProjectsPage';
import { Testimonials } from './components/Testimonials';
import { AIChat } from './components/AIChat';
import { Toolbox } from './components/Toolbox';
import { CaseStudyPage } from './components/CaseStudyPage';
import { BespokeInquiryForm } from './components/BespokeInquiryForm';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsOfService } from './components/TermsOfService';
import { AdminDashboard } from './components/AdminDashboard';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedCaseStudyId, setSelectedCaseStudyId] = useState<number | null>(null);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  // Dynamic Title Management
  useEffect(() => {
    switch (currentPage) {
      case 'home':
        document.title = "Sam Ayebanate | AI Engineer & Product Designer";
        break;
      case 'about':
        document.title = "About | Sam Ayebanate";
        break;
      case 'work':
        document.title = "Selected Work | Sam Ayebanate";
        break;
      case 'privacy':
        document.title = "Privacy Policy | Sam Ayebanate";
        break;
      case 'terms':
        document.title = "Terms of Service | Sam Ayebanate";
        break;
      case 'admin':
        document.title = "Admin Dashboard | Portfolio CRM";
        break;
      // 'case-study' title is handled in the CaseStudyPage component
    }
  }, [currentPage]);

  const handleOpenCaseStudy = (id: number) => {
    setSelectedCaseStudyId(id);
    setCurrentPage('case-study');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isStandalonePage = ['case-study', 'privacy', 'terms', 'admin'].includes(currentPage);

  // If Admin Dashboard is active, render only that
  if (currentPage === 'admin') {
    return <AdminDashboard onExit={() => setCurrentPage('home')} />;
  }

  return (
    <div className="bg-background min-h-screen text-primary font-body selection:bg-accent selection:text-black transition-colors duration-300 flex flex-col relative">
      {/* Hide navigation on immersive pages */}
      {!isStandalonePage && (
        <Navigation 
            activePage={currentPage} 
            onNavigate={setCurrentPage} 
            onOpenInquiry={() => setIsInquiryOpen(true)}
        />
      )}
      
      <main className="flex-grow">
        {currentPage === 'home' && (
          <>
            <Hero />
            <Marquee />
            <CreativeBlend />
            {/* About section removed from Home page */}
            <Services />
            <HowItWorks />
            <Portfolio onNavigate={setCurrentPage} onOpenCaseStudy={handleOpenCaseStudy} />
            <Toolbox />
            <Testimonials />
            <Lab />
            <Contact />
          </>
        )}

        {currentPage === 'about' && (
          <AboutPage />
        )}

        {currentPage === 'work' && (
          <ProjectsPage onOpenCaseStudy={handleOpenCaseStudy} />
        )}

        {currentPage === 'case-study' && selectedCaseStudyId && (
          <CaseStudyPage 
            id={selectedCaseStudyId} 
            onBack={() => setCurrentPage('work')}
            onNext={handleOpenCaseStudy}
          />
        )}

        {currentPage === 'privacy' && (
          <PrivacyPolicy onBack={() => setCurrentPage('home')} />
        )}

        {currentPage === 'terms' && (
          <TermsOfService onBack={() => setCurrentPage('home')} />
        )}
      </main>

      {!isStandalonePage && (
        <Footer onNavigate={setCurrentPage} />
      )}
      
      {/* Sticky AI Chat Widget */}
      <AIChat />

      {/* Bespoke Inquiry Modal */}
      <BespokeInquiryForm 
        isOpen={isInquiryOpen} 
        onClose={() => setIsInquiryOpen(false)} 
      />
    </div>
  );
}

export default App;