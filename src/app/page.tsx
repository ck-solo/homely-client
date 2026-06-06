"use client";

import { HouseSimpleIcon } from '@phosphor-icons/react'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5">
      <HouseSimpleIcon size={50} />
      <h1 className="text-5xl">Welcome to the Homely.</h1>
    </main>
  ) 
}
