'use client'

import { motion } from "framer-motion";

import { LampContainer } from "@/components/ui/lamp";
import RenderPost from "./RenderPost";


export default async function ProtectedPage() {
 



  return (
    <main className="w-full flex flex-col justify-center h-screen gap-20 items-center bg-[#090909] text-white overflow-hidden">
      

      <LampContainer>
        <motion.h1
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="overflow-hidden mb-12 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
        >
          Discover Ideas
        </motion.h1>
      </LampContainer>
      <RenderPost />


      
    </main>
  );
}
