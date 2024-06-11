import { db } from "@/firebase/client";
import { doc, query, collection, where, Timestamp } from "firebase/firestore";
import { UserData } from "./users";
import { getDocWithCamel, getDocsWithCamel, setDocWithSnake, uploadImage } from "@/services/firestore";
import { GroupData } from "./groups";
import { convertToCamelCase } from "@/services/convert";

export interface HistoryData {
    title: string;
    comment: string;
    image: string;
    like: number;
    date: Date;
}

interface HistoryFirestoreData extends HistoryData {
    time: Timestamp;
}

export const readHistoryData = async (groupId: string) => {
    try {
        const historyRef = collection(db, "history");
        const q = query(historyRef, where("group_id", "==", groupId));
        const querySnapshot = await getDocsWithCamel(q);

        const data = querySnapshot.docs.map(doc => {
            const d = convertToCamelCase(doc.data())
            return {
                ...d,
                date: new Date(d.time.seconds * 1000)
            } as HistoryData;
        });
        return { success: true, data };
    } catch (error) {
        return {
            success: false, error: "Failed to read history"
        };
    }
}

export const uploadHistory = async (image: File, groupId: string, comment?: string, title?: string) => {
    try {
        const historyRef = collection(db, "history");
        const imageUrl = await uploadImage(image);
        const date = new Date();
        const time = Timestamp.fromDate(date)
        const data = { image: imageUrl, like: 0, groupId, title, comment, date, time } as HistoryFirestoreData
        await setDocWithSnake(doc(historyRef), data);
        return { success: true, data: data as HistoryData };
    } catch (error) {
        return { success: false, error: "Failed to upload history" };
    }
}