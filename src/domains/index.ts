import { FINQIT_DOMAINS, type FinqitDomain } from "@/src/core/domain";

export { FINQIT_DOMAINS };
export type { FinqitDomain };

/** Runtime guard for boundaries that receive domain names from untyped inputs. */
export function isFinqitDomain(value: string): value is FinqitDomain {
  return (FINQIT_DOMAINS as readonly string[]).includes(value);
}
