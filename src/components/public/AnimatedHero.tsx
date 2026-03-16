"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import Link from "next/link";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { PropellerSpinner } from "@/components/ui/propeller-spinner";

export function AnimatedHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const y = useTransform(smoothProgress, [0, 1], [0, 200]);
  const opacity = useTransform(smoothProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(smoothProgress, [0, 0.5], [1, 0.9]);
  const cardRotateX = useTransform(smoothProgress, [0, 0.4], [12, 0]);
  const cardScale = useTransform(smoothProgress, [0, 0.4], [0.82, 1.02]);
  const cardY = useTransform(smoothProgress, [0, 0.5], [120, -20]);
  const cardOpacity = useTransform(smoothProgress, [0, 0.15, 0.5], [0.3, 1, 1]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] } },
  };

  return (
    <div ref={containerRef} className="relative" style={{ minHeight: "220vh" }}>
      {/* Sticky hero container */}
      <div className="sticky top-0 h-screen overflow-hidden" style={{ background: "#fff" }}>
        {/* Background elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <PropellerSpinner size={220} className="absolute -top-12 -right-12" speed={28} />
          <PropellerSpinner size={160} className="absolute bottom-16 -left-12" speed={35} color1="#ffcb5d" color2="#3d9be9" />
          <PropellerSpinner size={90} className="absolute top-[30%] right-[20%]" speed={20} />

          {/* Mouse-following gradient orbs */}
          <motion.div
            className="absolute w-[700px] h-[700px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(61,155,233,0.07) 0%, transparent 70%)",
              top: "5%",
              left: "5%",
              x: mousePos.x * 0.5,
              y: mousePos.y * 0.5,
            }}
          />
          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(255,203,93,0.05) 0%, transparent 70%)",
              bottom: "0%",
              right: "0%",
              x: mousePos.x * -0.3,
              y: mousePos.y * -0.3,
            }}
          />
        </div>

        {/* Text content */}
        <motion.div
          style={{ y, opacity, scale }}
          className="relative z-10 flex flex-col items-center justify-center h-full px-6 pt-16"
        >
          <motion.div
            ref={titleRef}
            variants={stagger}
            initial="hidden"
            animate={titleInView ? "show" : "hidden"}
            className="flex flex-col items-center gap-5 text-center max-w-4xl"
          >
            {/* Trust badge */}
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold tracking-widest"
              style={{
                background: "rgba(61,155,233,0.06)",
                border: "1px solid rgba(61,155,233,0.15)",
                color: "#3d9be9",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#3d9be9] animate-pulse" />
              KHDA CERTIFIED
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              className="pub-heading"
              style={{
                fontSize: "clamp(40px, 7vw, 84px)",
                color: "#071629",
                lineHeight: 1.0,
                letterSpacing: "-0.04em",
              }}
            >
              Your future doesn&apos;t
              <br />
              have to be a{" "}
              <span className="pub-gradient-text-animated" style={{ display: "inline-block" }}>
                guessing game.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeUp}
              style={{
                fontSize: "clamp(16px, 2vw, 20px)",
                color: "#6e7591",
                maxWidth: 580,
                lineHeight: 1.6,
              }}
            >
              Proplr gets you career-ready before you graduate — through real
              experiences, real mentors, and real industry connections.
            </motion.p>

            {/* CTA */}
            <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4 mt-2">
              <MagneticButton strength={0.15}>
                <Link
                  href="/register"
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-8 py-4 text-base font-bold text-white transition-all"
                  style={{ background: "#3d9be9" }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Get Started
                    <motion.span
                      className="inline-block"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      &rarr;
                    </motion.span>
                  </span>
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: "linear-gradient(135deg, #2d8ad6, #3d9be9, #5aafe8)" }}
                  />
                </Link>
              </MagneticButton>

              <MagneticButton strength={0.15}>
                <Link
                  href="/foundation"
                  className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-bold transition-all hover:bg-gray-50"
                  style={{ color: "#071629", border: "1.5px solid rgba(7,22,41,0.12)" }}
                >
                  See How It Works
                </Link>
              </MagneticButton>
            </motion.div>

            {/* Stats row */}
            <motion.div variants={fadeUp} className="flex items-center gap-8 mt-4">
              {[
                { num: "6", label: "KHDA Certificates" },
                { num: "150+", label: "Industry Mentors" },
                { num: "Sep", label: "2026 Start" },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                >
                  <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 24, fontWeight: 900, color: "#071629" }}>
                    {stat.num}
                  </div>
                  <div style={{ fontSize: 11, color: "#6e7591", fontWeight: 600, letterSpacing: 0.5 }}>
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 flex flex-col items-center gap-2"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ opacity: 0.4 }}
          >
            <span style={{ fontSize: 11, fontWeight: 600, color: "#6e7591", letterSpacing: 1 }}>SCROLL</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 4v12M4 10l6 6 6-6" stroke="#6e7591" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        </motion.div>

        {/* 3D Dashboard Mockup — rises into view on scroll */}
        <motion.div
          className="absolute bottom-0 left-1/2 w-[92%] max-w-[1100px] pointer-events-none"
          style={{
            x: "-50%",
            rotateX: cardRotateX,
            scale: cardScale,
            y: cardY,
            opacity: cardOpacity,
            perspective: 1200,
            transformStyle: "preserve-3d",
          }}
        >
          <div style={{
            borderRadius: 20,
            overflow: "hidden",
            border: "1px solid rgba(7,22,41,0.06)",
            boxShadow: "0 30px 100px rgba(7,22,41,0.15), 0 0 0 1px rgba(7,22,41,0.03)",
            background: "#f0f2f8",
          }}>
            {/* Browser chrome */}
            <div style={{ background: "#071629", padding: "10px 16px", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ display: "flex", gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff4757" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffcb5d" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#2ed573" }} />
              </div>
              <div style={{ flex: 1, background: "rgba(255,255,255,0.1)", borderRadius: 6, height: 22, maxWidth: 320, display: "flex", alignItems: "center", paddingLeft: 10 }}>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif" }}>app.proplr.com/dashboard</span>
              </div>
            </div>
            {/* Dashboard grid */}
            <div style={{ display: "grid", gridTemplateColumns: "180px 1fr 220px", minHeight: 300 }}>
              {/* Sidebar */}
              <div style={{ background: "#fff", padding: 16, borderRight: "1px solid rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #3d9be9, #2d8ad6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 12, height: 12, borderRadius: "50%", background: "rgba(255,255,255,0.7)" }} />
                  </div>
                  <div>
                    <div style={{ width: 64, height: 8, background: "#071629", borderRadius: 3, marginBottom: 3 }} />
                    <div style={{ width: 40, height: 5, background: "#e0e2ea", borderRadius: 3 }} />
                  </div>
                </div>
                {["Dashboard", "My Program", "Community", "Events", "Opportunities", "Courses"].map((item, i) => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderRadius: 10, background: i === 0 ? "rgba(61,155,233,0.1)" : "transparent" }}>
                    <div style={{ width: 8, height: 8, borderRadius: i === 0 ? 3 : "50%", background: i === 0 ? "#3d9be9" : "#d0d2da" }} />
                    <div style={{ height: 7, borderRadius: 3, background: i === 0 ? "#3d9be9" : "#d0d2da", flex: 1, opacity: i === 0 ? 0.7 : 0.5 }} />
                  </div>
                ))}
              </div>

              {/* Main content */}
              <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ background: "linear-gradient(135deg, #071629, #0d2440)", borderRadius: 14, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ width: 180, height: 12, background: "rgba(255,255,255,0.8)", borderRadius: 4 }} />
                  <div style={{ width: 120, height: 8, background: "rgba(255,255,255,0.25)", borderRadius: 4 }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                  {[{ color: "#3d9be9" }, { color: "#ffcb5d" }, { color: "#2ed573" }, { color: "#9B59B6" }].map((c, i) => (
                    <div key={i} style={{ background: "#fff", borderRadius: 12, padding: 12, border: "1px solid rgba(0,0,0,0.04)" }}>
                      <div style={{ width: 24, height: 24, borderRadius: 8, background: `${c.color}18`, marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ width: 10, height: 10, borderRadius: 3, background: c.color, opacity: 0.6 }} />
                      </div>
                      <div style={{ width: 30, height: 16, background: "#071629", borderRadius: 4, marginBottom: 4 }} />
                      <div style={{ width: 48, height: 6, background: "#e0e2ea", borderRadius: 3 }} />
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {[{ color: "#3d9be9", w: "72%" }, { color: "#ffcb5d", w: "45%" }, { color: "#2ed573", w: "88%" }].map((p, idx) => (
                    <div key={idx} style={{ background: "#fff", borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, border: "1px solid rgba(0,0,0,0.04)", borderLeftWidth: 3, borderLeftColor: p.color }}>
                      <div style={{ width: 20, height: 20, borderRadius: 6, background: `${p.color}18` }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ width: 80, height: 7, background: "#071629", borderRadius: 3, marginBottom: 5 }} />
                        <div style={{ height: 4, background: "#f0f1f5", borderRadius: 10, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: p.w, background: p.color, borderRadius: 10 }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right sidebar */}
              <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 10, borderLeft: "1px solid rgba(0,0,0,0.04)" }}>
                <div style={{ background: "#fff", borderRadius: 14, padding: 14, textAlign: "center", border: "1px solid rgba(0,0,0,0.04)" }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, #3d9be9, #5aafe8)", margin: "0 auto 8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(255,255,255,0.5)" }} />
                  </div>
                  <div style={{ width: 70, height: 8, background: "#071629", borderRadius: 3, margin: "0 auto 4px" }} />
                  <div style={{ width: 90, height: 6, background: "#e0e2ea", borderRadius: 3, margin: "0 auto" }} />
                </div>
                <div style={{ background: "#071629", borderRadius: 14, padding: 14 }}>
                  <div style={{ width: 70, height: 8, background: "#ffcb5d", borderRadius: 3, marginBottom: 12 }} />
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 6, height: 60 }}>
                    <div style={{ width: 32, height: 36, background: "rgba(255,255,255,0.08)", borderRadius: "6px 6px 0 0" }} />
                    <div style={{ width: 32, height: 56, background: "linear-gradient(180deg, #ffcb5d, #e8a838)", borderRadius: "6px 6px 0 0" }} />
                    <div style={{ width: 32, height: 28, background: "rgba(255,255,255,0.05)", borderRadius: "6px 6px 0 0" }} />
                  </div>
                </div>
                <div style={{ background: "#fff", borderRadius: 14, padding: 12, border: "1px solid rgba(0,0,0,0.04)" }}>
                  <div style={{ width: 50, height: 6, background: "#3d9be9", borderRadius: 3, marginBottom: 8, opacity: 0.6 }} />
                  <div style={{ width: "100%", height: 7, background: "#071629", borderRadius: 3, marginBottom: 5 }} />
                  <div style={{ width: "70%", height: 5, background: "#e0e2ea", borderRadius: 3 }} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
