import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function EducationTimeline() {
  const sectionRef = useRef(null);

  const eyebrowRef = useRef(null);
  const headingRef = useRef(null);
  const introRef = useRef(null);

  const lineRef = useRef(null);

  const itemsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // =========================
      // INITIAL STATES
      // =========================

      gsap.set(
        [eyebrowRef.current, headingRef.current, introRef.current],
        {
          opacity: 0,
          y: 40,
        }
      );

      gsap.set(lineRef.current, {
        scaleY: 0,
        transformOrigin: "top center",
      });

      gsap.set(itemsRef.current, {
        opacity: 0,
        y: 80,
        scale: 0.95,
      });

      // =========================
      // MASTER TIMELINE
      // =========================

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=250%",
          scrub: true,
          pin: true,
          anticipatePin: 1,
        },
      });

      // =========================
      // SECTION SCALE EFFECT
      // =========================

      tl.to(sectionRef.current, {
        scale: 0.94,
        borderRadius: "40px",
        ease: "none",
        duration: 1,
      });

      // =========================
      // HEADING ANIMATION
      // =========================

      tl.to(
        eyebrowRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        0.15
      );

      tl.to(
        headingRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
        },
        0.22
      );

      tl.to(
        introRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        0.3
      );

      // =========================
      // LINE GROW
      // =========================

      tl.to(
        lineRef.current,
        {
          scaleY: 1,
          duration: 0.8,
          ease: "power2.out",
        },
        0.45
      );

      // =========================
      // CARDS REVEAL
      // =========================

      tl.to(
        itemsRef.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.2,
          duration: 0.8,
          ease: "power3.out",
          force3D: true,
        },
        0.55
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const education = [
    {
      year: "2020 - 2022",
      title: "Trinity International College",
      location: "Dillibazar, Kathmandu",
      description: "Graduate, Computer Science",
      result: "CGPA: 3.23",
      side: "left",
    },
    {
      year: "2022 - Present",
      title: "Everest College",
      location: "Thapathali, Kathmandu",
      description: "Bachelor's Degree",
      result: "Currently pursuing",
      side: "right",
    },
  ];

  return (
    <section
    id="education"
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-[#151409] px-6 py-24 text-[#fff8df] sm:px-10 lg:px-20 "
    >
      {/* BACKGROUND GLOW */}
      <div className="absolute -left-24 top-24 h-80 w-80 rounded-full bg-[#ffc225]/10 blur-3xl" />

      <div className="absolute -right-24 bottom-16 h-96 w-96 rounded-full bg-[#6b4a16]/25 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* ========================= */}
        {/* HEADING */}
        {/* ========================= */}

        <div className="mb-20 text-center">
          <p
            ref={eyebrowRef}
            className="mb-3 font-mono text-sm uppercase tracking-[0.38em] text-[#ffc225]"
          >
            My Journey
          </p>

          <h2
            ref={headingRef}
            className="font-chillax text-5xl font-black tracking-tight text-[#fff1b8] sm:text-6xl lg:text-7xl "
          >
            Education
          </h2>

          <p
            ref={introRef}
            className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#d7c487] sm:text-lg"
          >
            A glimpse into my learning journey, highlighting the
            institutions, milestones, and academic experiences that
            shaped my foundation.
          </p>
        </div>

        {/* ========================= */}
        {/* TIMELINE */}
        {/* ========================= */}

        <div className="relative mx-auto grid max-w-5xl grid-cols-1 gap-12 md:grid-cols-[1fr_120px_1fr] md:gap-6">
          {/* CENTER LINE */}

          <div className="absolute left-5 top-2 h-[calc(100%-1rem)] w-px bg-[#ffc225]/15 md:left-1/2 md:-translate-x-1/2">
            <div
              ref={lineRef}
              className="h-full w-full rounded-full bg-gradient-to-b from-[#fff0a3] via-[#ffc225] to-[#7a4d12] shadow-[0_0_34px_rgba(255,194,37,0.7)]"
            />
          </div>

          {education.map((item, index) => (
            <React.Fragment key={item.year}>
              {item.side === "right" && (
                <div className="hidden md:block" />
              )}

              {/* CARD */}

              <div
                ref={(el) => (itemsRef.current[index] = el)}
                className={`relative ml-14 rounded-3xl border border-[#ffc225]/20 bg-[#211b0e]/75 p-7 shadow-2xl shadow-black/45 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-[#ffc225]/55 hover:bg-[#2b220f]/85 md:ml-0 ${
                  item.side === "left"
                    ? "md:col-start-1 md:text-right"
                    : "md:col-start-3 md:text-left"
                }`}
              >
                {/* MOBILE DOT */}

                <div className="absolute -left-[43px] top-8 h-4 w-4 rounded-full border-4 border-[#151409] bg-[#ffc225] shadow-[0_0_24px_rgba(255,194,37,0.95)] md:hidden" />

                {/* DESKTOP DOT */}

                <div
                  className={`absolute top-8 hidden h-5 w-5 rounded-full border-4 border-[#151409] bg-[#ffc225] shadow-[0_0_28px_rgba(255,194,37,0.95)] md:block ${
                    item.side === "left"
                      ? "-right-[71px]"
                      : "-left-[71px]"
                  }`}
                />

                {/* CONTENT */}

                <span className="inline-flex rounded-full border border-[#ffc225]/35 bg-[#ffc225]/10 px-4 py-1 font-Kensington text-sm text-[#ffd66b]">
                  {item.year}
                </span>

                <h3 className="mt-5 font-Kensington text-3xl font-semibold tracking-tight text-[#fff4c7] sm:text-4xl">
                  {item.title}
                </h3>

                <p className="mt-3 text-lg font-medium text-[#e7d8a3]">
                  {item.location}
                </p>

                <p className="mt-4 text-sm uppercase tracking-[0.22em] text-[#a99455]">
                  {item.description}
                </p>

                <p className="mt-2 text-base text-[#ffc225]">
                  {item.result}
                </p>
              </div>

              {item.side === "left" && (
                <div className="hidden md:block" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}