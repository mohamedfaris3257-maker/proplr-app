"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { PropellerSpinner } from "@/components/ui/propeller-spinner";

export function AnimatedHero() {
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true });
  const cardRef = useRef(null);
  const cardInView = useInView(cardRef, { once: true, margin: "-80px" });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

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
    <>
      {/* ── Hero Section ── */}
      <div className="relative h-screen overflow-hidden" style={{ background: "#fff" }}>
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
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 pt-16">
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
        </div>
      </div>

      {/* ── Student Community Showcase ── */}
      <div ref={cardRef} className="relative overflow-hidden" style={{ background: "#f8f9fc", paddingTop: 60, paddingBottom: 60 }}>
        <div className="max-w-[1100px] mx-auto px-6">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={cardInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          >
            <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 11, color: "#3d9be9", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              YOUR STUDENT COMMUNITY
            </span>
            <h2 className="pub-heading" style={{ fontSize: "clamp(24px, 4vw, 38px)", color: "#071629", marginTop: 8 }}>
              Where students connect, collaborate & grow
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40, rotateX: 8 }}
            animate={cardInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
            style={{ perspective: 1200 }}
          >
            <div style={{
              borderRadius: 20,
              overflow: "hidden",
              border: "1px solid rgba(7,22,41,0.06)",
              boxShadow: "0 30px 100px rgba(7,22,41,0.12), 0 0 0 1px rgba(7,22,41,0.03)",
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
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif" }}>app.proplr.com/community</span>
                </div>
              </div>

              {/* Community Layout */}
              <div style={{ display: "grid", gridTemplateColumns: "200px 1fr 240px", minHeight: 320 }}>
                {/* Left sidebar — Communities */}
                <div style={{ background: "#fff", padding: 16, borderRight: "1px solid rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: 11, color: "#071629", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>Community</div>
                  {["Foundation 2026", "Impact UAE", "Ambassadors", "Design Sprint", "Hackathon Hub"].map((ch, i) => (
                    <div key={ch} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 10, background: i === 0 ? "rgba(61,155,233,0.1)" : "transparent" }}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: i === 0 ? "#3d9be9" : i === 1 ? "#ffcb5d" : i === 2 ? "#2ed573" : i === 3 ? "#9B59B6" : "#ff6b6b", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontSize: 12, color: "#fff", fontWeight: 700 }}>{ch[0]}</span>
                      </div>
                      <div style={{ overflow: "hidden" }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: i === 0 ? "#3d9be9" : "#071629", whiteSpace: "nowrap" }}>{ch}</div>
                        <div style={{ fontSize: 9, color: "#999" }}>{[248, 134, 89, 56, 72][i]} members</div>
                      </div>
                    </div>
                  ))}
                  <div style={{ marginTop: "auto", padding: "8px 10px", borderRadius: 10, background: "rgba(61,155,233,0.06)", textAlign: "center" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#3d9be9" }}>+ Join Community</span>
                  </div>
                </div>

                {/* Main feed */}
                <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
                  {/* Community header */}
                  <div style={{ background: "linear-gradient(135deg, #071629, #0d2440)", borderRadius: 14, padding: "16px 18px", display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(61,155,233,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontSize: 18 }}>🚀</span>
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: 14, color: "#fff" }}>Foundation 2026</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>248 students · 12 mentors · KHDA Certified</div>
                    </div>
                  </div>

                  {/* Feed posts */}
                  {[
                    { name: "Sarah K.", avatar: "#3d9be9", time: "2h ago", text: "Just finished my Digital Literacy certificate! 🎉", likes: 24, badge: "Foundation" },
                    { name: "Omar A.", avatar: "#ffcb5d", time: "5h ago", text: "Our team placed 2nd at the Design Sprint. So proud!", likes: 41, badge: "Ambassador" },
                    { name: "Aisha M.", avatar: "#2ed573", time: "1d ago", text: "My mentor from Google helped me prep for my portfolio review", likes: 18, badge: "Impact" },
                  ].map((post, idx) => (
                    <div key={idx} style={{ background: "#fff", borderRadius: 12, padding: "12px 14px", border: "1px solid rgba(0,0,0,0.04)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: post.avatar, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <span style={{ fontSize: 11, color: "#fff", fontWeight: 700 }}>{post.name[0]}</span>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontSize: 12, fontWeight: 700, color: "#071629" }}>{post.name}</span>
                            <span style={{ fontSize: 9, fontWeight: 700, color: post.avatar, background: `${post.avatar}18`, padding: "1px 6px", borderRadius: 4 }}>{post.badge}</span>
                          </div>
                          <span style={{ fontSize: 10, color: "#999" }}>{post.time}</span>
                        </div>
                      </div>
                      <div style={{ fontSize: 12, color: "#333", lineHeight: 1.5, marginBottom: 6 }}>{post.text}</div>
                      <div style={{ display: "flex", gap: 12 }}>
                        <span style={{ fontSize: 10, color: "#999" }}>❤️ {post.likes}</span>
                        <span style={{ fontSize: 10, color: "#999" }}>💬 Reply</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right sidebar — Leaderboard & Events */}
                <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 10, borderLeft: "1px solid rgba(0,0,0,0.04)" }}>
                  {/* Leaderboard */}
                  <div style={{ background: "#071629", borderRadius: 14, padding: 14 }}>
                    <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: 11, color: "#ffcb5d", marginBottom: 10, letterSpacing: "0.05em" }}>🏆 LEADERBOARD</div>
                    {[
                      { name: "Fatima R.", pts: 2840, color: "#ffcb5d" },
                      { name: "Ahmed S.", pts: 2560, color: "#C0C0C0" },
                      { name: "Lina K.", pts: 2310, color: "#CD7F32" },
                    ].map((s, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <span style={{ fontSize: 12, fontWeight: 900, color: s.color, width: 16 }}>{i + 1}</span>
                        <div style={{ width: 22, height: 22, borderRadius: "50%", background: `${s.color}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <span style={{ fontSize: 9, color: "#fff", fontWeight: 700 }}>{s.name[0]}</span>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 11, fontWeight: 600, color: "#fff" }}>{s.name}</div>
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 800, color: s.color }}>{s.pts}</span>
                      </div>
                    ))}
                  </div>

                  {/* Upcoming Events */}
                  <div style={{ background: "#fff", borderRadius: 14, padding: 14, border: "1px solid rgba(0,0,0,0.04)" }}>
                    <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: 11, color: "#3d9be9", marginBottom: 10, letterSpacing: "0.05em" }}>📅 UPCOMING</div>
                    {[
                      { name: "Career Panel: Tech", date: "Mar 22", color: "#3d9be9" },
                      { name: "Portfolio Review", date: "Mar 28", color: "#2ed573" },
                      { name: "Hackathon Kickoff", date: "Apr 5", color: "#9B59B6" },
                    ].map((evt, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <div style={{ width: 4, height: 28, borderRadius: 2, background: evt.color }} />
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 600, color: "#071629" }}>{evt.name}</div>
                          <div style={{ fontSize: 9, color: "#999" }}>{evt.date}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Active now */}
                  <div style={{ background: "rgba(45,211,115,0.06)", borderRadius: 14, padding: 12, border: "1px solid rgba(45,211,115,0.15)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#2ed573", animation: "pulse 2s infinite" }} />
                      <span style={{ fontSize: 10, fontWeight: 700, color: "#2ed573" }}>42 online now</span>
                    </div>
                    <div style={{ display: "flex" }}>
                      {["#3d9be9", "#ffcb5d", "#ff6b6b", "#9B59B6", "#2ed573"].map((c, i) => (
                        <div key={i} style={{ width: 20, height: 20, borderRadius: "50%", background: c, border: "2px solid #fff", marginLeft: i > 0 ? -4 : 0 }} />
                      ))}
                      <span style={{ fontSize: 10, color: "#666", marginLeft: 6, alignSelf: "center" }}>+37</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
