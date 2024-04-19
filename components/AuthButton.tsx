
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";

import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SquarePen, User, UserCog } from "lucide-react";
import { cookies } from "next/headers";
import AvatarComponent from "./Avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";



export default async function AuthButton() {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })
  const {
    data: { session },
  } = await supabase.auth.getSession()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  

  

  return session && user ? (
    <div className="flex flex-row items-center justify-end gap-4">
      <Link href='/forum/create-post' className="flex items-center gap-1 hover:scale-110 transition-all duration-150 ease-in">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
                <SquarePen  className="w-[16px] mr-1" />
            </TooltipTrigger>
            <TooltipContent className="bg-[#090909] text-white">
              <p>Create a new post</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <AvatarComponent userId={user.id} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-[#333333] text-white mt-1 z-[1000] p-0">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link href="/account" className="flex items-center gap-1">
              <User className="w-[12px] mr-1" />
              Account
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/account/settings" className="flex items-center gap-1">
              <UserCog className="w-[12px] mr-1" />
              Account Settings
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <form action="/auth/logout" method="post">
        <Button
          variant="outline"
          className="py-2 px-4 rounded-md hover:text-gray-500 no-underline bg-btn-background hover:bg-btn-background-hover"
        >
          Logout
        </Button>
      </form>
    </div>
  ) : (
    <Link href="/login">
      {/* <Button variant='outline' className="py-2 px-4 rounded-md hover:text-gray-500 no-underline bg-btn-background hover:bg-btn-background-hover"> */}
      Login
      {/* </Button> */}
    </Link>
  )
}
