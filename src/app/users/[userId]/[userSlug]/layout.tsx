import { avatars } from "@/models/client/config";
import {users} from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import React from "react";
import { IconUserFilled, IconClockFilled } from "@tabler/icons-react";
import convertDateToRelativeTime from "@/utils/relativeTime";
import Navbar from "./Navbar";
const Layout = async ({
  params,
  children,
}: {
  children: React.ReactNode;
  params: { userId: string; userSlug: string };
}) => {
    const user = await users.get<UserPrefs>(params.userId)

    return (
      <div className="container relative bg-slate-950 mx-auto p-2 px-12 mt-32 space-y-2">
        <div className="flex border-red-200 rounded-xl gap-4 border-2 p-2">
          <div className="w-40 shrink-0 border-2">
            <picture className="block w-full rounded-xl bg-red-400">
              <img
                src={avatars.getInitials(user.name, 200, 200)}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </picture>
          </div>
          <div className="w-full flex items-start justify-between">
            <div>
              <h1 className="font-bold text-2xl">{user.name}</h1>
              <p className="text-lg">{user.email}</p>
              <p className="flex gap-1 items-center text-sm">
                <IconUserFilled className="w-4 shrink-0" /> Dropped{" "}
                {convertDateToRelativeTime(new Date(user.$createdAt))}
              </p>
              <p className="flex gap-1 items-center text-sm">
                <IconClockFilled className="w-4 shrink-0" /> Last Activity{" "}
                {convertDateToRelativeTime(new Date(user.$updatedAt))}
              </p>
            </div>
            
          </div>
        </div>

        <div className="flex">
          <Navbar />
          <div className="w-full">{children}</div>
        </div>
      </div>
    );
};

export default Layout
