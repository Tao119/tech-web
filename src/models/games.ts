import { db } from "@/firebase/client";
import { doc, query, collection, where, Timestamp, deleteDoc } from "firebase/firestore";
import { UserData, readUserById } from "./users";
import { getDocWithCamel, getDocsWithCamel, setDocWithSnake, uploadImage } from "@/services/firestore";
import { GroupData } from "./groups";
import { convertToCamelCase } from "@/services/convert";

export interface RecommendedGameData {
    id?: string;
    title: string;
    comment: string;
    link: string;
    image: string;
    like: number;
    date: Date;
    userId: string;
    userName?: string;
    userIcon?: string;
}

interface RecommendedGameFireStoreData extends RecommendedGameData {
    time: Timestamp;
}

export const readRecommendedGameData = async (groupId: string) => {
    try {
        const gamesRef = collection(db, "games");
        const q = query(gamesRef, where("group_id", "==", groupId));
        const querySnapshot = await getDocsWithCamel(q);

        const data = querySnapshot.docs.map((doc) => {
            const d = convertToCamelCase(doc.data()) as RecommendedGameFireStoreData
            return {
                ...d,
                id: doc.id,
                date: new Date(d.time.seconds * 1000),
            } as RecommendedGameData;
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
            success: false, error: "Failed to read games"
        };
    }
}

export const uploadRecommendedGame = async (groupId: string, userId: string, title: string, comment?: string, link?: string, image?: File) => {
    try {
        const gamesRef = collection(db, "games");
        let imageUrl;
        if (image) {
            imageUrl = await uploadImage(image);
        } else {
            imageUrl = null;
        }
        const date = new Date();
        const time = Timestamp.fromDate(date)
        const data = { image: imageUrl, like: 0, groupId, title, comment, date, time, userId, link } as RecommendedGameFireStoreData
        await setDocWithSnake(doc(gamesRef), data);
        data.id = gamesRef.id;
        return { success: true, data: data as RecommendedGameData };
    } catch (error) {
        return { success: false, error: "Failed to upload games" };
    }
}
export const deleteRecommendedGame = async (id: string) => {
    try {
        const gamesRef = doc(db, "games", id);

        await deleteDoc(gamesRef);

        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to delete games" };
    }
}