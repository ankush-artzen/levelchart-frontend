import { verifyRequest } from "@/lib/shopify/verify";
import { NextResponse } from "next/server";
import {
  fetchShopSettingData,
  updateShopSettingData,
} from "../../../lib/db/prisma-query";

export type APIResponse<DataType> = {
  status: "success" | "error";
  data?: DataType;
  message?: string;
};

type Data = {
  ok: boolean;
  storeSetting: any | null;
};

export async function GET(req: Request) {
  try {
    // Verify the session token in the request headers
    const validSession = await verifyRequest(req, true);
    if (!validSession) {
      return NextResponse.json<APIResponse<Data>>(
        {
          status: "error",
          message: "Session verification failed.",
        },
        { status: 401 }, // Unauthorized
      );
    }

    const { shop } = validSession;
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
    const storeSetting = await fetchShopSettingData({ shop });

    return NextResponse.json<APIResponse<Data>>(
      {
        status: "success",
        data: {
          ok: true,
          storeSetting,
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

export async function POST(req: Request) {
  try {

    // Parse the request body
    const reqBody = await req.json();
    const { storeSettingId, shop, isActive } = reqBody;

    if (!shop) {
        return NextResponse.json<APIResponse<Data>>(
          {
            status: "error",
            message: "Invalid request body. 'shop' is required.",
          },
          { status: 400 }, // Bad Request
        );
      }

    // Validate `isActive` parameter
    if (typeof isActive !== "boolean") {
      return NextResponse.json<APIResponse<Data>>(
        {
          status: "error",
          message: "Invalid request body. 'isActive' must be a boolean.",
        },
        { status: 400 }, // Bad Request
      );
    }

    // Update the store settings
    const storeSetting = await updateShopSettingData({ shop, isActive, storeSettingId });

    return NextResponse.json<APIResponse<Data>>(
      {
        status: "success",
        data: {
          ok: true,
          storeSetting,
        },
      },
      { status: 200 }, // OK
    );
  } catch (error) {
    console.error("Error in POST /api/store:", error);

    return NextResponse.json<APIResponse<Data>>(
      {
        status: "error",
        message: "An unexpected error occurred.",
      },
      { status: 500 }, // Internal Server Error
    );
  }
}
