import { db } from "@/firebase/client";
import { convertToCamelCase, convertToSnakeCase } from "@/services/convert";
import { doc, query, collection, where, Timestamp } from "firebase/firestore";
import { UserData } from "./users";
import { getDocWithCamel, getDocsWithCamel, setDocWithSnake, uploadImage } from "@/services/firestore";
import { GroupData } from "./groups";

export interface SushidaData {
    userId: string;
    course: number;
    score: number;
    typeSpeed: number;
    missNum: number;
    date: Date;
}

interface SushidaFirestoreData extends SushidaData {
    time: Timestamp;
    image: string;
}

export interface RankingData extends SushidaData {
    userName: string;
    image: string;
}

export const readSushidaDataByUserId = async (userId: string): Promise<{ success: boolean, data?: SushidaData[], error?: string }> => {
    try {
        const sushidaRef = collection(db, "sushida");
        const q = query(sushidaRef, where("user_id", "==", userId));
        const querySnapshot = await getDocsWithCamel(q);
        const data = querySnapshot.docs.map(doc => {
            const d = doc.data() as SushidaFirestoreData;
            return {
                ...d,
                date: new Date(d.time.seconds * 1000)
            } as SushidaData;
        });
        return { success: true, data };
    } catch (error) {
        return { success: false, error: "Failed to retrieve Sushida data by user ID." };
    }
};

export const readSushidaDataByGroupId = async (groupId: string): Promise<{ success: boolean, data?: RankingData[], error?: string }> => {
    try {
        const groupDocRef = doc(db, "groups", groupId);
        const groupDoc = await getDocWithCamel(groupDocRef);
        if (!groupDoc.exists()) {
            return { success: false, error: "Group not found" };
        }

        const groupData = groupDoc.data() as GroupData;
        const members = groupData.members as string[];
        if (!members) {
            return { success: false, error: "No members found in the group" };
        }

        const sushidaData: RankingData[] = [];
        for (const userId of members) {
            const sushidaRef = collection(db, "sushida");
            const q = query(sushidaRef, where("user_id", "==", userId));
            const querySnapshot = await getDocsWithCamel(q);

            const userDoc = await getDocWithCamel(doc(db, "users", userId));
            if (!userDoc.exists()) {
                console.error("User document not found");
                continue;
            }

            const user = userDoc.data() as UserData;
            if (!user) {
                console.error("Failed to convert user data");
                continue;
            }

            querySnapshot.docs.forEach(docSnapshot => {
                const sushidaDataPoint = docSnapshot.data() as SushidaFirestoreData;
                if (sushidaDataPoint) {
                    sushidaData.push({
                        userId: userId,
                        userName: user.name,
                        course: sushidaDataPoint.course,
                        score: sushidaDataPoint.score,
                        typeSpeed: sushidaDataPoint.typeSpeed,
                        missNum: sushidaDataPoint.missNum,
                        date: new Date(sushidaDataPoint.time.seconds * 1000),
                    } as RankingData);
                }
            });
        }


        return { success: true, data: sushidaData };
    } catch (error) {
        return { success: false, error: "Failed to retrieve Sushida data by group ID." };
    }
};

export const createSushidaData = async (data: SushidaData, image?: File): Promise<{ success: boolean, error?: string }> => {
    try {
        const sushidaRef = collection(db, "sushida");
        if (image) {
            const imageUrl = await uploadImage(image);
            await setDocWithSnake(doc(sushidaRef), { image: imageUrl, ...data });
        } else {
            await setDocWithSnake(doc(sushidaRef), data);
        }
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to create Sushida data." };
    }
};
