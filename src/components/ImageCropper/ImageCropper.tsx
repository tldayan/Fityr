"use client"
import React, { useState, useCallback } from "react"
import Cropper, { Area } from "react-easy-crop"
import styles from "./ImageCropper.module.css"

interface ImageCropperProps {
  imageSrc: string
  onCropDone: (croppedImage: string) => void
  onCancel: () => void
  type: "banner" | "profilePic"
}

const ImageCropper: React.FC<ImageCropperProps> = ({ imageSrc, onCropDone, onCancel, type }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const getCroppedImg = async () => {
    if (!croppedAreaPixels) return

    const image = new Image()
    image.src = imageSrc
    await image.decode()

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D
    const { x, y, width, height } = croppedAreaPixels

    canvas.width = width
    canvas.height = height
    ctx.drawImage(image, x, y, width, height, 0, 0, width, height)

    const croppedImage = canvas.toDataURL("image/jpeg")
    onCropDone(croppedImage)
  }

  const aspect = type === "banner" ? 16 / 9 : 1

  return (
    <div className={styles.cropperOverlay}>
      <div className={styles.cropperContainer}>
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>

      <div className={styles.buttonsContainer}>
        <button onClick={getCroppedImg} className={`${styles.button} ${styles.doneButton}`}>
          Done
        </button>
        <button onClick={onCancel} className={`${styles.button} ${styles.cancelButton}`}>
          Cancel
        </button>
      </div>
    </div>
  )
}

export default ImageCropper
