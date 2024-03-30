'use client'
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react'

interface Post {
    id: string;
    creator_id: string;
    title: string;
    likes: string[];
    created_at: string;
    profiles: {
        avatar_url: string;
    }
}

const RenderPost = () => {
    
    const supabase = createClientComponentClient();
    const router = useRouter();
    const { toast } = useToast();

    const [posts, setPosts] = useState<Post[]>([]);

    useMemo(() => {
        const fetchPosts = async () => {
            try {
                let { data, error } = await supabase
                .from('posts')
                .select('id, creator_id, title, likes, created_at, profiles( avatar_url )')
                .range(0, 9)
                .order('created_at', { ascending: false })
                
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
                        console.log('posts', data || 'No posts')
                        //@ts-ignore
                        setPosts(data);
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

        fetchPosts();
    }, [])


  return (
    <section className='w-screen z-[1000] flex items-center justify-center'>
        <div className="flex flex-col gap-4 w-10/12 ">
            {posts.map((post) => (
                <div key={post.id}  className="bg-[#090909] w-full flex flex-row p-4 rounded-md shadow-md justify-between items-center">
                    <span className='flex flex-row w-1/3 justify-start gap-6 items-center'>
                        <Avatar className='z-[100]'>
                            <Link href={`/account/${post.creator_id}`}>
                                <AvatarImage src={post.profiles.avatar_url} className=" object-cover object-center" />
                                <AvatarFallback>{post.id}</AvatarFallback>
                            </Link>
                        </Avatar>
                        <Link href={`/forum/post/${post.id}`}>
                            <h3 className="text-xl font-semibold text-white">{post.title}</h3>
                            <p className="text-gray-400">{new Date(post.created_at).toLocaleDateString()}</p>
                        </Link>
                    </span>
                    <Button variant='ghost' className="hover:border border-white rounded-xl flex flex-col gap-1 px-2 py-1 text-xs text-gray-400"><Heart /> {post.likes.length}</Button>
                </div>
            ))}
        </div>
    </section>
  )
}

export default RenderPost