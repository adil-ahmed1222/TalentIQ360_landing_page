const logo = "/images/talentiq-logo.png";

export function BrandMark({
  loader = false,
  alt = "TalentIQ360",
}: {
  loader?: boolean;
  alt?: string;
}) {
  return (
    <img
      src={logo}
      alt={alt}
      width={1024}
      height={917}
      draggable={false}
      className={loader ? "brand-mark brand-mark-loader" : "brand-mark"}
    />
  );
}
