import BigNumber from "bignumber.js";
import { useSelector } from "react-redux";
import { state } from "./types";

export const useBalance = (): BigNumber | undefined =>
  useSelector((State: state) => State.token.balance);