/**
 * @param num Number to be rounded
 * @param scale
 * @returns Rounded number
 */
export default function roundNumber(num: number, scale: number): number {
  if(!("" + num).includes("e")) {
    return +(Math.round(parseFloat(num + "e+" + scale)) + "e-" + scale);
  } else {
    const arr = ("" + num).split("e");
    let sig = "";
    if(+arr[1] + scale > 0) {
      sig = "+";
    }
    return +(Math.round(parseFloat(+arr[0] + "e" + sig + (+arr[1] + scale))) + "e-" + scale);
  }
}