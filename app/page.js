"use client";

import { useLayoutEffect, useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
import {
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";

gsap.registerPlugin(SplitText);


const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function ScrambleText({ children, className = "" }) {
  const [text, setText] = useState(children);
  const intervalRef = useRef(null);

  const scramble = () => {
    let iteration = 0;

    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setText(
        children
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";

            if (index < iteration) {
              return children[index];
            }

            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      iteration += 1 / 2;

      if (iteration >= children.length) {
        clearInterval(intervalRef.current);
        setText(children);
      }
    }, 30);
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <motion.p
      onMouseEnter={scramble}
      className={className}
    >
      {text}
    </motion.p>
  );
}

function SelectionSquare() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, {
    stiffness: 500,
    damping: 35,
    mass: 0.3,
  });

  const springY = useSpring(y, {
    stiffness: 500,
    damping: 35,
    mass: 0.3,
  });

  useEffect(() => {
    const handleMouseMove = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [x, y]);

  return (
    <motion.svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="white"
      xmlns="http://www.w3.org/2000/svg"
      className="pointer-events-none fixed left-0 top-0 z-[100]"
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
      }}
    >
      <rect
        x="1"
        y="1"
        width="22"
        height="22"
        stroke="white"
        strokeWidth="1"
      />
    </motion.svg>
  );
}

function CursorImage({ image }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, {
    stiffness: 300,
    damping: 30,
    mass: 0.5,
  });

  const springY = useSpring(y, {
    stiffness: 300,
    damping: 30,
    mass: 0.5,
  });

  useEffect(() => {
    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    window.addEventListener("mousemove", move);

    return () => {
      window.removeEventListener("mousemove", move);
    };
  }, [x, y]);

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[90] w-[220px] h-[280px] overflow-hidden"
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
      }}
      initial={{
        opacity: 0,
        scale: 0.8,
      }}
      animate={{
        opacity: image ? 1 : 0,
        scale: image ? 1 : 0.8,
      }}
      transition={{
        duration: 0.3,
        ease: [0.76, 0, 0.24, 1],
      }}
    >
      {image && (
        <motion.img
          key={image}
          src={image}
          alt=""
          className="w-full h-full object-cover"
          initial={{
            scale: 1.2,
          }}
          animate={{
            scale: 1,
          }}
          transition={{
            duration: 0.5,
            ease: [0.76, 0, 0.24, 1],
          }}
        />
      )}
    </motion.div>
  );
}

export default function Home() {


  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      smooth: true,
      infinite: false,
    });

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    // Clean up on unmount to prevent memory leaks
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  const container = useRef(null);
  const titleRefs = useRef([]);
  const loopRef = useRef(null);
  const menuRef = useRef(null);
  const sideRefs = useRef([]);
  const activeProjectRef = useRef(null);
  const listRefs = useRef(null);
  const listRefs2 = useRef(null);
  const [hoveredImage, setHoveredImage] = useState(null);
  const paragraph = useRef(null);

  const projects = [
    {
      title: "Kiro Studio",
      category: "Editorial Direction",
      year: "2024",
      image: "/images/1.jpg"
    },
    {
      title: "Heatwave",
      category: "Brand Identity",
      year: "2024",
      image: "/images/2.jpg"
    },
    {
      title: "Form Index",
      category: "Art Direction",
      year: "2023",
      image: "/images/3.jpg"
    },
    {
      title: "Night Shift",
      category: "Digital Experience",
      year: "2023",
      image: "/images/4.jpg"
    },
    {
      title: "New Damage",
      category: "Creative Direction",
      year: "2022",
      image: "/images/5.jpg"
    },
    {
      title: "After Hours",
      category: "Visual Identity",
      year: "2022",
      image: "/images/6.jpg"
    },
    {
      title: "New Reality",
      category: "Web Design",
      year: "2021",
      image: "/images/7.jpg"
    },
    {
      title: "Lost Signal",
      category: "Experimental",
      year: "2021",
      image: "/images/1.jpg"
    },
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Split project titles
      const titleSplits = titleRefs.current.map((title) => {
        return new SplitText(title, {
          type: "chars",
          charsClass: "split-char",
        });
      });

      const sideSplits = sideRefs.current.map((side) => {
        return new SplitText(side, {
          type: "chars",
          charsClass: "split-side-char",
        });
      });

      // Split LOOP
      const loopSplit = new SplitText(loopRef.current, {
        type: "chars",
        charsClass: "split-char",
      });

      const listSplit = new SplitText(listRefs.current, {
        type: "lines",
        mask: "lines",
      });

      const listSplit2 = new SplitText(listRefs2.current, {
        type: "lines",
        mask: "lines",
      });



      // Split paragraph
      const paragraphSplit = new SplitText(paragraph.current, {
        type: "lines",
        mask: "lines",
      });

      // Split MENU
      const menuSplit = new SplitText(menuRef.current, {
        type: "chars",
        charsClass: "split-char",
      });

      const tl = gsap.timeline({
        defaults: {
          ease: "power4.out",
        },
      });
      const leftListItems = listRefs.current.querySelectorAll(".list-item");

      gsap.set(leftListItems, {
        yPercent: 120,
      });

      tl.to(
        leftListItems,
        {
          yPercent: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "power4.out",
        },
        "<0.1"
      );

      const rightListItems = listRefs2.current.querySelectorAll(".list-item");

      gsap.set(rightListItems, {
        yPercent: 120,
      });

      tl.to(
        rightListItems,
        {
          yPercent: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "power4.out",
        },
        "<0"
      );

      // LOOP + MENU letters rise
      tl.fromTo(
        [...loopSplit.chars, ...menuSplit.chars,],
        {
          yPercent: 120,
        },
        {
          yPercent: 0,
          duration: 0.4,
          stagger: 0.05,
        }
      );

      // Paragraph lines rise
      tl.fromTo(
        paragraphSplit.lines,
        {
          yPercent: 120,
        },
        {
          yPercent: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "power4.out",
        },
        "<0"
      );

      const projectElements = gsap.utils.toArray(".project");

      projectElements.forEach((project, index) => {
        const leftSplit = sideSplits[index * 2];
        const rightSplit = sideSplits[index * 2 + 1];

        const sideChars = [
          ...leftSplit.chars,
          ...rightSplit.chars,
        ];

        // Initial state
        gsap.set(sideChars, {
          yPercent: 120,
        });

        project.addEventListener("mouseenter", () => {
          // Hide previous project immediately
          if (activeProjectRef.current) {
            gsap.killTweensOf(activeProjectRef.current.chars);

            gsap.set(activeProjectRef.current.chars, {
              yPercent: 120,
            });
          }

          // This is now the active project
          activeProjectRef.current = {
            project,
            chars: sideChars,
          };

          // Show current project
          gsap.killTweensOf(sideChars);

          gsap.to(sideChars, {
            yPercent: 0,
            duration: 1,
            stagger: 0.02,
            ease: "power4.out",
          });
        });

        project.addEventListener("mouseleave", () => {
          // Only hide if this is the currently active project
          if (
            activeProjectRef.current?.project === project
          ) {
            gsap.killTweensOf(sideChars);

            gsap.to(sideChars, {
              yPercent: 120,
              duration: 0.35,
              stagger: {
                each: 0.01,
                from: "end",
              },
              ease: "power4.in",
              onComplete: () => {
                // Only clear if this project is still active
                if (activeProjectRef.current?.project === project) {
                  activeProjectRef.current = null;
                }
              },
            });
          }
        });
      });

      // Project titles
      titleSplits.forEach((split) => {
        tl.fromTo(
          split.chars,
          {
            yPercent: 120,
          },
          {
            yPercent: 0,
            duration: 1,
            stagger: 0.025,
          },
          0.18
        );
      });
    }, container);

    return () => ctx.revert();
  }, []);
  return (
    <main ref={container} className="main">
      <SelectionSquare />
      <CursorImage image={hoveredImage} />
      <section className="showcase">
        <div className="project-list">
          {projects.map((project, index) => (
            <div
              key={project.title}
              className="project group"
              onMouseEnter={() => setHoveredImage(project.image)}
              onMouseLeave={() => setHoveredImage(null)}
            >
              {/* Left */}
              <span ref={(el) => (sideRefs.current[index * 2] = el)} className="project-side project-left">
                {project.category}
              </span>

              {/* Center */}
              <h1
                ref={(el) => (titleRefs.current[index] = el)}
                className="project-title"
              >
                {project.title}
              </h1>

              {/* Right */}
              <span ref={(el) => (sideRefs.current[index * 2 + 1] = el)} className="project-side project-right">
                {project.year}
              </span>
            </div>
          ))}
        </div>
      </section>

      <header className="fixed inset-x-0 top-0 z-50">
        <div className="absolute left-10 top-6 overflow-hidden">
          <div ref={loopRef} className="font-bebas-neue text-[clamp(1vw,2vw,5rem)] uppercase text-zinc-50 cursor-pointer select-none">
            Loop
          </div>
        </div>

        <div className="absolute right-10 top-6 overflow-hidden">
          <div ref={menuRef}>
            <span className="group block h-[2rem] overflow-hidden">
              <span className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:-translate-y-1/2">
                <span className="font-bebas-neue text-[clamp(0.7vw,1.4vw,2rem)] uppercase text-zinc-50 cursor-pointer select-none">
                  Menu
                </span>

                <span className="font-bebas-neue text-[clamp(0.7vw,1.4vw,2rem)] uppercase text-zinc-50 cursor-pointer select-none">
                  Menu
                </span>
              </span>
            </span>
          </div>
        </div>
        <div ref={listRefs} className="absolute left-15 top-86">
          <div>
            <ScrambleText className="list-item font-geist-mono text-[clamp(0.5vw,1vw,2rem)] uppercase text-zinc-50 cursor-pointer select-none">
              List
            </ScrambleText>

            <ScrambleText className="list-item font-geist-mono text-[clamp(0.5vw,1vw,2rem)] uppercase text-zinc-50 cursor-pointer select-none">
              Gallery
            </ScrambleText>

            <ScrambleText className="list-item font-geist-mono text-[clamp(0.5vw,1vw,2rem)] uppercase text-zinc-50 cursor-pointer select-none">
              Loop
            </ScrambleText>

            <ScrambleText className="list-item font-geist-mono text-[clamp(0.5vw,1vw,2rem)] uppercase text-zinc-50 cursor-pointer select-none">
              Spiral
            </ScrambleText>
          </div>
        </div>

        <div ref={listRefs2} className="absolute right-15 top-86">
          <div>
            <ScrambleText className="list-item font-geist-mono text-right text-[clamp(0.5vw,1vw,2rem)] uppercase text-zinc-50 cursor-pointer select-none">
              Light
            </ScrambleText>

            <ScrambleText className="list-item font-geist-mono text-right text-[clamp(0.5vw,1vw,2rem)] uppercase text-zinc-50 cursor-pointer select-none">
              Dark
            </ScrambleText>

            <ScrambleText className="list-item font-geist-mono text-right text-[clamp(0.5vw,1vw,2rem)] uppercase text-zinc-50 cursor-pointer select-none">
              System
            </ScrambleText>
          </div>
        </div>

        <div className="absolute left-10 top-165 overflow-hidden">
          <div ref={paragraph} className="paragraph">
            <p className=" font-bold uppercase text-zinc-50 cursor-pointer select-none">
              Just Another Creative Studio.
            </p>
            <p className=" font-light uppercase text-zinc-50 cursor-pointer select-none">
              Nothing special. Unless you're
            </p>
            <p className=" font-light uppercase text-zinc-50 cursor-pointer select-none">
              Here to build a brand thats
            </p>
            <p className=" font-bold uppercase text-zinc-50 cursor-pointer select-none">
              Impossible to ignore.
            </p>
          </div>
        </div>
      </header>
    </main>
  );
}