# CV Generator

This project is a personal CV generator that uses LaTeX templates (with EJS logic) to produce professional PDF resumes from YAML data files. It is designed for easy maintenance and supports multiple languages and formats.

## Features

- Write your CV data in YAML files for easy editing and multilanguage support.
- Use customizable LaTeX templates (with EJS) for styling, layout, and dynamic content.
- Supports both English and Spanish CVs out of the box.
- Professional formatting, dynamic section rendering, and fine-grained typographic control.
- Automatically compiles your CV to PDF.

## Project Structure

- `data/` — YAML files with your CV data (e.g., `cv-en.yml`, `cv-es.yml`).
- `templates/render-cv/` — Main EJS+LaTeX templates (e.g., `template.tex`).
- `scripts/` — Node.js scripts for generating and rendering the CV.
- `build/` — Output directory for generated `.tex` and `.pdf` files (ignored by git).

## Requirements

- Node.js (for running the generation script)
- [TeX Live](https://www.tug.org/texlive/) (for compiling LaTeX to PDF)

To install TeX Live on Ubuntu, you can use the provided script:

```bash
bash scripts/install-latex.sh
```

## Installation

Install Node.js dependencies:

```bash
npm install
```

## Usage

To generate a CV PDF, run:

```bash
node scripts/generate.js <path/to/data.yml> <path/to/template/dir> <path/to/template.tex> <path/to/output/dir> [path/to/output.pdf]
```

- The last argument `[path/to/output.pdf]` is optional. If provided, the generated PDF will be moved/renamed to that path after compilation.

For example, to generate the English CV with the modern EJS+LaTeX template:

```bash
node ./scripts/generate.js ./data/cv-en.yml ./templates/render-cv/ ./templates/render-cv/template.tex ./build/render-cv-en
```

Or, to generate and copy/rename the PDF to a custom location:

```bash
node ./scripts/generate.js ./data/cv-en.yml ./templates/render-cv/ ./templates/render-cv/template.tex ./build/render-cv-en ./my-cv.pdf
```

---

Feel free to customize the templates and data files to suit your needs! See the `data/` and `templates/` folders for examples and structure!
