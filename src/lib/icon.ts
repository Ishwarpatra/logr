/** A highlight icon is either an emoji/glyph string or an uploaded image URL.
 *  Image icons are detected by a URL-ish prefix. */
export function isImageIcon(value?: string | null): value is string {
  return !!value && /^(https?:\/\/|\/)/.test(value);
}
