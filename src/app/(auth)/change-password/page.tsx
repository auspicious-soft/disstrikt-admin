"use client";
import Image from "next/image";
import ArrowButton from "@/app/components/Button";
import LoginImg from "../../../../public/assets/curvedMainImg.png";
import logo from "../../../../public/assets/Logo.png";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import InputField from "../../components/InputField";
import UpdatePasswordModal from "@/app/components/UpdatePasswordModal";
import { toast } from "sonner";
import { resetPassword } from "@/services/admin-services";
import { useRouter } from "next/navigation";
import { useDataContext } from "@/app/components/DataContext";

export default function Home() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();
  const { token } = useDataContext();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChangePassword = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!password && !confirmPassword) {
      toast.error("Please Enter Password and Confirm Password.");
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    startTransition(async () => {
      try {
        const response = await resetPassword({ password , token });
        if (response?.status === 200) {
          toast.success("Password updated successfully");
          setIsModalOpen(true);
          router.push("/login");
        } else {
          toast.error("Failed to update password");
        }
      } catch (err: any) {
        if (err.status === 400) {
          toast.error("Invalid password format");
        } else {
          toast.error("Something went wrong");
        }
      }
    });
  };
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
        <form
          onSubmit={handleChangePassword}
          className="flex-1 flex flex-col justify-center gap-5 px-6 sm:px-8 py-10 w-full"
        >
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
              Update Password
            </h1>
            <p className="text-zinc-400 text-base font-normal">
              Please enter new password and confirm it.
            </p>
          </div>
          {/* Form */}
          <div className="flex flex-col gap-5">
            <InputField
              type={showPassword ? "text" : "password"}
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="relative w-full">
            <InputField
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pr-12"
            />
            <div
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>

          <ArrowButton text="Update Password" type="submit" />

          <UpdatePasswordModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </form>
      </div>
    </div>
  );
}
