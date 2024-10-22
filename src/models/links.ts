import { db } from "@/firebase/client";
import { doc, query, collection, where, Timestamp, deleteDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { UserData, readUserById } from "./users";
import { getDocWithCamel, getDocsWithCamel, setDocWithSnake, updateDocWithSnake, uploadImage } from "@/services/firestore";
import { GroupData } from "./groups";
import { convertToCamelCase } from "@/services/convert";

export interface LinksData {
    id: string;
    userId: string;
    groupId: string;
    link: string;
    label: string;
}

export interface Links {
    link: string;
    label: string;
}

export const readLinks = async (userId: string, groupId: string) => {
    try {
        const linksRef = collection(db, "links");
        const q = query(linksRef,
            where("user_id", "==", userId),
            where("group_id", "==", groupId)
        );
        const querySnapshot = await getDocsWithCamel(q);

        const data = querySnapshot.docs.map(doc => {
            const d = convertToCamelCase(doc.data())
            return ({
                label: d.label,
                link: d.link

            } as Links)
        });
        return { success: true, data };
    } catch (error) {
        return {
            success: false, error: "Failed to read links"

        };
    }
}