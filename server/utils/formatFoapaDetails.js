export default function formatFoapaDetails(foapas) {
  console.log(foapas);
  let foapaDetails = [];
  foapas.forEach((userFoapa) => {
    let concatFoapa =
      userFoapa.fNumber +
      "-" +
      userFoapa.oNumber +
      "-" +
      userFoapa.aNumber +
      "-" +
      userFoapa.pNumber;

    if (concatFoapa.a2Number) {
      concatFoapa = concatFoapa + "-" + userFoapa.a2Number;
    }

    foapaDetails.push({
      foapaName: userFoapa.foapaName,
      foapaNumber: concatFoapa,
      initialAmount: userFoapa.initialAmount,
      currentAmount: userFoapa.initialAmount,
      description: userFoapa.description,
    });
  });

  return foapaDetails;
}
