export function numberWithCommas(x, hasComaSpaced = false) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, hasComaSpaced ? ", " : ',');
  if (parts[1]) {
    parts[1] = parts[1].padEnd(2, '0')
  }
  return parts.join(".");
}