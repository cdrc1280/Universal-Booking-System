import { Head } from '@inertiajs/react';
import { Calendar, ShieldCheck, Cpu } from 'lucide-react';

export default function Welcome() {
    return (
        <>
            <Head title="Welcome" />
            <main className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-6">
                <div className="max-w-2xl w-full border border-zinc-800 bg-zinc-900/60 rounded-xl p-8 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold text-zinc-100">Universal Booking System</h1>
                            <p className="text-sm text-zinc-400">DDD Architecture • React 19 • Inertia.js • PostgreSQL</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/40 space-y-1">
                            <div className="flex items-center gap-2 text-zinc-200 text-sm font-medium">
                                <Cpu className="w-4 h-4 text-blue-400" />
                                Runtime Stack
                            </div>
                            <p className="text-xs text-zinc-400">Vite + React 19 + Tailwind v4 + Wayfinder actions.</p>
                        </div>

                        <div className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/40 space-y-1">
                            <div className="flex items-center gap-2 text-zinc-200 text-sm font-medium">
                                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                Security & RBAC
                            </div>
                            <p className="text-xs text-zinc-400">Fortify headless authentication + Spatie Permissions.</p>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}