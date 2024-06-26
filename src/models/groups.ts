import { db } from "@/firebase/client";
import { convertToCamelCase } from "@/services/convert";
import { getDocsWithCamel, setDocWithSnake } from "@/services/firestore";
import { doc, getDoc, query, collection, getDocs, where } from "firebase/firestore";
import { readUserById } from "./users";

export interface GroupData {
    id: string;
    members?: string[];
    membersName?: string[];
    name: string;
    owner?: string;
    facebook?: string;
    messenger?: string;
};

// Read groups by user ID
export const readGroupsByUserId = async (userId: string): Promise<{ success: boolean, data?: GroupData[], error?: string }> => {
    try {
        const groupsRef = collection(db, "groups");
        const q = query(groupsRef, where("members", "array-contains", userId));
        const querySnapshot = await getDocsWithCamel(q);
        const groups: GroupData[] = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...convertToCamelCase(doc.data())
        }));
        groups.forEach((g) => {
            g.membersName = [];

            g.members?.forEach(async (m) => {
                const user = await readUserById(m);
                const name = user.data?.name;
                if (name) {
                    g.membersName?.push(name)
                }
            })
        })
        return { success: true, data: groups };
    } catch (error) {
        return { success: false, error: "Failed to read groups by user ID." };
    }
};

// Read a group by its ID
export const readGroupById = async (id: string): Promise<{ success: boolean, data?: GroupData, error?: string }> => {
    try {
        const groupDoc = await getDoc(doc(db, "groups", id));
        if (!groupDoc.exists()) {
            return { success: false, error: "Group not found." };
        }
        const data = { id, ...convertToCamelCase(groupDoc.data()) } as GroupData
        data.membersName = [];

        data.members?.forEach(async (m) => {
            const user = await readUserById(m);
            const name = user.data?.name;
            if (name) {
                data.membersName?.push(name)
            }
        })

        return { success: true, data: data };
    } catch (error) {
        console.log(error)
        return { success: false, error: "Failed to read group by ID." };
    }
}

// Create a group
export const createGroup = async (name: string, owner: string): Promise<{ success: boolean, data?: GroupData, error?: string }> => {
    try {
        const groupId = await generateGroupId();
        if (!groupId) {
            return { success: false, error: "Failed to generate a unique group ID." };
        }

        const newGroupData = {
            id: groupId,
            name: name,
            owner: owner,
            members: [owner]
        };

        await setDocWithSnake(doc(db, "groups", groupId), newGroupData);
        return { success: true, data: newGroupData };
    } catch (error) {
        return { success: false, error: "Failed to create group." };
    }
}

const generateGroupId = async (): Promise<string | null> => {
    try {
        const groupsQuery = query(collection(db, "groups"));
        const querySnapshot = await getDocs(groupsQuery);
        const existingIds = new Set<string>(querySnapshot.docs.map(doc => doc.id));

        let id;
        do {
            id = Math.floor(Math.random() * 1000000).toString().padStart(6, "0");
        } while (existingIds.has(id));
        return id;
    } catch (error) {
        console.error("Error generating group ID:", error);
        return null;
    }
};
