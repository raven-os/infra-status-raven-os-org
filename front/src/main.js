const Http = new XMLHttpRequest();
const url = 'https://raven-os.org/';
Http.open("GET", url);
Http.send();
Http.onreadystatechange = (e) => {
  console.log(Http.responseText)
}