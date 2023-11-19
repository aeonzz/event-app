'use client'

import React, { FC, useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Image, { StaticImageData } from 'next/image'
import gg from '@/public/luke-jones-qJCNM7JbH5A-unsplash.jpg'
import f from '@/public/peakpx (1).jpg'
import { ChevronLeftCircle, ChevronRightCircle } from 'lucide-react'

const ImageSlider = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel()

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  return (
    <div className="embla h-full w-full relative">
      <div className=" h-full flex items-center justify-center" ref={emblaRef}>
        <div className="embla__container h-full">
          <div className="embla__slide flex justify-center">
            <Image
              className='h-full object-contain'
              src={gg}
              alt='haha'
              quality={100}
              loading='lazy'
            />
          </div>
          <div className="embla__slide flex justify-center">
            <Image
              className='h-full object-contain'
              src={f}
              alt='haha'
              quality={100}
              loading='lazy'
            />
          </div>
        </div>
        <button
          className='absolute left-0 z-40 h-full w-10 group'
          onClick={scrollPrev}
        >
          <ChevronLeftCircle
            className='h-8 w-8 opacity-40 group-hover:opacity-50 group-hover:translate-x-1 transition-transform'
          />
        </button>
        <button
          className='absolute right-0 z-50 h-full w-10 group'
          onClick={scrollNext}
        >
          <ChevronRightCircle
            onClick={scrollNext}
            className='h-8 w-8 opacity-40 group-hover:opacity-50 group-hover:-translate-x-1 transition-transform'
          />
        </button>
      </div>
    </div>
  )
}

export default ImageSlider