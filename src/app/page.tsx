import Image from "next/image";
import Link from "next/link";
import { WavyBackground } from "@/components/ui/wavy-backgrounds";

export default function Home() {
  return (
    <div className="w-full items-center justify-items-center min-h-screen p-8   sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <WavyBackground className="mx-auto">
        <main className="flex flex-col gap-4 justify-center md:items-center mt-16 items-center text-center sm:items-start">
          <h1 className="font-bold text-lg sm:text-3xl mx-auto">Stackflow</h1>
          <p className="text-md mx-auto text-gray-200">Ask questions, find solutions</p>
          <small>A QnA app inspired from Stack Overflow where you can ask your doubts and share your knowledge.</small>
          <div className="flex gap-4 mx-auto">
            <Link
              href={"/register"}
              className="px-4 py-2 bg-white text-black border border-white hover:border-white hover:bg-transparent hover:border hover:text-white rounded-full"
            >
              Signup
            </Link>
            <Link
              href={"/login"}
              className="px-4 py-2 border-white border hover:bg-white hover:text-black rounded-full"
            >
              Login
            </Link>
          </div>
        </main>
      </WavyBackground>
      
    </div>
  );
}
