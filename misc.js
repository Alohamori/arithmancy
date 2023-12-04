let guess, answer = [0, 0], checker;
const anim = true, sound = true;

const generate = odd => {
  let critter, solution = rand(0, 4) * 2 + odd;
  for (critter = solution; critter == solution; critter = rand(0, 9));

  const weights = {};
  for (let n = 0; n <= 17; ++n) weights[n] = n < 1 || n > 9 ? 1 : 3;
  weights[solution] = 0;
  const numeral = weighted_sample(weights) * 1;

  const pieces = [[solution, 's'], [critter, 'c'], [numeral, 'n']];
  if (numeral != critter && numeral < 10 && rand(0, 10) == 5) pieces[2][1] = 'c';
  pieces.shuffle();
  const total = solution + critter + numeral;
  pieces.push([total, 'n']);
  if (total < 10 && rand(0, 6) == 3) pieces[3][1] = 'c';

  answer[odd] = solution;
  return pieces;
};

const chalk = new Audio('ui/chalk.mp3');
const wipes = 'up left top-right top-left bottom-right bottom-left right down'.split(' ');

const check = () => {
  if (guess.join() == answer.join()) tick();
};

const set_value = (e, v) => {
  if (isNaN(v)) e.classList.replace('critter', 'numeral');
  else e.classList.replace('numeral', 'critter');
  e.innerText = v;
};

const flip = ev => {
  clearTimeout(checker);
  const e = ev.target;
  const g = e.parentNode.id[1] * 1;
  const o = ev.shiftKey ? -2 : 2;
  let v = e.innerText * 1 + o || g;
  v = v < 10 ? v : '?'.repeat(g + 1);

  if (sound) {
    chalk.currentTime = rand(0, 31) / 10;
    chalk.play();
    setTimeout(() => chalk.pause(), 600);
  }

  if (anim) {
    const w = rand(0, 7);
    e.setAttribute('transition-style', `out:wipe:${wipes[w]}`);
    setTimeout(() => {
      set_value(e, v);
      e.setAttribute('transition-style', `in:wipe:${wipes[7 - w]}`);
    }, 350);
  } else set_value(e, v);

  guess[g] = v;
  checker = setTimeout(check, 1000);
}

const set_puzzle = p => {
  const g = qsa('.geom')[p];
  generate(p).forEach(([v, k], i) => {
    const c = g.children[i];
    c.innerText = k == 's' ? '?'.repeat(p + 1) : v;
    c.className = k == 'c' ? 'critter' : 'numeral';
    c.removeEventListener('click', flip);
    if (k == 's') {
      c.classList.add('tap');
      c.addEventListener('click', flip);
    }
  });
};

const tick = () => {
  guess = [null, null];
  set_puzzle(0);
  set_puzzle(1);
};

document.addEventListener('DOMContentLoaded', tick);

document.addEventListener('keyup', ev => {
  if (ev.keyCode != 32) return;
  qsa('.tap')[ev.shiftKey * 1].click();
});
