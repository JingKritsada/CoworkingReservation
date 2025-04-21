interface SpaceItem {
    space_id: number;
    name: string;
    address: string;
    telephone: string;
    open_time: string;
    close_time: string;
}

interface SpacesResponse {
    success: boolean;
    count: number;
    data: SpaceItem[];
}