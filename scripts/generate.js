import fs from "fs/promises";
import path from "path";
import yaml from "js-yaml";
import ejs from "ejs";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

function escapeLatex(str = "") {
  return str.replace(/([%&$#_{}\\])/g, "\\$1");
}

async function renderCV(
  yamlPath,
  templateDir,
  texFile,
  outputDir,
  pdfOutputPath
) {
  const data = yaml.load(await fs.readFile(yamlPath, "utf8"));

  // Make sure output directory exists
  await fs.mkdir(outputDir, { recursive: true });

  // Copy all files from templateDir to outputDir, rendering only .tex
  const templateFiles = await fs.readdir(templateDir);
  for (const file of templateFiles) {
    const srcPath = path.join(templateDir, file);
    const destPath = path.join(outputDir, file);

    if (file.endsWith(".tex")) {
      const templateContent = await fs.readFile(srcPath, "utf8");
      const rendered = ejs.render(
        templateContent,
        { ...data, e: escapeLatex }, // Spread data at top level for direct access
        { filename: srcPath }
      );
      await fs.writeFile(destPath, rendered, "utf8");
    } else {
      await fs.copyFile(srcPath, destPath); // Copy images, .cls, etc.
    }
  }

  const texFileName = path.basename(texFile);
  const { stdout, stderr } = await execAsync(
    `xelatex -halt-on-error ${texFileName}`,
    { cwd: outputDir }
  );

  console.log(stdout);
  if (stderr) console.error(stderr);

  // Move the generated PDF if pdfOutputPath is provided
  if (pdfOutputPath) {
    const generatedPdf = path.join(
      outputDir,
      texFileName.replace(/\.tex$/, ".pdf")
    );
    if (generatedPdf !== pdfOutputPath) {
      await fs.rename(generatedPdf, pdfOutputPath);
      console.log(`PDF moved to: ${pdfOutputPath}`);
    }
  }
}

// CLI
if (process.argv.length !== 6 && process.argv.length !== 7) {
  console.error(
    `Usage: node generate.js <data.yml> <template_dir> <template_file.tex> <output_dir> [output.pdf]`
  );
  process.exit(1);
}

const [_, __, yamlPath, templateDir, texFile, outputDir, pdfOutputPath] =
  process.argv;
renderCV(yamlPath, templateDir, texFile, outputDir, pdfOutputPath).catch(
  (err) => {
    console.error("Error during CV generation:", err);
    process.exit(1);
  }
);
