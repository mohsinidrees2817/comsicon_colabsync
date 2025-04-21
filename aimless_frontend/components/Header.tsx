'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { EnvVarWarning } from '@/components/env-var-warning';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { hasEnvVars } from '@/utils/supabase/check-env-vars';
import { useGlobalContext } from '@/context/Globalcontext';
import { signOutAction } from '@/app/actions';

const navigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Projects', href: '/projects' },
    { name: 'Tasks', href: '/tasks' },
    { name: 'Team Chat', href: '/chat' },
];

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { userdetails } = useGlobalContext();
    const router = useRouter();

    const handleNavigate = () => {
        console.log('User details:', userdetails);
        if (userdetails?.username) {
            const role = userdetails?.role?.toLowerCase().includes('manager') ? 'manager' : 'user';
            router.push(`/${role}/dashboard`);
        } else {
            router.push('/sign-in');
        }
    };

    return (
        <div className="bg-white max-w-[1400px] mx-auto">
            <header className="absolute inset-x-0 top-0 z-50 max-w-[1400px] mx-auto">
                <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
                    {/* Left Logo */}
                    <div className="flex lg:flex-1">
                        <Link href="/" className="-m-1.5 p-1.5 font-bold text-xl text-indigo-600">
                            CollabSync
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="flex lg:hidden">
                        <button
                            type="button"
                            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon className="size-6" aria-hidden="true" />
                        </button>
                    </div>

                    {/* Desktop Nav */}
                    {/* <div className="hidden lg:flex lg:gap-x-12">
                        {navigation.map((item) => (
                            <Link key={item.name} href={item.href} className="text-sm font-semibold text-gray-900">
                                {item.name}
                            </Link>
                        ))}
                    </div> */}

                    {/* User Actions */}
                    <div className="hidden lg:flex items-center gap-4">
                        <ThemeSwitcher />

                        {userdetails ? (
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-600">Hi, {userdetails.username}</span>
                                <button
                                    onClick={handleNavigate}
                                    className="text-sm bg-black hover:bg-black/70 text-white px-3 py-2 rounded"
                                >
                                    Go to Dashboard
                                </button>
                                <button
                                    onClick={async () => await signOutAction()}
                                    className="text-sm bg-transparent text-black hover:bg-black hover:text-white border border-black px-3 py-2 rounded cursor-pointer"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            !hasEnvVars && <EnvVarWarning />
                        )}
                    </div>
                </nav>

                {/* Mobile Menu */}
                <Dialog as="div" open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
                    <div className="fixed inset-0 z-50" />
                    <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                        <div className="flex items-center justify-between">
                            <Link href="/" className="-m-1.5 p-1.5 font-bold text-indigo-600 text-lg">
                                CollabSync
                            </Link>
                            <button
                                type="button"
                                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <span className="sr-only">Close menu</span>
                                <XMarkIcon className="size-6" aria-hidden="true" />
                            </button>
                        </div>

                        <div className="mt-6 flow-root">
                            <div className="-my-6 divide-y divide-gray-500/10">
                                <div className="space-y-2 py-6">
                                    {navigation.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>

                                <div className="pt-6 flex flex-col gap-4">
                                    <ThemeSwitcher />
                                    {userdetails ? (
                                        <>
                                            <span className="text-sm">Hi, {userdetails.username}</span>
                                            <button
                                                onClick={handleNavigate}
                                                className="text-sm bg-indigo-600 text-white px-3 py-2 rounded"
                                            >
                                                Go to Dashboard
                                            </button>
                                            <button
                                                onClick={async () => await signOutAction()}
                                                className="text-sm bg-red-500 text-white px-3 py-2 rounded"
                                            >
                                                Logout
                                            </button>
                                        </>
                                    ) : (
                                        <Link href="/sign-in" className="text-sm font-semibold text-indigo-600">
                                            Sign In
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </DialogPanel>
                </Dialog>
            </header>
        </div>
    );
}
