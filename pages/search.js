import { useRouter } from "next/dist/client/router";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { format } from "date-fns";
import InfoCard from "../components/InfoCard";
import Map from "../components/Map";
import { useEffect, useState } from "react";
import axios from "axios";

function Search({ searchResults }) {
  const router = useRouter();
  const [rooms, setRooms] = useState(null);
  const { location, startDate, endDate, guestNumber } = router.query;

  const formattedStartDate = format(new Date(startDate), "dd MMMM yy");
  const formattedEndDate = format(new Date(endDate), "dd MMMM yy");
  const range = `${formattedStartDate} - ${formattedEndDate}`;

  useEffect(async () => {
    console.log(rooms);
    async function getRooms() {
      const SD = new Date(router.query.startDate);
      const ED = new Date(router.query.endDate);
      const searchParams = {
        keyword: location,
        sday: SD.getDate(),
        smonth: SD.getMonth() + 1,
        syear: SD.getFullYear(),
        eday: ED.getDate(),
        emonth: ED.getMonth() + 1,
        eyear: ED.getFullYear()
      };

      const searchUrl = `http://54.85.24.108/getHousesByDateAndKeyword?eyear=${searchParams.eyear}&emonth=${searchParams.emonth}&eday=${searchParams.eday}&syear=${searchParams.syear}&smonth=${searchParams.smonth}&sday=${searchParams.sday}&keyword=${searchParams.keyword}`;
      console.log(searchUrl);

      const res = await axios.get(searchUrl);
      console.log(res.data);
      setRooms(res.data);
    }

    getRooms();
  }, []);

  useEffect(() => {
    console.log(rooms);
  }, [rooms]);

  return (
    <>
      {rooms !== null && (
        <div className='max-h-screen '>
          <Header
            placeholder={`${location} | ${range} | ${guestNumber} guests`}
          />

          <main className='flex overflow-y-scroll'>
            <section className='flex-grow pt-14 px-6'>
              <p className='text-xs'>
                300+ Stays | {range} | for {guestNumber} guests
              </p>

              <h1 className='text-3xl font-semibold mt-2 mb-6'>
                Stays in {location}
              </h1>

              {/* <div className='hidden lg:inline-flex mb-5 space-x-3 text-gray-800 whitespace-nowrap'>
                <p className='button'>Cancellation Flexibility</p>
                <p className='button'>Type of Place</p>
                <p className='button'>Price</p>
                <p className='button'>Rooms and Beds</p>
                <p className='button'>More filters</p>
              </div> */}

              {rooms !== null && rooms.length > 0 && (
                <div>
                  {rooms?.map(room => (
                    <InfoCard
                      key={room._id.$oid}
                      id={room._id.$oid}
                      img={room.image_url[0]}
                      location={room.sehir}
                      title={room.title}
                      description={room.desc}
                      star={5}
                      price={room.price}
                    />
                  ))}
                </div>
              )}
            </section>

            <section className='hidden xl:inline-flex xl:min-w-[600px]'>
              <Map searchResults={searchResults} />
            </section>
          </main>

          <Footer />
        </div>
      )}
    </>
  );
}

export default Search;

export async function getServerSideProps() {
  const searchResults = await fetch("https://links.papareact.com/isz").then(
    res => res.json()
  );

  return {
    props: {
      searchResults
    }
  };
}
