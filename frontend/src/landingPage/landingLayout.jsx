import LenisScroll from "./components/lenis-scroll";
import Navbar from "./components/navbar";
import HeroSection from "./sections/hero-section";
import OurLatestCreation from "./sections/our-latest-creation";
import AboutOurApps from "./sections/about-our-apps";
import GetInTouch from "./sections/get-in-touch";
import Footer from "./components/footer";

const LandingLayout = ({ children }) => {

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 text-neutral-900">
      {/* Layout Components outside Routes */}
      <LenisScroll />
      <Navbar />

      <main className="px-6 md:px-16 lg:px-24 xl:px-32">
        <HeroSection />
        <OurLatestCreation />
        <AboutOurApps />
        <GetInTouch />
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default LandingLayout;