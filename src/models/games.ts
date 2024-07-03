import { db } from "@/firebase/client";
import { doc, query, collection, where, Timestamp, deleteDoc, arrayRemove, arrayUnion } from "firebase/firestore";
import { UserData, readUserById } from "./users";
import { getDocWithCamel, getDocsWithCamel, setDocWithSnake, updateDocWithSnake, uploadImage } from "@/services/firestore";
import { GroupData } from "./groups";
import { convertToCamelCase } from "@/services/convert";

export interface RecommendedGameData {
    id?: string;
    title: string;
    comment: string;
    link: string;
    image: string;
    like: string[];
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
        const data = { image: imageUrl, like: [], groupId, title, comment, date, time, userId, link } as RecommendedGameFireStoreData
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
export const toggleLikePost = async (id: string, userId: string) => {
    try {
        const historyRef = doc(db, "games", id);
        const docSnap = await getDocWithCamel(historyRef);

        if (!docSnap.exists()) {
            throw new Error("Document does not exist!");
        }

        const data = docSnap.data() as RecommendedGameFireStoreData;
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