import NewLocationClient from "@/component/new-trip-loc";

export default async function NewLocation({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <NewLocationClient tripID={id} />;
}