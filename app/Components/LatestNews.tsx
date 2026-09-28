"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ScrollReveal } from "./scroll-reveal";

const news = [
  {
    image: "/news1.jpg",
    title: "New Academic Year Begins",
    text: "The university welcomes students for the new academic year.",
  },
  {
    image: "/news2.jpg",
    title: "Admission Applications Open",
    text: "Applications for the upcoming semester are now available.",
  },
  {
    image: "/news3.jpg",
    title: "Students Win Competition",
    text: "Our students achieved first place in a national competition.",
  },
  {
    image: "/news4.jpg",
    title: "New Campus Facilities",
    text: "The university has opened new facilities for students.",
  },
  {
    image: "/news5.jpg",
    title: "University Holds Annual Event",
    text: "Students and staff gathered for the university's annual event.",
  },
];

const LatestNews = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);

  // Determine how many cards should be visible
  useEffect(() => {
    const updateVisibleCards = () => {
      if (window.innerWidth < 640) {
        setVisibleCards(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2);
      } else {
        setVisibleCards(3);
      }
    };

    updateVisibleCards();

    window.addEventListener("resize", updateVisibleCards);

    return () => {
      window.removeEventListener("resize", updateVisibleCards);
    };
  }, []);

  // Automatically move every 4 seconds
  useEffect(() => {
    const maxIndex = Math.max(news.length - visibleCards, 0);

    if (maxIndex === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, [visibleCards]);

  const maxIndex = Math.max(news.length - visibleCards, 0);
  const activeIndex = Math.min(currentIndex, maxIndex);

  return (
    <section className="w-full max-w-6xl mx-auto px-4">
      {/* Heading */}
      <div className="flex items-center justify-between mb-6">
        <ScrollReveal direction="up" delay={0.2}>
          <h2 className="text-3xl dark:text-gray-300 font-bold ml-10">Latest News</h2>
        </ScrollReveal>
      
      </div>

      <div className="flex gap-2">
        <ScrollReveal direction="up" delay={0.3}>
          <button
            onClick={() =>
              setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1))
            }
            className="w-10 h-10 rounded-full border mt-40 hover:bg-gray-100 dark:hover:bg-black"
          >
            ←
          </button>
        </ScrollReveal>

            {/* Carousel viewport */}
      <div className="overflow-hidden">
        {/* Carousel track */}
        
        
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${activeIndex * (100 / visibleCards)}%)`,
          }}
        >
          
          {news.map((item, index) => (
            <div
              key={index}
              className="shrink-0 basis-full sm:basis-1/2 lg:basis-1/3 px-2"
            >
              <ScrollReveal direction="up" delay={0.4 + index * 0.1}>
                <article className="h-full overflow-hidden rounded-xl my-5 bg-white  dark:bg-gray-800 dark:text-gray-300 shadow-md transition-transform duration-300 hover:scale-107">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={800}
                  height={450}
                  className="h-56 w-full object-cover"
                />

                <div className="p-5  hover:bg-gray-100 dark:hover:bg-black">
                  <h3 className="text-xl font-bold">{item.title}</h3>

                  <p className="mt-2 text-gray-600 dark:text-gray-400">{item.text}</p>

                  <a
                    href="#"
                    className="mt-4 inline-block font-medium text-blue-500 hover:text-blue-700"
                  >
                    Read more →
                  </a>
                </div>
              </article>
              </ScrollReveal>
              
            </div>
          ))}
          
        </div>
        
      </div>

          <ScrollReveal direction="up" delay={0.3}>
            <button
              onClick={() =>
                setCurrentIndex((prev) => (prev === maxIndex ? 0 : prev + 1))
              }
              className="w-10 h-10 rounded-full border mt-40 hover:bg-gray-100 dark:hover:bg-black"
            >
              →
            </button>
          </ScrollReveal>

          
        </div>

      

      {/* Dots */}
      <div className="my-6 flex justify-center gap-2 ">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2.5 w-2.5 rounded-full transition ${
              activeIndex === index ? "bg-blue-500" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default LatestNews;
