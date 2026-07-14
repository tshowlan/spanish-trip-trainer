/* Tongue-in-cheek lines. Lesson-specific rewards live in curriculum.js;
   these are the random "look at you go" lines sprinkled on correct answers
   and the streak/level toasts. Keep them short and a little smug. */

const PRAISE = [
  "Look at you go.",
  "¡Olé!",
  "Chef's kiss.",
  "Barcelona has no idea what's coming.",
  "Smooth. Almost suspiciously smooth.",
  "The waiter would be impressed.",
  "Native speakers hate this one trick.",
  "You absolute polyglot.",
  "Gaudí is taking notes.",
  "That's a tapa-level move."
];

const NEAR_MISS = [
  "So close the steak was almost yours.",
  "Nope, but a confident nope.",
  "The tour guide winced. Try again.",
  "Not quite. The pillow mint is on hold.",
  "Almost! The taxi is still circling."
];

const STREAK_LINES = [
  d => `${d}-day streak. Your future waiter thanks you.`,
  d => `${d} days straight. Duolingo owl is shaking.`,
  d => `${d} in a row, practically a local now.`,
  d => `Day ${d}. The tapas are getting closer.`
];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

if (typeof module !== "undefined") module.exports = { PRAISE, NEAR_MISS, STREAK_LINES, pick };
