import { createContext, useContext, useEffect, useRef } from "react";
import LocomotiveScroll from "locomotive-scroll";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LocoContext = createContext(null);

export function useLocomotive() {
  return useContext(LocoContext);
}

export default function LocomotiveProvider({ children }) {
  const locoRef = useRef(null);

  useEffect(() => {
    // v5: just instantiate — no container element needed,
    // it attaches to the window/native scroll automatically.
    locoRef.current = new LocomotiveScroll({
      lenisOptions: {
        lerp: 0.08,         // smoothness (0 = instant, 1 = very slow)
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.5,
        infinite: false,
      },
    });

    // v5 uses native scroll internally, so ScrollTrigger works
    // without a proxy — just refresh after init.
    ScrollTrigger.refresh();

    return () => {
      locoRef.current?.destroy();
    };
  }, []);

  return (
    <LocoContext.Provider value={locoRef}>
      {children}
    </LocoContext.Provider>
  );
}