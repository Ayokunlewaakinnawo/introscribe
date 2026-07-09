// Prevent removal by automated tools
import React from "react";

import { AlignJustify, ArrowRight, BookOpen, BriefcaseBusiness, Check, ChevronDown, ChevronUp, CircleHelp, Clock10, Command, Cookie, Copy, CornerDownLeft, Database, FileText, Globe, HatGlasses, Layers, Lock, Mail, MessageCircle, MessageSquareText, Mic, Monitor, Moon, Route, Send, Server, Shield, ShieldCheck, Sparkles, Sun, Target, Trash2, UserCheck, X, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SITE_URL, homeSeo, seoPagesBySlug } from "./seoPages";

const HERO_WORDS = ["Meetings", "Conversations", "Interviews"];
const BENEFIT_WORDS = ["Meeting", "Conversation", "Interview"];
const OVERLAY_COMPACT_BREAKPOINT = 730;

const upsertMeta = (selector, createAttrs, valueAttr, value) => {
  if (typeof document === "undefined") return;
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    Object.entries(createAttrs).forEach(([key, attrValue]) => {
      element.setAttribute(key, attrValue);
    });
    document.head.appendChild(element);
  }
  element.setAttribute(valueAttr, value);
};

const upsertCanonical = (href) => {
  if (typeof document === "undefined") return;
  let element = document.head.querySelector('link[rel="canonical"]');
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", "canonical");
    document.head.appendChild(element);
  }
  element.setAttribute("href", href);
};

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

const BenefitTypedWord = React.memo(function BenefitTypedWord({ words }) {
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
    <span className="benefit-typed-word" aria-label={words.join(", ")}>
      {typedText}
      <span className="typing-caret" aria-hidden="true"></span>
    </span>
  );
});

const SessionOverlayContent = ({ onCollapse, privateActive = false, onTogglePrivate }) => {
  const [activeTab, setActiveTab] = useState("assistant");

  const selectTab = (tab) => (event) => {
    event.stopPropagation();
    setActiveTab(tab);
  };

  return (
  <>
    <div className="session-overlay-topbar">
      <button
        type="button"
        className="session-end-button"
        aria-label="End session"
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.stopPropagation();
          onCollapse?.();
        }}
      >
        <ChevronUp className="h-5 w-5" strokeWidth={2.2} aria-hidden="true" />
        <span>End Session</span>
      </button>
      <button
        type="button"
        className="session-close-button"
        aria-label="Collapse overlay"
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.stopPropagation();
          onCollapse?.();
        }}
      >
        <X className="h-6 w-6" strokeWidth={3} aria-hidden="true" />
      </button>
    </div>

    <div className="session-assistant-panel">
      <div className="session-tabs" role="tablist" aria-label="Overlay content">
        <button
          type="button"
          className={`session-tab ${activeTab === "assistant" ? "session-tab--active" : ""}`}
          role="tab"
          aria-selected={activeTab === "assistant"}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={selectTab("assistant")}
        >
          Assistant
        </button>
        <button
          type="button"
          className={`session-tab ${activeTab === "transcript" ? "session-tab--active" : ""}`}
          role="tab"
          aria-selected={activeTab === "transcript"}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={selectTab("transcript")}
        >
          Transcript
        </button>
      </div>

      <button type="button" className="session-copy-button" aria-label="Copy content">
        <Copy className="h-4 w-4" strokeWidth={1.9} aria-hidden="true" />
      </button>

      <div className="session-panel-viewport">
        <div className={`session-panel-track ${activeTab === "transcript" ? "session-panel-track--transcript" : ""}`}>
          <div className="session-panel-page" role="tabpanel" aria-hidden={activeTab !== "assistant"}>
            <div className="session-ai-loading-row" aria-live="polite">
              <span className="session-ai-loading-icon" aria-hidden="true">
                <Sparkles />
              </span>
              <span className="session-ai-loading-text">
                Providing real-time response on what to say next in a conversation...
              </span>
            </div>

            <div className="session-prompt-row" aria-label="Assistant prompt actions">
              <button type="button" className="session-prompt-button">
                <MessageSquareText className="h-5 w-5" strokeWidth={2.2} aria-hidden="true" />
                <span>What to Say Next?</span>
              </button>
              <button type="button" className="session-prompt-button">
                <CircleHelp className="h-5 w-5" strokeWidth={2.2} aria-hidden="true" />
                <span>Follow-Up Question</span>
              </button>
              <button type="button" className="session-prompt-button">
                <AlignJustify className="h-5 w-5" strokeWidth={2.2} aria-hidden="true" />
                <span>How to Respond</span>
              </button>
              <button type="button" className="session-prompt-button">
                <FileText className="h-5 w-5" strokeWidth={2.2} aria-hidden="true" />
                <span>Recap</span>
              </button>
            </div>
          </div>

          <div className="session-panel-page" role="tabpanel" aria-hidden={activeTab !== "transcript"}>
            <div className="session-transcript-list" aria-label="Live transcript preview">
              <div className="session-transcript-line">
                <span className="session-transcript-speaker">Alex</span>
                <p>Let’s confirm the follow-up steps before the call ends.</p>
              </div>
              <div className="session-transcript-line">
                <span className="session-transcript-speaker">You</span>
                <p>I’ll send the notes, timeline, and proposed next actions today.</p>
              </div>
              <div className="session-transcript-line">
                <span className="session-transcript-speaker">Maya</span>
                <p>Great. Please include the decision summary and open questions.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="session-input-shell">
      <div className="session-input-text">
        Ask about your screen or conversation or , <Command className="h-6 w-6" strokeWidth={2.2} aria-hidden="true" /> + <CornerDownLeft className="h-5 w-5" strokeWidth={2.3} aria-hidden="true" />
      </div>
      <button type="button" className="session-send-button" aria-label="Send message">
        <Send className="h-6 w-6" fill="currentColor" strokeWidth={0} aria-hidden="true" />
      </button>
    </div>

    <div className="session-control-row">
      <button
        type="button"
        className={`session-icon-pill ${privateActive ? "session-icon-pill--active" : ""}`}
        aria-label="Private mode"
        aria-pressed={privateActive}
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.stopPropagation();
          onTogglePrivate?.();
        }}
      >
        <HatGlasses className="h-7 w-7" strokeWidth={1.7} aria-hidden="true" />
      </button>
      <button type="button" className="session-control-pill">
        <Monitor className="h-7 w-7" strokeWidth={1.65} aria-hidden="true" />
        <span>Use Screen</span>
      </button>
      <button type="button" className="session-control-pill">
        <Globe className="h-7 w-7" strokeWidth={1.65} aria-hidden="true" />
        <span>Web Search</span>
      </button>
      <button type="button" className="session-control-pill">
        <Zap className="h-7 w-7" strokeWidth={1.65} aria-hidden="true" />
        <span>Smart</span>
      </button>
    </div>
  </>
  );
};

const DraggableSessionOverlay = () => {
  const overlayScale = 0.62;
  const stageRef = useRef(null);
  const panelRef = useRef(null);
  const dragRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(`(max-width: ${OVERLAY_COMPACT_BREAKPOINT}px)`);
    const handleResponsiveCollapse = () => {
      setCollapsed(mediaQuery.matches);
    };

    handleResponsiveCollapse();
    mediaQuery.addEventListener?.("change", handleResponsiveCollapse);
    return () => {
      mediaQuery.removeEventListener?.("change", handleResponsiveCollapse);
    };
  }, []);

  const clampPosition = (nextX, nextY) => {
    const stage = stageRef.current;
    const panel = panelRef.current;
    if (!stage || !panel) {
      return { x: nextX, y: nextY };
    }

    const stageRect = stage.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();
    const maxX = Math.max(0, stageRect.width - panelRect.width);
    const maxY = Math.max(0, stageRect.height - panelRect.height);

    return {
      x: Math.min(Math.max(nextX, 0), maxX),
      y: Math.min(Math.max(nextY, 0), maxY),
    };
  };

  const getBottomCenterPosition = () => {
    const stage = stageRef.current;
    const panel = panelRef.current;
    if (!stage || !panel) {
      return { x: 0, y: 0 };
    }

    const stageRect = stage.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();
    return clampPosition(
      (stageRect.width - panelRect.width) / 2.15,
      (stageRect.height - panelRect.height) / 30
    );
  };

  useEffect(() => {
    const handleResize = () => {
      setPosition(getBottomCenterPosition());
    };

    window.addEventListener("resize", handleResize);
    const frame = requestAnimationFrame(handleResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", handleResize);
    };
  }, [collapsed]);

  const handlePointerDown = (event) => {
    if (event.button !== undefined && event.button !== 0) return;

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: position.x,
      originY: position.y,
    };

    event.currentTarget.setPointerCapture?.(event.pointerId);
    setDragging(true);
  };

  const handlePointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const nextX = drag.originX + event.clientX - drag.startX;
    const nextY = drag.originY + event.clientY - drag.startY;
    setPosition(clampPosition(nextX, nextY));
  };

  const stopDrag = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    event.currentTarget.releasePointerCapture?.(event.pointerId);
    dragRef.current = null;
    setDragging(false);
  };

  return (
    <div ref={stageRef} className="relative mx-auto mt-12 w-full max-w-6xl px-4 phone-mock-animate mockup-container overflow-hidden session-overlay-stage">
      <video
        src="/introscribe_landing.mp4"
        className="mx-auto w-full max-w-[1120px] mockup-video"
        autoPlay
        muted
        loop
        playsInline
        controls={false}
      />

      <div
        ref={panelRef}
        className={`introscribe-session-overlay session-overlay-landing ${collapsed ? "session-overlay-collapsed" : ""} ${dragging ? "is-dragging" : ""}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: `scale(${overlayScale})`,
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDrag}
        onPointerCancel={stopDrag}
        aria-label="Draggable Introscribe assistant overlay"
      >
        {collapsed ? (
          <div className="session-collapsed-bar" aria-label="Collapsed Introscribe controls">
            <button type="button" className="session-collapsed-icon" aria-label="Private mode">
              <HatGlasses aria-hidden="true" />
            </button>
            <button
              type="button"
              className="session-start-button"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                setCollapsed(false);
              }}
            >
              <Mic aria-hidden="true" />
              <span>Start Listening</span>
            </button>
            <button
              type="button"
              className="session-collapsed-icon"
              aria-label="Expand overlay"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                setCollapsed(false);
              }}
            >
              <ChevronDown aria-hidden="true" />
            </button>
            <button type="button" className="session-collapsed-icon session-collapsed-icon--danger" aria-label="Close">
              <X aria-hidden="true" />
            </button>
          </div>
	        ) : (
	          <SessionOverlayContent onCollapse={() => setCollapsed(true)} />
	        )}
      </div>
    </div>
  );
};

const DraggableFeatureSessionOverlay = ({
  stageRef,
  defaultCollapsed = false,
  responsiveCollapseBelow = null,
  compactLabel = "Start Listening",
  compactButtonTone = "primary",
  initialPrivateActive = true,
  className = "",
}) => {
  const overlayScale = 0.78;
  const panelRef = useRef(null);
  const dragRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [privateActive, setPrivateActive] = useState(initialPrivateActive);

  useEffect(() => {
    if (typeof window === "undefined" || !responsiveCollapseBelow) return;

    const mediaQuery = window.matchMedia(`(max-width: ${responsiveCollapseBelow}px)`);
    const handleResponsiveCollapse = () => {
      setCollapsed(mediaQuery.matches ? true : defaultCollapsed);
    };

    handleResponsiveCollapse();
    mediaQuery.addEventListener?.("change", handleResponsiveCollapse);
    return () => {
      mediaQuery.removeEventListener?.("change", handleResponsiveCollapse);
    };
  }, [defaultCollapsed, responsiveCollapseBelow]);

  const clampPosition = (nextX, nextY) => {
    const stage = stageRef.current;
    const panel = panelRef.current;
    if (!stage || !panel) {
      return { x: nextX, y: nextY };
    }

    const stageRect = stage.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();
    const maxX = Math.max(0, stageRect.width - panelRect.width);
    const maxY = Math.max(0, stageRect.height - panelRect.height);

    return {
      x: Math.min(Math.max(nextX, 0), maxX),
      y: Math.min(Math.max(nextY, 0), maxY),
    };
  };

  const getCenterPosition = () => {
    const stage = stageRef.current;
    const panel = panelRef.current;
    if (!stage || !panel) {
      return { x: 0, y: 0 };
    }

    const stageRect = stage.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();
    return clampPosition(
      (stageRect.width - panelRect.width) / 2,
      (stageRect.height - panelRect.height) / 2
    );
  };

  useEffect(() => {
    const handleResize = () => {
      setPosition(getCenterPosition());
    };

    window.addEventListener("resize", handleResize);
    const frame = requestAnimationFrame(handleResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", handleResize);
    };
  }, [collapsed]);

  const handlePointerDown = (event) => {
    if (event.button !== undefined && event.button !== 0) return;

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: position.x,
      originY: position.y,
    };

    event.currentTarget.setPointerCapture?.(event.pointerId);
    setDragging(true);
  };

  const handlePointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const nextX = drag.originX + event.clientX - drag.startX;
    const nextY = drag.originY + event.clientY - drag.startY;
    setPosition(clampPosition(nextX, nextY));
  };

  const stopDrag = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    event.currentTarget.releasePointerCapture?.(event.pointerId);
    dragRef.current = null;
    setDragging(false);
  };

  return (
    <div
      ref={panelRef}
      className={`introscribe-session-overlay feature-session-overlay ${className} ${collapsed ? "session-overlay-collapsed" : ""} ${dragging ? "is-dragging" : ""} ${privateActive ? "feature-session-overlay--private" : ""}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `scale(${overlayScale})`,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={stopDrag}
      onPointerCancel={stopDrag}
      aria-label="Draggable Introscribe assistant overlay preview"
    >
      {collapsed ? (
        <div className="session-collapsed-bar" aria-label="Collapsed Introscribe controls">
          <button type="button" className="session-collapsed-icon" aria-label="Private mode">
            <HatGlasses aria-hidden="true" />
          </button>
          <button
            type="button"
            className={`session-start-button ${compactButtonTone === "danger" ? "session-start-button--danger" : ""}`}
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
              setCollapsed(false);
            }}
          >
            <Mic aria-hidden="true" />
            <span>{compactLabel}</span>
          </button>
          <button
            type="button"
            className="session-collapsed-icon"
            aria-label="Expand overlay"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
              setCollapsed(false);
            }}
          >
            <ChevronDown aria-hidden="true" />
          </button>
          <button type="button" className="session-collapsed-icon session-collapsed-icon--danger" aria-label="Close">
            <X aria-hidden="true" />
          </button>
        </div>
      ) : (
        <SessionOverlayContent
          onCollapse={() => setCollapsed(true)}
          privateActive={privateActive}
          onTogglePrivate={() => setPrivateActive((active) => !active)}
        />
      )}
    </div>
  );
};

// Single-file, production-ready landing page inspired by the provided mockup.
// Tailwind CSS is available in this Canvas preview.

const DOWNLOADS_BASE_URL = "https://storage.googleapis.com/introscribe_bucket/download";
const DOWNLOAD_FILES = {
  windows: {
    url: `${DOWNLOADS_BASE_URL}/win_os/introscribe-windows.exe`,
  },
  mac: {
    url: `${DOWNLOADS_BASE_URL}/mac_os/introscribe-mac.pkg`,
  },
};

const FOOTER_USE_CASES = [
  { label: "AI Interview Assistant for Real-Time Interview Help", slug: "ai-interview-assistant" },
  { label: "AI Meeting Assistant for Live Notes and Answers", slug: "ai-meeting-assistant" },
  { label: "Real-Time Conversation Assistant for Professional Calls", slug: "real-time-conversation-assistant" },
  { label: "AI Sales Call Assistant for Live Conversations", slug: "sales-call-assistant" },
  { label: "Live Transcription Software with Real-Time AI", slug: "live-transcription-software" },
  { label: "Cluely Alternative for Meetings and Interviews", slug: "cluely-alternative" },
  { label: "FinalRound AI Alternative for Interview Support", slug: "finalround-ai-alternative" },
  { label: "Otter.ai Alternative for Live AI Meeting Help", slug: "otter-ai-alternative" },
  { label: "Fireflies.ai Alternative for Real-Time Meeting Assistance", slug: "fireflies-ai-alternative" },
  { label: "Gong Alternative for Sales Call Assistance", slug: "gong-alternative" },
];

export default function introscribeLanding() {
  const baseUrl = (import.meta?.env?.BASE_URL ?? '/').replace(/\/?$/, '/');
  const windowsInstaller = DOWNLOAD_FILES.windows.url;
  const macInstaller = DOWNLOAD_FILES.mac.url;
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
  const [privacySplit, setPrivacySplit] = useState(50);
  const privacyPreviewRef = useRef(null);
  const privacyAnimationRef = useRef(null);
  const privacyDemoPlayedRef = useRef(false);
  const featureOverlayStageRef = useRef(null);
  const transcriptionOverlayStageRef = useRef(null);
  const monthlyBtnRef = useRef(null);
  const yearlyBtnRef = useRef(null);
  const indicatorRef = useRef(null);
  const [os, setOs] = useState(() => detectPlatform());
  const [showDesktopModal, setShowDesktopModal] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [shareStatus, setShareStatus] = useState("");
  const [showCookieSettings, setShowCookieSettings] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState(() => {
    try {
      const stored = localStorage.getItem("cookiePreferences");
      if (stored) {
        return { essential: true, analytics: false, product: false, ...JSON.parse(stored) };
      }
    } catch {}
    return { essential: true, analytics: false, product: false };
  });
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

  useEffect(() => {
    const element = privacyPreviewRef.current;
    if (!element || typeof window === "undefined") return;

    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduceMotion) return;

    const runSliderDemo = () => {
      if (privacyDemoPlayedRef.current) return;

      privacyDemoPlayedRef.current = true;
	      const path = [
	        { at: 0, value: 50 },
	        { at: 760, value: 18 },
	        { at: 2140, value: 82 },
	        { at: 3200, value: 50 },
	      ];
	      const duration = path[path.length - 1].at;
	      const startedAt = performance.now();
	      const easeInOut = (t) =>
	        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      const tick = (now) => {
        const elapsed = Math.min(now - startedAt, duration);
        let current = path[0].value;

        for (let index = 1; index < path.length; index += 1) {
          const previous = path[index - 1];
          const next = path[index];
	          if (elapsed <= next.at) {
	            const segmentProgress = (elapsed - previous.at) / (next.at - previous.at);
	            current = previous.value + (next.value - previous.value) * easeInOut(segmentProgress);
	            break;
	          }
        }

        setPrivacySplit(Number(current.toFixed(1)));

        if (elapsed < duration) {
          privacyAnimationRef.current = requestAnimationFrame(tick);
        } else {
          setPrivacySplit(50);
          privacyAnimationRef.current = null;
        }
      };

      privacyAnimationRef.current = requestAnimationFrame(tick);
    };

    if (typeof IntersectionObserver === "undefined") {
      runSliderDemo();
      return () => {
        if (privacyAnimationRef.current) {
          cancelAnimationFrame(privacyAnimationRef.current);
        }
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          runSliderDemo();
          observer.disconnect();
        }
      },
      { threshold: 0.42 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (privacyAnimationRef.current) {
        cancelAnimationFrame(privacyAnimationRef.current);
      }
    };
  }, []);

  const [openFAQ, setOpenFAQ] = useState(0);

  const handlePrivacySplitChange = (event) => {
    if (privacyAnimationRef.current) {
      cancelAnimationFrame(privacyAnimationRef.current);
      privacyAnimationRef.current = null;
    }
    privacyDemoPlayedRef.current = true;
    setPrivacySplit(Number(event.target.value));
  };

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

  const persistCookiePreferences = (preferences) => {
    const nextPreferences = {
      ...preferences,
      essential: true,
      updatedAt: new Date().toISOString(),
    };
    setCookiePreferences(nextPreferences);
    try {
      localStorage.setItem("cookiePreferences", JSON.stringify(nextPreferences));
    } catch {}
    setShowCookieSettings(false);
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

  const CookieSettingsModal = () => (
    <div className="cookie-settings-modal" role="dialog" aria-modal="true" aria-labelledby="cookie-settings-title">
      <button
        type="button"
        className="cookie-settings-modal__backdrop"
        aria-label="Close cookie settings"
        onClick={() => setShowCookieSettings(false)}
      ></button>
      <div className="cookie-settings-modal__card">
        <div className="cookie-settings-modal__header">
          <span className="cookie-settings-modal__icon" aria-hidden="true">
            <Cookie />
          </span>
          <div>
            <p className="cookie-settings-modal__eyebrow">Privacy controls</p>
            <h2 id="cookie-settings-title">Cookie Settings</h2>
          </div>
          <button
            type="button"
            className="cookie-settings-modal__close"
            aria-label="Close cookie settings"
            onClick={() => setShowCookieSettings(false)}
          >
            <X aria-hidden="true" />
          </button>
        </div>

        <p className="cookie-settings-modal__lead">
          Choose which optional cookies and local storage entries Introscribe can use on this website.
        </p>

        <div className="cookie-settings-list">
          <div className="cookie-settings-row">
            <div>
              <h3>Essential</h3>
              <p>Required for core site behavior, authentication, security, and remembering your theme.</p>
            </div>
            <span className="cookie-settings-required">Always on</span>
          </div>

          {[
            {
              key: "analytics",
              title: "Analytics",
              body: "Helps us understand aggregate site usage and improve page performance.",
            },
            {
              key: "product",
              title: "Product updates",
              body: "Allows us to remember lightweight preferences for product announcements and onboarding.",
            },
          ].map((item) => (
            <label key={item.key} className="cookie-settings-row cookie-settings-row--toggle">
              <div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
              <input
                type="checkbox"
                checked={Boolean(cookiePreferences[item.key])}
                onChange={(event) => {
                  const checked = event.target.checked;
                  setCookiePreferences((preferences) => ({
                    ...preferences,
                    [item.key]: checked,
                  }));
                }}
              />
              <span className="cookie-settings-switch" aria-hidden="true"></span>
            </label>
          ))}
        </div>

        <div className="cookie-settings-actions">
          <button
            type="button"
            className="cookie-settings-action cookie-settings-action--ghost"
            onClick={() => persistCookiePreferences({ essential: true, analytics: false, product: false })}
          >
            Reject optional
          </button>
          <button
            type="button"
            className="cookie-settings-action cookie-settings-action--ghost"
            onClick={() => persistCookiePreferences({ essential: true, analytics: true, product: true })}
          >
            Accept all
          </button>
          <button
            type="button"
            className="cookie-settings-action"
            onClick={() => persistCookiePreferences(cookiePreferences)}
          >
            Save choices
          </button>
        </div>
      </div>
    </div>
  );

  const normalizePath = (value) => {
    const normalized = value.replace(/\/$/, "");
    return normalized === "" ? "/" : normalized;
  };

  const currentPath = typeof window !== "undefined" ? window.location.pathname : "/";
  const normalizedBase = normalizePath(baseUrl);
  const normalizedPath = normalizePath(currentPath);
  const currentSlug = (() => {
    if (normalizedPath === normalizedBase) return "";
    if (normalizedBase !== "/" && normalizedPath.startsWith(`${normalizedBase}/`)) {
      return normalizedPath.slice(normalizedBase.length + 1);
    }
    return normalizedPath.replace(/^\//, "");
  })();
  const isPrivacyPage = currentSlug === "privacy" || currentSlug === "privacy-policy";
  const isTermsPage = currentSlug === "terms" || currentSlug === "terms-of-service";
  const isDownloadPage = currentSlug === "download";
  const activeSeoPage = currentSlug && !isPrivacyPage && !isTermsPage && !isDownloadPage ? seoPagesBySlug[currentSlug] : null;
  const showNotFound = Boolean(currentSlug && !isPrivacyPage && !isTermsPage && !isDownloadPage && !activeSeoPage);
  const privacySeo = {
    title: "Privacy Policy | Introscribe",
    description:
      "Read the Introscribe Privacy Policy. Learn what data we collect, how we use it, how audio and transcripts are handled, and the controls you have over your information.",
    canonicalPath: "/privacy",
  };
  const termsSeo = {
    title: "Terms of Service | Introscribe",
    description:
      "Read the Introscribe Terms of Service. Understand the rules for using our desktop app and website, account responsibilities, subscriptions, acceptable use, and disclaimers.",
    canonicalPath: "/terms",
  };
  const downloadSeo = {
    title: "Download the Introscribe Desktop App | Introscribe",
    description:
      "Download the Introscribe desktop app for macOS and Windows. Get real-time meeting notes, live transcription, and AI assistance on your desktop.",
    canonicalPath: "/download",
  };
  const pageSeo = isPrivacyPage
    ? privacySeo
    : isTermsPage
      ? termsSeo
      : isDownloadPage
        ? downloadSeo
        : (activeSeoPage ?? homeSeo);
  const canonicalUrl = `${SITE_URL}${pageSeo.canonicalPath === "/" ? "/" : pageSeo.canonicalPath}`;

  useEffect(() => {
    document.title = pageSeo.title;
    upsertMeta('meta[name="description"]', { name: "description" }, "content", pageSeo.description);
    upsertMeta('meta[property="og:title"]', { property: "og:title" }, "content", pageSeo.title);
    upsertMeta('meta[property="og:description"]', { property: "og:description" }, "content", pageSeo.description);
    upsertMeta('meta[property="og:url"]', { property: "og:url" }, "content", canonicalUrl);
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title" }, "content", pageSeo.title);
    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description" }, "content", pageSeo.description);
    upsertCanonical(canonicalUrl);
  }, [canonicalUrl, pageSeo.description, pageSeo.title]);

  useEffect(() => {
    if (activeSeoPage || isPrivacyPage || isTermsPage || isDownloadPage || showNotFound || typeof window === "undefined") return;

    let observer;
    let loadHandler;
    let frameId;
    let revealElements = [];

    const setupScrollReveal = () => {
      const root = document.querySelector("[data-scroll-reveal-root]");
      if (!root) return;

      const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
      const selectors = [
        "#benefits > h2",
        "#benefits > p",
        ".benefit-glass",
        "#how > div > div > .mx-auto:first-child",
        ".privacy-preview-column",
        ".ask-clarify-preview-card",
        ".feature-overlay-preview-stage",
        ".transcription-stats",
        ".transcription-stat-row",
        "#pricing > .text-center",
        ".pricing-card",
        "#faq > h3",
        "#faq > div > div",
      ].join(",");

      revealElements = Array.from(root.querySelectorAll(selectors)).filter((element, index, all) => {
        return (
          all.indexOf(element) === index &&
          !element.closest(".landing-bg") &&
          !element.closest(".introscribe-session-overlay")
        );
      });

      if (!revealElements.length) return;

      root.classList.add("scroll-reveal-ready");
      revealElements.forEach((element, index) => {
        element.classList.add("scroll-reveal");
        element.style.setProperty("--scroll-reveal-delay", `${Math.min((index % 8) * 55, 385)}ms`);
      });

      if (reduceMotion || typeof IntersectionObserver === "undefined") {
        revealElements.forEach((element) => element.classList.add("is-visible"));
        return;
      }

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          });
        },
        {
          rootMargin: "0px 0px -2% 0px",
          threshold: 0.04,
        }
      );

      revealElements.forEach((element) => observer.observe(element));
    };

    if (document.readyState === "complete") {
      frameId = requestAnimationFrame(setupScrollReveal);
    } else {
      loadHandler = () => {
        frameId = requestAnimationFrame(setupScrollReveal);
      };
      window.addEventListener("load", loadHandler, { once: true });
    }

    return () => {
      if (loadHandler) window.removeEventListener("load", loadHandler);
      if (frameId) cancelAnimationFrame(frameId);
      observer?.disconnect();
      revealElements.forEach((element) => {
        element.classList.remove("scroll-reveal", "is-visible");
        element.style.removeProperty("--scroll-reveal-delay");
      });
      document.querySelector("[data-scroll-reveal-root]")?.classList.remove("scroll-reveal-ready");
    };
  }, [activeSeoPage, isPrivacyPage, isTermsPage, isDownloadPage, showNotFound]);

  const Header = () => (
    <header className="relative z-50">
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
	          <a href={`${baseUrl}#how`}>Features</a>
	          <a href={`${baseUrl}#faq`}>FAQ</a>
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
    <footer className="footer-shell">
      <div className="footer-giant-logo" aria-hidden="true">
        <img src="/logo-b.png" alt="" className="footer-giant-logo__light" decoding="async" />
        <img src="/logo-w.png" alt="" className="footer-giant-logo__dark" decoding="async" />
      </div>

      <div className="footer-card">
        <div className="footer-main-grid">
          <div className="footer-brand-block">
            <a href={baseUrl} aria-label="Go to landing page" className="footer-brand-link">
              <img
                src="/logo-b.png"
                alt="introscribe logo"
                className="footer-brand-logo footer-brand-logo__light"
                decoding="async"
              />
              <img
                src="/logo-w.png"
                alt="introscribe logo (dark)"
                className="footer-brand-logo footer-brand-logo__dark"
                decoding="async"
                aria-hidden="true"
              />
            </a>
            <p className="footer-brand-copy">
              AI meeting companion that records, transcribes, and turns live conversations into clear outcomes.
            </p>
            <a href="mailto:support@introscribe.com" className="footer-contact-link">
              Contact us
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>

          <div>
            <h2 className="footer-heading">Product</h2>
            <ul className="footer-link-list">
              <li><a href={`${baseUrl}#benefits`}>Overview</a></li>
              <li><a href={`${baseUrl}#pricing`}>Pricing</a></li>
              <li><a href={`${baseUrl}#faq`}>FAQ</a></li>
            </ul>
          </div>

          <div>
            <h2 className="footer-heading">Resources</h2>
            <ul className="footer-link-list">
              <li><a href={`${baseUrl}#benefits`}>Features</a></li>
              <li><a href={`${baseUrl}#how`}>Use Cases</a></li>
              <li><a href={`${baseUrl}#pricing`}>Plans</a></li>
              <li><a href="mailto:support@introscribe.com">Support</a></li>
            </ul>
          </div>

          <div>
            <h2 className="footer-heading">Company</h2>
            <ul className="footer-link-list">
              <li><a href="mailto:support@introscribe.com">Contact</a></li>
              <li><a href={`${baseUrl}download`}>Download</a></li>
              <li><a href={`${baseUrl}#pricing`}>Pricing</a></li>
            </ul>
          </div>

          <div className="sr-only">
            <h2 className="footer-heading">Use Cases</h2>
            <ul className="footer-link-list">
              {FOOTER_USE_CASES.map((item) => (
                <li key={item.slug}>
                  <a href={`${baseUrl}${item.slug}`}>{item.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-bottom-row">
          <p>© {new Date().getFullYear()} Introscribe. All rights reserved.</p>
          <div className="footer-legal-links">
            <a href={`${baseUrl}privacy`}>Privacy Policy</a>
            <a href={`${baseUrl}terms`}>Terms of Service</a>
            <a
              href={`${baseUrl}privacy#cookies`}
              onClick={(event) => {
                event.preventDefault();
                setShowCookieSettings(true);
              }}
            >
              Cookie Settings
            </a>
          </div>
        </div>
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
        "Whether you're in an interview, a virtual meeting, or a brainstorming session, the always on overlay is only ever visible to you whenever you screen share or record.",
      img: "exchange",
    },
    {
      icon: Sparkles,
      tag: "Notes",
      title: "Smart AI Note‑Taking",
      desc:
        "Skip the scribbling. Introscribe listens in the background and turns messy conversations into clean, structured notes — decisions, action items, and key moments captured the moment they happen, so you leave every call with a ready‑to‑share recap.",
      img: "answers",
    },
    {
      icon: Mic,
      tag: "Transcription",
      title: "Real-time transcription",
      desc:
        "Fast, accurate live transcription that keeps every conversation searchable and easy to follow.",
      img: "privacy",
      stats: [
        {
          value: "12+",
          label: "Languages",
          text: "We support over 12 different languages, including English, Chinese, Spanish, and more.",
        },
        {
          value: "300ms",
          label: "Response time",
          text: "We have the fastest live transcription available. Test us against any other competitor.",
        },
        {
          value: "95%",
          label: "Transcription accuracy",
          text: "Trusted by many teams for reliable transcription. All processed with industry-leading accuracy.",
        },
      ],
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
      priceY: 9.59, // monthly * 0.8 with 20% annual discount (billed yearly)
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
      priceM: 20.99,
      priceY: 16.79, // monthly * 0.8 with 20% annual discount (billed yearly)
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
            <span className="price-cycle">/ month</span>
          </>
        )}
      </div>
    );
  };

  const downloadOptions = os === "mac"
    ? [
        { label: "Get for Mac OS", platform: "mac", href: macInstaller },
        { label: "Get for Windows", platform: "windows", href: windowsInstaller },
      ]
    : [
        { label: "Get for Windows", platform: "windows", href: windowsInstaller },
        { label: "Get for Mac OS", platform: "mac", href: macInstaller },
      ];

  const DownloadPlatformIcon = ({ platform }) => (
    <span className="download-icon-box">
      {platform === "mac" ? (
        <svg fill="#ffffff" height="14px" width="14px" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="-145 129 220 256" aria-hidden="true" focusable="false">
          <g>
            <path d="M75,316.8c-6,13.3-8.9,19.3-16.6,31c-10.8,16.4-26,36.9-44.9,37.1c-16.8,0.2-21.1-10.9-43.8-10.8 c-22.7,0.1-27.5,11-44.3,10.8c-18.9-0.2-33.3-18.7-44.1-35.1c-30.2-46-33.4-99.9-14.7-128.6c13.2-20.4,34.1-32.3,53.8-32.3 c20,0,32.5,11,49.1,11c16,0,25.8-11,48.9-11c17.5,0,36,9.5,49.2,26C24.3,238.6,31.3,300.3,75,316.8L75,316.8z M0.8,170.6 c8.4-10.8,14.8-26,12.5-41.6c-13.7,0.9-29.8,9.7-39.1,21.1c-8.5,10.3-15.5,25.6-12.8,40.5C-23.7,191.1-8.2,182.1,0.8,170.6 L0.8,170.6z"></path>
          </g>
        </svg>
      ) : (
        <svg width="15" height="15" viewBox="0 0 19.132 19.132" fill="#ffffff" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
          <g>
            <path d="M9.172 9.179V0.146H0v9.033h9.172z" />
            <path d="M19.132 9.179V0.146H9.959v9.033h9.173z" />
            <path d="M19.132 18.986V9.955H9.959v9.032h9.173z" />
            <path d="M9.172 18.986V9.955H0v9.032h9.172z" />
          </g>
        </svg>
      )}
    </span>
  );

  const DownloadPage = () => {
    const primaryDownload = os === "windows"
      ? { label: "Download for Windows", platform: "windows", href: windowsInstaller }
      : { label: "Download for Mac", platform: "mac", href: macInstaller };
    const secondaryDownload = primaryDownload.platform === "mac"
      ? { label: "Download for Windows", platform: "windows", href: windowsInstaller }
      : { label: "Download for Mac", platform: "mac", href: macInstaller };
    const requirements = [
      {
        platform: "mac",
        title: "macOS",
        items: [
          "macOS 10.15 (Catalina) or later",
          "Apple Silicon or Intel processor",
          "500 MB free disk space",
          "8 GB RAM recommended",
        ],
      },
      {
        platform: "windows",
        title: "Windows",
        items: [
          "Windows 11",
          "x64 (64-bit) processor",
          "500 MB free disk space",
          "8 GB RAM recommended",
        ],
      },
    ];

    return (
      <main className="download-page">
        <section className="download-page-hero">
          <div className="download-page-container">
            <img
              src="/ty.png"
              alt=""
              className="download-page-hero-image"
              loading="lazy"
              decoding="async"
              aria-hidden="true"
            />
            <h1>Download the Introscribe desktop app</h1>
            <p>
              Introscribe takes perfect meeting notes and gives you real-time answers,
              all while staying private. Available for macOS and Windows.
            </p>
            <div className="download-page-actions">
              {isMobile ? (
                <DesktopRequiredCTA tone="light" />
              ) : (
                <>
                  <a href={primaryDownload.href} className="download-page-primary">
                    <DownloadPlatformIcon platform={primaryDownload.platform} />
                    {primaryDownload.label}
                  </a>
                  <a href={secondaryDownload.href} className="download-page-secondary">
                    {secondaryDownload.label}
                  </a>
                </>
              )}
            </div>
          </div>
        </section>

        <section className="download-requirements" aria-labelledby="download-requirements-title">
          <div className="download-requirements-grid">
            <div className="download-requirements-label">
              <h2 id="download-requirements-title">System requirements for optimal performance.</h2>
            </div>
            {requirements.map((group) => (
              <article key={group.platform} className="download-requirement-card">
                <h3>
                  <DownloadPlatformIcon platform={group.platform} />
                  <span>{group.title}</span>
                </h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      </main>
    );
  };

  const SeoCardIcon = ({ heading }) => {
    const text = heading.toLowerCase();
    const Icon = text.includes("transcription") || text.includes("speech") || text.includes("transcript")
      ? Mic
      : text.includes("meeting") || text.includes("call") || text.includes("conversation")
        ? MessageSquareText
        : text.includes("interview") || text.includes("behavioral") || text.includes("technical") || text.includes("roles")
          ? BriefcaseBusiness
          : text.includes("workflow") || text.includes("support") || text.includes("prepare") || text.includes("preparation")
            ? Route
            : text.includes("context") || text.includes("notes") || text.includes("capture")
              ? FileText
              : text.includes("tradeoff") || text.includes("structure") || text.includes("requirements")
                ? Layers
                : text.includes("answer") || text.includes("respond") || text.includes("objection")
                  ? Target
                  : text.includes("desktop") || text.includes("platform") || text.includes("stack")
                    ? Monitor
                    : BookOpen;

    return (
      <span className="seo-card-icon" aria-hidden="true">
        <Icon />
      </span>
    );
  };

  const SeoContentPage = ({ page }) => (
    <main className="seo-page">
      <section className="seo-download-hero">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <p className="seo-eyebrow">Introscribe AI Assistant</p>
            <h1 className="text-balance">{page.h1}</h1>
            <p className="seo-intro">{page.intro}</p>
            <div className="seo-actions">
              {isMobile ? (
                <DesktopRequiredCTA tone="light" align="start" />
              ) : (
                downloadOptions.map((opt) => (
                  <a
                    key={opt.label}
                    href={opt.href}
                    className="seo-download-button"
                  >
                    <DownloadPlatformIcon platform={opt.platform} />
                    {opt.label}
                  </a>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-4 py-12 md:grid-cols-3">
        {page.sections.map((section) => (
          <article key={section.heading} className="seo-card">
            <h2>
              <SeoCardIcon heading={section.heading} />
              <span>{section.heading}</span>
            </h2>
            <p>{section.body}</p>
          </article>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="seo-split">
          <div>
            <p className="seo-eyebrow">Search intent coverage</p>
            <h2>Related ways people search for this</h2>
            <p>
              This page is written around one clear topic, with related phrases grouped naturally instead of stuffed into hidden metadata.
            </p>
          </div>
          <div className="seo-keywords" aria-label="Related search phrases">
            {page.relatedKeywords.map((keyword) => (
              <span key={keyword}>{keyword}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-10">
        <p className="seo-eyebrow text-center">FAQ</p>
        <h2 className="seo-faq-title">Common questions</h2>
        <div className="seo-faq-list">
          {page.faqs.map((faq) => (
            <article key={faq.q} className="seo-faq-item">
              <h3>{faq.q}</h3>
              <p>{faq.a}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="seo-cta">
          <div>
            <p className="seo-eyebrow">Get started</p>
            <h2>Use Introscribe in your next live conversation</h2>
            <p>Download the desktop app for real-time transcription, meeting notes, interview support, and contextual AI answers.</p>
          </div>
          <a href={baseUrl} className="seo-secondary-link seo-secondary-link--dark">
            Back to homepage
          </a>
        </div>
      </section>
    </main>
  );

  const PRIVACY_LAST_UPDATED = "July 1, 2026";

  const PRIVACY_HIGHLIGHTS = [
    {
      icon: ShieldCheck,
      title: "Privacy‑first by design",
      body:
        "Introscribe runs as a desktop app. Your microphone and system audio stay on your device by default, and the always‑on overlay is only ever visible to you.",
    },
    {
      icon: Lock,
      title: "You own your transcripts",
      body:
        "Meeting notes, transcripts, and prompts belong to you. You can delete them at any time from the app, and account deletion removes them from our systems.",
    },
    {
      icon: UserCheck,
      title: "No selling. No ad targeting.",
      body:
        "We do not sell your personal information and we do not use your conversations to build advertising profiles or train third‑party models without your consent.",
    },
  ];

  const PRIVACY_SECTIONS = [
    {
      icon: FileText,
      title: "1. Information We Collect",
      body: (
        <>
          <p>We collect the minimum information needed to run Introscribe and keep it reliable, secure, and useful to you:</p>
          <ul className="privacy-list">
            <li><strong>Account information:</strong> your name, email address, and (if you subscribe) billing details processed by our payment provider.</li>
            <li><strong>Audio you choose to capture:</strong> microphone input and system audio from meetings, interviews, and conversations that you actively start in the app.</li>
            <li><strong>Transcripts and prompts:</strong> text generated from your audio, plus any questions, notes, or context you send to the AI assistant.</li>
            <li><strong>Device and app data:</strong> operating system, app version, crash reports, and diagnostic logs that help us fix bugs.</li>
            <li><strong>Usage data:</strong> aggregate signals such as feature usage and session counts, used to improve Introscribe.</li>
          </ul>
        </>
      ),
    },
    {
      icon: Target,
      title: "2. How We Use Your Information",
      body: (
        <>
          <p>We use the information we collect to:</p>
          <ul className="privacy-list">
            <li>Provide live transcription, AI answers, notes, and other core Introscribe features.</li>
            <li>Authenticate your account, manage subscriptions, and process payments.</li>
            <li>Improve reliability, performance, and product quality through diagnostics and aggregated analytics.</li>
            <li>Communicate with you about product updates, security notices, and support requests.</li>
            <li>Prevent fraud, abuse, and violations of our Terms of Service.</li>
          </ul>
          <p>We do not use your conversation content to train third‑party foundation models, and we do not sell your personal information.</p>
        </>
      ),
    },
    {
      icon: Mic,
      title: "3. Audio, Transcripts, and AI Processing",
      body: (
        <>
          <p>Introscribe is built for real‑time conversations. When you start a session:</p>
          <ul className="privacy-list">
            <li>Audio is captured on your device and streamed to our transcription and AI providers only for the duration of the request.</li>
            <li>Transcripts and AI responses are returned to your device and stored under your account so you can review them later.</li>
            <li>You can pause capture, end a session, or delete a transcript at any time from within the app.</li>
            <li>Because Introscribe runs as a desktop overlay that is only visible to you, other participants on a call do not see your prompts or answers.</li>
          </ul>
          <p>You are responsible for complying with local laws about recording and transcribing conversations, including any notice or consent requirements.</p>
        </>
      ),
    },
    {
      icon: Server,
      title: "4. How We Store and Protect Your Data",
      body: (
        <>
          <p>Your data is stored using industry‑standard cloud infrastructure with encryption in transit (TLS) and encryption at rest. Access to production systems is restricted to a small number of authorized engineers and is logged and audited.</p>
          <p>We retain your transcripts and notes for as long as your account is active or as needed to provide the service. When you delete content or your account, we remove it from our active systems within a reasonable period, subject to backup retention windows and legal obligations.</p>
        </>
      ),
    },
    {
      icon: Database,
      title: "5. Third‑Party Services",
      body: (
        <>
          <p>To operate Introscribe we rely on a small set of trusted vendors, including:</p>
          <ul className="privacy-list">
            <li>Cloud hosting and storage providers.</li>
            <li>Speech‑to‑text and large language model providers for transcription and AI answers.</li>
            <li>Payment processors for subscriptions.</li>
            <li>Analytics and crash reporting tools used to keep the app stable.</li>
          </ul>
          <p>These providers are bound by contractual commitments to protect your data and to use it only to deliver services on our behalf.</p>
        </>
      ),
    },
    {
      icon: Cookie,
      title: "6. Cookies and Local Storage",
      body: (
        <>
          <p>Our website uses a limited set of cookies and local storage entries for essential functionality (such as remembering your theme preference and keeping you signed in) and for basic, privacy‑respecting analytics. The desktop app itself does not rely on advertising cookies.</p>
          <p>You can control cookies through your browser settings, though disabling essential cookies may affect parts of the site.</p>
        </>
      ),
    },
    {
      icon: UserCheck,
      title: "7. Your Rights and Choices",
      body: (
        <>
          <p>Depending on where you live, you may have the right to:</p>
          <ul className="privacy-list">
            <li>Access the personal information we hold about you.</li>
            <li>Correct information that is inaccurate or incomplete.</li>
            <li>Delete your account and associated content.</li>
            <li>Object to or restrict certain uses of your information.</li>
            <li>Export your data in a portable format.</li>
          </ul>
          <p>You can exercise most of these rights directly from the app, or by writing to us at <a href="mailto:support@introscribe.com">support@introscribe.com</a>.</p>
        </>
      ),
    },
    {
      icon: Globe,
      title: "8. International Data Transfers",
      body: (
        <p>Introscribe is operated globally. Your information may be processed in countries other than the one in which you live. When we transfer personal data internationally we rely on appropriate safeguards, such as standard contractual clauses, to protect it.</p>
      ),
    },
    {
      icon: Shield,
      title: "9. Children's Privacy",
      body: (
        <p>Introscribe is not directed to children under 16, and we do not knowingly collect personal information from them. If you believe a child has provided us with personal data, contact us and we will delete it.</p>
      ),
    },
    {
      icon: Trash2,
      title: "10. Deleting Your Data",
      body: (
        <p>You can delete individual transcripts and notes from within the app. To delete your entire account and all associated content, use the account settings screen or email <a href="mailto:support@introscribe.com">support@introscribe.com</a>. Deletion is permanent and cannot be undone.</p>
      ),
    },
    {
      icon: Sparkles,
      title: "11. Changes to This Policy",
      body: (
        <p>We may update this Privacy Policy from time to time. When we make material changes we will notify you through the app or by email before the changes take effect. The date at the top of this page reflects the most recent revision.</p>
      ),
    },
    {
      icon: Mail,
      title: "12. Contact Us",
      body: (
        <p>Questions about this Privacy Policy or how Introscribe handles your data? Reach out at <a href="mailto:support@introscribe.com">support@introscribe.com</a> and we will respond as quickly as we can.</p>
      ),
    },
  ];

  const PRIVACY_FAQS = [
    {
      q: "Does Introscribe record my meetings without permission?",
      a: "No. Introscribe only captures audio when you start a session, and you can pause or end capture at any time. You are responsible for complying with local recording laws.",
    },
    {
      q: "Can other people on my call see the AI overlay?",
      a: "No. The Introscribe overlay is rendered locally on your device and is not visible to other participants, even when you screen share or record.",
    },
    {
      q: "Do you use my conversations to train AI models?",
      a: "We do not use your conversation content to train third‑party foundation models, and we do not sell your personal information to advertisers.",
    },
    {
      q: "How do I delete my transcripts?",
      a: "You can delete individual transcripts from within the app, or delete your entire account from the settings screen. Account deletion removes your content from our active systems.",
    },
  ];

  const PrivacyPolicyPage = () => (
    <main className="seo-page privacy-page">
      <section className="seo-download-hero">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <p className="seo-eyebrow">Legal · Introscribe</p>
            <h1 className="text-balance">Privacy Policy</h1>
            <p className="seo-intro">
              This Privacy Policy explains what information Introscribe collects, how we use it, and the controls you have over your data when you use our desktop app and website.
            </p>
            <p className="privacy-updated">Last updated: {PRIVACY_LAST_UPDATED}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-4 py-12 md:grid-cols-3">
        {PRIVACY_HIGHLIGHTS.map(({ icon: Icon, title, body }) => (
          <article key={title} className="seo-card">
            <h2>
              <span className="seo-card-icon" aria-hidden="true"><Icon /></span>
              <span>{title}</span>
            </h2>
            <p>{body}</p>
          </article>
        ))}
      </section>

      <section className="mx-auto max-w-4xl px-4 py-10">
        <div className="privacy-sections">
          {PRIVACY_SECTIONS.map(({ icon: Icon, title, body }) => (
            <article key={title} id={title.includes("Cookies") ? "cookies" : undefined} className="privacy-section">
              <h2 className="privacy-section-heading">
                <span className="seo-card-icon" aria-hidden="true"><Icon /></span>
                <span>{title}</span>
              </h2>
              <div className="privacy-section-body">{body}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-10">
        <p className="seo-eyebrow text-center">FAQ</p>
        <h2 className="seo-faq-title">Privacy questions we hear often</h2>
        <div className="seo-faq-list">
          {PRIVACY_FAQS.map((faq) => (
            <article key={faq.q} className="seo-faq-item">
              <h3>{faq.q}</h3>
              <p>{faq.a}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="seo-cta">
          <div>
            <p className="seo-eyebrow">Questions</p>
            <h2>Talk to us about your data</h2>
            <p>Email <a href="mailto:support@introscribe.com">support@introscribe.com</a> for privacy requests, account deletion, or anything else about how Introscribe handles your information.</p>
          </div>
          <a href={baseUrl} className="seo-secondary-link seo-secondary-link--dark">
            Back to homepage
          </a>
        </div>
      </section>
    </main>
  );

  const TERMS_LAST_UPDATED = "July 1, 2026";

  const TERMS_HIGHLIGHTS = [
    {
      icon: ShieldCheck,
      title: "Clear, fair terms",
      body:
        "These terms cover the Introscribe desktop app, our website, and any related services. Using Introscribe means you accept them.",
    },
    {
      icon: UserCheck,
      title: "You control your account",
      body:
        "You are responsible for keeping your account credentials secure and for any activity that happens under your account.",
    },
    {
      icon: Shield,
      title: "Use it lawfully",
      body:
        "Follow your local laws about recording and transcribing conversations, and do not use Introscribe to harm others.",
    },
  ];

  const TERMS_SECTIONS = [
    {
      icon: FileText,
      title: "1. Acceptance of Terms",
      body: (
        <>
          <p>These Terms of Service (the "Terms") form a binding agreement between you and Introscribe ("Introscribe", "we", "us", or "our") governing your access to and use of the Introscribe desktop app, website, and related services (collectively, the "Service").</p>
          <p>By downloading, installing, or using the Service you confirm that you have read, understood, and agreed to these Terms. If you do not agree, do not use the Service.</p>
        </>
      ),
    },
    {
      icon: UserCheck,
      title: "2. Eligibility and Accounts",
      body: (
        <>
          <p>You must be at least 16 years old to use Introscribe. By creating an account, you represent that the information you provide is accurate and that you are legally able to enter into these Terms.</p>
          <p>You are responsible for:</p>
          <ul className="privacy-list">
            <li>Keeping your login credentials confidential.</li>
            <li>All activity that occurs under your account.</li>
            <li>Notifying us promptly of any unauthorized use at <a href="mailto:support@introscribe.com">support@introscribe.com</a>.</li>
          </ul>
        </>
      ),
    },
    {
      icon: Sparkles,
      title: "3. License to Use the Service",
      body: (
        <>
          <p>Subject to your compliance with these Terms, we grant you a limited, non‑exclusive, non‑transferable, revocable license to install and use the Introscribe desktop app on devices you own or control, and to access the Service for your personal or internal business use.</p>
          <p>You may not sublicense, resell, or redistribute the Service, and you may not use it to build a competing product.</p>
        </>
      ),
    },
    {
      icon: Shield,
      title: "4. Acceptable Use",
      body: (
        <>
          <p>You agree not to use the Service to:</p>
          <ul className="privacy-list">
            <li>Record or transcribe any conversation without the notice or consent required by applicable law.</li>
            <li>Violate any law, regulation, or third‑party right, including privacy and intellectual property rights.</li>
            <li>Cheat in academic, certification, or hiring contexts where the use of AI assistance is prohibited by the organizer.</li>
            <li>Attempt to disrupt, reverse engineer, decompile, or interfere with the Service, its infrastructure, or its security.</li>
            <li>Upload malware, run automated scraping, or make excessive requests that degrade the Service for others.</li>
          </ul>
          <p>You are solely responsible for how you use Introscribe and for ensuring your use is lawful in your jurisdiction and in the jurisdiction of anyone whose voice you capture.</p>
        </>
      ),
    },
    {
      icon: Mic,
      title: "5. Your Content",
      body: (
        <>
          <p>"Your Content" means the audio you capture, transcripts, notes, prompts, and other material you submit through the Service. You retain all rights in Your Content.</p>
          <p>You grant Introscribe a worldwide, non‑exclusive, royalty‑free license to host, process, and transmit Your Content solely to operate and improve the Service on your behalf, and to comply with law.</p>
          <p>You represent that you have all rights and permissions necessary to submit Your Content and that it does not violate these Terms or any applicable law.</p>
        </>
      ),
    },
    {
      icon: BookOpen,
      title: "6. Subscriptions, Billing, and Refunds",
      body: (
        <>
          <p>Introscribe offers free and paid plans. Paid plans are billed on a recurring basis (monthly or annually) through our payment processor. By subscribing, you authorize us to charge the applicable fees plus any taxes to your chosen payment method until you cancel.</p>
          <p>You can cancel a paid plan at any time from your account settings. Cancellation stops future renewals; it does not retroactively refund the current billing period unless required by law.</p>
          <p>We may change pricing or plan features from time to time. When we do, changes will apply to new billing periods and we will provide reasonable advance notice.</p>
        </>
      ),
    },
    {
      icon: Layers,
      title: "7. Third‑Party Services",
      body: (
        <p>The Service integrates with third‑party providers for speech‑to‑text, AI responses, hosting, analytics, and payments. Your use of those integrations is also subject to the third parties' terms and policies. We are not responsible for third‑party services or content, but we choose vendors that meet our security and privacy expectations.</p>
      ),
    },
    {
      icon: Lock,
      title: "8. Intellectual Property",
      body: (
        <p>The Service, including its software, design, trademarks, and content (other than Your Content), is owned by Introscribe or its licensors and is protected by intellectual property laws. Except for the limited license granted in these Terms, no rights are transferred to you.</p>
      ),
    },
    {
      icon: X,
      title: "9. Suspension and Termination",
      body: (
        <>
          <p>You may stop using the Service and delete your account at any time from within the app.</p>
          <p>We may suspend or terminate your access, with or without notice, if we reasonably believe you have violated these Terms, created legal or security risk, or if we are required to do so by law. On termination, your right to use the Service ends immediately. Sections that by their nature should survive termination will continue to apply.</p>
        </>
      ),
    },
    {
      icon: CircleHelp,
      title: "10. Disclaimers",
      body: (
        <>
          <p>The Service is provided on an "as is" and "as available" basis. To the maximum extent permitted by law, Introscribe disclaims all warranties, whether express, implied, or statutory, including warranties of merchantability, fitness for a particular purpose, and non‑infringement.</p>
          <p>AI outputs (transcripts, summaries, and suggested answers) may be inaccurate, incomplete, or offensive. You are responsible for reviewing and deciding whether to act on them. Introscribe is not a substitute for professional legal, medical, financial, or hiring advice.</p>
        </>
      ),
    },
    {
      icon: Zap,
      title: "11. Limitation of Liability",
      body: (
        <p>To the maximum extent permitted by law, Introscribe and its officers, employees, and affiliates will not be liable for any indirect, incidental, special, consequential, or punitive damages, or for any loss of profits, data, goodwill, or business, arising from or related to your use of the Service. Our total aggregate liability for any claim relating to the Service will not exceed the greater of (a) the amount you paid us in the 12 months before the claim or (b) USD 100.</p>
      ),
    },
    {
      icon: Server,
      title: "12. Indemnification",
      body: (
        <p>You agree to defend, indemnify, and hold harmless Introscribe from and against any claims, damages, liabilities, and expenses (including reasonable legal fees) arising out of Your Content, your use of the Service, or your violation of these Terms or applicable law.</p>
      ),
    },
    {
      icon: Globe,
      title: "13. Governing Law and Disputes",
      body: (
        <p>These Terms are governed by the laws of the jurisdiction in which Introscribe is established, without regard to conflict‑of‑laws principles. Any dispute arising out of or relating to these Terms or the Service will be resolved in the courts of that jurisdiction, unless mandatory local law grants you the right to bring a claim elsewhere.</p>
      ),
    },
    {
      icon: Sparkles,
      title: "14. Changes to These Terms",
      body: (
        <p>We may update these Terms from time to time. When we make material changes, we will notify you through the app or by email and update the "Last updated" date above. Your continued use of the Service after the changes take effect means you accept the updated Terms.</p>
      ),
    },
    {
      icon: Mail,
      title: "15. Contact Us",
      body: (
        <p>Questions about these Terms? Reach out at <a href="mailto:support@introscribe.com">support@introscribe.com</a> and we will get back to you.</p>
      ),
    },
  ];

  const TERMS_FAQS = [
    {
      q: "Do I need to accept these Terms to use Introscribe?",
      a: "Yes. Installing or using the desktop app or website means you accept the Terms. If you do not agree, do not use the Service.",
    },
    {
      q: "Can I use Introscribe in interviews or exams?",
      a: "You are responsible for following the rules of any interview, exam, or certification you participate in. Do not use Introscribe where AI assistance is prohibited by the organizer.",
    },
    {
      q: "How do I cancel my subscription?",
      a: "You can cancel from the account settings screen in the app at any time. Cancellation stops future renewals but does not retroactively refund the current billing period.",
    },
    {
      q: "Are AI answers guaranteed to be accurate?",
      a: "No. AI outputs can be wrong or incomplete. Always review them before acting on them, and do not treat them as legal, medical, or financial advice.",
    },
  ];

  const TermsPage = () => (
    <main className="seo-page privacy-page">
      <section className="seo-download-hero">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <p className="seo-eyebrow">Legal · Introscribe</p>
            <h1 className="text-balance">Terms of Service</h1>
            <p className="seo-intro">
              These Terms of Service explain the rules for using the Introscribe desktop app, our website, and related services. Please read them carefully before you use Introscribe.
            </p>
            <p className="privacy-updated">Last updated: {TERMS_LAST_UPDATED}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-4 py-12 md:grid-cols-3">
        {TERMS_HIGHLIGHTS.map(({ icon: Icon, title, body }) => (
          <article key={title} className="seo-card">
            <h2>
              <span className="seo-card-icon" aria-hidden="true"><Icon /></span>
              <span>{title}</span>
            </h2>
            <p>{body}</p>
          </article>
        ))}
      </section>

      <section className="mx-auto max-w-4xl px-4 py-10">
        <div className="privacy-sections">
          {TERMS_SECTIONS.map(({ icon: Icon, title, body }) => (
            <article key={title} className="privacy-section">
              <h2 className="privacy-section-heading">
                <span className="seo-card-icon" aria-hidden="true"><Icon /></span>
                <span>{title}</span>
              </h2>
              <div className="privacy-section-body">{body}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-10">
        <p className="seo-eyebrow text-center">FAQ</p>
        <h2 className="seo-faq-title">Common questions about the Terms</h2>
        <div className="seo-faq-list">
          {TERMS_FAQS.map((faq) => (
            <article key={faq.q} className="seo-faq-item">
              <h3>{faq.q}</h3>
              <p>{faq.a}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="seo-cta">
          <div>
            <p className="seo-eyebrow">Questions</p>
            <h2>Need help with the Terms?</h2>
            <p>Email <a href="mailto:support@introscribe.com">support@introscribe.com</a> and we will get back to you about anything in this document.</p>
          </div>
          <a href={baseUrl} className="seo-secondary-link seo-secondary-link--dark">
            Back to homepage
          </a>
        </div>
      </section>
    </main>
  );

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
      {showCookieSettings && <CookieSettingsModal />}
      {showNotFound ? (
        <section className="landing-bg landing-bg-animate page-landing-bg w-full pb-16">
          <Header />
          <main className="relative flex min-h-[60vh] flex-1 flex-col items-center justify-center gap-4 px-4 py-28 text-center text-white hero-text-glow">
            <p className="text-xs uppercase tracking-[0.6em] text-white/70">404</p>
            <h1 className="text-4xl font-semibold text-white">Page not found</h1>
            <p className="max-w-2xl text-base text-white/80">
              The page you were looking for either moved or never existed. Head back home to keep exploring the AI companion.
            </p>
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.location.assign(baseUrl);
                }
              }}
              className="mt-6 inline-flex items-center justify-center rounded-[14px] border border-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.28em] text-white transition dark:bg-white dark:text-zinc-900"
            >
              Go back home
            </button>
          </main>
        </section>
      ) : isPrivacyPage ? (
        <PrivacyPolicyPage />
      ) : isTermsPage ? (
        <TermsPage />
      ) : isDownloadPage ? (
        <DownloadPage />
      ) : activeSeoPage ? (
        <SeoContentPage page={activeSeoPage} />
      ) : (
        <main data-scroll-reveal-root>
          {/* Hero */}
      <section className="landing-bg landing-bg-animate w-full pb-16">
        <Header />
        <div className="mx-auto max-w-6xl px-4 pt-14 md:pt-24">
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
                className="download-btn download-btn--mac glassy"
                title="Download macOS installer"
              >
                <span className="download-icon-box">
                  <svg fill="#ffffff" height="14px" width="14px" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="-145 129 220 256" aria-hidden="true" focusable="false"><g><path d="M75,316.8c-6,13.3-8.9,19.3-16.6,31c-10.8,16.4-26,36.9-44.9,37.1c-16.8,0.2-21.1-10.9-43.8-10.8 c-22.7,0.1-27.5,11-44.3,10.8c-18.9-0.2-33.3-18.7-44.1-35.1c-30.2-46-33.4-99.9-14.7-128.6c13.2-20.4,34.1-32.3,53.8-32.3 c20,0,32.5,11,49.1,11c16,0,25.8-11,48.9-11c17.5,0,36,9.5,49.2,26C24.3,238.6,31.3,300.3,75,316.8L75,316.8z M0.8,170.6 c8.4-10.8,14.8-26,12.5-41.6c-13.7,0.9-29.8,9.7-39.1,21.1c-8.5,10.3-15.5,25.6-12.8,40.5C-23.7,191.1-8.2,182.1,0.8,170.6 L0.8,170.6z"></path></g></svg>
                </span>
                Get for Mac OS
              </a>
            ) : os === "windows" ? (
              <a href={windowsInstaller} className="download-btn glassy" title="Download Windows installer">
                <span className="download-icon-box">
                  {/* Windows icon */}
                  <svg fill="#ffffff" width="18" height="18" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>microsoft</title> <path d="M16.742 16.742v14.253h14.253v-14.253zM1.004 16.742v14.253h14.256v-14.253zM16.742 1.004v14.256h14.253v-14.256zM1.004 1.004v14.256h14.256v-14.256z"></path> </g></svg>
                </span>
                Get for Windows
              </a>
            ) : (
              <>
                <a href={windowsInstaller} className="download-btn glassy" title="Download Windows installer">
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
        <DraggableSessionOverlay />
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="benefit-headline price-number text-center mt-3">
          <span>Listen,</span>
          <span>Capture and</span>
          <span>Respond wisely.</span>
        </h2>
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
            </div>
          ))}
        </div>
      </section>

  {/* Feature Sections */}
      <section id="how" className="mx-auto max-w-7xl px-4 py-6 md:py-10">
        <div className="grid gap-[8.5rem]">
          {features.map((f, i) => {
            if (i === 0) {
              return (
                <div key={i} className="grid gap-8">
	                  <div className="mx-auto max-w-3xl text-center">
	                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium dark:border-white/10">
	                      <f.icon className="h-3.5 w-3.5" /> {f.tag}
	                    </div>
	                    <h3 className="price-number font-semibold leading-[1.05] tracking-tight whitespace-pre-line">{f.title}</h3>
	                    <p className="mx-auto mt-2 max-w-2xl text-zinc-600 dark:text-zinc-300">{f.desc}</p>
	                  </div>
	                  <div className="undetectable-media-grid grid gap-5 pt-8 md:grid-cols-2 md:pt-10">
	                    <div className="privacy-preview-column">
	                      <div
	                        ref={privacyPreviewRef}
	                        className="privacy-preview-card"
	                        style={{ "--privacy-split": `${privacySplit}%` }}
	                      >
	                        <div className="privacy-preview-media privacy-comparison" aria-label="Visibility comparison preview">
	                          <video
	                            src="/seen.mp4"
	                            className="privacy-comparison-video"
	                            autoPlay
	                            muted
	                            loop
	                            playsInline
	                            preload="metadata"
	                            aria-label="Visible to you preview"
	                          />
	                          <span className="privacy-preview-label privacy-preview-label--seen">Visible to you</span>
	                          <div className="privacy-comparison-after">
	                            <video
	                              src="/unseen.mp4"
	                              className="privacy-comparison-video"
	                              autoPlay
	                              muted
	                              loop
	                              playsInline
	                              preload="metadata"
	                              aria-label="Invisible to others preview"
	                            />
	                            <span className="privacy-preview-label privacy-preview-label--unseen">Invisible to others</span>
	                          </div>
	                          <span className="privacy-comparison-divider" aria-hidden="true">
	                            <span className="privacy-comparison-handle"></span>
	                          </span>
	                          <input
	                            className="privacy-comparison-range"
	                            type="range"
	                            min="0"
	                            max="100"
	                            value={privacySplit}
	                            onChange={handlePrivacySplitChange}
	                            aria-label="Slide to compare visible to you and invisible to others previews"
	                          />
	                        </div>
	                      </div>
	                      <div className="privacy-preview-copy">
	                        <p><strong>Undetectable on shared screens.</strong> Introscribe remains invisible in screen sharing, recordings, and video conferencing tools.</p>
	                      </div>
	                    </div>
	                    <div className="privacy-preview-column">
	                      <div className="privacy-preview-card">
	                        <div ref={featureOverlayStageRef} className="privacy-preview-media feature-overlay-preview-stage">
	                          <video
	                            src="/overlay_bg.mp4"
	                            className="privacy-comparison-video feature-overlay-preview-bg"
	                            autoPlay
	                            muted
	                            loop
	                            playsInline
	                            preload="metadata"
	                            aria-label="Overlay visibility preview"
	                          />
	                          <DraggableFeatureSessionOverlay
	                            stageRef={featureOverlayStageRef}
	                            responsiveCollapseBelow={OVERLAY_COMPACT_BREAKPOINT}
	                            className="feature-session-overlay--undetectable"
	                          />
	                          <span className="feature-drag-hint" aria-hidden="true">Click and drag the overlay</span>
	                        </div>
	                      </div>
	                      <div className="privacy-preview-copy">
	                        <p><strong>Positioned for you.</strong> Freely place the window wherever it feels most comfortable for quick, effortless glances.</p>
	                      </div>
	                    </div>
                  </div>
                </div>
              );
            }

            if (i === 1) {
              return (
                <div key={i} className="grid gap-8 pt-8">
                  <div className="mx-auto max-w-3xl text-center">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium dark:border-white/10">
                      <f.icon className="h-3.5 w-3.5" /> {f.tag}
                    </div>
                    <h3 className="price-number font-semibold leading-[1.05] tracking-tight whitespace-pre-line">{f.title}</h3>
                    <p className="mx-auto mt-2 max-w-2xl text-zinc-600 dark:text-zinc-300">{f.desc}</p>
                  </div>
                  <div className="mx-auto w-full max-w-5xl">
                    <div className="privacy-preview-card ask-clarify-preview-card">
                      <img
                        src="/notetaking.jpg"
                        alt="Ask and clarify mid-conversation note taking preview"
                        className="ask-clarify-preview-image"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </div>
                </div>
              );
            }

            if (f.stats) {
              return (
                <div key={i} className="grid gap-8 pt-8">
                  <div className="mx-auto max-w-3xl text-center">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium dark:border-white/10">
                      <f.icon className="h-3.5 w-3.5" /> {f.tag}
                    </div>
                    <h3 className="price-number font-semibold leading-[1.05] tracking-tight whitespace-pre-line">{f.title}</h3>
                    <p className="mx-auto mt-2 max-w-2xl text-zinc-600 dark:text-zinc-300">{f.desc}</p>
                  </div>
                  <div className="grid items-center gap-8 md:grid-cols-2">
                    <div ref={transcriptionOverlayStageRef} className="transcription-media-holder relative rounded-3xl overflow-hidden border bg-white shadow-md feature-overlay-preview-stage dark:border-white/10 dark:bg-zinc-950">
                      <video
                        src="/live_transcript.mp4"
                        className="h-full w-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        aria-label="Real-time live transcription preview"
                      />
                      <DraggableFeatureSessionOverlay
                        stageRef={transcriptionOverlayStageRef}
                        defaultCollapsed
                        compactLabel="Recording"
                        compactButtonTone="danger"
                        initialPrivateActive={false}
                      />
                    </div>
                    <div className="transcription-stats">
                      {f.stats.map((stat) => (
                        <div key={stat.label} className="transcription-stat-row">
                          <div className="transcription-stat-value">{stat.value}</div>
                          <div>
                            <h4>{stat.label}</h4>
                            <p>{stat.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

	            return (
	              <div key={i} className={`grid items-center gap-8 md:grid-cols-2 ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}>
	                {/* Feature visual */}
	                {f.tag === 'Answers' ? (
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
	                ) : f.stats ? (
	                  <div ref={transcriptionOverlayStageRef} className="relative rounded-3xl overflow-hidden border bg-white shadow-md feature-overlay-preview-stage dark:border-white/10 dark:bg-zinc-950">
	                    <video
	                      src="/live_transcript.mp4"
	                      className="h-full w-full object-cover"
	                      autoPlay
	                      muted
	                      loop
	                      playsInline
	                      preload="metadata"
	                      aria-label="Real-time live transcription preview"
	                    />
	                    <DraggableFeatureSessionOverlay
	                      stageRef={transcriptionOverlayStageRef}
	                      defaultCollapsed
	                      compactLabel="Recording"
	                      compactButtonTone="danger"
	                      initialPrivateActive={false}
	                    />
	                  </div>
	                ) : (
	                  <div className="relative rounded-3xl overflow-hidden border bg-white shadow-md dark:border-white/10 dark:bg-zinc-950">
	                    <video
	                      src="/live_transcript.mp4"
	                      className="h-full w-full object-cover"
	                      autoPlay
	                      muted
	                      loop
	                      playsInline
	                      preload="metadata"
	                      aria-label="Real-time live transcription preview"
	                    />
	                  </div>
	                )}
              <div>
                {!f.stats && (
                  <div className="mb-2 inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium dark:border-white/10">
                    <f.icon className="h-3.5 w-3.5" /> {f.tag}
                  </div>
                )}
                <h3 className="price-number font-semibold leading-[1.05] tracking-tight whitespace-pre-line">{f.title}</h3>
                {f.stats ? (
                  <div className="transcription-stats mt-12">
                    {f.stats.map((stat) => (
                      <div key={stat.label} className="transcription-stat-row">
                        <div className="transcription-stat-value">{stat.value}</div>
                        <div>
                          <h4>{stat.label}</h4>
                          <p>{stat.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 max-w-prose text-lg md:text-xl leading-relaxed text-zinc-600 dark:text-zinc-300">{f.desc}</p>
                )}
              </div>
            </div>
            );
          })}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-7xl px-4 py-16">
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
                ) : (
                  <a
                    href={`${baseUrl}download`}
                    className="btn-muted pricing-card-cta pricing-cta-glass w-full inline-flex items-center justify-center text-center"
                  >
                    Download for free
                  </a>
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
      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-7xl px-4 py-10">
        <h3 className="price-number text-center">Frequently Asked Questions</h3>
        <div className="mt-6 rounded-2xl bg-white dark:bg-transparent">
          {faqs.map((item, i) => (
            <div
              key={i}
              className={`px-5 md:px-7 ${i < faqs.length - 1 ? 'border-b border-zinc-200 dark:border-white/10' : ''}`}
            >
              <button
                onClick={() => setOpenFAQ((cur) => (cur === i ? null : i))}
                className="flex w-full items-center justify-between gap-6 py-6 text-left text-xl md:text-2xl"
              >
                <span className="font-medium">{item.q}</span>
                <ChevronDown
                  className={`h-6 w-6 flex-shrink-0 transition ${openFAQ === i ? 'rotate-180' : ''}`}
                />
              </button>
              <div
                className={`overflow-hidden text-lg font-light leading-8 text-zinc-600 transition-[max-height] duration-300 md:text-xl md:leading-9 dark:text-zinc-300 ${
                  openFAQ === i ? 'max-h-56 pb-7' : 'max-h-0'
                }`}
              >
                {item.a}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Smart AI CTA */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="smart-cta-holder relative overflow-hidden rounded-3xl border p-5 text-white shadow-lg dark:border-white/10">
          <video
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover pointer-events-none"
            src="/pre_footer.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-black/50 pointer-events-none"></div>
          <div className="relative flex h-full items-center justify-center">
            <div className="smart-cta-content px-4 md:px-10 max-w-2xl text-center" style={{ zIndex: 1 }}>
              <h3 className="text-3xl md:text-4xl font-semibold leading-tight whitespace-pre-line cta-head-shadow">Never Miss a Moment That Matters</h3>
              <p className="mt-2 text-zinc-300">
                From first hello to final follow‑up, Introscribe quietly records, transcribes, and distills every conversation into insight — so you stay fully present while nothing slips through the cracks.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                {isMobile ? (
                  <DesktopRequiredCTA tone="dark" align="start" />
                ) : os === "mac" ? (
                  <a
                    href={macInstaller}
                    className="download-btn download-btn--mac glassy"
                    title="Download macOS installer"
                  >
                    <span className="download-icon-box">
                      <svg fill="#ffffff" height="14px" width="14px" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="-145 129 220 256" aria-hidden="true" focusable="false"><g><path d="M75,316.8c-6,13.3-8.9,19.3-16.6,31c-10.8,16.4-26,36.9-44.9,37.1c-16.8,0.2-21.1-10.9-43.8-10.8 c-22.7,0.1-27.5,11-44.3,10.8c-18.9-0.2-33.3-18.7-44.1-35.1c-30.2-46-33.4-99.9-14.7-128.6c13.2-20.4,34.1-32.3,53.8-32.3 c20,0,32.5,11,49.1,11c16,0,25.8-11,48.9-11c17.5,0,36,9.5,49.2,26C24.3,238.6,31.3,300.3,75,316.8L75,316.8z M0.8,170.6 c8.4-10.8,14.8-26,12.5-41.6c-13.7,0.9-29.8,9.7-39.1,21.1c-8.5,10.3-15.5,25.6-12.8,40.5C-23.7,191.1-8.2,182.1,0.8,170.6 L0.8,170.6z"></path></g></svg>
                    </span>
                    Get for Mac OS
                  </a>
                ) : os === "windows" ? (
                  <a href={windowsInstaller} className="download-btn glassy" title="Download Windows installer">
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
                    <a href={windowsInstaller} className="download-btn glassy" title="Download Windows installer">
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
          </div>
        </div>
      </section>

        </main>
      )}
      <Footer />
    </div>
  );
}
