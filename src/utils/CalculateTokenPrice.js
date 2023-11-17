const { ethers, BigNumber } = require("ethers");

function main() {
  let x0 = BigNumber.from("40838764680979833756826");
  let y0 = BigNumber.from("8753640031136548150776930");
  let k = x0.mul(y0);
  let fee = 25;
  let gtx = BigNumber.from("10000")
    .mul(10000 - 0)
    .div(10000);
  let gty = y0.sub(k.div(x0.add(gtx)));
  console.log(gty.toString());
}
main();
