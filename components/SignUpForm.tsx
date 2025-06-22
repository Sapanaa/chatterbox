'use client'

import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { z } from 'zod'
import { authClient } from '@/lib/auth-client'

const userSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  name: z.string().min(1, { message: 'Name is required' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
})

type UserFormValues = z.infer<typeof userSchema>

const SignUpForm = () => {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: '',
      name: '',
      password: '',
    },
  })

  function onSubmit(values: UserFormValues) {
    authClient.signUp.email({
      email: values.email,
      password: values.password,
      name: values.name,
    })
    console.log(values)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br px-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-8 space-y-6 ">
        <h2 className="text-2xl font-semibold text-center text-zinc-800 dark:text-white flex flex-col">
          <span className="text-indigo-500 dark:text-indigo-400 text-3xl p-4">ChatterBox</span>
          Create Your Account
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-700 dark:text-zinc-200">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="you@example.com"
                      {...field}
                      className="bg-zinc-100 dark:bg-zinc-800"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-700 dark:text-zinc-200">Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      {...field}
                      className="bg-zinc-100 dark:bg-zinc-800"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-700 dark:text-zinc-200">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...field}
                      className="bg-zinc-100 dark:bg-zinc-800"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Sign Up
            </Button>
          </form>
        </Form>

        <p className="text-sm text-center text-zinc-500 dark:text-zinc-400">
          Already have an account? <span className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">Log in</span>
        </p>
      </div>
    </div>
  )
}

export default SignUpForm
