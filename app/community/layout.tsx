import { CommunityShell } from "@/components/CommunityShell";
export default function CommunityLayout({children}:{children:React.ReactNode}) { return <div className="community-page-wrap"><CommunityShell>{children}</CommunityShell></div>; }
