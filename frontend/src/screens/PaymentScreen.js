import React, { useState } from "react";
import { Button, Form, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { savePaymentMethod } from "../actions/cartActions";

import { getShippingDetails } from "../actions/productActions";

const PaymentScreen = ({ history }) => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress, cartItems } = cart;

  if (!shippingAddress) {
    history.push("/shipping");
  }

  const [paymentMethod, setPaymentMethod] = useState("PayPal");

  const dispatch = useDispatch();

  const calculateShipping = () => {
    let totalWeight = cartItems.reduce(
      (acc, item) => acc + item.weight * item.qty,
      0
    );

    let newShippingInfo = {
      cepReceiver: shippingAddress.addressPostalCode.replace(/[^\d]+/g, ""),
      weight: cartItems.reduce((acc, item) => acc + item.weight * item.qty, 0),
      width: cartItems.reduce((acc, item) => acc + item.width * item.qty, 0),
      height: cartItems.reduce((acc, item) => acc + item.height * item.qty, 0),
      length: cartItems.reduce((acc, item) => acc + item.length * item.qty, 0),
    };

    //TODO: CALCULAR O VALOR DA ENTREGA COM TODOS OS PRODUTOS!
    console.log(newShippingInfo);

    dispatch(getShippingDetails(newShippingInfo));
  };

  const submitHandler = (e) => {
    e.preventDefault();

    calculateShipping();

    dispatch(savePaymentMethod(paymentMethod));
    history.push("/placeorder");
  };

  return (
    <>
      <CheckoutSteps step1 step2 step3 />
      <FormContainer>
        <h1>Método de Pagamento</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group>
            <Form.Label as="legend">Selecione um Método</Form.Label>

            <Col>
              <Form.Check
                type="radio"
                label="PayPal ou Cartão de Crédito"
                id="paypal"
                name="paymentMethod"
                value="PayPal"
                checked
                onChange={(e) => setPaymentMethod(e.target.value)}
              ></Form.Check>
            </Col>
          </Form.Group>

          <Button type="submit" variant="primary">
            Continuar
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default PaymentScreen;
