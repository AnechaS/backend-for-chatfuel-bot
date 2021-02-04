/**
 * Generate pagination range.
 * @param {Number} last Last page
 * @param {Number} current Current page
 * @param {Number} delta Number of pages after and before
 */
export default function pagination(last, current = 1, delta = 2) {
  let left = 0;
  let right = 0;
  const range = [];

  left = Math.max(1, current - delta) || 1;
  right = current + delta;

  // add to right when the left less than delta
  if (current <= delta) {
    right = right + (delta - (current - left));
  }

  // add to left when the right is greater than the last page
  if (right > last) {
    left = Math.max(1, left - (right - last));
    right = last;
  }

  for (let i = left; i <= right; i++) {
    range.push(i);
  }

  return range;
}
