import { apiClient, ApiResponse } from "@/utils/apiClient";
import { BASE_URL, ENDPOINTS } from "@/_lib/apiEndpoints";
import { Event, Participant } from "@/types/events";
import EventDetailsClient from "./EventDetailsClient";

export default async function EventDetailsPage({ params }: any) {
  const res: ApiResponse<Event[]> = await apiClient(
    `${BASE_URL}${ENDPOINTS.EVENTS.BASE}/${params.id}`
  );

  if (!res.ok || !res.data || res.data.length === 0) {
    return <div>Event not found</div>;
  }

  const participantsRes: ApiResponse<{ data: Participant[] }> = await apiClient(
    `${BASE_URL}${ENDPOINTS.EVENTS.PARTICIPANTS(params.id)}`
  );

  const event = res.data[0];
  const participants =
    participantsRes.ok && participantsRes.data?.data
      ? participantsRes.data.data
      : [];

  return <EventDetailsClient event={event} participants={participants} />;
}
