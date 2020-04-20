// figure out the ajax

//async function submit() {
//   let options = {
//      method: 'POST',
//      headers: {
//         'Content-Type': 'application/json',
//         body: JSON.stringify({
//            username: document.getElementsByName('username').value,
//            password: document.getElementsByName('password').value
//         })
//      }
//   }
//   
//   let res = await fetch(postRoute,options);
//   res = await res.json();
//
//   document.querySelector('#authmsg').innerHTML = res.authmsg;   
//}

let el = selector => document.querySelectorAll(selector);

el('form')[0].onsubmit = () => {
   el('#loader')[0].style.display = "flex";
};

el('form > input').forEach(input => {
   input.onfocus = () => {
      el('#authmsg')[0].style.display = "none";
   }
})