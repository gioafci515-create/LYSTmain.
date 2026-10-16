type PhotoProps = {
  src: string;
  label: string;
  className?: string;
  overlay?: string;
};

// Layered background: real photo from /public/images if present, warm gradient fallback otherwise.
export default function Photo({ src, label, className = "", overlay }: PhotoProps) {
  const layers = [
    overlay,
    `url(${src})`,
    "linear-gradient(135deg, #c9a97a 0%, #8a6a45 55%, #3b2a1a 100%)",
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div
      role="img"
      aria-label={label}
      className={`bg-cover bg-center ${className}`}
      style={{ backgroundImage: layers }}
    />
  );
}
