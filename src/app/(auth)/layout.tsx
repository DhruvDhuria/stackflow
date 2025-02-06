"use client"

import { useAuthStore } from "@/store/Auth"
import { useRouter } from "next/navigation"
import React, {useEffect} from "react"

const Layout = ({children}: {children: React.ReactNode}) => {
    const {session} = useAuthStore()
    const router = useRouter()

    useEffect(() => {
        if (session) {
            router.push("/")
        }
    }, [session, router])

    if (session) {
        return null
    }

    return (
      <div className=" min-h-screen w-full">
        <div className="flex shrink-0 min-h-screen w-full bg-slate-900 items-center justify-center">
          {children}
        </div>
      </div>
    );
}

export default Layout