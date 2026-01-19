// Prevent removal by automated tools
import React from "react";

import { Brain, Check, ChevronDown, Clock10, HatGlasses, MessageCircle, Mic, Moon, Shield, Sun, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const HERO_WORDS = ["Meetings", "Conversations", "Interviews"];

const HeroTyped = React.memo(function HeroTyped({ words }) {
  const [wordIndex, setWordIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!words.length) {
      return;
    }

    const currentWord = words[wordIndex];
    let delay = isDeleting ? 65 : 110;

    if (!isDeleting && typedText === currentWord) {
      delay = 1200;
    } else if (isDeleting && typedText === "") {
      delay = 350;
    }

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (typedText.length < currentWord.length) {
          setTypedText(currentWord.slice(0, typedText.length + 1));
        } else {
          setIsDeleting(true);
        }
      } else {
        if (typedText.length > 0) {
          setTypedText(currentWord.slice(0, typedText.length - 1));
        } else {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, delay);

    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, wordIndex, words]);

  return (
    <span className="hero-typed">
      for {typedText}
      <span className="typing-caret" aria-hidden="true"></span>
    </span>
  );
});

// Single-file, production-ready landing page inspired by the provided mockup.
// Tailwind CSS is available in this Canvas preview.

export default function introscribeLanding() {
  const baseUrl = (import.meta?.env?.BASE_URL ?? '/').replace(/\/?$/, '/');
  const windowsInstaller = `${baseUrl}download/introscribe-Setup-1.0.21.exe`;
  const macInstaller = `${baseUrl}download/introscribe-1.0.25-arm64.pkg`;
  const mobileDownloadEndpoint = "https://app.introscribe.com/download-mobile";
  const desktopAppCopy = "Introscribe is a desktop app for macOS & Windows";
  const desktopLandingLink =
    typeof window !== "undefined"
      ? (() => {
          try {
            return new URL(baseUrl, window.location.origin).href;
          } catch {
            return `${window.location.origin}${baseUrl}`;
          }
        })()
      : baseUrl;
  const detectPlatform = () => {
    if (typeof navigator === "undefined") return "unknown";
    const ua = navigator.userAgent || "";
    const platform = navigator.platform || "";
    const touchPoints = typeof navigator.maxTouchPoints === "number" ? navigator.maxTouchPoints : 0;
    const isIOS = /iP(hone|od|ad)/.test(platform) || (/Mac/.test(platform) && touchPoints > 1);
    const isAndroid = /Android/i.test(ua);

    if (isIOS) return "ios";
    if (isAndroid) return "android";
    if (/Mac|MacIntel|MacPPC|Mac68K/.test(platform) || /Mac OS X/.test(ua)) return "mac";
    if (/Win/.test(platform) || /Windows/.test(ua)) return "windows";
    return "other";
  };
  const [dark, setDark] = useState(() => {
    // Initialize from localStorage or system preference
    try {
      const stored = localStorage.getItem('theme');
      if (stored) return stored === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });
  const [yearly, setYearly] = useState(false);
  const monthlyBtnRef = useRef(null);
  const yearlyBtnRef = useRef(null);
  const indicatorRef = useRef(null);
  const [os, setOs] = useState(() => detectPlatform());
  const [showDesktopModal, setShowDesktopModal] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [shareStatus, setShareStatus] = useState("");
  const [showFreeDownloads, setShowFreeDownloads] = useState(false);
  const freeDropdownRef = useRef(null);
  const isMobile = os === "ios" || os === "android";

  // Resize & position billing toggle indicator to match active button
  useEffect(() => {
    const activeEl = yearly ? yearlyBtnRef.current : monthlyBtnRef.current;
    const indicator = indicatorRef.current;
    if (!activeEl || !indicator) return;
    const { offsetLeft, offsetWidth } = activeEl;
    // Adjust for parent padding (4px left) if needed
    indicator.style.left = `${offsetLeft + 4}px`;
    indicator.style.width = `${offsetWidth - 8}px`; // minus horizontal padding space
  }, [yearly]);

  // Recalculate on window resize for responsiveness
  useEffect(() => {
    const handleResize = () => {
      const activeEl = yearly ? yearlyBtnRef.current : monthlyBtnRef.current;
      const indicator = indicatorRef.current;
      if (!activeEl || !indicator) return;
      const { offsetLeft, offsetWidth } = activeEl;
      indicator.style.left = `${offsetLeft + 4}px`;
      indicator.style.width = `${offsetWidth - 8}px`;
    };
    window.addEventListener('resize', handleResize);
    // Initial measure (in case first render sizes differ after fonts load)
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [yearly]);
  const [openFAQ, setOpenFAQ] = useState(0);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
      try { localStorage.setItem('theme', 'dark'); } catch {}
    } else {
      root.classList.remove('dark');
      try { localStorage.setItem('theme', 'light'); } catch {}
    }
  }, [dark]);
  // Detect platform to show the relevant installer (mobile-first)
  useEffect(() => {
    setOs(detectPlatform());
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (freeDropdownRef.current && !freeDropdownRef.current.contains(e.target)) {
        setShowFreeDownloads(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const openDesktopPrompt = () => {
    if (!isMobile) return;
    setShareStatus("");
    setShowDesktopModal(true);
  };

  const handleCopyDesktopLink = async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      setShareStatus("Copy unavailable here. Long-press and copy the link instead.");
      return;
    }
    try {
      await navigator.clipboard.writeText(desktopLandingLink);
      setShareStatus("Link copied. Open it on desktop to download.");
    } catch {
      setShareStatus("Copy unavailable here. Long-press and copy the link instead.");
    }
  };

  const handleEmailDesktopLink = async () => {
    const email = shareEmail.trim();
    if (!email) {
      setShareStatus("Enter an email to send the desktop link.");
      return;
    }

    setShareStatus("Sending...");
    try {
      const res = await fetch(mobileDownloadEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        throw new Error("Failed");
      }
      setShareStatus("Link sent! Check your email on desktop to download.");
    } catch (err) {
      setShareStatus("Something went wrong. Try again or copy the link instead.");
    }
  };

  const DesktopRequiredCTA = ({ tone = "dark", align = "center", fullWidth = false }) => (
    <div
      className={`desktop-cta ${tone === "light" ? "desktop-cta--light" : "desktop-cta--dark"} ${align === "start" ? "desktop-cta--left" : ""} ${fullWidth ? "desktop-cta--full" : ""}`}
    >
      <button type="button" className="desktop-cta-btn" onClick={openDesktopPrompt}>
        <span className="desktop-cta__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 8V16.8C4 17.9201 4 18.4798 4.21799 18.9076C4.40973 19.2839 4.71547 19.5905 5.0918 19.7822C5.5192 20 6.07899 20 7.19691 20H16.8031C17.921 20 18.48 20 18.9074 19.7822C19.2837 19.5905 19.5905 19.2839 19.7822 18.9076C20 18.4802 20 17.921 20 16.8031V8M4 8H20M4 8L5.36518 5.61089C5.7002 5.0246 5.86768 4.73151 6.10325 4.51807C6.31184 4.32907 6.55859 4.18605 6.82617 4.09871C7.12861 4 7.46623 4 8.14258 4H15.8571C16.5334 4 16.8723 4 17.1747 4.09871C17.4423 4.18605 17.6879 4.32907 17.8965 4.51807C18.1322 4.73168 18.3002 5.02507 18.6357 5.6123L20 8M12 11V17M12 17L15 15M12 17L9 15" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        </span>
        Open on Desktop
      </button>
      <span className="desktop-cta-subtext">{desktopAppCopy}</span>
    </div>
  );

  const normalizePath = (value) => {
    const normalized = value.replace(/\/$/, "");
    return normalized === "" ? "/" : normalized;
  };

  const currentPath = typeof window !== "undefined" ? window.location.pathname : "/";
  const showNotFound = normalizePath(currentPath) !== normalizePath(baseUrl);

  const Header = () => (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-black/5 bg-white/30 backdrop-blur-md dark:bg-zinc-950/30 dark:border-white/10">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2 relative h-[30px]">
          <a href={baseUrl} aria-label="Go to landing page" className="block h-full w-auto relative">
            <img
              src="/logo-b.png"
              alt="introscribe logo"
              className="h-[30px] w-auto transition-opacity duration-300 opacity-100 dark:opacity-0"
              decoding="async"
            />
            <img
              src="/logo-w.png"
              alt="introscribe logo (dark)"
              className="absolute inset-0 h-[30px] w-auto transition-opacity duration-300 opacity-0 dark:opacity-100"
              decoding="async"
              aria-hidden="true"
            />
          </a>
        </div>
        <nav className="hidden gap-6 text-sm md:flex">
          <a href="#benefits">Benefits</a>
          <a href="#how">How it Works</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
        </nav>
        <div className="flex items-center">
          <button
            aria-label="Toggle theme"
            onClick={() => setDark((d) => !d)}
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl border"
          >
            <Sun className={`h-4 w-4 transition-transform duration-300 ${dark ? "scale-0 rotate-90" : "scale-100 rotate-0"}`} />
            <Moon className={`absolute h-4 w-4 transition-transform duration-300 ${dark ? "scale-100 rotate-0" : "scale-0 -rotate-90"}`} />
            <span className="sr-only">Toggle dark mode</span>
          </button>
        </div>
      </div>
    </header>
  );

  const Footer = () => (
    <footer className="mt-16 border-t border-black/5 bg-zinc-50 py-10 text-sm dark:border-white/10 dark:bg-zinc-900">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 relative h-[30px]">
              <a href={baseUrl} aria-label="Go to landing page" className="block h-full w-auto relative">
                <img
                  src="/logo-b.png"
                  alt="introscribe logo"
                  className="h-[30px] w-auto transition-opacity duration-300 opacity-100 dark:opacity-0"
                  decoding="async"
                />
                <img
                  src="/logo-w.png"
                  alt="introscribe logo (dark)"
                  className="absolute inset-0 h-[30px] w-auto transition-opacity duration-300 opacity-0 dark:opacity-100"
                  decoding="async"
                  aria-hidden="true"
                />
              </a>
            </div>
          </div>
          <p className="mt-3 text-zinc-600 dark:text-zinc-300">
            introscribe is an AI meeting companion—capture, summarize, and action every conversation.
          </p>
        </div>
        <div>
          <div className="font-semibold">Benefits</div>
          <ul className="mt-3 space-y-2 text-zinc-600 dark:text-zinc-300">
            <li>
              <a href="#benefits">
                Overview
              </a>
            </li>
            <li>
              <a href="#how">
                How it Works
              </a>
            </li>
            <li>
              <a href="#pricing">
                Pricing
              </a>
            </li>
            <li>
              <a href="#faq">
                FAQ
              </a>
            </li>
          </ul>
        </div>
        <div>
          <div className="font-semibold">Capture More, Type Less</div>
          <p className="mt-3 text-zinc-600 dark:text-zinc-300">
            Download introscribe to capture, summarize, and action meetings wherever you work.
          </p>
          <a
            href="mailto:support@introscribe.com"
            className="mt-3 inline-flex text-sm font-medium text-blue-600 dark:text-blue-400"
          >
            Contact us
          </a>
        </div>
        <div>
          <div className="font-semibold">Get the App</div>
          <div className="mt-3">
            {isMobile ? (
              <DesktopRequiredCTA tone="light" align="start" fullWidth />
            ) : (
              <div className="flex gap-3">
                <a href={windowsInstaller} download="introscribe-Setup-1.0.21.exe" className="download-btn glassy download-btn--sm" title="Download Windows installer">
                  <span className="download-icon-box">
                    <svg width="12" height="12" viewBox="0 0 19.132 19.132" fill="#ffffff" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                      <g>
                        <path d="M9.172 9.179V0.146H0v9.033h9.172z" />
                        <path d="M19.132 9.179V0.146H9.959v9.033h9.173z" />
                        <path d="M19.132 18.986V9.955H9.959v9.032h9.173z" />
                        <path d="M9.172 18.986V9.955H0v9.032h9.172z" />
                      </g>
                    </svg>
                  </span>
                  Windows
                </a>
                <a
                  href={macInstaller}
                  download="introscribe-1.0.25-arm64.pkg"
                  className="download-btn download-btn--mac glassy download-btn--sm"
                  title="Download macOS installer"
                >
                  <span className="download-icon-box">
                    <svg fill="#ffffff" height="14px" width="14px" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="-145 129 220 256" aria-hidden="true" focusable="false">
                      <g>
                        <path d="M75,316.8c-6,13.3-8.9,19.3-16.6,31c-10.8,16.4-26,36.9-44.9,37.1c-16.8,0.2-21.1-10.9-43.8-10.8 c-22.7,0.1-27.5,11-44.3,10.8c-18.9-0.2-33.3-18.7-44.1-35.1c-30.2-46-33.4-99.9-14.7-128.6c13.2-20.4,34.1-32.3,53.8-32.3 c20,0,32.5,11,49.1,11c16,0,25.8-11,48.9-11c17.5,0,36,9.5,49.2,26C24.3,238.6,31.3,300.3,75,316.8L75,316.8z M0.8,170.6 c8.4-10.8,14.8-26,12.5-41.6c-13.7,0.9-29.8,9.7-39.1,21.1c-8.5,10.3-15.5,25.6-12.8,40.5C-23.7,191.1-8.2,182.1,0.8,170.6 L0.8,170.6z"></path>
                      </g>
                    </svg>
                  </span>
                  Mac OS
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-6xl px-4 text-xs text-zinc-500 dark:text-zinc-400">
        © {new Date().getFullYear()} introscribe. All rights reserved.
      </div>
    </footer>
  );

  // Features / Benefits / Plans / FAQs (AI meeting assistant theme)
  const features = [
    {
      icon: HatGlasses,
      tag: "incognito",
      title: "Undetectable by Design, \n",
      desc:
        "100% undetectable - Whether you're in an interview, a virtual meeting, or a brainstorming session, the always on overlay is only ever visible to you whenever you screen share or record.",
      img: "exchange",
    },
    {
      icon: Brain,
      tag: "Answers",
      title: "Ask & Clarify\nMid‑Conversation",
      desc:
        "Type a question mid‑call: \"What did Sara commit to?\" or \"Summarize the last 5 mins\" and get instant, context‑aware answers without disruption.",
      img: "answers",
    },
    {
      icon: Shield,
      tag: "Privacy",
      title: "Enterprise‑Grade\nSecurity & Control",
      desc:
        "Encrypted storage, regional residency, retention policies, and zero model training on your private content—built for compliance.",
      img: "privacy",
    },
  ];

  const benefits = [
    {
      icon: Mic,
      title: "Live Transcription",
      desc: "Converts speech to text with millisecond accuracy so nothing important is lost.",
    },
    {
      icon: Zap,
      title: "Smart Understanding",
      desc: "Detects topics, key points, and actionable tasks automatically while you talk.",
    },
    {
      icon: MessageCircle,
      title: "Conversational Queries",
      desc: "Ask questions directly from your transcript and get instant contextual answers.",
    },
    {
      icon: Clock10,
      title: "Real-Time Insights",
      desc: "Receive prompts and suggestions live to guide meetings and decisions.",
    },
  ];

  const plans = [
    {
      name: "Free Plan",
      slug: "free",
      priceM: 0,
      priceY: 0,
      bullets: [
        "Limited AI responses",
        "Limited meeting notetaking",
        "Limited custom response instructions & file uploads",
        "Ask AI about all your past meetings",
      ],
      cta: "Get started",
      highlight: false,
    },
    {
      name: "Plus Plan",
      slug: "plus",
      priceM: 11.99,
      priceY: 115.10, // monthly * 12 with 20% annual discount
      bullets: [
        "Unlimited AI responses",
        "Unlimited meeting notetaking",
        "Unlimited access to the latest AI models",
        "Unlimited custom response instructions (Personas) & file uploads",
        "Priority support",
      ],
      cta: "Get started",
      highlight: true,
    },
    {
      name: "Pro Plan",
      slug: "pro",
      priceM: 29.99,
      priceY: 287.90, // monthly * 12 with 20% annual discount
      bullets: [
        "Everything included in the Plus plan",
        "Completely hidden from meeting screen-sharing software",
      ],
      cta: "Book a Call",
      highlight: false,
    },
  ];

  const faqs = [
    {
      q: "How accurate is the live transcription?",
      a: "Accuracy averages 95–98% in clear audio with speaker diarization. Domain tuning boosts recurring terminology.",
    },
    {
      q: "Will participants see that it's running?",
      a: "No – the capture bar stays off recordings and screen shares. Optional subtle badge available for compliance.",
    },
    {
      q: "What platforms are supported?",
      a: "Works with Zoom, Meet, Teams, Webex—anything on desktop or browser. No plugins required.",
    },
    {
      q: "Is my meeting data private?",
      a: "Yes. Encrypted at rest (AES‑256) & in transit (TLS 1.3). We never train external models on your data without opt‑in.",
    },
    {
      q: "Can it generate summaries & action items?",
      a: "Each call produces structured summaries: decisions, action items (owner + verb + optional date), risks & follow‑ups.",
    },
    {
      q: "Does it support multiple languages?",
      a: "Yes—30+ languages with automatic detection. Mixed‑language segments are labeled.",
    },
    {
      q: "Who owns the data?",
      a: "You retain full ownership. Deletions cascade to derived summaries & embeddings within 30 minutes.",
    },
  ];

  const Price = ({ amount }) => {
    const formatted = Number(amount).toFixed(2);
    return (
      <div className="flex items-baseline gap-2">
        {amount === 0 ? (
          <span className="price-number text-lg font-semibold">Free</span>
        ) : (
          <>
            <span className="price-number">${formatted}</span>
            <span className="price-cycle">/ {yearly ? 'year' : 'month'}</span>
          </>
        )}
      </div>
    );
  };

  const downloadOptions = os === "mac"
    ? [
        { label: "Get for Mac OS", href: macInstaller, file: "introscribe-1.0.25-arm64.pkg" },
        { label: "Get for Windows", href: windowsInstaller, file: "introscribe-Setup-1.0.21.exe" },
      ]
    : [
        { label: "Get for Windows", href: windowsInstaller, file: "introscribe-Setup-1.0.21.exe" },
        { label: "Get for Mac OS", href: macInstaller, file: "introscribe-1.0.25-arm64.pkg" },
      ];

  return (
  <div className="min-h-screen text-zinc-900 dark:text-white">
      {isMobile && showDesktopModal && (
        <div className="desktop-modal" role="dialog" aria-modal="true" aria-label="Desktop required">
          <div className="desktop-modal__backdrop" onClick={() => { setShowDesktopModal(false); setShareStatus(""); }}></div>
          <div className="desktop-modal__card">
            <div className="desktop-modal__header">
          <div>
            <p className="desktop-modal__eyebrow">Desktop required</p>
            <h3 className="desktop-modal__title">Open on desktop to install</h3>
            <p className="desktop-modal__lead">{desktopAppCopy}</p>
          </div>
            </div>
            <div className="desktop-modal__body">
              <label className="desktop-modal__label" htmlFor="share-email">Email me the download link</label>
              <input
                id="share-email"
                type="email"
                inputMode="email"
                className="desktop-modal__input"
                placeholder="name@email.com"
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
              />
              <button type="button" className="desktop-modal__action" onClick={handleEmailDesktopLink}>
                Email me the download link
              </button>
              <div className="desktop-modal__divider">or</div>
              <button type="button" className="desktop-modal__action desktop-modal__action--ghost" onClick={handleCopyDesktopLink}>
                Copy link to open on desktop
              </button>
              <button
                type="button"
                className="desktop-modal__action desktop-modal__action--ghost desktop-modal__close"
                onClick={() => { setShowDesktopModal(false); setShareStatus(""); }}
              >
                Close
              </button>
              {shareStatus ? (
                <p className="desktop-modal__hint">{shareStatus}</p>
              ) : (
                <p className="desktop-modal__hint">We'll hold your spot - open this on desktop and the download begins.</p>
              )}
            </div>
          </div>
        </div>
      )}
      <Header />

      {showNotFound ? (
        <main className="relative flex min-h-[60vh] flex-1 flex-col items-center justify-center gap-4 px-4 py-28 text-center">
          <p className="text-xs uppercase tracking-[0.6em] text-zinc-500 dark:text-zinc-400">404</p>
          <h1 className="text-4xl font-semibold text-zinc-900 dark:text-white">Page not found</h1>
          <p className="max-w-2xl text-base text-zinc-600 dark:text-zinc-300">
            The page you were looking for either moved or never existed. Head back home to keep exploring the AI companion.
          </p>
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined") {
                window.location.assign(baseUrl);
              }
            }}
            className="mt-6 inline-flex items-center justify-center rounded-[14px] border border-zinc-900 px-6 py-3 text-sm font-semibold uppercase tracking-[0.28em] text-zinc-900 transition dark:border-white dark:bg-white dark:text-zinc-900"
          >
            Go back home
          </button>
        </main>
      ) : (
        <>
          {/* Hero */}
      <section className="landing-bg landing-bg-animate w-full px-4 pb-16 pt-14 md:pt-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center text-white hero-text-glow">
          <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl hero-title-animate">
           Your Real-Time AI Assistant
            <br />
            <HeroTyped words={HERO_WORDS} />
          </h1>
          <p className="mt-4 text-pretty text-white/80 dark:text-zinc-300 hero-lead hero-cta-animate">
            Transcribe every word, capture every insight, <br /> and get intelligent suggestions all in real time.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 hero-cta-animate">
            {isMobile ? (
              <DesktopRequiredCTA tone="dark" />
            ) : os === "mac" ? (
              <a
                href={macInstaller}
                download="introscribe-1.0.25-arm64.pkg"
                className="download-btn download-btn--mac glassy"
                title="Download macOS installer"
              >
                <span className="download-icon-box">
                  <svg fill="#ffffff" height="14px" width="14px" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="-145 129 220 256" aria-hidden="true" focusable="false"><g><path d="M75,316.8c-6,13.3-8.9,19.3-16.6,31c-10.8,16.4-26,36.9-44.9,37.1c-16.8,0.2-21.1-10.9-43.8-10.8 c-22.7,0.1-27.5,11-44.3,10.8c-18.9-0.2-33.3-18.7-44.1-35.1c-30.2-46-33.4-99.9-14.7-128.6c13.2-20.4,34.1-32.3,53.8-32.3 c20,0,32.5,11,49.1,11c16,0,25.8-11,48.9-11c17.5,0,36,9.5,49.2,26C24.3,238.6,31.3,300.3,75,316.8L75,316.8z M0.8,170.6 c8.4-10.8,14.8-26,12.5-41.6c-13.7,0.9-29.8,9.7-39.1,21.1c-8.5,10.3-15.5,25.6-12.8,40.5C-23.7,191.1-8.2,182.1,0.8,170.6 L0.8,170.6z"></path></g></svg>
                </span>
                Get for Mac OS
              </a>
            ) : os === "windows" ? (
              <a href={windowsInstaller} download="introscribe-Setup-1.0.21.exe" className="download-btn glassy" title="Download Windows installer">
                <span className="download-icon-box">
                  {/* Windows icon */}
                  <svg fill="#ffffff" width="18" height="18" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>microsoft</title> <path d="M16.742 16.742v14.253h14.253v-14.253zM1.004 16.742v14.253h14.256v-14.253zM16.742 1.004v14.256h14.253v-14.256zM1.004 1.004v14.256h14.256v-14.256z"></path> </g></svg>
                </span>
                Get for Windows
              </a>
            ) : (
              <>
                <a href={windowsInstaller} download="introscribe-Setup-1.0.21.exe" className="download-btn glassy" title="Download Windows installer">
                  <span className="download-icon-box">
                    {/* Windows icon */}
                    <svg width="15" height="15" viewBox="0 0 19.132 19.132" fill="#ffffff" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                      <g>
                        <path d="M9.172 9.179V0.146H0v9.033h9.172z" />
                        <path d="M19.132 9.179V0.146H9.959v9.033h9.173z" />
                        <path d="M19.132 18.986V9.955H9.959v9.032h9.173z" />
                        <path d="M9.172 18.986V9.955H0v9.032h9.172z" />
                      </g>
                    </svg>
                  </span>
                  Get for Windows
                </a>
                <a
                  href={macInstaller}
                  download="introscribe-1.0.25-arm64.pkg"
                  className="download-btn download-btn--mac glassy"
                  title="Download macOS installer"
                >
                  <span className="download-icon-box">
                    <svg fill="#ffffff" height="14px" width="14px" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="-145 129 220 256" aria-hidden="true" focusable="false"><g><path d="M75,316.8c-6,13.3-8.9,19.3-16.6,31c-10.8,16.4-26,36.9-44.9,37.1c-16.8,0.2-21.1-10.9-43.8-10.8 c-22.7,0.1-27.5,11-44.3,10.8c-18.9-0.2-33.3-18.7-44.1-35.1c-30.2-46-33.4-99.9-14.7-128.6c13.2-20.4,34.1-32.3,53.8-32.3 c20,0,32.5,11,49.1,11c16,0,25.8-11,48.9-11c17.5,0,36,9.5,49.2,26C24.3,238.6,31.3,300.3,75,316.8L75,316.8z M0.8,170.6 c8.4-10.8,14.8-26,12.5-41.6c-13.7,0.9-29.8,9.7-39.1,21.1c-8.5,10.3-15.5,25.6-12.8,40.5C-23.7,191.1-8.2,182.1,0.8,170.6 L0.8,170.6z"></path></g></svg>
                  </span>
                  Get for Mac OS
                </a>
              </>
            )}
          </div>
          </div>
        <div className="relative mx-auto mt-12 w-full max-w-4xl px-4 phone-mock-animate mockup-container overflow-hidden">
          <video
            src="/app_design_main.mp4"
            className="mx-auto w-full max-w-[860px] mockup-video"
            autoPlay
            muted
            loop
            playsInline
            controls={false}
          />
        </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="price-number text-center mt-3">Our Benefits</h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-zinc-600 dark:text-zinc-300">
          An AI meeting copilot that records, summarizes, and turns conversations into structured, shareable outcomes.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 md:grid-cols-4">
          {benefits.map((b, i) => (
            <div key={i} className="benefit-glass group">
              <div className="benefit-icon-box">
                <b.icon className="h-5 w-5 text-zinc-700 dark:text-zinc-200" />
              </div>
              <h3 className="mt-4 font-semibold tracking-tight text-zinc-900 dark:text-white">{b.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{b.desc}</p>
              <button className="mt-4 inline-flex items-center text-sm font-medium text-zinc-900 dark:text-white underline underline-offset-4 decoration-white/30">
                Learn more
              </button>
            </div>
          ))}
        </div>
      </section>

  {/* Feature Sections */}
      <section id="how" className="mx-auto max-w-6xl px-4 py-6 md:py-10">
        <div className="grid gap-10">
          {features.map((f, i) => (
            <div key={i} className={`grid items-center gap-8 md:grid-cols-2 ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}>
              {/* Feature visual */}
              {i === 0 ? (
                <div className="rounded-3xl overflow-hidden border bg-white shadow-md dark:border-white/10 dark:bg-zinc-950">
                  <img
                    src="/video-call.png"
                    alt="Exchange feature preview"
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ) : f.tag === 'Answers' ? (
                <div className="relative rounded-3xl overflow-hidden border bg-white shadow-md dark:border-white/10 dark:bg-zinc-950">
                  {/* Light mode image */}
                  <img
                    src="/settings.png"
                    alt="Contextual answers feature preview"
                    className="h-full w-full object-cover transition-opacity duration-700 opacity-100 dark:opacity-0"
                    loading="lazy"
                    decoding="async"
                  />
                  {/* Dark mode image layered for fade */}
                  <img
                    src="/setting-dark.png"
                    alt="Contextual answers feature preview (dark)"
                    className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 opacity-0 dark:opacity-100 pointer-events-none"
                    loading="lazy"
                    decoding="async"
                    aria-hidden="true"
                  />
                </div>
              ) : (
                <div className="relative rounded-3xl overflow-hidden border bg-white shadow-md dark:border-white/10 dark:bg-zinc-950">
                  {/* Light mode image */}
                  <img
                    src="/private.png"
                    alt="Private feature preview"
                    className="h-full w-full object-cover transition-opacity duration-700 opacity-100 dark:opacity-0"
                    loading="lazy"
                    decoding="async"
                  />
                  {/* Dark mode image layered for fade */}
                  <img
                    src="/private-dark.png"
                    alt="Private feature preview (dark)"
                    className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 opacity-0 dark:opacity-100 pointer-events-none"
                    loading="lazy"
                    decoding="async"
                    aria-hidden="true"
                  />
                </div>
              )}
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium dark:border-white/10">
                  <f.icon className="h-3.5 w-3.5" /> {f.tag}
                </div>
                <h3 className="price-number font-semibold leading-[1.05] tracking-tight whitespace-pre-line">{f.title}</h3>
                <p className="mt-3 max-w-prose text-lg md:text-xl leading-relaxed text-zinc-600 dark:text-zinc-300">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center">
          <h2 className="price-number">Pricing</h2>
          <p className="mx-auto mt-2 max-w-2xl text-zinc-600 dark:text-zinc-300">
            Simple, transparent pricing for collaborators and compliance‑focused teams.
          </p>
          <div className="mt-6 billing-toggle-wrapper">
            <div className={`billing-toggle billing-toggle-glass`}> 
              <span ref={indicatorRef} className="billing-toggle-indicator" aria-hidden="true"></span>
              <button
                ref={monthlyBtnRef}
                className={!yearly ? 'active' : ''}
                onClick={() => setYearly(false)}
              >
                Monthly
              </button>
              <button
                ref={yearlyBtnRef}
                className={yearly ? 'active' : ''}
                onClick={() => setYearly(true)}
              >
                Yearly (save 20%)
              </button>
            </div>
          </div>
        </div>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {plans.map((p, i) => (
            <div key={i} className={`pricing-card ${p.highlight ? 'pricing-card--highlight' : ''} ${p.name.includes('Pro') ? 'pricing-card--custom' : ''}`}> 
              <span className="plan-ribbon">{p.name}</span>
              <div className="mt-4">
                <Price amount={yearly ? p.priceY : p.priceM} />
              </div>
              <ul className="features-list mt-5 space-y-3 text-sm">
                {p.bullets.map((b, bi) => (
                  <li key={bi} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-none" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-6">
                {(p.name.includes('Plus') || p.name.includes('Pro')) ? (
                  <a
                    href={`https://app.introscribe.com/?plan=${(p.slug ?? p.name).toLowerCase()}${yearly ? '&interval=yearly&autologin=1' : ''}`}
                    className="btn-muted pricing-card-cta pricing-cta-glass w-full inline-flex items-center justify-center text-center"
                  >
                    Get started
                  </a>
                ) : p.cta === 'Book a Call' ? (
                  <button className="btn-gradient pricing-card-cta pricing-cta-glass w-full inline-flex items-center justify-center">
                    Get started
                  </button>
                ) : isMobile ? (
                  <DesktopRequiredCTA tone="light" align="start" fullWidth />
                ) : (
                  <div className="relative" ref={freeDropdownRef}>
                    <button
                      type="button"
                      className="btn-muted pricing-card-cta pricing-cta-glass w-full text-center flex items-center justify-center gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowFreeDownloads((open) => !open);
                      }}
                    >
                      Download for free
                      <ChevronDown className={`h-4 w-4 transition-transform ${showFreeDownloads ? 'rotate-180' : ''}`} />
                    </button>
                    {showFreeDownloads && (
                      <div className="absolute left-0 right-0 mt-2 rounded-2xl border bg-white p-2 shadow-lg dark:bg-zinc-950 dark:border-white/10">
                        {downloadOptions.map((opt) => (
                          <a
                            key={opt.label}
                            href={opt.href}
                          download={opt.file}
                            className="block rounded-lg px-3 py-2 text-sm font-medium text-zinc-900 dark:text-white"
                            onClick={() => setShowFreeDownloads(false)}
                          >
                            {opt.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* What Customers Say */}
      {/*<section className="mx-auto max-w-6xl px-4 py-10">
  <h3 className="text-center text-2xl font-semibold leading-tight whitespace-pre-line">What Customer Says</h3>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            {
              name: "James Anderson",
              role: "CTO at FinTech Innovations",
              text:
                "Modern crypto banking has never been easier. The real‑time insights and security features are superb for teams. I can’t manage without it for my analysts.",
            },
            {
              name: "Demi Lee",
              role: "Financial Operations Manager",
              text:
                "I’ve been using this service for months, and it has been a game changer. The combination of unified trading + AI‑driven alerts means my team gets peace of mind every day.",
            },
            {
              name: "Sophia Williams",
              role: "Senior Product Manager",
              text:
                "The platform is exactly what the industry needs: fast, secure, and intuitive. I can finally consolidate my wallets and get rock‑solid reporting while my team focuses on what matters.",
            },
          ].map((t, i) => (
            <figure key={i} className="rounded-2xl border bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-950">
              <div className="flex items-center gap-1 text-yellow-500">
                {[...Array(5)].map((_, s) => (
                  <Star key={s} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-3 text-sm text-zinc-700 dark:text-zinc-200">{t.text}</blockquote>
              <figcaption className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
                <span className="font-medium text-zinc-900 dark:text-white">{t.name}</span> · {t.role}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>*/}
      {/* Smart AI CTA */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="relative overflow-hidden rounded-3xl border p-6 text-white shadow-lg dark:border-white/10 min-h-[560px] md:min-h-[600px]">
          {/* Background layers for smooth fade between light and dark */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-700 opacity-100 dark:opacity-0 pointer-events-none"
            style={{ backgroundImage: 'url(/foot.png)' }}
          ></div>
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-700 opacity-0 dark:opacity-100 pointer-events-none"
            style={{ backgroundImage: 'url(/foot-dark.png)' }}
          ></div>
          <div className="relative grid h-full gap-6 md:grid-cols-2">
            <div className="mt-24 md:mt-52 px-4 md:px-10" style={{ zIndex: 1 }}>
              <h3 className="text-3xl md:text-4xl font-semibold leading-tight whitespace-pre-line cta-head-shadow">The Future of Meetings - Unfolded</h3>
              <p className="mt-2 text-zinc-300">
                AI companion—recording, transcribing, and guiding every conversation in real time.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                {isMobile ? (
                  <DesktopRequiredCTA tone="dark" align="start" />
                ) : os === "mac" ? (
                  <a
                    href={macInstaller}
                    download="introscribe-1.0.25-arm64.pkg"
                    className="download-btn download-btn--mac glassy"
                    title="Download macOS installer"
                  >
                    <span className="download-icon-box">
                      <svg fill="#ffffff" height="14px" width="14px" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="-145 129 220 256" aria-hidden="true" focusable="false"><g><path d="M75,316.8c-6,13.3-8.9,19.3-16.6,31c-10.8,16.4-26,36.9-44.9,37.1c-16.8,0.2-21.1-10.9-43.8-10.8 c-22.7,0.1-27.5,11-44.3,10.8c-18.9-0.2-33.3-18.7-44.1-35.1c-30.2-46-33.4-99.9-14.7-128.6c13.2-20.4,34.1-32.3,53.8-32.3 c20,0,32.5,11,49.1,11c16,0,25.8-11,48.9-11c17.5,0,36,9.5,49.2,26C24.3,238.6,31.3,300.3,75,316.8L75,316.8z M0.8,170.6 c8.4-10.8,14.8-26,12.5-41.6c-13.7,0.9-29.8,9.7-39.1,21.1c-8.5,10.3-15.5,25.6-12.8,40.5C-23.7,191.1-8.2,182.1,0.8,170.6 L0.8,170.6z"></path></g></svg>
                    </span>
                    Get for Mac OS
                  </a>
                ) : os === "windows" ? (
                  <a href={windowsInstaller} download="introscribe-Setup-1.0.21.exe" className="download-btn glassy" title="Download Windows installer">
                    <span className="download-icon-box">
                      {/* Windows icon (updated 4-pane) */}
                      <svg width="13" height="13" viewBox="0 0 19.132 19.132" fill="#ffffff" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                        <g>
                          <path d="M9.172 9.179V0.146H0v9.033h9.172z" />
                          <path d="M19.132 9.179V0.146H9.959v9.033h9.173z" />
                          <path d="M19.132 18.986V9.955H9.959v9.032h9.173z" />
                          <path d="M9.172 18.986V9.955H0v9.032h9.172z" />
                        </g>
                      </svg>
                    </span>
                    Get for Windows
                  </a>
                ) : (
                  <>
                    <a href={windowsInstaller} download="introscribe-Setup-1.0.21.exe" className="download-btn glassy" title="Download Windows installer">
                      <span className="download-icon-box">
                        {/* Windows icon (updated 4-pane) */}
                        <svg width="13" height="13" viewBox="0 0 19.132 19.132" fill="#ffffff" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                          <g>
                            <path d="M9.172 9.179V0.146H0v9.033h9.172z" />
                            <path d="M19.132 9.179V0.146H9.959v9.033h9.173z" />
                            <path d="M19.132 18.986V9.955H9.959v9.032h9.173z" />
                            <path d="M9.172 18.986V9.955H0v9.032h9.172z" />
                          </g>
                        </svg>
                      </span>
                      Get for Windows
                    </a>
                    <a
                      href={macInstaller}
                      download="introscribe-1.0.25-arm64.pkg"
                      className="download-btn download-btn--mac glassy"
                      title="Download macOS installer"
                    >
                      <span className="download-icon-box">
                        <svg fill="#ffffff" height="14px" width="14px" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="-145 129 220 256" aria-hidden="true" focusable="false"><g><path d="M75,316.8c-6,13.3-8.9,19.3-16.6,31c-10.8,16.4-26,36.9-44.9,37.1c-16.8,0.2-21.1-10.9-43.8-10.8 c-22.7,0.1-27.5,11-44.3,10.8c-18.9-0.2-33.3-18.7-44.1-35.1c-30.2-46-33.4-99.9-14.7-128.6c13.2-20.4,34.1-32.3,53.8-32.3 c20,0,32.5,11,49.1,11c16,0,25.8-11,48.9-11c17.5,0,36,9.5,49.2,26C24.3,238.6,31.3,300.3,75,316.8L75,316.8z M0.8,170.6 c8.4-10.8,14.8-26,12.5-41.6c-13.7,0.9-29.8,9.7-39.1,21.1c-8.5,10.3-15.5,25.6-12.8,40.5C-23.7,191.1-8.2,182.1,0.8,170.6 L0.8,170.6z"></path></g></svg>
                      </span>
                      Get for Mac OS
                    </a>
                  </>
                )}
              </div>
            </div>
            <div className="relative">
              
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-4xl px-4 py-10">
        <h3 className="price-number text-center">Frequently Asked Questions</h3>
        <div className="mt-6 rounded-2xl bg-white dark:bg-transparent">
          {faqs.map((item, i) => (
            <div
              key={i}
              className={`px-4 ${i < faqs.length - 1 ? 'border-b border-zinc-200 dark:border-white/10' : ''}`}
            >
              <button
                onClick={() => setOpenFAQ((cur) => (cur === i ? null : i))}
                className="flex w-full items-center justify-between py-4 text-left text-lg md:text-xl"
              >
                <span className="font-medium">{item.q}</span>
                <ChevronDown
                  className={`h-5 w-5 transition ${openFAQ === i ? 'rotate-180' : ''}`}
                />
              </button>
              <div
                className={`overflow-hidden text-base font-light text-zinc-600 transition-[max-height] duration-300 dark:text-zinc-300 ${
                  openFAQ === i ? 'max-h-40 pb-4' : 'max-h-0'
                }`}
              >
                {item.a}
              </div>
            </div>
          ))}
        </div>
      </section>
        </>
      )}
      <Footer />
    </div>
  );
}
