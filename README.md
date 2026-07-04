# Class 5 Maths Worksheet Generator

A no-install, offline worksheet generator for CBSE Class 5 NCERT Math-Magic. Pick chapters, generate a random paper, print or save as PDF.

Live app: https://jainviyom.github.io/math-quiz-app/

For the full BRD, system architecture, tech stack, and complete feature/question catalog, see [docs/PROJECT_DOCUMENTATION.md](docs/PROJECT_DOCUMENTATION.md).

## How to use

1. Double-click `index.html` to open it in any browser (Chrome, Edge, Safari).
2. Tick the chapters/topics you want (or click "Select all chapters").
3. Set number of questions, difficulty, question type mix, and a paper title.
4. Click **Generate worksheet** — a fresh, randomly generated paper appears below.
5. Click **Print / Save as PDF** to print it, or choose "Save as PDF" in the print dialog.
   - The printed page automatically includes an **Answer Key** on a separate page at the end.
6. Click **Generate worksheet** again anytime for a brand-new set of questions — numbers and wording change every time.

## Chapters covered

All 14 chapters of NCERT Class 5 Math-Magic:
1. The Fish Tale (large numbers & place value)
2. Shapes and Angles
3. How Many Squares?
4. Parts and Wholes (fractions)
5. Does it Look the Same? (symmetry)
6. Be My Multiple, I'll be Your Factor
7. Can You See the Pattern?
8. Mapping Your Way
9. Boxes and Sketches (3D shapes)
10. Tenths and Hundredths (decimals)
11. Area and its Boundary
12. Smart Charts (data handling)
13. Ways to Multiply and Divide
14. How Big? How Heavy? (measurement)

## Notes

- Works fully offline — just `index.html`, `questions.js`, and `app.js`, no server or install needed.
- Each generate click produces new random numbers/wording, so no two worksheets are identical.
- To adjust question wording or add new question types, edit `questions.js` (each chapter is a list of generator functions).
