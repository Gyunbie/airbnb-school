import { useRouter } from "next/dist/client/router";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import axios from "axios";
import Header from "../../../components/Header";
import Link from "next/link";

function SingleHome() {
  const router = useRouter();
  const { homeId } = router.query;
  const [home, setHome] = useState(null);
  const [randomHomes, setRandomHomes] = useState(null);

  useEffect(async () => {
    const home = await axios.get("http://35.173.122.10:5000/home", {
      headers: {
        _id: homeId
      }
    });
    console.log(home);
    setHome(home.data);

    console.log(home.data.sehir);
    const randomHomes = await axios.get(
      `http://35.173.122.10/getRandomHouses?city=${home.data.sehir}&count=3`
    );
    console.log(randomHomes);
    setRandomHomes(randomHomes.data);
  }, [homeId]);

  return (
    <>
      <Header />
      {home && (
        <div className='h-screen w-screen overflow-hidden flex flex-col gap-y-12 px-24 py-16 max-w-[1440px] mx-auto'>
          <div className='space-x-8 flex items-start'>
            <div className='h-96 w-[40rem] min-w-[40rem] rounded overflow-hidden'>
              <Swiper
                slidesPerView={1}
                onSlideChange={() => console.log("slide change")}
                onSwiper={swiper => console.log(swiper)}
                pagination={{
                  type: "progressbar"
                }}
                navigation={true}
                modules={[Pagination, Navigation]}
              >
                <SwiperSlide className='relative h-96 w-[40rem]'>
                  <div className='relative h-96 w-[40rem] min-w-[40rem] rounded overflow-hidden'>
                    <Image
                      src={`${home.image_url[0]}`}
                      layout='fill'
                      objectFit='cover'
                    />
                  </div>
                </SwiperSlide>
                <SwiperSlide className='relative h-96 w-[40rem]'>
                  <div className='relative h-96 w-[40rem] min-w-[40rem] rounded overflow-hidden'>
                    <Image
                      src={`${home.image_url[1]}`}
                      layout='fill'
                      objectFit='cover'
                    />
                  </div>
                </SwiperSlide>
                <SwiperSlide className='relative h-96 w-[40rem]'>
                  <div className='relative h-96 w-[40rem] min-w-[40rem] rounded overflow-hidden'>
                    <Image
                      src={`${home.image_url[2]}`}
                      layout='fill'
                      objectFit='cover'
                    />
                  </div>
                </SwiperSlide>
                <SwiperSlide className='relative h-96 w-[40rem]'>
                  <div className='relative h-96 w-[40rem] min-w-[40rem] rounded overflow-hidden'>
                    <Image
                      src={`${home.image_url[3]}`}
                      layout='fill'
                      objectFit='cover'
                    />
                  </div>
                </SwiperSlide>
              </Swiper>
            </div>
            <div className='flex flex-col gap-y-4 justify-between h-full'>
              <div className='flex items-center justify-between'>
                <h1 className='text-3xl font-semibold'>{home.title}</h1>
                <p className='text-xl font-medium px-2 py-1 bg-blue-500 rounded-md text-white'>
                  {home.price} TL
                </p>
              </div>
              <p className='text-justify text-gray-500'>{home.desc}</p>
              <p className=''>
                <span className='font-medium'>Adres: </span>
                {home.adres}
              </p>

              <button className='w-full h-10 bg-blue-600 hover:bg-blue-700 duration-150 cursor-pointer text-white rounded-lg px-3 py-1 font-medium active:scale-[97.5%]'>
                Rezervasyon yap
              </button>
            </div>
          </div>
          <div className='flex items-center justify-between gap-x-5 cursor-pointer'>
            {randomHomes &&
              randomHomes.map(randomHome => (
                <Link href={`/home/${randomHome._id.$oid}`}>
                  <div
                    key={`${randomHome._id.$oid}`}
                    className='w-96 h-72 hover:scale-105 duration-150'
                  >
                    <div className='relative rounded-t-lg h-64 w-96 overflow-hidden'>
                      {randomHome.image_url[0] && (
                        <Image
                          src={`${randomHome.image_url[0]}`}
                          layout='fill'
                          objectFit='cover'
                        />
                      )}
                    </div>
                    <div className='bg-gray-300 rounded-b-lg px-4 py-2 h-40'>
                      <h2 className='text-lg font-medium'>
                        {randomHome.title}
                      </h2>
                      <p>{randomHome.desc.slice(0, 160)}</p>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      )}
    </>
  );
}

export default SingleHome;
