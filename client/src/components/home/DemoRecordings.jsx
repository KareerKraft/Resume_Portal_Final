import { useEffect, useMemo, useRef, useState } from "react";

const RECORDINGS = [
  {
    id: 1,
    title: "Build Your Resume",
    caption: "Show how users start a resume and choose a template.",
    src: "/videos/ResumeWorking.mp4",
  },
  {
    id: 2,
    title: "Enhance With AI",
    caption: "Highlight the AI features that improve resume content.",
    src: "/videos/ResumeWorking2.mp4",
  },
  {
    id: 3,
    title: "Preview And Download",
    caption: "Demonstrate the preview flow and final export experience.",
    src: "/videos/ResumeWorking3.mp4",
  },
];

const FALLBACK_DURATION = 15000;

export default function DemoRecordings() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [videoStatus, setVideoStatus] = useState({});
  const timerRef = useRef(null);
  const videoRefs = useRef([]);

  const total = RECORDINGS.length;

  const orderedCards = useMemo(() => {
    return RECORDINGS.map((item, index) => {
      const diff = (index - activeIndex + total) % total;
      return { ...item, index, diff };
    }).sort((a, b) => a.diff - b.diff);
  }, [activeIndex, total]);

  const goNext = () => {
    setActiveIndex((current) => (current + 1) % total);
  };

  const goPrev = () => {
    setActiveIndex((current) => (current - 1 + total) % total);
  };

  const activeVideoStatus = videoStatus[activeIndex];

  useEffect(() => {
    const activeVideo = videoRefs.current[activeIndex];
    const allVideos = videoRefs.current.filter(Boolean);

    clearTimeout(timerRef.current);
    allVideos.forEach((video, index) => {
      if (index !== activeIndex) {
        video.pause();
        video.currentTime = 0;
      }
    });

    if (!activeVideo || activeVideoStatus === "error") {
      timerRef.current = setTimeout(goNext, FALLBACK_DURATION);
      return () => clearTimeout(timerRef.current);
    }

    if (activeVideoStatus !== "ready") {
      return () => clearTimeout(timerRef.current);
    }

    activeVideo.currentTime = 0;

    const playVideo = async () => {
      try {
        await activeVideo.play();
      } catch {
        timerRef.current = setTimeout(goNext, FALLBACK_DURATION);
      }
    };

    playVideo();

    return () => {
      clearTimeout(timerRef.current);
      activeVideo.pause();
    };
  }, [activeIndex, activeVideoStatus]);

  return (
    <>
      <style>{CSS}</style>
      <section id="demo" className="demo-recordings">
        <div className="demo-shell">
          <div className="demo-copy">
            <span className="demo-eyebrow">SCREEN RECORDINGS</span>
            <h2>See the builder in motion before the showcase begins.</h2>
            <p>
              Each screen recording plays fully from start to finish. When one
              video ends, the next card slides forward automatically, and after
              the third recording the sequence loops back to the first.
            </p>
            <div className="demo-indicators" aria-label="Recording progress">
              {RECORDINGS.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  className={`demo-indicator${index === activeIndex ? " is-active" : ""}`}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Show ${item.title}`}
                />
              ))}
            </div>
          </div>

          <div className="demo-stage">
            {orderedCards.map((item) => (
              <article
                key={item.id}
                className={`demo-card card-${item.diff}`}
                aria-hidden={item.diff !== 0}
              >
                <div className="demo-video-frame">
                  <video
                    ref={(element) => {
                      videoRefs.current[item.index] = element;
                    }}
                    src={item.src}
                    muted
                    playsInline
                    preload="auto"
                    controls={item.diff === 0}
                    onCanPlay={() =>
                      setVideoStatus((current) => ({
                        ...current,
                        [item.index]: "ready",
                      }))
                    }
                    onError={() =>
                      setVideoStatus((current) => ({
                        ...current,
                        [item.index]: "error",
                      }))
                    }
                    onEnded={() => {
                      if (item.diff === 0) {
                        goNext();
                      }
                    }}
                  />
                  {videoStatus[item.index] === "error" && (
                    <div className="demo-placeholder">
                      <span className="demo-placeholder-badge">Video missing</span>
                      <strong>{item.title}</strong>
                      <p>{item.caption}</p>
                    </div>
                  )}
                </div>
                <div className="demo-meta">
                  <span className="demo-step">0{item.id}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.caption}</p>
                  </div>
                </div>
              </article>
            ))}

            <div className="demo-nav">
              <button
                type="button"
                className="demo-nav-btn"
                onClick={goPrev}
                aria-label="Show previous recording"
              >
                Previous
              </button>
              <button
                type="button"
                className="demo-nav-btn is-primary"
                onClick={goNext}
                aria-label="Show next recording"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

const CSS = `
  .demo-recordings {
    position: relative;
    overflow: hidden;
    padding: 90px 24px 30px;
    background:
      radial-gradient(circle at top left, rgba(187, 247, 208, 0.7), transparent 30%),
      linear-gradient(180deg, #f7fff9 0%, #ecfdf3 54%, #ffffff 100%);
  }

  .demo-shell {
    max-width: 1240px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: minmax(280px, 360px) minmax(0, 1fr);
    gap: 40px;
    align-items: center;
  }

  .demo-copy {
    padding: 10px 0;
  }

  .demo-eyebrow {
    display: inline-flex;
    align-items: center;
    border-radius: 999px;
    background: rgba(22, 101, 52, 0.08);
    color: #166534;
    padding: 8px 14px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.22em;
  }

  .demo-copy h2 {
    margin: 18px 0 14px;
    color: #0f172a;
    font-size: clamp(2rem, 4vw, 3.35rem);
    line-height: 1.02;
    letter-spacing: -0.04em;
  }

  .demo-copy p {
    margin: 0;
    max-width: 32rem;
    color: #4b5563;
    font-size: 1rem;
    line-height: 1.8;
  }

  .demo-indicators {
    display: flex;
    gap: 10px;
    margin-top: 28px;
  }

  .demo-indicator {
    width: 42px;
    height: 6px;
    border: 0;
    border-radius: 999px;
    background: rgba(22, 101, 52, 0.18);
    transition: all 0.35s ease;
  }

  .demo-indicator.is-active {
    width: 68px;
    background: linear-gradient(90deg, #22c55e, #86efac);
  }

  .demo-stage {
    position: relative;
    min-height: 470px;
    display: flex;
    align-items: center;
    justify-content: center;
    perspective: 1500px;
  }

  .demo-card {
    position: absolute;
    width: min(100%, 700px);
    border-radius: 28px;
    padding: 18px;
    background: rgba(255, 255, 255, 0.92);
    border: 1px solid rgba(187, 247, 208, 0.9);
    box-shadow: 0 28px 80px rgba(22, 101, 52, 0.12);
    transition:
      transform 0.75s cubic-bezier(0.22, 1, 0.36, 1),
      opacity 0.75s ease,
      filter 0.75s ease;
    transform-origin: center center;
    backdrop-filter: blur(10px);
  }

  .demo-nav {
    position: absolute;
    left: 24px;
    right: 24px;
    bottom: -18px;
    z-index: 5;
    display: flex;
    justify-content: space-between;
    pointer-events: none;
  }

  .demo-nav-btn {
    pointer-events: auto;
    border: 1px solid rgba(21, 128, 61, 0.18);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.92);
    color: #166534;
    padding: 12px 18px;
    font-size: 0.92rem;
    font-weight: 600;
    box-shadow: 0 18px 36px rgba(22, 101, 52, 0.12);
    transition: transform 0.25s ease, background 0.25s ease, color 0.25s ease;
  }

  .demo-nav-btn:hover {
    transform: translateY(-2px);
    background: #f0fdf4;
  }

  .demo-nav-btn.is-primary {
    background: linear-gradient(135deg, #22c55e, #86efac);
    color: #14532d;
  }

  .demo-video-frame {
    position: relative;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    border-radius: 20px;
    background:
      linear-gradient(135deg, rgba(220, 252, 231, 0.95), rgba(255, 255, 255, 0.98)),
      #fff;
  }

  .demo-video-frame video {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: contain;
    background: #0f172a;
  }

  .demo-placeholder {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 10px;
    padding: 32px;
    background:
      linear-gradient(135deg, rgba(220, 252, 231, 0.84), rgba(255, 255, 255, 0.96)),
      repeating-linear-gradient(
        -45deg,
        rgba(34, 197, 94, 0.08) 0,
        rgba(34, 197, 94, 0.08) 10px,
        rgba(255, 255, 255, 0.3) 10px,
        rgba(255, 255, 255, 0.3) 20px
      );
    color: #14532d;
  }

  .demo-placeholder-badge {
    border-radius: 999px;
    background: #ffffff;
    color: #15803d;
    padding: 7px 12px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  .demo-placeholder strong {
    font-size: 1.6rem;
    line-height: 1.2;
  }

  .demo-placeholder p {
    max-width: 24rem;
    margin: 0;
    color: #166534;
    line-height: 1.7;
  }

  .demo-meta {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 18px 6px 6px;
  }

  .demo-step {
    min-width: 44px;
    height: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 14px;
    background: #f0fdf4;
    color: #15803d;
    font-weight: 700;
  }

  .demo-meta h3 {
    margin: 0 0 6px;
    color: #111827;
    font-size: 1.1rem;
  }

  .demo-meta p {
    margin: 0;
    color: #6b7280;
    line-height: 1.65;
  }

  .demo-card.card-0 {
    z-index: 3;
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
  }

  .demo-card.card-1 {
    z-index: 2;
    opacity: 0.78;
    transform: translate3d(120px, 34px, -100px) scale(0.9);
    filter: saturate(0.92);
  }

  .demo-card.card-2 {
    z-index: 1;
    opacity: 0.45;
    transform: translate3d(210px, 64px, -180px) scale(0.82);
    filter: saturate(0.8) blur(1px);
  }

  @media (max-width: 1080px) {
    .demo-shell {
      grid-template-columns: 1fr;
      gap: 28px;
    }

    .demo-stage {
      min-height: 420px;
    }

    .demo-card.card-1 {
      transform: translate3d(70px, 28px, -80px) scale(0.9);
    }

    .demo-card.card-2 {
      transform: translate3d(120px, 54px, -160px) scale(0.82);
    }
  }

  @media (max-width: 720px) {
    .demo-recordings {
      padding: 72px 16px 18px;
    }

    .demo-stage {
      min-height: 360px;
    }

    .demo-card {
      width: 100%;
      padding: 14px;
    }

    .demo-nav {
      left: 10px;
      right: 10px;
      bottom: -12px;
    }

    .demo-nav-btn {
      padding: 10px 14px;
      font-size: 0.82rem;
    }

    .demo-card.card-1 {
      transform: translate3d(28px, 22px, -60px) scale(0.93);
    }

    .demo-card.card-2 {
      transform: translate3d(52px, 42px, -120px) scale(0.86);
    }

    .demo-placeholder,
    .demo-meta {
      padding-left: 18px;
      padding-right: 18px;
    }
  }
`;
