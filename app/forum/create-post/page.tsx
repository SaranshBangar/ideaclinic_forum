"use client";
import React from "react";
import Tiptap from "@/components/Tiptap";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Interweave } from "interweave";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

function load(value: any) {
  if (value == true) {
    console.log("loading");
  } else {
    console.log("done");
  }
}

export default function Page() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [updating, setUpdating] = useState(false);
  const [userId, setuserId] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const supabase = createClientComponentClient();

  useMemo(() => {
    const fetchUser = async () => {
      const {
          data: { user },
      } = await supabase.auth.getUser();

      if (user) {
          console.log("User found");
          console.log(user);
          setuserId(user.id);
      } else {
          console.log("No user found");
          router.push("/login");
      }
    };

    fetchUser();
  }, [userId])

  async function makePost() {
    
    if (title=="") {
      
      toast({
        title: "Missing Title",
        variant: "destructive",
      })

    } else {
      setUpdating(true);
      
      try {
        const { data, error } = await supabase
          .from("posts")
          .insert({ creator_id: userId, content: content, title: title });
        
        if (error) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
            duration: 5000,
          })
        } else {
          toast({
            title: "Post Created",
            variant: "success",
          })
        }       
        
      } catch (error : any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
          duration: 5000,
        })        
      }       
        setUpdating(false);
        router.push("/forum");
    }
  }


  return (
    <main className="flex bg-slate-800 min-h-screen w-screen flex-col items-center justify-center">
      <h1 className="relative z-10 text-lg md:text-7xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold">
        Create Your Post
      </h1>
      <form method="post" className="w-1/2 my-4 z-[1000]">
        <Label htmlFor="title" className="mt-4 text-lg font-thin text-white">
          Post Title
        </Label>
        <Input
          placeholder="Cool title here"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-white bg-black bg-opacity-80"
        />
      </form>
      <div className="z-[1000] w-full relative backdrop-blur-md text-white flex flex-row justify-center items-center my-4 md:px-6 lg:px-12 gap-2">
        <div>
          <Tiptap setContent={setContent} />
        </div>
        
        {/* <Interweave
          content={content}
          className=" p-2 border border-white rounded-md shadow-sm shadow-black m-2 relative"
        /> */}
      </div>
      <BackgroundBeams />

      <Button
        type="submit"
        className="w-1/2 mt-4 z-[1000]"
        onClick={makePost}
        disabled={updating}
        
      >
        <span>{updating ?  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "post"}</span>
      </Button>
    </main>
  );
}
