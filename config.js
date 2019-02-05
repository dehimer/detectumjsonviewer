const config = {
  port: 3000,
  searchUrl: 'http://front.dev.detectum.com:8181/technopark/search_plain'
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = config;
}
