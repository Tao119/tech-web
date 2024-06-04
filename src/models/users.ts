import { db } from "@/firebase/client";
import {
    convertToCamelCase
} from "@/services/convert";
import { setDocWithSnake } from "@/services/firestore";
import { doc, getDoc, } from "firebase/firestore";

export interface UserData {
    id: string;
    email: string;
    name: string;
    isAdmin: boolean;
};

export const readUserById = async (id: string): Promise<{ success: boolean, data?: UserData, error?: string }> => {
    try {
        const userDoc = await getDoc(doc(db, "users", id));
        if (!userDoc.exists()) {
            return { success: false, error: "User not found." };
        }
        return { success: true, data: { id, ...convertToCamelCase(userDoc.data()) } as UserData };
    } catch (error) {
        return { success: false, error: "Failed to retrieve user by ID." };
    }
}

export const createUser = async (id: string, email: string, name: string): Promise<{ success: boolean, error?: string }> => {
    try {
        await setDocWithSnake(doc(db, "users", id), {
            email: email,
            name: name,
            isAdmin: false,
        });
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to create user." };
    }
}
