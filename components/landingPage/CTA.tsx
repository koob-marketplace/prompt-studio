"use client";

import { Award, Cat, ShieldCheck, Star, StarHalf } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";

const Cta1 = () => {
  return (
    <section className="py-10 w-full relative">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 border-x [mask-image:linear-gradient(black,transparent)]"></div>
          <div className="absolute inset-y-0 left-1/2 w-[1200px] -translate-x-1/2">
            <svg
              className="pointer-events-none absolute inset-0 text-black/20 [mask-composite:intersect] [mask-image:linear-gradient(black,transparent),radial-gradient(black,transparent)] dark:text-white/20"
              width="100%"
              height="100%"
            >
              <defs>
                <pattern
                  id="grid-pattern"
                  x="-1"
                  y="-1"
                  width="60"
                  height="60"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 60 0 L 0 0 0 60"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="1"
                  ></path>
                </pattern>
              </defs>
              <rect fill="url(#grid-pattern)" width="100%" height="100%"></rect>
            </svg>
          </div>
        </div>
        <div className="relative flex flex-col items-center justify-center text-center">
          {/* Headline and Description */}
          <h2 className="font-display max-w-lg text-balance text-4xl font-medium sm:text-5xl">
            Transform the way you build your prompts
          </h2>
          <p className="text-muted-foreground mt-6 max-w-[560px] text-lg font-medium sm:text-xl">
            Start building your prompts with ease and see how Prompt Studio helps you build better prompts.
          </p>

          {/* Call-to-Action Buttons */}
          <div className="mt-10 flex items-center justify-center gap-3">
            <Button>Start building prompts for free</Button>
          </div>
        </div>
      </div>
      
      {/* Logos Section - Positioned separately to ensure it's on the background */}
      <div className="mt-10 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 items-center justify-center gap-x-8 sm:gap-x-16 gap-y-6">
          <div className="flex items-center justify-center">
            <Image 
              src="/asset/openai.png" 
              alt="OpenAI" 
              width={100} 
              height={50} 
              className="object-contain max-h-12"
            />
          </div>
          <div className="flex items-center justify-center">
            <Image 
              src="/asset/claude.png" 
              alt="Claude" 
              width={100} 
              height={50} 
              className="object-contain max-h-12"
            />
          </div>
          <div className="flex items-center justify-center">
            <Image 
              src="/asset/cohere.png" 
              alt="Cohere" 
              width={100} 
              height={50} 
              className="object-contain max-h-12"
            />
          </div>
          <div className="flex items-center justify-center">
            <Image 
              src="/asset/xAI.png" 
              alt="xAI" 
              width={100} 
              height={50} 
              className="object-contain max-h-12"
            />
          </div>
          <div className="flex items-center justify-center">
            <Image 
              src="/asset/gemini.png" 
              alt="Gemini" 
              width={100} 
              height={50} 
              className="object-contain max-h-12"
            />
          </div>
          <div className="flex items-center justify-center">
            <Image 
              src="/asset/mistral.png" 
              alt="Mistral" 
              width={100} 
              height={50} 
              className="object-contain max-h-12"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export { Cta1 };
