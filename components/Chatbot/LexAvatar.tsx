type LexAvatarProps = {
  size?: number;
};

export function LexAvatar({ size = 28 }: LexAvatarProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden="true">
      {/* Cuerpo */}
      <rect x="6" y="7" width="16" height="12" rx="3" fill="#050505" />
      {/* Ojos */}
      <rect x="9" y="11" width="3" height="3" rx="1" fill="#b99a5b" />
      <rect x="16" y="11" width="3" height="3" rx="1" fill="#b99a5b" />
      {/* Boca */}
      <rect x="10" y="16" width="8" height="1.5" rx="0.75" fill="#b99a5b" />
      {/* Antena */}
      <line x1="14" y1="7" x2="14" y2="4" stroke="#050505" strokeWidth="1.5" />
      {/* Balanza — barra horizontal */}
      <line x1="10" y1="4" x2="18" y2="4" stroke="#050505" strokeWidth="1.5" />
      {/* Balanza — brazos */}
      <line x1="10" y1="4" x2="10" y2="6.5" stroke="#050505" strokeWidth="1" />
      <line x1="18" y1="4" x2="18" y2="6.5" stroke="#050505" strokeWidth="1" />
      {/* Cuerpo inferior / traje */}
      <rect x="10" y="19" width="8" height="5" rx="1" fill="#050505" />
      {/* Detalle corbata */}
      <rect x="12" y="21" width="4" height="1.5" rx="0.75" fill="#b99a5b" />
    </svg>
  );
}
