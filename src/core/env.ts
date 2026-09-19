type Environment = Readonly<Record<string, string | undefined>>;

type ServerEnvironment = Readonly<{
  nodeEnv: "development" | "test" | "production";
  supabaseServiceRoleKey?: string;
}>;

export type PublicEnvironment = Readonly<{
  supabaseUrl?: string;
  supabaseAnonKey?: string;
}>;

export type FinqitEnvironment = Readonly<{
  server: ServerEnvironment;
  public: PublicEnvironment;
}>;

export class EnvironmentValidationError extends Error {
  readonly issues: readonly string[];

  constructor(issues: readonly string[]) {
    super(`Invalid Finqit environment:\n- ${issues.join("\n- ")}`);
    this.name = "EnvironmentValidationError";
    this.issues = issues;
  }
}

const allowedNodeEnvironments = ["development", "test", "production"] as const;

function optionalValue(value: string | undefined): string | undefined {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

function validateUrl(name: string, value: string | undefined, issues: string[]): string | undefined {
  const normalized = optionalValue(value);
  if (!normalized) return undefined;

  try {
    const url = new URL(normalized);
    if (url.protocol !== "https:" && url.hostname !== "localhost") {
      issues.push(`${name} must use HTTPS unless it points to localhost.`);
    }
  } catch {
    issues.push(`${name} must be a valid absolute URL.`);
  }

  return normalized;
}

/**
 * Parses Finqit's process environment without exposing server-only values to client code.
 * Provider credentials remain optional while the app is running in mock/local mode.
 */
export function parseEnvironment(environment: Environment): FinqitEnvironment {
  const issues: string[] = [];
  const rawNodeEnv = optionalValue(environment.NODE_ENV) ?? "development";

  if (!allowedNodeEnvironments.includes(rawNodeEnv as (typeof allowedNodeEnvironments)[number])) {
    issues.push(`NODE_ENV must be one of: ${allowedNodeEnvironments.join(", ")}.`);
  }

  const supabaseUrl = validateUrl("NEXT_PUBLIC_SUPABASE_URL", environment.NEXT_PUBLIC_SUPABASE_URL, issues);
  const supabaseAnonKey = optionalValue(environment.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const supabaseServiceRoleKey = optionalValue(environment.SUPABASE_SERVICE_ROLE_KEY);

  const publicSupabaseConfigured = Boolean(supabaseUrl || supabaseAnonKey);
  if (publicSupabaseConfigured && !(supabaseUrl && supabaseAnonKey)) {
    issues.push("NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be configured together.");
  }

  if (environment.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY) {
    issues.push("SUPABASE service-role credentials must never use a NEXT_PUBLIC_ prefix.");
  }

  if (issues.length > 0) throw new EnvironmentValidationError(issues);

  return {
    server: {
      nodeEnv: rawNodeEnv as ServerEnvironment["nodeEnv"],
      supabaseServiceRoleKey,
    },
    public: {
      supabaseUrl,
      supabaseAnonKey,
    },
  };
}

export function readServerEnvironment(): FinqitEnvironment {
  return parseEnvironment(process.env);
}

/** Client-safe snapshot. Never add server secrets here. */
export function readPublicEnvironment(): PublicEnvironment {
  return parseEnvironment({
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY,
  }).public;
}
