"use client";
import CustomButton from '@/components/CustomButton/CustomButton';
import React, { useEffect, useRef, useState } from 'react';
import CustomTextInput from '@/components/CustomTextInput/CustomTextInput';
import CustomAreaTextInput from '@/components/CustomTextAreaInput/CustomTextAreaInput';
import styles from "./page.module.css";
import TimeInput from '@/components/TimeInput/TimeInput';
import MapPicker from '@/components/MapPicker/MapPicker';
import ButtonStyles from "@/app/globalStyles/buttonStyles.module.css";
import ImageCropper from '@/components/ImageCropper/ImageCropper';
import EditIcon from "../../../public/pen.svg";
import { BASE_URL, ENDPOINTS } from '@/_lib/apiEndpoints';
import { apiClient } from '@/utils/apiClient';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';


export default function Page() {
  const [eventInfo, setEventInfo] = useState({
    eventName: "",
    eventDescription: "",
    eventBanner: "",
    eventStartTime: null as string | null,
    eventEndTime: null as string | null,
    location: {
      address: "",
      lat: 0,
      lng: 0,
    },
  });

  const [showCropper, setShowCropper] = useState(false);
  const [eventBannerSrc, setEventBannerSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingBanner, setUploadingBanner] = useState(false)


  const handleEventBanner = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    console.log(eventInfo)
  }, [eventInfo])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setEventBannerSrc(reader.result as string);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);

    e.target.value = "";
  };


  const handleCropDone = async (croppedImage: string) => {
    setShowCropper(false);
    setEventBannerSrc(null);
    setUploadingBanner(true);

    try {

      const blob = await (await fetch(croppedImage)).blob();
      const fileName = `banner-${Date.now()}.png`;

      const res = await apiClient<{ uploadUrl: string }>(
        `${BASE_URL}${ENDPOINTS.AWS.UPLOAD_EVENT_BANNER}`,
        "POST",
        { fileName, fileType: blob.type }
      );

      if (!res.ok || !res.data?.uploadUrl) {
        throw new Error(res.error || "Failed to get upload URL");
      }

      const uploadUrl = res.data.uploadUrl;

      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        body: blob,
        headers: {
          "Content-Type": blob.type,
        },
      });
      
      if (!uploadRes.ok) {
        throw new Error(`S3 upload failed: ${uploadRes.status} ${uploadRes.statusText}`);
      }

      const s3Url = uploadUrl.split("?")[0];

      setEventInfo(prev => ({ ...prev, eventBanner: s3Url }));
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploadingBanner(false);
    }
  };



  const handleCancelCrop = () => {
    setShowCropper(false);
    setEventBannerSrc(null);
  };

  const handleEventDetails = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEventInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleHostEvent = async() => {
    console.log("Final event info:", eventInfo);

    const response = await apiClient(`${BASE_URL}${ENDPOINTS.EVENTS.CREATE}`, "POST", eventInfo)

    console.log(response)

  };

  return (
    <div className={styles.createEventContainer}>
      <h1 className={styles.event}>Host an Event</h1>

      {/* Banner section */}
      <div className={styles.bannerContainer}>
        {eventInfo.eventBanner ? (
          <>
            <img
              src={eventInfo.eventBanner}
              alt="Event Banner"
              className={styles.carBannerPreview}
            />
            <div className={styles.editOverlay}>
              <EditIcon onClick={handleEventBanner} className={styles.editIcon} color='gray' width={22} height={22} />
            </div>
          </>
        ) : (
          uploadingBanner ? <LoadingSpinner size='small' /> : 
          <CustomButton
            onClick={handleEventBanner}
            className={`${ButtonStyles.primary_button} ${styles.uploadBannerButton}`}
            title="Upload Event Banner"
          />
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleImageUpload}
      />

      <CustomTextInput
        type="text"
        label="Event Name"
        value={eventInfo.eventName}
        name="eventName"
        onChange={handleEventDetails}
      />

      <CustomAreaTextInput
        label="Event Description"
        value={eventInfo.eventDescription}
        name="eventDescription"
        onChange={handleEventDetails}
      />

      <TimeInput
        label="Start Date & Time"
        value={eventInfo.eventStartTime}
        onChange={(date) => setEventInfo(prev => ({ ...prev, eventStartTime: date }))}
      />

      <TimeInput
        label="End Date & Time"
        value={eventInfo.eventEndTime}
        onChange={(date) => setEventInfo(prev => ({ ...prev, eventEndTime: date }))}
      />

   <MapPicker
  onLocationSelect={(lat, lng, address) => 
    setEventInfo(prev => ({
      ...prev,
      location: { 
        ...prev.location, 
        lat, 
        lng, 
        address: address || ""
      }
    }))
  }
/>


      <CustomButton
        title="Host Event"
        className={`${ButtonStyles.primary_button} ${styles.hostEventButton}`}
        onClick={handleHostEvent}
      />

      {showCropper && eventBannerSrc && (
        <ImageCropper
          imageSrc={eventBannerSrc}
          onCropDone={handleCropDone}
          onCancel={handleCancelCrop}
          type="banner"
        />
      )}

    </div>
  );
}
