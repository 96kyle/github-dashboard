import { LoginButton } from "@/components/LoginButton";
import { LogoutButton } from "@/components/LogoutButton";
import { format } from "date-fns-tz";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSession } from "next-auth/react";

export default function ActivityHeader({
  username,
  moveMonth,
  selectedDate,
}: {
  username: string;
  moveMonth: (isPrev: boolean) => Promise<void>;
  selectedDate: string;
}) {
  const { data: session } = useSession();

  return (
    <div className="w-full bg-white p-4 text-xl  border-b-2 border-gray-300 text-fontNavy flex flex-row justify-between items-center sticky top-0 z-50 ">
      <div>
        <span>{`${username}님의 Dashboard`}</span>
      </div>
      <div className="flex flex-row items-center justify-center">
        <ChevronLeft
          size={24}
          className="cursor-pointer self-center mb-1"
          onClick={() => moveMonth(true)}
        />
        <div className="text-xl font-semibold text-fontNavy px-2 cursor-pointer border-b-1">
          {format(selectedDate, "yyyy년 M월", {
            timeZone: "Asia/Seoul",
          })}
        </div>

        <ChevronRight
          size={24}
          className="cursor-pointer self-center mb-1"
          onClick={() => moveMonth(false)}
        />
      </div>
      {!session ? <LoginButton /> : <LogoutButton />}
    </div>
  );
}
