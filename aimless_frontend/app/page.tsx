'use client';

import { useEffect } from 'react';
import Hero from "@/components/hero";
import { useGlobalContext } from '@/context/Globalcontext';

export default function Home() {
  const { userdetails, theme, toggleTheme } = useGlobalContext();
  console.log(userdetails, "cfafcsfeverv")


  useEffect(() => {

    // if needed, you can perform async actions here
  }, []);

  return (
    <>
      <Hero />
      <main className="flex-1 flex flex-col gap-6 px-4">
        {/* <p>Welcome, {userdetails?.username ?? 'Guest'}!</p>

        <h2 className="font-medium text-xl mb-4">Next steps</h2>

        {hasEnvVars ? <SignUpUserSteps /> : <ConnectSupabaseSteps />} */}
      </main>
    </>
  );
}
