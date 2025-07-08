"use client";
import Image from "next/image";
import ArrowButton from "@/app/components/Button";
import LoginImg from "../../../../public/assets/curvedMainImg.png";
import logo from "../../../../public/assets/Logo.png";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { sendOtpService } from "@/services/admin-services";
import { toast } from "sonner";
import { useDataContext } from "@/app/components/DataContext";

export default function Home() {
  const router = useRouter();
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const [isPending, startTransition] = React.useTransition()
  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(""));
 const { dataEmail, setToken } = useDataContext();
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    
    setOtpValues((prev) => {
      const newOtpValues = [...prev];
      newOtpValues[index] = value;
      return newOtpValues;
    });

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleFogetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    const otp = otpValues.join("");
    
    if (otp.length !== 6) {
      toast.error("Please enter a complete OTP");
      return;
    }

    startTransition(async () => {
      try {
        const response = await sendOtpService({ otp, value:dataEmail });
        if (response?.status === 200) {
          const token = response.data.data.token
          setToken(token)
          toast.success("OTP verified successfully");
          router.push("/change-password");
        } else {
          toast.error("Invalid OTP");
        }
      } catch (err: any) {
        if (err.status === 404) {
          toast.error("OTP not found");
        } else {
          toast.error("Something went wrong");
        }
      }
    });
  };

  return (
    <div className="w-full h-screen bg-neutral-900 relative overflow-hidden font-body flex justify-center items-center">
      {/* Blurred glow background */}
      <div className="absolute w-[916px] h-[916px] left-1/2 top-[54px] -translate-x-1/2 bg-rose-200/20 blur-[250px]" />

      {/* Auth section */}
      <div className="relative z-10 flex w-full max-w-6xl bg-transparent rounded-xl overflow-hidden flex-col md:flex-row-reverse h-full md:h-[550px] md:p-6 gap-x-16">
        {/* Left side: Image */}
        <div className="hidden md:flex flex-1 relative w-full h-auto overflow-hidden rounded-xl">
          <Image
            src={LoginImg}
            alt="Illustration"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Right side: OTP Form */}
        <form onSubmit={handleFogetPassword} className="flex-1 flex flex-col justify-center gap-5 px-6 sm:px-8 py-10 w-full">
          {/* Logo */}
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
              Enter OTP
            </h1>
            <p className="text-zinc-400 text-base font-normal">
              Please enter the OTP received on your email.{" "}
            </p>
          </div>

          {/* OTP Input Boxes */}
          <div className="self-stretch inline-flex justify-start items-start gap-5">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="flex-1">
                <input
                  type="text"
                  maxLength={1}
                  value={otpValues[idx]}
                  ref={(el) => {
                    inputRefs.current[idx] = el!;
                  }}
                  onChange={(e) => handleChange(e, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  className="w-full text-center px-3 py-5 bg-zinc-900/80 rounded-[10px] outline outline-offset-[-1px] outline-neutral-700 text-zinc-400 placeholder-zinc-400 text-base font-light font-['Kodchasan']"
                />
              </div>
            ))}
          </div>

          {/* Next Button */}
          <ArrowButton text="Next" type="submit" />
        </form>
      </div>
    </div>
  );
}