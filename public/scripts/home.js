async function submit(options) {
   await fetch('/user/notes',options);
   location.reload();
}

let submitNote = () => submit({
   method: 'POST',
   headers: {
      'Content-Type': 'application/json'
   },
   body: JSON.stringify({
      title: el('#noteadd input')[0].value,
      timestamp: new Date().toLocaleString(),
      text: el('#noteadd textarea')[0].value
   })
});

let deleteNote = bttnNum => submit({
   method: 'DELETE',
   headers: {
      'Content-Type': 'application/json'
   },
   body: JSON.stringify({
      noteNum: bttnNum
   })
});

let el = selector => document.querySelectorAll(selector);

el('#noteadd > input[type="text"]')[0].focus();

el('#noteadd > input[type="text"]')[0].onkeypress = event => {
   if (event.key == "Enter") {
      el('#noteadd > textarea')[0].focus();
   };
};