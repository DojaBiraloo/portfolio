import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect } from "react";
import Preloader from "./Components/Preloader";
import NavBar from "./Components/NavBar";
import Experience from "./Components/Experience";
import WorkSection from "./Components/WorkSection";
import Footer from "./Components/Footer";

gsap.registerPlugin(ScrollTrigger);
gsap.config({ force3D: true, nullTargetWarn: false });
ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true });

const App = () => {

  useEffect(() => {
    const lenis = new Lenis();

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Preloader />
      <NavBar />
      <Experience />
      <WorkSection />
      <Footer />
    </div>
  );
};

export default App;