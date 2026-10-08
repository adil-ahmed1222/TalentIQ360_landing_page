import logo from '@/assets/talentiq360-symbol.png';

export function BrandMark({ loader = false }: { loader?: boolean }) {
  return (
    <img
      src={logo}
      alt=""
      width={52}
      height={64}
      draggable={false}
      className={loader ? 'brand-mark brand-mark-loader' : 'brand-mark'}
    />
  );
}
