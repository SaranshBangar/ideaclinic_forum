"use client";
import Tiptap from "@/components/Tiptap";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { CldUploadWidget } from 'next-cloudinary';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
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
  const [ hasUploaded, setHasUploaded ] = useState(false);
  const [ resource, setResource ] = useState<any>(undefined);
  const [ deleting, setDeleting ] = useState(false);
  const [ url, setUrl ] = useState<string | null>(null);
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
          .insert({ creator_id: userId, content: content, title: title, likes: [], label: label, label_color: label_color, banner_url: url});
          
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

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await fetch(`/auth/delete_image_cloudinary?publicId=${resource.public_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        setResource(undefined);
        setUrl(null);
        setHasUploaded(false);
      }
    } catch (error) {
      console.error(error);
    }
    setDeleting(false);
  }

  function truncateString(str : string) {
    const maxLength = 60;
    if (str.length > maxLength) {
      return str.substring(0, maxLength) + '...';
    } else {
      return str;
    }
  }


  return (
    <main className="flex bg-slate-800 min-h-screen w-screen flex-col items-center justify-center">
      <h1 className="relative z-10 my-6 text-lg md:text-7xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold">
        Create Your Post
      </h1>
      <form method="post" className="w-10/12 flex flex-row my-4 z-[1000] justify-evenly items-center">
        <div className="px-2">
          <Label htmlFor="label" className="mb-3 text-lg justify-start w-full flex font-thin text-white">
            Choose a label
          </Label>
          <ComboboxDropdownMenu
            label={label}
            setLabel={setLabel}
            color={label_color}
            setColor={setLabelColor}
          />
        </div>
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
      </form>

      <CldUploadWidget
        options={{
          sources: ['local', 'url', 'unsplash', 'google_drive'],
          folder: 'Banners',
          clientAllowedFormats: ['png', 'webp', 'jpg', 'jpeg', 'gif', 'svg'],
          maxImageFileSize: 1000000,
          validateMaxWidthHeight: true,
          cropping: true,
          showSkipCropButton: false,
          croppingAspectRatio: 16 / 9,
          croppingShowDimensions: true,
          croppingShowBackButton: true,
          theme: 'minimal',
          showUploadMoreButton: false,
          showCompletedButton: true,
          singleUploadAutoClose: true,
        }}
        signatureEndpoint="/auth/sign-cloudinary-params"
        onSuccess={(result, { widget }) => {
          setResource(result?.info);
          if (result.event !== 'success') {
            setHasUploaded(false);
          } else if (result.event === 'success' && typeof result.info !== 'string' && result.info && result.info.secure_url) {
            setHasUploaded(true);
            setUrl(result.info.secure_url);
            // console.log(result.info);
          }
          // console.log(result);
          widget.close();
        }}
      >
        {({ open }) => {
          function handleOnClick() {
            setResource(undefined);
            // console.log("open");
            open();
          }
        
          return (
            <div className="w-full max-h-96 flex flex-row items-center justify-center">
              {
                hasUploaded && url ? (  
                  <div className="z-[1000] w-10/12 bg-[#090909] rounded-md max-h-96 p-1 flex flex-row justify-between items-center">
                    <Image src={url} alt="uploaded image" width={1920} height={1080} className="w-auto max-w-96 h-64 rounded-md" /> 
                    <Button className="mr-2 w-fit h-fit" variant='secondary' disabled={deleting}> 
                      {
                        deleting ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 onClick={handleDelete} className="text-black text-xl" />
                        )
                      }
                    </Button>
                  </div>
                ) : ( 
                  
                  <Button variant="secondary" className="z-[1000] flex gap-2 items-center bg-green-400" onClick={handleOnClick}>
                    <ImagePlus />  Upload a Banner Image
                  </Button>

                )
              }
            </div>
          );
        }}
      </CldUploadWidget>

      <div className="z-[1000] backdrop-blur-md text-white flex flex-row justify-center items-center my-4 md:px-6 lg:px-12 gap-2">
        <div>
          <Tiptap setContent={setContent} />
        </div>
      </div>
      <BackgroundBeams />

      <Button
        type="submit"
        variant='secondary'
        className="w-1/2 mt-4 z-[1000] bg-green-400"
        onClick={makePost}
        disabled={updating}
        
      >
        <span>{updating ?  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Post it!"}</span>
      </Button>
    </main>
  );
}
