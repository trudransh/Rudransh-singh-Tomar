import { StringTune, StringCursor, StringMagnetic } from '@fiddle-digital/string-tune';

// StringTune (fiddle.digital) drives the cursor + magnetic effects via
// attributes ([string="magnetic"], [string-cursor]) and CSS variables
// (--x/--y, --magnetic-x/--magnetic-y). Init once after React mounts.
// Returns true on success so the caller can gate cursor visibility —
// if this throws, the site simply falls back to the native cursor.
export function initStringTune(): boolean {
  const tune = StringTune.getInstance();
  tune.use(StringCursor);
  tune.use(StringMagnetic);
  tune.start(0);

  // Grow the cursor over interactive elements. One delegated listener
  // instead of per-element [string="cursor"] targets (which would clash
  // with [string="magnetic"] — same attribute).
  const cursorEls = document.querySelectorAll<HTMLElement>('.st-cursor');
  window.addEventListener(
    'mouseover',
    (e) => {
      const hot = !!(e.target as HTMLElement | null)?.closest('a, button, canvas');
      cursorEls.forEach((el) => el.classList.toggle('-hot', hot));
    },
    { passive: true },
  );
  return true;
}

// Spreadable attribute bags for JSX (React passes unknown lowercase
// attributes straight to the DOM).
export const magnetic = (radius = 300, strength = 0.25): Record<string, string> => ({
  string: 'magnetic',
  'string-radius': String(radius),
  'string-strength': String(strength),
});

export const cursorFollower = (lerp: number): Record<string, string> => ({
  'string-cursor': '',
  'string-cursor-lerp': String(lerp),
});
