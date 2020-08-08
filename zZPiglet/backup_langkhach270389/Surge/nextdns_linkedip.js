//Script event auto linked ipv4 nextdns: network-change

async function launch() {
    await linkedip();
}
launch()
function linkedip(){ 
$httpClient.post('https://link-ip.nextdns.io/3994b1/40bcbadb4693c2a5', function(error, response, data){
  if (error) {
console.log('‼️');
  } else {
console.log('🟢 '+ data);
  }
  $done();
});
}