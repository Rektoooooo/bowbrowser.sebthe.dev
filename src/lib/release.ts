import { useEffect, useState } from "react";

export const REPO = "https://github.com/Rektoooooo/bow";
export const RELEASES = `${REPO}/releases`;
export const LATEST_RELEASE = `${REPO}/releases/latest`;

export type Release = {
  version: string;
  dmg: string;
  zip: string;
  notes: string;
};

/** The release this page was written against; used until (or if) the GitHub API answers. */
const FALLBACK: Release = {
  version: "0.1.0",
  dmg: `${REPO}/releases/download/v0.1.0/Bow-0.1.0-arm64.dmg`,
  zip: `${REPO}/releases/download/v0.1.0/Bow-0.1.0-arm64.zip`,
  notes: `${REPO}/releases/tag/v0.1.0`,
};

type GitHubAsset = { name: string; browser_download_url: string };
type GitHubRelease = { tag_name: string; html_url: string; assets: GitHubAsset[] };

let cached: Promise<Release> | null = null;

// GitHub allows 60 unauthenticated API calls an hour per IP, so remember the answer for an hour.
const STORE_KEY = "bow:latest-release";
const STORE_MS = 60 * 60 * 1000;

function readStored(): Release | null {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return null;
    const { at, release } = JSON.parse(raw) as { at: number; release: Release };
    return Date.now() - at < STORE_MS ? release : null;
  } catch {
    return null;
  }
}

function store(release: Release) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify({ at: Date.now(), release }));
  } catch {
    // Storage can be unavailable (private mode, blocked site data); the fallback still works.
  }
}

function fetchLatest(): Promise<Release> {
  const stored = readStored();
  if (stored) return (cached ??= Promise.resolve(stored));
  cached ??= fetch("https://api.github.com/repos/Rektoooooo/bow/releases/latest", {
    headers: { Accept: "application/vnd.github+json" },
  })
    .then((res) => (res.ok ? (res.json() as Promise<GitHubRelease>) : Promise.reject(res.status)))
    .then((data) => {
      const asset = (ext: string) => data.assets.find((a) => a.name.endsWith(`arm64.${ext}`))?.browser_download_url;
      const release = {
        version: data.tag_name.replace(/^v/, ""),
        dmg: asset("dmg") ?? FALLBACK.dmg,
        zip: asset("zip") ?? FALLBACK.zip,
        notes: data.html_url,
      };
      store(release);
      return release;
    })
    .catch(() => FALLBACK);
  return cached;
}

/** Latest Bow release from GitHub, starting from the known one so links work before the request finishes. */
export function useRelease(): Release {
  const [release, setRelease] = useState(FALLBACK);
  useEffect(() => {
    let alive = true;
    fetchLatest().then((r) => alive && setRelease(r));
    return () => {
      alive = false;
    };
  }, []);
  return release;
}
