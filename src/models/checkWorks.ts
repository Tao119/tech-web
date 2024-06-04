import { db } from "@/firebase/client";
import { doc, query, collection, where, Timestamp } from "firebase/firestore";
import { UserData } from "./users";
import { getDocWithCamel, getDocsWithCamel, setDocWithSnake, uploadImage } from "@/services/firestore";
import { GroupData } from "./groups";

export interface CheckWorkData {
    userId: string;
    url: string;
    semester: string;
}

export const readCheckWorkDataByUserId = async (userId: string) => {
    try {
        const checkWorkRef = collection(db, "check_work");
        const q = query(checkWorkRef, where("user_id", "==", userId));
        const querySnapshot = await getDocsWithCamel(q);

        const data = querySnapshot.docs.map(doc => {
            const d = doc.data();
            return d as CheckWorkData;
        });
        return { success: true, data };
    } catch (error) {
        return {
            success: false, error: "Failed to read check works"
        };
    }
}
