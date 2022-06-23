import Image from "next/image";
import { HeartIcon } from "@heroicons/react/outline";
import { StarIcon } from "@heroicons/react/solid";
import Link from "next/link";

function InfoCard({
  id,
  img,
  location,
  title,
  description,
  star,
  price,
  dates
}) {
  return (
    <div
      onClick={router.push({
        pathname: `/home/${id}`,
        query: {}
      })}
      className=''
    >
      <div className='flex px-2 py-7 pr-4 border-b cursor-pointer hover:opacity-80 hover:shadow-lg transition duration-200 ease-out first:border-t'>
        <div className='relative h-24 w-40 md:h-52 md:w-80 flex-shrink-0'>
          {img && (
            <Image
              src={img}
              layout='fill'
              objectFit='cover'
              className='rounded-2xl'
            />
          )}
        </div>

        <div className='flex flex-col flex-grow pl-5'>
          <div className='flex justify-between'>
            <p>{location}</p>
            {/* <HeartIcon className='h-7 cursor-pointer hover:text-red-600' /> */}
          </div>

          <h4 className='text-xl'>{title}</h4>

          <div className='border-b w-10 pt-2' />

          <p className='pt-2 text-sm text-gray-500 flex-grow'>{description}</p>

          <div className='flex justify-between items-end pt-5'>
            <p className='flex items-center'>
              {/* <StarIcon className='h-5 text-red-400' />
            {star} */}
            </p>

            <div>
              <p className='text-lg lg:text-2xl font-semibold pb-2'>
                {price} TL
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoCard;
