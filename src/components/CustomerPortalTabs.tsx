import Link from "next/link";

type CustomerPortalTabsProps = {
  activeTab: "booking" | "tracking";
};

export default function CustomerPortalTabs({
  activeTab,
}: CustomerPortalTabsProps) {
  const tabs = [
    {
      id: "booking" as const,
      href: "/booking",
      label: "Booking Baru",
    },
    {
      id: "tracking" as const,
      href: "/pesanan",
      label: "Tracking Pesanan",
    },
  ];

  return (
    <nav
      aria-label="Navigasi booking customer"
      className="mx-auto mb-8 flex w-full max-w-3xl flex-wrap items-center gap-2 rounded-2xl border border-[#d8d0c8]/60 bg-white p-2 shadow-[0_2px_16px_rgba(58,48,42,0.04)]"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;

        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              isActive
                ? "bg-[#c2652a] text-white shadow-sm"
                : "text-[#7a6f69] hover:bg-[#faf5ee] hover:text-[#3a302a]"
            }`}
            aria-current={isActive ? "page" : undefined}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
