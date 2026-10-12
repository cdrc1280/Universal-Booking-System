import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { CalendarCheck, Lock, Mail, ArrowRight, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

interface Props {
    status?: string;
}

export default function Login({ status }: Props) {
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
        <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center px-4 py-12 text-zinc-100 selection:bg-emerald-500 selection:text-white">
            <Head title="Sign In — Slotwise" />

            <div className="w-full max-w-md space-y-6">
                <div className="flex flex-col items-center text-center space-y-2">
                    <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-inner">
                        <CalendarCheck className="w-6 h-6 text-emerald-400" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">Slotwise Command Center</h1>
                    <p className="text-sm text-zinc-400">Sign in to manage schedules, appointments, and client records.</p>
                </div>

                {status && (
                    <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 text-sm">
                        {status}
                    </div>
                )}

                <Card className="border-zinc-800/80 bg-zinc-900/60 backdrop-blur-xl">
                    <CardHeader className="space-y-1 pb-4">
                        <CardTitle className="text-lg">Staff Authentication</CardTitle>
                        <CardDescription>Enter your credentials to access the back-office workspace.</CardDescription>
                    </CardHeader>

                    <form onSubmit={submit}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="flex items-center gap-2">
                                    <Mail className="w-3.5 h-3.5 text-zinc-400" />
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    autoComplete="username"
                                    autoFocus
                                    placeholder="doctor@example.com"
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="bg-zinc-950/70 border-zinc-800"
                                />
                                {errors.email && (
                                    <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
                                        <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="flex items-center gap-2">
                                        <Lock className="w-3.5 h-3.5 text-zinc-400" />
                                        Password
                                    </Label>
                                    <Link
                                        href="/forgot-password"
                                        className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
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
                                    className="bg-zinc-950/70 border-zinc-800"
                                />
                                {errors.password && (
                                    <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
                                        <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                                        {errors.password}
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
                                    className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-emerald-400 focus:ring-offset-zinc-950 cursor-pointer"
                                />
                                <label htmlFor="remember" className="text-xs text-zinc-400 cursor-pointer select-none">
                                    Remember session on this device
                                </label>
                            </div>
                        </CardContent>

                        <CardFooter className="flex flex-col gap-3 pt-2">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-medium transition-all shadow-md"
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

                            <p className="text-xs text-center text-zinc-500 mt-2">
                                Single-tenant instance locked via Ed25519 signature.
                            </p>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
}
