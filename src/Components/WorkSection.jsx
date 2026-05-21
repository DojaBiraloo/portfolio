import { useEffect, useMemo, useRef } from "react";
import videos from "./video";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const WorkSection = () => {
  const galleryRef = useRef(null);
  const containerRef = useRef(null);
  const titleRef = useRef(null);

  const items = useMemo(() => videos.slice(0, 4), []);

  const projectLinks = [
    "https://gsap-mojito-animated-website.vercel.app/",
    "https://gsap-spylt-ten.vercel.app/",
    "https://karma-1rxg.vercel.app/",
    "https://flowershop-gsap.vercel.app/",
  ];

  useGSAP(
    () => {
      // IMPORTANT
      // force initial hidden state BEFORE animation
      gsap.set(titleRef.current, {
        opacity: 0,
        y: 80,
      });

      // fade in animation
     gsap.to(titleRef.current, {
  opacity: 1,
  y: 0,
  duration: 1.2,
  delay: 3,
  ease: "power3.out",
  scrollTrigger: {
    trigger: containerRef.current,
    start: "top center",
    end: "bottom top",
    toggleActions: "play none none reverse",
  },
});

   gsap.set(galleryRef.current, {
        opacity: 0,
        y: 80,
      });

         gsap.to(galleryRef.current, {
  opacity: 1,
  y: 0,
  duration: 1.2,
  delay: 3.5,
  ease: "power3.out",
  scrollTrigger: {
    trigger: containerRef.current,
    start: "top center",
    end: "bottom top",
    toggleActions: "play none none reverse",
  },
});


    },
    { scope: containerRef }
  );

  useEffect(() => {
    const container = containerRef.current;
    const gallery = galleryRef.current;

    if (!container || !gallery) return;

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } =
        container.getBoundingClientRect();

      const centerX = width / 2;
      const centerY = height / 2;

      const pointerX = clientX - left;
      const pointerY = clientY - top;

      const deltaX = (centerX - pointerX) * 0.42;
      const deltaY = (centerY - pointerY) * 0.34;

      gallery.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    };

    container.addEventListener("mousemove", handleMouseMove);

    return () => {
      container.removeEventListener(
        "mousemove",
        handleMouseMove
      );
    };
  }, []);

  return (
    <section
    id="projects"
      ref={containerRef}
      className="relative h-svh w-full overflow-hidden bg-[#f6efd9] max-[700px]:h-auto max-[700px]:overflow-visible"
    >
      {/* TITLE */}
      <h1
        ref={titleRef}
        style={{ fontFamily: "HeroFont" }}
        className="
          pointer-events-none
          absolute
          left-1/2
          top-8
          z-20
          w-full
          -translate-x-1/2
          px-6
          text-center
          text-[clamp(3rem,8vw,7.5rem)]
          font-bold
          uppercase
          leading-none
          text-[#b7821f]
          drop-shadow-[0_10px_24px_rgba(94,58,15,0.18)]
          max-[700px]:top-6
        "
      >
        My Projects
      </h1>

      {/* GALLERY */}
      <div
        ref={galleryRef}
        className="
          absolute inset-0
          transition-transform
          duration-[1400ms]
          ease-[cubic-bezier(0.075,0.82,0.165,1)]
          max-[700px]:relative max-[700px]:inset-auto
          max-[700px]:flex max-[700px]:flex-col max-[700px]:items-center
          max-[700px]:gap-8 max-[700px]:px-6 max-[700px]:pt-28 max-[700px]:pb-12
        "
        style={{ transform: "translate(0,0)" }}
      >
        {items.map((item, index) => (
          <article
            key={item.id}
            className="
              work-article
              group
              absolute
              w-[clamp(290px,33vw,470px)]
              -translate-x-1/2
              -translate-y-1/2
              transition-transform
              duration-500
              ease-[cubic-bezier(0.22,1,0.36,1)]
              hover:z-10
              hover:scale-[1.04]
              max-[700px]:relative max-[700px]:w-full
              max-[700px]:translate-x-0 max-[700px]:translate-y-0
              max-[700px]:left-auto max-[700px]:top-auto
            "
            style={{
              left: item.position.left,
              top: item.position.top,
              rotate: item.position.rotate,
            }}
          >
            <a
              href={projectLinks[index]}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${item.videoName}`}
              className="
                relative
                block
                h-[clamp(210px,22vw,320px)]
                overflow-hidden
                rounded-[10px]
                bg-[#211b14]
                shadow-[0_22px_50px_rgba(88,62,29,0.22)]
                max-[700px]:h-[200px]
              "
            >
              {/* IMAGE */}
              <img
                src={item.prevImage}
                alt={item.videoName}
                className="
                  absolute
                  inset-0
                  z-[1]
                  h-full
                  w-full
                  object-cover
                  opacity-100
                  transition-opacity
                  duration-300
                  group-hover:opacity-0
                "
              />

              {/* TITLE */}
              <p
                className="
                  pointer-events-none
                  absolute
                  left-1/2
                  top-1/2
                  z-[3]
                  w-3/4
                  -translate-x-1/2
                  -translate-y-1/2
                  text-center
                  text-[32px]
                  font-semibold
                  uppercase
                  leading-none
                  text-white
                  opacity-0
                  transition-opacity
                  duration-150
                  group-hover:opacity-100
                  max-[700px]:text-[20px]
                "
              >
                {item.videoName}
              </p>

              {/* VIDEO */}
              <video
                src={item.videoSrc}
                className="
                  absolute
                  inset-0
                  z-[2]
                  h-full
                  w-full
                  scale-[1.12]
                  object-cover
                  opacity-0
                  transition-[opacity,transform]
                  duration-500
                  ease-[cubic-bezier(0.22,1,0.36,1)]
                  group-hover:scale-100
                  group-hover:opacity-100
                "
                autoPlay
                loop
                muted
                playsInline
              />
            </a>

            <p
              className="
                mt-4
                text-center
                text-[clamp(0.9rem,1.2vw,1.05rem)]
                leading-snug
                text-[#5f4420]
                max-[700px]:text-[0.9rem]
              "
            >
              {item.description}
            </p>
          </article>
        ))}
      </div>
      <style>{`
        @media (max-width: 700px) {
          .work-article {
            position: relative !important;
            left: auto !important;
            top: auto !important;
            rotate: 0deg !important;
            width: 100% !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default WorkSection;