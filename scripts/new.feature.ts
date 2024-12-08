const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const createFileFromTemplate = (templatePath, destinationPath, featureName) => {
  let templateContent = fs.readFileSync(templatePath, "utf-8");
  const capitalizedFeatureName =
    featureName.charAt(0).toUpperCase() + featureName.slice(1);
  templateContent = templateContent
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/template/g, featureName)
    .replace(/Template/g, capitalizedFeatureName)
    .replace(/TemplateModel/g, `${capitalizedFeatureName}Model`)
    .replace(/\/\/ @ts-ignore/g, "");
  fs.writeFileSync(destinationPath, templateContent);
};

const createFeatureFiles = (featureDir, featureName) => {
  const files = [
    "index.ts",
    `${featureName}.routes.ts`,
    `${featureName}.controller.ts`,
    `${featureName}.model.ts`,
  ];

  files.forEach((file) => {
    const filePath = path.join(featureDir, file);
    const templateFileName =
      file === "index.ts" ? "index.ts" : `template.${file.split(".")[1]}.ts`;
    const templatePath = path.join(
      __dirname,
      "..",
      "src",
      "template",
      templateFileName,
    );
    createFileFromTemplate(templatePath, filePath, featureName);
  });

  console.log(
    `Feature '${featureName}' created successfully with the following files:`,
  );
  files.forEach((file) => console.log(`- ${file}`));
};

rl.question("Enter the name of the feature: ", (featureName) => {
  const featureDir = path.join(__dirname, "..", "src", featureName);

  if (!fs.existsSync(featureDir)) {
    fs.mkdirSync(featureDir);
    createFeatureFiles(featureDir, featureName);
  } else {
    console.log(`Feature '${featureName}' already exists.`);
  }

  rl.close();
});
