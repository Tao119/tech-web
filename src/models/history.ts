import { db } from "@/firebase/client";
import { convertToCamelCase, convertToSnakeCase } from "@/services/convert";
import { doc, query, collection, where, Timestamp } from "firebase/firestore";
import { UserData } from "./users";
import { getDocWithCamel, getDocsWithCamel, setDocWithSnake, uploadImage } from "@/services/firestore";
import { GroupData } from "./groups";

export interface HistoryData {
    title: string;
    comment: string;
    image: string;
}

export const readHistoryData = async (groupId: string) => {
    try {
        const sushidaRef = collection(db, "history");
        const q = query(sushidaRef, where("group_id", "==", groupId));
        const querySnapshot = await getDocsWithCamel(q);

        const data = querySnapshot.docs.map(doc => {
            const d = doc.data();
            return d as HistoryData;
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
        const data = { image: imageUrl, groupId, title, comment }
        await setDocWithSnake(doc(historyRef), data);
        return { success: true, data };
    } catch (error) {
        return { success: false, error: "Failed to upload history" };
    }
}