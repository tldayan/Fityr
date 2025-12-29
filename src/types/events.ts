export interface Event {
  id: number;
  event_name: string;
  event_description: string;
  event_start_time: string;   
  event_end_time: string;     
  host_id: string;
  location: string;
  created_at: string;         
  updated_at: string;   
  participants: number; 
  image_url: string     
}

export interface Participant {
  username: string;
  profile_pic?: string;
  user_id: string; 
}

export interface EventLocation {
  address: string;
  lat: string;
  lng: string;
}

export interface EventInfo {
  eventName: string;
  eventDescription: string;
  eventStartTime: string;
  eventEndTime: string;
  location: EventLocation; 
}
