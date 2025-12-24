import type { ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { title?: string };

function IconBase({
  title,
  children,
  ...props
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : "presentation"}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

export function IconX(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </IconBase>
  );
}

export function IconChevronLeft(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M14.5 6.5L9 12l5.5 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </IconBase>
  );
}

export function IconChevronRight(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M9.5 6.5L15 12l-5.5 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </IconBase>
  );
}

export function IconLink(props: IconProps) {
  return (
    <IconBase {...props}>
      <path
        d="M10.5 13.5l3-3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M8.2 15.8l-1.4 1.4a3.2 3.2 0 01-4.5-4.5l1.4-1.4a3.2 3.2 0 014.5 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.8 8.2l1.4-1.4a3.2 3.2 0 014.5 4.5l-1.4 1.4a3.2 3.2 0 01-4.5 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
}

export function IconShare(props: IconProps) {
  return (
    <IconBase {...props}>
      <path
        d="M12 3v12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M7.5 7.5L12 3l4.5 4.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 13v6a2 2 0 002 2h10a2 2 0 002-2v-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
}

export function IconHeart(props: IconProps) {
  return (
    <IconBase {...props}>
      <path
        d="M12 21s-7-4.4-9.3-8.8C1 8.8 3.1 6 6.1 6c1.7 0 3.1.8 3.9 2c.8-1.2 2.2-2 3.9-2 3 0 5.1 2.8 3.4 6.2C19 16.6 12 21 12 21z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </IconBase>
  );
}

export function IconCandle(props: IconProps) {
  return (
    <IconBase {...props}>
      <path
        d="M12 3c1.4 1.8 1.6 3.3 0 5-1.6-1.7-1.4-3.2 0-5z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9 11h6v10H9V11z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9 15h6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </IconBase>
  );
}

export function IconRepeat(props: IconProps) {
  return (
    <IconBase {...props}>
      <path
        d="M7 7h10l-2-2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 17H7l2 2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 7a4 4 0 00-4 4v1M17 17a4 4 0 004-4v-1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </IconBase>
  );
}

export function IconFacebook(props: IconProps) {
  return (
    <IconBase {...props}>
      <path
        d="M14 8.2V6.6c0-.8.5-1 1-1h1.9V3H15c-2.2 0-3.6 1.5-3.6 3.7v1.5H9.5V11h1.9v10H14V11h2.6l.4-2.8H14z"
        fill="currentColor"
      />
    </IconBase>
  );
}

export function IconInstagram(props: IconProps) {
  return (
    <IconBase {...props}>
      <path
        d="M7.2 3h9.6A4.2 4.2 0 0121 7.2v9.6A4.2 4.2 0 0116.8 21H7.2A4.2 4.2 0 013 16.8V7.2A4.2 4.2 0 017.2 3z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M12 16.1a4.1 4.1 0 110-8.2 4.1 4.1 0 010 8.2z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M17.6 6.5h.01"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </IconBase>
  );
}
