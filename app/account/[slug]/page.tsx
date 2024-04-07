'use client'
import { LayoutGridDemo } from "@/components/LayoutGridDemo";
import { useParams } from "next/navigation";


export default function Page() {
    const { slug } = useParams();
    const userId = slug; // Fix: Remove unnecessary type annotation
    return (
        <section className="bg-[#090909]">
            <LayoutGridDemo userId={userId} />
        </section>
    )
}