'use client'

import { motion } from "framer-motion";

import { LampContainer } from "@/components/ui/lamp";
import RenderPost from "./RenderPost";
import { useMemo } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";


export default function Page() {
 
  const supabase = createClientComponentClient();
  const router = useRouter();
  useMemo(() => {
    const fetchUser = async () => {
      const {
          data: { user },
      } = await supabase.auth.getUser();

      if (user) {
          console.log("User found");
          // console.log(user);
          // setuserId(user.id);
      } else {
          console.log("No user found");
          router.push("/login");
      }
    };

    fetchUser();
  }, [])


  return (
    <main className="w-full flex flex-col justify-center h-screen gap-20 items-center bg-[#090909] text-white overflow-hidden">
      

      <LampContainer className="-mt-32">
        <motion.h1
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="overflow-hidden mb-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight md:text-7xl"
        >
          Discover Ideas
        </motion.h1>
      </LampContainer>
      <RenderPost offset={0} limit={3} />


      
    </main>
  );
}
