"use client";

import {
  BlockStack,
  Card,
  InlineStack,
  Layout,
  Text,
  List,
  Page,
  Select,
  Button,
} from "@shopify/polaris";
import React, { useCallback } from "react";
import { useEffect, useState } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";
import { fetchApi } from "../../lib/fetchData";

export default function Setting() {
  const [shopUrl, setShopUrl] = useState("");
  const [storeSetting, setStoreSetting] = useState<any>(null);
  const [isEnabled, setIsEnabled] = useState("false");
  const app = useAppBridge();

  const fetchData = async () => {
    try {
      const response = await fetch("/api/store");
      const { data } = await response.json();
      console.log("data", data);
      if (data?.ok && data?.storeSetting) {
        setStoreSetting(data?.storeSetting);
        setIsEnabled(String(data?.storeSetting?.isActive));
      }
    } catch (error) {
      console.warn(error);
    }
  };

  useEffect(() => {
    const shopUrl = app?.config?.shop
      ? app?.config?.shop.replace("https://", "").replace("www.", "")
      : "";
    console.log("shopUrl", shopUrl);
    setShopUrl(shopUrl);
  }, [app]);

  useEffect(() => {
    fetchData();
  }, [shopUrl]);

  const options = [
    { label: "Enable", value: "true" },
    { label: "Disable", value: "false" },
  ];

  const handleSelectChange = useCallback(
    (value: React.SetStateAction<string>) => setIsEnabled(value),
    [],
  );

  const settingUpdate = async () => {
    try {
      const isActive = /^true$/i.test(isEnabled);
      const storeSettingId = storeSetting?.id || "";
      const response = await fetchApi({
        url: "/api/store",
        method: "POST",
        payLoad: { shop: shopUrl, isActive, storeSettingId },
      });
      console.log("data", response.data);
      if(response.data.ok){
        shopify.toast.show("Updated Successfully");
        return
      }
      shopify.toast.show(response.data.message);
    } catch (error: any) {
      shopify.toast.show(error?.message, { isError: true });
    }
  };

  return (
    <>
      <Page title="Store Setting">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap={{ lg: "300" }}>
                <Select
                  label={"App Enabled"}
                  options={options}
                  onChange={handleSelectChange}
                  value={isEnabled}
                />
                <Button variant="primary" onClick={settingUpdate}>
                  Save
                </Button>
              </BlockStack>
            </Card>
          </Layout.Section>
          <Layout.Section variant="oneThird">
            <Card>
              <InlineStack gap={{ lg: "300" }}>
                <Text as="h2" variant="headingMd">
                  Steps
                </Text>
                <List>
                  <List.Item>
                    Activate app for your store to offer Sample products in the
                    storefront.
                  </List.Item>
                  <List.Item>
                    Please enter the sample amount, quantity of sample order &
                    minimum order to make this work properly.
                  </List.Item>
                </List>
              </InlineStack>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    </>
  );
}
