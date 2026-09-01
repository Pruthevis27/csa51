/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { EHRProvider, useEHR } from './context/EHRContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ToastContainer } from './components/ToastContainer';
import { AuditLogDrawer } from './components/AuditLogDrawer';
import { GuidedWalkthroughBar } from './components/GuidedWalkthroughBar';

import { DashboardPage } from './pages/DashboardPage';
import { CreateEHRPage } from './pages/CreateEHRPage';
import { HashingPage } from './pages/HashingPage';
import { DigitalSignaturePage } from './pages/DigitalSignaturePage';
import { VerificationPage } from './pages/VerificationPage';
import { TamperTestPage } from './pages/TamperTestPage';
import { EvaluationPage } from './pages/EvaluationPage';
import { AboutPage } from './pages/AboutPage';

const MainContent: React.FC = () => {
  const { currentView } = useEHR();

  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#E4E3E0]">
      {currentView === 'dashboard' && <DashboardPage />}
      {currentView === 'create-ehr' && <CreateEHRPage />}
      {currentView === 'hashing' && <HashingPage />}
      {currentView === 'signature' && <DigitalSignaturePage />}
      {currentView === 'verification' && <VerificationPage />}
      {currentView === 'tamper-test' && <TamperTestPage />}
      {currentView === 'evaluation' && <EvaluationPage />}
      {currentView === 'about' && <AboutPage />}
    </main>
  );
};

export default function App() {
  const [isAuditDrawerOpen, setIsAuditDrawerOpen] = useState<boolean>(false);

  return (
    <EHRProvider>
      <div className="flex h-screen bg-[#E4E3E0] text-[#141414] font-sans antialiased overflow-hidden selection:bg-[#141414] selection:text-[#E4E3E0]">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Application Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Header */}
          <Header onOpenAuditLog={() => setIsAuditDrawerOpen(true)} />

          {/* Guided Walkthrough Step Indicator */}
          <GuidedWalkthroughBar />

          {/* Scrollable Page Body */}
          <MainContent />
        </div>

        {/* Global Floating Components */}
        <ToastContainer />
        <AuditLogDrawer isOpen={isAuditDrawerOpen} onClose={() => setIsAuditDrawerOpen(false)} />
      </div>
    </EHRProvider>
  );
}

