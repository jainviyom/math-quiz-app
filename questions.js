/* ---------- generic helpers ---------- */
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function choice(arr) { return arr[randInt(0, arr.length - 1)]; }
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }
function lcm(a, b) { return (a * b) / gcd(a, b); }
function ordinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
function formatIndian(num) {
  const numStr = Math.trunc(num).toString();
  const lastThree = numStr.substring(numStr.length - 3);
  const other = numStr.substring(0, numStr.length - 3);
  const withCommas = other !== "" ? ("," + lastThree) : lastThree;
  const otherFormatted = other.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return otherFormatted + withCommas;
}

const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function twoDigitWords(n) {
  if (n === 0) return '';
  if (n < 20) return ONES[n];
  return TENS[Math.floor(n / 10)] + (n % 10 ? ' ' + ONES[n % 10] : '');
}
function threeDigitWords(n) {
  let str = '';
  if (n >= 100) {
    str += ONES[Math.floor(n / 100)] + ' Hundred';
    n = n % 100;
    if (n) str += ' ';
  }
  if (n > 0) str += twoDigitWords(n);
  return str;
}
function numberToWordsIndian(num) {
  if (num === 0) return 'Zero';
  let n = num;
  const crore = Math.floor(n / 1e7); n %= 1e7;
  const lakh = Math.floor(n / 1e5); n %= 1e5;
  const thousand = Math.floor(n / 1e3); n %= 1e3;
  const rest = n;
  const parts = [];
  if (crore) parts.push(threeDigitWords(crore) + ' Crore');
  if (lakh) parts.push(twoDigitWords(lakh) + ' Lakh');
  if (thousand) parts.push(twoDigitWords(thousand) + ' Thousand');
  if (rest) parts.push(threeDigitWords(rest));
  return parts.join(' ') || 'Zero';
}
function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
  return true;
}

/* ---------- Chapter 1: The Fish Tale (large numbers & place value) ---------- */
function placeValueQ(diff) {
  const digits = diff === 'easy' ? 5 : diff === 'medium' ? 6 : 7;
  const num = randInt(Math.pow(10, digits - 1), Math.pow(10, digits) - 1);
  const numStr = num.toString();
  const pos = randInt(0, numStr.length - 1);
  const digit = numStr[pos];
  const placeNamesFromRight = ['Ones', 'Tens', 'Hundreds', 'Thousands', 'Ten Thousands', 'Lakhs', 'Ten Lakhs', 'Crores'];
  const placeIndexFromRight = numStr.length - 1 - pos;
  const faceValue = parseInt(digit, 10);
  const placeValue = faceValue * Math.pow(10, placeIndexFromRight);
  const correct = formatIndian(placeValue);
  const seen = new Set([correct]);
  const distractors = [];
  const faceValueStr = formatIndian(faceValue);
  if (!seen.has(faceValueStr)) { seen.add(faceValueStr); distractors.push(faceValueStr); }
  while (distractors.length < 3) {
    const noise = randInt(1, 9) * Math.pow(10, randInt(0, placeIndexFromRight + 1));
    const noiseStr = formatIndian(noise);
    if (!seen.has(noiseStr)) { seen.add(noiseStr); distractors.push(noiseStr); }
  }
  const options = shuffle([correct, ...distractors]);
  return { type: 'mcq', marks: 1, text: `In the number ${formatIndian(num)}, what is the place value of the digit ${digit}?`, options, answer: correct };
}
function numberNameQ(diff) {
  const digits = diff === 'easy' ? 4 : diff === 'medium' ? 6 : 7;
  const num = randInt(Math.pow(10, digits - 1), Math.pow(10, digits) - 1);
  return { type: 'fill', marks: 1, text: `Write ${formatIndian(num)} in words.`, answer: numberToWordsIndian(num) };
}
function expandedFormQ(diff) {
  const digits = diff === 'easy' ? 4 : diff === 'medium' ? 5 : 6;
  const num = randInt(Math.pow(10, digits - 1), Math.pow(10, digits) - 1);
  const numStr = num.toString();
  const terms = [];
  for (let i = 0; i < numStr.length; i++) {
    const d = parseInt(numStr[i], 10);
    if (d === 0) continue;
    terms.push(formatIndian(d * Math.pow(10, numStr.length - 1 - i)));
  }
  return { type: 'fill', marks: 1, text: `Write ${formatIndian(num)} in expanded form.`, answer: terms.join(' + ') };
}
function compareNumbersQ(diff) {
  const digits = diff === 'easy' ? 3 : diff === 'medium' ? 5 : 7;
  let a = randInt(Math.pow(10, digits - 1), Math.pow(10, digits) - 1);
  let b = randInt(Math.pow(10, digits - 1), Math.pow(10, digits) - 1);
  while (b === a) b = randInt(Math.pow(10, digits - 1), Math.pow(10, digits) - 1);
  const correct = a > b ? '>' : '<';
  return { type: 'mcq', marks: 1, text: `Which symbol correctly compares these numbers? ${formatIndian(a)} ___ ${formatIndian(b)}`, options: shuffle(['>', '<', '=']), answer: correct };
}
function succPredQ(diff) {
  const digits = diff === 'easy' ? 3 : diff === 'medium' ? 5 : 7;
  const num = randInt(Math.pow(10, digits - 1) + 1, Math.pow(10, digits) - 2);
  if (Math.random() < 0.5) return { type: 'fill', marks: 1, text: `What is the successor of ${formatIndian(num)}?`, answer: formatIndian(num + 1) };
  return { type: 'fill', marks: 1, text: `What is the predecessor of ${formatIndian(num)}?`, answer: formatIndian(num - 1) };
}

/* ---------- Chapter 2: Shapes and Angles ---------- */
function classifyAngle(d) {
  if (d === 90) return 'Right';
  if (d === 180) return 'Straight';
  if (d < 90) return 'Acute';
  if (d > 90 && d < 180) return 'Obtuse';
  return 'Reflex';
}
function angleTypeQ(diff) {
  let degree;
  if (diff === 'easy') degree = choice([30, 45, 60, 75, 90, 100, 120, 150, 180]);
  else if (diff === 'medium') degree = choice([20, 50, 90, 110, 135, 180, 200, 250]);
  else degree = randInt(1, 359);
  const type = classifyAngle(degree);
  let options = shuffle(['Acute', 'Right', 'Obtuse', 'Straight', 'Reflex']).slice(0, 4);
  if (!options.includes(type)) options[0] = type;
  options = shuffle(options);
  return { type: 'mcq', marks: 1, text: `An angle measures ${degree}°. What type of angle is this?`, options, answer: type };
}
function triangleAngleQ(diff) {
  const a = randInt(diff === 'easy' ? 20 : 10, diff === 'easy' ? 70 : 100);
  const b = randInt(diff === 'easy' ? 20 : 10, Math.max(179 - a - 10, 21));
  const c = 180 - a - b;
  return { type: 'fill', marks: 2, text: `Two angles of a triangle measure ${a}° and ${b}°. What is the measure of the third angle?`, answer: `${c}°` };
}
function rightAngleFactQ() {
  return { type: 'fill', marks: 1, text: `A right angle measures ______ degrees.`, answer: '90°' };
}
const POLYGON_NAMES = { 3: 'Triangle', 4: 'Quadrilateral', 5: 'Pentagon', 6: 'Hexagon', 7: 'Heptagon', 8: 'Octagon' };
function polygonSidesQ(diff) {
  const sidesOptions = diff === 'easy' ? [3, 4, 5] : diff === 'medium' ? [4, 5, 6] : [5, 6, 7, 8];
  const sides = choice(sidesOptions);
  const correct = POLYGON_NAMES[sides];
  const distractors = shuffle(Object.values(POLYGON_NAMES).filter(n => n !== correct)).slice(0, 3);
  return { type: 'mcq', marks: 1, text: `What is the name of a closed shape (polygon) with ${sides} sides?`, options: shuffle([correct, ...distractors]), answer: correct };
}

/* ---------- Chapter 3: How Many Squares? ---------- */
function gridSquaresQ(diff) {
  const rows = diff === 'easy' ? randInt(2, 4) : diff === 'medium' ? randInt(3, 6) : randInt(5, 9);
  const cols = diff === 'easy' ? randInt(2, 4) : diff === 'medium' ? randInt(3, 6) : randInt(5, 9);
  return { type: 'fill', marks: 1, text: `A rectangle is divided into equal small squares arranged in ${rows} rows and ${cols} columns. How many small squares are there in total?`, answer: String(rows * cols) };
}
function rowsFromTotalQ(diff) {
  const cols = randInt(2, diff === 'easy' ? 5 : 8);
  const rows = randInt(2, diff === 'easy' ? 5 : 8);
  const total = rows * cols;
  return { type: 'fill', marks: 1, text: `A grid of equal squares has ${cols} columns and ${total} small squares in total. How many rows does it have?`, answer: String(rows) };
}
function tilesRectangleWordQ(diff) {
  const perRow = randInt(diff === 'easy' ? 3 : 5, diff === 'easy' ? 8 : 12);
  const rows = randInt(3, diff === 'hard' ? 10 : 6);
  const name = choice(['Riya', 'Aarav', 'Meera', 'Kabir', 'Ishaan', 'Ananya', 'Diya', 'Vihaan']);
  return { type: 'word', marks: 2, text: `${name} is tiling a rectangular floor with square tiles. ${name} places ${perRow} tiles in each row and makes ${rows} such rows. How many tiles did ${name} use in total?`, answer: String(perRow * rows) };
}

/* ---------- Chapter 4: Parts and Wholes (fractions) ---------- */
function fractionOfWholeQ(diff) {
  const denom = diff === 'easy' ? choice([2, 4, 5, 10]) : diff === 'medium' ? choice([6, 8, 10, 12]) : choice([8, 10, 12, 16, 20]);
  const numer = randInt(1, denom - 1);
  const item = choice(['pizza', 'cake', 'chocolate bar', 'sheet of paper', 'ribbon']);
  const name = choice(['Aarav', 'Diya', 'Kabir', 'Meera', 'Ishaan', 'Ananya']);
  return { type: 'fill', marks: 1, text: `A ${item} is divided into ${denom} equal parts. ${name} takes ${numer} part(s). What fraction of the ${item} did ${name} take?`, answer: `${numer}/${denom}` };
}
function equivalentFractionQ(diff) {
  const b = diff === 'easy' ? choice([2, 3, 4, 5]) : choice([3, 4, 5, 6, 7]);
  const a = randInt(1, b - 1);
  const mult = randInt(2, diff === 'hard' ? 6 : 4);
  const correct = `${a * mult}/${b * mult}`;
  const distractors = new Set();
  while (distractors.size < 3) {
    const dm = randInt(2, 6);
    const variant = Math.random() < 0.5 ? `${a * dm + 1}/${b * dm}` : `${a * dm}/${b * dm + 1}`;
    if (variant !== correct) distractors.add(variant);
  }
  return { type: 'mcq', marks: 1, text: `Which fraction is equivalent to ${a}/${b}?`, options: shuffle([correct, ...Array.from(distractors)]), answer: correct };
}
function compareFractionsQ(diff) {
  const denom = diff === 'easy' ? choice([4, 5, 8, 10]) : choice([6, 8, 9, 12]);
  let n1 = randInt(1, denom - 1), n2 = randInt(1, denom - 1);
  while (n2 === n1) n2 = randInt(1, denom - 1);
  const correct = n1 > n2 ? `${n1}/${denom}` : `${n2}/${denom}`;
  const other = n1 > n2 ? `${n2}/${denom}` : `${n1}/${denom}`;
  let options = Array.from(new Set([correct, other, `${denom - 1}/${denom}`, `1/${denom}`])).slice(0, 4);
  if (!options.includes(correct)) options[0] = correct;
  return { type: 'mcq', marks: 1, text: `Which fraction is greater: ${n1}/${denom} or ${n2}/${denom}?`, options: shuffle(options), answer: correct };
}
function addSubtractLikeFractionsQ(diff) {
  const denom = diff === 'easy' ? choice([4, 5, 6, 8]) : choice([7, 8, 9, 10, 12]);
  let a = randInt(1, denom - 1), b = randInt(1, denom - 1);
  const op = Math.random() < 0.5 ? '+' : '-';
  if (op === '+' && a + b > denom) b = denom - a > 0 ? randInt(1, denom - a) : 1;
  if (op === '-' && a < b) [a, b] = [b, a];
  const result = op === '+' ? a + b : a - b;
  return { type: 'fill', marks: 1, text: `${a}/${denom} ${op} ${b}/${denom} = ______`, answer: `${result}/${denom}` };
}

/* ---------- Chapter 5: Does it Look the Same? (symmetry) ---------- */
const SYMMETRY_SHAPES = { 'Square': '4', 'Rectangle': '2', 'Equilateral Triangle': '3', 'Isosceles Triangle': '1', 'Circle': 'infinite (many)', 'Regular Pentagon': '5', 'Regular Hexagon': '6', 'Rhombus': '2' };
function linesOfSymmetryQ(diff) {
  const keys = diff === 'easy' ? ['Square', 'Rectangle', 'Equilateral Triangle'] : diff === 'medium' ? ['Isosceles Triangle', 'Rhombus', 'Regular Pentagon'] : ['Regular Hexagon', 'Circle', 'Regular Pentagon'];
  const shape = choice(keys);
  return { type: 'fill', marks: 1, text: `How many lines of symmetry does a ${shape} have?`, answer: SYMMETRY_SHAPES[shape] };
}
const LETTER_SYMMETRY = { A: true, B: true, C: true, D: true, E: true, F: false, G: false, H: true, I: true, J: false, K: false, L: false, M: true, N: false, O: true, P: false, Q: false, R: false, S: false, T: true, U: true, V: true, W: true, X: true, Y: true, Z: false };
function letterSymmetryQ() {
  const letter = choice(Object.keys(LETTER_SYMMETRY));
  const correct = LETTER_SYMMETRY[letter] ? 'Yes' : 'No';
  return { type: 'mcq', marks: 1, text: `Does the capital letter "${letter}" have at least one line of symmetry?`, options: shuffle(['Yes', 'No']), answer: correct };
}

/* ---------- Chapter 6: Be My Multiple, I'll be Your Factor ---------- */
function factorsOfQ(diff) {
  const n = diff === 'easy' ? randInt(6, 24) : diff === 'medium' ? randInt(20, 50) : randInt(40, 100);
  const factors = [];
  for (let i = 1; i <= n; i++) if (n % i === 0) factors.push(i);
  return { type: 'fill', marks: 2, text: `List all the factors of ${n}.`, answer: factors.join(', ') };
}
function primeCompositeQ(diff) {
  const n = diff === 'easy' ? randInt(2, 30) : diff === 'medium' ? randInt(2, 60) : randInt(2, 100);
  const correct = isPrime(n) ? 'Prime' : 'Composite';
  return { type: 'mcq', marks: 1, text: `Is ${n} a prime number or a composite number?`, options: shuffle(['Prime', 'Composite']), answer: correct };
}
function lcmQ(diff) {
  const a = diff === 'easy' ? randInt(2, 10) : diff === 'medium' ? randInt(4, 15) : randInt(6, 20);
  const b = diff === 'easy' ? randInt(2, 10) : diff === 'medium' ? randInt(4, 15) : randInt(6, 20);
  return { type: 'fill', marks: 2, text: `Find the LCM of ${a} and ${b}.`, answer: String(lcm(a, b)) };
}
function hcfQ(diff) {
  const a = diff === 'easy' ? randInt(4, 20) : diff === 'medium' ? randInt(10, 40) : randInt(20, 80);
  const b = diff === 'easy' ? randInt(4, 20) : diff === 'medium' ? randInt(10, 40) : randInt(20, 80);
  return { type: 'fill', marks: 2, text: `Find the HCF of ${a} and ${b}.`, answer: String(gcd(a, b)) };
}
function divisibilityQ(diff) {
  const divisor = choice([2, 3, 5, 10]);
  const n = diff === 'easy' ? randInt(10, 99) : diff === 'medium' ? randInt(100, 999) : randInt(1000, 9999);
  const correct = n % divisor === 0 ? 'Yes' : 'No';
  return { type: 'mcq', marks: 1, text: `Is ${n} divisible by ${divisor}?`, options: shuffle(['Yes', 'No']), answer: correct };
}

/* ---------- Chapter 7: Can You See the Pattern? ---------- */
function arithSeqNextQ(diff) {
  const start = diff === 'easy' ? randInt(1, 20) : diff === 'medium' ? randInt(1, 50) : randInt(1, 100);
  const step = diff === 'easy' ? randInt(2, 5) : diff === 'medium' ? randInt(3, 9) : randInt(5, 15);
  const terms = [start, start + step, start + 2 * step, start + 3 * step];
  return { type: 'fill', marks: 1, text: `Find the next number in the pattern: ${terms.join(', ')}, ______`, answer: String(start + 4 * step) };
}
function missingMiddleQ(diff) {
  const start = randInt(1, diff === 'easy' ? 20 : 60);
  const step = diff === 'easy' ? randInt(2, 6) : randInt(3, 10);
  const terms = [start, start + step, start + 2 * step, start + 3 * step, start + 4 * step];
  const hideIdx = randInt(1, 3);
  const display = terms.map((t, i) => (i === hideIdx ? '___' : t));
  return { type: 'fill', marks: 1, text: `Find the missing number in the pattern: ${display.join(', ')}`, answer: String(terms[hideIdx]) };
}
function shapePatternQ(diff) {
  const n = diff === 'easy' ? 4 : diff === 'medium' ? 5 : 6;
  const seq = [1, 3, 6, 10, 15, 21].slice(0, n);
  const nextN = n + 1;
  const answer = (nextN * (nextN + 1)) / 2;
  return { type: 'word', marks: 2, text: `Dots are arranged to form a growing triangular pattern with ${seq.join(', ')}, ... dots in successive figures. Following the same pattern, how many dots will be in the ${ordinal(nextN)} figure?`, answer: String(answer) };
}

/* ---------- Chapter 8: Mapping Your Way ---------- */
function mapScaleDistanceQ(diff) {
  const scaleKm = diff === 'easy' ? choice([1, 2, 5]) : diff === 'medium' ? choice([5, 10, 20]) : choice([10, 25, 50]);
  const mapCm = diff === 'easy' ? randInt(2, 10) : diff === 'medium' ? randInt(3, 15) : randInt(4, 20);
  return { type: 'word', marks: 2, text: `On a map, the scale is 1 cm = ${scaleKm} km. If the distance between two villages on the map is ${mapCm} cm, what is the actual distance between them?`, answer: `${scaleKm * mapCm} km` };
}
function reverseScaleQ(diff) {
  const scaleKm = diff === 'easy' ? choice([1, 2, 5]) : choice([5, 10, 20]);
  const mult = randInt(2, 12);
  const actual = scaleKm * mult;
  return { type: 'word', marks: 2, text: `A map is drawn to a scale of 1 cm = ${scaleKm} km. What distance on the map would represent an actual distance of ${actual} km?`, answer: `${mult} cm` };
}
function directionQ() {
  const dirs = ['North', 'East', 'South', 'West'];
  const startIdx = randInt(0, 3);
  const turns = choice([['right'], ['left'], ['right', 'right'], ['left', 'left'], ['right', 'right', 'right']]);
  let idx = startIdx;
  turns.forEach(t => { idx = t === 'right' ? (idx + 1) % 4 : (idx + 3) % 4; });
  const correct = dirs[idx];
  return { type: 'mcq', marks: 1, text: `If you are facing ${dirs[startIdx]} and turn ${turns.join(' then turn ')}, which direction are you facing now?`, options: shuffle([...dirs]), answer: correct };
}

/* ---------- Chapter 9: Boxes and Sketches (3D shapes) ---------- */
const SOLID_DATA = {
  Cube: { faces: 6, edges: 12, vertices: 8 },
  Cuboid: { faces: 6, edges: 12, vertices: 8 },
  Cylinder: { faces: 3, edges: 2, vertices: 0 },
  Cone: { faces: 2, edges: 1, vertices: 1 },
  Sphere: { faces: 1, edges: 0, vertices: 0 },
  'Square Pyramid': { faces: 5, edges: 8, vertices: 5 },
};
function facesEdgesVerticesQ() {
  const shapes = Object.keys(SOLID_DATA);
  const shape = choice(shapes);
  const attr = choice(['faces', 'edges', 'vertices']);
  const correct = String(SOLID_DATA[shape][attr]);
  const pool = new Set(Object.values(SOLID_DATA).map(s => String(s[attr])));
  pool.delete(correct);
  let distractors = shuffle(Array.from(pool)).slice(0, 3);
  while (distractors.length < 3) {
    const v = String(randInt(0, 12));
    if (v !== correct && !distractors.includes(v)) distractors.push(v);
  }
  return { type: 'mcq', marks: 1, text: `How many ${attr} does a ${shape} have?`, options: shuffle([correct, ...distractors]), answer: correct };
}
function identifyShapeQ() {
  const shapes = Object.keys(SOLID_DATA);
  const shape = choice(shapes);
  const d = SOLID_DATA[shape];
  const others = shuffle(shapes.filter(s => s !== shape)).slice(0, 3);
  return { type: 'mcq', marks: 1, text: `Which solid shape has ${d.faces} face(s), ${d.edges} edge(s) and ${d.vertices} vertex/vertices?`, options: shuffle([shape, ...others]), answer: shape };
}

/* ---------- Chapter 10: Tenths and Hundredths (decimals) ---------- */
function fractionToDecimalQ(diff) {
  const denom = diff === 'easy' ? 10 : 100;
  const numer = randInt(1, denom - 1);
  const decimal = (numer / denom).toFixed(denom === 10 ? 1 : 2);
  return { type: 'fill', marks: 1, text: `Write ${numer}/${denom} as a decimal.`, answer: decimal };
}
function decimalToFractionQ(diff) {
  const denom = diff === 'easy' ? 10 : 100;
  const numer = randInt(1, denom - 1);
  const decStr = denom === 10 ? `0.${numer}` : `0.${String(numer).padStart(2, '0')}`;
  return { type: 'fill', marks: 1, text: `Write ${decStr} as a fraction.`, answer: `${numer}/${denom}` };
}
function addSubtractDecimalsQ(diff) {
  const dp = diff === 'easy' ? 1 : 2;
  let a = randInt(10, diff === 'hard' ? 999 : 99) / Math.pow(10, dp);
  let b = randInt(10, diff === 'hard' ? 999 : 99) / Math.pow(10, dp);
  const op = Math.random() < 0.5 ? '+' : '-';
  if (op === '-' && a < b) [a, b] = [b, a];
  let result = op === '+' ? a + b : a - b;
  result = Math.round(result * Math.pow(10, dp)) / Math.pow(10, dp);
  return { type: 'fill', marks: 1, text: `${a.toFixed(dp)} ${op} ${b.toFixed(dp)} = ______`, answer: result.toFixed(dp) };
}
function compareDecimalsQ(diff) {
  const dp = diff === 'easy' ? 1 : 2;
  let a = randInt(10, 999) / Math.pow(10, dp);
  let b = randInt(10, 999) / Math.pow(10, dp);
  while (a === b) b = randInt(10, 999) / Math.pow(10, dp);
  const symbol = a > b ? '>' : '<';
  return { type: 'mcq', marks: 1, text: `Compare: ${a.toFixed(dp)} ___ ${b.toFixed(dp)}`, options: shuffle(['>', '<', '=']), answer: symbol };
}
function decimalPlaceValueQ() {
  const whole = randInt(1, 99);
  const d1 = randInt(0, 9), d2 = randInt(0, 9);
  const numStr = `${whole}.${d1}${d2}`;
  const askTenths = Math.random() < 0.5;
  const digit = askTenths ? d1 : d2;
  const placeName = askTenths ? 'tenths' : 'hundredths';
  const correct = String(digit);
  const distractors = new Set();
  while (distractors.size < 3) {
    const v = String(randInt(0, 9));
    if (v !== correct) distractors.add(v);
  }
  return { type: 'mcq', marks: 1, text: `In the number ${numStr}, what digit is in the ${placeName} place?`, options: shuffle([correct, ...Array.from(distractors)]), answer: correct };
}

/* ---------- Chapter 11: Area and its Boundary ---------- */
function rectangleAreaQ(diff) {
  const l = diff === 'easy' ? randInt(3, 12) : diff === 'medium' ? randInt(5, 25) : randInt(10, 50);
  const b = diff === 'easy' ? randInt(3, 12) : diff === 'medium' ? randInt(5, 25) : randInt(10, 50);
  return { type: 'fill', marks: 1, text: `A rectangle has length ${l} cm and breadth ${b} cm. Find its area.`, answer: `${l * b} sq cm` };
}
function rectanglePerimeterQ(diff) {
  const l = diff === 'easy' ? randInt(3, 12) : diff === 'medium' ? randInt(5, 25) : randInt(10, 50);
  const b = diff === 'easy' ? randInt(3, 12) : diff === 'medium' ? randInt(5, 25) : randInt(10, 50);
  return { type: 'fill', marks: 1, text: `A rectangle has length ${l} cm and breadth ${b} cm. Find its perimeter.`, answer: `${2 * (l + b)} cm` };
}
function squareAreaPerimeterQ(diff) {
  const s = diff === 'easy' ? randInt(3, 15) : diff === 'medium' ? randInt(5, 30) : randInt(10, 60);
  if (Math.random() < 0.5) return { type: 'fill', marks: 1, text: `A square has side ${s} cm. Find its area.`, answer: `${s * s} sq cm` };
  return { type: 'fill', marks: 1, text: `A square has side ${s} cm. Find its perimeter.`, answer: `${4 * s} cm` };
}
function missingSideWordQ(diff) {
  const l = diff === 'easy' ? randInt(4, 15) : randInt(6, 30);
  const b = diff === 'easy' ? randInt(4, 15) : randInt(6, 30);
  const perimeter = 2 * (l + b);
  return { type: 'word', marks: 2, text: `The perimeter of a rectangular garden is ${perimeter} m. If its length is ${l} m, what is its breadth?`, answer: `${b} m` };
}
function compositeAreaWordQ() {
  const l1 = randInt(4, 10), b1 = randInt(3, 8), l2 = randInt(2, 6), b2 = randInt(2, 6);
  const total = l1 * b1 + l2 * b2;
  return { type: 'word', marks: 2, text: `A room is L-shaped, made of two rectangular parts: one measuring ${l1} m by ${b1} m, and the other measuring ${l2} m by ${b2} m. Find the total floor area of the room.`, answer: `${total} sq m` };
}

/* ---------- Chapter 12: Smart Charts (data handling) ---------- */
function dataTableQ(diff) {
  let categories = choice([
    ['Mango', 'Apple', 'Banana', 'Orange'],
    ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    ['Class 5A', 'Class 5B', 'Class 5C']
  ]);
  const n = diff === 'easy' ? Math.min(4, categories.length) : diff === 'medium' ? Math.min(5, categories.length) : categories.length;
  categories = categories.slice(0, n);
  const values = categories.map(() => randInt(diff === 'easy' ? 5 : 10, diff === 'easy' ? 25 : diff === 'medium' ? 50 : 100));
  const tableText = categories.map((c, i) => `${c}: ${values[i]}`).join(', ');
  const qType = choice(['total', 'max', 'min', 'diff']);
  let text, answer;
  if (qType === 'total') { text = `The table shows this data - ${tableText}. What is the total?`; answer = String(values.reduce((a, b) => a + b, 0)); }
  else if (qType === 'max') { const idx = values.indexOf(Math.max(...values)); text = `The table shows this data - ${tableText}. Which category has the highest value?`; answer = categories[idx]; }
  else if (qType === 'min') { const idx = values.indexOf(Math.min(...values)); text = `The table shows this data - ${tableText}. Which category has the lowest value?`; answer = categories[idx]; }
  else {
    const i1 = randInt(0, categories.length - 1);
    let i2 = randInt(0, categories.length - 1);
    while (i2 === i1) i2 = randInt(0, categories.length - 1);
    text = `The table shows this data - ${tableText}. What is the difference between ${categories[i1]} and ${categories[i2]}?`;
    answer = String(Math.abs(values[i1] - values[i2]));
  }
  return { type: 'word', marks: 2, text, answer };
}
function pictographQ() {
  const unitValue = choice([2, 5, 10]);
  const items = choice([['Apples', 'Bananas', 'Oranges'], ['Cars', 'Bikes', 'Buses']]);
  const symbols = items.map(() => randInt(2, 8));
  const text = `In a pictograph, each symbol represents ${unitValue} items. The symbols shown are: ` +
    items.map((it, i) => `${it} - ${symbols[i]} symbols`).join(', ') + `. How many ${items[0]} are there in total?`;
  return { type: 'word', marks: 2, text, answer: String(symbols[0] * unitValue) };
}

/* ---------- Chapter 13: Ways to Multiply and Divide ---------- */
function multiDigitMultiplicationQ(diff) {
  const a = diff === 'easy' ? randInt(10, 50) : diff === 'medium' ? randInt(50, 300) : randInt(100, 999);
  const b = diff === 'easy' ? randInt(2, 9) : diff === 'medium' ? randInt(10, 50) : randInt(10, 99);
  return { type: 'fill', marks: 1, text: `${a} × ${b} = ______`, answer: String(a * b) };
}
function divisionWithRemainderQ(diff) {
  const divisor = diff === 'easy' ? randInt(2, 9) : diff === 'medium' ? randInt(5, 20) : randInt(10, 30);
  const quotient = diff === 'easy' ? randInt(3, 20) : diff === 'medium' ? randInt(10, 50) : randInt(20, 100);
  const remainder = randInt(0, divisor - 1);
  const dividend = divisor * quotient + remainder;
  return { type: 'fill', marks: 1, text: `${dividend} ÷ ${divisor} = ______ (quotient), remainder ______`, answer: `Quotient = ${quotient}, Remainder = ${remainder}` };
}
function wordMultiplicationQ(diff) {
  const price = diff === 'easy' ? randInt(5, 50) : diff === 'medium' ? randInt(20, 200) : randInt(50, 500);
  const qty = diff === 'easy' ? randInt(3, 20) : diff === 'medium' ? randInt(10, 50) : randInt(20, 100);
  const item = choice(['pencils', 'notebooks', 'chocolates', 'story books', 'mangoes']);
  return { type: 'word', marks: 2, text: `One ${item.slice(0, -1)} costs ₹${price}. What is the total cost of ${qty} ${item}?`, answer: `₹${price * qty}` };
}
function wordDivisionQ(diff) {
  const groups = diff === 'easy' ? randInt(2, 10) : diff === 'medium' ? randInt(5, 20) : randInt(10, 30);
  const perGroup = diff === 'easy' ? randInt(3, 15) : diff === 'medium' ? randInt(5, 30) : randInt(10, 50);
  return { type: 'word', marks: 2, text: `${groups * perGroup} candies are shared equally among ${groups} children. How many candies does each child get?`, answer: String(perGroup) };
}

/* ---------- Chapter 14: How Big? How Heavy? (measurement) ---------- */
function lengthConversionQ(diff) {
  if (Math.random() < 0.5) {
    const km = diff === 'easy' ? randInt(1, 10) : randInt(1, 50);
    return { type: 'fill', marks: 1, text: `Convert ${km} km into metres.`, answer: `${km * 1000} m` };
  }
  const m = diff === 'easy' ? randInt(1, 10) : randInt(1, 50);
  return { type: 'fill', marks: 1, text: `Convert ${m} m into centimetres.`, answer: `${m * 100} cm` };
}
function weightConversionQ(diff) {
  const kg = diff === 'easy' ? randInt(1, 10) : randInt(1, 50);
  return { type: 'fill', marks: 1, text: `Convert ${kg} kg into grams.`, answer: `${kg * 1000} g` };
}
function volumeConversionQ(diff) {
  const l = diff === 'easy' ? randInt(1, 10) : randInt(1, 50);
  return { type: 'fill', marks: 1, text: `Convert ${l} litres into millilitres.`, answer: `${l * 1000} ml` };
}
function measurementWordQ(diff) {
  const d1 = diff === 'easy' ? randInt(1, 5) : randInt(1, 20);
  const d2 = diff === 'easy' ? randInt(1, 5) : randInt(1, 20);
  const unit = choice(['km', 'm']);
  return { type: 'word', marks: 2, text: `A delivery van travels ${d1} ${unit} in the morning and ${d2} ${unit} in the evening. What is the total distance travelled?`, answer: `${d1 + d2} ${unit}` };
}

/* ---------- Chapter registry ---------- */
const CHAPTERS = [
  { id: 'fish-tale', name: '1. The Fish Tale (Large Numbers & Place Value)', generators: [
    { type: 'mcq', fn: placeValueQ }, { type: 'fill', fn: numberNameQ }, { type: 'fill', fn: expandedFormQ },
    { type: 'mcq', fn: compareNumbersQ }, { type: 'fill', fn: succPredQ } ] },
  { id: 'shapes-angles', name: '2. Shapes and Angles', generators: [
    { type: 'mcq', fn: angleTypeQ }, { type: 'fill', fn: triangleAngleQ }, { type: 'fill', fn: rightAngleFactQ },
    { type: 'mcq', fn: polygonSidesQ } ] },
  { id: 'how-many-squares', name: '3. How Many Squares?', generators: [
    { type: 'fill', fn: gridSquaresQ }, { type: 'fill', fn: rowsFromTotalQ }, { type: 'word', fn: tilesRectangleWordQ } ] },
  { id: 'parts-wholes', name: '4. Parts and Wholes (Fractions)', generators: [
    { type: 'fill', fn: fractionOfWholeQ }, { type: 'mcq', fn: equivalentFractionQ }, { type: 'mcq', fn: compareFractionsQ },
    { type: 'fill', fn: addSubtractLikeFractionsQ } ] },
  { id: 'look-same', name: '5. Does it Look the Same? (Symmetry)', generators: [
    { type: 'fill', fn: linesOfSymmetryQ }, { type: 'mcq', fn: letterSymmetryQ } ] },
  { id: 'factors-multiples', name: "6. Be My Multiple, I'll be Your Factor", generators: [
    { type: 'fill', fn: factorsOfQ }, { type: 'mcq', fn: primeCompositeQ }, { type: 'fill', fn: lcmQ },
    { type: 'fill', fn: hcfQ }, { type: 'mcq', fn: divisibilityQ } ] },
  { id: 'patterns', name: '7. Can You See the Pattern?', generators: [
    { type: 'fill', fn: arithSeqNextQ }, { type: 'fill', fn: missingMiddleQ }, { type: 'word', fn: shapePatternQ } ] },
  { id: 'mapping', name: '8. Mapping Your Way', generators: [
    { type: 'word', fn: mapScaleDistanceQ }, { type: 'word', fn: reverseScaleQ }, { type: 'mcq', fn: directionQ } ] },
  { id: 'boxes-sketches', name: '9. Boxes and Sketches (3D Shapes)', generators: [
    { type: 'mcq', fn: facesEdgesVerticesQ }, { type: 'mcq', fn: identifyShapeQ } ] },
  { id: 'tenths-hundredths', name: '10. Tenths and Hundredths (Decimals)', generators: [
    { type: 'fill', fn: fractionToDecimalQ }, { type: 'fill', fn: decimalToFractionQ }, { type: 'fill', fn: addSubtractDecimalsQ },
    { type: 'mcq', fn: compareDecimalsQ }, { type: 'mcq', fn: decimalPlaceValueQ } ] },
  { id: 'area-boundary', name: '11. Area and its Boundary', generators: [
    { type: 'fill', fn: rectangleAreaQ }, { type: 'fill', fn: rectanglePerimeterQ }, { type: 'fill', fn: squareAreaPerimeterQ },
    { type: 'word', fn: missingSideWordQ }, { type: 'word', fn: compositeAreaWordQ } ] },
  { id: 'smart-charts', name: '12. Smart Charts (Data Handling)', generators: [
    { type: 'word', fn: dataTableQ }, { type: 'word', fn: pictographQ } ] },
  { id: 'multiply-divide', name: '13. Ways to Multiply and Divide', generators: [
    { type: 'fill', fn: multiDigitMultiplicationQ }, { type: 'fill', fn: divisionWithRemainderQ },
    { type: 'word', fn: wordMultiplicationQ }, { type: 'word', fn: wordDivisionQ } ] },
  { id: 'big-heavy', name: '14. How Big? How Heavy? (Measurement)', generators: [
    { type: 'fill', fn: lengthConversionQ }, { type: 'fill', fn: weightConversionQ }, { type: 'fill', fn: volumeConversionQ },
    { type: 'word', fn: measurementWordQ } ] },
];
