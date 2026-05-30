export default {
  // Output each docs page as /docs/pagename.html, preserving the .html
  // extension so all existing internal links continue to work unchanged.
  permalink: (data) => `/docs/${data.page.fileSlug}.html`,
};
