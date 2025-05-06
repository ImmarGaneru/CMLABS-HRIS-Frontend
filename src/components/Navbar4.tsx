'use client';

import Image from "next/image"

export function Navbar4({ children }: { children?: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Navbar */}
            <nav className="h-16 fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/70 shadow-sm border-b px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Image
                        src="/Logo.svg"
                        alt="HRIS Logo"
                        width={40}
                        height={40}
                        className="w-20"
                    />
                </div>
            </nav>

            {/* Konten utama */}
            <main className="flex-1 flex items-center justify-center px-4">
                {children}
            </main>

            {/* Footer */}
            <footer className="absolute bottom-0 left-0 w-full flex flex-col items-center justify-center text-xs text-[#7CA5BF] pb-4">
                <Image
                    src="/Logo.svg"
                    alt="HRIS Logo"
                    width={60}
                    height={60}
                    className="w-18 h-16"
                />
                <p className="-mt-2">2025 HRIS. All rights reserved.</p>
                <div className="flex gap-1 items-center mt-1">
                    <span>Contact Us</span>
                    <span>📞</span>
                    <span>+62 864 2086 4208</span>
                </div>
            </footer>
        </div>
    )
}