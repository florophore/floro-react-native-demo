const { Project, SyntaxKind } = require("ts-morph");
const path = require('path');
const fs = require('fs');

/**
 * Make sure this points to your root front-end tsconfig
 */
const tsConfigFilePath =  path.join(__dirname, "../../../tsconfig.json");
const project = new Project({
    tsConfigFilePath
  });

project.resolveSourceFileDependencies();
const languageService = project.getLanguageService();

const phraseKeys = new Set();
const localesHooksPath =  path.join(__dirname, "../../hooks/text.tsx");
const localesHooks = project.getSourceFile(localesHooksPath);

const useRichTextNode = localesHooks.getVariableDeclaration('useRichText');
const useRichTextSourceRefs = languageService.findReferences(useRichTextNode.getNameNode());
for (const sourceRef of useRichTextSourceRefs) {
  const refs = sourceRef.getReferences();
  for (const ref of refs) {
    const callee = ref.getNode().getParentIfKind(SyntaxKind.CallExpression);
    if (callee) {
      const args = callee.getArguments();
      const keyArg = args[0].getText();
      phraseKeys.add(unescapePhraseKey(keyArg));
    }
  }
}

const usePlainTextNode = localesHooks.getVariableDeclaration('usePlainText');
const usePlainTextSourceRefs = languageService.findReferences(usePlainTextNode.getNameNode());
for (const sourceRef of usePlainTextSourceRefs) {
  const refs = sourceRef.getReferences();
  for (const ref of refs) {
    const callee = ref.getNode().getParentIfKind(SyntaxKind.CallExpression);
    if (callee) {
      const args = callee.getArguments();
      const keyArg = args[0].getText();
      phraseKeys.add(unescapePhraseKey(keyArg));
    }
  }
}

const localesStatic = JSON.stringify(Array.from(phraseKeys), null, 2);
fs.writeFileSync(
  path.join(__dirname, "../../floro_modules/text-generator/locales.static.json"),
  localesStatic,
  "utf-8"
);

function unescapePhraseKey(token) {
  return token.substring(1, token.length - 1);
}