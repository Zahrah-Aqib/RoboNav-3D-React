import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// The new cinematic Home page reproduces the approved scroll-driven RoboNav demo.
const Home = lazy(() => import('@/pages/ReactScrollHome'));
// Preserve the previous homepage at /classic-home for easy comparison.
const ClassicHome = lazy(() => import('@/pages/Home'));
const GridSimulator = lazy(() => import('@/pages/GridSimulator'));
const AlgorithmComparison = lazy(() => import('@/pages/AlgorithmComparison'));
const ExperimentLab = lazy(() => import('@/pages/ExperimentLab'));
const PythonVisualizations = lazy(() => import('@/pages/PythonVisualizations'));
const HowItWorks = lazy(() => import('@/pages/HowItWorks'));
const About = lazy(() => import('@/pages/About'));
const Documentation = lazy(() => import('@/pages/Documentation'));

function PageFallback() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-cyan/30 border-t-cyan rounded-full animate-spin" />
    </div>
  );
}

function SiteShell() {
  const location = useLocation();
  const cinematicHome = location.pathname === '/';

  return (
    <div className={
      cinematicHome
        ? 'min-h-screen bg-navy-950'
        : 'min-h-screen flex flex-col bg-navy-950 grid-bg'
    }>
      {/*
        Only the cinematic homepage uses the storyboard's own navbar.
        All other pages retain the existing React navbar and footer.
        This avoids TWO navbars covering the robot and changing the look
        of the exact scrolling version approved by the user.
      */}
      {!cinematicHome && <Navbar />}
      <main className={cinematicHome ? 'w-full' : 'flex-1'}>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/classic-home" element={<ClassicHome />} />
            <Route path="/simulator" element={<GridSimulator />} />
            <Route path="/comparison" element={<AlgorithmComparison />} />
            <Route path="/lab" element={<ExperimentLab />} />
            <Route path="/python-visualizations" element={<PythonVisualizations />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/about" element={<About />} />
            <Route path="/docs" element={<Documentation />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
      </main>
      {!cinematicHome && <Footer />}
    </div>
  );
}

export default function App() {
  return <BrowserRouter><SiteShell /></BrowserRouter>;
}
