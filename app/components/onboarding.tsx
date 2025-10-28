"use client";

import React, { useCallback } from "react";
import { useEffect, useState } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";
import {
  Page,
  Card,
  Layout,
  TextContainer,
  Text,
  Badge,
  Button,
  Link,
  ResourceList,
  ResourceItem,
  Avatar,
} from "@shopify/polaris";

function OnboardingPage() {
  const app = useAppBridge();
  const [shopUrl, setShopUrl] = useState("");
  const [storeIntegrationData, setStoreIntegrationData] = useState<any>(null);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/integrations?shop=" + shopUrl);
      const { data } = await response.json();
      console.log("data", data);
      if (data?.ok && data?.integrations) {
        setStoreIntegrationData(data?.integrations);
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

  console.log(
    "OnboardingPage rendered",
    process.env.NEXT_PUBLIC_BACKEND_APP_URL,
  );

  type Integration = {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    picture: string;
    nickname: string;
    auth0Id: string;
    sid: string;
    shop: string;
    createdAt: string;
    updatedAt: string;
  };

  function IntegrationCard({ integration }: { integration: Integration }) {
    return (
      <Card>
        <Text as="h2" variant="headingLg">
          Integration Info
        </Text>
        <ResourceList
          resourceName={{ singular: "integration", plural: "integrations" }}
          items={[integration]}
          renderItem={(item, index) => {
            const {
              id,
              name,
              email,
              emailVerified,
              picture,
              nickname,
              auth0Id,
              sid,

              createdAt,
            } = item;
            const media = (
              <Avatar customer size="md" name={name} source={picture} />
            );
            return (
              <ResourceItem url="" id={index.toString()} media={media} >
                <Text variant="headingMd" as="h3">
                  {name} ({nickname})
                </Text>
                <Text as="p" tone="subdued">
                  Email: {email} {emailVerified ? "✅" : "❌"}
                </Text>
                <Text as="p" tone="subdued">
                  Auth0 ID: {auth0Id}
                </Text>
                <Text as="p">SID: {sid}</Text>
                <Text as="p">
                  Created: {new Date(createdAt).toLocaleString()}
                </Text>
              </ResourceItem>
            );
          }}
        />{" "}
        <Link
          // style={{ marginTop: "1rem" }}
          target="_top"
          url={`${process.env.NEXT_PUBLIC_BACKEND_APP_URL}/integration/auth/logout`}
        >
          <Button>Log out</Button>
        </Link>
      </Card>
    );
  }

  return (
    <Page title="Level Chart - Stay Ahead of Sales Trends">
      <Layout>
        {/* Overview Section */}
        <Layout.Section>
          <Card>
            <TextContainer>
              <Text as="h2" variant="headingLg">
                Forecast Sales and Revenue
              </Text>
              <p>
                Say goodbye to the stress of out-of-stock situations and missed
                opportunities. With
                <strong> Level Chart</strong>, you’ll stay ahead of customer
                demand and streamline your inventory planning.
              </p>
            </TextContainer>
          </Card>
        </Layout.Section>

        {/* User Integration Section */}
        {storeIntegrationData ? (
          <Layout.Section>
            <IntegrationCard integration={storeIntegrationData} />
          </Layout.Section>
        ) : (
          <Layout.Section>
            {/* Call to Action Section */}
            <Card>
              <TextContainer>
                <p>
                  With <strong>Level Chart</strong>, you’ll always be ready to
                  meet customer demands and boost satisfaction. Start planning
                  smarter today!
                </p>
                <Link
                  // style={{ marginTop: "1rem" }}
                  target="_top"
                  url={`${process.env.NEXT_PUBLIC_BACKEND_APP_URL}/integration?shop=${shopUrl}`}
                >
                  <Button>Get Started</Button>
                </Link>
              </TextContainer>
            </Card>
          </Layout.Section>
        )}

        {/* Features Section */}
        <Layout.Section>
          <Card>
            <Text as="h3" variant="headingMd">
              Why Choose us?
            </Text>
            <ul>
              <li>
                <Badge tone="success">Accurate Forecasting</Badge> - Level Chart
                future sales trends with ease (increase, decrease, or neutral).
              </li>
              <li>
                <Badge tone="warning">Low-Stock Alerts</Badge> - Get timely
                notifications via email to avoid stock outs.
              </li>
              <li>
                <Badge tone="info">Maximized Revenue</Badge> - Plan inventory
                efficiently and reduce the risk of lost sales.
              </li>
            </ul>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

export default OnboardingPage;
