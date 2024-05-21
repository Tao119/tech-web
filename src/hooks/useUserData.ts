"use client"
import { UserData } from "@/models/users";
import { Dispatch, useState } from "react";

export type UserDataContext = {
    userData: UserData | undefined,
    setUserData: Dispatch<UserData>
}

export const useUserData = (): UserDataContext => {
    const [userData, setUserData] = useState<UserData>()
    return { userData, setUserData }
}