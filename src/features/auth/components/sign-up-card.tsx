import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { signupSchema } from '../schemas';
import { useRegister } from '../api/use-register';

/**
 * JC-2: SignUpCard component.
 */

export const SignUpCard = () => {
    const { mutate } = useRegister();
    
    const form = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            name: '',
            email: '',
            password: ''
        }
    });
    
    const onSubmit = (values: z.infer<typeof signupSchema>) => {
        mutate({ json: values });
    };
    
    return (
        <Card className="w-full h-full md:w-[487px] border-none shadow-none">
            <CardHeader className="flex flex-col items-center justify-center text-center p-7">
                <CardTitle className="text-2xl">Sign up</CardTitle>
                
                <CardDescription>
                    By signing up, you are agree to our{" "}
                    <Link href="/privacy">
                        <span className="text-blue-700">Privacy Policy</span>
                    </Link>{" "}
                    and{" "}
                    <Link href="/terms">
                        <span className="text-blue-700">Terms of Service</span>
                    </Link>
                </CardDescription>
            </CardHeader>
            
            <div className="px-7">
                <DottedSeparator />
            </div>
            
            <CardContent className="p-7">
                <Form {...form}>
                    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField name="name" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input type="text" placeholder="Enter your name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        
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
                        
                        <Button className="w-full" size="lg" disabled={false}>Sign Up</Button>
                    </form>
                </Form>
            </CardContent>
            
            <div className="px-7">
                <DottedSeparator />
            </div>
            
            <CardContent className="p-7 flex flex-col gap-y-4">
                <Button className="w-full" size="lg" variant="secondary" disabled={false}>
                    <FcGoogle className="mr-2 size-5" />Login with Google
                </Button>
                <Button className="w-full" size="lg" variant="secondary" disabled={false}>
                    <FaGithub className="mr-2 size-5" />Login with Github
                </Button>
            </CardContent>
            
            <div className="px-7">
                <DottedSeparator />
            </div>
            
            <CardContent className="p-7 flex items-center justify-center">
                <p>
                    Already have an account?{" "}
                    <Link href="/sign-in">
                        <span className="text-blue-700">Sign In</span>
                    </Link>
                </p>
            </CardContent>
        </Card>
    );
};