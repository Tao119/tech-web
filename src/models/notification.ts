import { db } from "@/firebase/client";
import {
    convertToCamelCase,
} from "@/services/convert";
import { doc, query, collection, where, Timestamp } from "firebase/firestore";
import { UserData } from "./users";
import { getDocWithCamel, getDocsWithCamel, setDocWithSnake, updateDocWithSnake, uploadImage } from "@/services/firestore";

export enum NotificationType {
    text,
    request
}

export interface NotificationData {
    id?: string;
    userId: string;
    type: NotificationType;
    content: string;
    title: string;
    requestId?: string;
    read: boolean;
    date: Date;
}

interface NotificationFirestoreData extends NotificationData {
    time: Timestamp;
}
export const readNotificationDataByUserId = async (userId: string) => {
    try {
        const checkWorkRef = collection(db, "notification");
        const q = query(checkWorkRef, where("user_id", "==", userId));
        const querySnapshot = await getDocsWithCamel(q);

        const data: NotificationData[] = querySnapshot.docs.map(doc => {
            const data = convertToCamelCase(doc.data())
            return ({
                id: doc.id,
                ...data,
                date: new Date(data.time?.seconds * 1000)
            } as NotificationData)
        });
        return { success: true, data };
    } catch (error) {
        return {
            success: false, error: "Failed to read notifications"
        };
    }
}

export const uploadNotification = async (data: NotificationFirestoreData) => {
    try {
        const notificationRef = collection(db, "notification");
        await setDocWithSnake(doc(notificationRef), data);
        return { success: true };
    } catch (error) {
        console.log(error)
        return {
            success: false, error: "Failed to upload notifications"
        };
    }
}

export const updateReadStatus = async (notificationId: string, status: boolean) => {
    try {
        const notificationRef = doc(db, "notification", notificationId);
        await updateDocWithSnake(notificationRef, {
            read: status
        });
    } catch (error) {
        return {
            success: false, error: "Failed to update read status"
        };
    }
}