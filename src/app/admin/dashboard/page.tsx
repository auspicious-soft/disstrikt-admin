"use client";
import Image from "next/image";
import ArrowButton from "@/app/components/Button";
import LoginImg from "../../../../public/assets/curvedMainImg.png";
import logo from "../../../../public/assets/Logo.png";
import InputField from "../../components/InputField";
import { useRouter } from "next/navigation";

export default function Home() {
const router = useRouter();

const handleFogetPassword = () =>{
    router.push("/otp")
}
  return (
    <div className="w-full h-screen bg-neutral-900 relative overflow-hidden font-body flex justify-center items-center">
      <div className="absolute w-[916px] h-[916px] left-1/2 top-[54px] -translate-x-1/2 bg-rose-200/20 blur-[250px]" />
      <div className="relative z-10 flex w-full max-w-6xl bg-transparent rounded-xl overflow-hidden flex-col md:flex-row-reverse h-full md:h-[550px] md:p-6 gap-x-16">
        <div className="hidden md:flex flex-1 relative w-full h-auto overflow-hidden rounded-xl">
          <Image
            src={LoginImg}
            alt="Illustration"
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="flex-1 flex flex-col justify-center gap-5 px-6 sm:px-8 py-10 w-full">
          <div className="w-full flex justify-start">
            <Image
              src={logo}
              alt="logo"
              className="w-32 h-10 sm:w-36 sm:h-11 md:w-32 md:h-10 transition-all"
            />
          </div>
          {/* Heading */}
          <div className="flex flex-col gap-2">
            <h1 className="text-stone-200 text-3xl font-extrabold font-heading capitalize">
              Forgot Password?
            </h1>
            <p className="text-zinc-400 text-base font-normal">
              Please enter your email address to reset your password.{" "}
            </p>
          </div>
          {/* Form */}
          <div className="flex flex-col gap-5">
            <InputField type="email" placeholder="Email Address" />
            </div>
            <ArrowButton
              text="Next"
              onClick={handleFogetPassword}
            />
          </div>
        </div>
      </div>

  );
}
