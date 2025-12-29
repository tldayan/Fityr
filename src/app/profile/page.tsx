"use client";
import React, { useEffect, useRef, useState } from "react";
import { myFont } from "@/app/layout";
import styles from "./page.module.css";
import shadowStyles from "@/app/globalStyles/containerShadowStyles.module.css";
import globalStyles from "../page.module.css";
import CustomTextInput from "@/components/CustomTextInput/CustomTextInput";
import AddImageIcon from "@/app/assets/icons/add-media-icon.svg";
import CustomIconButton from "@/components/CustomIconButton/CustomIconButton";
import ImageCropper from "@/components/ImageCropper/ImageCropper";
import EditIcon from "../../../public/pen.svg";
import ActionMenu from "@/components/ActionMenu/ActionMenu";
import DropdownMenu from "@/components/DropdownMenu/DropdownMenu";
import CustomAreaTextInput from "@/components/CustomTextAreaInput/CustomTextAreaInput";
import { apiClient } from "@/utils/apiClient";
import { BASE_URL, ENDPOINTS } from "@/_lib/apiEndpoints";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import CustomButton from "@/components/CustomButton/CustomButton";
import ButtonStyles from "@/app/globalStyles/buttonStyles.module.css";
import { UserProfileResponse } from "@/types/user";
import { error } from "console";

export default function Page() {
  const [profileInfo, setProfileInfo] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    bio: "",
    gender: "",
    profilePic: ""
  }); 
  const [originalProfile, setOriginalProfile] = useState<typeof profileInfo | null>(null);
  const [editMode, setEditMode] = useState(false)
  const [profilePicSrc, setProfilePicSrc] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [uploadingProfilePic, setUploadingProfilePic] = useState(false)
  const [savingInfo, setSavingInfo] = useState(false)
  const [loadingProfileInfo, setLoadingProfileInfo] = useState(false)


  const fileInputRef = useRef<HTMLInputElement>(null);



  useEffect(() => {

    const fetchPorfileInfo = async() => {

      try {
        setLoadingProfileInfo(true)

        const profileInfo = await apiClient<UserProfileResponse>(`${BASE_URL}${ENDPOINTS.PROFILE.GET_PROFILE_INFO}`, "GET")
        console.log(profileInfo.data)
        if (profileInfo.ok && profileInfo.data) {
          const mappedProfile = {
            username: profileInfo.data.username ?? "",
            email: profileInfo.data.email ?? "",
            firstName: profileInfo.data.first_name ?? "",
            lastName: profileInfo.data.last_name ?? "",
            bio: profileInfo.data.bio ?? "",
            gender: profileInfo.data.gender ?? "",
            profilePic: profileInfo.data.profilePic ?? ""
          };

          setProfileInfo(mappedProfile);
          setOriginalProfile(mappedProfile);
        }

      } catch(error) {
        console.log(error)
      } finally {
        setLoadingProfileInfo(false)
      }
    }

    fetchPorfileInfo()

  }, [])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setProfilePicSrc(reader.result as string);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);

    e.target.value = ""; 
  };

  const handleProfilePic = async(action: "change" | "remove") => {
    if (action === "change") {
      fileInputRef.current?.click();
    }
    if (action === "remove") {

      try {
        setUploadingProfilePic(true)

        const removeProfilePicRes =  await apiClient(
          `${BASE_URL}${ENDPOINTS.PROFILE.UPDATE_PROFILE_PIC}`,
          "PUT",
          { profilePic: null }
        );

        if(removeProfilePicRes.ok) {
          setProfileInfo((prev) => ({...prev, profilePic: ""}))
        }

      } catch(err) {

        console.log(err)

      } finally {
        setUploadingProfilePic(false)
      }
    }
  };


  const handleCropDone = async(croppedImg: string) => {
    setShowCropper(false);
    setUploadingProfilePic(true)

    try {
      const blob = await (await fetch(croppedImg)).blob();

      const res = await apiClient<{ uploadUrl: string }>(
        `${BASE_URL}${ENDPOINTS.AWS.UPLOAD_PROFILE_PIC}`,
        "POST",
        { fileType: blob.type }
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

      setProfileInfo(prev => ({ ...prev, profilePic: s3Url }));

      await apiClient(
        `${BASE_URL}${ENDPOINTS.PROFILE.UPDATE_PROFILE_PIC}`,
        "PUT",
        { profilePic: s3Url }
      );


    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploadingProfilePic(false);
    }


  };

const handleCancelCrop = () => {
  setShowCropper(false);
};


  const handleProfileInfo = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    setProfileInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    console.log(profileInfo)
  }, [profileInfo])

  const handleProfileAction = async() => {

    try {
      if(editMode) {
        setSavingInfo(true)
        if(JSON.stringify(profileInfo) === JSON.stringify(originalProfile)) return


        const saveProfileInfo = await apiClient(`${BASE_URL}${ENDPOINTS.PROFILE.UPDATE_PROFILE_INFO}`, "PUT", profileInfo)

        if(saveProfileInfo.ok) {
          console.log("Successs")
        }
      }
    } catch (err) {
      console.log("error")
    } finally {
      setSavingInfo(false)
    }

    setEditMode((prev) => !prev)

  }

  return (
    <>
      <div className={`${styles.createProfileContainer} ${shadowStyles.containerShadow}`}>
        <div className={styles.headingContainer}>
          <h1 className={`${myFont.className} ${globalStyles.defaultFont} ${styles.formTitle}`}>Profile</h1>
          <div className={globalStyles.defaultFlex}>
            <CustomButton loading={savingInfo} onClick={handleProfileAction} className={`${ButtonStyles.primary_button} ${styles.editButton}`} title={!editMode ? "Edit" : "Save"} />
            {editMode && <CustomButton onClick={() => setEditMode(false)} className={`${ButtonStyles.noBackground}`} title="Cancel" />}
          </div>
        </div>

        
        <>
          <div className={styles.profilePicContainer}>
            {profileInfo.profilePic && !uploadingProfilePic ? (
              <ActionMenu
                options={[
                  { label: "Change picture", onClick: () => handleProfilePic("change") },
                  { label: "Remove picture", onClick: () => handleProfilePic("remove") },
                ]}
                align="right"
              >
                <button className={styles.profilePicInnerContainer}>
                  {profileInfo.profilePic && (
                    <img
                      src={profileInfo.profilePic}
                      alt="Profile"
                      className={styles.profilePic}
                    />
                  )}
                  <EditIcon className={styles.editIcon} width={24} height={24} />
                </button>
              </ActionMenu>
            ) : (
              uploadingProfilePic ? <LoadingSpinner size="small" /> : <CustomIconButton
                noBackground
                iconColor="#c9c7c7ff"
                icon={AddImageIcon}
                onClick={() => {
                  fileInputRef.current?.click();
                }}
              />
            )}
          </div>
        </>
    
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleImageUpload}
        />
        <CustomAreaTextInput loading={loadingProfileInfo} disabled={!editMode} value={profileInfo.bio} onChange={handleProfileInfo} name="bio" placeholder="About you..." label="About me" />
        <CustomTextInput loading={loadingProfileInfo} disabled={!editMode} type="text" label="Username" value={profileInfo.username} name="username" onChange={handleProfileInfo} />
        <CustomTextInput loading={loadingProfileInfo} disabled={!editMode} type="text" label="First Name" value={profileInfo.firstName} name="firstName" onChange={handleProfileInfo} />
        <CustomTextInput loading={loadingProfileInfo} disabled={!editMode} type="text" label="Last Name" value={profileInfo.lastName} name="lastName" onChange={handleProfileInfo} />
        <CustomTextInput loading={loadingProfileInfo} disabled={!editMode} type="text" label="Email" value={profileInfo.email} name="email" onChange={handleProfileInfo} />
        <DropdownMenu
          className={styles.genderDropdown}
          placeholder="Select Gender"
          label="Gender"
          options={["Male", "Female"]}
          value={profileInfo.gender}
          viewMode={editMode}
          onSelect={(value) => setProfileInfo((prev) => ({ ...prev, gender: value }))}
        />
      </div>

      {showCropper && (
        <ImageCropper
          imageSrc={profilePicSrc!}
          onCropDone={handleCropDone}
          onCancel={handleCancelCrop}
          type="profilePic"
        />
      )}

    </>
  );
}
