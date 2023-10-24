"use client"

import Image from 'next/image';
import React, { useEffect, useState, useRef } from 'react';
import "./style.css"

interface SliderTypes {
  images: string[],
  width: number,
  height: number,
}

const SliderComponent = ({images, width, height}: SliderTypes) => {
  const [imgWidth, setImgWidth] = useState(width);
  const [totalImgs, setTotalImgs] = useState(images.length);
  const [activeSlide, setActiveSlide] = useState(0);
  const sliderRef = useRef(null);

  const toggleBullet = (prev: boolean) => {
    // Calculate active slide index here
    const nextSlide = prev
      ? Math.round(sliderRef.current.scrollLeft) - imgWidth
      : Math.round(sliderRef.current.scrollLeft) + imgWidth;
    const activeBullet = nextSlide / imgWidth;
    setActiveSlide(Math.round(activeBullet));
  };

  const onNextClick = () => {
    sliderRef.current.scrollLeft += imgWidth;
    // toggleBullet(false);

    const sliderFullWidth = sliderRef.current.scrollWidth;
    const lastSlide = sliderFullWidth - imgWidth;

    if (lastSlide === Math.round(sliderRef.current.scrollLeft)) {
      sliderRef.current.scrollLeft = 0;
      setActiveSlide(0);
    } else {
      setActiveSlide(activeSlide + 1);
    }
  };

  const onPreviousClick = () => {
    sliderRef.current.scrollLeft -= imgWidth;
    // toggleBullet(true);

    if (activeSlide === 0) {
      setActiveSlide(totalImgs - 1);
    } else {
      setActiveSlide(activeSlide - 1);
    }
  };

  useEffect(() => {
    let interval: number | NodeJS.Timer
    const loopAutoNext = (time: number) => {
      interval = setInterval(onNextClick, time);

    };

    loopAutoNext(4000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setImgWidth(sliderRef.current.offsetWidth);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const bulletSlider = (index) => {
    sliderRef.current.scrollLeft = imgWidth * index;
    setActiveSlide(index);
  };

  return (
    <div>
      <button id="previous" className='bg-primary' onClick={onPreviousClick}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" width="24" height="24"><path d="M15.293 3.293 6.586 12l8.707 8.707 1.414-1.414L9.414 12l7.293-7.293-1.414-1.414z"/></svg>
      </button>
      <div id="slider" className="slider wow fadeInUp relative mx-auto lg:mr-0" ref={sliderRef}>
        {images?.map((item: string, index: React.Key) => {
          return (
            <Image
              key={index}
              priority={true}
              src={`/images/${item}`}
              alt="about-image"
              width={width}
              height={height}

            />
          )
        })}
      </div>
      <button className='bg-primary' id="next" onClick={onNextClick}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" width="24" height="24"><path d="M7.293 4.707 14.586 12l-7.293 7.293 1.414 1.414L17.414 12 8.707 3.293 7.293 4.707z"/></svg>
      </button>
      {/* <div className="bullets-container">
        {
          Array(totalImgs).fill(0).map((item, index) => {
              return (
                <button
                  key={index}
                  className={`bullet ${index === activeSlide ? 'active' : ''}`}
                  onClick={() => bulletSlider(index)}
                ></button>
              )
            })
        }
      </div> */}
    </div>
  );
};

export default SliderComponent;