
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export function Navbar() {
    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center px-4 max-w-screen-2xl mx-auto">
                <Link href="/" className="mr-6 flex items-center space-x-2">
                    <span className="hidden font-bold sm:inline-block">StockAnalyzer</span>
                </Link>
                <div className="flex flex-1 items-center space-x-2 justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        {/* Search can go here later */}
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search stocks..." className="pl-8 w-full md:w-[300px]" />
                        </div>
                    </div>
                    <nav className="flex items-center space-x-2">
                        <Link href="/login">
                            <Button variant="ghost" size="sm">Login</Button>
                        </Link>
                        <Link href="/register">
                            <Button size="sm">Get Started</Button>
                        </Link>
                    </nav>
                </div>
            </div>
        </nav>
    );
}
