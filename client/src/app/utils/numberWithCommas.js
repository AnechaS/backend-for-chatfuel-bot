export default function numberWithCommas(number = 0) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
