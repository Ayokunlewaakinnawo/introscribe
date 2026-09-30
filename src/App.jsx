// Prevent removal by automated tools
import React from "react";

import { AlignJustify, ArrowLeftRight, ArrowRight, BookOpen, BriefcaseBusiness, Check, ChevronDown, ChevronUp, CircleHelp, Clock10, Command, Cookie, Copy, CornerDownLeft, CreditCard, Database, FileText, Globe, HatGlasses, Layers, Lock, Mail, MessageCircle, MessageSquareText, Mic, Monitor, Moon, Route, Send, Server, Shield, ShieldCheck, Sparkles, Sun, Target, Trash2, UserCheck, X, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SITE_URL, homeSeo, seoPages, seoPagesBySlug } from "./seoPages";

const HERO_WORDS = ["Meetings", "Conversations", "Interviews"];
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
    <div ref={stageRef} className="relative mx-auto mt-10 w-full max-w-6xl px-0 sm:px-4 md:mt-12 phone-mock-animate mockup-container overflow-hidden session-overlay-stage">
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
  placement = "center",
  topOffset = 20,
  className = "",
}) => {
  const panelRef = useRef(null);
  const [overlayScale, setOverlayScale] = useState(0.78);
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
    const nextX = (stageRect.width - panelRect.width) / 2;
    const nextY = placement === "top"
      ? topOffset
      : (stageRect.height - panelRect.height) / 2;
    return clampPosition(
      nextX,
      nextY
    );
  };

  useEffect(() => {
    const updateScale = () => {
      const stageWidth = stageRef.current?.getBoundingClientRect().width ?? 0;
      setOverlayScale(stageWidth && stageWidth < 460 ? Math.max(0.62, (0.78 * stageWidth) / 460) : 0.78);
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [stageRef]);

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
  }, [collapsed, placement, topOffset, overlayScale]);

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

const USE_CASES = [
  {
    id: "interviews",
    title: "Job interviews",
    desc: "Real-time help with coding, system design, and behavioral questions while the interview is live.",
    cta: "Explore Interview Assistant",
    slug: "ai-interview-assistant",
  },
  {
    id: "meetings",
    title: "Meetings",
    desc: "Live transcription, instant answers, and structured notes for every call.",
    cta: "Explore Meeting Assistant",
    slug: "ai-meeting-assistant",
  },
  {
    id: "sales",
    title: "Sales calls",
    desc: "Objection handling and talk tracks on the call, visible only to you.",
    cta: "Explore Sales Assistant",
    slug: "sales-call-assistant",
  },
  {
    id: "lectures",
    title: "Trainings & lectures",
    desc: "Transcribe and summarize sessions into searchable notes you can ask questions about later.",
    cta: "Explore Live Transcription",
    slug: "live-transcription-software",
  },
];

const USE_CASE_ADVANCE_MS = 7000;

// Staggered line inside the stage; `step` sets its entrance order.
const StageLine = ({ step, className = "", children }) => (
  <div className={`uc-line ${className}`} style={{ "--step": step }}>{children}</div>
);

const UseCaseStage = ({ id }) => {
  if (id === "interviews") {
    return (
      <>
        <div className="uc-window">
          <p className="uc-window__label">Coding interview <span className="uc-window__timer">24:10</span></p>
          <StageLine step={0} className="uc-prompt">Given an array of integers, return the indices of the two numbers that add up to a target.</StageLine>
          <pre className="uc-code">
            <StageLine step={1}><span className="tok-key">function</span> <span className="tok-fn">twoSum</span>(nums, target) {"{"}</StageLine>
            <StageLine step={2}>{"  "}<span className="tok-key">const</span> seen = <span className="tok-key">new</span> <span className="tok-fn">Map</span>();</StageLine>
            <StageLine step={3}>{"  "}<span className="tok-key">for</span> (<span className="tok-key">const</span> [i, n] <span className="tok-key">of</span> nums.<span className="tok-fn">entries</span>()) {"{"}</StageLine>
            <StageLine step={4}>{"    "}<span className="tok-key">if</span> (seen.<span className="tok-fn">has</span>(target - n)) <span className="tok-key">return</span> [seen.<span className="tok-fn">get</span>(target - n), i];</StageLine>
            <StageLine step={5}>{"    "}seen.<span className="tok-fn">set</span>(n, i);<span className="uc-caret" /></StageLine>
          </pre>
        </div>
        <div className="uc-float">
          <p className="uc-float__label uc-float__label--green">What to say next</p>
          <p>Walk through the hash map approach: one pass, O(n) time and space.</p>
        </div>
      </>
    );
  }

  if (id === "sales") {
    return (
      <>
        <div className="uc-window">
          <p className="uc-window__label">Discovery call <span className="uc-window__timer">00:42</span></p>
          <StageLine step={0} className="uc-speaker">
            <span className="uc-avatar uc-avatar--orange">D</span>
            <div><b>Dana <em className="uc-flag">Objection</em></b><p>“We already use a tool for note-taking.”</p></div>
          </StageLine>
          <StageLine step={1} className="uc-speaker uc-speaker--muted">
            <span className="uc-avatar">Y</span>
            <div><b>You</b><p>“Totally fair. How do follow-ups happen today?”</p></div>
          </StageLine>
          <StageLine step={2} className="uc-meter">
            <span>Buying signal</span><b><i /></b><span>Rising</span>
          </StageLine>
        </div>
        <div className="uc-float">
          <p className="uc-float__label uc-float__label--violet">How to respond</p>
          <p>Ask what happens during the call, not after it.</p>
        </div>
      </>
    );
  }

  if (id === "lectures") {
    return (
      <>
        <div className="uc-window">
          <p className="uc-window__label">Session notes</p>
          <StageLine step={0} className="uc-title">Performance review training</StageLine>
          <ul className="uc-moments">
            <StageLine step={1}><time>04:12</time>Framing the self-assessment</StageLine>
            <StageLine step={2}><time>18:40</time>Gathering 360 feedback</StageLine>
            <StageLine step={3}><time>31:05</time>Writing fair, specific narratives</StageLine>
          </ul>
        </div>
        <div className="uc-float">
          <p className="uc-float__label uc-float__label--amber">Summary</p>
          <p>Self-assessments need context, outcomes, and impact.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="uc-window">
        <p className="uc-window__label">
          Live transcript
          <span className="uc-wave"><i /><i /><i /><i /></span>
        </p>
        <StageLine step={0} className="uc-speaker">
          <span className="uc-avatar uc-avatar--blue">M</span>
          <div><b>Maya</b><p>“Let’s lock the launch date by Friday.”</p></div>
        </StageLine>
        <StageLine step={1} className="uc-speaker uc-speaker--muted">
          <span className="uc-avatar">J</span>
          <div><b>James</b><p>“Works for me. I’ll loop in design.”</p></div>
        </StageLine>
        <StageLine step={2} className="uc-speaker uc-speaker--muted">
          <span className="uc-avatar uc-avatar--blue">M</span>
          <div><b>Maya</b><p>“Great. Who owns the release notes?”</p></div>
        </StageLine>
      </div>
      <div className="uc-float">
        <p className="uc-float__label uc-float__label--blue"><Zap /> Action item</p>
        <p>Maya to confirm the launch date by Friday.</p>
      </div>
    </>
  );
};

// Shared layout: header on the left, a numbered list that drives a live stage on the right.
// The list auto-advances while the block is on screen and pauses on hover/focus.
const FeatureShowcase = ({
  as: Tag = "section",
  id,
  className = "",
  titleId,
  title,
  accent,
  lead,
  items,
  renderStage,
  initial = 0,
}) => {
  const rootRef = useRef(null);
  const [active, setActive] = useState(initial);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [reduceMotion] = useState(
    () => typeof window !== "undefined" && Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches)
  );
  const autoplay = inView && !paused && !reduceMotion;

  useEffect(() => {
    const element = rootRef.current;
    if (!element || typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!autoplay) return undefined;
    const timer = setTimeout(() => setActive((index) => (index + 1) % items.length), USE_CASE_ADVANCE_MS);
    return () => clearTimeout(timer);
  }, [autoplay, active, items.length]);

  const current = items[active];

  return (
    <Tag id={id} ref={rootRef} className={className} aria-labelledby={titleId}>
      <div
        className="uc-body"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <div className="uc-content">
          <div className="uc-head">
            <h2 id={titleId} className="price-number">
              {title} <span className="uc-head__accent">{accent}</span>
            </h2>
            <p>{lead}</p>
          </div>
          <ol className="uc-list">
            {items.map((item, index) => {
              const open = index === active;
              const panelId = `${titleId}-panel-${item.id}`;
              return (
                <li key={item.id} className={`uc-item ${open ? "is-active" : ""}`}>
                  <button
                    type="button"
                    className="uc-item__button"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setActive(index)}
                  >
                    <span className="uc-item__num">{String(index + 1).padStart(2, "0")}</span>
                    <span className="uc-item__title">{item.title}</span>
                  </button>
                  <div id={panelId} className="uc-item__panel" role="region" aria-label={item.title}>
                    <div>
                      <p>{item.desc}</p>
                      {item.href ? (
                        <a href={item.href} tabIndex={open ? undefined : -1}>
                          {item.cta}
                          <ArrowRight aria-hidden="true" />
                        </a>
                      ) : null}
                    </div>
                  </div>
                  {open ? (
                    <span
                      key={`${active}-${autoplay}`}
                      className={`uc-item__progress ${autoplay ? "is-running" : ""}`}
                      style={{ "--uc-duration": `${USE_CASE_ADVANCE_MS}ms` }}
                      aria-hidden="true"
                    />
                  ) : null}
                </li>
              );
            })}
          </ol>
        </div>

        <div className="uc-stage" aria-hidden="true">
          <div key={current.id} className="uc-stage__scene">
            {renderStage(current.id)}
          </div>
        </div>
      </div>
    </Tag>
  );
};

// "One assistant for every conversation"
const UseCasesShowcase = ({ baseUrl }) => (
  <FeatureShowcase
    id="use-cases"
    className="use-cases mx-auto max-w-7xl px-4 py-16 md:py-24"
    titleId="use-cases-title"
    title="One assistant for every"
    accent="conversation."
    lead="Introscribe is an AI interview assistant and meeting copilot in one desktop app: private, discreet, and real-time."
    items={USE_CASES.map((useCase) => ({ ...useCase, href: `${baseUrl}${useCase.slug}` }))}
    renderStage={(id) => <UseCaseStage id={id} />}
    initial={1}
  />
);

const NOTES_POINTS = [
  { title: "Decisions and action items", desc: "Every call ends with what was decided, who owns what, and by when." },
  { title: "Captured as it happens", desc: "Key moments land in your notes during the call, not after." },
  { title: "One-click follow-ups", desc: "Turn any session into a recap email, or ask your notes a question later." },
];

// Transcript lines; `note` links a highlighted phrase to the line it writes into the notes.
const NOTES_TRANSCRIPT = [
  { who: "Maya", text: "Okay, let’s start with the launch timeline." },
  { who: "James", text: "Design needs one more week on onboarding." },
  { who: "Maya", before: "Then let’s ", mark: "move the launch to the second week of March", after: ".", note: "d1", tone: "decision" },
  { who: "James", before: "Works for me. ", mark: "I’ll draft the release notes by March 4", after: ".", note: "a1", tone: "action" },
  { who: "You", before: "", mark: "I’ll get design sign-off by Friday", after: ".", note: "a2", tone: "action" },
  { who: "Maya", before: "And ", mark: "onboarding stays our top priority", after: " this quarter.", note: "d2", tone: "decision" },
  { who: "Maya", before: "", mark: "I’ll brief the sales team next week", after: ".", note: "a3", tone: "action" },
];

const NOTES_DECISIONS = [
  { id: "d1", text: "Launch moves to the second week of March." },
  { id: "d2", text: "Onboarding stays the top priority this quarter." },
];

const NOTES_ACTIONS = [
  { id: "a1", who: "J", owner: "James", text: "Draft the release notes", due: "Mar 4" },
  { id: "a2", who: "Y", owner: "You", text: "Get design sign-off", due: "Fri" },
  { id: "a3", who: "M", owner: "Maya", text: "Brief the sales team", due: "Next week" },
];

const NOTES_LINE_MS = 1400;

// "Notes that write themselves": a live transcript on the left writes a clean notes page on the right.
const NotesTransform = () => {
  const rootRef = useRef(null);
  const total = NOTES_TRANSCRIPT.length;
  const [reduceMotion] = useState(
    () => typeof window !== "undefined" && Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches)
  );
  const [inView, setInView] = useState(false);
  // How many transcript lines have been spoken so far; the notes only show what has been said.
  const [spoken, setSpoken] = useState(reduceMotion ? total : 1);

  useEffect(() => {
    const element = rootRef.current;
    if (!element || typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || reduceMotion) return undefined;
    // Hold on the finished page for a few seconds, then start the meeting over.
    const delay = spoken >= total ? 5200 : NOTES_LINE_MS;
    const timer = setTimeout(() => setSpoken((count) => (count >= total ? 1 : count + 1)), delay);
    return () => clearTimeout(timer);
  }, [inView, reduceMotion, spoken, total]);

  const captured = new Set(NOTES_TRANSCRIPT.slice(0, spoken).map((line) => line.note).filter(Boolean));
  const complete = spoken >= total;
  const visibleLines = NOTES_TRANSCRIPT.slice(0, spoken);

  return (
    <div ref={rootRef} className="nt-panel" aria-hidden="true">
      <div className="nt-talk">
        <p className="nt-talk__label">
          <span className="nt-talk__dot" /> Conversation
          <span className="nt-talk__wave"><i /><i /><i /><i /><i /></span>
        </p>
        <div className="nt-talk__viewport">
          <ul className="nt-talk__lines">
            {visibleLines.map((line, index) => (
              <li key={`${index}-${line.who}`} className={index === spoken - 1 ? "is-latest" : ""}>
                <b>{line.who}</b>
                <p>
                  {line.mark ? (
                    <>
                      {line.before}
                      <mark className={`nt-mark nt-mark--${line.tone}`}>{line.mark}</mark>
                      {line.after}
                    </>
                  ) : line.text}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <span className="nt-panel__exchange" aria-hidden="true">
          <ArrowLeftRight size={16} strokeWidth={2} />
        </span>
      </div>

      <article className="nt-page">
        <header className="nt-page__head">
          <div>
            <p className="nt-page__title">Q3 roadmap review</p>
            <p className="nt-page__meta">Thursday · 3:17 PM · Maya, James, You</p>
          </div>
          <span className={`nt-page__status ${complete ? "is-done" : ""}`}>
            {complete ? <><Check /> Notes ready</> : "Writing"}
          </span>
        </header>

        <section className="nt-page__section">
          <h4>Decisions</h4>
          <ul className="nt-decisions">
            {NOTES_DECISIONS.map((item) => (
              <li key={item.id} className={captured.has(item.id) ? "is-in" : ""}>{item.text}</li>
            ))}
          </ul>
        </section>

        <section className="nt-page__section">
          <h4>Action items</h4>
          <ul className="nt-actions">
            {NOTES_ACTIONS.map((item) => (
              <li key={item.id} className={captured.has(item.id) ? "is-in" : ""}>
                <span className="nt-actions__box" />
                <span className="nt-actions__text">{item.text}</span>
                <span className="nt-actions__owner">{item.owner}</span>
                <span className="nt-actions__due">{item.due}</span>
              </li>
            ))}
          </ul>
        </section>

        <p className={`nt-page__summary ${complete ? "is-in" : ""}`}>
          Launch slips a week to protect onboarding; three owners, all due before launch.
        </p>
      </article>
    </div>
  );
};

const NotesSection = ({ lead }) => (
  <div id="notes" className="notes-section md:pt-8">
    <div className="uc-head">
      <h2 id="notes-title" className="price-number">
        Notes that write <span className="uc-head__accent">themselves.</span>
      </h2>
      <p>{lead}</p>
    </div>
    <NotesTransform />
    <ul className="nt-points">
      {NOTES_POINTS.map((point) => (
        <li key={point.title}>
          <h3>{point.title}</h3>
          <p>{point.desc}</p>
        </li>
      ))}
    </ul>
  </div>
);

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

// One card in the "Listen, capture, and respond wisely" grid; `kind` picks its layout and live visual.
const BenefitCard = ({ benefit }) => {
  const Icon = benefit.icon;
  const text = (
    <>
      <h3>{benefit.title}</h3>
      <p className="benefit-card__desc">{benefit.desc}</p>
    </>
  );

  if (benefit.kind === "listen") {
    return (
      <article className="benefit-card benefit-card--listen">
        {text}
        <div className="benefit-live" aria-hidden="true">
          <p className="benefit-live__status">
            <span className="benefit-live__bars"><i /><i /><i /><i /></span>
            Listening
            <span className="benefit-live__time">12:08</span>
          </p>
          <ul className="benefit-live__lines">
            <li><b className="is-them">Them</b>Thanks for making time today. Let’s start with the roadmap.</li>
            <li><b className="is-you">You</b>We shipped the new onboarding flow last sprint.</li>
            <li className="is-current"><b className="is-them">Them</b>What would you cut if we lost two engineers?</li>
          </ul>
        </div>
      </article>
    );
  }

  const header = (
    <div className="benefit-card__top">
      <span className="benefit-card__icon" aria-hidden="true"><Icon /></span>
    </div>
  );

  if (benefit.kind === "insights") {
    return (
      <article className="benefit-card benefit-card--insights">
        <div className="benefit-card__copy">
          {header}
          {text}
        </div>
        <div className="benefit-say" aria-hidden="true">
          <p className="benefit-say__label"><Zap /> Say this</p>
          <p>Protect onboarding first, then pause the reporting revamp until the team is back.</p>
        </div>
      </article>
    );
  }

  return (
    <article className={`benefit-card benefit-card--${benefit.kind}`}>
      {header}
      {text}
      {benefit.kind === "understanding" ? (
        <div className="benefit-chips" aria-hidden="true">
          <span className="benefit-chip benefit-chip--decision">Decision</span>
          <span className="benefit-chip benefit-chip--action">Action item</span>
          <span className="benefit-chip benefit-chip--question">Open question</span>
        </div>
      ) : (
        <div className="benefit-ask" aria-hidden="true">
          <span>What did we agree on the timeline?</span>
        </div>
      )}
    </article>
  );
};

const MEETING_STEPS = [
  {
    art: "start",
    title: "Start Introscribe",
    desc: "Open Introscribe before your meeting and press Start Listening. It works alongside Zoom, Google Meet, and Teams.",
  },
  {
    art: "end",
    title: "End the meeting",
    desc: "Stop the recording when the call wraps up and Introscribe processes the transcript.",
  },
  {
    art: "notes",
    title: "Get your notes",
    desc: "Get a structured summary with decisions, action items, and a follow-up email ready to send.",
  },
];

const StepCursor = () => (
  <svg className="step-art__cursor" viewBox="0 0 32 32" aria-hidden="true">
    <path d="M6 4l20 9.5-8.6 2.4L13.6 25z" />
  </svg>
);

const StepCallWindow = ({ className = "" }) => (
  <div className={`step-art__window ${className}`}>
    <div className="step-art__window-bar"><i /><i /><i /></div>
    <div className="step-art__tiles">
      <img src="/steps/call-left.jpg" alt="" loading="lazy" decoding="async" />
      <img src="/steps/call-right.jpg" alt="" loading="lazy" decoding="async" />
    </div>
  </div>
);

// Illustrations for the "Meeting notes in 3 steps" cards, sized in container units so they scale like images.
const StepArt = ({ art }) => {
  if (art === "start") {
    return (
      <div className="step-art step-art--start" aria-hidden="true">
        <StepCallWindow className="step-art__window--back" />
        <div className="step-art__app">
          <div className="step-art__app-bar">
            <img src="/logo-b.png" alt="" className="step-art__app-logo" />
            <span className="step-art__start">
              <Mic /> Start Listening
              <StepCursor />
            </span>
          </div>
          <div className="step-art__app-body"><i /><i /><i /></div>
        </div>
      </div>
    );
  }

  if (art === "end") {
    return (
      <div className="step-art step-art--end" aria-hidden="true">
        <StepCallWindow />
        <div className="step-art__bar">
          <span className="step-art__bar-icon"><HatGlasses /></span>
          <span className="step-art__bar-pill"><span className="step-art__rec" /> Recording</span>
          <span className="step-art__bar-divider" />
          <span className="step-art__bar-stop">
            <i />
            <StepCursor />
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="step-art step-art--notes" aria-hidden="true">
      <div className="step-art__doc">
        <p className="step-art__doc-title">Q3 Planning Sync</p>
        <div className="step-art__doc-meta">
          <i />
          <span className="step-art__chip"><Mail /> Email follow-up</span>
        </div>
        <p className="step-art__doc-label">Meeting notes</p>
        <p className="step-art__doc-heading">Key decisions</p>
        <div className="step-art__lines"><i /><i /><i /><b /><i /><i /><i /><b /><i /></div>
      </div>
    </div>
  );
};

// Minimal top bar shared by the legal pages and the article (Compare / Resources / Use cases) pages.
const SubpageBar = ({ baseUrl, dark, onToggleTheme }) => (
  <header className="legal-bar">
    <div className="legal-wrap legal-bar__inner">
      <a href={baseUrl} aria-label="Introscribe home" className="legal-bar__brand">
        <img src="/logo-b.png" alt="introscribe" className="legal-bar__logo legal-bar__logo--light" decoding="async" />
        <img src="/logo-w.png" alt="" className="legal-bar__logo legal-bar__logo--dark" decoding="async" aria-hidden="true" />
      </a>
      <div className="legal-bar__actions">
        <a href={baseUrl} className="legal-bar__back">
          <ArrowRight aria-hidden="true" /> Back to home
        </a>
        <button type="button" className="legal-bar__theme" aria-label="Toggle dark mode" onClick={onToggleTheme}>
          {dark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
        </button>
      </div>
    </div>
  </header>
);

const articleCategory = (slug) =>
  slug.startsWith("blog/") ? "Resources" : slug.endsWith("-alternative") ? "Compare" : "Use cases";

const articleReadMinutes = (page) => {
  const text = [page.intro, ...page.sections.map((s) => `${s.heading} ${s.body}`), ...page.faqs.map((f) => `${f.q} ${f.a}`)].join(" ");
  return Math.max(1, Math.round(text.split(/\s+/).length / 200));
};

const ARTICLE_FADE_OUT_MS = 220;
const ARTICLE_FADE_IN_MS = 620;

// Article layout for the SEO content pages. Stays mounted across article switches so they can cross-fade.
const ArticlePage = ({ page, pages, baseUrl, dark, onToggleTheme, onNavigate, actions }) => {
  const rootRef = useRef(null);
  const timersRef = useRef([]);
  const [phase, setPhase] = useState("in");
  const category = articleCategory(page.slug);
  const related = pages.filter((other) => other.slug !== page.slug && articleCategory(other.slug) === category).slice(0, 3);

  useEffect(() => {
    timersRef.current.push(setTimeout(() => setPhase("idle"), ARTICLE_FADE_IN_MS + 200));
    return () => timersRef.current.forEach(clearTimeout);
  }, []);

  // Reveal the lower blocks as they scroll into view.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const blocks = Array.from(root.querySelectorAll("[data-article-reveal]"));
    blocks.forEach((block) => block.classList.remove("is-visible"));
    if (typeof IntersectionObserver === "undefined") {
      blocks.forEach((block) => block.classList.add("is-visible"));
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    blocks.forEach((block) => observer.observe(block));
    return () => observer.disconnect();
  }, [page.slug]);

  const openArticle = (event, slug) => {
    event.preventDefault();
    if (phase === "out") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) {
      onNavigate(slug);
      window.scrollTo(0, 0);
      return;
    }
    setPhase("out");
    timersRef.current.push(
      setTimeout(() => {
        onNavigate(slug);
        window.scrollTo({ top: 0, behavior: "instant" });
        setPhase("in");
        timersRef.current.push(setTimeout(() => setPhase("idle"), ARTICLE_FADE_IN_MS + 200));
      }, ARTICLE_FADE_OUT_MS)
    );
  };

  return (
    <div className="legal article" ref={rootRef}>
      <SubpageBar baseUrl={baseUrl} dark={dark} onToggleTheme={onToggleTheme} />

      <main key={page.slug} className={`legal-wrap article-doc article-doc--${phase}`}>
        <section className="article-hero">
          <p className="article-hero__meta">
            <span>{category}</span>
            <i aria-hidden="true" />
            {articleReadMinutes(page)} min read
          </p>
          <h1>{page.h1}</h1>
          <p className="article-hero__intro">{page.intro}</p>
          <div className="article-hero__actions">{actions}</div>
        </section>

        <section className="article-points" aria-label="Key points">
          {page.sections.map((section) => (
            <div key={section.heading}>
              <h2>{section.heading}</h2>
              <p>{section.body}</p>
            </div>
          ))}
        </section>

        <div className="article-body">
          <section className="article-block" data-article-reveal aria-labelledby="article-faq-title">
            <h2 id="article-faq-title">Common questions</h2>
            <dl className="article-faq">
              {page.faqs.map((faq) => (
                <div key={faq.q}>
                  <dt>{faq.q}</dt>
                  <dd>{faq.a}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="article-block" data-article-reveal aria-labelledby="article-topics-title">
            <h2 id="article-topics-title">Related topics</h2>
            <ul className="article-topics">
              {page.relatedKeywords.map((keyword) => (
                <li key={keyword}>{keyword.replace(/-/g, " ")}</li>
              ))}
            </ul>
          </section>

          {related.length ? (
            <section className="article-block" data-article-reveal aria-labelledby="article-more-title">
              <h2 id="article-more-title">More in {category}</h2>
              <ul className="article-more">
                {related.map((other) => (
                  <li key={other.slug}>
                    <a href={`${baseUrl}${other.slug}`} onClick={(event) => openArticle(event, other.slug)}>
                      <span>{other.h1}</span>
                      <ArrowRight aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="article-cta" data-article-reveal>
            <h2>Use Introscribe in your next live conversation</h2>
            <p>Download the desktop app for real-time transcription, meeting notes, interview support, and contextual AI answers.</p>
            <div className="article-hero__actions">{actions}</div>
          </section>
        </div>
      </main>
    </div>
  );
};

const legalSectionId = (title) =>
  title.includes("Cookies") ? "cookies" : title.toLowerCase().replace(/^\d+\.\s*/, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const legalSectionLabel = (title) => title.replace(/^\d+\.\s*/, "");

// Shared layout for the Privacy Policy and Terms of Service pages.
const LEGAL_FADE_OUT_MS = 220;
const LEGAL_FADE_IN_MS = 520;

const LegalPage = ({ kind, doc, baseUrl, dark, onToggleTheme, onNavigate }) => {
  const { title, intro, updated, highlights, sections, faqs, faqTitle, contact } = doc;
  const [activeId, setActiveId] = useState(() => legalSectionId(sections[0].title));
  // "out" fades the current document away, "in" brings the new one in; the tab pill moves immediately.
  const [phase, setPhase] = useState("idle");
  const [selected, setSelected] = useState(kind);
  const timersRef = useRef([]);

  useEffect(() => setSelected(kind), [kind]);
  useEffect(() => () => timersRef.current.forEach(clearTimeout), []);

  const switchTo = (event, target) => {
    event.preventDefault();
    if (target === kind || phase === "out") return;
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    setSelected(target);
    if (reduceMotion) {
      onNavigate(target);
      window.scrollTo(0, 0);
      return;
    }
    setPhase("out");
    timersRef.current.push(
      setTimeout(() => {
        onNavigate(target);
        if (window.scrollY > 0) window.scrollTo({ top: 0, behavior: "instant" });
        setPhase("in");
        timersRef.current.push(setTimeout(() => setPhase("idle"), LEGAL_FADE_IN_MS));
      }, LEGAL_FADE_OUT_MS)
    );
  };

  // The page renders after the browser handles the URL hash, so jump to it once content exists.
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const target = document.getElementById(decodeURIComponent(hash));
    if (target) requestAnimationFrame(() => target.scrollIntoView());
  }, []);

  // Highlight the contents entry for the section currently being read.
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return undefined;
    const elements = sections.map((section) => document.getElementById(legalSectionId(section.title))).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -70% 0px" }
    );
    setActiveId(legalSectionId(sections[0].title));
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [sections]);

  const contents = (
    <ol className="legal-toc__list">
      {sections.map((section, index) => {
        const id = legalSectionId(section.title);
        return (
          <li key={id}>
            <a href={`#${id}`} className={activeId === id ? "is-active" : ""}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {legalSectionLabel(section.title)}
            </a>
          </li>
        );
      })}
    </ol>
  );

  return (
    <div className="legal">
      <SubpageBar baseUrl={baseUrl} dark={dark} onToggleTheme={onToggleTheme} />

      <main className="legal-wrap">
        <section className="legal-hero">
          <nav className={`legal-switch legal-switch--${selected}`} aria-label="Legal documents">
            <span className="legal-switch__pill" aria-hidden="true" />
            <a
              href={`${baseUrl}privacy`}
              className={selected === "privacy" ? "is-active" : ""}
              aria-current={kind === "privacy" ? "page" : undefined}
              onClick={(event) => switchTo(event, "privacy")}
            >
              Privacy Policy
            </a>
            <a
              href={`${baseUrl}terms`}
              className={selected === "terms" ? "is-active" : ""}
              aria-current={kind === "terms" ? "page" : undefined}
              onClick={(event) => switchTo(event, "terms")}
            >
              Terms of Service
            </a>
          </nav>
        </section>

        <div className={`legal-doc legal-doc--${phase}`}>
          <section className="legal-hero legal-hero--doc">
            <h1>{title}</h1>
            <p className="legal-hero__updated">Last updated {updated}</p>
            <p className="legal-hero__intro">{intro}</p>
          </section>

          <section className="legal-glance" aria-label="At a glance">
            {highlights.map((item) => (
              <div key={item.title}>
                <h2>{item.title}</h2>
                <p>{item.body}</p>
              </div>
            ))}
          </section>

          <div className="legal-body">
            <aside className="legal-toc" aria-label="On this page">
              <p className="legal-toc__label">On this page</p>
              {contents}
            </aside>

            <details className="legal-toc-mobile">
              <summary>
                On this page
                <ChevronDown aria-hidden="true" />
              </summary>
              {contents}
            </details>

            <div className="legal-content">
              {sections.map((section, index) => (
                <section key={section.title} id={legalSectionId(section.title)} className="legal-section">
                  <h2>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    {legalSectionLabel(section.title)}
                  </h2>
                  <div className="legal-section__body">{section.body}</div>
                </section>
              ))}

              <section className="legal-faq" aria-labelledby={`${kind}-faq-title`}>
                <h2 id={`${kind}-faq-title`}>{faqTitle}</h2>
                <dl>
                  {faqs.map((faq) => (
                    <div key={faq.q}>
                      <dt>{faq.q}</dt>
                      <dd>{faq.a}</dd>
                    </div>
                  ))}
                </dl>
              </section>

              <section className="legal-contact">
                <h2>{contact.title}</h2>
                <p>{contact.body}</p>
                <a href="mailto:support@introscribe.com" className="legal-contact__link">
                  support@introscribe.com
                  <ArrowRight aria-hidden="true" />
                </a>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const COOKIE_CATEGORIES = [
  {
    key: "essential",
    title: "Essential",
    body: "Required for core site behavior, security, and remembering your theme.",
    locked: true,
  },
  {
    key: "analytics",
    title: "Analytics",
    body: "Helps us understand aggregate site usage and improve page performance.",
  },
  {
    key: "product",
    title: "Product updates",
    body: "Remembers lightweight preferences for product announcements and onboarding.",
  },
];

const COOKIE_EXIT_MS = 220;

// Cookie preferences sheet. Keeps its own draft so toggles don't re-render the page.
const CookieSettings = ({ initial, onSave, onClose, privacyHref, onOpenPrivacy }) => {
  const cardRef = useRef(null);
  const [draft, setDraft] = useState(() => ({ analytics: false, product: false, ...initial, essential: true }));
  const [closing, setClosing] = useState(false);

  const finish = (after) => {
    if (closing) return;
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    setClosing(true);
    setTimeout(after, reduceMotion ? 0 : COOKIE_EXIT_MS);
  };
  const close = () => finish(onClose);
  const save = (preferences) => finish(() => onSave(preferences));

  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    cardRef.current?.focus();
    const onKey = (event) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`cookie-sheet ${closing ? "is-closing" : ""}`} role="dialog" aria-modal="true" aria-labelledby="cookie-sheet-title">
      <button type="button" className="cookie-sheet__backdrop" aria-label="Close cookie settings" onClick={close} />
      <div className="cookie-sheet__card" ref={cardRef} tabIndex={-1}>
        <div className="cookie-sheet__grip" aria-hidden="true" />
        <header className="cookie-sheet__head">
          <div>
            <h2 id="cookie-sheet-title">Cookie settings</h2>
            <p>Choose which optional cookies Introscribe can use on this website. You can change this anytime.</p>
          </div>
          <button type="button" className="cookie-sheet__close" aria-label="Close cookie settings" onClick={close}>
            <X aria-hidden="true" />
          </button>
        </header>

        <ul className="cookie-sheet__list">
          {COOKIE_CATEGORIES.map((category) => {
            const on = Boolean(draft[category.key]);
            const id = `cookie-${category.key}`;
            return (
              <li key={category.key}>
                <div className="cookie-sheet__text">
                  <label htmlFor={id}>
                    {category.title}
                    {category.locked ? <span className="cookie-sheet__badge">Always on</span> : null}
                  </label>
                  <p id={`${id}-desc`}>{category.body}</p>
                </div>
                <button
                  type="button"
                  id={id}
                  role="switch"
                  aria-checked={on}
                  aria-describedby={`${id}-desc`}
                  disabled={category.locked}
                  className={`cookie-switch ${on ? "is-on" : ""}`}
                  onClick={() => setDraft((current) => ({ ...current, [category.key]: !current[category.key] }))}
                >
                  <span aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>

        <div className="cookie-sheet__actions">
          <button type="button" className="cookie-sheet__save" onClick={() => save(draft)}>
            Save preferences
          </button>
          <div className="cookie-sheet__quick">
            <button type="button" onClick={() => save({ essential: true, analytics: false, product: false })}>Reject optional</button>
            <button type="button" onClick={() => save({ essential: true, analytics: true, product: true })}>Accept all</button>
          </div>
        </div>

        <p className="cookie-sheet__foot">
          Learn more in our{" "}
          <a
            href={privacyHref}
            onClick={(event) => {
              event.preventDefault();
              finish(onOpenPrivacy);
            }}
          >
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
};

const FOOTER_COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Features", path: "#how" },
      { label: "How it works", path: "#how-it-works" },
      { label: "Pricing", path: "#pricing" },
      { label: "FAQ", path: "#faq" },
      { label: "Download", path: "download" },
    ],
  },
  {
    title: "Use cases",
    links: [
      { label: "Job interviews", path: "ai-interview-assistant" },
      { label: "Meetings", path: "ai-meeting-assistant" },
      { label: "Sales calls", path: "sales-call-assistant" },
      { label: "Professional calls", path: "real-time-conversation-assistant" },
      { label: "Live transcription", path: "live-transcription-software" },
    ],
  },
  {
    title: "Compare",
    links: [
      { label: "Cluely alternative", path: "cluely-alternative" },
      { label: "Final Round AI alternative", path: "finalround-ai-alternative" },
      { label: "Otter.ai alternative", path: "otter-ai-alternative" },
      { label: "Fireflies.ai alternative", path: "fireflies-ai-alternative" },
      { label: "Gong alternative", path: "gong-alternative" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Using AI in interviews", path: "blog/how-to-use-ai-in-interviews" },
      { label: "Technical interviews", path: "blog/how-to-pass-technical-interviews" },
      { label: "System design prep", path: "blog/how-to-prepare-for-system-design-interviews" },
      { label: "Behavioral questions", path: "blog/how-to-answer-behavioral-interview-questions" },
      { label: "Best AI meeting assistant", path: "blog/best-ai-meeting-assistant" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Contact us", href: "mailto:support@introscribe.com" },
      { label: "Support", href: "mailto:support@introscribe.com" },
      { label: "Privacy Policy", path: "privacy" },
      { label: "Terms of Service", path: "terms" },
    ],
  },
];


export default function introscribeLanding() {
  const baseUrl = (import.meta?.env?.BASE_URL ?? '/').replace(/\/?$/, '/');
  const windowsInstaller = DOWNLOAD_FILES.windows.url;
  const macInstaller = DOWNLOAD_FILES.mac.url;
  const desktopAppCopy = "Introscribe is a desktop app for macOS & Windows";
  const desktopRequirements = [
    {
      label: "macOS",
      items: [
        "macOS 10.15 (Catalina) or later",
        "Apple Silicon or Intel processor",
        "500 MB free disk space",
        "8 GB RAM recommended",
      ],
    },
    {
      label: "Windows",
      items: [
        "Windows 11",
        "x64 (64-bit) processor",
        "500 MB free disk space",
        "8 GB RAM recommended",
      ],
    },
  ];
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
  const desktopModalRef = useRef(null);
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

  // Slide the billing toggle indicator under the active option
  useEffect(() => {
    const place = () => {
      const activeEl = yearly ? yearlyBtnRef.current : monthlyBtnRef.current;
      const indicator = indicatorRef.current;
      if (!activeEl || !indicator) return;
      indicator.style.left = `${activeEl.offsetLeft}px`;
      indicator.style.width = `${activeEl.offsetWidth}px`;
    };
    place();
    window.addEventListener("resize", place);
    document.fonts?.ready?.then(place);
    return () => window.removeEventListener("resize", place);
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
  const [openFooterColumn, setOpenFooterColumn] = useState(null);
  const heroRef = useRef(null);
  const [heroPassed, setHeroPassed] = useState(false);
  const [routePath, setRoutePath] = useState(() => (typeof window !== "undefined" ? window.location.pathname : "/"));

  useEffect(() => {
    const handlePopState = () => setRoutePath(window.location.pathname);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Floating download button: appears once the hero's own download button has scrolled out of view above.
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || typeof IntersectionObserver === "undefined") {
      setHeroPassed(false);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => {
      setHeroPassed(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    observer.observe(hero);
    return () => observer.disconnect();
  }, [routePath]);

  // Client-side navigation between pages that share a layout (the legal documents).
  const navigateTo = (path) => {
    if (typeof window === "undefined" || window.location.pathname === path) return;
    window.history.pushState({}, "", path);
    setRoutePath(path);
  };

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

  const closeDesktopPrompt = () => {
    setShowDesktopModal(false);
    setShareStatus("");
  };

  useEffect(() => {
    if (!showDesktopModal) return undefined;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    desktopModalRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeDesktopPrompt();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
  }, [showDesktopModal]);

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

  const normalizePath = (value) => {
    const normalized = value.replace(/\/$/, "");
    return normalized === "" ? "/" : normalized;
  };

  const currentPath = routePath;
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
  const isLandingPage = !currentSlug;
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
        ".benefits-head",
        ".benefit-card",
        ".uc-head",
        ".uc-body",
        ".nt-panel",
        ".nt-points li",
        ".steps-head",
        ".step-card",
        "#how > div > div > .mx-auto:first-child",
        ".privacy-preview-column",
        ".feature-overlay-preview-stage",
        ".transcription-stats",
        ".transcription-stat-row",
        ".pricing-head",
        ".plan-card",
        ".plans-includes",
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
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__top">
          <a href={baseUrl} aria-label="Introscribe home" className="site-footer__brand">
            <img src="/logo-b.png" alt="introscribe" className="site-footer__logo site-footer__logo--light" decoding="async" />
            <img src="/logo-w.png" alt="" className="site-footer__logo site-footer__logo--dark" decoding="async" aria-hidden="true" />
          </a>
          <div className="site-footer__note">
            <p>Introscribe is a desktop app for macOS and Windows built for conversations where it helps to listen closely and keep the details. It brings live transcription, in-the-moment assistance, and organized notes into one place, so you can follow a discussion as it unfolds and return to its most useful moments later. Whether you are joining a meeting, preparing for an interview, speaking with a customer, or learning from a training session, Introscribe helps you stay focused on the people in front of you while keeping a record of what was said.</p>
            <p>During a conversation, live transcription makes spoken information easier to follow. Introscribe can help surface relevant points while the discussion is still happening, giving you more context when you need to respond or ask a better question. After the conversation, it can turn a long exchange into structured notes that are easier to scan than a raw transcript. Key topics, decisions, action items, and follow-ups can be brought together so the next step is clearer.</p>
            <p>Use those notes to review a detail you missed, prepare a recap, or pick up where a previous conversation left off. In interviews, they can help you revisit a question or an answer. In meetings and sales calls, they can make it easier to track commitments and understand what needs attention next. In lectures and training sessions, they can help you return to important ideas without searching through an entire conversation from the beginning.</p>
            <p>Introscribe is meant to support your judgment and your workflow. Transcripts and generated notes can miss context or contain mistakes, especially when audio is unclear, people speak over one another, or specialized terms are used. Review important details before sharing a recap, making a decision, or relying on a suggested follow-up. You remain responsible for how you use the information from each conversation.</p>
            <p>Introscribe is available as a desktop download for supported macOS and Windows computers. The mobile website helps you learn about the app and send yourself a link to open on your computer. Before recording or transcribing a conversation, make sure your use is appropriate for the people involved and follow the laws and consent requirements that apply where you are.</p>
          </div>
        </div>

        <nav className="site-footer__columns" aria-label="Footer">
          {FOOTER_COLUMNS.map((column) => {
            const open = openFooterColumn === column.title;
            const listId = `footer-col-${column.title.toLowerCase().replace(/\s+/g, "-")}`;
            return (
              <div key={column.title} className={`site-footer__column ${open ? "is-open" : ""}`}>
                <h2>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={listId}
                    onClick={() => setOpenFooterColumn((current) => (current === column.title ? null : column.title))}
                  >
                    {column.title}
                    <ChevronDown aria-hidden="true" />
                  </button>
                </h2>
                <ul id={listId}>
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href ?? `${baseUrl}${link.path}`}>{link.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </nav>

        <div className="site-footer__bottom">
          <p>Copyright © {new Date().getFullYear()} Introscribe. All rights reserved.</p>
          <ul className="site-footer__legal">
            <li><a href={`${baseUrl}privacy`}>Privacy Policy</a></li>
            <li><a href={`${baseUrl}terms`}>Terms of Service</a></li>
            <li>
              <a
                href={`${baseUrl}privacy#cookies`}
                onClick={(event) => {
                  event.preventDefault();
                  setShowCookieSettings(true);
                }}
              >
                Cookie Settings
              </a>
            </li>
          </ul>
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
      title: "Notes that write themselves.",
      desc:
        "Introscribe listens in the background and turns messy conversations into clean, structured notes, so you leave every call with a recap that's ready to share.",
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
      kind: "listen",
      icon: Mic,
      title: "Live transcription",
      desc: "Turns speech into text as it’s spoken, so nothing important gets lost.",
    },
    {
      kind: "understanding",
      icon: Zap,
      title: "Smart understanding",
      desc: "Picks out topics, key points, and action items automatically while you talk.",
    },
    {
      kind: "queries",
      icon: MessageSquareText,
      title: "Conversational queries",
      desc: "Ask questions about your transcript and get answers grounded in what was actually said.",
    },
    {
      kind: "insights",
      icon: Clock10,
      title: "Real-time insights",
      desc: "Get prompts and suggestions live, right when you need them, to steer meetings and decisions.",
    },
  ];

  const plans = [
    {
      name: "Free Plan",
      slug: "free",
      tagline: "Try Introscribe on your next few calls.",
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
      tagline: "For people who live in meetings and interviews.",
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
      highlight: false,
    },
    {
      name: "Pro Plan",
      slug: "pro",
      tagline: "For calls where discretion matters most.",
      priceM: 20.99,
      priceY: 16.79, // monthly * 0.8 with 20% annual discount (billed yearly)
      bullets: [
        "Everything included in the Plus plan",
        "Completely hidden from meeting screen-sharing software",
      ],
      cta: "Book a Call",
      highlight: true,
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

  const privacyDoc = {
      title: "Privacy Policy",
      intro: "This Privacy Policy explains what information Introscribe collects, how we use it, and the controls you have over your data when you use our desktop app and website.",
      updated: PRIVACY_LAST_UPDATED,
      highlights: PRIVACY_HIGHLIGHTS,
      sections: PRIVACY_SECTIONS,
      faqs: PRIVACY_FAQS,
      faqTitle: "Privacy questions we hear often",
      contact: {
        title: "Talk to us about your data",
        body: "Email us for privacy requests, account deletion, or anything else about how Introscribe handles your information.",
      },
  };

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

  const termsDoc = {
      title: "Terms of Service",
      intro: "These Terms of Service explain the rules for using the Introscribe desktop app, our website, and related services. Please read them carefully before you use Introscribe.",
      updated: TERMS_LAST_UPDATED,
      highlights: TERMS_HIGHLIGHTS,
      sections: TERMS_SECTIONS,
      faqs: TERMS_FAQS,
      faqTitle: "Common questions about the Terms",
      contact: {
        title: "Need help with the Terms?",
        body: "Email us and we will get back to you about anything in this document.",
      },
  };

  return (
  <div className="min-h-screen text-zinc-900 dark:text-white">
      {isMobile && showDesktopModal && (
        <div className="desktop-modal" role="dialog" aria-modal="true" aria-labelledby="desktop-modal-title" aria-describedby="desktop-modal-lead">
          <button type="button" className="desktop-modal__backdrop" aria-label="Close dialog" onClick={closeDesktopPrompt} />
          <div className="desktop-modal__card" ref={desktopModalRef} tabIndex={-1}>
            <div className="desktop-modal__grip" aria-hidden="true" />
            <div className="desktop-modal__header">
              <div>
                <h3 id="desktop-modal-title" className="desktop-modal__title">Open on desktop</h3>
                <p id="desktop-modal-lead" className="desktop-modal__lead">Introscribe is available for macOS and Windows. Copy this link and open it on your computer to download the app.</p>
              </div>
              <button type="button" className="desktop-modal__close" onClick={closeDesktopPrompt} aria-label="Close dialog">
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <div className="desktop-modal__body">
              <div className="desktop-modal__steps" aria-label="How to install">
                <div><span>1</span><p>Copy the website link</p></div>
                <div><span>2</span><p>Open it on your computer</p></div>
              </div>
              <button type="button" className="desktop-modal__action" onClick={handleCopyDesktopLink}>
                {shareStatus.startsWith("Link copied") ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
                {shareStatus.startsWith("Link copied") ? "Link copied" : "Copy desktop link"}
              </button>
              <p className="desktop-modal__hint" role="status">{shareStatus || "Available for macOS and Windows."}</p>
              {shareStatus.startsWith("Copy unavailable") && (
                <input
                  className="desktop-modal__link"
                  aria-label="Desktop website link"
                  value={desktopLandingLink}
                  readOnly
                  onFocus={(event) => event.currentTarget.select()}
                />
              )}
              <details className="desktop-modal__requirements">
                <summary>Check desktop requirements <ChevronDown size={16} aria-hidden="true" /></summary>
                <div className="desktop-modal__requirements-grid">
                  {desktopRequirements.map((requirement) => (
                    <div className="desktop-modal__requirement-group" key={requirement.label}>
                      <h4>{requirement.label}</h4>
                      <ul>
                        {requirement.items.map((item) => <li key={item}>{item}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          </div>
        </div>
      )}
      {showCookieSettings && (
        <CookieSettings
          initial={cookiePreferences}
          onSave={persistCookiePreferences}
          onClose={() => setShowCookieSettings(false)}
          privacyHref={`${baseUrl}privacy#cookies`}
          onOpenPrivacy={() => {
            setShowCookieSettings(false);
            navigateTo(`${baseUrl}privacy`);
            setTimeout(() => document.getElementById("cookies")?.scrollIntoView({ behavior: "smooth" }), 80);
          }}
        />
      )}
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
      ) : isPrivacyPage || isTermsPage ? (
        <LegalPage
          kind={isPrivacyPage ? "privacy" : "terms"}
          doc={isPrivacyPage ? privacyDoc : termsDoc}
          baseUrl={baseUrl}
          dark={dark}
          onToggleTheme={() => setDark((d) => !d)}
          onNavigate={(kind) => navigateTo(`${baseUrl}${kind}`)}
        />
      ) : isDownloadPage ? (
        <DownloadPage />
      ) : activeSeoPage ? (
        <ArticlePage
          page={activeSeoPage}
          pages={seoPages}
          baseUrl={baseUrl}
          dark={dark}
          onToggleTheme={() => setDark((d) => !d)}
          onNavigate={(slug) => navigateTo(`${baseUrl}${slug}`)}
          actions={
            isMobile ? (
              <DesktopRequiredCTA tone="light" align="start" />
            ) : (
              downloadOptions.map((opt, index) => (
                <a key={opt.label} href={opt.href} className={`article-btn ${index === 0 ? "article-btn--primary" : ""}`}>
                  <DownloadPlatformIcon platform={opt.platform} />
                  {opt.label}
                </a>
              ))
            )
          }
        />
      ) : (
        <main data-scroll-reveal-root>
          {/* Hero */}
      <section className="landing-bg landing-bg-animate w-full pb-8 md:pb-16">
        <Header />
        <div className="mx-auto max-w-6xl px-4 pt-10 md:pt-24">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center text-white hero-text-glow">
          <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl hero-title-animate">
           Your Real-Time AI Assistant
            <br />
            <HeroTyped words={HERO_WORDS} />
          </h1>
          <p className="mt-4 text-pretty text-white/80 dark:text-zinc-300 hero-lead hero-cta-animate">
            Transcribe every word, capture every insight, <br /> and get intelligent suggestions all in real time.
          </p>
          <div ref={heroRef} className="mt-6 flex flex-wrap items-center justify-center gap-4 hero-cta-animate">
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
      <section id="benefits" className="benefits mx-auto max-w-7xl px-4 py-16 md:py-24" aria-labelledby="benefits-title">
        <div className="benefits-head">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium dark:border-white/10">
            <Mic className="h-3.5 w-3.5" /> In every conversation
          </div>
          <h2 id="benefits-title" className="price-number">
            Listen, capture, and <span className="benefits-head__accent">respond wisely.</span>
          </h2>
          <p>An AI meeting copilot that records, summarizes, and turns conversations into structured, shareable outcomes.</p>
        </div>

        <div className="benefits-grid">
          {benefits.map((b) => <BenefitCard key={b.kind} benefit={b} />)}
        </div>
      </section>

      {/* Use cases */}
      <UseCasesShowcase baseUrl={baseUrl} />

  {/* Feature Sections */}
      <section id="how" className="mx-auto max-w-7xl px-4 py-6 md:py-10">
        <div className="grid gap-24 md:gap-[8.5rem]">
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
	                  <div className="undetectable-media-grid grid gap-5 gap-y-10 pt-8 md:grid-cols-2 md:gap-y-5 md:pt-10">
	                    <div className="privacy-preview-column">
	                      <div
	                        ref={privacyPreviewRef}
	                        className="privacy-preview-card"
	                        style={{ "--privacy-split": `${privacySplit}%` }}
	                      >
	                        <div className="privacy-preview-media privacy-comparison" aria-label="Visibility comparison preview">
	                          <video
	                            key={dark ? "seen-dark" : "seen"}
		                            src={dark ? "/seen-dark.mp4" : "/seen.mp4"}
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
	                              key={dark ? "unseen-dark" : "unseen"}
		                              src={dark ? "/unseen-dark.mp4" : "/unseen.mp4"}
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
	                            key={dark ? "overlay-dark" : "overlay"}
		                            src={dark ? "/overlay_bg-dark.mp4" : "/overlay_bg.mp4"}
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
	                            defaultCollapsed
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
              return <NotesSection key={i} lead={f.desc} />;
            }

            if (f.stats) {
              return (
                <div key={i} className="grid gap-8 md:pt-8">
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
                        key={dark ? "transcript-dark" : "transcript"}
                        src={dark ? "/live_transcript-dark.mp4" : "/live_transcript.mp4"}
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
	                      key={dark ? "transcript-dark" : "transcript"}
                        src={dark ? "/live_transcript-dark.mp4" : "/live_transcript.mp4"}
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
	                      key={dark ? "transcript-dark" : "transcript"}
                        src={dark ? "/live_transcript-dark.mp4" : "/live_transcript.mp4"}
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
      <section id="pricing" className="pricing mx-auto max-w-7xl px-4 py-16 md:py-24" aria-labelledby="pricing-title">
        <div className="pricing-head">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium dark:border-white/10">
            <CreditCard className="h-3.5 w-3.5" /> Pricing
          </div>
          <h2 id="pricing-title" className="price-number">
            Simple pricing. <span className="pricing-head__accent">No surprises.</span>
          </h2>
          <p>Start free, then upgrade when Introscribe becomes part of every call.</p>

          <div className="billing-toggle" role="group" aria-label="Billing period">
            <span ref={indicatorRef} className="billing-toggle__indicator" aria-hidden="true"></span>
            <button type="button" ref={monthlyBtnRef} className={!yearly ? "is-active" : ""} aria-pressed={!yearly} onClick={() => setYearly(false)}>
              Monthly
            </button>
            <button type="button" ref={yearlyBtnRef} className={yearly ? "is-active" : ""} aria-pressed={yearly} onClick={() => setYearly(true)}>
              Yearly<span className="billing-toggle__save">−20%</span>
            </button>
          </div>
        </div>

        <div className="plans-grid">
          {plans.map((p) => {
            const isPaid = p.priceM > 0;
            const amount = yearly ? p.priceY : p.priceM;
            return (
              <article key={p.slug} className={`plan-card ${p.highlight ? "plan-card--featured" : ""}`}>
                <div className="plan-card__top">
                  <h3>{p.name.replace(/ Plan$/, "")}</h3>
                  {p.highlight ? <span className="plan-card__badge">Most popular</span> : null}
                </div>
                <p className="plan-card__tagline">{p.tagline}</p>

                <div className="plan-card__price" key={`${p.slug}-${yearly}`}>
                  {isPaid ? (
                    <>
                      <span className="plan-card__amount">${amount.toFixed(2)}</span>
                      <span className="plan-card__cycle">/ month</span>
                    </>
                  ) : (
                    <span className="plan-card__amount">$0</span>
                  )}
                </div>
                <p className="plan-card__note">
                  {!isPaid ? "Free forever, no card required" : yearly ? `Billed $${(p.priceY * 12).toFixed(2)} yearly` : "Billed monthly, cancel anytime"}
                </p>

                <a
                  href={isPaid
                    ? `https://app.introscribe.com/?plan=${p.slug}${yearly ? "&interval=yearly&autologin=1" : ""}`
                    : `${baseUrl}download`}
                  className="plan-card__cta"
                >
                  {isPaid ? `Get ${p.name.replace(/ Plan$/, "")}` : "Download for free"}
                  <ArrowRight aria-hidden="true" />
                </a>

                <div className="plan-card__features">
                  <p>{p.slug === "plus" ? "Everything in Free, plus" : "What's included"}</p>
                  <ul>
                    {p.bullets.map((b) => (
                      <li key={b}>
                        <span className="plan-card__check" aria-hidden="true"><Check /></span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>

        <ul className="plans-includes" aria-label="Included in every plan">
          <li><Monitor aria-hidden="true" /> macOS &amp; Windows</li>
          <li><MessageSquareText aria-hidden="true" /> Works with Zoom, Meet &amp; Teams</li>
          <li><Lock aria-hidden="true" /> Encrypted in transit and at rest</li>
          <li><Check aria-hidden="true" /> Cancel anytime</li>
        </ul>
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
              className={`px-1 md:px-7 ${i < faqs.length - 1 ? 'border-b border-zinc-200 dark:border-white/10' : ''}`}
            >
              <button
                onClick={() => setOpenFAQ((cur) => (cur === i ? null : i))}
                className="flex w-full items-center justify-between gap-6 py-5 text-left text-lg md:py-6 md:text-2xl"
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

      {/* Meeting notes in 3 steps */}
      <section id="how-it-works" className="steps mx-auto max-w-7xl px-4 py-16 md:py-24" aria-labelledby="steps-title">
        <div className="steps-head">
          <h2 id="steps-title" className="price-number">Meeting notes in 3 steps</h2>
          <p>The easiest way to get clean, shareable meeting notes.</p>
        </div>
        <ol className="steps-grid">
          {MEETING_STEPS.map((step, index) => (
            <li key={step.title} className="step-card">
              <div className="step-card__visual">
                <div className="step-card__media">
                  <StepArt art={step.art} />
                </div>
              </div>
              <h3>
                <span className="step-card__num">{index + 1}</span>
                {step.title}
              </h3>
              <p>{step.desc}</p>
            </li>
          ))}
        </ol>
      </section>

        </main>
      )}
      <Footer />
      {isLandingPage ? (
        <div className={`floating-download ${heroPassed ? "is-visible" : ""}`} aria-hidden={!heroPassed}>
          {isMobile ? (
            <button type="button" className="desktop-cta-btn" onClick={openDesktopPrompt} tabIndex={heroPassed ? undefined : -1}>
              Open on Desktop
            </button>
          ) : (
            <a
              href={os === "windows" ? windowsInstaller : macInstaller}
              className={`download-btn glassy ${os === "windows" ? "" : "download-btn--mac"}`}
              title={os === "windows" ? "Download Windows installer" : "Download macOS installer"}
              tabIndex={heroPassed ? undefined : -1}
            >
              <DownloadPlatformIcon platform={os === "windows" ? "windows" : "mac"} />
              {os === "windows" ? "Get for Windows" : "Get for Mac OS"}
            </a>
          )}
        </div>
      ) : null}
    </div>
  );
}
