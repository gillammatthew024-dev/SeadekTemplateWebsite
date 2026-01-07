import { motion } from 'motion/react';

export function WaterBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950" />
      
      {/* Animated water-like blobs */}
      <motion.div
        className="absolute -top-1/2 -left-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-blue-600/20 to-cyan-500/20 blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute -bottom-1/2 -right-1/4 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-600/20 blur-3xl"
        animate={{
          x: [0, -80, 0],
          y: [0, -60, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute top-1/2 left-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-cyan-500/15 to-blue-600/15 blur-3xl"
        animate={{
          x: [-50, 50, -50],
          y: [-30, 30, -30],
          scale: [1.1, 1, 1.1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}