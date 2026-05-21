import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HiMenuAlt4 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const links = [
  { name: "Home", href: "#hero" },
  { name: "About", href: "#about" },
  { name: "Education", href: "#education" },
  { name: "My Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

export default function NavBar() {
  const containerRef = useRef(null);
  const navShellRef = useRef(null);
  const menuRef = useRef(null);
  const menuPathRef = useRef(null);
  const menuLogoRef = useRef(null);
  const menuIconRef = useRef(null);
  const closeIconRef = useRef(null);
  const infoItemsRef = useRef([]);
  const linkCharsRef = useRef([]);

  const isOpenRef = useRef(false);
  const isAnimatingRef = useRef(false);
  const hasHeroEnteredRef = useRef(false);
  const openTl = useRef(null);
  const closeTl = useRef(null);
  const pendingScrollRef = useRef(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const svgWidth = 1131;
  const svgHeight = 861;
  const svgCenterX = svgWidth / 2;

  const OPEN_HIDDEN = `M${svgWidth},0 Q${svgCenterX},0 0,0 L0,0 L${svgWidth},0 z`;
  const OPEN_BULGE = `M${svgWidth},345 Q${svgCenterX},620 0,345 L0,0 L${svgWidth},0 z`;
  const OPEN_FULL = `M${svgWidth},${svgHeight} Q${svgCenterX},${svgHeight} 0,${svgHeight} L0,0 L${svgWidth},0 z`;

  const CLOSE_START = `M${svgWidth},0 Q${svgCenterX},0 0,0 L0,${svgHeight} L${svgWidth},${svgHeight} z`;
  const CLOSE_BULGE = `M${svgWidth},350 Q${svgCenterX},130 0,350 L0,${svgHeight} L${svgWidth},${svgHeight} z`;
  const CLOSE_HIDDEN = `M${svgWidth},${svgHeight} Q${svgCenterX},${svgHeight} 0,${svgHeight} L0,${svgHeight} L${svgWidth},${svgHeight} z`;

  useGSAP(
    () => {
      const menu = menuRef.current;
      const menuPath = menuPathRef.current;
      const menuLogo = menuLogoRef.current;
      const closeIcon = closeIconRef.current;
      const infoItems = infoItemsRef.current;
      const linkChars = linkCharsRef.current;

      gsap.set(navShellRef.current, {
        autoAlpha: 0,
        y: -18,
        pointerEvents: "none",
      });

      gsap.set(menuPath, { attr: { d: OPEN_HIDDEN } });
      gsap.set(menuLogo, { opacity: 0 });
      gsap.set(closeIcon, { opacity: 0, scale: 0.9 });
      gsap.set(infoItems, { opacity: 0, y: 0 });
      gsap.set(linkChars, { opacity: 0, x: "750%" });

      const showNav = () => {
        hasHeroEnteredRef.current = true;

        gsap.to(navShellRef.current, {
          autoAlpha: 1,
          y: 0,
          pointerEvents: "auto",
          duration: 0.7,
          ease: "power3.out",
        });
      };

      const hideNav = () => {
        gsap.to(navShellRef.current, {
          autoAlpha: 0,
          y: -18,
          pointerEvents: "none",
          duration: 0.45,
          ease: "power2.out",
        });
      };

      window.addEventListener("portfolio:hero-ready", showNav);

      const aboutSection = document.querySelector(".about");

      const aboutTrigger = aboutSection
        ? ScrollTrigger.create({
            trigger: aboutSection,
            start: "top 92%",
            onEnter: hideNav,
            onLeaveBack: () => {
              if (hasHeroEnteredRef.current) showNav();
            },
          })
        : null;

      openTl.current = gsap.timeline({
        paused: true,
        onComplete: () => {
          isAnimatingRef.current = false;
        },
      });

      openTl.current
        .to(menuPath, {
          duration: 0.5,
          attr: { d: OPEN_BULGE },
          ease: "power4.in",
        })
        .to(menuPath, {
          duration: 0.5,
          attr: { d: OPEN_FULL },
          ease: "power4.out",
        })
        .to(
          menuLogo,
          {
            duration: 0.1,
            opacity: 1,
            ease: "none",
          },
          "-=0.75"
        )
        .to(
          infoItems,
          {
            duration: 0.75,
            opacity: 1,
            ease: "power3.out",
            stagger: 0.075,
          },
          "-=0.35"
        )
        .to(
          linkChars,
          {
            duration: 1.5,
            opacity: 1,
            x: "0%",
            ease: "elastic.out(1, 0.25)",
            stagger: 0.01,
          },
          0.45
        );

      closeTl.current = gsap.timeline({
        paused: true,
        onComplete: () => {
          menu.classList.remove("pointer-events-auto");
          menu.classList.add("pointer-events-none");

          gsap.set(menuPath, { attr: { d: OPEN_HIDDEN } });
          gsap.set(menuLogo, { opacity: 0 });
          gsap.set(infoItems, { opacity: 0, y: 100 });
          gsap.set(linkChars, { opacity: 0, x: "750%" });

          isAnimatingRef.current = false;

          // Scroll to the section the user clicked after menu closes
          if (pendingScrollRef.current) {
            const target = document.querySelector(pendingScrollRef.current);
            if (target) target.scrollIntoView({ behavior: "smooth" });
            pendingScrollRef.current = null;
          }
        },
      });

      closeTl.current
        .to(menuLogo, {
          duration: 0.3,
          opacity: 0,
        })
        .to(
          linkChars,
          {
            duration: 0.25,
            opacity: 0,
            ease: "none",
          },
          "<"
        )
        .to(
          infoItems,
          {
            duration: 0.3,
            opacity: 0,
          },
          "<"
        )
        .to(
          menuPath,
          {
            duration: 0.5,
            attr: { d: CLOSE_BULGE },
            ease: "power3.in",
          },
          "<"
        )
        .to(menuPath, {
          duration: 0.5,
          attr: { d: CLOSE_HIDDEN },
          ease: "power3.out",
        });

      return () => {
        window.removeEventListener("portfolio:hero-ready", showNav);
        aboutTrigger?.kill();
        openTl.current?.kill();
        closeTl.current?.kill();
      };
    },
    { scope: containerRef }
  );

  const openMenu = () => {
    const menu = menuRef.current;

    menu.classList.remove("pointer-events-none");
    menu.classList.add("pointer-events-auto");

    gsap.to(menuIconRef.current, {
      duration: 0.25,
      opacity: 0,
      scale: 0.9,
      ease: "none",
    });

    gsap.to(closeIconRef.current, {
      duration: 0.25,
      opacity: 1,
      scale: 1,
      ease: "none",
      delay: 0.25,
    });

    openTl.current?.restart();
  };

  const closeMenu = () => {
    gsap.set(menuPathRef.current, { attr: { d: CLOSE_START } });

    gsap.to(closeIconRef.current, {
      duration: 0.3,
      opacity: 0,
      scale: 0.9,
      ease: "none",
    });

    gsap.to(menuIconRef.current, {
      duration: 0.3,
      opacity: 1,
      scale: 1,
      ease: "none",
      delay: 0.25,
    });

    closeTl.current?.restart();
  };

  const handleNavLinkClick = (e, href) => {
    e.preventDefault();
    if (!isOpenRef.current) return;

    // Store target so closeTl onComplete can scroll to it
    pendingScrollRef.current = href;

    isAnimatingRef.current = true;
    isOpenRef.current = false;
    setIsMenuOpen(false);
    closeMenu();
  };

  const handleToggle = () => {
    if (isAnimatingRef.current) return;

    isAnimatingRef.current = !isOpenRef.current;
    isOpenRef.current = !isOpenRef.current;

    setIsMenuOpen(isOpenRef.current);

    if (isOpenRef.current) {
      openMenu();
    } else {
      closeMenu();
    }
  };

  return (
    <div ref={containerRef} className="font-googleSans text-[#222225]">
      <nav className="pointer-events-none fixed left-0 top-0 z-[999] h-full w-full">
        <div
          ref={navShellRef}
          className="pointer-events-auto absolute left-1/2 top-4 z-[100] flex h-14 w-[min(86vw,220px)] -translate-x-1/2 items-center justify-between rounded-[14px] border border-white/45 bg-[#eee7d8]/90 px-5 text-[#1e1e1d] shadow-[0_18px_45px_rgba(36,29,12,0.18)] backdrop-blur-md max-[700px]:top-3 max-[700px]:h-12 max-[700px]:px-4"
        >
          <a
            href="#hero"
            aria-label="Home"
            onClick={(e) => {
              e.preventDefault();
              const t = document.querySelector("#hero");
              if (t) t.scrollIntoView({ behavior: "smooth" });
              if (isOpenRef.current) {
                isOpenRef.current = false;
                setIsMenuOpen(false);
                closeMenu();
              }
            }}
            className="font-serif text-lg font-black uppercase leading-none tracking-[-0.04em] max-[700px]:text-base"
          >
            Portfolio
          </a>

          <div className="flex items-center">
  <button
    type="button"
    onClick={handleToggle}
    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
    aria-expanded={isMenuOpen}
    className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full p-0 text-[#222225] transition-colors duration-300 hover:bg-black/5 max-[700px]:h-9 max-[700px]:w-9"
  >
    <HiMenuAlt4
      ref={menuIconRef}
      className="absolute text-[1.7rem] text-[#222225]"
      aria-hidden="true"
    />

    <IoClose
      ref={closeIconRef}
      className="absolute text-[1.85rem] text-[#222225] opacity-0"
      aria-hidden="true"
    />
  </button>
</div>
        </div>

        <div
          ref={menuRef}
          className="pointer-events-none absolute left-0 top-0 z-10 flex h-svh w-full gap-8 p-10 text-[#222225] max-[1000px]:flex-col-reverse"
        >
          <svg
            className="pointer-events-none absolute left-0 top-0 -z-10 h-full w-full"
            viewBox="0 0 1131 861"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              ref={menuPathRef}
              fill="#eee7d8"
              d="M1131,0 Q565.5,0 0,0 L0,0 L1131,0 z"
            />
          </svg>

          <a
            ref={menuLogoRef}
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              const t = document.querySelector("#hero");
              if (t) t.scrollIntoView({ behavior: "smooth" });
              if (isOpenRef.current) {
                isOpenRef.current = false;
                setIsMenuOpen(false);
                closeMenu();
              }
            }}
            aria-label="Home"
            className="absolute left-8 top-8 block font-serif text-2xl font-black uppercase tracking-[-0.04em] text-[#222225] opacity-0"
          >
        
          </a>

          <div className="flex flex-1 flex-col justify-end">
            {[
              { type: "p", text: "Get in touch" },
              { type: "h3", text: "aprapyarana@gmail.com" },
              { type: "button", text: "Download CV" },
              { type: "space", text: "" },
              { type: "h6", text: "Putalisadak" },
              { type: "h6", text: "Kathmandu" },
            ].map((item, index) => {
              if (item.type === "space") return <br key={index} />;

              const commonProps = {
                ref: (el) => {
                  if (el) infoItemsRef.current[index] = el;
                },
              };

              if (item.type === "p") {
                return (
                  <p
                    key={index}
                    {...commonProps}
                    className="mb-4 font-googleSans text-[0.7rem] font-semibold uppercase tracking-[0.25rem] text-[#b17808] will-change-transform"
                  >
                    {item.text}
                  </p>
                );
              }

              if (item.type === "h3") {
                return (
                  <h3
                    key={index}
                    {...commonProps}
                    className="font-googleSans text-[clamp(1.5rem,3vw,3rem)] font-[450] leading-[1.35] tracking-[-0.02em] will-change-transform"
                  >
                    {item.text}
                  </h3>
                );
              }

              if (item.type === "button") {
                return (
                  <a
                    key={index}
                    {...commonProps}
                    href="/Aprapya-CV.pdf"
                    download
                    className="mt-4 w-max cursor-pointer rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:scale-[1.03] hover:bg-[#111]"
                  >
                    Download CV
                  </a>
                );
              }

              return (
                <h6
                  key={index}
                  {...commonProps}
                  className="font-googleSans text-[clamp(1rem,1.25vw,1.5rem)] font-[450] leading-[1.35] tracking-[-0.02em] will-change-transform"
                >
                  {item.text}
                </h6>
              );
            })}
          </div>

          <div className="flex flex-1 flex-col justify-end max-[1000px]:flex-[1.5]">
            {links.map((link, linkIndex) => (
              <a
                href={link.href}
                key={link.name}
                onClick={(e) => handleNavLinkClick(e, link.href)}
                className="block w-max overflow-visible font-boldonse text-[clamp(2.5rem,5vw,5rem)] leading-[1.35] text-[#222225] no-underline"
              >
                {link.name.split("").map((char, charIndex) => (
                  <span
                    key={`${link.name}-${charIndex}`}
                    ref={(el) => {
                      if (el) {
                        linkCharsRef.current[
                          linkIndex * 30 + charIndex
                        ] = el;
                      }
                    }}
                    className="inline-block will-change-transform"
                  >
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
              </a>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}