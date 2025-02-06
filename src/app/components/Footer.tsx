"use client"

import { link } from "fs"
import Link from "next/link"
import React from "react"

const Footer = () => {
    const items = [
        {
            title: "Home",
            link: "/"
        },
        {
            title: "Questions",
            link: "/questions"
        },
        {
            title: "Privacy Policy",
            link: "/"
        },
        {
            title: "Terms & Conditions",
            link: "/"
        },
        {
            title: "About",
            link: "/"
        }
    ]

    return (
        <footer className="relative border-t bg-black border-gray-200 py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <ul className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
                    {items.map(item => (
                        <li key={item.title}>
                            <Link href={item.link}>{item.title}</Link>
                        </li>
                    ))}
                </ul>
            </div>
        </footer>
    )
}

export default Footer