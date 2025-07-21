"use client";

import React, { forwardRef, useRef } from "react";

import { cn } from "@/utils/shardcn";
import { AnimatedBeam } from "../magic.ui/animation.beam";
import { Check } from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex size-12 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
        className,
      )}
    >
      {children}
    </div>
  );
});

Circle.displayName = "Circle";

export function AnimatedBeamMultipleOutput({
  className,
}: {
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);
  const div4Ref = useRef<HTMLDivElement>(null);
  const div5Ref = useRef<HTMLDivElement>(null);
  const div6Ref = useRef<HTMLDivElement>(null);
  const div7Ref = useRef<HTMLDivElement>(null);

  const [isVisible, setIsVisible] = useState(false);
  const animationContentRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (animationContentRef.current) {
      observer.observe(animationContentRef.current);
    }

    return () => {
      if (animationContentRef.current) {
        observer.unobserve(animationContentRef.current);
      }
    };
  }, []);

  const getAnimationClass = (index:number) => {
    return `transition-all duration-700 ease-out transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
      }`;
  };

  const getAnimationStyle = (index:number) => {
    return {
      transitionDelay: isVisible ? `${100 + (index * 100)}ms` : '0ms'
    };
  };


  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <div className="flex w-full flex-col md:flex-row items-center gap-8">
        <div
          className={cn(
            "relative flex h-[500px] w-full md:w-1/2 lg:w-3/5 items-center justify-center overflow-hidden p-4",
            className,
          )}
          ref={containerRef}
        >
          <div className="flex size-full max-w-md flex-row items-stretch justify-between gap-6">
            <div className="flex flex-col justify-center">
              <Circle ref={div7Ref}>
                <Icons.user />
              </Circle>
            </div>
            <div className="flex flex-col justify-center">
              <Circle ref={div6Ref} className="size-14">
                <Icons.dibolky />
              </Circle>
            </div>
            <div className="flex flex-col justify-center gap-2">
              <Circle ref={div1Ref} className="size-10">
                <Icons.instagram />
              </Circle>
              <Circle ref={div2Ref} className="size-10">
                <Icons.facebook />
              </Circle>
              <Circle ref={div3Ref} className="size-10">
                <Icons.linkedin />
              </Circle>
              <Circle ref={div4Ref} className="size-10">
                <Icons.x />
              </Circle>
              <Circle ref={div5Ref} className="size-10">
                <Icons.tiktok />
              </Circle>
            </div>
          </div>

          <AnimatedBeam containerRef={containerRef} fromRef={div1Ref} toRef={div6Ref} duration={3} />
          <AnimatedBeam containerRef={containerRef} fromRef={div2Ref} toRef={div6Ref} duration={3} />
          <AnimatedBeam containerRef={containerRef} fromRef={div3Ref} toRef={div6Ref} duration={3} />
          <AnimatedBeam containerRef={containerRef} fromRef={div4Ref} toRef={div6Ref} duration={3} />
          <AnimatedBeam containerRef={containerRef} fromRef={div5Ref} toRef={div6Ref} duration={3} />
          <AnimatedBeam containerRef={containerRef} fromRef={div6Ref} toRef={div7Ref} duration={3} />
        </div>

        <div
          ref={animationContentRef}
          className="w-full md:w-1/2 px-6 space-y-6"
        >
          <h2
            className={`text-3xl font-lazare font-bold tracking-tight text-foreground/90 ${getAnimationClass(0)}`}
            style={getAnimationStyle(0)}
          >
            Seamless Uploads Across All Platforms
          </h2>

          <p
            className={`text-lg text-muted-foreground font-lazare font-bold ${getAnimationClass(1)}`}
            style={getAnimationStyle(1)}
          >
            Manage all your social media content from a single intuitive interface. Connect once, publish everywhere,
            and save valuable time.
          </p>

          <div className="space-y-4 font-lazare font-bold text-foreground/90">
            <div
              className={`flex items-start gap-3 ${getAnimationClass(2)}`}
              style={getAnimationStyle(2)}
            >
              <div className="rounded-full bg-primary/10 p-1">
                <Check className="size-5 text-primary" />
              </div>
              <p>Publish to multiple platforms with a single click</p>
            </div>

            <div
              className={`flex items-start gap-3 ${getAnimationClass(3)}`}
              style={getAnimationStyle(3)}
            >
              <div className="rounded-full bg-primary/10 p-1">
                <Check className="size-5 text-primary" />
              </div>
              <p>Schedule posts for optimal engagement times</p>
            </div>

            <div
              className={`flex items-start gap-3 ${getAnimationClass(4)}`}
              style={getAnimationStyle(4)}
            >
              <div className="rounded-full bg-primary/10 p-1">
                <Check className="size-5 text-primary" />
              </div>
              <p>Track performance metrics across all channels</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

const Icons = {
  facebook: () => (
    <svg
      width="100"
      height="100"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
        fill="#1877F2"
      />
      <path
        d="M16.671 15.523l.532-3.47h-3.328v-2.25c0-.949.465-1.874 1.956-1.874h1.513V4.996s-1.374-.235-2.686-.235c-2.741 0-4.533 1.662-4.533 4.669v2.672H7.078v3.47h3.047v8.385c.611.088 1.24.133 1.875.133.635 0 1.264-.045 1.875-.133v-8.385h2.796z"
        fill="white"
      />
    </svg>
  ),
  dibolky: () => (
    <img src="https://jmp.sh/s/a4ZQSaB0BLdSTsdxUq1Q" className="w-2 h-2" alt="" />
  ),
  instagram: () => (
    <svg
      width="100"
      height="100"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <linearGradient id="instagramGradient" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FFDC80" />
        <stop offset="10%" stopColor="#FCAF45" />
        <stop offset="40%" stopColor="#F77737" />
        <stop offset="60%" stopColor="#F56040" />
        <stop offset="75%" stopColor="#FD1D1D" />
        <stop offset="100%" stopColor="#833AB4" />
      </linearGradient>
      <path
        d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
        fill="url(#instagramGradient)"
      />
    </svg>
  ),
  linkedin: () => (
    <svg
      width="100"
      height="100"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
        fill="#0077B5"
      />
    </svg>
  ),
  tiktok: () => (
    <svg
      width="100"
      height="100"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"
        fill="black"
      />
      <path
        d="M19.42 5.99c0-1.55-.04-3.1-.04-4.65h.02c.94.95 2.21 1.5 3.5 1.65v4.06c-1.31-.18-2.66-.64-3.48-1.06z"
        fill="#25F4EE"
      />
      <path
        d="M14.02 12.42c.01-1.3.02-2.6.03-3.89.06-.31.11-.62.18-.93 1.27.66 2.67 1.01 4.09 1.09v4.06c-1.27-.14-2.47-.56-3.39-1.3-.32-.29-.62-.61-.91-.93z"
        fill="#FE2C55"
      />
      <path
        d="M8.95 17.18c.93.91 2.27 1.35 3.57.9.6-.21 1.12-.58 1.5-1.07.32-.43.5-.93.61-1.45.08-1.99.09-3.99.07-5.99.26.26.52.51.79.77 1.39 1.15 3.22 1.76 5.06 1.75v3.5c-1.52.18-2.96.9-3.97 2.02-.92 1.04-1.46 2.4-1.52 3.76-1.32-.18-2.66-.54-3.86-1.15-1.54-.78-2.9-1.92-3.94-3.33-.76-1.05-1.33-2.24-1.66-3.5.72.82 1.67 1.44 2.71 1.69 1.13.28 2.36.21 3.43-.28.21-.09.4-.2.59-.31-.01 1.17.01 2.35-.04 3.52-.12.71-.44 1.37-.91 1.88-.48.5-1.1.87-1.78 1.02-1.58.38-3.36-.5-3.95-2.02-.17-.49-.22-1.01-.2-1.53.03-.66.23-1.32.57-1.9.38-.59.91-1.1 1.53-1.42.9-.43 1.96-.53 2.95-.27.01 1.48-.01 2.96-.04 4.44-.97-.35-2.07-.3-2.98.27-.42.25-.78.6-1.06 1z"
        fill="#25F4EE"
      />
    </svg>
  ),
  x: () => (
    <svg
      width="100"
      height="100"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
        fill="black"
      />
    </svg>
  ),

  messenger: () => (
    <svg
      width="100"
      height="100"
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
    >
      <radialGradient
        id="8O3wK6b5ASW2Wn6hRCB5xa_YFbzdUk7Q3F8_gr1"
        cx="11.087"
        cy="7.022"
        r="47.612"
        gradientTransform="matrix(1 0 0 -1 0 50)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#1292ff"></stop>
        <stop offset=".079" stopColor="#2982ff"></stop>
        <stop offset=".23" stopColor="#4e69ff"></stop>
        <stop offset=".351" stopColor="#6559ff"></stop>
        <stop offset=".428" stopColor="#6d53ff"></stop>
        <stop offset=".754" stopColor="#df47aa"></stop>
        <stop offset=".946" stopColor="#ff6257"></stop>
      </radialGradient>
      <path
        fill="url(#8O3wK6b5ASW2Wn6hRCB5xa_YFbzdUk7Q3F8_gr1)"
        d="M44,23.5C44,34.27,35.05,43,24,43c-1.651,0-3.25-0.194-4.784-0.564	c-0.465-0.112-0.951-0.069-1.379,0.145L13.46,44.77C12.33,45.335,11,44.513,11,43.249v-4.025c0-0.575-0.257-1.111-0.681-1.499	C6.425,34.165,4,29.11,4,23.5C4,12.73,12.95,4,24,4S44,12.73,44,23.5z"
      />
      <path
        d="M34.992,17.292c-0.428,0-0.843,0.142-1.2,0.411l-5.694,4.215	c-0.133,0.1-0.28,0.15-0.435,0.15c-0.15,0-0.291-0.047-0.41-0.136l-3.972-2.99c-0.808-0.601-1.76-0.918-2.757-0.918	c-1.576,0-3.025,0.791-3.876,2.116l-1.211,1.891l-4.12,6.695c-0.392,0.614-0.422,1.372-0.071,2.014	c0.358,0.654,1.034,1.06,1.764,1.06c0.428,0,0.843-0.142,1.2-0.411l5.694-4.215c0.133-0.1,0.28-0.15,0.435-0.15	c0.15,0,0.291,0.047,0.41,0.136l3.972,2.99c0.809,0.602,1.76,0.918,2.757,0.918c1.576,0,3.025-0.791,3.876-2.116l1.211-1.891	l4.12-6.695c0.392-0.614,0.422-1.372,0.071-2.014C36.398,17.698,35.722,17.292,34.992,17.292L34.992,17.292z"
        opacity=".05"
      />
      <path
        d="M34.992,17.792c-0.319,0-0.63,0.107-0.899,0.31l-5.697,4.218	c-0.216,0.163-0.468,0.248-0.732,0.248c-0.259,0-0.504-0.082-0.71-0.236l-3.973-2.991c-0.719-0.535-1.568-0.817-2.457-0.817	c-1.405,0-2.696,0.705-3.455,1.887l-1.21,1.891l-4.115,6.688c-0.297,0.465-0.32,1.033-0.058,1.511c0.266,0.486,0.787,0.8,1.325,0.8	c0.319,0,0.63-0.107,0.899-0.31l5.697-4.218c0.216-0.163,0.468-0.248,0.732-0.248c0.259,0,0.504,0.082,0.71,0.236l3.973,2.991	c0.719,0.535,1.568,0.817,2.457,0.817c1.405,0,2.696-0.705,3.455-1.887l1.21-1.891l4.115-6.688c0.297-0.465,0.32-1.033,0.058-1.511	C36.051,18.106,35.531,17.792,34.992,17.792L34.992,17.792z"
        opacity=".07"
      />
      <path
        fill="#ffffff"
        d="M34.394,18.501l-5.7,4.22c-0.61,0.46-1.44,0.46-2.04,0.01L22.68,19.74	c-1.68-1.25-4.06-0.82-5.19,0.94l-1.21,1.89l-4.11,6.68c-0.6,0.94,0.55,2.01,1.44,1.34l5.7-4.22c0.61-0.46,1.44-0.46,2.04-0.01	l3.974,2.991c1.68,1.25,4.06,0.82,5.19-0.94l1.21-1.89l4.11-6.68C36.434,18.901,35.284,17.831,34.394,18.501z"
      />
    </svg>
  ),
  user: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#000000"
      strokeWidth="2"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
};
