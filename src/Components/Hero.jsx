import { useRef, useEffect } from "react";
import img1 from "../assets/about-pics/img1.webp";
import img2 from "../assets/about-pics/img2.webp";
import img3 from "../assets/about-pics/img3.webp";
import img4 from "../assets/about-pics/img4.webp";
import img5 from "../assets/about-pics/img5.webp";
import img6 from "../assets/about-pics/img6.webp";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

const aboutImages = [img1, img2, img3, img4, img5, img6];

// ── Desktop-only decorative columns ────────────────────────────────
// imgMap: maps slot numbers (1–4) to an index in aboutImages
function AboutColumn({ id, className = "", remove = [], imgMap = {} }) {
  return (
    <div
      id={id}
      className={`relative h-[125%] flex flex-col justify-around will-change-transform ${className}`}
    >
      {[1, 2, 3, 4].map((item) => {
        if (remove.includes(item)) return null;

        return (
          <div
            key={item}
            className="w-[125px] h-[125px] rounded-[10px] overflow-hidden"
          >
            <img
              src={aboutImages[imgMap[item] ?? 0]}
              alt=""
              className="w-full h-full object-cover"
              style={imgMap[item] === 1 ? { objectPosition: "top" } : undefined}
            />
          </div>
        );
      })}
    </div>
  );
}

const isMobile = () => window.innerWidth < 1000;

export default function Hero() {
  const container = useRef(null);

  useGSAP(
    () => {
      const mobile = isMobile();

      // ── HERO TEXT ANIMATION ───────────────────────────────────────
      let heroCopySplit = null;

      if (!mobile) {
        // Desktop only → word reveal
        heroCopySplit = SplitText.create(".hero-copy h3", {
          type: "words",
          wordsClass: "word",
        });

        gsap.set(heroCopySplit.words, {
          opacity: 0,
        });
      } else {
        // Mobile only → wait for preloader to finish, then fade + slide up
        const h3El = document.querySelector(".hero-copy h3");

        const onHeroReady = () => {
          gsap.to(h3El, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
            delay: 0.15,
          });
          window.removeEventListener("portfolio:hero-ready", onHeroReady);
        };

        window.addEventListener("portfolio:hero-ready", onHeroReady);

        return () => {
          window.removeEventListener("portfolio:hero-ready", onHeroReady);
        };
      }

      // ── DESKTOP ONLY HERO PIN + SCROLL ───────────────────────────
      if (!mobile) {
        ScrollTrigger.create({
          trigger: ".hero",
          start: "top top",
          end: `+=${window.innerHeight * 3.5}px`,
          pin: true,
          pinSpacing: false,
          scrub: 1,

          onUpdate: (self) => {
            const progress = self.progress;

            // Hide title
            gsap.to(".hero-title", {
              opacity: progress >= 0.71 ? 0 : 1,
              duration: 0.5,
              ease: "power2.out",
            });

            // Parallax movement
            const heroHeaderProgress = Math.min(progress * 0.29, 1);

            gsap.set(".hero-header", {
              yPercent: -heroHeaderProgress * 100,
            });

            gsap.set(".hero-copy", {
              yPercent: -heroHeaderProgress * 75,
            });

            // Word reveal
            if (heroCopySplit) {
              const heroWordsProgress = gsap.utils.clamp(
                0,
                1,
                (progress - 0.16) / 0.42
              );

              const totalWords = heroCopySplit.words.length;

              heroCopySplit.words.forEach((word, i) => {
                const wordStart = i / totalWords;
                const wordEnd = (i + 1) / totalWords;

                gsap.set(word, {
                  opacity: gsap.utils.clamp(
                    0,
                    1,
                    (heroWordsProgress - wordStart) /
                      (wordEnd - wordStart)
                  ),
                });
              });
            }

            // Fade out copy — desktop only, safe because mobile never enters this block
            gsap.set(".hero-copy", {
              opacity: gsap.utils.clamp(
                0,
                1,
                1 - (progress - 0.58) / 0.2
              ),
            });

            // Image shrink
            const heroImgProgress = gsap.utils.clamp(
              0,
              1,
              (progress - 0.71) / 0.29
            );

            gsap.set(".hero-img", {
              width: gsap.utils.interpolate(
                window.innerWidth,
                150,
                heroImgProgress
              ),

              height: gsap.utils.interpolate(
                window.innerHeight,
                150,
                heroImgProgress
              ),

              borderRadius: gsap.utils.interpolate(
                0,
                10,
                heroImgProgress
              ),
            });
          },
        });
      }

      // ── ABOUT SECTION ENTRANCE ───────────────────────────────────
      const myAboutEl = document.querySelector(".my-about");

      gsap.set(myAboutEl, {
        opacity: 0,
        y: 50,
      });

      gsap.to(myAboutEl, {
        opacity: 1,
        y: 0,
        stagger: 0.05,
        ease: "power3.out",
        scrollTrigger: {
          trigger: myAboutEl,
          start: "top bottom",
          end: "top 60%",
          scrub: true,
        },
      });

      // ── ABOUT TEXT REVEAL ────────────────────────────────────────


      // ── DESKTOP ONLY IMAGE PARALLAX ──────────────────────────────
      if (!mobile) {
        const aboutImgCols = [
          { id: "#about-imgs-col-1", y: -500 },
          { id: "#about-imgs-col-2", y: -250 },
          { id: "#about-imgs-col-3", y: -250 },
          { id: "#about-imgs-col-4", y: -500 },
        ];

        aboutImgCols.forEach(({ id, y }) => {
          gsap.to(id, {
            y,

            scrollTrigger: {
              trigger: ".about",
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        });
      }

      return () => {
        heroCopySplit?.revert();
      };
    },

    { scope: container, dependencies: [] }
  );

  useEffect(() => {
    const aboutCopyEl = document.querySelector(".about-copy");
    if (!aboutCopyEl) return;

    const aboutSplit = new SplitText(aboutCopyEl, {
      type: "words",
      wordsClass: "word",
    });

    console.log("useEffect aboutSplit words:", aboutSplit.words.length);

    if (aboutSplit.words.length === 0) return;

    gsap.set(aboutSplit.words, { opacity: 0.1 });

    const tween = gsap.to(aboutSplit.words, {
      opacity: 1,
      stagger: 0.03,
      ease: "power2.out",
      scrollTrigger: {
        trigger: aboutCopyEl,
        start: "top bottom",
        end: "bottom center",
        scrub: true,
      },
    });

    return () => {
      tween.kill();
      aboutSplit.revert();
    };
  }, []);

  return (
    <main ref={container} className="w-full min-h-screen bg-[#f6efd9]">
      {/* ── HERO SECTION ─────────────────────────────────────────── */}
      <section
        id="hero"
        className="hero relative w-full h-screen bg-[#f6efd9] overflow-hidden"
      >
        {/* HERO IMAGE */}
        <div className="hero-img absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 overflow-hidden will-change-[transform,opacity,width,height]">
          <img
            src="/Assets/hero.webp"
            alt="hero"
            className="w-full h-full object-cover object-[82%_70%]"
          />
        </div>

        {/* HERO TITLE */}
        <div className="hero-header absolute w-full h-full p-16 text-white flex items-end will-change-transform max-[1000px]:p-8">
          <h1
            style={{ fontFamily: "HeroFont" }}
            className="
              hero-title
              uppercase
              font-bold
              leading-[1]
              tracking-[-0.08rem]
              text-[#FEC428]
              w-3/4
              text-[300px]
              pb-19
              -mt-[100px]
              md:mt-0

              max-[1000px]:w-full
              max-[1000px]:text-[clamp(5rem,22vw,8.5rem)]
              max-[1000px]:leading-[1]
              max-[1000px]:tracking-[-0.08rem]
              max-[1000px]:mb-20
              max-[1000px]:pb-20
            "
          >
            Aprapya <br /> B. RANA
          </h1>
        </div>

        {/* HERO COPY */}
        <div
          className="
            hero-copy
            absolute
            w-full
            h-full
            p-16
            pb-24
            text-white
            flex
            items-end
            will-change-transform

            max-[1000px]:p-8
            max-[1000px]:pb-32
          "
        >
          <h3
            style={{ fontFamily: "apfel", opacity: 0, transform: "translateY(20px)" }}
            className="
              font-normal
              tracking-[-0.05rem]
              leading-tight
              text-[#F5E6B3]
              w-1/2
              text-[2.7rem]
              md:-translate-y-7

              max-[1000px]:w-full
              max-[1000px]:text-[clamp(1rem,4.2vw,1.4rem)]
              max-[1000px]:leading-relaxed
              max-[1000px]:tracking-normal
              max-[1000px]:mb-1
            "
          >
            Just a frontend developer specializing in
            <br className="hidden min-[1000px]:block" />
            React, Tailwind CSS and GSAP
          </h3>
        </div>
      </section>

      {/* ── ABOUT SECTION ────────────────────────────────────────── */}
      <section
        id="about"
        className="
          about
          relative
          w-full
          h-screen
          mt-[275svh]

          max-[1000px]:mt-0

          flex
          items-center
          justify-center
          text-center
        "
      >
        {/* DESKTOP IMAGE COLUMNS */}
        <div className="about-images w-full h-full flex justify-between items-center p-16 max-[1000px]:hidden">
          <AboutColumn
            id="about-imgs-col-1"
            remove={[1, 3, 4]}
            className="translate-y-[1000px]"
            imgMap={{ 2: 0 }}
          />

          <AboutColumn
            id="about-imgs-col-2"
            remove={[2, 4]}
            className="-translate-x-[225px] translate-y-[500px]"
            imgMap={{ 1: 1, 3: 2 }}
          />

          <AboutColumn
            id="about-imgs-col-3"
            remove={[2, 3]}
            className="translate-x-0 translate-y-[500px]"
            imgMap={{ 1: 3, 4: 4 }}
          />

          <AboutColumn
            id="about-imgs-col-4"
            remove={[1, 3, 4]}
            className="translate-y-[1000px]"
            imgMap={{ 2: 5 }}
          />
        </div>

        {/* MOBILE IMAGE */}
        <div className="hidden max-[1000px]:block absolute top-[12%] left-1/2 -translate-x-1/2 pointer-events-none select-none opacity-30">
          <div className="w-[120px] h-[120px] rounded-[12px] overflow-hidden shadow-xl">
            <img
              src={aboutImages[0]}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* ABOUT TEXT */}
        <div
          className="
            about-header
            absolute
            top-1/2
            left-1/2
            -translate-x-1/2
            -translate-y-1/2
            text-[#7b021d]

            w-[40%]
            max-[1000px]:w-[88%]
          "
        >
          <h1
            className="
              my-about
              font-bold
              font-yatra
              pb-2
              text-2xl

              max-[1000px]:text-sm
              max-[1000px]:tracking-widest
              max-[1000px]:uppercase
            "
          >
            ABOUT ME
          </h1>

          <h3
            className="
              about-copy
              font-normal
              tracking-[-0.05rem]
              leading-snug
              text-[#7b021d]

              text-[3rem]
              md:text-[2rem]

              max-[1000px]:text-[clamp(1rem,4vw,1.35rem)]
            "
          >
            Hi, I'm Aprapya Bikram Rana, a frontend developer
            specializing in React with a strong focus on building
            responsive and dynamic user interfaces. I work with
            Tailwind CSS for efficient styling. I'm passionate about
            creating smooth, interactive web experiences enhanced with
            GSAP animations.
          </h3>
        </div>
      </section>
    </main>
  );
}