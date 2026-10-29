import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** The page column: full width up to 1536px, with the gutters that line up with the nav. */
export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cx("mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-12 xl:px-24", className)}>{children}</div>
  );
}

type SectionProps<T extends ElementType> = {
  as?: T;
  className?: string;
  innerClassName?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

/** A full-width band closed by a hairline, holding a Container. */
export function Section<T extends ElementType = "section">({
  as,
  className,
  innerClassName,
  children,
  ...rest
}: SectionProps<T>) {
  const Tag = (as ?? "section") as ElementType;
  return (
    <Tag className={cx("mx-auto w-full border-b border-black/6", className)} {...rest}>
      <Container className={innerClassName}>{children}</Container>
    </Tag>
  );
}

const railPadding = {
  default: "px-6 py-12 sm:px-8 sm:py-16 md:px-14 md:py-24 xl:px-36",
  narrow: "px-6 py-12 sm:px-8 md:px-14 md:py-16 xl:px-66",
  none: "",
} as const;

/** The bordered inner column: the two faint vertical guide lines that run down the whole page. */
export function Rail({
  pad = "default",
  className,
  children,
}: {
  pad?: keyof typeof railPadding;
  className?: string;
  children: ReactNode;
}) {
  return <div className={cx("border-x border-black/6", railPadding[pad], className)}>{children}</div>;
}
