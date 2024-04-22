'use client'
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRouter, useSearchParams } from "next/navigation"

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination"
import { useEffect, useMemo, useRef, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CircleUserRound, Heart, Loader2, RefreshCcw, Share2, Tag } from 'lucide-react';
import Link from 'next/link';
import { set } from "react-hook-form";
import Image from "next/image";

interface Post {
    id: string;
    creator_id: string;
    title: string;
    likes: string[];
    label: string;
    label_color: string;
    created_at: string;
    profiles: {
        avatar_url: string;
        username: string;
    }
}


export default function Page() {
    const supabase = createClientComponentClient();
    
    const [loading , setLoading] = useState(false);
    const [postsCount, setPostsCount] = useState<number | null>(null);
    const { toast } = useToast();

    const [ pageNo , setPageNo ] = useState(0);
    const [posts, setPosts] = useState<Post[]>([]);

    const getOffsets = () => {
        const postsPerPage = 5;
        let offset = pageNo * postsPerPage;
        let limit = offset + postsPerPage;

        if (pageNo > 0) {
            limit += 1;
            offset += 1;
        }
        return { offset, limit };
    }

    useMemo(() => {
        const getPostsCount = async () => {
            try {
                let {  data , error } = await supabase
                    .from('posts')
                    .select('id')
                    
                    if (error) {
                        console.log('error', error)
                    }
                    if (data) {
                        setPostsCount(data.length);
                    }
            } catch (error : any) {
                console.log('error', error)
                toast({
                    title: 'Error',
                    description: error.message,
                    duration: 5000,
                    variant: 'destructive'
                })
            }
        }

        getPostsCount();
    }, [])

    const fetchPosts = async () => {
        const { offset , limit } = getOffsets();
        console.log('offset', offset)
        console.log('limit', limit)

        try {
            let query = supabase
                .from('posts')
                .select('id, creator_id, title, likes, label, label_color, created_at, profiles( avatar_url, username )')
                .order('created_at', { ascending: false })
                .range(offset , limit);

            let { data, error } = await query;
            
            
            if (error) {
                console.log('error', error)
                toast({
                    title: 'Error',
                    description: error.message,
                    duration: 5000,
                    variant: 'destructive'
                })
            } else {
                if (data) {
                    console.log('posts')
                    console.log(data)
                    //@ts-ignore
                    setPosts((currentData) => [...currentData , ...data]);
                    setPageNo(pageNo + 1);
                } else {
                    console.log('No posts found')
                }
            }
            
            
        } catch (error : any) {
            console.log('error', error)
            toast({
                title: 'Error',
                description: error.message,
                duration: 5000,
                variant: 'destructive'
            })
        }
        
    }
    


    const handleShare = (url : string) => {
        if (navigator.share) {
          navigator.share({
            title: 'Check out this post from Idea Clinic!',
            url: url,
          })
          .then(() => console.log('Successful share'))
          .catch((error) => console.log('Error sharing', error));
        } else {
          console.log('Share not supported on this browser, copy this link:', window.location.href);
        }
      }

    

    // const handleLike = async (post : Post) => {
    //     setIsLiking(true);
    //     const {data : { user } } =  await supabase.auth.getUser();
        
    //     if (post && user && !post.likes.includes(user.id) ){
    //         try {
    //             await supabase
    //             .from('posts')
    //             .update({ likes: [...post.likes, user?.id] })
    //             .eq('id', post.id)
    //             setIsLiked(true);
    //         } catch (error : any) {
    //             toast({
    //                 title: 'Error',
    //                 description: error.message,
    //                 duration: 5000,
    //                 variant: 'destructive'
    //             })
    //         }
    //     }
    //     else if (post && user) {
    //         try {
    //             await supabase
    //             .from('posts')
    //             .update({ likes: post.likes.filter((id) => id !== user?.id) })
    //             .eq('id', post.id)
    //             setIsLiked(false);
    //         } catch (error : any) {
    //             toast({
    //                 title: 'Error',
    //                 description: error.message,
    //                 duration: 5000,
    //                 variant: 'destructive'
    //             })
    //         }
    //     }
    //     fetchPosts();
    //     setIsLiking(false);
        
    //   }

      const hasFetchedData = useRef(false);

      useEffect(() => {
        if (hasFetchedData.current === false) {
            setLoading(true);
            fetchPosts();
            hasFetchedData.current = true;
            setLoading(false);
        } 
      } , [])
    


    return (
        <main className="pt-32 bg-[#090909] text-white w-full h-screen flex flex-col bg-dot-white/[0.2] items-center justify-center ">
            
            <ScrollArea className="w-[98%] h-10/12  backdrop-blur-sm flex flex-col items-center justify-center">
                <section className="w-full h-full items-center flex justify-center m-2">
                    <div className="flex flex-col gap-4 w-10/12 backdrop-blur-md rounded-md">
                        {posts.length == 0 ? (
                             <section className="flex flex-col items-center justify-center gap-2">
                             <div className="flex flex-row space-y-3 w-10/12 my-2 items-center gap-2">
                                 <Skeleton className="h-12 w-12 rounded-full " />
                                 <Skeleton className=" h-16 w-10/12" />
                                 <Skeleton className=" h-16 w-1/12" />
                             </div>
                             <div className="flex flex-row space-y-3 w-10/12 my-2 items-center gap-2">
                                 <Skeleton className="h-12 w-12 rounded-full " />
                                 <Skeleton className=" h-16 w-10/12" />
                                 <Skeleton className=" h-16 w-1/12" />
                             </div>
                             <div className="flex flex-row space-y-3 w-10/12 my-2 items-center gap-2">
                                 <Skeleton className="h-12 w-12 rounded-full " />
                                 <Skeleton className=" h-16 w-10/12" />
                                 <Skeleton className=" h-16 w-1/12" />
                             </div>
                             <div className="flex flex-row space-y-3 w-10/12 my-2 items-center gap-2">
                                 <Skeleton className="h-12 w-12 rounded-full " />
                                 <Skeleton className=" h-16 w-10/12" />
                                 <Skeleton className=" h-16 w-1/12" />
                             </div>
                             <div className="flex flex-row space-y-3 w-10/12 my-2 items-center gap-2">
                                 <Skeleton className="h-12 w-12 rounded-full " />
                                 <Skeleton className=" h-16 w-10/12" />
                                 <Skeleton className=" h-16 w-1/12" />
                             </div>
                         </section>
                         ) : ( posts.map((post) => (
                            <div key={post.id}  className="bg-[#090909] w-full flex flex-row p-4 rounded-md shadow-md justify-between items-center">
                                <span className='flex flex-row w-1/3 justify-start gap-6 items-center'>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <Avatar className='z-[100]'>
                                                    <Link href={`/account/${post.creator_id}`}>
                                                        <AvatarImage src={post.profiles.avatar_url} className=" object-cover object-center" />
                                                        <AvatarFallback><CircleUserRound /></AvatarFallback>
                                                    </Link>
                                                </Avatar>
                                            </TooltipTrigger>
                                            <TooltipContent  className='bg-[#090909] text-white'>
                                                {post.profiles.username}
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    <Link href={`/forum/post/${post.id}`}>
                                        <h3 className="text-xl font-semibold text-white">{post.title}</h3>
                                        <p className="text-gray-400">{new Date(post.created_at).toLocaleDateString()}</p>
                                    </Link>
                                </span>
                                <span className='w-full flex flex-row items-center '>
                                    <Badge variant='secondary' style={{background:post.label_color}} className={` flex flex-row gap-1 text-nowrap text-[#fffaed]`}><Tag/>{post.label}</Badge>
                                </span>
                                <span className="flex flex-row gap-2">
                                    <Button variant='ghost' onClick={() => handleShare(`/forum/post/${post.id}`)} className="hover:border border-white rounded-xl flex flex-col gap-1 px-2 py-1 text-xs text-gray-400"><Share2 /></Button>
                                    {/* <Button variant='ghost' onClick={() => handleLike(post)} className={`hover:border border-white rounded-xl flex flex-col gap-1 px-2 py-1 text-xs text-gray-400`}>{ isLiking ? ( <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" /> ) : <Heart className={`${ post.likes.includes(userId) && 'fill-red-500' } text-red-400 `} /> } {post.likes.length}</Button> */}
                                </span>
                            </div>
                        )))}
                        {
                            posts.length < (postsCount ?? 0) ? (
                                <Button variant='ghost'  onClick={() => fetchPosts()}>
                                    <RefreshCcw />
                                </Button>
                            ) : (
                                <div className="mt-8 mb-12 px-2 flex flex-col text-white items-center justify-evenly">
                                    <Image
                                        src="/doge.svg"
                                        alt="No more posts"
                                        width={80}
                                        height={80}
                                        className="text-white"
                                    />
                                    <p className="text-center">No more Posts</p>
                                </div>
                            )
                        }
                    </div>
                </section>
            </ScrollArea>
        </main>
    )
}