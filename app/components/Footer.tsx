import { site, socialLabels, type SocialKey } from "@/lib/site";

const links = [
  { title: "Contact", value: site.contact.email, note: "[details required]" },
  { title: "Privacy Policy", value: "", note: "[content required]" },
  { title: "Terms", value: "", note: "[content required]" },
];

const socialKeys = Object.keys(socialLabels) as SocialKey[];

export default function Footer() {
  return (
    <footer className="border-t border-[#e6dedb] px-6 py-8 md:px-10 xl:px-20">
      <div className="mx-auto flex max-w-[1760px] flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">
        <div className="w-fit border border-[#e6dedb] bg-[#f1efe9] px-3 py-2 text-xs">
          <p className="text-[10px] font-medium uppercase tracking-[0.15em]">
            Approved asset required
          </p>
          <p className="mt-1 text-black/80">Official V8 EPS not supplied</p>
        </div>

        {links.map((l) => (
          <div key={l.title}>
            <p className="text-sm">{l.title}</p>
            {l.value ? (
              <a
                href={`mailto:${l.value}`}
                className="mt-3 block text-xs underline-offset-4 hover:underline"
              >
                {l.value}
              </a>
            ) : (
              <p className="mt-3 text-xs text-black/70">{l.note}</p>
            )}
          </div>
        ))}

        <div>
          <p className="text-sm">Follow</p>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs xl:flex-col">
            {socialKeys.map((k) => {
              const href = site.social[k];
              return (
                <li key={k}>
                  {href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-8 items-center underline-offset-4 hover:underline"
                    >
                      {socialLabels[k]} <span aria-hidden className="ml-1">&#8599;</span>
                    </a>
                  ) : (
                    <span className="text-black/70">{socialLabels[k]} [link required]</span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <p className="mx-auto mt-8 max-w-[1760px] text-[10px] font-medium uppercase tracking-[0.15em]">
        Proposal — content approval required
      </p>
    </footer>
  );
}
