

$(document).ready(function() {
})

var lists = $('.up-next-list-item');

var ret = [].slice.call(lists);

ret.forEach( (r,i) => {
  console.log(i + 1, r.href);
})
