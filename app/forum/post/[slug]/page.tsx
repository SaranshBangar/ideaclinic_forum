'use client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Interweave } from "interweave";
import { Heart, Loader2, Share2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { set } from "react-hook-form";

interface Post {
    creator_id: string;
    title: string;
    likes: string[];
    created_at: string;
    content: string;
    profiles: {
        avatar_url: string;
        username: string;
        title: string;
        dept: string;
    }
}


export default function Page() {
    const { slug } = useParams();
    const supabase = createClientComponentClient();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [isLiking, setIsLiking] = useState(false);
    const { toast } = useToast();

    const fetchPost = async () => {
        try {
            setLoading(true);
            let { data: posts, error } = await supabase
            .from('posts')
            .select('creator_id, title, content, likes, created_at, profiles( avatar_url, username, title, dept)')
            .eq('id', slug)
            
            if (error) {
                console.log('error', error)
            } else {
                if (posts) {
                    console.log('posts', posts || 'No posts')
                    //@ts-ignore
                    setPost(posts[0]);
                    if(posts[0].likes.includes((await supabase.auth.getUser()).data.user?.id)) {
                        setIsLiked(true);
                        console.log('User has liked this post')
                    }
                } else {
                    console.log('No posts found')
                }
            }
            
        } catch (error : any) {
            toast({
                title: 'Error',
                description: error.message,
                duration: 5000,
                variant: 'destructive'
            })
        }
        setLoading(false);
    }

    useEffect(() => {        
        fetchPost();
    }, [])

    

    const handleShare = (url : string) => {
        if (navigator.share) {
          navigator.share({
            title: 'Check out this post from Idea Clinic!',
            url: url,
          })
          .then(() => console.log('Successful share'))
          .catch((error) => console.log('Error sharing', error));
        } else {
          console.log('Share not supported on this browser, copy this link:', url);
        }
      }

      const handleLike = async () => {
        setIsLiking(true);
        const {data : { user } } =  await supabase.auth.getUser();
        if (!isLiked && post){
            try {
                await supabase
                .from('posts')
                .update({ likes: [...post.likes, user?.id] })
                .eq('id', slug)
                setIsLiked(true);
            } catch (error : any) {
                toast({
                    title: 'Error',
                    description: error.message,
                    duration: 5000,
                    variant: 'destructive'
                })
            }
        }
        else if (isLiked && post) {
            try {
                await supabase
                .from('posts')
                .update({ likes: post.likes.filter((id) => id !== user?.id) })
                .eq('id', slug)
                setIsLiked(false);
            } catch (error : any) {
                toast({
                    title: 'Error',
                    description: error.message,
                    duration: 5000,
                    variant: 'destructive'
                })
            }
        }
        fetchPost();
        setIsLiking(false);
        
      }


    return (
        <main className="bg-[#121212] min-h-screen overflow-y-auto flex flex-col pt-24 items-center">
            {
                loading ? (
                    <Loader2 className="mr-2 h-64 w-64 animate-spin text-white" />
                ) : (
                    post && (
                        <section className="text-white w-3/5 mb-8">
                            <h1 className=" font-arimo font-semibold text-5xl mt-6">{post.title}</h1>
                            <h3 className="font-arimo font-medium text-xl mb-12 ml-1">{new Date(post.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</h3>
                            <div className=" border-y border-[#4A4A4A] py-4 my-12 flex flex-row justify-between gap-2">
                                <Link className="flex flex-row gap-2 font-arimo font-medium text-sm text-[#9D9D9D] items-center" href={`/account/${post.creator_id}`}>
                                    <Avatar className='z-[100] hover:border'>
                                            <AvatarImage src={post.profiles.avatar_url} className=" object-cover object-center" />
                                            <AvatarFallback>{post.creator_id}</AvatarFallback>
                                    </Avatar>
                                    <span>
                                        <p>{post.profiles.username}</p>
                                        <i>{post.profiles.title}</i>
                                    </span>
                                </Link>
                                <span className="flex flex-row gap-2">
                                    <Button variant='ghost' onClick={() => handleShare(window.location.href)} className="hover:border border-white rounded-xl flex flex-col gap-1 px-2 py-1 text-xs text-gray-400"><Share2 /></Button>
                                    <Button variant='ghost' onClick={() => handleLike()} className={`${isLiked ? 'bg-white' : '' }hover:border border-white rounded-xl flex flex-col gap-1 px-2 py-1 text-xs text-gray-400`}>{ isLiking ? ( <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" /> ) : ( <Heart className=" text-red-400" /> ) } {post.likes.length}</Button>
                                </span>
                            </div>
                            {/* <p>{post.content}</p> */}
                            <Interweave
                                content={post.content}
                                className=" space-y-2 font-normal text-lg font-poppins text-[#F3F3F3]"
                                allowAttributes={true}
                                allowElements={true}
                            />
                        </section>
                    )                    
                )
            }
        </main>
    );
}