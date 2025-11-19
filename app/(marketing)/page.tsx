import { Hero } from "@/components/landingPage/hero";
import { Navbar1 } from "@/components/navigation/nav-bar";
import { Logos04 } from "@/components/landingPage/logo";
import { Stats1 } from "@/components/landingPage/stats";
import { Cta1 } from "@/components/landingPage/CTA";

import { Footer } from "@/components/navigation/footer";

export default function DemoOne() {
  return (
    <div>
      <Navbar1 />
      <Hero />
      <Logos04 />
      <Stats1 />
      <Cta1 />
      <Footer />
    </div>
  )
}