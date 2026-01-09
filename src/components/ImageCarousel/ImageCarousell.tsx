"use client";

import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import type { NavigationOptions } from "swiper/types";
import styles from "./ImageCarousell.module.css";
import Left from "@/app/assets/icons/chevron-left.svg";
import Right from "@/app/assets/icons/chevron-right.svg";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface ImageCarouselProps {
  images: string[];
  height?: number | string;
  width?: number | string;
  loop?: boolean;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  loop = false,
}) => {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  if (!images || images.length === 0) return null;


  const handleImageClick = (url: string) => {
    setCurrentImage(url);
    setLightboxOpen(true);
  };

  const handleClose = () => {
    setLightboxOpen(false);
    setCurrentImage(null);
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setScale((prev) => {
      const next = prev - e.deltaY * 0.001;
      return Math.min(Math.max(1, next), 4);
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale === 1) return;
    isDragging.current = true;
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  useEffect(() => {
  if (lightboxOpen) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }

  return () => {
    document.body.style.overflow = "";
  };
}, [lightboxOpen]);


  const handleMouseUp = () => {
    isDragging.current = false;
  };


  return (
    <div
      className={styles.wrapper}
      onClick={(e) => e.stopPropagation()}
    >

      {images.length > 1 && (
        <>
          <button ref={prevRef} className={styles.prevBtn}>
            <Left fontSize={25} />
          </button>

          <button ref={nextRef} className={styles.nextBtn}>
            <Right fontSize={25} />
          </button>
        </>
      )}

      <Swiper
        modules={[Navigation, Pagination]}
        loop={loop}
        pagination={{ clickable: true }}
        navigation={
          images.length > 1
            ? ({ prevEl: prevRef.current, nextEl: nextRef.current } as NavigationOptions)
            : false
        }
        onBeforeInit={(swiper) => {
          if (images.length > 1) {
            const navigation = swiper.params.navigation as NavigationOptions;
            navigation.prevEl = prevRef.current;
            navigation.nextEl = nextRef.current;
          }
        }}
        className={styles.swiperContainer}
      >
        {images.map((url, index) => (
          <SwiperSlide key={index}>
            <img
              src={url}
              alt={`Slide ${index + 1}`}
              loading="lazy"
              className={styles.img}
              onClick={() => handleImageClick(url)}
              style={{ cursor: "zoom-in" }}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {lightboxOpen && currentImage && (
        <div className={styles.lightbox} onClick={handleClose}>
          <img
            src={currentImage}
            alt="Expanded"
            className={styles.lightboxImage}
            onClick={(e) => e.stopPropagation()}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              cursor: scale > 1 ? "grab" : "zoom-in",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
