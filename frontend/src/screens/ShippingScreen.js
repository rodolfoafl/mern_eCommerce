import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { saveShippingAddress } from "../actions/cartActions";

import axios from "axios";

const ShippingScreen = ({ history }) => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [addressStreet, setAddressStreet] = useState(
    shippingAddress.addressStreet
  );
  const [addressNumber, setAddressNumber] = useState(
    shippingAddress.addressNumber
  );
  const [addressComplement, setAddressComplement] = useState(
    shippingAddress.addressComplement
  );
  const [addressDistrict, setAddressDistrict] = useState(
    shippingAddress.addressDistrict
  );
  const [addressCity, setAddressCity] = useState(shippingAddress.addressCity);
  const [addressState, setAddressState] = useState(
    shippingAddress.addressState
  );
  const [addressCountry, setAddressCountry] = useState(
    shippingAddress.addressCountry
  );
  const [addressPostalCode, setAddressPostalCode] = useState(
    shippingAddress.addressPostalCode
  );

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      saveShippingAddress({
        addressStreet,
        addressNumber,
        addressComplement,
        addressDistrict,
        addressCity,
        addressState,
        addressCountry,
        addressPostalCode,
      })
    );

    history.push("/payment");
  };

  const maskCep = (e) => {
    let value = e.target.value;
    value = value.replace(/\D/g, "");
    value = value.replace(/^(\d{2})(\d)/, "$1.$2");
    value = value.replace(/\.(\d{3})(\d)/, ".$1-$2");
    e.target.value = value;
    // return value;
    setAddressPostalCode(value);
  };

  const getCEPInfo = async (e) => {
    const zipCode = e.target.value;
    // console.log(zipCode);
    if (zipCode.length < 10) {
      return alert("CEP inválido!");
    }

    try {
      let zipCode_2 = zipCode.replace(/[^\d]+/g, "");

      var instance = axios.create();
      if (instance.defaults.headers.common["x-auth-token"]) {
        delete instance.defaults.headers.common["x-auth-token"];
      }
      const res = await instance.get(
        `https://viacep.com.br/ws/${zipCode_2}/json/`
      );
      // console.log(res.data);

      if (res.data.erro) {
        return alert("CEP não encontrado!");
      }

      setAddressStreet(res.data.logradouro);
      setAddressDistrict(res.data.bairro);
      setAddressCity(res.data.localidade);
      setAddressState(res.data.uf);
      setAddressCountry("Brasil");
      // fields[index].addressDistrict = res.data.bairro;
      // fields[index].addressCity = res.data.localidade;
      // fields[index].addressState = res.data.uf;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <CheckoutSteps step1 step2 />
      <FormContainer>
        <h1>Entrega</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="addressPostalCode">
            <Form.Label>CEP</Form.Label>
            <Form.Control
              type="text"
              placeholder="Informe um CEP"
              value={addressPostalCode}
              autoComplete="off"
              maxLength="10"
              name="postalCode"
              required
              onChange={(e) => maskCep(e)}
              onBlur={(e) => getCEPInfo(e)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="addressStreet">
            <Form.Label>Endereço</Form.Label>
            <Form.Control
              type="text"
              placeholder="Informe um endereço"
              value={addressStreet}
              // onChange={(e) => setAddress(e.target.value)}
              autoComplete="off"
              disabled
              required
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="addressNumber">
            <Form.Label>Número</Form.Label>
            <Form.Control
              type="text"
              placeholder="Informe um número"
              // value={addressNumber}
              onBlur={(e) => setAddressNumber(e.target.value)}
              autoComplete="off"
              required
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="addressComplement">
            <Form.Label>Complemento</Form.Label>
            <Form.Control
              type="text"
              placeholder="Informe um complemento"
              // value={addressNumber}
              onBlur={(e) => setAddressComplement(e.target.value)}
              autoComplete="off"
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="addressDistrict">
            <Form.Label>Bairro</Form.Label>
            <Form.Control
              type="text"
              placeholder="Informe um bairro"
              value={addressDistrict}
              // onChange={(e) => setCity(e.target.value)}
              autoComplete="off"
              disabled
              required
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="addressCity">
            <Form.Label>Cidade</Form.Label>
            <Form.Control
              type="text"
              placeholder="Informe uma cidade"
              value={addressCity}
              // onChange={(e) => setCity(e.target.value)}
              autoComplete="off"
              disabled
              required
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="addressState">
            <Form.Label>Estado</Form.Label>
            <Form.Control
              type="text"
              placeholder="Informe um estado"
              value={addressState}
              // onChange={(e) => setCity(e.target.value)}
              autoComplete="off"
              disabled
              required
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="addressCountry">
            <Form.Label>País</Form.Label>
            <Form.Control
              type="text"
              placeholder="Informe um país"
              value={addressCountry}
              // onChange={(e) => setCountry(e.target.value)}
              autoComplete="off"
              disabled
              required
            ></Form.Control>
          </Form.Group>

          <Button type="submit" variant="primary">
            Continuar
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default ShippingScreen;
