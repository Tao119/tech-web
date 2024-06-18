import { db } from "@/firebase/client";
import { doc, query, collection, where, Timestamp, deleteDoc } from "firebase/firestore";
import { UserData, readUserById } from "./users";
import { getDocWithCamel, getDocsWithCamel, setDocWithSnake, uploadImage } from "@/services/firestore";
import { GroupData } from "./groups";
import { convertToCamelCase } from "@/services/convert";

export interface ProductData {
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

interface ProductFireStoreData extends ProductData {
    time: Timestamp;
}

export const readProductData = async (groupId: string) => {
    try {
        const productRef = collection(db, "products");
        const q = query(productRef, where("group_id", "==", groupId));
        const querySnapshot = await getDocsWithCamel(q);

        const data = querySnapshot.docs.map((doc) => {
            const d = convertToCamelCase(doc.data()) as ProductFireStoreData
            return {
                ...d,
                id: doc.id,
                date: new Date(d.time.seconds * 1000),
            } as ProductData;
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
            success: false, error: "Failed to read products"
        };
    }
}

export const uploadProduct = async (groupId: string, userId: string, title: string, comment?: string, link?: string, image?: File) => {
    try {
        const productRef = collection(db, "products");
        let imageUrl;
        if (image) {
            imageUrl = await uploadImage(image);
        } else {
            imageUrl = null;
        }
        const date = new Date();
        const time = Timestamp.fromDate(date)
        const data = { image: imageUrl, like: 0, groupId, title, comment, date, time, userId, link } as ProductFireStoreData
        await setDocWithSnake(doc(productRef), data);
        data.id = productRef.id;
        return { success: true, data: data as ProductData };
    } catch (error) {
        return { success: false, error: "Failed to upload products" };
    }
}
export const deleteProduct = async (id: string) => {
    try {
        const productRef = doc(db, "products", id);

        await deleteDoc(productRef);

        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to delete products" };
    }
}