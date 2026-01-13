import { Event } from '@/types/events'
import React from 'react'
import ComponentContainer from '../ComponentContainer/ComponentContainer'
import styles from "./EventItem.module.css"
import Image from 'next/image'
import { formatDateTime } from '@/_lib/format_date'
import ParticipantIcon from "@/assets/icons/user-round.svg"
import Link from 'next/link'

interface EventItemProps {
  event: Event
}

export default function EventItem({ event }: EventItemProps) {
  const {
    id,
    event_name,
    event_description,
    event_start_time,   
    event_end_time,     
    host_id,
    location,
    created_at,          
    updated_at,
    participants,
    image_url
  } = event

const locationObj =
  location && typeof location === "string"
    ? JSON.parse(location)
    : location ?? { address: "Unknown location", lat: 0, lng: 0 };



  return (
/*     <ComponentContainer> */
      <Link href={`/events/${event.id}`} className={styles.eventContainer}>
        {image_url && (
        <Image
          src={image_url}
          alt={event_name}
          className={styles.eventImage}
          width={800}    
          height={200}   
        />

        )}
        <h3 className={styles.eventName}>{event_name}</h3>
        <p className={styles.eventDesc}>{event_description}</p>
        <div className={styles.eventDetailsContainer}>
           <div className={styles.leftSection}>
            <div className={styles.participantsContainer}>
              <ParticipantIcon
                color="gray"
                width={16}
                height={16}
              />
              <p>{participants}</p>
            </div>

            <p className={styles.location}>{locationObj.address}</p>
          </div>
          <div>
            <p className={styles.time}>{formatDateTime(event_start_time)}</p>
            {/* <p className={styles.time}>{formatDateTime(event_end_time)}</p> */}
          </div>

        </div>

      </Link>
/*     </ComponentContainer> */
  )
}
