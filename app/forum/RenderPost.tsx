'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { CircleUserRound, Heart, Loader2, Share2, Tag } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge';

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

const RenderPost = ({
    offset,
    limit,
    filter
} : {
    offset: number;
    limit: number;
    filter?: string;
}) => {
    
    const supabase = createClientComponentClient();
    const router = useRouter();
    const { toast } = useToast();

    const [posts, setPosts] = useState<Post[]>([]);
    const [isLiked, setIsLiked] = useState(false);
    const [isLiking, setIsLiking] = useState(false);
    const [userId, setUserId] = useState<string>('');
    

    const fetchPosts = async (filter?: string) => {
        try {
            let query = supabase
                .from('posts')
                .select('id, creator_id, title, likes, label, label_color, created_at, profiles( avatar_url, username )')
                .order('created_at', { ascending: false })
                .range(offset , limit);

            if (filter) {
                query = query.filter('label', 'eq', filter);
            }

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
                    // console.log('posts', data || 'No posts')
                    //@ts-ignore
                    setPosts(data);
                    const {data : { user } } =  await supabase.auth.getUser();
                    if(user){
                        setUserId(user.id);
                    }
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
    useMemo(() => {
        fetchPosts(filter);
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
          console.log('Share not supported on this browser, copy this link:', window.location.href);
        }
      }

    

    const handleLike = async (post : Post) => {
        setIsLiking(true);
        const {data : { user } } =  await supabase.auth.getUser();
        
        if (post && user && !post.likes.includes(user.id) ){
            try {
                await supabase
                .from('posts')
                .update({ likes: [...post.likes, user?.id] })
                .eq('id', post.id)
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
        else if (post && user) {
            try {
                await supabase
                .from('posts')
                .update({ likes: post.likes.filter((id) => id !== user?.id) })
                .eq('id', post.id)
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
        fetchPosts();
        setIsLiking(false);
        
      }


  return (
    <section className='w-screen absolute bottom-1 flex items-center justify-center max-h-[600px] overflow-y-auto  p-2'>
        <div className="flex flex-col gap-4 w-10/12 backdrop-blur-md rounded-md">
            {posts.map((post) => (
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
                        <Button variant='ghost' onClick={() => handleLike(post)} className={`hover:border border-white rounded-xl flex flex-col gap-1 px-2 py-1 text-xs text-gray-400`}>{ isLiking ? ( <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" /> ) : <Heart className={`${ post.likes.includes(userId) && 'fill-red-500' } text-red-400 `} /> } {post.likes.length}</Button>
                    </span>
                </div>
            ))}
        </div>
    </section>
  )
}

export default RenderPost