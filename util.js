const qs = s => document.querySelector(s);
const qsa = s => document.querySelectorAll(s);

const $E = (tag, props = {}, kids = []) =>
  kids.reduce((e, c) => (e.appendChild(c), e),
              Object.assign(document.createElement(tag), props));

const rand = (m, n) => Math.floor(Math.random() * (n - m + 1)) + m;

const weighted_sample = weights => {
  let total = 0, offsets = {};
  for (const k in weights)
    offsets[k] = total += weights[k];

  const rng = Math.random() * total;
  for (const k in offsets)
    if (rng < offsets[k]) return k;
};

Array.prototype.shuffle = function() {
  for (let a = this, i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
}
