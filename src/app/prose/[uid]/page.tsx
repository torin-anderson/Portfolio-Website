import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices";
import Bounded from "@/components/Bounded";
import Heading from "@/components/Heading";

type Params = { uid: string };

export default async function Page({ params }: { params: Params }) {
  const client = createClient();
  const page = await client
    .getByUID("prose_post", params.uid)
    .catch(() => notFound());

  return (
    <Bounded as="article">
    <div className="rounded-2xl border-2 border-indigo-900 bg-indigo-950 px-4 py-10 md:px-8 md:py-20">
        <Heading as="h1">{page.data.title}</Heading>
        <div className="flex gap-4 text-yellow-400 text-xl font-bold">
            {page.tags.map((tag, index)=>(
                <span key={tag}>{tag}</span>
            ))}
        </div>
        <p className="mt-8 border-b border-indigo-600 text-xl font-medium text-indigo-300">
            {page.data.date}
        </p>
        <div className="prose prose-lg prose-invert mt-12 w-full max-w-none md:mt-20">
            <SliceZone slices={page.data.slices} components={components} />
        </div>
    </div>
    </Bounded>
    );
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const client = createClient();
  const page = await client
    .getByUID("prose_post", params.uid)
    .catch(() => notFound());

  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
  };
}

export async function generateStaticParams() {
  const client = createClient();
  const pages = await client.getAllByType("prose_post");

  return pages.map((page) => {
    return { uid: page.uid };
  });
}