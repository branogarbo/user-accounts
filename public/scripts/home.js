async function submit() {
   let newNote = {
      title: el('#noteadd input')[0].value,
      timestamp: new Date().toLocaleString(),
      text: el('#noteadd textarea')[0].value
   };

   let options = {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json'
      },
      body: JSON.stringify(newNote)
   };

   await fetch('/user/notes',options)
   location.reload();
}

let el = selector => document.querySelectorAll(selector);

el('#noteadd > input[type="text"]')[0].focus();

el('#noteadd > input[type="text"]')[0].onkeypress = event => {
   if (event.key == "Enter") {
      el('#noteadd > textarea')[0].focus();
   };
};