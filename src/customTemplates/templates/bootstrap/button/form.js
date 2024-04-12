const form = (ctx) => {
  // How to know what's inside the ctx object?
  // My first idea was too look at the existing components:
  // https://github.com/formio/formio.js/blob/master/src/templates/bootstrap/button/form.ejs
  // But I wonder, if there is any documentation per component?
  return `
    <button is="test-ios" class="vl-button">hello world</button>
  `;
};

export default form;
