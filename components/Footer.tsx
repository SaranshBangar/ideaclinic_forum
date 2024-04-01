import Image from "next/image"
import deiLogo from "@/public/DEI.png"
import { FaLinkedin, FaInstagram } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";

const Footer = () => {
  return (
    <footer className="w-[90vw]">
        {/* This first section has the 4 divs with 5 links each, each link refers to the home page as of now */}
        <div className="flex flex-row justify-evenly items-center gap-4">
            <div className="flex flex-col gap-3">
                <h2 className="font-bold text-[1.5rem]">Product</h2>
                <ul className="text-md list-none -ml-[0.0px] flex flex-col gap-[12px]">
                    <a href="/"><li>Mobile Push Notifications</li></a>
                    <a href="/"><li>Web Push Notifications</li></a>
                    <a href="/"><li>Email</li></a>
                    <a href="/"><li>In-App Messaging</li></a>
                    <a href="/"><li>SMS</li></a>
                </ul>
            </div>
            <div className="flex flex-col gap-3">
                <h2 className="font-bold text-[1.5rem]">Resources</h2>
                <ul className="text-md list-none -ml-[0.0px] flex flex-col gap-[12px]">
                    <a href="/"><li>Resource Library</li></a>
                    <a href="/"><li>Customer Case Studies</li></a>
                    <a href="/"><li>Blog</li></a>
                    <a href="/"><li>Notification Preview Tool</li></a>
                    <a href="/"><li>Glossary</li></a>
                </ul>
            </div>
            <div className="flex flex-col gap-3">
                <h2 className="font-bold text-[1.5rem]">Developers</h2>
                <ul className="text-md list-none -ml-[0.0px] flex flex-col gap-[12px]">
                    <a href="/"><li>Documentation</li></a>
                    <a href="/"><li>GitHub</li></a>
                    <a href="/"><li>Code Samples</li></a>
                    <a href="/"><li>Developer Community</li></a>
                    <a href="/"><li>Beta Program</li></a>
                </ul>
            </div>
            <div className="flex flex-col gap-3">
                <h2 className="font-bold text-[1.5rem]">Company</h2>
                <ul className="text-md list-none -ml-[0.0px] flex flex-col gap-[12px]">
                    <a href="/"><li>About Us</li></a>
                    <a href="/"><li>Careers</li></a>
                    <a href="/"><li>Why IdeaClinic</li></a>
                    <a href="/"><li>Partner Program</li></a>
                    <a href="/"><li>Contact Sales</li></a>
                </ul>
            </div>
        </div>
        {/* The division line between the above 4 pillar divs and the image */}
        <div className="h-[1px] w-[96%] bg-slate-100 rounded-full mt-12 mb-6" />
        <div className="flex flex-col justify-center items-center gap-4">
            <div>
                <Image
                    src={deiLogo}
                    alt="DEI Logo"
                    width={100} 
                    height={100} 
                />
            </div>
            {/* I have used lorem epsum as of now since i dont have any quality content to insert here */}
            <div> 
                <p className="text-center">Lorem ipsum dolor sit amet consectetur adipisicing elit <br /> Quae magni autem voluptate eius debitis officia nam provident accusamus?</p>
            </div>
            {/* All of the links refer to the home page as of now */}
            <div className="flex flex-row justify-evenly items-center w-1/2 mt-4 mb-3">
                <a href="/" className="border-2 border-white rounded-full p-2 hover:bg-gray-700 hover:shadow-sm ease-in-out duration-200 transition-all">
                    <FaLinkedin className="w-[30px] h-[30px]" />
                </a>
                <a href="/" className="border-2 border-white rounded-full p-2 hover:bg-gray-700 hover:shadow-sm ease-in-out duration-200 transition-all">
                    <IoMdMail className="w-[30px] h-[30px]" />
                </a>
                <a href="/" className="border-2 border-white rounded-full p-2 hover:bg-gray-700 hover:shadow-sm ease-in-out duration-200 transition-all">
                    <FaInstagram className="w-[30px] h-[30px]" />
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