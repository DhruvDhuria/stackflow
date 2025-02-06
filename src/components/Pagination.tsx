"use client"

import { useSearchParams, usePathname, useRouter } from "next/navigation"
import React from "react"


const Pagination = ({className, total, limit} : {className?: string, total: number, limit: number}) => {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const router = useRouter()

    const page = searchParams.get("page") || "1"
    const totalPages = Math.ceil(total / limit)

    const prev = () => {
        if (page <= "1") return;
        const pageNumber = parseInt(page) 
        const newSearchParams = new URLSearchParams(searchParams)
        newSearchParams.set("page", (pageNumber - 1).toString())
        router.push(`${pathname}?${newSearchParams}`)
    }

    const next =  () => {
        if (page >= totalPages.toString()) return;
        const pageNumber = parseInt(page) 
        const newSearchParams = new URLSearchParams(searchParams)
        newSearchParams.set("page", (pageNumber + 1).toString())
        router.push(`${pathname}?${newSearchParams.toString()}`)
    }

    return (
        <div className="w-1/3 mx-auto flex pt-4 items-center justify-center">
            <button
            onClick={prev}
            disabled={page <= "1"}
            className={`${className} p-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200`}
            >
                Previous
            </button>
            <span>{page} of {totalPages || "1"}</span>
            <button
            onClick={next}
            disabled={page >= totalPages.toString()}
            className={`${className} p-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200`}
            >
                Next
            </button>
        </div>
    )
}

export default Pagination