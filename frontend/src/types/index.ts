
export interface MarketSummaryItem {
    SCRIP: string;
    LDCP: number;
    OPEN: number;
    HIGH: number;
    LOW: number;
    CURRENT: number;
    CHANGE: number | string; // Sometimes empty string in API response
    VOLUME: number;
}

export interface ApiResponse<T> {
    status: 'success' | 'error';
    data: T;
    message?: string;
}

export interface TopCompany {
    SCRIP: string;
    LDCP: number;
    OPEN: number;
    HIGH: number;
    LOW: number;
    CURRENT: number;
    CHANGE: number;
    VOLUME: number;
}
