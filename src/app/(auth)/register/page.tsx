"use client"

import { useAuthStore } from "@/store/Auth";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const LabelInputContainer = ({children, className}: {children: React.ReactNode, className?: string}) => {
  return (
    <div className={cn("flex flex-col w-full space-y-1 mb-2", className)}>{children}</div>
  )
}

function RegisterPage() {
  const { createAccount, login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // collect data

    const formData = new FormData(e.currentTarget);
    const firstname = formData.get("firstname");
    const lastname = formData.get("lastname");
    const email = formData.get("email");
    const password = formData.get("password");

    // validate

    if (!firstname || !lastname || !email || !password) {
      console.log(firstname, lastname, email, password)
        setError(() => "Please fill out all the fields")
        return
    }

    // call the store
    setIsLoading(true)
    setError(() => "")

    const response = await createAccount(
        `${firstname} ${lastname}`,
        email.toString().trim(),
        password.toString()
    )

    if (response.error) {
       
        setError(() => response.error!.message
      )
    } else {
        const loginResponse = await login(email.toString(), password.toString())
        if (loginResponse.error) {
            setError(() => loginResponse.error!.message)
        }else {
          router.push(`/questions`)
        }
    }
    setIsLoading(() => false)
  };

  return (
    <div className=" flex flex-col items-center rounded-xl justify-center border-2 mt-32 mb-16 border-white h-[90vh] py-3 m-auto justify-self-center max-w-screen-sm sm:w-1/2 bg-slate-900 xl:w-1/3 xl:h-[70vh]">
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
        Welcome to Stackflow
      </h2>
      <p className="mt-2 mx-auto text-center text-sm text-neutral-600 dark:text-neutral-300">
        Signup with stackflow if you you don&apos;t have an account.
        <br /> If you already have an account,{" "}
        <Link href="/login" className="text-orange-500 hover:underline">
          login
        </Link>{" "}
        to riverflow
      </p>

      {error && <p className="text-red-500">{error}</p>}

      <form className="p-4 flex flex-col sm:space-y-1" onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row sm:gap-1 ">
          <LabelInputContainer>
            <Label htmlFor="firstname">First Name</Label>
            <Input type="text" placeholder="Ramesh" name="firstname" id="firstname" />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="lastname">Lastname Name</Label>
            <Input type="text" placeholder="Dubey" name="lastname" id="lastname" />
          </LabelInputContainer>
        </div>
        <LabelInputContainer>
          <Label htmlFor="email">Email</Label>
          <Input type="text" placeholder="sample@gmail.com" name="email" id="email" />
        </LabelInputContainer>
        <LabelInputContainer>
          <Label htmlFor="password">Password</Label>
          <Input type="password" placeholder="......" name="password" id="password" />
        </LabelInputContainer>
        <Button type="submit" className=" font-semibold mt-2">{isLoading ? "Signing up" : "Sign up"}</Button>
      </form>
    </div>
  );
}

export default RegisterPage;
