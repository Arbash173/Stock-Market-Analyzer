
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hammer } from "lucide-react";

export default function PlaceholderPage({ title }: { title: string }) {
    return (
        <div className="flex h-[50vh] flex-col items-center justify-center space-y-4 text-center">
            <div className="rounded-full bg-muted p-4">
                <Hammer className="h-10 w-10 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-muted-foreground max-w-md">
                This feature is being migrated from the legacy system.
                It will be available in the next update.
            </p>
        </div>
    );
}
