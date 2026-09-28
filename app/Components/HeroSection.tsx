import { Button } from "@/components/ui/button"
import { ArrowUpRight } from "lucide-react"
import {ScrollReveal} from "./scroll-reveal"

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-125 bg-white overflow-hidden shadow-lg grid grid-cols-1 lg:grid-cols-2 lg:rounded-l-full">
      {/* Left Column: Image Container with Curved Edge Overlay */}
      <ScrollReveal direction="up" delay={0.1}>

        <div className="relative h-87.5 lg:h-full w-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          //poster="/fallback-thumbnail.jpg" /* Displays while video loads */
          className="h-full w-full object-cover"
        >
          <source src="/main_video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Curved White Mask (Visible on Large Screens) */}
        <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-32 pointer-events-none">
          <svg
            className="h-full w-full fill-white dark:fill-gray-800"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {/* Creates the soft outward arch into the image */}
            <path d="M100 0 Q 0 50 100 100 Z" />
          </svg>
        </div>
      </div>
      </ScrollReveal>
      

      {/* Right Column: Hero Content */}
      

        <div className="flex flex-col justify-center px-8 py-12 lg:px-16 lg:py-24 z-10  dark:bg-gray-800">
          <ScrollReveal direction="up" delay={0.3}>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold  tracking-tight mb-4 text-[#02336a] dark:text-gray-300">
              Ethiopia&apos;s Premier private organization for <span className="text-[#05b49a]">computer science</span>.
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.4}>
            <p className="text-slate-600 text-base sm:text-lg mb-8 max-w-lg leading-relaxed dark:text-gray-400">
              EAGLES belives in the transformative power of technology and Computer Science to make the world a better place.
            </p>
          </ScrollReveal>
        

        {/* CTA Buttons */}
        <div className="flex ">
          {/* Primary Solid Button */}
          <ScrollReveal direction="up" delay={0.5}>
            <Button 
              className="group bg-[#3b6e99] hover:bg-[#2d567a] text-white px-6 py-5 rounded-md text-base font-medium gap-2 transition-colors"
            >
              Apply Now
              <ArrowUpRight className="w-5 h-5 transition-transform duration-200 group-hover:scale-125" />
            </Button>
          </ScrollReveal>
          
          {/* Secondary Outlined Button */}
          
        </div>
      </div>
      
      
    </section>
  )
}