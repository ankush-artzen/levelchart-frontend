import { NextResponse } from "next/server";
import {
    getShopIntegrationData,
} from "../../../lib/db/prisma-query";

export type APIResponse<DataType> = {
    status: "success" | "error";
    data?: DataType;
    message?: string;
};

type Data = {
    ok: boolean;
    integrations: any | null;
};

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const shop = searchParams.get("shop");

        if (!shop) {
            return NextResponse.json<APIResponse<Data>>(
                {
                    status: "error",
                    message: "Shop parameter is missing.",
                },
                { status: 400 }, // Bad Request
            );
        }

        // Fetch the store settings
        const storeIntegrations = await getShopIntegrationData({ shop });

        return NextResponse.json<APIResponse<Data>>(
            {
                status: "success",
                data: {
                    ok: true,
                    integrations: storeIntegrations
                },
            },
            { status: 200 }, // OK
        );
    } catch (error) {
        console.error("Error in GET /api/store:", error);

        return NextResponse.json<APIResponse<Data>>(
            {
                status: "error",
                message: "An unexpected error occurred.",
            },
            { status: 500 }, // Internal Server Error
        );
    }
}
