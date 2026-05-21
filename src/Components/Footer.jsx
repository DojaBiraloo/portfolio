import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// ── Lenis import removed ──────────────────────────────────────────────
// Locomotive Scroll + ScrollTrigger proxy lives in LocomotiveProvider.
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import { FaGithub, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef   = useRef(null);
  const canvasRef   = useRef(null);
  const headingRef  = useRef(null);
  const socialsRef  = useRef([]);
  const bottomRef   = useRef(null);
  const buttonRef   = useRef(null);

  useEffect(() => {
    const footer    = footerRef.current;
    const container = canvasRef.current;

    if (!footer || !container) return;

    // ── No Lenis / RAF setup here — handled at App level ─────────────

    // MOUSE
    const mouse = { x: 0, y: 0 };
    const handleMouseMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth)  *  2 - 1;
      mouse.y = (e.clientY / window.innerHeight) * -2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // SCENE
    const scene = new THREE.Scene();

    // CAMERA
    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 5);

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace  = THREE.SRGBColorSpace;
    renderer.toneMapping       = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // LIGHTS
    scene.add(new THREE.HemisphereLight(0xfff4d6, 0x3b3222, 3));

    const dirLight = new THREE.DirectionalLight(0xfff0c2, 3);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0xf6d878, 1.5);
    fillLight.position.set(-5, 2, 5);
    scene.add(fillLight);

    // MODEL
    const loader = new GLTFLoader();
    let model = null;
    const modelRotationX = 0.5;

    loader.load(
      "/banana/scene.gltf",
      (gltf) => {
        model = gltf.scene;

        model.traverse((child) => {
          if (!child.isMesh) return;
          child.castShadow    = true;
          child.receiveShadow = true;
          const mats = Array.isArray(child.material) ? child.material : [child.material];
          mats.forEach((mat) => {
            if (!mat) return;
            mat.side = THREE.DoubleSide;
            if (mat.map) {
              mat.map.colorSpace  = THREE.SRGBColorSpace;
              mat.map.anisotropy  = renderer.capabilities.getMaxAnisotropy();
            }
            mat.needsUpdate = true;
          });
        });

        // Center + scale
        const box    = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size   = box.getSize(new THREE.Vector3());
        model.position.sub(center);

        const maxDim       = Math.max(size.x, size.y, size.z);
        const visibleHeight = 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
        const scale         = (visibleHeight * 0.5) / maxDim;

        model.scale.setScalar(scale * 0.85);
        model.position.y = -0.2;
        model.rotation.x = modelRotationX;

        scene.add(model);
        ScrollTrigger.refresh();
      },
      undefined,
      (err) => console.error("GLTF ERROR:", err)
    );

    // GSAP SCROLL ANIMATIONS
    gsap.fromTo(
      headingRef.current,
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.4, ease: "power4.out",
        scrollTrigger: { trigger: footer, start: "top 80%" } }
    );

    gsap.fromTo(
      socialsRef.current,
      { y: 40, opacity: 0, scale: 0.8 },
      { y: 0, opacity: 1, scale: 1, stagger: 0.12, duration: 1,
        ease: "back.out(1.7)",
        scrollTrigger: { trigger: footer, start: "top 75%" } }
    );

    gsap.fromTo(
      buttonRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, delay: 0.2, ease: "power3.out",
        scrollTrigger: { trigger: footer, start: "top 75%" } }
    );

    gsap.fromTo(
      bottomRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: footer, start: "top 70%" } }
    );

    // RESIZE
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener("resize", handleResize);

    // RENDER LOOP
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (model) {
        const targetRotY = mouse.x *  0.3;
        const targetRotX = -mouse.y * 0.2 + modelRotationX;
        model.rotation.y += (targetRotY - model.rotation.y) * 0.05;
        model.rotation.x += (targetRotX - model.rotation.x) * 0.05;
      }

      renderer.render(scene, camera);
    };
    animate();

    // CLEANUP
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize",    handleResize);

      scene.traverse((obj) => {
        if (!obj.isMesh) return;
        obj.geometry?.dispose();
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        mats.forEach((m) => { m.map?.dispose(); m.dispose(); });
      });

      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const socialLinks = [
    { icon: <FaGithub />,    link: "https://github.com/DojaBiraloo" },
    { icon: <FaInstagram />, link: "https://www.instagram.com/aprapya__r" },
    { icon: <FaLinkedin />,  link: "https://www.linkedin.com/in/aprapya-rana-47b953397/" },
    { icon: <FaYoutube />,   link: "https://www.youtube.com/@aprapyarana1916" },
  ];

  return (
    <main className="overflow-x-hidden">
      <footer
        id="contact"
        ref={footerRef}
        className="relative overflow-hidden bg-gradient-to-b from-[#1d1b14] via-[#2c2416] to-[#120f09] text-[#fff7df]"
      >
        {/* GLOW */}
        <div className="absolute left-1/2 top-0 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-[#f8d67d]/20 blur-[120px]" />

        {/* THREE CANVAS */}
        <div ref={canvasRef} className="pointer-events-none absolute inset-0 z-0" />

        {/* CONTENT */}
        <div className="relative z-10 flex min-h-[75vh] flex-col justify-between px-8 py-14 md:px-16">
          <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
            {/* LEFT */}
            <div>
              <h2
                ref={headingRef}
                className="max-w-[700px] text-4xl font-light font-apfel leading-[1.1] tracking-tight md:text-6xl"
              >
                WITH GREAT UI
                <br />COMES GREAT
                <br />USER EXPERIENCE
              </h2>

              <a
                ref={buttonRef}
                href="/src/assets/pdf/Aprapya-CV.pdf"
                download="Aprapya-CV.pdf"
                className="mt-8 inline-block rounded-full bg-black px-7 py-3 text-sm font-medium font-apfel text-white transition-all duration-300 hover:scale-105 hover:bg-[#111]"
              >
                Download CV
              </a>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-5">
              {socialLinks.map((item, index) => (
                <a
                  key={index}
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  ref={(el) => (socialsRef.current[index] = el)}
                  className="group flex h-14 w-14 items-center justify-center rounded-full border border-[#ffe29a]/20 bg-[#fff3d4]/10 text-2xl text-[#ffe8a3] backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-[#ffe29a] hover:bg-[#ffe29a] hover:text-black"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* BOTTOM */}
          <div
            ref={bottomRef}
            className="mt-14 flex flex-col gap-3 border-t border-[#ffe29a]/10 pt-6 text-sm text-[#fff7df]/60 md:flex-row md:items-center md:justify-between"
          >
            <p>Experiment 518</p>
            <p>Built by Aprapya</p>
          </div>
        </div>
      </footer>
    </main>
  );
}