import { PinContainer } from '@/components/ui/3d-pin'
import Image from 'next/image'

export default function Page() {
  return (
    <main className="w-screen h-full bg-black">
      <div className="w-full h-24 bg-black bg-dot-white/[0.2] z-9"></div>
      <div className="w-full h-full bg-black bg-dot-white/[0.2] relative flex items-center justify-center">
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black  [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <section className="grid grid-cols-3 gap-24 gap-y-32 mt-12 my-12 justify-start items-start">
          <PinContainer
            title="/Shantanu-Patil"
            href="https://www.linkedin.com/in/shantanu-patil-2355122/"
            className='pb-16'
          >
            <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[20rem] h-[20rem]">
              <h3 className="max-w-xs !pb-2 !m-0 font-bold  text-base text-slate-100">
                Dr. Shantanu Patil
              </h3>
              <div className="text-base !m-0 !p-0 font-normal">
                <span className="text-slate-500 ">
                  Associate Director, DEI. Convener of Idea Clinic.
                </span>
              </div>
              <Image
                src="/shantanu.jpeg"
                width={100}
                height={100}
                alt="Dr. Shantanu Patil"
                className="w-full h-full mt-4 rounded-lg pb-4 object-cover"
                unoptimized
                priority
              />
            </div>
          </PinContainer>
          <PinContainer
            title="/Suvan-GS"
            href="https://www.linkedin.com/in/suvan-gowri-shanker-596943261/"
            className='pb-16'
          >
            <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[20rem] h-[20rem] ">
              <h3 className="max-w-xs !pb-2 !m-0 font-bold  text-base text-slate-100">
                Suvan GS
              </h3>
              <div className="text-base !m-0 !p-0 font-normal">
                <span className="text-slate-500 ">Lead Developer</span>
              </div>
              <Image
                src="/Suvan.jpg"
                width={100}
                height={100}
                alt="Suvan GS"
                className="w-full h-full mt-4 rounded-lg pb-4 object-cover"
                unoptimized
                priority
              />
            </div>
          </PinContainer>
          <PinContainer
            title="/Saransh-Bangar"
            href="https://www.linkedin.com/in/saransh-bangar/"
            className='pb-16'
          >
            <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[20rem] h-[20rem] ">
              <h3 className="max-w-xs !pb-2 !m-0 font-bold  text-base text-slate-100">
                Saransh Bangar
              </h3>
              <div className="text-base !m-0 !p-0 font-normal">
                <span className="text-slate-500 ">Frontend Developer</span>
              </div>
              <Image
                src="/Saransh.jpg"
                width={100}
                height={100}
                alt="Saransh Bangar"
                className="w-full h-full mt-4 rounded-lg pb-4 object-cover"
                unoptimized
                priority
              />
            </div>
          </PinContainer>
          <PinContainer
            title="/Vijay-Makkad"
            href="https://www.linkedin.com/in/vijay-makkad-1573681b3/"
            className='pb-16'
          >
            <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[20rem] h-[20rem] ">
              <h3 className="max-w-xs !pb-2 !m-0 font-bold  text-base text-slate-100">
                Vijay Makkad
              </h3>
              <div className="text-base !m-0 !p-0 font-normal">
                <span className="text-slate-500 ">Frontend Developer</span>
              </div>
              <Image
                src="/Vijay.jpg"
                width={100}
                height={100}
                alt="Vijay Makkad"
                className="w-full h-full mt-4 rounded-lg pb-4 object-cover"
                unoptimized
                priority
              />
            </div>
          </PinContainer>
          <PinContainer
            title="/Ansh-Singh"
            href="https://www.linkedin.com/in/ansh-singh-484215253/"
            className='pb-16'
          >
            <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[20rem] h-[20rem] ">
              <h3 className="max-w-xs !pb-2 !m-0 font-bold  text-base text-slate-100">
                Ansh Singh
              </h3>
              <div className="text-base !m-0 !p-0 font-normal">
                <span className="text-slate-500 ">Backend Developer</span>
              </div>
              <Image
                src="/Ansh.jpg"
                width={100}
                height={100}
                alt="Ansh Singh"
                className="w-full h-full mt-4 rounded-lg pb-4 object-cover"
                unoptimized
                priority
              />
            </div>
          </PinContainer>
          <PinContainer
            title="/Anay-Purohit"
            href="https://www.linkedin.com/in/anayapurohit/"
            className='pb-16'
          >
            <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[20rem] h-[20rem] ">
              <h3 className="max-w-xs !pb-2 !m-0 font-bold  text-base text-slate-100">
                Anay Purohit
              </h3>
              <div className="text-base !m-0 !p-0 font-normal">
                <span className="text-slate-500 ">Backend Developer</span>
              </div>
              <Image
                src="/Anay.jpg"
                width={100}
                height={100}
                alt="Ansh Singh"
                className="w-full h-full mt-4 rounded-lg pb-4 object-cover"
                unoptimized
                priority
              />
            </div>
          </PinContainer>
        </section>
      </div>
        <div className='mt-[50px] h-1 w-full'></div>
    </main>
  )
}
