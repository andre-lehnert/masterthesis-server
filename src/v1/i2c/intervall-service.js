var i =0;
console.log(i);
var interval = setInterval(function(){
i++;
console.log(i);
}, 1000);

setTimeout(function() {
clearInterval(interval);
console.log('interval cleared');
},5000);
