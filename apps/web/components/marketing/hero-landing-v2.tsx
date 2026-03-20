"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Check, ChevronRight, Copy, Star, Terminal } from "lucide-react";

const testimonialsRow1 = [
  {
    id: 1,
    user: "@AryehDubois",
    text: "Tried Claimit by @steipete. I tried to build my own AI assistant before, and I am very impressed how many hard things it gets right.",
    img: "https://i.pravatar.cc/150?u=1",
  },
  {
    id: 2,
    user: "@markjaquith",
    text: "I've been saying for like six months that even if LLMs suddenly stopped improving, we could spend *years* discovering new transformations.",
    img: "https://i.pravatar.cc/150?u=2",
  },
  {
    id: 3,
    user: "@Philo01",
    text: "Feels like we're living in the future. The CLI integration is seamless.",
    img: "https://i.pravatar.cc/150?u=3",
  },
];

const testimonialsRow2 = [
  {
    id: 4,
    user: "@Senator_NFTs",
    text: "Claimit is a game changer. The potential for custom extensions is huge, and ai really speeds up the process.",
    img: "https://i.pravatar.cc/150?u=4",
  },
  {
    id: 5,
    user: "@tech_aura",
    text: "Finally, a way to keep my career story updated without the manual grind of updating Word docs.",
    img: "https://i.pravatar.cc/150?u=5",
  },
  {
    id: 6,
    user: "@dev_minds",
    text: "The export quality is incredible. My resume has never looked more professional.",
    img: "https://i.pravatar.cc/150?u=6",
  },
];

interface TestimonialCardProps {
  user: string;
  text: string;
  img: string;
}

function TestimonialCard({ user, text, img }: TestimonialCardProps) {
  return (
    <div className="w-[420px] bg-[#0c111c] border border-white/5 rounded-2xl p-6 text-left shadow-xl transition-all hover:border-white/20 group">
      <div className="flex gap-4 items-start">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img}
          alt={user}
          className="w-10 h-10 rounded-full object-cover border border-white/10 grayscale group-hover:grayscale-0 transition-all duration-500"
        />
        <div className="flex-1">
          <p className="text-white/70 text-[15px] leading-relaxed mb-4 italic">
            &ldquo;{text}&rdquo;
          </p>
          <span className="text-red-500 font-medium text-[14px] block">{user}</span>
        </div>
      </div>
    </div>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

export function HeroLandingV2() {
  const [copied, setCopied] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  const installCommand = "npm install -g claimit && claimit init";

  const copyToClipboard = () => {
    const textArea = document.createElement("textarea");
    textArea.value = installCommand;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("无法复制", err);
    }
    document.body.removeChild(textArea);
  };

  const scrollToInstall = () => {
    terminalRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="relative min-h-screen w-full bg-white selection:bg-black selection:text-white font-sans">
      {/* 背景视频层 */}
      <div className="absolute inset-0 z-0 h-[90vh] w-full overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover [transform:scaleY(-1)]"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260302_085640_276ea93b-d7da-4418-a09b-2aa5b490e838.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(255,255,255,0)] from-[26%] to-white to-[67%]" />
      </div>

      <motion.div
        className="relative z-10 mx-auto max-w-[1200px] px-6 pt-[290px] pb-32 flex flex-col items-center text-center gap-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* 标题 */}
        <motion.h1
          variants={itemVariants}
          className="font-medium text-[clamp(48px,6vw,80px)] leading-[1.1] tracking-[-0.04em] text-[#1a1a1a]"
        >
          Simple{" "}
          <span
            className="italic font-normal text-[clamp(60px,7.5vw,100px)] text-black inline-block px-1"
            style={{ fontFamily: '"Instrument Serif", serif' }}
          >
            automation
          </span>{" "}
          for your career story.
        </motion.h1>

        {/* 副标题 */}
        <motion.p
          variants={itemVariants}
          className="text-[18px] leading-relaxed text-[#373a46] opacity-80 max-w-[554px]"
        >
          A CLI-powered agent that tracks your skills, lays out your CV, and exports a polished
          resume — automatically, every time.
        </motion.p>

        {/* 按钮组 */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center justify-center gap-4 mt-4"
        >
          <button
            onClick={scrollToInstall}
            className="group relative flex items-center gap-2 px-10 py-4 bg-[#1d1d1d] text-white rounded-[40px] font-medium text-[16px] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[inset_-4px_-6px_25px_0px_rgba(201,201,201,0.08),inset_4px_4px_10px_0px_rgba(29,29,29,0.24)]"
          >
            <Terminal size={18} className="text-white/70 group-hover:text-white transition-colors" />
            Install CLI
          </button>
          <a
            href="/workspace"
            className="px-10 py-4 bg-[#fcfcfc] text-[#1d1d1d] border border-black/5 rounded-[40px] font-medium text-[16px] transition-all hover:bg-white hover:shadow-[0px_10px_30px_rgba(0,0,0,0.05)] active:scale-[0.98]"
          >
            Get Started
          </a>
        </motion.div>

        {/* 社会认可度 */}
        <motion.div
          className="flex items-center justify-center gap-3 mt-4 text-[#373a46]/60"
          variants={itemVariants}
        >
          <div className="flex -space-x-1.5">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full bg-white border border-black/10 flex items-center justify-center"
              >
                <Star size={10} className="fill-yellow-400 text-yellow-400" />
              </div>
            ))}
          </div>
          <span className="text-[13px] tracking-tight">
            <span className="text-black font-semibold">1,020+ Reviews</span> from high-growth
            engineers
          </span>
        </motion.div>

        {/* WHAT PEOPLE SAY 滚动部分 */}
        <motion.div variants={itemVariants} className="w-screen max-w-none mt-20 relative overflow-hidden py-10">
          <div className="mx-auto max-w-[1200px] mb-8 flex items-center justify-between px-6">
            <h2 className="text-[24px] font-bold text-black flex items-center gap-2">
              <span
                className="text-red-500 text-3xl mr-1 italic"
                style={{ fontFamily: '"Instrument Serif", serif' }}
              >
                ›
              </span>
              What People Say
            </h2>
            <button className="text-[14px] font-medium text-red-500 hover:underline flex items-center gap-1">
              View all <ChevronRight size={14} />
            </button>
          </div>

          {/* 评价滚动容器 - 边缘渐变消失效果 */}
          <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            {/* 第一行：向左滚动 */}
            <div className="flex w-max gap-6 mb-6 animate-[scroll-left_40s_linear_infinite] hover:[animation-play-state:paused]">
              {[...testimonialsRow1, ...testimonialsRow1].map((t, idx) => (
                <TestimonialCard key={idx} {...t} />
              ))}
            </div>

            {/* 第二行：向右滚动 */}
            <div className="flex w-max gap-6 animate-[scroll-right_40s_linear_infinite] hover:[animation-play-state:paused]">
              {[...testimonialsRow2, ...testimonialsRow2].map((t, idx) => (
                <TestimonialCard key={idx} {...t} />
              ))}
            </div>
          </div>
        </motion.div>

        {/* 终端安装部分 */}
        <motion.div ref={terminalRef} variants={itemVariants} className="w-full max-w-[700px] mt-24 text-left">
          <div className="mb-4 flex items-center justify-between px-2">
            <h3 className="text-[14px] font-semibold text-black/40 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Quick Installation
            </h3>
          </div>
          <div className="relative group overflow-hidden bg-[#0a0a0a] rounded-2xl border border-white/10 shadow-2xl p-6 transition-all duration-500 hover:border-white/20">
            <div className="flex gap-1.5 mb-6">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
            </div>
            <div className="flex items-center justify-between font-mono text-[15px] sm:text-[16px]">
              <div className="flex items-center gap-3 text-white/90">
                <span className="text-blue-400 opacity-70">$</span>
                <code className="tracking-tight">{installCommand}</code>
              </div>
              <button
                onClick={copyToClipboard}
                className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all active:scale-95"
              >
                {copied ? (
                  <Check size={18} className="text-green-400" />
                ) : (
                  <Copy size={18} />
                )}
              </button>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
          </div>
          <p className="mt-4 text-center text-[13px] text-black/40 font-mono italic">
            Requirement: Node.js 16.x or higher
          </p>
        </motion.div>
      </motion.div>

      <style
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: `
          @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');

          @keyframes scroll-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes scroll-right {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
        `,
        }}
      />
    </main>
  );
}
