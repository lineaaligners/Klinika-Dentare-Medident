// Home-screen app for the Doctor Portal.
//
// The clinic site has its own web manifest (/site.webmanifest). While the portal
// is open we swap in the Academy's manifest, icon and app title, so "Add to Home
// Screen" / "Install app" gives doctors a Medident Academy icon that opens
// straight into the portal. Leaving the portal puts the clinic's back.

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

const MANIFEST = '/academy-app/manifest.webmanifest';
const APPLE_ICON = '/academy-app/apple-touch-icon.png';

let deferred: InstallPromptEvent | null = null;
const listeners = new Set<() => void>();
const changed = () => listeners.forEach((fn) => fn());

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault(); // we show our own button instead of the browser's mini-bar
    deferred = e as InstallPromptEvent;
    changed();
  });
  window.addEventListener('appinstalled', () => {
    deferred = null;
    changed();
  });
}

/** True when the browser offered to install the app (Chrome/Edge on Android or desktop). */
export const canPromptInstall = () => deferred !== null;

export function onInstallAvailabilityChange(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

/** Shows the browser's install dialog. Resolves true when the doctor installed it. */
export async function promptInstall(): Promise<boolean> {
  const d = deferred;
  if (!d) return false;
  deferred = null;
  changed();
  try {
    await d.prompt();
    const choice = await d.userChoice;
    return choice.outcome === 'accepted';
  } catch {
    return false;
  }
}

/** Already running as the installed app. */
export const isStandalone = () =>
  (typeof window.matchMedia === 'function' && window.matchMedia('(display-mode: standalone)').matches) ||
  (navigator as any).standalone === true;

export const isIOS = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

export const isMobile = () => isIOS() || /Android|Mobile/i.test(navigator.userAgent);

/** Puts the Academy's app manifest, icon and title in the page head; returns the undo. */
export function applyPortalAppMeta(): () => void {
  const head = document.head;
  const undo: (() => void)[] = [];

  // Replace the manifest <link> (rather than re-pointing it) so browsers read the new one.
  const oldManifest = head.querySelector<HTMLLinkElement>('link[rel="manifest"]');
  const manifest = document.createElement('link');
  manifest.rel = 'manifest';
  manifest.href = MANIFEST;
  if (oldManifest) {
    oldManifest.replaceWith(manifest);
    undo.push(() => manifest.replaceWith(oldManifest));
  } else {
    head.appendChild(manifest);
    undo.push(() => manifest.remove());
  }

  const icon = head.querySelector<HTMLLinkElement>('link[rel="apple-touch-icon"]');
  if (icon) {
    const prev = icon.getAttribute('href');
    icon.setAttribute('href', APPLE_ICON);
    undo.push(() => (prev === null ? icon.removeAttribute('href') : icon.setAttribute('href', prev)));
  } else {
    const link = document.createElement('link');
    link.rel = 'apple-touch-icon';
    link.href = APPLE_ICON;
    head.appendChild(link);
    undo.push(() => link.remove());
  }

  const meta = (name: string, content: string) => {
    const existing = head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
    if (existing) {
      const prev = existing.content;
      existing.content = content;
      undo.push(() => {
        existing.content = prev;
      });
    } else {
      const el = document.createElement('meta');
      el.name = name;
      el.content = content;
      head.appendChild(el);
      undo.push(() => el.remove());
    }
  };
  meta('apple-mobile-web-app-title', 'Academy');
  meta('apple-mobile-web-app-capable', 'yes');
  meta('mobile-web-app-capable', 'yes');
  meta('apple-mobile-web-app-status-bar-style', 'default');

  return () => {
    while (undo.length) (undo.pop() as () => void)();
  };
}
