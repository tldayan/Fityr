"use client"
import React, { useEffect, useRef, useState } from 'react'
import styles from "./page.module.css";
import CustomTextInput from '@/components/CustomTextInput/CustomTextInput';
import CustomAreaTextInput from '@/components/CustomTextAreaInput/CustomTextAreaInput';
import ButtonStyles from "@/app/globalStyles/buttonStyles.module.css"
import { myFont } from '@/app/layout';
import shadowStyles from "@/app/globalStyles/containerShadowStyles.module.css"
import AddImageIcon from '@/app/assets/icons/add-media-icon.svg';
import CustomIconButton from '@/components/CustomIconButton/CustomIconButton';
import CustomButton from '@/components/CustomButton/CustomButton';
import { CustomImageModal } from '@/components/CustomImageModal/CustomImageModal';
import { useApiMutation } from '@/hooks/useApiMutation';
import { BASE_URL, ENDPOINTS } from '@/_lib/apiEndpoints';
import X from "@/app/assets/icons/x.svg"
import Image from 'next/image';

interface PostInfo {
  title: string;
  description: string;
  [key: string]: unknown;
}


export default function Page() {


const [postInfo, setPostInfo] = useState<PostInfo>({ title: "", description: "" });
const [media, setMedia] = useState<File[]>([]);
const fileInputRef = useRef<HTMLInputElement>(null);
const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);


useEffect(() => {
  const saved = localStorage.getItem("postInfo");
  if (saved) setPostInfo(JSON.parse(saved));
}, []);


useEffect(() => {

  const urls = media.map((eachMedia) => URL.createObjectURL(eachMedia))
  return () => {
    urls.forEach((eachUrl) => URL.revokeObjectURL(eachUrl))
  }

}, [media])

  const handleForm = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    
    setPostInfo((prev) => ({...prev, [e.target.name]: e.target.value }))

  }
  
  
  const saveDraft = () => {
    localStorage.setItem("postInfo", JSON.stringify({title: postInfo.title, description: postInfo.description}))
  }


  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setMedia([...media, ...Array.from(e.target.files)]);
    }
  };


  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  const handleImageSelect = (index: number) => {
    setSelectedImageIndex(index);
  }


const createPostMutation = useApiMutation<{ id: string }, PostInfo>(
  `${BASE_URL}${ENDPOINTS.POSTS}`,
  {
    method: "POST",
    queryKeyToInvalidate: ["posts"], 
    
    onSuccess: () => {
      setPostInfo({ title: "", description: "" });
      setMedia([]);
      localStorage.removeItem("postInfo");
    },
  }
);

  const handlePost = () => {
    if (!postInfo.title.trim() || !postInfo.description.trim()) {
      alert("Please fill in all fields");
      return;
    }
    createPostMutation.mutate(postInfo);
  };


  const handleImageDelete = (index: number) => {

    const updatedMedia = media.filter((_, imgIndex) => imgIndex !== index)
    setMedia(updatedMedia)
  }

  return (
    <div className={`${styles.createPostContainer}`}>
      <h1 className={myFont.className}>Create post</h1>
      <CustomTextInput type="type" name="title" onChange={handleForm} value={postInfo.title} label="Title" />
      <CustomAreaTextInput name="description" onChange={handleForm} value={postInfo.description} label='Description' />
        
        <div className={styles.mediaContainer}>
          {media.map((file, index) => (
            <div key={index} className={styles.imgContainer}>
              <div onClick={() => handleImageDelete(index)} className={styles.xContainer}>
                {media.length > 0 && <X stroke="white" width={15} height={15} />}
              </div>
              <Image
                onClick={() => handleImageSelect(index)}
                className={`${styles.media_img} ${shadowStyles.containerShadow}`}
                src={URL.createObjectURL(file)}
                alt={`Media ${index}`}
                width={200} 
                height={200}
                unoptimized
              />
            </div>
          ))}
        </div>



      <div className={styles.buttonContainer}>
        <CustomIconButton onClick={handleButtonClick} icon={AddImageIcon} className={`${ButtonStyles.primary_icon_button} ${styles.addImageButton} ${myFont.className}`} />
          <input
              type="file"
              accept="image/*"
              multiple
              ref={fileInputRef}
              style={{display: "none"}}
              onChange={handleMediaChange}
            />
        <CustomButton title='Save Draft' onClick={saveDraft} className={`${ButtonStyles.primary_button} ${myFont.className} ${styles.saveDraftButton}`} />
        <CustomButton onClick={handlePost} className={`${ButtonStyles.primary_button} ${myFont.className}`} title='Post'/>
      </div>


          {selectedImageIndex !== null && (
      <CustomImageModal
        viewingImageIndex={selectedImageIndex}
        images={media}
        onClose={() => setSelectedImageIndex(null)}
      />
    )}
    </div>
  )
}
