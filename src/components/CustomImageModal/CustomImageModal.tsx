import { useEffect, useState } from "react";
import styles from "./CustomImageModal.module.css";

type CustomImageModalProps = {
  images: File[];
  viewingImageIndex: number;
  onClose: () => void;
};

export const CustomImageModal = ({ images, onClose, viewingImageIndex }: CustomImageModalProps) => {
  const [show, setShow] = useState(false);
  const [imageIndex, setImageIndex] = useState<number>(viewingImageIndex)
  const [imageUrl, setImageUrl] = useState<string>("")

  useEffect(() => {
    const timeout = setTimeout(() => setShow(true), 10);
    return () => clearTimeout(timeout);
  }, []);


  useEffect(() => {
const file = images[imageIndex];
    const url = URL.createObjectURL(file);
    setImageUrl(url);

    return () => URL.revokeObjectURL(url)
  }, [images, imageIndex])


  const handleClose = () => {
    setShow(false); 
    setTimeout(() => {
      onClose(); 
    }, 300);
  };

  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

const handleImage = (direction: string) => {
  if (direction === "next") {
    const nextIndex = imageIndex + 1 === images.length ? 0 : imageIndex + 1;
    setImageIndex(nextIndex);
  } else {
    const nextIndex = imageIndex - 1 < 0 ? images.length - 1 : imageIndex - 1;
    setImageIndex(nextIndex);
  }
};


  return (
    <div onClick={handleClose} className={`${styles.overlay} ${show ? styles.showOverlay : ""}`}>
      <div onClick={handleModalClick} className={`${styles.modalContainer} ${show ? styles.showModal : ""}`}>
        <button onClick={() => handleImage("prev")} className={styles.navButton}>{"<"}</button>
        {imageUrl && <img src={imageUrl} alt="Preview" className={styles.modalImage} />}

        <button onClick={() => handleImage("next")} className={styles.navButton}>{">"}</button>
      </div>
    </div>
  );
};
