import { DraggableProps, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { FiMaximize2, FiMinus } from "react-icons/fi";
import { IoIosClose } from "react-icons/io";

interface WindowProps {
     title: string;
     children: React.ReactNode;
}

const Window: React.FC<WindowProps> = ({ title, children }) => {
     const [isMinimized, setIsMinimized] = useState(false);
     const [windowSize, setWindowSize] = useState({
          width: window.innerWidth,
          height: window.innerHeight,
     });
     const windowRef = useRef<HTMLDivElement>(null); // Ref for window div
     const titleBarRef = useRef<HTMLDivElement>(null); // Ref for title bar div

     const handleResize = () => {
          setWindowSize({
               width: window.innerWidth,
               height: window.innerHeight,
          });
     };

     useEffect(() => {
          window.addEventListener("resize", handleResize);

          return () => {
               window.removeEventListener("resize", handleResize);
          };
     }, []);

     useEffect(() => {
          // Function to update constraints based on window size
          const updateConstraints = () => {
               if (windowRef.current && titleBarRef.current) {
                    const titleBarWidth = titleBarRef.current.offsetWidth;
                    const h = windowSize.height - 50;
                    const r = windowSize.width - titleBarWidth - 4;
                    setDragConstraints({
                         top: 0,
                         left: 0,
                         bottom: h ?? 0,
                         right: r,
                    });
               }
          };

          updateConstraints(); // Call initially
          window.addEventListener("resize", updateConstraints); // Listen for resize events

          return () => {
               window.removeEventListener("resize", updateConstraints);
          };
     }, [windowSize, isMinimized]);

     const [dragConstraints, setDragConstraints] = useState<DraggableProps["dragConstraints"]>({
          top: 0,
          left: 0,
          bottom: windowSize.height - 50,
          right: windowSize.width - 320, // Initial value, will be updated dynamically
     });

     const handleClose = () => {
          // Implement close functionality
     };

     const handleMinimize = () => {
          setIsMinimized(!isMinimized);
     };

     return (
          <>
               <div
                    style={{
                         background: "red",
                         width: "100vw",
                         height: "100vh",
                         position: "relative",
                    }}
               >
                    {/*........Title bar........*/}
                    <motion.div
                         ref={windowRef}
                         drag
                         dragConstraints={dragConstraints}
                         className={`absolute rounded-xl w-auto h-auto border-2 text-center border-white bg-[#BBBBBB] ${isMinimized ? "minimized" : ""}`}
                    >
                         <div ref={titleBarRef} className={`w-full bg-[#ffffff] flex justify-start pr-4  gap-[0.10rem] ${isMinimized ? "rounded-lg" : "rounded-t-lg"}  `}>
                              <div className="cursor-pointer gap-1 flex p-[0.8rem] ">
                                   <button className=" w-[20px] h-[20px] flex justify-center items-center bg-[#FE5D55] rounded-full" onClick={handleClose}>
                                        <IoIosClose size={"100%"} />
                                   </button>
                                   <button className={`w-[20px] h-[20px] flex justify-center items-center ${isMinimized ? "bg-[#01CE4B]" : "bg-[#FBC22F]"}  rounded-full p-1`} onClick={handleMinimize}>
                                        {isMinimized ? <FiMaximize2 size={"100%"} /> : <FiMinus size={15} />}
                                   </button>
                              </div>
                              <div className="flex items-center justify-center text-center">{title}</div>
                         </div>

                         {!isMinimized && (
                              //...content height....
                              <div className={`bg-[#ffffff] w-[300px] h-[200px] m-2 rounded-xl p-3 flex items-center justify-center`}>{children}</div>
                         )}
                    </motion.div>
               </div>
          </>
     );
};

export default Window;
