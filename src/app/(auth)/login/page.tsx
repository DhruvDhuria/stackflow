"use client"

import { useAuthStore } from '@/store/Auth'
import React, {useState} from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'


const LabelInputContainer = ({children, className}: {children: React.ReactNode, className?: string}) => {
  return (
    <div className={cn("flex flex-col w-full space-y-2 mb-2", className)}>{children}</div>
  )
}

function LoginPage() {
    const {login} = useAuthStore()
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // collect data
        const formData = new FormData(e.currentTarget)
        const email = formData.get("email")
        const password = formData.get("password")

        // validation
        if(!email || !password) {
            setError(() => "Please provide all the fields")
            return
        }
        // handle loading and error

        setIsLoading(() => true)
        setError(() => "")
        
        // login => store
        const loginResponse = await login(email.toString(), password.toString())
        if (loginResponse.error) {
            setError(() => loginResponse.error!.message) 
        }
        
        setIsLoading(() => false)
    }

  return (
    <div className='bg-slate-900 rounded-xl w-1/4 font-sans border-white border-2 h-[60vh] px-5 py-4 flex flex-col items-center justify-center'>
      <div className='flex flex-col gap-2 items-center mb-4'>
        <h2 className='text-2xl font-bold'>Login</h2>
        <p className='text-sm'>Don't have an account? <a className='underline text-blue-400' href="/register">Register</a></p>
      </div>
      <form   onSubmit={handleSubmit} className=" flex flex-col gap-4">
        <LabelInputContainer>
            <Label htmlFor="email">Email</Label>
            <Input type="email" name="email" id="email" placeholder="Email" />
        </LabelInputContainer>
        <LabelInputContainer>
            <Label htmlFor="password">Password</Label>
            <Input type="password" name="password" id="password" placeholder="Password" />
        </LabelInputContainer>
        <p className="text-red-500">{error}</p>
      <Button type='submit' className=' shrink-0'>{isLoading ? "Logging in..." : "Login"}</Button>
      </form>
    </div>
  )
}

export default LoginPage