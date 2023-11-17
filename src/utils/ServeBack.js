// import { equalityStringIgnoreCase } from "./Utils";
// import jwt from "jsonwebtoken";
// import { EXPIRES_TIME, SECRETKEY } from "./SystemConfiguration";
// import { utils } from "ethers";

// const login = async (requestData) => {
//   let result;
//   let result_verify = await verifyLoginSignature(requestData);
//   if (!result_verify) {
//     result = { code: -444, message: "Invalid signature" };
//   } else {
//     let userToken = generateToken(requestData);

//     let data = { userToken: userToken };
//     result = { code: 200, data: data };

//     return JSON.stringify(result);
//   }
// };

// const verifyLoginSignature = async (paras) => {
//   const types = {
//     VerifyClaim: [
//       { name: "userAddress", type: "address" },
//       { name: "randNo", type: "uint256" },
//       { name: "amount", type: "uint256" },
//     ],
//   };

//   const recoveredAddress = utils.verifyTypedData(
//     paras.domainData,
//     types,
//     paras.message,
//     paras.signature
//   );

//   if (equalityStringIgnoreCase(recoveredAddress, paras.message.userAddress)) {
//     return true;
//   }
//   return false;
// };

// const generateToken = (requestData) => {
//   // 生成 Token

//   const token = jwt.sign(requestData, SECRETKEY, { expiresIn: EXPIRES_TIME });
//   return token;
// };
// export { login };
