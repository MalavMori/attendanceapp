"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function Logo({closeSideBar}) {
  const router = useRouter();
  return (
    <>
      <div
        onClick={() => {
          router.push("/");
          closeSideBar()
        }}
        className="flex items-center cursor-pointer"
      >
        <Image
          src={"/attendencelogo.png"}
          alt={"logo"}
          width={50}
          height={50}
        />
        <h2>Attendece</h2>
      </div>
    </>
  );
}
