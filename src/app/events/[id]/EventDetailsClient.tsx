"use client";

import { formatDateTime } from "@/_lib/format_date";
import { Event, Participant } from "@/types/events";
import Image from "next/image";
import styles from "./page.module.css"
import CustomButton from "@/components/CustomButton/CustomButton";
import ButtonStyles from "@/app/globalStyles/buttonStyles.module.css"
import Avatar from "@/components/Avatar/Avatar";
import Link from "next/link";
import ComponentContainer from "@/components/ComponentContainer/ComponentContainer";
import { apiClient } from "@/utils/apiClient";
import { BASE_URL, ENDPOINTS } from "@/_lib/apiEndpoints";
import { useState } from "react";
import { useStytchUser } from "@stytch/nextjs";

export default function EventDetailsClient({ event, participants }: { event: Event, participants: Participant[] }) {

  const [currentParticipants, setCurrentParticipants] = useState(participants); 
  const {user} = useStytchUser()

  const [loading, setLoading] = useState(false)

  const handleEvent = async () => {

  if (!user) return console.log("User not logged in");

  setLoading(true);
  const joined = currentParticipants.some((p) => p.user_id === user.user_id);

  try {
    const action = joined ? "LEAVE" : "ATTEND";
    const endpoint = joined
      ? ENDPOINTS.EVENTS.LEAVE(event.id)
      : ENDPOINTS.EVENTS.ATTEND(event.id);

    const response = await apiClient(`${BASE_URL}${endpoint}`, "POST");

    if (!response.ok) return;

    if (joined) {
      setCurrentParticipants((prev) =>
        prev.filter((p) => p.user_id !== user.user_id)
      );
    } else {
      setCurrentParticipants((prev) => [
        ...prev,
        {
          username: user.name.first_name,
          profile_pic: user.trusted_metadata.profile_pic as string | undefined,
          user_id: user.user_id,
        },
      ]);
    }
  } finally {
    setLoading(false);
  }
};

  const host = participants.find((eachParticipant) => eachParticipant.user_id === event.host_id)
  const joined = currentParticipants.some((p) => p.user_id === user?.user_id);

  const locationObj = event.location;
  console.log("participants",participants)

  return (
    <div className={styles.eventContainer}>
      <h1>{event.event_name}</h1>
      {event.image_url && (
        <Image
          src={event.image_url}
          alt={event.event_name}
          className={styles.eventImage}
          width={800}    
          height={400}   
        />

        )}

      <ComponentContainer background>
      <h3 className={styles.title}>About</h3>
      <div className={styles.eventDetails}>
        <p className={styles.eventDescription}>{event.event_description}</p>
        <p className={styles.date}>Date: {formatDateTime(event.event_start_time)}</p>
        {locationObj && <p className={styles.location}>Location: {locationObj.address}</p>}
      </div></ComponentContainer>
      {locationObj && <iframe
        width="100%"
        height="300"
        style={{ border: 0, borderRadius: "10px" }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://maps.google.com/maps?q=${locationObj.lat},${locationObj.lng}&hl=en&z=15&output=embed`}
      />}



      <ComponentContainer background>
        <h3 className={styles.title}>Participants</h3>
      <div className={styles.mainParticipantsContainer}>
        
        <div className={styles.participantProfileContainer}>
          <Avatar user={{username: host?.username ?? "hostname", profilePic: host?.profile_pic}} />
          <p className={styles.hostname}>{host?.username}</p>
          <p className={styles.host}>Host</p>
        </div>
        <div className={styles.participantsContainer}> 
          {currentParticipants.map((eachParticipant: Participant) => {

            if(eachParticipant.user_id === event.host_id) return

            return <Link href={`/users/${eachParticipant.username}`} key={eachParticipant.user_id} className={styles.participantProfileContainer}>
                    <Avatar user={{username: eachParticipant.username, profilePic: eachParticipant.profile_pic}} />
                    <h3 className={styles.participantName}>{eachParticipant.username}</h3>
                  </Link>
              })}
        </div>
      </div>
      </ComponentContainer>
      {host?.user_id !== user?.user_id && <CustomButton loading={loading} onClick={handleEvent} shadow className={`${ButtonStyles.primary_button} ${styles.attendEventButton} ${joined ? styles.leaveButton : ""}`} title={joined ? "Leave" : "Attend"} />}
              
    </div>
  );
}
