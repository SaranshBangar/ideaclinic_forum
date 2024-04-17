import Image from "next/image"
import deiLogo from "@/public/DEI.png"
import srmLogo from "@/public/SRM.png"
import { Instagram, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-[90vw]">
        {/* This first section has the 4 divs with 5 links each, each link refers to the home page as of now */}
        <div className="flex flex-row justify-evenly items-center gap-4">
            <div className="flex flex-col gap-3">
                <h2 className="font-bold text-[1.5rem]">Page</h2>
                <ul className="text-md list-none -ml-[0.0px] flex flex-col gap-[12px]">
                    <a href="/forum"><li>Forum</li></a>
                    <a href="/"><li>For You</li></a>
                    <a href="/"><li>All Posts</li></a>
                </ul>
            </div>
            <div className="flex flex-col gap-3">
                <h2 className="font-bold text-[1.5rem]">User</h2>
                <ul className="text-md list-none -ml-[0.0px] flex flex-col gap-[12px]">
                    <a href="/account"><li>Account</li></a>
                    <a href="/forum/create-post"><li>Create Post</li></a>
                    <a href="/login"><li>Login</li></a>
                </ul>
            </div>
            <div className="flex flex-col gap-3">
                <h2 className="font-bold text-[1.5rem]">About Us</h2>
                <ul className="text-md list-none -ml-[0.0px] flex flex-col gap-[12px]">
                    <a href="https://www.instagram.com/srmiiec/"><li>Instagram</li></a>
                    <a href="https://www.linkedin.com/school/srmiic/mycompany/"><li>LinkedIn</li></a>
                    <a href="https://www.twitter.com/SRM_DEI/"><li>Twitter/X</li></a>
                    <a href="mailto:manager.siic@srmist.edu.in"><li>Email</li></a>
                </ul>
            </div>
        </div>
        {/* The division line between the above 4 pillar divs and the image */}
        <div className="h-[1px] w-[96%] bg-slate-100 rounded-full mt-12 mb-6" />
        <div className="flex flex-col justify-center items-center gap-4">
            <div className="flex flex-row items-center gap-12">
                <div>
                    <Image
                        src={deiLogo}
                        alt="DEI Logo"
                        width={100} 
                        height={100} 
                    />
                </div>
                <div>
                    <Image
                        src={srmLogo}
                        alt="SRM Logo"
                        width={100} 
                        height={100} 
                    />
                </div>
            </div>
            {/* I have used lorem epsum as of now since i dont have any quality content to insert here */}
            <div> 
                <p className="text-center">Lorem ipsum dolor sit amet consectetur adipisicing elit <br /> Quae magni autem voluptate eius debitis officia nam provident accusamus?</p>
            </div>
            {/* All of the links refer to the home page as of now */}
            <div className="flex flex-row justify-evenly items-center w-1/2 mt-4 mb-3">
                <a href="https://www.linkedin.com/school/srmiic/mycompany/" className="border-2 border-white rounded-full p-2 hover:bg-gray-700 hover:shadow-sm ease-in-out duration-200 transition-all">
                    <Linkedin className="w-[30px] h-[30px]" />
                </a>
                <a href="mailto:manager.siic@srmist.edu.in" className="border-2 border-white rounded-full p-2 hover:bg-gray-700 hover:shadow-sm ease-in-out duration-200 transition-all">
                    <Mail className="w-[30px] h-[30px]" />
                </a>
                <a href="https://www.instagram.com/srmiiec/" className="border-2 border-white rounded-full p-2 hover:bg-gray-700 hover:shadow-sm ease-in-out duration-200 transition-all">
                    <Instagram className="w-[30px] h-[30px]" />
                </a>
            </div>
            {/* All of the links refer to the home page as of now */}
            <div className="flex flex-row justify-evenly items-center gap-4 mb-6 font-thin">
                <a href="/">
                    <p>Privacy</p>
                </a>
                <a href="/">
                    <p>Terms of Use</p>
                </a>
                <a href="/">
                    <p>Acceptable Use Policy</p>
                </a>
                <a href="/">
                    <p>Software Lifecycle Policy</p>
                </a>
            </div>
        </div>
    </footer>
  )
}

export default Footer