import Image from "next/image";

import { PortableTextRenderer } from "@/components/portable-text";
import { urlForImage } from "@/lib/sanity/image";
import type { BlogAuthor } from "@/types/sanity";

interface AuthorBioProps {
  author: BlogAuthor;
}

export function AuthorBio({ author }: AuthorBioProps) {
  const portrait = author.image;
  const builder = portrait ? urlForImage(portrait) : null;
  const src = builder?.width(160).height(160).fit("crop").url();
  const blur = portrait?.asset?.metadata?.lqip;
  const hasBio = Array.isArray(author.bio) && author.bio.length > 0;

  return (
    <section className="author-bio">
      {src ? (
        <Image
          src={src}
          alt={portrait?.alt || author.name}
          width={160}
          height={160}
          className="author-bio__image"
          placeholder={blur ? "blur" : undefined}
          blurDataURL={blur}
        />
      ) : null}
      <div className="author-bio__content">
        <h3 className="author-bio__name">{author.name}</h3>
        {hasBio ? <PortableTextRenderer value={author.bio ?? []} className="author-bio__text" /> : null}
      </div>
    </section>
  );
}
