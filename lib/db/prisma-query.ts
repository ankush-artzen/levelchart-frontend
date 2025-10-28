import { ObjectId } from "mongodb";
import prisma from "./prisma-connect";

export const fetchShopSettingData = async ({ shop }: { shop: string }) => {
  try {
    const storeSetting = await prisma.storeSetting.findFirst({
      where: {
        shop,
      },
    });
    return storeSetting;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateShopSettingData = async ({
  storeSettingId,
  shop,
  isActive,
}: {
  storeSettingId: string;
  shop: string;
  isActive: boolean;
}) => {
  try {
    const _storeSettingId = ObjectId.isValid(storeSettingId)
      ? storeSettingId
      : new ObjectId().toString();
    const storeSetting = await prisma.storeSetting.upsert({
      where: { id: _storeSettingId },
      update: {
        isActive,
        updatedAt: new Date(),
      },
      create: {
        id: _storeSettingId,
        shop,
        isActive,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return storeSetting;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


export const getShopIntegrationData = async ({ shop }: { shop: string }) => {
  try {
    const storeSetting = await prisma.storeIntegration.findFirst({
      where: {
        shop,
      },
    });
    return storeSetting;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
