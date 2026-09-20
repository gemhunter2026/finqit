export const ANALYTICS_EVENTS = [
  "onboarding_completed",
  "inbox_opened",
  "document_viewed",
  "incident_created",
  "poll_participated",
  "ai_query_succeeded",
] as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[number];

/**
 * Deliberately coarse metadata. Never add message/document contents, names,
 * email addresses, unit labels, free text, or provider payloads here.
 */
export type AnalyticsEventProperties = Readonly<{
  communityId?: string;
  source?: "web" | "system";
}>;

export type AnalyticsEvent = Readonly<{
  name: AnalyticsEventName;
  properties?: AnalyticsEventProperties;
}>;

export interface AnalyticsProvider {
  track(event: AnalyticsEvent): void | Promise<void>;
}

/** Development/default provider: deterministic and intentionally sends nothing. */
export class NoopAnalyticsProvider implements AnalyticsProvider {
  track(_event: AnalyticsEvent): void {
    // Privacy-safe by default: analytics is opt-in at the adapter boundary.
  }
}

const EVENT_SET: ReadonlySet<string> = new Set(ANALYTICS_EVENTS);
const ALLOWED_PROPERTY_KEYS: ReadonlySet<string> = new Set(["communityId", "source"]);

export function isAnalyticsEventName(value: string): value is AnalyticsEventName {
  return EVENT_SET.has(value);
}

/**
 * Runtime guard for adapter boundaries. This prevents a future vendor adapter
 * from silently accepting arbitrary/sensitive payload keys.
 */
export function assertPrivacySafeAnalyticsEvent(event: AnalyticsEvent): void {
  if (!isAnalyticsEventName(event.name)) {
    throw new Error(`Unsupported analytics event: ${event.name}`);
  }

  if (!event.properties) return;

  for (const key of Object.keys(event.properties)) {
    if (!ALLOWED_PROPERTY_KEYS.has(key)) {
      throw new Error(`Analytics property is not allow-listed: ${key}`);
    }
  }

  if (
    event.properties.source !== undefined &&
    event.properties.source !== "web" &&
    event.properties.source !== "system"
  ) {
    throw new Error("Analytics source is invalid");
  }
}

/**
 * Wrap vendor adapters with this guard before enabling them. Keeping validation
 * here makes the privacy boundary vendor-independent and repeatable.
 */
export function withPrivacyGuard(provider: AnalyticsProvider): AnalyticsProvider {
  return {
    track(event) {
      assertPrivacySafeAnalyticsEvent(event);
      return provider.track(event);
    },
  };
}
