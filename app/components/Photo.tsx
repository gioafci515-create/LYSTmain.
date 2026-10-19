import Image, { getImageProps } from "next/image";
import { preload } from "react-dom";

type PhotoProps = {
  src: string;
  label: string;
  className?: string;
  /** Classes for the <img>, e.g. object-position utilities. */
  imgClassName?: string;
  /** Optional CSS gradient laid over the photo. */
  overlay?: string;
  /**
   * Width the image is drawn at. For object-cover photos this is NOT always the box
   * width: when the photo is wider than its box, it is height-limited and needs more.
   */
  sizes?: string;
  priority?: boolean;
  /** Phone-only version (< 768px), e.g. a portrait crop of a full-screen photo. */
  mobileSrc?: string;
  mobileSizes?: string;
};

const PHONE = "(max-width: 767px)";
const WIDE = "(min-width: 768px)";

// Responsive photo: Next serves the right size/format per screen at high quality.
export default function Photo({
  src,
  label,
  className = "",
  imgClassName = "object-center",
  overlay,
  sizes = "100vw",
  priority,
  mobileSrc,
  mobileSizes = "100vw",
}: PhotoProps) {
  const positioned = /(^|\s)(absolute|fixed|sticky)(\s|$)/.test(className);
  const imgClass = `object-cover ${imgClassName}`;

  let image: React.ReactNode;
  if (mobileSrc) {
    // Art direction: phones get their own crop, so they never download the wide photo.
    const common = { alt: label, fill: true, quality: 90 } as const;
    const phone = getImageProps({ ...common, src: mobileSrc, sizes: mobileSizes }).props;
    const { srcSet, sizes: wideSizes, ...rest } = getImageProps({ ...common, src, sizes }).props;
    if (priority) {
      preload(phone.src, { as: "image", imageSrcSet: phone.srcSet, imageSizes: phone.sizes, media: PHONE, fetchPriority: "high" });
      preload(rest.src, { as: "image", imageSrcSet: srcSet, imageSizes: wideSizes, media: WIDE, fetchPriority: "high" });
    }
    image = (
      <picture>
        <source media={PHONE} srcSet={phone.srcSet} sizes={phone.sizes} />
        <img
          {...rest}
          alt={label}
          srcSet={srcSet}
          sizes={wideSizes}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          className={imgClass}
        />
      </picture>
    );
  } else {
    image = <Image src={src} alt={label} fill sizes={sizes} quality={90} preload={priority} className={imgClass} />;
  }

  return (
    <div className={`${positioned ? "" : "relative"} overflow-hidden bg-[#8a6a45] ${className}`}>
      {image}
      {overlay && <div aria-hidden className="absolute inset-0" style={{ background: overlay }} />}
    </div>
  );
}
