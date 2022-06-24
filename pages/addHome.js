import React, { useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import axios from "axios";
import Header from "../components/Header";
import { useSelector } from "react-redux";

import { Toast } from "primereact/toast";

function addHome() {
  const toast = useRef(null);
  const user = useSelector(state => state.user);

  const [price, setPrice] = useState("");
  const [adres, setAdres] = useState("");
  const [sehir, setSehir] = useState("");
  const [long, setLong] = useState("");
  const [lat, setLat] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [desc, setDesc] = useState("");
  const [title, setTitle] = useState("");

  async function createHouse() {
    try {
      await axios.post("http://35.173.122.10:5000/home", {
        sahipID: user.attrs.id,
        price: price,
        adres: adres,
        sehir: sehir,
        long: long,
        lat: lat,
        image_url: imageUrl,
        desc: desc,
        title: title
      });

      toast.current.show({
        severity: "success",
        summary: "SUCCESS",
        detail: "Successfully added home",
        life: 3000
      });

      setPrice("");
      setAdres("");
      setSehir("");
      setLong("");
      setLat("");
      setImageUrl("");
      setDesc("");
      setTitle("");
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <>
      <Toast ref={toast} />
      <Header />
      <div className='w-screen h-screen flex justify-center items-center'>
        <div className='w-screen h-screen flex flex-col mx-auto my-auto shadow-full-box items-center space-y-16 p-16'>
          <h1 className='text-4xl font-semibold'>Add House</h1>
          <form className='w-full max-w-lg space-y-8'>
            <div className='flex items-center gap-x-5'>
              <span className='p-float-label w-full'>
                <InputText
                  id='title'
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className='w-full'
                />
                <label htmlFor='title'>Title</label>
              </span>
              <span className='p-float-label w-full'>
                <InputText
                  id='price'
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  className='w-full'
                />
                <label htmlFor='price'>Price</label>
              </span>
            </div>
            <span className='p-float-label w-full'>
              <InputText
                id='desc'
                value={desc}
                onChange={e => setDesc(e.target.value)}
                className='w-full'
              />
              <label htmlFor='desc'>Description</label>
            </span>
            <span className='p-float-label w-full'>
              <InputText
                id='sehir'
                value={sehir}
                onChange={e => setSehir(e.target.value)}
                className='w-full'
              />
              <label htmlFor='sehir'>City</label>
            </span>
            <span className='p-float-label w-full'>
              <InputText
                id='adres'
                value={adres}
                onChange={e => setAdres(e.target.value)}
                className='w-full'
              />
              <label htmlFor='adres'>Address</label>
            </span>
            <div className='flex items-center gap-x-5'>
              <span className='p-float-label w-full'>
                <InputText
                  id='long'
                  value={long}
                  onChange={e => setLong(e.target.value)}
                  className='w-full'
                />
                <label htmlFor='long'>Longitude</label>
              </span>
              <span className='p-float-label w-full'>
                <InputText
                  id='lat'
                  value={lat}
                  onChange={e => setLat(e.target.value)}
                  className='w-full'
                />
                <label htmlFor='lat'>Latitude</label>
              </span>
            </div>
            <span className='p-float-label w-full'>
              <InputText
                id='imageUrl'
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                className='w-full'
              />
              <label htmlFor='imageUrl'>Image URLs (separate with comma)</label>
            </span>

            <button
              type='button'
              onClick={createHouse}
              className='w-full rounded-md bg-blue-600 text-white px-2 py-1 h-10'
            >
              Add House
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default addHome;
