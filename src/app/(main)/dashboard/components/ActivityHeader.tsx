import { LoginButton } from "@/components/LoginButton";
import { LogoutButton } from "@/components/LogoutButton";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSession } from "next-auth/react";

export default function ActivityHeader({
  username,
  moveMonth,
  selectedDate,
}: {
  username: string;
  moveMonth: (isPrev: boolean) => Promise<void>;
  selectedDate: Date;
}) {
  const { data: session, status } = useSession();

  return (
    <div className="w-full bg-white p-4 text-xl  border-b-2 border-gray-300 text-fontNavy flex flex-row justify-between items-center">
      <div>
        <span className="font-semibold">{username}</span>'s Dashboard
      </div>
      <div className="flex flex-row items-center justify-center">
        <ChevronLeft
          size={24}
          className="cursor-pointer self-center"
          onClick={() => moveMonth(true)}
        />
        <div className="text-xl font-semibold text-fontNavy px-2">
          {format(selectedDate, "yyyy년 M월")}
        </div>
        <ChevronRight
          size={24}
          className="cursor-pointer self-center"
          onClick={() => moveMonth(false)}
        />
      </div>
      {!session ? <LoginButton /> : <LogoutButton />}
    </div>
  );
}
