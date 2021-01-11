import asyncHandler from "express-async-handler";

import axios from "axios";

import { parseString } from "xml2js";

//@description Get shipping information
//@route POST /api/shipping
//@access Public
const getShippingDetails = asyncHandler(async (req, res) => {
  let nCdEmpresa = "";
  let sDsSenha = "";
  let cepSender = "81630170"; //TODO: INFORMAR O CEP DO REMETENTE
  let cdnFormat = 1;
  let sCdMaoProria = "n";
  let declaredValue = "0";
  let sCdAvisoRecebimento = "n";
  //   04014 SEDEX à vista // 04510 PAC à vista // 04782 SEDEX 12
  let pacCode = "04510";
  let sedexCode = "04014";
  let sedexDozeCode = "04782";
  let diameter = "0";
  let returnType = "xml";

  let { cepReceiver, weight, width, height, length } = req.body;

  try {
    let info = { pac: {}, sedex: {}, sedexDoze: {} };

    //INFO PAC
    let response = await axios.get(
      `http://ws.correios.com.br/calculador/CalcPrecoPrazo.aspx?nCdEmpresa=${nCdEmpresa}&sDsSenha=${sDsSenha}&sCepOrigem=${cepSender}&sCepDestino=${cepReceiver}&nVlPeso=${weight}&nVlLargura=${width}&nVlAltura=${height}&nCdFormato=${cdnFormat}&nVlComprimento=${length}&sCdMaoProria=${sCdMaoProria}&nVlValorDeclarado=${declaredValue}&sCdAvisoRecebimento=${sCdAvisoRecebimento}&nCdServico=${pacCode}&nVlDiametro=${diameter}&StrRetorno=${returnType}`
    );

    parseString(response.data, function (err, result) {
      let desiredResult = result.Servicos.cServico[0];
      console.log(desiredResult);

      info.pac.finalValue = desiredResult.Valor[0];

      info.pac.deliveryTime = desiredResult.PrazoEntrega[0];
    });

    //INFO SEDEX
    response = await axios.get(
      `http://ws.correios.com.br/calculador/CalcPrecoPrazo.aspx?nCdEmpresa=${nCdEmpresa}&sDsSenha=${sDsSenha}&sCepOrigem=${cepSender}&sCepDestino=${cepReceiver}&nVlPeso=${weight}&nVlLargura=${width}&nVlAltura=${height}&nCdFormato=${cdnFormat}&nVlComprimento=${length}&sCdMaoProria=${sCdMaoProria}&nVlValorDeclarado=${declaredValue}&sCdAvisoRecebimento=${sCdAvisoRecebimento}&nCdServico=${sedexCode}&nVlDiametro=${diameter}&StrRetorno=${returnType}`
    );

    parseString(response.data, function (err, result) {
      let desiredResult = result.Servicos.cServico[0];

      info.sedex.finalValue = desiredResult.Valor[0];
      info.sedex.deliveryTime = desiredResult.PrazoEntrega[0];
    });

    //INFO SEDEX 12
    response = await axios.get(
      `http://ws.correios.com.br/calculador/CalcPrecoPrazo.aspx?nCdEmpresa=${nCdEmpresa}&sDsSenha=${sDsSenha}&sCepOrigem=${cepSender}&sCepDestino=${cepReceiver}&nVlPeso=${weight}&nVlLargura=${width}&nVlAltura=${height}&nCdFormato=${cdnFormat}&nVlComprimento=${length}&sCdMaoProria=${sCdMaoProria}&nVlValorDeclarado=${declaredValue}&sCdAvisoRecebimento=${sCdAvisoRecebimento}&nCdServico=${sedexDozeCode}&nVlDiametro=${diameter}&StrRetorno=${returnType}`
    );

    parseString(response.data, function (err, result) {
      let desiredResult = result.Servicos.cServico[0];

      info.sedexDoze.finalValue = desiredResult.Valor[0];
      info.sedexDoze.deliveryTime = desiredResult.PrazoEntrega[0];
    });

    // console.log(info);
    return res.json(info);
  } catch (error) {
    res.status(401);
    throw new Error(error);
  }
});

export { getShippingDetails };
