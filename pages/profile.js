import { PhoneIcon, TrashIcon } from "@heroicons/react/solid";
import axios from "axios";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import Image from "next/image";
import { ConfirmDialog } from "primereact/confirmdialog"; // To use <ConfirmDialog> tag
import { confirmDialog } from "primereact/confirmdialog"; // To use confirmDialog method

function profile() {
  const storeUser = useSelector(state => state.user);
  const [user, setUser] = useState(null);
  const toast = useRef(null);
  const [inputs, setInputs] = useState({});
  const [reservation, setReservation] = useState(null);

  function dateToString(date) {
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  }

  useEffect(() => {
    async function getUser() {
      try {
        const user = await axios.get(
          "https://ege-micro-authentication.herokuapp.com/api/v1/authentication/getProfileDataWithId",
          { params: { request_id: storeUser.attrs.id } }
        );

        const reservation = await axios.get(
          "https://ege-micro-reservation.herokuapp.com/api/v1/reservation/getMyReservationsUser",
          { params: { id: storeUser.attrs.id } }
        );

        const homes = await axios.get("http://35.173.122.10:5000/home", {
          headers: {
            sahipID: "629cc9c1a71b0d58149e3880"
          }
        });
        console.log(homes);

        if (!user.data) {
          toast.current.show({
            severity: "error",
            summary: "ERROR",
            detail: "No user found! Redirecting...",
            life: 3000
          });
          setTimeout(() => {
            const router = useRouter();
            router.push("/");
          });
        } else {
          console.log(user.data);
          setUser(user.data);
          setInputs({ ...user.data });
        }

        if (!reservation.data) {
          toast.current.show({
            severity: "error",
            summary: "ERROR",
            detail: "No reservation found!",
            life: 3000
          });
        } else {
          console.log(reservation.data);
          setReservation(reservation.data);
        }
      } catch (e) {
        toast.current.show({
          severity: "error",
          summary: "ERROR",
          detail: e.message,
          life: 3000
        });
      }
    }

    getUser();
  }, []);

  async function updateUser() {
    try {
      const res = await axios.post(
        "https://ege-micro-authentication.herokuapp.com/api/v1/authentication/updateUserData",
        inputs
      );

      if (res.status === 200) {
        toast.current.show({
          severity: "success",
          summary: "SUCCESS",
          detail: "Successfully updated",
          life: 3000
        });
      }
    } catch (e) {
      toast.current.show({
        severity: "error",
        summary: "ERROR",
        detail: e.message,
        life: 3000
      });
    }
  }

  function handleInputChange(e) {
    setInputs({ ...inputs, [e.target.id]: e.target.value });
  }

  async function removeReservation(home_id) {
    const confirm1 = () => {
      confirmDialog({
        message: `Are you sure you want remove the reservation for ${home_id}?`,
        header: "Confirmation",
        icon: "pi pi-exclamation-triangle",
        accept: () => {},
        reject: () => {}
      });
    };
  }

  return (
    <>
      {/* Header */}
      <Header />
      <div className='h-[calc(100vh-92px)] w-screen flex justify-center p-16'>
        <Toast ref={toast} />
        {user && (
          <div className='w-full max-w-7xl mx-auto'>
            <div className='flex flex-col items-center'>
              <img
                src={user.image_url}
                alt=''
                className='h-36 w-36 rounded-full mb-3'
              />

              <div className='space-y-3 text-center'>
                <h1 className='text-4xl font-semibold'>
                  {user.name} {user.surname}
                </h1>
                <p className='text-gray-500'>{user.desc}</p>
                <div className='flex justify-center items-center space-x-1.5 mx-auto text-center'>
                  <PhoneIcon className='h-4 w-4' />
                  <p>{user.phone_no}</p>
                </div>
              </div>
            </div>

            <div className='w-full flex flex-col rounded-lg space-y-8 p-8 mt-5 shadow-full-box'>
              <h2 className='text-2xl font-medium !mb-5'>Edit Profile</h2>
              <div className='flex items-center space-x-3'>
                <span className='p-float-label w-full'>
                  <InputText
                    id='name'
                    value={inputs.name}
                    onChange={handleInputChange}
                    className='w-full'
                  />
                  <label htmlFor='name'>Name</label>
                </span>
                <span className='p-float-label w-full'>
                  <InputText
                    id='Surname'
                    value={inputs.surname}
                    onChange={handleInputChange}
                    className='w-full'
                  />
                  <label htmlFor='Surname'>Surname</label>
                </span>
              </div>
              <span className='p-float-label w-full'>
                <InputTextarea
                  id='description'
                  value={inputs.desc}
                  onChange={handleInputChange}
                  className='w-full'
                />
                <label htmlFor='description'>Description</label>
              </span>
              <div className='flex items-center space-x-3'>
                <span className='p-float-label w-full'>
                  <InputText
                    id='cinsiyet'
                    value={inputs.cinsiyet}
                    onChange={handleInputChange}
                    className='w-full'
                  />
                  <label htmlFor='cinsiyet'>Gender</label>
                </span>
                <span className='p-float-label w-full'>
                  <InputText
                    id='phone_no'
                    value={inputs.phone_no}
                    onChange={handleInputChange}
                    className='w-full'
                  />
                  <label htmlFor='phone_no'>Phone Number</label>
                </span>
                <span className='p-float-label w-full'>
                  <InputText
                    id='email'
                    value={inputs.email}
                    onChange={handleInputChange}
                    className='w-full'
                  />
                  <label htmlFor='email'>Email</label>
                </span>
              </div>

              <Button
                onClick={updateUser}
                className='edit-button'
                label='Edit'
                icon='pi pi-user-edit'
              />
            </div>
          </div>
        )}
      </div>
      <div className='h-[calc(100vh-92px)] mx-auto w-full max-w-7xl p-16'>
        <div className='space-y-3 text-center w-full'>
          {reservation &&
            reservation.map(res => (
              <div
                key={res.id}
                className='h-32 w-full shadow-full-box rounded-lg flex items-center gap-x-5 p-2'
              >
                <div className='h-28 w-28 relative rounded-md overflow-hidden'>
                  <Image
                    src='https://www.klasiksanatlar.com/img/sayfalar/b/1_1598452306_resim.png'
                    layout='fill'
                  />
                </div>

                <div className='flex flex-col gap-y-1'>
                  <h1 className='text-xl font-semibold text-left'>
                    {res.home_id}
                  </h1>
                  <h2>
                    {dateToString(res.start_date)} -{" "}
                    {dateToString(res.end_date)}
                  </h2>
                </div>

                <div className='ml-auto mr-5'>
                  <TrashIcon className='h-12 w-12 p-1.5 rounded-lg bg-red-300 text-red-600 hover:bg-red-400 duration-100' />
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

export default profile;
