import type { ReactNode } from "react";
import { Kbd } from "../../components/typography";

export type RowIcon =
  { kind: "mono"; letter: string; color: string } | { kind: "search" } | { kind: "calc" } | { kind: "play" };

export type Row =
  | { type: "group"; label: string; count: string }
  | { type: "item"; icon: RowIcon; title: string; detail?: string; meta?: string; tab?: boolean; action?: string };

/** `⇥` turns the text typed so far into a site-search chip. */
export type Action = string;

export type Scenario = {
  bubble: ReactNode;
  actions: Action[];
  chip?: { label: string; color: string };
  /** Hint pill in the search row, derived from what has been typed. */
  hint: (typed: string, chipped: boolean) => string | null;
  action: string;
  rows: Row[];
  highlights: number[];
};

const chars = (s: string): Action[] => s.split("");

export const SCENARIOS: Scenario[] = [
  {
    bubble: "yesterday",
    actions: chars("yesterday"),
    hint: () => null,
    action: "Open",
    highlights: [1, 3],
    rows: [
      { type: "group", label: "Yesterday", count: "14 pages" },
      {
        type: "item",
        icon: { kind: "mono", letter: "R", color: "#7c6af0" },
        title: "Roadmap Q4",
        detail: "docs.northwind.example",
        meta: "4:12 PM",
        tab: true,
      },
      {
        type: "item",
        icon: { kind: "mono", letter: "P", color: "#2f9e7a" },
        title: "Pull request #482",
        detail: "git.example",
        meta: "2:48 PM",
      },
      {
        type: "item",
        icon: { kind: "mono", letter: "D", color: "#e0795f" },
        title: "Design Weekly, issue 91",
        detail: "designweekly.example",
        meta: "11:30 AM",
      },
      {
        type: "item",
        icon: { kind: "mono", letter: "F", color: "#3f7de0" },
        title: "Flights to Lisbon",
        detail: "skyfare.example",
        meta: "9:56 AM",
      },
      {
        type: "item",
        icon: { kind: "mono", letter: "E", color: "#c0509f" },
        title: "Espresso ratios, explained",
        detail: "coffeelab.example",
        meta: "9:12 AM",
      },
    ],
  },
  {
    bubble: "12 km in mi",
    actions: chars("12 km in mi"),
    hint: () => null,
    action: "Search",
    highlights: [0, 2],
    rows: [
      {
        type: "item",
        icon: { kind: "calc" },
        title: "= 7.456 mi",
        detail: "12 kilometers in miles",
        meta: "Copy",
        action: "Copy",
      },
      { type: "item", icon: { kind: "search" }, title: "12 km in miles" },
      { type: "item", icon: { kind: "search" }, title: "12 km to mi pace" },
      { type: "item", icon: { kind: "search" }, title: "convert km to miles" },
      { type: "item", icon: { kind: "search" }, title: "12 km running time" },
      { type: "item", icon: { kind: "search" }, title: "12 km in feet" },
    ],
  },
  {
    bubble: (
      <>
        youtube <Kbd className="mx-0.5 align-[1px]">Tab</Kbd> lofi
      </>
    ),
    actions: [...chars("youtube"), "⇥", ...chars("lofi")],
    chip: { label: "YouTube", color: "#e5484d" },
    hint: (typed, chipped) => (chipped ? "Return: Search YouTube" : typed === "youtube" ? "Tab: Search YouTube" : null),
    action: "Search YouTube",
    highlights: [0, 2],
    rows: [
      {
        type: "item",
        icon: { kind: "play" },
        title: "lofi hip hop radio, beats to relax to",
        detail: "Live now",
        meta: "24/7",
      },
      { type: "item", icon: { kind: "search" }, title: "lofi girl" },
      { type: "item", icon: { kind: "search" }, title: "lofi beats to study" },
      { type: "item", icon: { kind: "search" }, title: "lofi jazz mix" },
      { type: "item", icon: { kind: "search" }, title: "lofi for coding" },
      { type: "item", icon: { kind: "search" }, title: "lofi sleep playlist" },
    ],
  },
];

/** What the search field shows after `n` actions. */
export function queryAfter(sc: Scenario, n: number) {
  let text = "";
  let chipped = false;
  for (const a of sc.actions.slice(0, n)) {
    if (a === "⇥") {
      chipped = true;
      text = "";
    } else text += a;
  }
  const typedRaw = sc.actions
    .slice(0, n)
    .filter((a) => a !== "⇥")
    .join("");
  return { text, chipped, typedRaw: chipped ? "" : typedRaw };
}
