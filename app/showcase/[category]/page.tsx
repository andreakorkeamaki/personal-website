import type { Metadata } from "next";
import { notFound } from "next/navigation";

import CategoryTemplate from "@/components/showcase/CategoryTemplate";
import { CATEGORY_SHOWCASE_GALLERIES, CATEGORY_SHOWCASE_SLUGS } from "@/data/category-showcase";

type CategoryPageProps = {
  params: {
    category: string;
  };
};

export function generateStaticParams() {
  return CATEGORY_SHOWCASE_SLUGS.map((slug) => ({ category: slug }));
}

export function generateMetadata({ params }: CategoryPageProps): Metadata {
  const category = CATEGORY_SHOWCASE_GALLERIES[params.category];

  if (!category) {
    return {
      title: "Showcase",
    };
  }

  return {
    title: `${category.title} Showcase`,
    description: category.description,
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = CATEGORY_SHOWCASE_GALLERIES[params.category];

  if (!category) {
    notFound();
  }

  return <CategoryTemplate category={category} />;
}
