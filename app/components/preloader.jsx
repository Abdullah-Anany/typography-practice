
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, cubicBezier } from "framer-motion";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

const images = [
    "/images/1.jpg",
    "/images/2.jpg",
    "/images/3.jpg",
    "/images/4.jpg",
    "/images/5.jpg",
    "/images/6.jpg",
    "/images/7.jpg",
];

export default function Preloader({ onComplete }) {
    const [isComplete, setIsComplete] = useState(false);

    const topLoopRef = useRef(null);
    const bottomLoopRef = useRef(null);


    useEffect(() => {
        let mounted = true;

        const startTime = performance.now();
        const MIN_LOADING_TIME = 5000;

        const preloadImage = (src) => {
            return new Promise((resolve) => {
                const img = new Image();

                img.onload = resolve;
                img.onerror = resolve;
                img.src = src;
            });
        };

        // -----------------------------------------
        // START ANIMATION IMMEDIATELY
        // -----------------------------------------

        const startAnimation = () => {
            const topSplit = new SplitText(topLoopRef.current, {
                type: "chars",
            });

            const bottomSplit = new SplitText(bottomLoopRef.current, {
                type: "chars",
            });

            const topFirstO = topSplit.chars[1];
            const topSecondO = topSplit.chars[2];

            const bottomFirstO = bottomSplit.chars[1];
            const bottomSecondO = bottomSplit.chars[2];

            // -----------------------------------------
            // INITIAL STATE
            // -----------------------------------------

            gsap.set(topFirstO, {
                yPercent: 0,
            });

            gsap.set(topSecondO, {
                yPercent: 100,
            });

            gsap.set(bottomFirstO, {
                yPercent: -100,
            });

            gsap.set(bottomSecondO, {
                yPercent: 0,
            });

            // -----------------------------------------
            // LOOP
            // -----------------------------------------

            const tl = gsap.timeline({
                repeat: -1,
                repeatDelay: 0.75,
                defaults: {
                    duration: 1.25,
                    ease: cubicBezier(0.76, 0, 0.24, 1),
                },
            });

            // TOP
            tl.to(
                topFirstO,
                {
                    yPercent: 100,
                },
                0
            );

            tl.to(
                topSecondO,
                {
                    yPercent: 0,
                },
                0
            );

            // BOTTOM
            tl.to(
                bottomSecondO,
                {
                    yPercent: -100,
                },
                0
            );

            tl.to(
                bottomFirstO,
                {
                    yPercent: 0,
                },
                0
            );

            return {
                tl,
                topSplit,
                bottomSplit,
            };
        };

        // -----------------------------------------
        // START LOOP NOW
        // -----------------------------------------

        const animation = startAnimation();

        // -----------------------------------------
        // LOAD ASSETS IN PARALLEL
        // -----------------------------------------

        const loadAssets = async () => {
            const fontsPromise = document.fonts
                ? document.fonts.ready
                : Promise.resolve();

            const imagesPromise = Promise.all(
                images.map(preloadImage)
            );

            await Promise.all([
                fontsPromise,
                imagesPromise,
            ]);

            // -----------------------------------------
            // MAKE SURE MINIMUM 5 SECONDS HAVE PASSED
            // -----------------------------------------

            const elapsed = performance.now() - startTime;

            const remainingTime = Math.max(
                0,
                MIN_LOADING_TIME - elapsed
            );

            await new Promise((resolve) =>
                setTimeout(resolve, remainingTime)
            );

            if (!mounted) return;

            // -----------------------------------------
            // STOP LOOP
            // -----------------------------------------

            animation.tl.kill();

            animation.topSplit.revert();
            animation.bottomSplit.revert();

            // -----------------------------------------
            // OPEN WEBSITE
            // -----------------------------------------

            setIsComplete(true);
        };

        loadAssets();

        // -----------------------------------------
        // CLEANUP
        // -----------------------------------------

        return () => {
            mounted = false;

            animation.tl.kill();

            animation.topSplit.revert();
            animation.bottomSplit.revert();
        };
    }, []);



    return (
        <AnimatePresence
            onExitComplete={() => {
                onComplete?.();
            }}
        >
            {!isComplete && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#111]"
                    initial={{
                        y: 0,
                    }}
                    exit={{
                        y: "-100%",
                        transition: {
                            duration: 1,
                            ease: [0.76, 0, 0.24, 1],
                        },
                    }}
                >
                    {/* MASK */}
                    <div className="relative overflow-hidden">

                        {/* TOP LOOP */}
                        <div
                            ref={topLoopRef}
                            className="font-bebas-neue text-[clamp(2rem,5vw,6rem)] uppercase leading-none text-white"
                        >
                            Loop
                        </div>

                        {/* BOTTOM LOOP */}
                        <div
                            ref={bottomLoopRef}
                            className="absolute inset-0 font-bebas-neue text-[clamp(2rem,5vw,6rem)] uppercase leading-none text-white"
                        >
                            Loop
                        </div>

                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

