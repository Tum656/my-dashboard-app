import Link from "next/link";

export default function SidebarWidget({onClick}: { onClick?: () => void }) {
    return (
        <nav className="px-4 py-4 space-y-1">
            <Link href="/helloworld" onClick={onClick} className="side-link">
                Hello World
            </Link>

            <Link href="/dashboard" onClick={onClick} className="side-link">
                dashboard
            </Link>

        </nav>
    );
}
