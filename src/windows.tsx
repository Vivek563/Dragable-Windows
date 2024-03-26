import { DraggableProps, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { FiMaximize2, FiMinus } from "react-icons/fi";
import { IoIosClose } from "react-icons/io";

interface FloatingWindowProps {
     title: string;
     children: React.ReactNode;
}

const FloatingWindow: React.FC<FloatingWindowProps> = ({ title, children }) => {
     const [isMinimized, setIsMinimized] = useState(false);
     const [windowSize, setWindowSize] = useState({
          width: 0, // Initial width set to 0
          height: 0, // Initial height set to 0
     });
     const windowRef = useRef<HTMLDivElement>(null);
     const titleBarRef = useRef<HTMLDivElement>(null);
     const [dragConstraints, setDragConstraints] = useState<DraggableProps["dragConstraints"]>({
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
     });

     useEffect(() => {
          const handleResize = () => {
               setWindowSize({
                    width: window.innerWidth,
                    height: window.innerHeight,
               });
          };

          const updateConstraints = () => {
               if (windowRef.current && titleBarRef.current) {
                    const titleBarWidth = titleBarRef.current.offsetWidth;
                    const height = windowSize.height - 50;
                    const right = windowSize.width - titleBarWidth - 4;
                    setDragConstraints({
                         top: 0,
                         left: 0,
                         bottom: height ?? 0,
                         right: right,
                    });
               }
          };

          const resizeObserver = new ResizeObserver(() => {
               handleResize();
               updateConstraints();
          });

          if (windowRef.current) {
               resizeObserver.observe(windowRef.current);
          }
          if (titleBarRef.current) {
               resizeObserver.observe(titleBarRef.current);
          }

          return () => {
               resizeObserver.disconnect();
          };
     }, [windowSize]);

     const handleClose = () => {
          // Implement close functionality
     };

     const handleToggleMaximize = () => {
          setIsMinimized(false);
     };

     const handleToggleMinimize = () => {
          setIsMinimized(true);
     };

     return (
          <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
               {/* Title bar */}
               <motion.div
                    ref={windowRef}
                    drag
                    dragConstraints={dragConstraints}
                    dragTransition={{ power: 0 }}
                    dragElastic={0.3}
                    className={`absolute rounded-xl w-auto h-auto  text-center  bg-[#BBBBBB] ${isMinimized ? "minimized" : ""}`}
               >
                    <div ref={titleBarRef} className={`w-full bg-[#ffffff] flex justify-start pr-4  gap-[0.10rem] ${isMinimized ? "rounded-lg" : "rounded-t-lg"}  `}>
                         <div className="cursor-pointer gap-1 flex p-[0.8rem] ">
                              <button className=" w-[20px] h-[20px] flex justify-center items-center bg-[#FE5D55] rounded-full" onClick={handleClose}>
                                   <IoIosClose size={"100%"} />
                              </button>
                              {isMinimized ? (
                                   <button className={`w-[20px] h-[20px] flex justify-center items-center bg-[#FBC22F] rounded-full p-1`} onClick={handleToggleMaximize}>
                                        <FiMaximize2 size={"100%"} />
                                   </button>
                              ) : (
                                   <button className={`w-[20px] h-[20px] flex justify-center items-center bg-[#FBC22F] rounded-full p-1`} onClick={handleToggleMinimize}>
                                        <FiMinus size={15} />
                                   </button>
                              )}
                         </div>
                         <div className="flex items-center justify-center text-center">{title}</div>
                    </div>

                    {!isMinimized && (
                         // Content height
                         <div className={`bg-[#ffffff]  m-2 rounded-xl p-3 flex items-center justify-center`}>{children}</div>
                    )}
               </motion.div>
          </div>
     );
};

export default FloatingWindow;
