import { db } from "@/firebase/client";
import { getDocWithCamel, getDocsWithCamel, setDocWithSnake, updateDocWithSnake } from "@/services/firestore";
import { doc, query, collection, where, arrayUnion } from "firebase/firestore";
import { GroupData } from "./groups";

export enum RequestStatus {
    pending,
    approved,
    dismissed
}

export interface GroupRequestData {
    id: string;
    userId: string;
    groupId: string;
    status: RequestStatus;
};

export const readRequestsByGroupId = async (groupId: string): Promise<{ success: boolean, data?: GroupRequestData[], error?: string }> => {
    try {
        const requestsRef = collection(db, "group_requests");
        const q = query(requestsRef, where("group_id", "==", groupId));
        const querySnapshot = await getDocsWithCamel(q);
        const data = querySnapshot.docs.map(doc => doc.data() as GroupRequestData);
        return { success: true, data };
    } catch (error) {
        return { success: false, error: "Failed to read requests by group ID." };
    }
};

export const readRequestsByUserId = async (userId: string): Promise<{ success: boolean, data?: GroupRequestData[], error?: string }> => {
    try {
        const requestsRef = collection(db, "group_requests");
        const q = query(requestsRef, where("user_id", "==", userId));
        const querySnapshot = await getDocsWithCamel(q);
        const data = querySnapshot.docs.map(doc => doc.data() as GroupRequestData);
        return { success: true, data };
    } catch (error) {
        return { success: false, error: "Failed to read requests by user ID." };
    }
};

export const readRequestsByOwnerId = async (ownerId: string): Promise<{ success: boolean, data?: GroupRequestData[], error?: string }> => {
    try {
        const requestsRef = collection(db, "group_requests");
        const q = query(requestsRef, where("owner", "==", ownerId));
        const querySnapshot = await getDocsWithCamel(q);
        const data = querySnapshot.docs.map(doc => doc.data() as GroupRequestData);
        return { success: true, data };
    } catch (error) {
        return { success: false, error: "Failed to read requests by owner ID." };
    }
};

export const createRequest = async (userId: string, groupId: string): Promise<{ success: boolean, data?: GroupRequestData, error?: string }> => {
    try {
        const groupDocRef = doc(db, "groups", groupId);
        const groupDoc = await getDocWithCamel(groupDocRef);

        if (!groupDoc.exists()) {
            return { success: false, error: "Group does not exist." };
        }

        const groupData = groupDoc.data() as GroupData;

        if (groupData.members && groupData.members.includes(userId)) {
            return { success: false, error: "User already a member of the group." };
        }

        const requestsRef = collection(db, "group_requests");
        const newRequestId = doc(requestsRef).id;

        const newRequestData: GroupRequestData = {
            id: newRequestId,
            userId: userId,
            groupId: groupId,
            status: RequestStatus.pending
        };

        await setDocWithSnake(doc(db, "group_requests", newRequestId), newRequestData);

        return { success: true, data: newRequestData };
    } catch (error) {
        return { success: false, error: "Failed to create request." };
    }
};

export const approveRequest = async (requestId: string, approve: boolean): Promise<{ success: boolean, error?: string, data?: GroupRequestData }> => {
    try {
        const requestRef = doc(db, "group_requests", requestId);
        const docSnapshot = await getDocWithCamel(requestRef);
        const requestData = docSnapshot.data() as GroupRequestData;
        if (!requestData) {
            return { success: false, error: "Request does not exist." };
        }
        if (approve) {

            await updateDocWithSnake(requestRef, {
                status: RequestStatus.approved,
            });
            const groupRef = doc(db, "groups", requestData.groupId);
            await updateDocWithSnake(groupRef, {
                members: arrayUnion(requestData.userId),
            });
            return { success: true, data: { ...requestData, status: RequestStatus.approved } };
        } else {
            await updateDocWithSnake(requestRef, {
                status: RequestStatus.dismissed,
            });
            return { success: true, data: { ...requestData, status: RequestStatus.dismissed } };
        }
    } catch (error) {
        return { success: false, error: "Failed to approve request." };
    }
};
