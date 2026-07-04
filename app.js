const chapterGrid = document.getElementById('chapterGrid');
const selectAllBtn = document.getElementById('selectAllBtn');
const generateBtn = document.getElementById('generateBtn');
const printBtn = document.getElementById('printBtn');
const worksheetEl = document.getElementById('worksheet');
const questionListOut = document.getElementById('questionListOut');
const answerListOut = document.getElementById('answerListOut');
const sheetTitleOut = document.getElementById('sheetTitleOut');
const sheetMetaOut = document.getElementById('sheetMetaOut');

CHAPTERS.forEach(ch => {
  const label = document.createElement('label');
  label.className = 'chapter-item';
  label.innerHTML = `<input type="checkbox" value="${ch.id}"> <span>${ch.name}</span>`;
  chapterGrid.appendChild(label);
});

let allSelected = false;
selectAllBtn.addEventListener('click', () => {
  allSelected = !allSelected;
  chapterGrid.querySelectorAll('input[type=checkbox]').forEach(cb => { cb.checked = allSelected; });
  selectAllBtn.textContent = allSelected ? 'Unselect all chapters' : 'Select all chapters';
});

function getSelectedChapters() {
  const ids = Array.from(chapterGrid.querySelectorAll('input[type=checkbox]:checked')).map(cb => cb.value);
  return CHAPTERS.filter(ch => ids.includes(ch.id));
}

function buildChapterSequence(chapters, total) {
  const seq = [];
  let pool = shuffle(chapters);
  let i = 0;
  while (seq.length < total) {
    if (i > 0 && i % pool.length === 0) pool = shuffle(chapters);
    seq.push(pool[i % pool.length]);
    i++;
  }
  return shuffle(seq);
}

function pickGenerator(chapter, typeMix) {
  let pool = chapter.generators;
  if (typeMix !== 'mixed') {
    const filtered = pool.filter(g => g.type === typeMix);
    if (filtered.length) pool = filtered;
  }
  return choice(pool);
}

function letterFor(i) { return String.fromCharCode(97 + i); }

function renderQuestion(q, index, chapterName) {
  const li = document.createElement('li');
  const tag = document.createElement('div');
  tag.className = 'chapter-tag';
  tag.textContent = chapterName;
  li.appendChild(tag);

  const textDiv = document.createElement('div');
  textDiv.innerHTML = `${q.text} <span class="q-marks">[${q.marks} mark${q.marks > 1 ? 's' : ''}]</span>`;
  li.appendChild(textDiv);

  if (q.type === 'mcq') {
    const ul = document.createElement('ul');
    ul.className = 'q-options';
    q.options.forEach((opt, i) => {
      const optLi = document.createElement('li');
      optLi.setAttribute('data-letter', letterFor(i));
      optLi.textContent = opt;
      ul.appendChild(optLi);
    });
    li.appendChild(ul);
  } else {
    const space = document.createElement('div');
    space.style.marginTop = '8px';
    space.style.borderBottom = '1px solid #9ca3af';
    space.style.height = q.type === 'word' ? '32px' : '20px';
    li.appendChild(space);
  }
  return li;
}

generateBtn.addEventListener('click', () => {
  const selectedChapters = getSelectedChapters();
  if (selectedChapters.length === 0) {
    alert('Please select at least one chapter.');
    return;
  }
  let total = parseInt(document.getElementById('numQuestions').value, 10);
  if (isNaN(total)) total = 12;
  total = Math.max(4, Math.min(40, total));
  document.getElementById('numQuestions').value = total;

  const difficultySetting = document.getElementById('difficulty').value;
  const typeMix = document.getElementById('qTypeMix').value;
  const paperTitle = document.getElementById('paperTitle').value || 'Mathematics Practice Worksheet';

  const chapterSeq = buildChapterSequence(selectedChapters, total);
  questionListOut.innerHTML = '';
  answerListOut.innerHTML = '';

  let totalMarks = 0;
  chapterSeq.forEach((chapter, idx) => {
    const gen = pickGenerator(chapter, typeMix);
    const diffForQ = difficultySetting === 'mixed' ? choice(['easy', 'medium', 'hard']) : difficultySetting;
    const q = gen.fn(diffForQ);
    totalMarks += q.marks;
    questionListOut.appendChild(renderQuestion(q, idx, chapter.name));

    const ansLi = document.createElement('li');
    ansLi.textContent = `${q.answer}`;
    answerListOut.appendChild(ansLi);
  });

  sheetTitleOut.textContent = paperTitle;
  const chapterNames = selectedChapters.length === CHAPTERS.length ? 'All chapters' : selectedChapters.map(c => c.name.replace(/^\d+\.\s*/, '')).join(', ');
  sheetMetaOut.innerHTML = `CBSE Class 5 &middot; NCERT Math-Magic &middot; ${total} questions &middot; Total marks: ${totalMarks}<br>Topics: ${chapterNames}`;

  worksheetEl.classList.add('visible');
  worksheetEl.scrollIntoView({ behavior: 'smooth' });
});

printBtn.addEventListener('click', () => {
  if (!worksheetEl.classList.contains('visible')) {
    alert('Please generate a worksheet first.');
    return;
  }
  window.print();
});
