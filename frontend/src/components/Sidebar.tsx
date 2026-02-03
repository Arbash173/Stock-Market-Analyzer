
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    LineChart,
    PieChart,
    History,
    CandlestickChart,
    TrendingUp,
    Settings,
    Info,
    Menu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navItems = [
    { name: "Market Summary", href: "/", icon: LayoutDashboard },
    { name: "Market Charts", href: "/market-charts", icon: LineChart },
    { name: "Bullet Charts", href: "/bullet-charts", icon: TrendingUp },
    { name: "Pie Charts", href: "/pie-charts", icon: PieChart },
    { name: "Top 10 Comp.", href: "/top-companies", icon: TrendingUp },
    { name: "Historic Data", href: "/historic-data", icon: History },
    { name: "Candle Chart", href: "/candle-chart", icon: CandlestickChart },
    { name: "Predictions", href: "/predictions", icon: TrendingUp },
    { name: "About Us", href: "/about", icon: Info },
];

export function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className={cn("flex flex-col border-r bg-background transition-all duration-300", collapsed ? "w-16" : "w-64")}>
            <div className="flex h-14 items-center border-b px-4 transition-all">
                <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="mr-2">
                    <Menu className="h-4 w-4" />
                </Button>
                {!collapsed && <span className="font-bold truncate">StockAnalyzer</span>}
            </div>
            <div className="flex-1 overflow-auto py-2">
                <nav className="grid gap-1 px-2">
                    {navItems.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={index}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted",
                                    pathname === item.href && "bg-muted text-primary font-medium",
                                    collapsed && "justify-center"
                                )}
                                title={collapsed ? item.name : undefined}
                            >
                                <Icon className="h-4 w-4" />
                                {!collapsed && <span>{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>
            </div>
            <div className="border-t p-2">
                <Link
                    href="/profile"
                    className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted",
                        pathname === "/profile" && "bg-muted text-primary font-medium",
                        collapsed && "justify-center"
                    )}
                >
                    <Settings className="h-4 w-4" />
                    {!collapsed && <span>Settings</span>}
                </Link>
            </div>
        </div>
    );
}
