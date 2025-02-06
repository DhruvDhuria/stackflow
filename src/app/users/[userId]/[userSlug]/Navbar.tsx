"use client"

import React from "react"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"

const Navbar = () => {
    const pathname = usePathname()
    const {userId, userSlug} = useParams()

    const navItems = [
        {
            name: "Summary",
            href: `/users/${userId}/${userSlug}`
        },
        {
            name: "Questions",
            href: `/users/${userId}/${userSlug}/questions`
        },
        {
            name: "Answers",
            href: `/users/${userId}/${userSlug}/answers`
        },
        {
            name: "Votes",
            href: `/users/${userId}/${userSlug}/votes`
        }
    ]

    return (
      <ul className="flex w-full shrink-0 gap-1 overflow-auto sm:w-40 sm:flex-col mr-1">
        {navItems.map(item => (
          <li
            key={item.name}
            className={
              pathname === item.href ? "bg-white/20 rounded-md" : "hover:bg-white/20 rounded-md"
            }
          >
            <Link href={item.href}>{item.name}</Link>
          </li>
        ))}
      </ul>
    ); 
}

export default Navbar