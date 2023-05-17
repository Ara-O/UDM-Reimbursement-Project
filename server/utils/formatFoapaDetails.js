export default function formatFoapaDetails(foapas) {
  let foapaDetails = [];
  foapas.forEach((userFoapa) => {
    let concatFoapa =
      userFoapa.fNumber +
      "-" +
      userFoapa.oNumber +
      "-" +
      userFoapa.aNumber +
      "-" +
      userFoapa.pNumber +
      "-" +
      userFoapa.a2Number;

    foapaDetails.push({
      foapaName: userFoapa.foapaName,
      foapaNumber: concatFoapa,
    });
  });

  return foapaDetails;
}
