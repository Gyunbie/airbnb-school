import axios from "axios";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Banner from "../components/Banner";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LargeCard from "../components/LargeCard";
import MediumCard from "../components/MediumCard";
import SmallCard from "../components/SmallCard";

export default function Home({ exploreData, cardsData }) {
  const [nearbyHomes, setNearbyHomes] = useState(null);
  const [newHomes, setNewHomes] = useState(null);
  const user = useSelector(state => state.user);

  useEffect(async () => {
    const randomHomes = user?.attrs
      ? await axios.get(
          `http://35.173.122.10/getRandomHouses?city=${user?.attrs?.city}&count=8`
        )
      : null;

    const newHomes = user?.attrs
      ? await axios.get(
          `http://35.173.122.10/getRandomHousesByCity?city=${user.attrs.city}&count=4`
        )
      : null;
    setNearbyHomes(randomHomes?.data);
    setNewHomes(newHomes?.data);
  }, []);

  return (
    <div className=''>
      <Head>
        <title>Rental House</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      {/* Header */}
      <Header />

      {/* Banner */}
      <Banner />

      {/* Main */}
      <main className='max-w-7xl mx-auto px-8 sm:px-16'>
        <section className='pt-6'>
          <h2 className='text-4xl font-semibold pb-5'>Explore Nearby</h2>

          {/* Pull some data from server - API endpoints */}
          {nearbyHomes && (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {nearbyHomes?.map(home => (
                <SmallCard
                  key={home._id.$oid}
                  img={home.image_url[0]}
                  location={home.sehir}
                  title={home.title}
                />
              ))}
            </div>
          )}
        </section>

        {/* Live Anywhere */}
        {newHomes && (
          <section>
            <h2 className='text-4xl font-semibold py-8'>Live Anywhere</h2>

            <div className='pb-8 flex space-x-3 overflow-hidden lg:overflow-x-visible lg:scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-gray-400 p-3 -ml-3'>
              {newHomes?.map(home => (
                <MediumCard
                  key={home._id.$oid}
                  img={home.image_url[0]}
                  title={home.title}
                />
              ))}
            </div>
          </section>
        )}

        <LargeCard
          img='/assets/images/bottom-banner.jpg'
          title='The Greatest Outdoors'
          description='Wishlists curated by us.'
          buttonText='Get Inspired'
        />
      </main>

      <Footer />
    </div>
  );
}

export async function getStaticProps() {
  const exploreData = await fetch("https://links.papareact.com/pyp").then(res =>
    res.json()
  );

  const cardsData = await fetch("https://links.papareact.com/zp1").then(res =>
    res.json()
  );

  return {
    props: {
      exploreData,
      cardsData
    }
  };
}
