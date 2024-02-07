const paletteGenerator = require("@floro/palette-generator");
const themesGenerator = require("@floro/themes-generator");
const iconGenerator = require("@floro/icon-generator");
const textGenerator = require("@floro/text-generator")

module.exports = function () {
  return {
    repository: "@floro/rn-demo",
    generators: [
      {
        generator: iconGenerator,
        args: {
          lang: "typescript",
        },
      },
      {
        generator: themesGenerator,
        args: {
          lang: "typescript",
        },
      },
      {
        generator: paletteGenerator,
        args: {
          lang: "typescript",
        },
      },
      {
        generator: textGenerator,
        args: {
          lang: "typescript",
        },
      },
    ],
  };
};