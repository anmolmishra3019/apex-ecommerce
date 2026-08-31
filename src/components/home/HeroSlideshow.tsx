"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

interface HeroSlide {
  id: string;
  tag: string;
  headline: string;
  subheadline: string;
  category: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  image: string;
  altText: string;
}

const SLIDES: HeroSlide[] = [
  {
    id: "slide-1",
    tag: "IN-HOUSE STUDIO DROP • NOIDA",
    headline: "TOTEM MONOLITH LAMP",
    subheadline: "Laser-cut carbon steel & warm ambient diffused light. An iconic conversation starter.",
    category: "Lighting",
    primaryCtaText: "SHOP NOW",
    primaryCtaLink: "/products/totem-lamp-monolith",
    secondaryCtaText: "EXPLORE LIGHTING",
    secondaryCtaLink: "/products?category=Lighting",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1920&q=85",
    altText: "Totem Monolith Ambient Lamp",
  },
  {
    id: "slide-2",
    tag: "BRUTALIST OBJECT SERIES",
    headline: "TETRAPOD CAST SCULPTURE",
    subheadline: "2.4kg high-density concrete and cast zinc monoliths for discerning collectors.",
    category: "Sculptures",
    primaryCtaText: "SHOP SCULPTURES",
    primaryCtaLink: "/products/tetrapod-brutalist-sculpture",
    secondaryCtaText: "VIEW ALL OBJECTS",
    secondaryCtaLink: "/products",
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1920&q=85",
    altText: "Tetrapod Brutalist Concrete Sculpture",
  },
  {
    id: "slide-3",
    tag: "STRUCTURAL STEEL EXPERIMENTS",
    headline: "SPRING MESH SIDE TABLE",
    subheadline: "Continuous coiled structural spring base topped with perforated industrial mesh.",
    category: "Furniture",
    primaryCtaText: "SHOP FURNITURE",
    primaryCtaLink: "/products/mesh-spring-accent-table",
    secondaryCtaText: "SEE FULL CATALOG",
    secondaryCtaLink: "/products",
    image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=1920&q=85",
    altText: "Mesh Spring Accent Table",
  },
  {
    id: "slide-4",
    tag: "ARCHITECTURAL CNC OBJECTS",
    headline: "FLUTED EXTRUSION VASE",
    subheadline: "Single-billet aerospace aluminium with brutalist geometric fluting.",
    category: "Decor",
    primaryCtaText: "SHOP DECOR",
    primaryCtaLink: "/products/fluted-extrusion-vase",
    secondaryCtaText: "EXPLORE ALL",
    secondaryCtaLink: "/products",
    image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=1920&q=85",
    altText: "Fluted Extrusion Aluminium Vase",
  },
];

export default function HeroSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 6500);
    return () => clearInterval(interval);
  }, [nextSlide, isPaused]);

  return (
    <div
      className="relative w-full overflow-hidden bg-[#121212] select-none"
      style={{ minHeight: "calc(100vh - 40px)", height: "92vh" }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides Container */}
      {SLIDES.map((slide, index) => {
        const isActive = index === currentSlide;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            {/* Background Image with Dark Vignette */}
            <div className="absolute inset-0">
              <img
                src={slide.image}
                alt={slide.altText}
                className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-[8000ms] ease-out"
                style={{
                  transform: isActive ? "scale(1.02)" : "scale(1.08)",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/40 to-[#121212]/30" />
            </div>

            {/* Slide Content (Notice signature bottom-left layout) */}
            <div className="absolute inset-0 flex flex-col justify-end max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-16 pb-20 sm:pb-24 z-20">
              <div className="max-w-4xl space-y-4 sm:space-y-6">
                {/* Category / Drop Pill */}
                <div className="inline-flex items-center gap-2 bg-[#004fff] text-[#fffdf8] px-3.5 py-1 text-[11px] font-black uppercase tracking-widest">
                  <span>{slide.tag}</span>
                </div>

                {/* Massive Notice Heading */}
                <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-[#fffdf8] uppercase tracking-tighter leading-[0.9] drop-shadow-sm">
                  {slide.headline}
                </h1>

                {/* Subheading */}
                <p className="text-xs sm:text-sm md:text-base text-[#e8e5dc] max-w-xl font-medium tracking-wider leading-relaxed">
                  {slide.subheadline}
                </p>

                {/* Action Buttons (Square corners) */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    href={slide.primaryCtaLink}
                    className="inline-flex items-center justify-center h-12 sm:h-14 px-8 sm:px-10 bg-[#004fff] hover:bg-[#003ecc] text-[#fffdf8] text-xs sm:text-sm font-extrabold uppercase tracking-widest transition-all duration-200 shadow-md"
                  >
                    {slide.primaryCtaText}
                  </Link>

                  <Link
                    href={slide.secondaryCtaLink}
                    className="inline-flex items-center justify-center h-12 sm:h-14 px-8 sm:px-10 bg-[#fffdf8] hover:bg-[#f4f3ef] text-[#004fff] text-xs sm:text-sm font-extrabold uppercase tracking-widest transition-all duration-200 shadow-md"
                  >
                    {slide.secondaryCtaText}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Slide Navigation Arrows */}
      <button
        onClick={prevSlide}
        aria-label="Previous Slide"
        className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 items-center justify-center bg-[#121212]/60 hover:bg-[#004fff] text-[#fffdf8] transition-colors backdrop-blur-sm"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next Slide"
        className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 items-center justify-center bg-[#121212]/60 hover:bg-[#004fff] text-[#fffdf8] transition-colors backdrop-blur-sm"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Notice Signature Cobalt Blue Pill Dots Capsule */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
        <div className="notice-dots-capsule">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`notice-dot ${idx === currentSlide ? "active" : ""}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
