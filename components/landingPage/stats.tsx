"use client";

import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

const Stats1 = () => {
  return (
    <section className="py-32 flex justify-center items-center">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="grid gap-8 w-full">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-secondary flex h-60 flex-col justify-between rounded-lg p-6">
              <div className="mb-4">
                <p className="text-muted-foreground text-sm">
                  More regular outputs
                </p>
              </div>
              <div>
                <h3 className="text-6xl font-semibold">99.9%</h3>
                <p className="text-foreground/80 text-base">
                  Regular outputs by structuring your prompts and choosing the right model.
                </p>
              </div>
            </div>

            <div className="bg-secondary flex h-60 flex-col justify-between rounded-lg p-6">
              <div className="mb-4">
                <p className="text-muted-foreground text-sm">
                  More accuracy
                </p>
              </div>
              <div>
                <h3 className="text-6xl font-semibold">100%</h3>
                <p className="text-foreground/80 text-base">
                  Accuracy by writing the right prompt and choosing the right model.
                </p>
              </div>
            </div>

            <div className="bg-secondary flex h-60 flex-col justify-between rounded-lg p-6">
              <div className="mb-4">
                <p className="text-muted-foreground text-sm">
                  More efficiency
                </p>
              </div>
              <div>
                <h3 className="text-6xl font-semibold">10x</h3>
                <p className="text-foreground/80 text-base">
                  Efficiency by using the right AI tools and frameworks.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center text-center py-20">
          <div className="max-w-3xl">
            <h2 className="mb-4 text-3xl font-medium md:text-5xl">
              Built for AI users... By an AI user.
            </h2>
            <p className="text-muted-foreground mb-6 text-lg">
              The AI platform modern AI users rely on
            </p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <Button className="mt-4 h-14 px-10">Start prompting for free</Button>
            <p className="text-muted-foreground text-xs">
              No pricing, all features available.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Stats1 };
