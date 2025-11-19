"use client";

import Image from "next/image";

// this is a client component
import Link from "next/link";
import { ShineBorder, TypeWriter } from "@/components/landingPage/hero-designali";
import { Plus } from "lucide-react"; 
import { CtaButton } from "@/components/landingPage/cta-button";

import { Button } from "@/components/ui/button"; 

export const Hero = () => {
  const talkAbout = [
    "you want them to.",
    "10x better than your competitors.",
    "cheaper than before.",
  ];

  return (
    <main className="overflow-hidden">
    <section id="home">
      <div className="flex flex-col items-center justify-center px-6 text-center">
        <div className="mb-6 mt-10 sm:justify-center md:mb-4 md:mt-40">
          <div className="relative flex items-center rounded-full border bg-popover px-3 py-1 text-xs text-primary/60">
            Join the
            <Link
              href="/products/dicons"
              rel="noreferrer"
              className="ml-1 flex items-center font-semibold"
            >
              <div
                className="absolute inset-0 hover:font-semibold hover:text-ali flex"
                aria-hidden="true"
              />
              V1 <span aria-hidden="true"></span>
            </Link>
          </div>
        </div>

        <div className="mx-auto max-w-5xl">
                     <div className="border-text-red-500 relative mx-auto h-full bg-background border py-12 p-6 [mask-image:radial-gradient(800rem_96rem_at_center,white,transparent)]">
            <div className="absolute inset-0 max-md:hidden bg-transparent bg-[linear-gradient(to_right,#57534e_1px,transparent_1px),linear-gradient(to_bottom,#57534e_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20 dark:bg-[linear-gradient(to_right,#a8a29e_1px,transparent_1px),linear-gradient(to_bottom,#a8a29e_1px,transparent_1px)]" />
            <h1 className="flex flex-col text-center text-5xl font-semibold leading-none tracking-tight md:flex-col md:text-8xl lg:flex-row lg:text-8xl">
              <Plus
                strokeWidth={4}
                className="text-text-red-500 absolute -left-5 -top-5 h-10 w-10"
              />
              <Plus
                strokeWidth={4}
                className="text-text-red-500 absolute -bottom-5 -left-5 h-10 w-10"
              />
              <Plus
                strokeWidth={4}
                className="text-text-red-500 absolute -right-5 -top-5 h-10 w-10"
              />
              <Plus
                strokeWidth={4}
                className="text-text-red-500 absolute -bottom-5 -right-5 h-10 w-10"
              />
              <span>
                Build Prompt That Performs {" "}
                <span className="text-primary">10x Better</span>
              </span>
            </h1>
            <div className="flex items-center mt-4 justify-center gap-1">
              <span className="relative flex h-3 w-3 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
              </span>
              <p className="text-xs text-green-500">Free to use</p>
            </div>
          </div>

          <h1 className="mt-8 text-2xl md:text-2xl">
            Welcome to the Prompt{" "}
            <span className="text-primary font-bold">Laboratory</span>
          </h1>

          <p className="text-primary/60 py-4">
            Prompt Studio is <strong>THE PLACE </strong>to build, monitor, and improve your prompts to make sure they output{" "}
            <span className="font-black">
              <TypeWriter strings={talkAbout} />
            </span>.
          </p>
          <div className="flex items-center justify-center gap-2">
            <Link href="/graphic">
                <CtaButton className="w-full rounded-xl" >
                  Try it ! (it's free)
                </CtaButton>
            </Link> 
            <Link href={"/login"} target="_blank">
              <Button className="rounded-xl" variant="outline">Start Prompting</Button>
            </Link>
          </div>
        </div>
      </div>
      <canvas
        className="pointer-events-none absolute inset-0 mx-auto"
        id="canvas"
      ></canvas>
    </section>
     </main>
  );
};

