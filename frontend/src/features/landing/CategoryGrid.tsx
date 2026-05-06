import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Section } from "@/components/Section";
import { NAV_PATHS } from "@/lib/constants/nav";

const CATEGORIES = [
  {
    name: "Wedding",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80",
    href: `${NAV_PATHS.DISCOVERY}?specialty=wedding`,
  },
  {
    name: "Portrait",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80",
    href: `${NAV_PATHS.DISCOVERY}?specialty=portrait`,
  },
  {
    name: "Fashion",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80",
    href: `${NAV_PATHS.DISCOVERY}?specialty=fashion`,
  },
  {
    name: "Commercial",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80",
    href: `${NAV_PATHS.DISCOVERY}?specialty=commercial`,
  },
];

export function CategoryGrid() {
  return (
    <Section variant="default" spacing="compact" className="py-24 bg-white">
      <Section.Header
        title="Specialties"
        align="left"
        className="mb-12 font-light tracking-wide uppercase text-sm text-gray-500"
      />

      <Section.Content className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.name}
            href={cat.href}
            className="group relative h-[350px] sm:h-[450px] overflow-hidden bg-gray-100"
          >
            <Image
              src={cat.image}
              alt={cat.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/30 md:bg-black/20 md:group-hover:bg-black/40 transition-colors duration-500" />

            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-light text-white tracking-widest uppercase md:opacity-0 md:translate-y-4 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-500">
                {cat.name}
              </span>
            </div>
          </Link>
        ))}
      </Section.Content>
    </Section>
  );
}
