import { motion } from "framer-motion";

const AnimatedGrid = () => (
  <svg className="h-full w-full" viewBox="0 0 800 400" preserveAspectRatio="none">
    <defs>
      <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stopColor="#34d399" stopOpacity="0.25" />
        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.25" />
      </linearGradient>
    </defs>
    <motion.rect
      initial={{ x: -50 }}
      animate={{ x: 50 }}
      transition={{ repeat: Infinity, duration: 6, repeatType: "mirror" }}
      x="0"
      y="0"
      width="100%"
      height="100%"
      fill="url(#g1)"
    />
  </svg>
);

export default AnimatedGrid;
