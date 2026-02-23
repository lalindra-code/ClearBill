// Spacer that offsets the fixed Navbar (h-16 = 64px).
// The Navbar in the root layout already provides the EcoBill logo and branding.
// A full dashboard navigation bar will be implemented in Phase 2.
export function DashboardHeader() {
  return <div className="h-16" aria-hidden="true" />;
}
