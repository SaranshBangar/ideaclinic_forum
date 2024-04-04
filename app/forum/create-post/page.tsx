"use client";
import React from "react";
import Tiptap from "@/components/Tiptap";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { ComboboxDropdownMenu } from "./ComboBox";

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
  const [label, setLabel] = useState("Other");
  const [label_color, setLabelColor] = useState("#CCCCCC");
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
          .insert({ creator_id: userId, content: content, title: title, likes: [], label: label, label_color: label_color});
          
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
          console.log(data);
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
      <form method="post" className="w-10/12 flex flex-row my-4 z-[1000] justify-evenly items-center">
        <div className="w-full">
          <Label htmlFor="title" className="mt-4 text-lg font-thin text-white">
            Post Title
          </Label>
          <Input
            placeholder="Cool title here"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-white bg-black bg-opacity-80 mt-3"
          />

        </div>
        <div className="px-2">
          <Label htmlFor="label" className="mb-3 text-lg justify-end w-full flex font-thin text-white">
            Choose a label
          </Label>
          <ComboboxDropdownMenu
            label={label}
            setLabel={setLabel}
            color={label_color}
            setColor={setLabelColor}
          />
        </div>
      </form>
      <div className="z-[1000] w-full relative backdrop-blur-md text-white flex flex-row justify-center items-center my-4 md:px-6 lg:px-12 gap-2">
        <div>
          <Tiptap setContent={setContent} />
        </div>
      </div>
      <BackgroundBeams />

      <Button
        type="submit"
        className="w-1/2 mt-4 z-[1000]"
        onClick={makePost}
        disabled={updating}
        
      >
        <span>{updating ?  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Post it!"}</span>
      </Button>
    </main>
  );
}
