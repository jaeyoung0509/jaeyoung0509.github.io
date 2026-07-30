import Link from "next/link";

const navigation = [
  { href: "/blog/", label: "blogs" },
  { href: "/about/", label: "about" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" href="/" aria-label="홈">
          jaeyoung0509
        </Link>

        <nav className="header-nav" aria-label="주요 메뉴">
          {navigation.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
