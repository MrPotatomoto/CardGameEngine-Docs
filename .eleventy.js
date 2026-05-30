export default function (eleventyConfig) {
  // Copy assets/ from project root → _site/assets/
  eleventyConfig.addPassthroughCopy({ "assets": "assets" });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
    },
    // Keep .html files as plain HTML — don't process them as a template
    // language. This prevents Nunjucks from tripping over {{ }} in code
    // blocks. The .njk layout files are still processed as Nunjucks.
    htmlTemplateEngine: false,
    markdownTemplateEngine: "njk",
  };
}
