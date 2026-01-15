import { getServerSession } from "next-auth"
import { authOptions } from "./options"
import { NextResponse } from "next/server";

export async function getSession () {
    return await getServerSession(authOptions);
}

export async function needsAdmin() {
    const session = await getSession();
    if (!session || !session.user) {
        return false; 
    }
    else {
        return true;
    }
}