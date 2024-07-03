import { db } from "@/firebase/client";
import { doc, query, collection, where, Timestamp, deleteDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { UserData, readUserById } from "./users";
import { getDocWithCamel, getDocsWithCamel, setDocWithSnake, updateDocWithSnake, uploadImage } from "@/services/firestore";
import { GroupData } from "./groups";
import { convertToCamelCase } from "@/services/convert";

export interface HistoryData {
    id?: string;
    title: string;
    comment: string;
    image: string;
    like: string[];
    date: Date;
    userId: string;
    userName?: string
    userIcon?: string
}

interface HistoryFirestoreData extends HistoryData {
    time: Timestamp;
}

export const readHistoryData = async (groupId: string) => {
    try {
        const historyRef = collection(db, "history");
        const q = query(historyRef, where("group_id", "==", groupId));
        const querySnapshot = await getDocsWithCamel(q);

        const data = querySnapshot.docs.map((doc) => {
            const d = convertToCamelCase(doc.data()) as HistoryFirestoreData

            return {
                ...d,
                id: doc.id,
                date: new Date(d.time.seconds * 1000),
            } as HistoryData;
        });

        data.forEach(async (d) => {
            if (d.userId) {
                const res = await readUserById(d.userId);
                if (res.success && res.data) {
                    d.userName = res.data.name;
                    d.userIcon = res.data.image;
                }
            }
        })
        return { success: true, data };
    } catch (error) {
        return {
            success: false, error: "Failed to read history"
        };
    }
}

export const uploadHistory = async (image: File, groupId: string, userId: string, comment?: string, title?: string) => {
    try {
        const historyRef = collection(db, "history");
        const imageUrl = await uploadImage(image);
        const date = new Date();
        const time = Timestamp.fromDate(date)
        const data = { image: imageUrl, like: [], groupId, title, comment, date, time, userId } as HistoryFirestoreData
        await setDocWithSnake(doc(historyRef), data);
        data.id = historyRef.id;
        return { success: true, data: data as HistoryData };
    } catch (error) {
        return { success: false, error: "Failed to upload history" };
    }
}
export const deleteHistory = async (id: string) => {
    try {
        const historyRef = doc(db, "history", id);

        await deleteDoc(historyRef);

        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to delete history" };
    }
}

export const toggleLikePost = async (id: string, userId: string) => {
    try {
        const historyRef = doc(db, "history", id);
        const docSnap = await getDocWithCamel(historyRef);

        if (!docSnap.exists()) {
            throw new Error("Document does not exist!");
        }

        const data = docSnap.data() as HistoryFirestoreData;
        let updatedData;
        if (data.like && data.like.includes(userId)) {
            updatedData = { like: arrayRemove(userId) };
        } else {
            updatedData = { like: arrayUnion(userId) };
        }

        await updateDocWithSnake(historyRef, updatedData);

        return { success: true };
    } catch (error) {
        console.error("Error toggling like on post:", error);
        return { success: false, error: "Failed to toggle like on post" };
    }
}