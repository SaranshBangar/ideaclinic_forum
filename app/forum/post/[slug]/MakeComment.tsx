'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { User, createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Loader2, SendHorizontal } from "lucide-react"
import { useRouter } from "next/navigation"
import { use, useEffect, useState } from "react"

export default function MakeComment({
    postId,
    onCommentSuccess
}: {
    postId: string | string[],
    onCommentSuccess: () => void
}) {

    const supabase = createClientComponentClient();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [comment, setComment] = useState<string>('');
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        
        async function fetchUser() {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setLoading(false);
        }

        fetchUser();
    } , [])

    const postComment = async () => {
        if (!comment) {
            toast({
                title: 'Error',
                description: 'Please enter a comment',
                duration: 5000,
                variant: 'destructive'
            })
        };
        setLoading(true);
        try {
            const { data, error } = await supabase
            .from('comments')
            .insert({
                postid: postId,
                creatorid: user?.id,
                content: comment,
                likes: [],
            })
            if (error) {
                console.log('error', error)
            } else {
                console.log('comment', data)
                router.refresh();
                toast({
                    title: 'Success',
                    description: 'Comment posted successfully',
                    duration: 5000,
                    variant: 'success'
                })
                setComment('');
            }
        } catch (error : any) {
            console.log('error', error)
        }
        setLoading(false);
    }

    return (
        <section className="mt-24 w-3/5 text-white flex items-center justify-center gap-4 border-t border-[#4A4A4A] pt-12">
            <Textarea
                disabled={loading}
                placeholder="Make a comment"
                className="min-w-[400px] w-full bg-[#090909] text-white resize-none"
                rows={1}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            />
            <Button variant="secondary" disabled={loading} className="bg-[#090909] text-white" onClick={postComment}>
               {
                     loading ? <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" /> : <SendHorizontal />
               } 
            </Button>
        </section>
    );
}