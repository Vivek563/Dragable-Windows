import { motion } from "framer-motion";
import { useRef } from "react";

export const Example = () => {
     const constraintsRef = useRef(null);

     return (
          <>
               <motion.div className="drag-area" ref={constraintsRef} />
               <motion.div drag dragConstraints={constraintsRef} />
          </>
     );
};
