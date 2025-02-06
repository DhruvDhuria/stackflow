"use client"

import { useSearchParams, usePathname, useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import React, {useEffect, useState} from "react"

export default function Search() {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const router = useRouter()

    const [search , setSearch] = useState(searchParams.get("search") || "")

    useEffect(() => {
        setSearch(() => searchParams.get("search") || "")
    }, [searchParams])
    

 
    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const newSearchParams = new URLSearchParams(searchParams)
        newSearchParams.set("search", search)
        router.push(`${pathname}?${newSearchParams}`)
    }

    return (
      <form className="flex w-full flex-row gap-4" onSubmit={handleSearch}>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="Search questions"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Search
        </button>
      </form>
    );
}
