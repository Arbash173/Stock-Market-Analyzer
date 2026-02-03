
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock Data for now
const newsItems = [
    {
        id: 1,
        title: "KSE-100 index gains 500 points in early trade",
        source: "Dawn News",
        time: "2 hours ago",
        snippet: "The benchmark KSE-100 index gained over 500 points on Monday as investor confidence returned..."
    },
    {
        id: 2,
        title: "Oil prices surge amid global tensions",
        source: "Reuters",
        time: "4 hours ago",
        snippet: "Global oil prices rose significantly today, impacting energy stocks in the local market..."
    },
    {
        id: 3,
        title: "Tech sector shows resilience despite market volatility",
        source: "Business Recorder",
        time: "6 hours ago",
        snippet: "Systems Limited and other tech giants maintained steady growth figures this quarter..."
    },
    {
        id: 4,
        title: "State Bank expected to maintain policy rate",
        source: "Geo News",
        time: "Yesterday",
        snippet: "Analysts predict the central bank will keep interest rates unchanged in the upcoming meeting..."
    },
    {
        id: 5,
        title: "Cement sector exports rise by 15%",
        source: "The News",
        time: "Yesterday",
        snippet: "Cement manufacturers reported a healthy increase in exports due to declining coal prices..."
    }
];

export function NewsWidget() {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Market News</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <ScrollArea className="h-[400px] md:h-[calc(100vh-200px)]">
                    <div className="divide-y">
                        {newsItems.map((item) => (
                            <div key={item.id} className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="text-sm font-semibold leading-tight">{item.title}</h4>
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{item.snippet}</p>
                                <div className="flex justify-between items-center text-[10px] text-muted-foreground uppercase tracking-wider">
                                    <span>{item.source}</span>
                                    <span>{item.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
