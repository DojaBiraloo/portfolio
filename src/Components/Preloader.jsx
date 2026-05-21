import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import Logo from "../assets/svg/logo-light.svg";
import Hero from "./Hero.jsx";

gsap.registerPlugin(useGSAP, SplitText, CustomEase);

CustomEase.create("hop", "0.9, 0, 0.1, 1");
CustomEase.create("glide", "0.8, 0, 0.2, 1");

export default function GsapPreloader() {
  const rootRef = useRef(null);
  const preloaderBtnRef = useRef(null);
  const btnOutlineTrackRef = useRef(null);
  const btnOutlineProgressRef = useRef(null);
  const preloaderCompleteRef = useRef(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);

  useGSAP(
    () => {
      const btnOutlineTrack = btnOutlineTrackRef.current;
      const btnOutlineProgress = btnOutlineProgressRef.current;

      if (!btnOutlineTrack || !btnOutlineProgress) return;

      const svgPathLength = btnOutlineTrack.getTotalLength();

      gsap.set([btnOutlineTrack, btnOutlineProgress], {
        strokeDasharray: svgPathLength,
        strokeDashoffset: svgPathLength,
      });

      const splitInstances = [];

      rootRef.current.querySelectorAll(".preloader p").forEach((p) => {
        splitInstances.push(
          new SplitText(p, {
            type: "lines",
            linesClass: "line",
            mask: "lines",
          }),
        );
      });

      splitInstances.push(
        new SplitText(".hero-title", {
          type: "words",
          wordsClass: "word",
          mask: "words",
        }),
      );

      // Smooth hero initial state
      gsap.set(".hero", {
        scale: 0.82,
        opacity: 0,
        filter: "blur(12px)",
        yPercent: 8,
        transformOrigin: "center center",
        willChange: "transform, opacity, filter",
      });

      gsap.set(".hero-header", {
        yPercent: 20,
        opacity: 0,
      });

      gsap.set(".hero-copy h3", {
        autoAlpha: 0,
        y: 20,
      });

      gsap.set(".line, .word", { y: "100%" });

      const introTl = gsap.timeline({ delay: 1 });

      introTl
        .to(".preloader .p-row .line", {
          y: "0%",
          duration: 0.75,
          ease: "power3.out",
          stagger: 0.1,
        })
        .to(
          btnOutlineTrack,
          {
            strokeDashoffset: 0,
            duration: 2,
            ease: "hop",
          },
          "<",
        )
        .to(
          ".pbc-svg-strokes svg",
          {
            rotation: 270,
            duration: 2,
            ease: "hop",
          },
          "<",
        );

      const progressStops = [0.2, 0.25, 0.85, 1].map((base, i) => {
        if (i === 3) return 1;
        return base + (Math.random() - 0.5) * 0.1;
      });

      progressStops.forEach((stop, i) => {
        introTl.to(btnOutlineProgress, {
          strokeDashoffset: svgPathLength - svgPathLength * stop,
          duration: 0.75,
          ease: "glide",
          delay: i === 0 ? 0.3 : 0.3 + Math.random() * 0.2,
        });
      });

      introTl
        .to(
          "#pbc-logo",
          {
            opacity: 0,
            duration: 0.35,
            ease: "power1.out",
          },
          "-=0.25",
        )
        .to(
          preloaderBtnRef.current,
          {
            scale: 0.9,
            duration: 1.5,
            ease: "hop",
          },
          "-=0.5",
        )
        .to(
          "#pbc-label .line",
          {
            y: "0%",
            duration: 0.75,
            ease: "power3.out",
            onComplete: () => {
              preloaderCompleteRef.current = true;
            },
          },
          "-=0.75",
        );

      return () => {
        splitInstances.forEach((split) => split.revert());
      };
    },
    { scope: rootRef },
  );

  const handlePreloaderClick = () => {
    if (!preloaderCompleteRef.current) return;

    preloaderCompleteRef.current = false;

    const btnOutlineTrack = btnOutlineTrackRef.current;
    const btnOutlineProgress = btnOutlineProgressRef.current;
    const svgPathLength = btnOutlineTrack.getTotalLength();

    const exitTl = gsap.timeline();

    exitTl
      .to(".preloader", {
        scale: 0.75,
        duration: 1.25,
        ease: "hop",
      })
      .to(
        [btnOutlineTrack, btnOutlineProgress],
        {
          strokeDashoffset: -svgPathLength,
          duration: 1.25,
          ease: "hop",
        },
        "<",
      )
      .to(
        "#pbc-label .line",
        {
          y: "-100%",
          duration: 0.75,
          ease: "power3.out",
        },
        "-=1.25",
      )
      .to(
        "#pbc-outro-label .line",
        {
          y: "0%",
          duration: 0.75,
          ease: "power3.out",
        },
        "-=0.75",
      )
      .to(".preloader", {
        clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
        duration: 1.5,
        ease: "hop",
      })
      .to(
        ".preloader-revealer",
        {
          clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
          duration: 1.5,
          ease: "hop",
          onComplete: () => {
            window.scrollTo(0, 0);
            document.documentElement.style.overflow = "";
            document.body.style.overflow = "";
            setIsHidden(true);
          },
        },
        "-=1.45",
      )

      // Smooth hero popout animation
      .to(
        ".hero",
        {
          scale: 1,
          opacity: 1,
          filter: "blur(0px)",
          yPercent: 0,
          duration: 1.8,
          ease: "expo.out",
        },
        "-=0.6",
      )

      // Header reveal
      .to(
        ".hero-header",
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
        },
        "-=1.4",
      )

      // Hero copy h3 reveal — must be here because Preloader owns the hero's initial state
      .to(
        ".hero-copy h3",
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
        },
        "-=1.1",
      )

      // Smooth word reveal
      .to(
        ".hero-title .word",
        {
          y: "0%",
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          stagger: 0.035,
          onComplete: () => {
            window.dispatchEvent(new Event("portfolio:hero-ready"));
          },
        },
        "-=1.5",
      );
  };

  return (
    <main
      ref={rootRef}
      className="relative min-h-svh overflow-hidden bg-black text-white"
    >
      {/* Background Grid */}
      <div className="fixed inset-0 z-0 flex h-svh w-full flex-col justify-between bg-white text-neutral-500">
        <div className="flex w-full justify-between p-6">
          <div />
          <div />
          <div />
          <div />
          <div />
        </div>

        <div className="flex w-full items-end justify-between p-6">
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
        </div>
      </div>

      {/* Preloader */}
      {!isHidden && (
        <div className="preloader fixed inset-0 z-20 flex h-svh w-full flex-col justify-between bg-black text-white [clip-path:polygon(0%_0%,100%_0%,100%_100%,0%_100%)] will-change-[transform,clip-path]">
          <div className="p-row flex w-full justify-between p-6">
            <p className="font-mono text-xs font-medium uppercase leading-none">
              Initiating
            </p>
          </div>

          <div className="p-row flex w-full justify-between p-6">
            <div className="flex items-end gap-24">
              <div>
                <p className="font-mono text-xs font-medium uppercase leading-none">
                  Phase 01
                </p>
                <p className="font-mono text-xs font-medium uppercase leading-none">
                  Sequence
                </p>
              </div>

              <div>
                <p className="font-mono text-xs font-medium uppercase leading-none">
                  Signal Scan
                </p>
                <p className="font-mono text-xs font-medium uppercase leading-none">
                  07 Layers
                </p>
              </div>
            </div>

            <div>
              <p className="font-mono text-xs font-medium uppercase leading-none">
                PX-17
              </p>
            </div>
          </div>

          <button
            ref={preloaderBtnRef}
            type="button"
            onClick={handlePreloaderClick}
            aria-label="Enter site"
            className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 cursor-pointer border-0 bg-transparent p-0 text-white outline-none"
          >
            {/* <img
              id="pbc-logo"
              src={Logo}
              alt=""
              className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 object-contain"
            /> */}

            <p
              id="pbc-label"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-sm font-medium uppercase leading-none"
            >
              Engage
            </p>

            <p
              id="pbc-outro-label"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-sm font-medium uppercase leading-none"
            >
              Access Granted
            </p>

            <div className="pbc-svg-strokes absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2">
              <svg
                className="h-full w-full will-change-transform"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 100"
              >
                <circle
                  ref={btnOutlineTrackRef}
                  cx="50"
                  cy="50"
                  r="48"
                  stroke="#2b2b2b"
                  strokeWidth="1"
                />

                <circle
                  ref={btnOutlineProgressRef}
                  cx="50"
                  cy="50"
                  r="48"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </svg>
            </div>
          </button>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative z-10 min-h-svh w-full bg-black">
        <div className="preloader-revealer absolute inset-0 z-10 bg-white [clip-path:polygon(0%_0%,100%_0%,100%_100%,0%_100%)] will-change-[clip-path]" />
        <Hero />
      </section>
    </main>
  );
}