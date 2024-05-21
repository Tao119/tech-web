"use client"
import { Dispatch, useState } from "react";

export type GroupSelect = {
    selectedGroup: string;
    setGroup: Dispatch<string>
}

export const useGroupSelect = (): GroupSelect => {
    const [selectedGroup, setGroup] = useState("")
    return { selectedGroup, setGroup }
}