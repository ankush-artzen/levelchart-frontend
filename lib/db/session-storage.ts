import { Session } from "@prisma/client";
import { Session as ShopifySession } from "@shopify/shopify-api";
import { ObjectId } from "mongodb"; // Import ObjectId for generating new IDs
import prisma from "./prisma-connect";
import { encrypt, decrypt, isEncryptedData, EncryptedData } from "../utils/encryption";

const apiKey = process.env.SHOPIFY_API_KEY || "";

export async function storeSession(session: ShopifySession) {
  console.log("Storing session:", session);
  // Ensure session.id is a valid ObjectID or create a new one
  const sessionId = ObjectId.isValid(session.id) ? session.id : new ObjectId().toString();

  // Encrypt the access token if it exists
  const encryptedToken: EncryptedData | null = session.accessToken ? encrypt(session.accessToken) : null;

  await prisma.session.upsert({
    where: { id: sessionId }, // Use valid ObjectID
    update: {
      shop: session.shop,
      accessToken: encryptedToken as any, // Type assertion needed due to Prisma's type system
      scope: session.scope,
      expires: session.expires,
      isOnline: session.isOnline,
      state: session.state,
      apiKey,
    },
    create: {
      id: sessionId, // Use valid ObjectID
      shop: session.shop,
      accessToken: encryptedToken as any, // Type assertion needed due to Prisma's type system
      scope: session.scope,
      expires: session.expires,
      isOnline: session.isOnline,
      state: session.state,
      apiKey,
    },
  });

  if (session.onlineAccessInfo) {
    const onlineAccessInfo = await prisma.onlineAccessInfo.upsert({
      where: { sessionId: sessionId }, // Ensure the correct sessionId is used
      update: {
        expiresIn: session.onlineAccessInfo.expires_in,
        associatedUserScope: session.onlineAccessInfo.associated_user_scope,
      },
      create: {
        sessionId: sessionId, // Ensure the correct sessionId is used
        expiresIn: session.onlineAccessInfo.expires_in,
        associatedUserScope: session.onlineAccessInfo.associated_user_scope,
      },
    });

    const { associated_user } = session.onlineAccessInfo;
    const associatedUser = await prisma.associatedUser.upsert({
      where: { onlineAccessInfoId: onlineAccessInfo.id },
      update: {
        firstName: associated_user.first_name,
        lastName: associated_user.last_name,
        email: associated_user.email,
        emailVerified: associated_user.email_verified,
        accountOwner: associated_user.account_owner,
        locale: associated_user.locale,
        collaborator: associated_user.collaborator,
        userId: associated_user.id,
      },
      create: {
        onlineAccessInfoId: onlineAccessInfo.id,
        firstName: associated_user.first_name,
        lastName: associated_user.last_name,
        email: associated_user.email,
        emailVerified: associated_user.email_verified,
        accountOwner: associated_user.account_owner,
        locale: associated_user.locale,
        collaborator: associated_user.collaborator,
        userId: associated_user.id,
      },
    });
  }
}

export async function loadSession(id: string) {
  // Validate the ObjectID before querying
  if (!ObjectId.isValid(id)) {
    throw new SessionNotFoundError();
  }

  const session = await prisma.session.findUnique({
    where: { id },
  });

  if (session) {
    // Decrypt the access token if it exists
    let decryptedToken: string | null = null;
    if (session.accessToken && isEncryptedData(session.accessToken)) {
      decryptedToken = decrypt(session.accessToken);
    }

    return generateShopifySessionFromDB({
      ...session,
      accessToken: decryptedToken
    });
  } else {
    throw new SessionNotFoundError();
  }
}

export async function deleteSession(id: string) {
  // Validate the ObjectID before deletion
  if (!ObjectId.isValid(id)) {
    throw new SessionNotFoundError();
  }

  await prisma.session.delete({
    where: { id },
  });
}

export async function deleteSessions(ids: string[]) {
  // Validate all ObjectIDs before deletion
  const invalidIds = ids.filter(id => !ObjectId.isValid(id));
  if (invalidIds.length > 0) {
    throw new SessionNotFoundError();
  }

  await prisma.session.deleteMany({
    where: { id: { in: ids } },
  });
}

export async function cleanUpSession(shop: string, accessToken: string) {
  await prisma.session.deleteMany({
    where: { shop, apiKey },
  });
}

export async function findSessionsByShop(shop: string) {
  const sessions = await prisma.session.findMany({
    where: { shop, apiKey },
    include: {
      onlineAccessInfo: {
        include: {
          associatedUser: true,
        },
      },
    },
  });

  return sessions.map((session) => generateShopifySessionFromDB(session));
}

function generateShopifySessionFromDB(session: Session) {
  let decryptedToken: string | null = null;
  if (session.accessToken && isEncryptedData(session.accessToken)) {
    decryptedToken = decrypt(session.accessToken);
  }
  return new ShopifySession({
    id: session.id,
    shop: session.shop,
    accessToken: decryptedToken || undefined,
    scope: session.scope || undefined,
    state: session.state,
    isOnline: session.isOnline,
    expires: session.expires || undefined,
  });
}

export class SessionNotFoundError extends Error {
  constructor() {
    super("Session not found");
    this.name = "SessionNotFoundError";
  }
}
