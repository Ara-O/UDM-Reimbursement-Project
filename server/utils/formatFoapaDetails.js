export function formatFoapaDetails(foapa) {
  return `${foapa.fund}-${foapa.organization || "XXXX"}-${
    foapa.account.slice(0, 4) || "XXXX"
  }-${foapa.program || "XXXX"}-${foapa.activity || "XXXX"}`;
}
