export default function SectionHeading({
  label,
  children,
  intro,
}: {
  label: string;
  children: React.ReactNode;
  intro: string;
}) {
  return (
    <>
      <p className="text-[11px] uppercase tracking-[0.2em]">{label}</p>
      <div className="mt-8 xl:flex xl:items-end xl:justify-between">
        <h2 className="text-[34px] font-light leading-[1.05] tracking-tight md:text-5xl xl:text-[80px]">
          {children}
        </h2>
        <p className="mt-6 max-w-[360px] text-sm font-light leading-relaxed text-black/80 md:text-base xl:mb-4 xl:mt-0 xl:max-w-[350px]">
          {intro}
        </p>
      </div>
    </>
  );
}
