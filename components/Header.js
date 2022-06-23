import Image from "next/image";
import {
  SearchIcon,
  GlobeAltIcon,
  MenuIcon,
  UserCircleIcon,
  UsersIcon,
  LockClosedIcon,
  UserIcon
} from "@heroicons/react/solid";
import { LogoutIcon } from "@heroicons/react/outline";
import { useEffect, useRef, useState } from "react";
import "react-date-range/dist/styles.css"; // React-Date-Range, Main style file
import "react-date-range/dist/theme/default.css"; // React-Date-Range, Theme CSS file
import { DateRangePicker } from "react-date-range";
import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import axios from "axios";
import { setUser } from "../store/reducer/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

function Header({ placeholder = "Start your search" }) {
  const [searchInput, setSearchInput] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [guestNumber, setGuestNumber] = useState(2);
  const [scrollY, setScrollY] = useState(0);
  const [loginDialog, setLoginDialog] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const toast = useRef(null);
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  const handleSelect = ranges => {
    setStartDate(ranges.selection.startDate);
    setEndDate(ranges.selection.endDate);
  };

  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: "selection"
  };

  const resetInput = () => {
    setSearchInput("");
  };

  const search = () => {
    if (router.pathname.split("/")[1] === "search") {
      router.push({
        pathname: "/search",
        query: {
          location: searchInput,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          guestNumber
        }
      });
      setTimeout(() => {
        window.history.go();
      }, 500);
    } else {
      router.push({
        pathname: "/search",
        query: {
          location: searchInput,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          guestNumber
        }
      });
    }
  };

  function logit() {
    setScrollY(window.pageYOffset);
  }

  function checkUser() {
    axios
      .get(
        "https://ege-micro-authentication.herokuapp.com/api/v1/authentication/checkLogin",
        { params: { email: username, password: password } }
      )
      .then(res => {
        if (!res.data) {
          toast.current.show({
            severity: "error",
            summary: "ERROR",
            detail: "Invalid username or password",
            life: 3000
          });
          return;
        }

        try {
          dispatch(setUser(res.data));
          toast.current.show({
            severity: "success",
            summary: "SUCCESS",
            detail: "Successfully signed in",
            life: 3000
          });
          setLoginDialog(false);
        } catch (e) {
          toast.current.show({
            severity: "error",
            summary: "ERROR",
            detail: e.message,
            life: 3000
          });
        }
      });
  }

  function signOut() {
    dispatch(setUser(null));
    router.push("/");
    toast.current.show({
      severity: "success",
      summary: "SUCCESS",
      detail: "Successfully signed out",
      life: 3000
    });
  }

  function becomeHost() {
    const confirm1 = () => {
      confirmDialog({
        message: "Are you sure you want to become a host?",
        header: "Confirmation",
        icon: "pi pi-exclamation-triangle",
        accept: async () => {
          const addHost = await axios.post(
            "http://35.173.122.10:5000/home",
            {}
          );
        },
        reject: () => {}
      });
    };
  }

  useEffect(() => {
    function watchScroll() {
      window.addEventListener("scroll", logit);
    }

    watchScroll();

    return () => {
      window.removeEventListener("scroll", logit);
    };
  });

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        header='Sign In'
        dismissableMask
        visible={loginDialog}
        className='w-full max-w-[30vw]'
        contentClassName='!py-5 flex flex-col items-center space-y-8 !overflow-visible'
        onHide={() => setLoginDialog(false)}
      >
        <div className='flex items-center space-x-2 w-full'>
          <UserCircleIcon className='w-8 h-8' />
          <span className='p-float-label w-full'>
            <InputText
              id='username'
              value={username}
              onChange={e => setUsername(e.target.value)}
              className='w-full'
            />
            <label htmlFor='username'>Username</label>
          </span>
        </div>
        <div className='flex items-center space-x-2 w-full'>
          <LockClosedIcon className='w-8 h-8' />
          <span className='p-float-label w-full flex items-center space-x-1'>
            <Password
              id='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              className='w-full'
              inputClassName='!w-full'
              feedback={false}
            />
            <label htmlFor='password'>Password</label>
          </span>
        </div>
        <Button onClick={checkUser} label='Sign In' icon='pi pi-sign-in' />
      </Dialog>
      <header
        className={`${
          router.pathname === "/" ? "fixed" : "sticky shadow-md"
        } w-full top-0 z-50 grid grid-cols-3 p-5 md:px-10 duration-300 bg-white ${
          router.pathname === "/" &&
          (scrollY > 0 ? "shadow-md" : "bg-transparent")
        }`}
      >
        {/* ### LEFT - Logo ### */}
        <div
          onClick={() => router.push("/")}
          className='relative flex items-center space-x-2 h-10 cursor-pointer my-auto hover:scale-125 transition duration-150 invert select-none'
        >
          <Image
            src='/assets/images/logo.svg'
            layout='fill'
            objectFit='contain'
            objectPosition='center'
          />
        </div>

        {/* ### MIDDLE - Search Bar ### */}
        <div
          className={`flex items-center md:border-2 rounded-full py-2 md:shadow-sm focus-within:border-red-400 hover:border-red-400 transition duration-150 ease-out ${
            router.pathname === "/" &&
            (scrollY > 0 ? "" : "translate-y-24 scale-125")
          }`}
        >
          <input
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            type='text'
            placeholder={placeholder}
            className={`bg-transparent flex-grow pl-5 outline-none text-sm ${
              router.pathname === "/" &&
              (scrollY > 0
                ? "text-gray-600 placeholder-gray-400"
                : "text-gray-300 placeholder-gray-300")
            }`}
          />
          <SearchIcon className='hidden md:inline-flex h-8 bg-red-400 text-white rounded-full p-2 cursor-pointer md:mx-2 hover:text-red-400 hover:bg-white hover:border-2 hover:border-red-400 transition duration-150' />
        </div>

        {/* ### RIGHT ### */}
        <div
          className={`flex items-center space-x-4 justify-end ${
            router.pathname === "/" &&
            (scrollY > 0 ? "text-gray-500" : "text-white")
          }`}
        >
          <div className='flex items-center divide-x-2 divide-gray-100 space-x-1 border-2 p-2 rounded-full cursor-pointer font-medium'>
            <div className='flex space-x-1 hover:text-red-400 duration-150 !pr-1'>
              <GlobeAltIcon className='h-6 cursor-pointer' />
              <p className='hidden md:inline cursor-pointer'>Become a host</p>
            </div>

            {!user?.attrs && (
              <button
                onClick={() => setLoginDialog(true)}
                className='flex items-center space-x-2 !pl-2 hover:text-red-400 duration-150 cursor-pointer font-medium'
              >
                {/* <MenuIcon className="h-6" /> */}
                <p className='hidden md:inline cursor-pointer'>Sign In</p>
                <UserCircleIcon className='h-6' />
              </button>
            )}

            {user?.attrs && (
              <Link href='/profile'>
                <div className='flex items-center space-x-2 !pl-2 hover:text-red-400 duration-150 cursor-pointer font-medium'>
                  {/* <MenuIcon className="h-6" /> */}
                  <p className='hidden md:inline cursor-pointer'>Profile</p>
                  <UserIcon className='h-6' />
                </div>
              </Link>
            )}
            {user?.attrs && (
              <button className='!pl-2'>
                <LogoutIcon
                  onClick={signOut}
                  className='w-6 h-6 hover:text-red-400 duration-150'
                />
              </button>
            )}
          </div>
        </div>

        {searchInput && (
          <div
            className={`flex flex-col col-span-3 mx-auto bg-white p-5 rounded-b-3xl duration-150 ease-out ${
              router.pathname === "/" &&
              (scrollY > 0 ? "" : "translate-y-32 scale-110")
            }`}
          >
            <DateRangePicker
              ranges={[selectionRange]}
              minDate={new Date()}
              rangeColors={["#FD5B61"]}
              onChange={handleSelect}
            />

            <div className='flex items-center border-bottom mb-4'>
              <h2 className='text-2xl flex-grow font-semibold'>
                Number of Guests
              </h2>

              <UsersIcon className='h-5' />
              <input
                type='number'
                value={guestNumber}
                onChange={e => setGuestNumber(e.target.value)}
                className='w-12 pl-2 text-lg outline-none text-red-400'
                min={1}
              />
            </div>

            <div className='flex'>
              <button onClick={resetInput} className='flex-grow text-gray-500'>
                Cancel
              </button>
              <button onClick={search} className='flex-grow text-red-400'>
                Search
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

export default Header;
