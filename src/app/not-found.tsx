import Link from "next/link";
import { ArrowLeft } from "lucide-react";
export default function NotFound() {
  return (
    <main className="not-found">
      <p className="eyebrow">SYSTEM RESPONSE / 404</p>
      <h1>
        This mission
        <br />
        <em>doesn’t exist.</em>
      </h1>
      <p>The archive has no record for this route.</p>
      <Link href="/#projects">
        <ArrowLeft size={15} /> Return to the mission archive
      </Link>
    </main>
  );
}
