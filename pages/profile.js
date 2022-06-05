import { PhoneIcon } from "@heroicons/react/solid";
import axios from "axios";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Header from "../components/Header";

function profile() {
  const storeUser = useSelector(state => state.user);
  const [user, setUser] = useState(null);
  const toast = useRef(null);
  const [inputs, setInputs] = useState({});

  useEffect(() => {
    async function getUser() {
      try {
        const user = await axios.get(
          "https://ege-micro-authentication.herokuapp.com/api/v1/authentication/getProfileDataWithId",
          { params: { request_id: storeUser.attrs.id } }
        );

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
    </>
  );
}

export default profile;
