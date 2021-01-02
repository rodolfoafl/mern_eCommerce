import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { saveShippingAddress } from "../actions/cartActions";

const ShippingScreen = ({ history }) => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress.address);
  const [city, setCity] = useState(shippingAddress.city);
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
  const [country, setCountry] = useState(shippingAddress.country);

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    history.push("/payment");
  };

  return (
    <>
      <CheckoutSteps step1 step2 />
      <FormContainer>
        <h1>Entrega</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="address">
            <Form.Label>Endereço</Form.Label>
            <Form.Control
              type="text"
              placeholder="Informe um endereço"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              autoComplete="off"
              required
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="city">
            <Form.Label>Cidade</Form.Label>
            <Form.Control
              type="text"
              placeholder="Informe uma cidade"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              autoComplete="off"
              required
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="postalCode">
            <Form.Label>Código Postal</Form.Label>
            <Form.Control
              type="text"
              placeholder="Informe um código postal"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              autoComplete="off"
              required
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="country">
            <Form.Label>País</Form.Label>
            <Form.Control
              type="text"
              placeholder="Informe um país"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              autoComplete="off"
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
