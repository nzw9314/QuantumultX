//Script event auto linked ipv4 nextdns: network-change

$httpClient.get('https://link-ip.nextdns.io/3994b1/40bcbadb4693c2a5', function(error, response, data){
  if (error) {
$notification.post('NEXT DNS ', 'Internet error','');
    $done({});
  } else {
$notification.post('NEXT DNS ', 'IPv4 (with linked IP)', 'ip :' + data);
    $done({});
  }
});