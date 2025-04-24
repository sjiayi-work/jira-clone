'use client';

import Link from 'next/link';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { signUpWithGithub, signUpWithGoogle } from '@/lib/oauth';

import { useLogin } from '../api/use-login';
import { loginSchema } from '../schemas';

/**
 * JC-2: SignInCard component.
 * 
 * @example <SignInCard />
 */

export const SignInCard = () => {
    const { mutate, isPending } = useLogin();
    
    const form = useForm<z.infer<typeof loginSchema>>({
        defaultValues: {
            email: '',
            password: ''
        },
        resolver: zodResolver(loginSchema)
    });
    
    const onSubmit = (values: z.infer<typeof loginSchema>) => {
        mutate({ json: values });
    };
    
    return (
        <Card className="w-full h-full md:w-[487px] border-none shadow-none">
            <CardHeader className="flex items-center justify-center text-center p-7">
                <CardTitle className="text-2xl">Welcome back!</CardTitle>
            </CardHeader>
            
            <div className="px-7">
                <DottedSeparator />
            </div>
            
            <CardContent className="p-7">
                <Form {...form}>
                    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField name="email" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input type="email" placeholder="Enter email address" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        
                        <FormField name="password" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input type="password" placeholder="Enter password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        
                        <Button className="w-full" size="lg" disabled={isPending}>Login</Button>
                    </form>
                </Form>
            </CardContent>
            
            <div className="px-7">
                <DottedSeparator />
            </div>
            
            <CardContent className="p-7 flex flex-col gap-y-4">
                <Button className="w-full" size="lg" variant="secondary" disabled={isPending} onClick={signUpWithGoogle}>
                    <FcGoogle className="mr-2 size-5" />Login with Google
                </Button>
                <Button className="w-full" size="lg" variant="secondary" disabled={isPending} onClick={signUpWithGithub}>
                    <FaGithub className="mr-2 size-5" />Login with Github
                </Button>
            </CardContent>
            
            <div className="px-7">
                <DottedSeparator />
            </div>
            
            <CardContent className="p-7 flex items-center justify-center">
                <p>
                    Don&apos;t have an account?{" "}
                    <Link href="/sign-up">
                        <span className="text-blue-700">Sign Up</span>
                    </Link>
                </p>
            </CardContent>
        </Card>
    );
};