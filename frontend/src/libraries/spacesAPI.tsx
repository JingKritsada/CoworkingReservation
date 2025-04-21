export default async function getSpaces(){
    const response = await fetch("https://coworking-reservation-backend.vercel.app/api/v1/spaces");
    if (!response.ok) {
        throw new Error("Failed to fetch spaces");
    }

    const data = await response.json()

    return data;
}