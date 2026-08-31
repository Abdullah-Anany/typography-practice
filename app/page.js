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

function ScrambleText({
  children,
  className = "",
  onClick,
  active = false,
  side = "left",
}) {
  const [text, setText] = useState(children);
  const intervalRef = useRef(null);

  const scramble = () => {
    clearInterval(intervalRef.current);

    let iteration = 0;
    const originalText = String(children);

    intervalRef.current = setInterval(() => {
      const scrambled = originalText
        .split("")
        .map((char, index) => {
          if (char === " ") return " ";

          if (index < iteration) {
            return originalText[index];
          }

          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");

      setText(scrambled);

      iteration += 0.5;

      if (iteration >= originalText.length) {
        clearInterval(intervalRef.current);
        setText(originalText);
      }
    }, 30);
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <button
      type="button"
      onMouseEnter={scramble}
      onClick={onClick}
      className={`relative flex items-center gap-3 bg-transparent border-0 p-0 cursor-pointer ${className}`}
    >
      {/* Left side square */}
      {side === "left" && (
        <span
          className={`absolute right-full mr-3 flex items-center justify-center transition-all duration-300 ${active
            ? "opacity-100 scale-100"
            : "opacity-0 scale-75"
            }`}
        >
          <svg
            width="9"
            height="9"
            viewBox="0 0 10 10"
          >
            <rect width="9" height="9" fill="var(--text-color)" />
          </svg>
        </span>
      )}

      <span>{text}</span>

      {/* Right side square */}
      {side === "right" && (
        <span
          className={`absolute left-full ml-3 flex items-center justify-center transition-all duration-300 ${active
            ? "opacity-100 scale-100"
            : "opacity-0 scale-75"
            }`}
        >
          <svg
            width="9"
            height="9"
            viewBox="0 0 10 10"
          >
            <rect width="9" height="9" fill="var(--text-color)" />
          </svg>
        </span>
      )}
    </button>
  );
}

function SelectionSquare({ color, hidden }) {
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
      xmlns="http://www.w3.org/2000/svg"
      className="pointer-events-none fixed left-0 top-0 z-[100]"
      animate={{
        opacity: hidden ? 1 : 0,
        scale: hidden ? 1 : 0,
      }}
      transition={{
        duration: 0.2,
        ease: [0.76, 0, 0.24, 1],
      }}
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
        fill={color}
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

  function PixelRevealImage({ image }) {
    const pixelContainer = useRef(null);

    const columns = 10;
    const rows = 10;

    useEffect(() => {
      if (!image || !pixelContainer.current) return;

      const pixels = pixelContainer.current.querySelectorAll(".pixel");

      gsap.killTweensOf(pixels);

      // Start completely transparent
      gsap.set(pixels, {
        opacity: 0,
      });

      // Randomly reveal image pieces
      gsap.to(pixels, {
        opacity: 1,
        duration: 0.12,
        stagger: {
          amount: 0.8,
          from: "random",
        },
        ease: "none",
      });
    }, [image]);

    if (!image) return null;

    return (
      <div
        ref={pixelContainer}
        className="pixel-image-container"
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
        }}
      >
        {Array.from({ length: columns * rows }).map((_, index) => {
          const column = index % columns;
          const row = Math.floor(index / columns);

          return (
            <div
              key={`${image}-${index}`}
              className="pixel"
            >
              <img
                src={image}
                alt=""
                draggable="false"
                style={{
                  position: "absolute",

                  // Make every tile contain the full image
                  width: `${columns * 100}%`,
                  height: `${rows * 100}%`,

                  // Move image into correct tile position
                  left: `${-column * 100}%`,
                  top: `${-row * 100}%`,

                  objectFit: "cover",
                  maxWidth: "none",
                }}
              />
            </div>
          );
        })}
      </div>
    );
  }
  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[90] w-[400px] h-[630px]"
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
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
      <PixelRevealImage image={image} />
    </motion.div>
  );
}

export default function Home() {



  const [activeLeft, setActiveLeft] = useState("List");
  const [activeRight, setActiveRight] = useState("Light");
  const [systemTheme, setSystemTheme] = useState("Light");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      setSystemTheme(mediaQuery.matches ? "Dark" : "Light");
    };
    mediaQuery.addEventListener("change", handleChange);
    handleChange();
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const themes = {
    Light: {
      background: "oklch(100% 0 none)",
      title: "#d4d4d4", // neutral-300
      text: "#0a0a0a", // neutral-950
      square: "#0a0a0a",
    },

    Dark: {
      background: "oklch(19% 0 none)",
      title: "#303030",
      text: "#f5f5f5",
      square: "#ffffff",
    },
  };


  const resolvedTheme =
    activeRight === "System"
      ? systemTheme
      : activeRight;

  const currentTheme = themes[resolvedTheme];


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
  const [hoveredProject, setHoveredProject] = useState(null);
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

      const leftListItems =
        listRefs.current.querySelectorAll(".left-list-item");

      const rightListItems =
        listRefs2.current.querySelectorAll(".right-list-item");



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

      gsap.set(
        [...leftListItems, ...rightListItems],
        {
          yPercent: 120,
          opacity: 0,
        }
      );

      tl.to(
        leftListItems,
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: "power4.out",
        },
        0.2
      );

      tl.to(
        rightListItems,
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: "power4.out",
        },
        0.2
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
              // onComplete: () => {
              //   // Only clear if this project is still active
              //   if (activeProjectRef.current?.project === project) {
              //     activeProjectRef.current = null;
              //   }
              // },
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
    <motion.main
      ref={container}
      className="main"
      animate={{
        backgroundColor: currentTheme.background,
        "--text-color": currentTheme.text,
        "--title-color": currentTheme.title,
      }}
      transition={{
        duration: 0.6,
        ease: [0.76, 0, 0.24, 1],
      }}
    >
      <SelectionSquare hidden={!hoveredImage} color={currentTheme.text} />
      <CursorImage image={hoveredImage} />
      <section className="showcase">
        <div className="project-list">
          {projects.map((project, index) => (
            <div
              key={project.title}
              className="project group"
              onMouseEnter={() => {
                setHoveredImage(project.image);
                setHoveredProject(index);
              }}
              onMouseLeave={() => {
                setHoveredImage(null);
                setHoveredProject(null);
              }}
            >
              {/* Left */}
              <span ref={(el) => (sideRefs.current[index * 2] = el)} className="project-side project-left">
                {project.category}
              </span>

              {/* Center */}
              <motion.h1
                ref={(el) => (titleRefs.current[index] = el)}
                className="project-title"
                animate={{
                  color:
                    hoveredProject === index
                      ? currentTheme.text
                      : currentTheme.title,
                }}
                transition={{
                  duration: 0.3,
                  ease: [0.76, 0, 0.24, 1],
                }}
              >
                {project.title}
              </motion.h1>

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
          <div ref={loopRef} className="font-bebas-neue text-[clamp(1vw,2vw,5rem)] uppercase text-[var(--text-color)] cursor-pointer select-none">
            Loop
          </div>
        </div>

        <div className="absolute right-10 top-6 overflow-hidden">
          <div ref={menuRef}>
            <span className="group block h-[2rem] overflow-hidden">
              <span className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:-translate-y-1/2">
                <span className="font-bebas-neue text-[clamp(0.7vw,1.4vw,2rem)] uppercase text-[var(--text-color)] cursor-pointer select-none">
                  Menu
                </span>

                <span className="font-bebas-neue text-[clamp(0.7vw,1.4vw,2rem)] uppercase text-[var(--text-color)] cursor-pointer select-none">
                  Menu
                </span>
              </span>
            </span>
          </div>
        </div>
        <div ref={listRefs} className="absolute left-15 top-90">
          <div className="flex flex-col items-start">
            <ScrambleText
              side="left"
              active={activeLeft === "List"}
              onClick={() => setActiveLeft("List")}
              className="left-list-item font-geist-mono text-[clamp(0.5vw,1vw,2rem)] uppercase text-[var(--text-color)] select-none"
            >
              List
            </ScrambleText>

            <ScrambleText
              side="left"
              active={activeLeft === "Gallery"}
              onClick={() => setActiveLeft("Gallery")}
              className="left-list-item font-geist-mono text-[clamp(0.5vw,1vw,2rem)] uppercase text-[var(--text-color)] select-none"
            >
              Gallery
            </ScrambleText>

            <ScrambleText
              side="left"
              active={activeLeft === "Loop"}
              onClick={() => setActiveLeft("Loop")}
              className="left-list-item font-geist-mono text-[clamp(0.5vw,1vw,2rem)] uppercase text-[var(--text-color)] select-none"
            >
              Loop
            </ScrambleText>

            <ScrambleText
              side="left"
              active={activeLeft === "Spiral"}
              onClick={() => setActiveLeft("Spiral")}
              className="left-list-item font-geist-mono text-[clamp(0.5vw,1vw,2rem)] uppercase text-[var(--text-color)] select-none"
            >
              Spiral
            </ScrambleText>
          </div>
        </div>

        <div ref={listRefs2} className="absolute right-15 top-90">
          <div className="flex flex-col items-end">
            <ScrambleText
              side="right"
              active={activeRight === "Light"}
              onClick={() => setActiveRight("Light")}
              className="right-list-item font-geist-mono text-right text-[clamp(0.5vw,1vw,2rem)] uppercase text-[var(--text-color)] select-none"
            >
              Light
            </ScrambleText>

            <ScrambleText
              side="right"
              active={activeRight === "Dark"}
              onClick={() => setActiveRight("Dark")}
              className="right-list-item font-geist-mono text-right text-[clamp(0.5vw,1vw,2rem)] uppercase text-[var(--text-color)] select-none"
            >
              Dark
            </ScrambleText>

            <ScrambleText
              side="right"
              active={activeRight === "System"}
              onClick={() => setActiveRight("System")}
              className="right-list-item font-geist-mono text-right text-[clamp(0.5vw,1vw,2rem)] uppercase text-[var(--text-color)] select-none"
            >
              System
            </ScrambleText>
          </div>
        </div>

        <div className="absolute left-10 top-165 overflow-hidden">
          <div ref={paragraph} className="paragraph">
            <p className=" font-bold uppercase text-[var(--text-color)] cursor-pointer select-none">
              Just Another Creative Studio.
            </p>
            <p className=" font-light uppercase text-[var(--text-color)] cursor-pointer select-none">
              Nothing special. Unless you're
            </p>
            <p className=" font-light uppercase text-[var(--text-color)] cursor-pointer select-none">
              Here to build a brand thats
            </p>
            <p className=" font-bold uppercase text-[var(--text-color)] cursor-pointer select-none">
              Impossible to ignore.
            </p>
          </div>
        </div>
      </header>
    </motion.main>
  );
}