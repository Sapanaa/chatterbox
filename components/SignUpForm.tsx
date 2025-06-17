'use client'

import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {z} from "zod"
import { authClient } from "@/lib/auth-client"; 

const userSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  password: z.string()
})

type UserFormValues = z.infer<typeof userSchema>

const SignUpForm = () => {

     const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: '',
      name: '',
      password: "",
    },
  })

 function onSubmit(values: UserFormValues) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    authClient.signUp.email({ email: values.email, password: values.password, name: values.name, } )
    
    console.log(values)
  }
  return (
    <div>
      SignUpForm
       <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
         <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

      
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
               <Input type="password" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" >Submit</Button>
      </form>
    </Form>
    </div>
  )
}

export default SignUpForm
