'use client'

import { Button } from "@/components/ui/button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Loader2, ShieldOff } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface userData {
    id: string;
    username: string;
    full_name: string;
    email: string;
    avatar_url: string;
    updated_at: string;
    dept: string;
    bio: string;
    title: string;
}


export default function Page (){
    const supabase = createClientComponentClient();
    const [userId, setuserId] = useState('')
    const [user, setUserData] = useState<userData | null>(null);
    const [loading, setloading] = useState(false)
    useMemo(() => {
        const fetchUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
    
            if (user) {
                setuserId(user.id);
            } else {
                console.log("No user found");
                // router.push("/login");
            }
        };
        const getUserData = async () => {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
          
          if (error) {
            console.log('error', error)
          }
          else {
            setUserData(data[0]);
          }
        }
    
    
        fetchUser();
    
        if(userId !== '') {
          getUserData();
        }
    
    }, [userId]);


    return (
        <main className="pt-32 bg-[#090909] text-white w-full h-screen flex flex-col bg-grid-small-white/[0.2] items-center justify-center ">
            <section className="w-10/12 h-11/12 flex flex-col overflow-auto border border-gray-300 rounded-md p-2">
                <h1>Settings</h1>
                <p>Change your settings here</p>

                <form action="/auth/get-notif" method="post" className="flex flex-col gap-2">
                    <input className="text-white hidden bg-[#4e4e4e]" type="text" name="email" value={user?.email} />
                    <input className="text-white hidden bg-[#4e4e4e]" type="text" name="id" value={user?.id} />
                    <input className="text-white hidden bg-[#4e4e4e]" type="text" name="firstName" value={user?.full_name}  />
                    <input className="text-white hidden bg-[#4e4e4e]" type="text" name="lastName" value={user?.username}  />
                    <input className="text-white hidden bg-[#4e4e4e]" type="text" name="title" value={user?.title}  />
                    <Button type="submit" variant='destructive' className="w-fit flex flex-row gap-2 items-center" onClick={() => setloading(true)}>
                    {
                     loading ? <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" /> :  ( <p className="flex flex-row gap-2 items-center"><ShieldOff/>{`Register for Notifications [BETA]`} </p> ) 
                    }
                    </Button>
                </form>
            </section>
        </main>
    )
}