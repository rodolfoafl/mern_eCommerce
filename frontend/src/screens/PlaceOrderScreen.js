import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Row,
  Col,
  ListGroup,
  Image,
  Card,
  Form,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CheckoutSteps from "../components/CheckoutSteps";
import Message from "../components/Message";
import { createOrder } from "../actions/orderActions";
import { resetCart } from "../actions/cartActions";

import currencyFormatter from "../utils/currencyFormatter";
import { useState } from "react";
import Loader from "../components/Loader";

const PlaceOrderScreen = ({ history }) => {
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress, paymentMethod, cartItems } = cart;

  const productShippingDetails = useSelector(
    (state) => state.productShippingDetails
  );
  const { shippingDetails, loading: loadingShipping } = productShippingDetails;

  const addDecimals = (number) => {
    return (Math.round(number * 100) / 100).toFixed(2);
  };

  let itemsPrice = addDecimals(
    cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  const [selectedShippingMethod, setSelectedShippingMethod] = useState("");
  const [shippingPrice, setShippingPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // let taxPrice = addDecimals(Number((0.15 * itemsPrice).toFixed(2)));

  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, success, error } = orderCreate;

  useEffect(() => {
    if (success) {
      dispatch(resetCart());
      history.push(`/order/${order._id}`);
    }

    setTotalPrice((Number(itemsPrice) + Number(shippingPrice)).toFixed(2));
  }, [dispatch, history, success, order, shippingPrice, itemsPrice]);

  const placeOrderHandler = () => {
    console.log("placeOrderHandler");

    let shippingInformation = {
      price: shippingPrice,
      method: selectedShippingMethod,
    };

    dispatch(
      createOrder({
        orderItems: cartItems,
        shippingAddress: shippingAddress,
        paymentMethod: paymentMethod,
        itemsPrice: itemsPrice,
        shippingInformation: shippingInformation,
        totalPrice: totalPrice,
      })
    );
  };

  const toggleChange = (key, value) => {
    let newValue = value.replace(/,/g, ".");
    console.log(newValue);
    console.log(key);

    setSelectedShippingMethod(key);

    setShippingPrice(newValue);
  };

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Entrega</h2>
              <p>
                <strong>Endereço: </strong>
                {shippingAddress.addressStreet}, {shippingAddress.addressNumber}
                {shippingAddress.addressComplement &&
                  `, ${shippingAddress.addressComplement}`}{" "}
                - {shippingAddress.addressDistrict} -{" "}
                {shippingAddress.addressCity}, {shippingAddress.addressState} -{" "}
                {shippingAddress.addressPostalCode} -{" "}
                {shippingAddress.addressCountry}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Método de Pagamento</h2>
              <strong>Método: </strong>
              {paymentMethod}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Método de Entrega</h2>
              <ListGroup variant="flush">
                {loadingShipping ? (
                  <Loader />
                ) : (
                  shippingDetails !== null &&
                  shippingDetails !== undefined &&
                  Object.entries(shippingDetails).map(([key, values]) => (
                    <ListGroup.Item key={key}>
                      <Row>
                        <Col md={1}>
                          <Form.Group controlId="shippingCheckbox">
                            <Form.Check
                              type="radio"
                              name="select"
                              value={key}
                              onChange={() =>
                                toggleChange(key, Object.values(values)[0])
                              }
                            />
                          </Form.Group>
                        </Col>
                        <Col>{key.toUpperCase()}</Col>
                        <Col md={4}>{`R$ ${Object.values(values)[0]} - ${
                          Object.values(values)[1]
                        } dias úteis`}</Col>
                      </Row>
                    </ListGroup.Item>
                  ))
                )}
              </ListGroup>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Itens do Pedido</h2>
              {cartItems.length === 0 ? (
                <Message>Seu carrinho está vazio!</Message>
              ) : (
                <ListGroup variant="flush">
                  {cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          ></Image>
                        </Col>

                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>

                        <Col md={4}>
                          {item.qty} x {item.price} ={" "}
                          {currencyFormatter(item.qty * item.price)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Resumo do Pedido</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Itens</Col>
                  <Col>{currencyFormatter(itemsPrice)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Entrega</Col>
                  <Col>{currencyFormatter(shippingPrice)}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>{currencyFormatter(totalPrice)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                {error && <Message variant="danger">{error}</Message>}
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type="button"
                  className="btn-block"
                  disabled={cartItems === 0}
                  onClick={placeOrderHandler}
                >
                  Concluir Pedido
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;

/*
             shippingDetails.pac !== undefined && (
                      <ListGroup.Item>
                        <Row>
                          <Col md={1}>
                            <Form.Group controlId="shippingCheckbox">
                              <Form.Check
                                type="radio"
                                name="select"
                                value={"pac"}
                                onChange={toggleChange}
                              />
                            </Form.Group>
                          </Col>
                          <Col>PAC</Col>
                          <Col
                            md={4}
                          >{`R$ ${shippingDetails.pac.finalValue} - ${shippingDetails.pac.deliveryTime} dias úteis`}</Col>
                        </Row>
                      </ListGroup.Item>
                    )

*/
