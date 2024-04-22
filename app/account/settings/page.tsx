'use client'

import { Button } from "@/components/ui/button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Loader2, ShieldOff } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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

const changePasswordSchema = z.object({
    password: z
      .string()
      .min(8, {
        message: 'Password must be at least 8 characters',
      })
      .regex(/[A-Z]/, {
        message: 'Password must contain at least one uppercase letter',
      })
      .regex(/[a-z]/, {
        message: 'Password must contain at least one lowercase letter',
      })
      .regex(/[0-9]/, {
        message: 'Password must contain at least one number',
      }),
  })

  const accountSchema = z.object({
    username: z.string().min(2, {
      message: 'Username must be at least 2 characters.',
    }),
    full_name: z.string().min(2, {
      message: 'Full name must be at least 2 characters.',
    }),
    dept: z.string().min(2, {
      message: 'Department must be at least 2 characters.',
    }),
    title: z.string().min(2, {
      message: 'Title must be at least 2 characters.',
    }),
    bio: z
      .string()
      .min(2, {
        message: 'Bio must be at least 2 characters.',
      })
      .max(1000, {
        message: 'Bio must be at most 1000 characters.',
      }),
    email: z.string().email({
      message: 'Please enter a valid email.',
    }),
  })

export default function Page (){
    const supabase = createClientComponentClient();
    const [userId, setUserId] = useState('')
    const [emailId, setEmailId] = useState('')
    const [username, setUsername] = useState('')
    const [ full_name, setFull_name] = useState('')
    const [ dept, setDept] = useState('')
    const [ title, setTitle] = useState('')
    const [ bio, setBio] = useState('')
    const [ avatar_url, setAvatar_url] = useState('')
    const [user, setUserData] = useState<userData | null>(null);
    const [loading, setloading] = useState(false)

    const { toast } = useToast();
    const router = useRouter();

    useMemo(() => {
        const fetchUser = async () => {
          const {
            data: { user },
          } = await supabase.auth.getUser()
    
          if (user) {
            setUserId(user.id)
            setEmailId(user.email || '') // Provide a default value for setEmailId
          } else {
            console.log('No user found')
            return <div>No user found</div>
          }
        }
        const getUserData = async () => {
          const { data , error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
    
          if (error) {
            console.log(error)
            toast({
              variant: 'destructive',
              title: 'Uh oh! Something went wrong.',
              description: 'There was a problem with your update.',
              action: (
                <ToastAction onClick={() => router.refresh()} altText="Try again">
                  Try again
                </ToastAction>
              ),
            })
          }
          if (!data) {
            console.log(error)
            toast({
              variant: 'destructive',
              title: 'Uh oh! Something went wrong.',
              description: 'There was a problem with your update.',
              action: (
                <ToastAction onClick={() => router.refresh()} altText="Try again">
                  Try again
                </ToastAction>
              ),
            })        
          }
          else {        
            setUsername(data[0].username)
            setFull_name(data[0].full_name)
            setDept(data[0].dept)
            setTitle(data[0].title)
            setBio(data[0].bio)
            setAvatar_url(data[0].avatar_url)
            form.reset({
              username: data[0].username,
              full_name: data[0].full_name || '',
              dept: data[0].dept || '',
              title: data[0].title || '',
              bio: data[0].bio || '',
            });
          }
        }
    
        fetchUser()
        if (userId) {
          getUserData()
        }
      }, [userId])


    const form = useForm<z.infer<typeof accountSchema>>({
        resolver: zodResolver(accountSchema),
      })
      const onSubmit = async (values: z.infer<typeof accountSchema>) => {
        // console.log(values)
        try {
          const { data, error } = await supabase
            .from('profiles')
            .upsert({
              id: userId,
              username: values.username !== '' ? values.username : undefined,
              full_name: values.full_name !== '' ? values.full_name : undefined,
              dept: values.dept !== '' ? values.dept : undefined,
              title: values.title !== '' ? values.title : undefined,
              bio: values.bio !== '' ? values.bio : undefined,
              email: emailId,
            })
            .eq('id', userId)
            .select()
    
          if (error) {
            console.log(error)
            toast({
              variant: 'destructive',
              title: 'Uh oh! Something went wrong.',
              description: 'There was a problem with your update.',
              action: (
                <ToastAction onClick={() => router.refresh()} altText="Try again">
                  Try again
                </ToastAction>
              ),
            })
          } else {
            console.log('Data updated successfully')
            toast({
              variant: 'success',
              title: 'Profile updated successfully',
              description: 'Your profile has been updated.',
            })
    
            router.push('/account')
          }
    
          // console.log(data)
        } catch (error) {
          console.log(error)
        }
      }

    const changePasswordForm = useForm<z.infer<typeof changePasswordSchema>>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
          password: '',
        },
      })

    const registerNotifications = async () => {
      setloading(true)
      try {
        const response = await fetch('https://notifications-microservice.vercel.app/register-notification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: userId,
                email: emailId,
                firstName: full_name,
                lastName: username,
                title: title
            })
        });
    
        const data = await response.json();
        console.log(data);
        toast({
          title: "Success",
          description: "You have been registered for notifications",
          variant: "success",
          duration: 5000,
        })
      } catch (error : any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
          duration: 5000,
        })
      }
      setloading(false)
    }
    
    return (
        <main className="pt-32 bg-[#090909] text-white w-full h-screen flex flex-col bg-grid-small-white/[0.2] items-center justify-center ">
            <ScrollArea className="w-8/12 h-11/12 flex flex-col border border-gray-300 rounded-md p-2 my-6 md:my-4 lg:my-2 z-0">
                <Tabs defaultValue="account" className="w-full min-h-96 h-full p-4">
                    <div className="gap-2 items-center flex flex-row justify-center sticky z-20">
                        <TabsList className=" bg-transparent gap-10 text-gray-400">
                            <TabsTrigger className="hover:bg-white/[0.2] transition-all ease-in-out active:border-b-2 border-b-sky-400" value="account">Account</TabsTrigger>
                            <TabsTrigger className="hover:bg-white/[0.2] transition-all ease-in-out active:border-b-2 border-b-sky-400" value="password">Password</TabsTrigger>
                            <TabsTrigger className="hover:bg-white/[0.2] transition-all ease-in-out active:border-b-2 border-b-sky-400" value="notifications">{`Notifications [BETA]`}</TabsTrigger>
                        </TabsList>
                    </div>
                    <Separator className="my-4" />
                    <TabsContent value="account" className="flex flex-col items-center">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-5 flex flex-col w-8/12"
                        >
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                    <Label className="text-white">Username</Label>
                                    <FormControl>
                                        <Input placeholder="JohnDoe" type="text" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is your public display name.
                                    </FormDescription>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="full_name"
                                render={({ field }) => (
                                    <FormItem>
                                    <Label className="text-white">Your Full Name</Label>
                                    <FormControl>
                                        <Input placeholder="John Doe" type="text" {...field} />
                                    </FormControl>
                                    <FormDescription>This is your full name.</FormDescription>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="dept"
                                render={({ field }) => (
                                    <FormItem>
                                    <Label className="text-white">Department</Label>
                                    <FormControl>
                                        <Input placeholder="C.Tech" type="text" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is the department you are a faculty / student of.
                                    </FormDescription>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                <Label className="text-white">Your Title</Label>
                                <FormControl>
                                    {/* <Input
                                    placeholder="Associate Professor"
                                    type="text"
                                    {...field}
                                    /> */}
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger className="text-black w-full">
                                        <SelectValue  placeholder="Select your Title " />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="HOD">HOD</SelectItem>
                                        <SelectItem value="Professor">Professor</SelectItem>
                                        <SelectItem value="Associate Professor">Associate Professor</SelectItem>
                                        <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
                                        <SelectItem value="Research Scholar">Research Scholar</SelectItem>
                                        <SelectItem value="Student">Student</SelectItem>
                                    </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormDescription>
                                    This is your current title.
                                </FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                                control={form.control}
                                name="bio"
                                render={({ field }) => (
                                    <FormItem>
                                    <Label className="text-white">Your Bio</Label>
                                    <FormControl>
                                        <Textarea
                                        className="text-black"
                                        placeholder="Hi! I am..... "
                                        {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        This is your bio, Say something interesting about yourself.
                                    </FormDescription>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                            type="button"
                            className="bg-gradient-to-br relative group/btn from-zinc-900 to-zinc-900 block bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                            onClick={() => onSubmit(form.getValues())}
                            >
                            Submit
                            <BottomGradient />
                            </Button>
                        </form>
                        </Form>
                    </TabsContent>
                    <TabsContent value="password">
                        <Form {...changePasswordForm}>
                            <div className="w-full flex justify-center items-center">
                                <div className="w-8/12 mt-4">
                                    <form
                                        action="/auth/pwd-change"
                                        method="post"
                                        className="animate-in flex-1 flex flex-col w-full h-fit justify-center gap-2 text-white backdrop-blur-[0.7px] p-4"
                                    >
                                        <FormField
                                            control={changePasswordForm.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                <FormLabel className="text-white">
                                                    Your New Password
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                    type="password"
                                                    className="text-black"
                                                    placeholder="Enter your new password here..."
                                                    {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    This is your new password. Don't forget it!
                                                </FormDescription>
                                                <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <br />
                                        <Button variant="destructive" type="submit">
                                        Change Password
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        </Form>
                    </TabsContent>
                    <TabsContent value="notifications">
                        <div className="flex flex-col gap-2">
                            <Button variant='destructive' className="w-fit flex flex-row gap-2 items-center" onClick={registerNotifications}>
                              {
                                loading ? <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" /> :  ( <p className="flex flex-row gap-2 items-center"><ShieldOff/>{`Register for Notifications [BETA]`} </p> ) 
                              }
                            </Button>
                        </div>

                    </TabsContent>
                </Tabs>
            </ScrollArea>
            <div className="h-[50px]"></div>
        </main>
    )
}


const BottomGradient = () => {
    return (
      <>
        <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
        <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
      </>
    )
  }