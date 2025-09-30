import { auth } from "@/auth";
import { Button } from "@/component/ui/button";

export default async function TripsPage() {
    const session = await auth();
    if (!session) {
        return (
            <div className="flex justify-center items-center h-screen text-gray-700 text xl">
                Please Sign in
            </div>

        )
    }
    return (
        <div className="space-y-6 container mx-auto px-4 py-8">
            <div className="flex shadow-blue-900 shadow-lg rounded-xl h-screen justify-between p-2">
                <h1 className="text-xl font-bold">Dashboard</h1>
                <Button>New Trip</Button>
            </div>
        </div>
    )

}