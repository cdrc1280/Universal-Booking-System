import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { CalendarCheck, Lock, Mail, ArrowRight, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ThemeToggle } from '@/components/custom/ThemeToggle';
import { ThemeProvider } from '@/context/ThemeContext';

interface Props {
    status?: string;
}

function LoginForm({ status }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login', {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#202124] flex flex-col justify-center items-center px-4 py-12 text-[#202124] dark:text-[#e8eaed] transition-colors selection:bg-emerald-500 selection:text-white relative">
            <Head title="Sign In" />

            {/* Top Right Theme Toggle */}
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>

            <div className="w-full max-w-md space-y-6">
                <div className="flex flex-col items-center text-center space-y-2">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                        <CalendarCheck className="w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-[#202124] dark:text-[#ffffff]">Universal Booking</h1>
                    <p className="text-xs text-[#5f6368] dark:text-[#9aa0a6]">Sign in to access your appointment platform & workspace.</p>
                </div>

                {status && (
                    <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 text-xs">
                        {status}
                    </div>
                )}

                <Card className="border-[#dadce0] dark:border-[#3c4043] bg-white dark:bg-[#303134] shadow-xs">
                    <CardHeader className="space-y-1 pb-4 border-b border-[#dadce0]/60 dark:border-[#3c4043]/60">
                        <CardTitle className="text-base font-semibold text-[#202124] dark:text-[#ffffff]">Staff Authentication</CardTitle>
                        <CardDescription className="text-xs text-[#5f6368] dark:text-[#9aa0a6]">Enter your credentials to access the back-office workspace.</CardDescription>
                    </CardHeader>

                    <form onSubmit={submit}>
                        <CardContent className="space-y-4 pt-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="email" className="text-xs font-medium text-[#202124] dark:text-[#e8eaed] flex items-center gap-2">
                                    <Mail className="w-3.5 h-3.5 text-[#5f6368] dark:text-[#9aa0a6]" />
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    autoComplete="username"
                                    autoFocus
                                    placeholder="admin@example.com"
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="text-xs"
                                    required
                                />
                                {errors.email && (
                                    <p className="text-xs text-rose-500 flex items-center gap-1 mt-1">
                                        <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                                        <span>{errors.email}</span>
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-xs font-medium text-[#202124] dark:text-[#e8eaed] flex items-center gap-2">
                                        <Lock className="w-3.5 h-3.5 text-[#5f6368] dark:text-[#9aa0a6]" />
                                        Password
                                    </Label>
                                    <Link
                                        href="/forgot-password"
                                        className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline transition-colors"
                                    >
                                        Forgot key?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    autoComplete="current-password"
                                    placeholder="••••••••••••"
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="text-xs"
                                    required
                                />
                                {errors.password && (
                                    <p className="text-xs text-rose-500 flex items-center gap-1 mt-1">
                                        <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                                        <span>{errors.password}</span>
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center space-x-2 pt-1">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="h-4 w-4 rounded border-[#dadce0] dark:border-[#3c4043] bg-white dark:bg-[#202124] text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                />
                                <label htmlFor="remember" className="text-xs text-[#5f6368] dark:text-[#9aa0a6] cursor-pointer select-none">
                                    Remember session on this device
                                </label>
                            </div>
                        </CardContent>

                        <CardFooter className="flex flex-col gap-3 pt-2">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-all shadow-xs cursor-pointer"
                            >
                                {processing ? (
                                    'Verifying credentials...'
                                ) : (
                                    <>
                                        Sign In to Workspace
                                        <ArrowRight className="w-4 h-4 ml-1.5" />
                                    </>
                                )}
                            </Button>

                            <p className="text-[11px] text-center text-[#5f6368] dark:text-[#9aa0a6] mt-1 font-mono">
                                Universal Booking System • Secure Authentication
                            </p>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
}

export default function Login(props: Props) {
    return (
        <ThemeProvider>
            <LoginForm {...props} />
        </ThemeProvider>
    );
}
