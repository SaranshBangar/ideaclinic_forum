'use client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { CircleUserRound, Loader2, ThumbsUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { comment } from "postcss";
import { useEffect, useState } from "react";
import { set } from "react-hook-form";

interface Comment {
    id: string;
    postid: string;
    content: string;
    creatorid: string;
    created_at: string;
    likes: string[];
    profiles: {
        avatar_url: string;
        username: string;
    }
}

export default function Comments({
    postId,
    reloadComments
}: {
    postId: string | string[],
    reloadComments: boolean
}) {

    const supabase = createClientComponentClient();
    const [loading, setLoading] = useState(true);
    const [showComments, setComments] = useState<Comment[]>([]);
    const [isLiked, setIsLiked] = useState(false);
    const [userId, setUserId] = useState<string>('');
    const [isLiking, setIsLiking] = useState(false);
    const { toast } = useToast();

    const fetchComments = async () => {
        try {
            setLoading(true);
            let { data: comments, error } = await supabase
            .from('comments')
            .select('id, postid, content, creatorid, created_at, likes, profiles( avatar_url, username )')
            .eq('postid', postId)
            .order('created_at', { ascending: false })

            if (error) {
                console.log('error', error)
            } else {
                if (comments) {
                    console.log('comments', comments || 'No comments')
                    //@ts-ignore
                    setComments(comments);
                } else {
                    console.log('No comments found')
                }
            }
        } catch (error : any) {
            console.log('error', error)
        }
        setLoading(false);
    }
    useEffect(() => {

        fetchComments();
    },[reloadComments])


    const handleLike = async ({
        comment 
    } : {
        comment: Comment
    }) => {
        setIsLiking(true);
        const {data : { user } } =  await supabase.auth.getUser();
        if ( comment && user && !comment.likes.includes(user?.id) ){
            try {
                await supabase
                .from('comments')
                .update({ likes: [...comment.likes, user?.id] })
                .eq('id', comment.id)
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
        else if (comment && user && comment.likes.includes(user?.id)) {
            try {
                await supabase
                .from('comments')
                .update({ likes: comment.likes.filter((id) => id !== user?.id) })
                .eq('id', comment.id)
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
        fetchComments();
        setIsLiking(false);
        
      }

    return (
        <>
            {loading ? (
                <Loader2 className="mr-2 h-12 w-12 animate-spin text-white" />
            ) : (
                showComments.length > 0 ? (
                    showComments.map((comment: Comment) => (
                        <div key={comment.id} className="w-3/5 my-6 border-l border-teal-800 rounded-md p-2 py-3 text-white flex flex-col" >
                            <span className="w-full flex flex-row gap-2 items-center mb-4">
                                <Avatar className='z-[100] w-8 h-8'>
                                    <Link href={`/account/${comment.creatorid}`}>
                                        <AvatarImage src={comment.profiles.avatar_url} className=" object-cover object-center" />
                                        <AvatarFallback><CircleUserRound /></AvatarFallback>
                                    </Link>
                                </Avatar>
                                <span className="flex flex-col text-nowrap font-poppins text-sm text-gray-400">
                                    <p>{comment.profiles.username}</p>
                                    <p>{new Date(comment.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                </span>
                                <div className="w-full flex justify-end ">
                                    <span className=" text-sm text-gray-400">
                                    { 
                                        isLiking ? ( 
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" /> 
                                                ) : (
                                            <p className="flex flex-col gap-1 items-center">                                                  
                                                <ThumbsUp onClick={() => handleLike({ comment })} className="cursor-pointer hover:bg-white p-1 rounded-xl transition-all duration-300 ease-in-out hover:text-black"/>
                                                {comment.likes.length }
                                            </p>
                                    )}
                                    </span>
                                </div>
                            </span>
                            <p>{comment.content}</p>
                        </div>
                    ))
                ) : (
                    <div className="mt-8 mb-12 px-2 flex flex-col text-white items-center justify-evenly">
                        <Image
                            src="/mememan.svg"
                            alt="No comments"
                            width={80}
                            height={80}
                        />
                        <p className="text-center">No comments yet</p>
                        <p className="text-center">Be the first to change that {`😉`}</p>
                    </div>
                )
            )}
        </>
    )
}