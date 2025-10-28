"use client";

import React from "react";
import {
  Card,
  Layout,
  List,
  Link,
  Page,
  Text,
  InlineStack,
  BlockStack,
} from "@shopify/polaris";

export default function Help() {
  return (
    <Page title="Help">
      <Layout>
        <Layout.Section variant="oneHalf">
          <Card>
            <BlockStack gap={{ lg: "300" }}>
              <div>
                <Text as="h2" variant="headingLg">
                  Rules
                </Text>
              </div>
              <List>
                <List.Item>App enabled for sample.</List.Item>
                <List.Item>
                  You can select sample quantity minimum 1 and maximum 8.
                </List.Item>
                <List.Item>
                  Sample amount and type will be default setting.
                </List.Item>
                <List.Item>
                  Set sample amount according store default currency.
                </List.Item>
              </List>

              {/* <Link
                url={"https://sample-backend-dev.artzen.io"}
                target="_blank"
              >
                Click here for More Info
              </Link> */}
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
  );
}
