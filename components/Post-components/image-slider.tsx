'use client'

import React, { FC, useCallback } from 'react'
import Image, { StaticImageData } from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { Expand } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface ImageSliderProps {
  images?: {
    id: number
    url: string | null
    postId: number
  }[] | null
}

const ImageSlider: FC<ImageSliderProps> = ({ images }) => {
  return (
    <Carousel className=" flex items-center">
      <CarouselContent className='h-[500px] w-[912px]'>
        {images?.map((image) => (
          image.url && (
            <CarouselItem
              key={image.id}
              className='relative w-full flex justify-center items-center'
            >
              <Link
                href={image.url}
                target='_blank'
                className='absolute bottom-1 right-1'
              >
                <Expand />
              </Link>
              <Image
                className='object-contain object-center rounded-lg'
                src={image.url}
                alt='post image'
                width={1000}
                height={1000}
                quality={100}
              />
            </CarouselItem>
          )))}
      </CarouselContent>
      <CarouselPrevious className='h-14 w-14 -left-[15%]' />
      <CarouselNext className='h-14 w-14 -right-[15%]' />
    </Carousel>
    // <div className="relative h-full flex items-center justify-center">
    //   <div className="h-full w-[900px] overflow-hidden">
    //     <Swiper navigation={true} modules={[Navigation]} className='h-full swiper'>
    //       {images?.map((image) => (
    //         image.url && (
    //           <SwiperSlide
    //             key={image.id}
    //             className='relative'>
    //             <Link
    //               href={image.url}
    //               target='_blank'
    //             >
    //               <Expand className='absolute bottom-9 right-1' />
    //             </Link>
    //             <Image
    //               className='h-full w-full object-contain'
    //               src={image.url}
    //               alt='post image'
    //               width={1000}
    //               height={1000}
    //               quality={100}
    //             />
    //           </SwiperSlide>
    //         )))}
    //     </Swiper>
    //   </div>
    // </div>
  )
}

export default ImageSlider