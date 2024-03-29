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

function load(value: any) {
  if (value == true) {
    console.log("loading");
  } else {
    console.log("done");
  }
}

export default function Page() {
  const [content, setContent] = useState("");
  const [updating, setUpdating] = useState(false);

  async function makePost() {
    let title = document.getElementById("input");
    if (!title.value) {
      alert("enter title!");
    } else {
      setUpdating(true);
      const supabase = createClientComponentClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      await supabase

        .from("posts")
        .insert({ id: user!.id, content: content, title: title.value });

      setUpdating(false);
      location.href = location.href;
    }
    //this will reload the page without doing SSR
  }

  // useMemo(() => {
  //   if(!content) {
  //     console.log('content is empty')
  //   }
  //   if(content) {
  //     console.log('content is not empty')
  //     console.log(content)
  //   }

  // }, [content])

  return (
    <main className="flex bg-slate-800 min-h-screen w-screen flex-col items-center justify-center">
      <p className="{value==true ? 'text-blue-500' : 'text-black'}"> POSTING</p>
      <h1 className="relative z-10 text-lg md:text-7xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold">
        Create Your Post
      </h1>
      <form method="post" className="w-1/2 my-4 z-[1000]">
        <Label htmlFor="title" className="mt-4 text-lg font-thin text-white">
          Post Title
        </Label>
        <Input
          type="text"
          id="input"
          placeholder="Cool title here"
          className="text-black bg-black bg-opacity-80"
        />
      </form>
      <div className="z-[1000] w-full relative backdrop-blur-md text-white flex flex-row justify-between my-4 md:px-6 lg:px-12 gap-2">
        <div>
          <Tiptap setContent={setContent} />
        </div>
        <Interweave
          content={content}
          className=" p-2 border border-white rounded-md shadow-sm shadow-black m-2 relative"
        />
      </div>
      <BackgroundBeams />

      <Button
        type="submit"
        className=" relative "
        onClick={makePost}
        disabled={updating}
      >
        <span>{updating ? "posting.." : "post"}</span>
      </Button>
    </main>
  );
}
