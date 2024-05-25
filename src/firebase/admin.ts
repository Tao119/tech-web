import { FFSA_PRIVATE_KEY, FSA_CLIENT_EMAIL, FSA_PROJECT_ID } from "@/constant/env";
import { convertToSnakeCase } from "@/services/convert";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
console.log(convertToSnakeCase({
    projectId: FSA_PROJECT_ID,
    privateKey: FFSA_PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: FSA_CLIENT_EMAIL,
}))

export const firebaseAdmin =
    getApps()[0] ??
    initializeApp({
        credential: cert(convertToSnakeCase({
            projectId: FSA_PROJECT_ID,
            privateKey: FFSA_PRIVATE_KEY.replace(/\\n/g, '\n'),
            clientEmail: FSA_CLIENT_EMAIL,
        })),
    });

export const auth = getAuth();