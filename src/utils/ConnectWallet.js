import { getSignerAndChainId } from "./GetProvider.js";
import { signEIP712Message } from "./SignFunc.js";
import { getUserToken } from "../api/GetData.js";
const login = async () => {
  try {
    let params = await signEIP712Message();
    if (params == null) return [null, null];

    let res = await getUserToken(params);
    if (res.code == -444) {
      alert(res.message);
      return [null, null];
    }

    localStorage.setItem("token", res.data.userToken);
    return [params.signature, params.message.userAddress];
  } catch (error) {
    console.log(error);

    return [null, null];
  }
};
export { login };
