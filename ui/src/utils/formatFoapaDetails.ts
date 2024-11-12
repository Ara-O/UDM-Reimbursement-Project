import { FoapaStuff } from "../types/types";

export function formatFoapaDeails(foapa: FoapaStuff) {
  const fund = foapa.fund || "XXXX";
  const organization = foapa.organization.slice(0, 4) || "XXXX";
  const account = foapa.account.slice(0, 4) || "XXXX";
  const program = foapa.program.slice(0, 4) || "XXXX";
  const activity = foapa.activity || "XXXX";

  return `${fund}-${organization}-${account}-${program}-${activity}`;
}
