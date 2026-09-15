import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const base = (size = 20) => ({ width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const });

export function SearchIcon({ size, ...props }: IconProps) { return <svg {...base(size)} {...props}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>; }
export function HeartIcon({ size, ...props }: IconProps) { return <svg {...base(size)} {...props}><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/></svg>; }
export function SparklesIcon({ size, ...props }: IconProps) { return <svg {...base(size)} {...props}><path d="m12 3 1.2 3.2L16.5 7.5l-3.3 1.2L12 12l-1.2-3.3-3.3-1.2 3.3-1.3L12 3Z"/><path d="m18 13 .8 2.2L21 16l-2.2.8L18 19l-.8-2.2L15 16l2.2-.8L18 13Z"/><path d="m6 14 .7 1.8 1.8.7-1.8.7L6 19l-.7-1.8-1.8-.7 1.8-.7L6 14Z"/></svg>; }
export function HomeIcon({ size, ...props }: IconProps) { return <svg {...base(size)} {...props}><path d="m3 10 9-7 9 7"/><path d="M5 9v11h14V9"/><path d="M9 20v-6h6v6"/></svg>; }
export function BuildingIcon({ size, ...props }: IconProps) { return <svg {...base(size)} {...props}><path d="M4 21V5l8-3v19"/><path d="M12 8h8v13"/><path d="M8 8h.01M8 12h.01M8 16h.01M16 12h.01M16 16h.01"/></svg>; }
export function UsersIcon({ size, ...props }: IconProps) { return <svg {...base(size)} {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9"/><path d="M16 3.1a4 4 0 0 1 0 7.8"/></svg>; }
export function MailIcon({ size, ...props }: IconProps) { return <svg {...base(size)} {...props}><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m3 7 9 6 9-6"/></svg>; }
export function FileIcon({ size, ...props }: IconProps) { return <svg {...base(size)} {...props}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h5"/></svg>; }
export function VoteIcon({ size, ...props }: IconProps) { return <svg {...base(size)} {...props}><path d="M4 20h16"/><path d="M6 20V9h12v11"/><path d="m9 6 3-3 3 3"/><path d="M12 3v11"/><path d="m9 11 3 3 3-3"/></svg>; }
export function WalletIcon({ size, ...props }: IconProps) { return <svg {...base(size)} {...props}><path d="M20 7V6a2 2 0 0 0-2-2H5a3 3 0 0 0 0 6h15v10H5a3 3 0 0 1-3-3V7"/><path d="M16 14h.01"/></svg>; }
export function ShieldIcon({ size, ...props }: IconProps) { return <svg {...base(size)} {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg>; }
export function ArrowRightIcon({ size, ...props }: IconProps) { return <svg {...base(size)} {...props}><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>; }
export function MapPinIcon({ size, ...props }: IconProps) { return <svg {...base(size)} {...props}><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>; }
export function BedIcon({ size, ...props }: IconProps) { return <svg {...base(size)} {...props}><path d="M2 18v-7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v7"/><path d="M2 14h20M6 9V6h4a2 2 0 0 1 2 2v1M2 18v2M22 18v2"/></svg>; }
export function BathIcon({ size, ...props }: IconProps) { return <svg {...base(size)} {...props}><path d="M3 12h18v2a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5v-2Z"/><path d="M6 12V5a3 3 0 0 1 6 0"/><path d="M7 21v-2M17 21v-2"/></svg>; }
export function AreaIcon({ size, ...props }: IconProps) { return <svg {...base(size)} {...props}><path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5"/></svg>; }
export function BellIcon({ size, ...props }: IconProps) { return <svg {...base(size)} {...props}><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></svg>; }
export function CheckIcon({ size, ...props }: IconProps) { return <svg {...base(size)} {...props}><path d="m5 12 4 4L19 6"/></svg>; }
export function SlidersIcon({ size, ...props }: IconProps) { return <svg {...base(size)} {...props}><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/></svg>; }
export function ClockIcon({ size, ...props }: IconProps) { return <svg {...base(size)} {...props}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>; }
export function PlusIcon({ size, ...props }: IconProps) { return <svg {...base(size)} {...props}><path d="M12 5v14M5 12h14"/></svg>; }
export function ChevronDownIcon({ size, ...props }: IconProps) { return <svg {...base(size)} {...props}><path d="m6 9 6 6 6-6"/></svg>; }
export function MenuIcon({ size, ...props }: IconProps) { return <svg {...base(size)} {...props}><path d="M4 7h16M4 12h16M4 17h16"/></svg>; }
export function XIcon({ size, ...props }: IconProps) { return <svg {...base(size)} {...props}><path d="m6 6 12 12M18 6 6 18"/></svg>; }
export function EyeIcon({ size, ...props }: IconProps) { return <svg {...base(size)} {...props}><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/></svg>; }
