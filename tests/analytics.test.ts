import assert from "node:assert/strict";
import test from "node:test";

import {
  assertPrivacySafeAnalyticsEvent,
  isAnalyticsEventName,
  withPrivacyGuard,
  type AnalyticsEvent,
} from "../src/core/analytics.ts";

test("analytics event names are explicitly allow-listed", () => {
  assert.equal(isAnalyticsEventName("inbox_opened"), true);
  assert.equal(isAnalyticsEventName("message_body_captured"), false);
});

test("privacy guard rejects arbitrary metadata before an adapter receives it", async () => {
  const received: AnalyticsEvent[] = [];
  const provider = withPrivacyGuard({
    track(event) {
      received.push(event);
    },
  });

  await provider.track({ name: "inbox_opened", properties: { source: "web" } });
  assert.equal(received.length, 1);

  const unsafeEvent = {
    name: "inbox_opened",
    properties: { messageBody: "sensitive" },
  } as unknown as AnalyticsEvent;

  assert.throws(
    () => assertPrivacySafeAnalyticsEvent(unsafeEvent),
    /not allow-listed/,
  );
  assert.equal(received.length, 1);
});
