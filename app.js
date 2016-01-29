import Rx from 'rx';
import $ from 'jquery';


const refreshClick$ = Rx.Observable.fromEvent($('.refresh'), 'click');


const request$ = refreshClick$
  .startWith('startup click')
  .map(() => {
    const randomOffset = Math.floor(Math.random() * 500);
    return 'https://api.github.com/users?since=' + randomOffset;
  });
const response$ = request$
  .flatMap((requestUrl) => Rx.Observable.fromPromise($.getJSON(requestUrl)));

Array(3).fill().forEach((_,i) => {
  console.log(i)

  const closeClick$ = Rx.Observable.fromEvent($('.close' + i), 'click');
  var suggestion$ = closeClick$
    .startWith('startup click')
    .combineLatest(response$, (click, listUsers) =>
                   listUsers[Math.floor(Math.random()*listUsers.length)])
    .merge(refreshClick$.map(() => null))
    .startWith(null);
  suggestion$.subscribe((suggestion) => {
    const suggestionEl = document.querySelector('.suggestion' + i);
    if (suggestion === null) {
      suggestionEl.style.visibility = 'hidden';
    } else {
      suggestionEl.style.visibility = 'visible';
      const username = suggestionEl.querySelector('.username');
      username.href = suggestion.html_url;
      username.textContent = suggestion.login;
      const img = suggestionEl.querySelector('img');
      img.src = "";
      img.src = suggestion.avatar_url;
    }
  })
})
