import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "./Navbar";
import AuthButton from "@/components/AuthButton";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "IdeaClinic SRMIST",
  description: "The Ultimate Discussion Forum for SRMIST faculty and students",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" >
      <body className={GeistSans.className}>
          <Navbar>
            <AuthButton />
          </Navbar>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
