"use client"

import { useAuthStore } from "@/store/Auth"
import { FloatingNav } from "@/components/ui/floating-navbar"
import { IconHome, IconMessage, IconWorldQuestion } from "@tabler/icons-react"
import slugify from "@/utils/slugify"

export default function Header() {
    const {user} = useAuthStore()

    const navItems = [
        {
            name: "Home",
            link: '/',
            icon: <IconHome className="h-4 w4 text-neutral-500 dark:text-white" />
        },
        {
            name: "Questions",
            link: '/questions',
            icon: <IconWorldQuestion className="h-4 w4 text-neutral-500 dark:text-white" />
        }
    ]

    if (user) 
        navItems.push({
            name: "profile",
            link: `/users/${user.$id}/${slugify(user.name)}`,
            icon: <IconMessage className="h-4 w4 text-neutral-500 dark:text-white" />
        })
    
    return (
        <div className="w-full relative">
            <FloatingNav navItems={navItems} />
        </div>
    )
}