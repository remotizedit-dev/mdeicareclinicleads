import Link from "next/link";

export default function Navbar() {
  return (
    <header>
      <div style={{ backgroundColor: "var(--bg-main)", borderBottom: "1px solid var(--border)", padding: "1rem 0" }}>
        <div className="container" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Link href="/">
            <img 
              src="https://medicareclinic.ca/wp-content/uploads/2025/11/imgi_1_medicareclinic-logo.webp" 
              alt="Medicare Clinic" 
              style={{ height: "60px", objectFit: "contain" }} 
            />
          </Link>
        </div>
      </div>
    </header>
  );
}
