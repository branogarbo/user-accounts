let el = selector => document.querySelectorAll(selector);

el('form')[0].onsubmit = () => {
   el('#loader')[0].style.display = "flex";
   el('form > input[type="submit"]')[0].setAttribute('disabled',true);
};

el('form > input').forEach(input => {
   input.onfocus = () => {
      el('#authmsg')[0].style.display = "none";
   };
});