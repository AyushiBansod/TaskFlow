"use client";

import { useState, useEffect, useRef } from "react";

const AnimatedCard = ({ digit, label }) => {
  const [current, setCurrent] = useState(digit);
  const [next, setNext] = useState(digit);
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    if (digit !== current) {
      setNext(digit);
      setFlipping(true);
      const timer = setTimeout(() => {
        setCurrent(digit);
        setFlipping(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [digit, current]);

  return (
    <div className="flip-clock__piece">
      <div className={`flip-clock__card card ${flipping ? "flip" : ""}`}>
        <b className="card__top">{next}</b>
        <b className="card__bottom" data-value={current}></b>
        <b className="card__back" data-value={current}>
          <b className="card__bottom" data-value={next}></b>
        </b>
      </div>
      <span className="flip-clock__slot">{label}</span>
    </div>
  );
};

export default function FlipClock({ timeRemaining }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!timeRemaining) return null;
  if (!mounted) return null;

  const { days, hours, minutes, seconds } = timeRemaining;

  const format = (val) => val.toString().padStart(2, "0");

  return (
    <>
      <style>{`
        .flip-clock {
          text-align: left;
          perspective: 400px;
          margin: 10px 0;
          display: flex;
          justify-content: flex-start;
          gap: 8px;
        }

        .flip-clock * {
          box-sizing: border-box;
        }

        .flip-clock__piece {
          display: inline-block;
          margin: 0;
        }

        .flip-clock__slot {
          display: block;
          font-size: 10px;
          text-transform: uppercase;
          color: #666;
          margin-top: 4px;
          font-weight: 600;
        }

        .card {
          display: block;
          position: relative;
          height: 1.44em;
          font-size: 24px;
          line-height: 1.44em;
          width: 1.8em;
          font-weight: 700;
          background: transparent;
        }

        .card__top,
        .card__bottom,
        .card__back::before,
        .card__back::after {
          display: block;
          height: 0.72em;
          backface-visibility: hidden;
          transform-style: preserve-3d;
          width: 1.8em;
          transform: translateZ(0);
          overflow: hidden;
          text-align: center;
          position: relative;
        }

        .card__top,
        .card__back::before {
          background: #000;
          color: #ccc;
          line-height: 1.44em;
          border-radius: 4px 4px 0 0;
        }

        .card__bottom,
        .card__back::after {
          position: absolute;
          top: 50%;
          left: 0;
          border-top: solid 0.5px rgba(255, 255, 255, 0.8);
          background: #393939;
          border-radius: 0 0 4px 4px;
          pointer-events: none;
          height: 0.72em;
          color: #fff;
        }

        .card__bottom::after,
        .card__back .card__bottom::after {
          display: block;
          content: attr(data-value);
          height: 1.44em;
          margin-top: -0.72em;
          line-height: 1.44em;
        }

        .card__back::before {
          content: attr(data-value);
          display: block;
          height: 0.72em;
          line-height: 1.44em;
        }

        .card__back .card__bottom::after {
          display: block;
          content: attr(data-value);
          height: 1.44em;
          margin-top: -0.72em;
          line-height: 1.44em;
        }

        .card__back {
          position: absolute;
          top: 0;
          height: 100%;
          left: 0;
          pointer-events: none;
          width: 100%;
        }

        .card__back::before {
          position: relative;
          z-index: -1;
          overflow: hidden;
          display: block;
          height: 0.72em;
        }

        .flip .card__back::before {
          animation: flipTop 0.3s cubic-bezier(0.37, 0.01, 0.94, 0.35);
          animation-fill-mode: both;
          transform-origin: center bottom;
        }

        .flip .card__back .card__bottom {
          transform-origin: center top;
          animation-fill-mode: both;
          animation: flipBottom 0.6s cubic-bezier(0.15, 0.45, 0.28, 1);
        }

        @keyframes flipTop {
          0% {
            transform: rotateX(0deg);
            z-index: 2;
          }
          0%,
          99% {
            opacity: 0.99;
          }
          100% {
            transform: rotateX(-90deg);
            opacity: 0;
          }
        }

        @keyframes flipBottom {
          0%,
          50% {
            z-index: -1;
            transform: rotateX(90deg);
            opacity: 0;
          }
          51% {
            opacity: 0.99;
          }
          100% {
            opacity: 0.99;
            transform: rotateX(0deg);
            z-index: 5;
          }
        }

        @media (max-width: 375px) {
          .card {
            font-size: 18px;
            width: 1.6em;
          }

          .card__top,
          .card__bottom,
          .card__back::before,
          .card__back::after {
            width: 1.6em;
          }

          .flip-clock__slot {
            font-size: 6px;
          }

          .flip-clock {
            gap: 6px;
          }
        }

        @media (max-width: 320px) {
          .card {
            font-size: 16px;
            width: 1.4em;
          }

          .card__top,
          .card__bottom,
          .card__back::before,
          .card__back::after {
            width: 1.4em;
          }

          .flip-clock__slot {
            font-size: 5px;
          }

          .flip-clock {
            gap: 4px;
          }
        }
      `}</style>
      <div className="flip-clock">
        {days > 0 && <AnimatedCard digit={format(days)} label="Days" />}
        <AnimatedCard digit={format(hours)} label="Hours" />
        <AnimatedCard digit={format(minutes)} label="Minutes" />
        <AnimatedCard digit={format(seconds)} label="Seconds" />
      </div>
    </>
  );
}
