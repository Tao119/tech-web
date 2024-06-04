import { DocumentData, DocumentReference, DocumentSnapshot, Query, QuerySnapshot, SetOptions, WithFieldValue, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { convertToCamelCase, convertToSnakeCase, convertToSnakeCaseWithoutFieldValue } from "./convert";

export const setDocWithSnake = async <T>(reference: DocumentReference<T>, data: WithFieldValue<T>, options?: SetOptions): Promise<void> => {
    const transformedData = convertToSnakeCaseWithoutFieldValue(data);

    return setDoc(reference, transformedData, options || {});
};

export const updateDocWithSnake = async <T>(reference: DocumentReference<T>, data: WithFieldValue<T>, options?: SetOptions): Promise<void> => {
    const transformedData = convertToSnakeCaseWithoutFieldValue(data);

    return updateDoc(reference, transformedData, options || {});
};


export async function getDocWithCamel<AppModelType, DbModelType>(
    reference: DocumentReference<DbModelType>
): Promise<DocumentSnapshot<AppModelType>> {
    const docSnapshot = await getDoc(reference);
    if (!docSnapshot.exists()) {
        return docSnapshot as Object as DocumentSnapshot<AppModelType>;
    }
    const data = convertToCamelCase(docSnapshot.data() as DbModelType) as AppModelType;
    return {
        ...docSnapshot,
        id: docSnapshot.id,
        data: () => data,
        exists: docSnapshot.exists.bind(docSnapshot)
    } as Object as DocumentSnapshot<AppModelType>;
}

export async function getDocsWithCamel<AppModelType, DbModelType>(
    query: Query<DbModelType>
): Promise<QuerySnapshot<AppModelType>> {
    const querySnapshot = await getDocs(query);
    const docs = querySnapshot.docs.map(docSnapshot => {
        const data = convertToCamelCase(docSnapshot.data() as DbModelType) as AppModelType;
        return {
            ...docSnapshot,
            id: docSnapshot.id,
            data: () => data,
            exists: docSnapshot.exists.bind(docSnapshot)
        } as Object as DocumentSnapshot<AppModelType>;
    });
    return {
        ...querySnapshot,
        docs,
        empty: docs.length === 0,
        size: docs.length
    } as Object as QuerySnapshot<AppModelType>;
}

export async function uploadImage(file: File): Promise<string> {
    const storage = getStorage();
    const fileName = encodeURIComponent(file.name);
    const storageRef = ref(storage, 'images/' + fileName);

    await uploadBytes(storageRef, file);

    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
}