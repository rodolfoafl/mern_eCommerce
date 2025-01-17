import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import Rating from "../components/Rating";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Meta from "../components/Meta";

import {
  getProductDetails,
  createProductReview,
  getShippingDetails,
} from "../actions/productActions";
import {
  PRODUCT_CREATE_REVIEW_RESET,
  PRODUCT_SHIPPING_DETAILS_RESET,
} from "../constants/productConstants";

import currencyFormatter from "../utils/currencyFormatter";

import Moment from "react-moment";

const ProductScreen = ({ match, history }) => {
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const productShippingDetails = useSelector(
    (state) => state.productShippingDetails
  );
  const {
    loading: shippingLoading,
    error: shippingError,
    shippingDetails,
  } = productShippingDetails;

  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const {
    error: errorProductReview,
    success: successProductReview,
  } = productReviewCreate;

  const [postalCode, setPostalCode] = useState("");

  useEffect(() => {
    dispatch({ type: PRODUCT_SHIPPING_DETAILS_RESET });

    if (successProductReview) {
      alert("Avaliação enviada!");
      setRating(0);
      setComment("");
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
    }

    dispatch(getProductDetails(match.params.id));
  }, [dispatch, match, successProductReview]);

  const addToCartHandler = () => {
    history.push(`/cart/${match.params.id}?qty=${qty}`);
  };

  const calculateShipping = (e) => {
    e.preventDefault();

    if (postalCode.length < 10) {
      return alert("Informe um CEP válido!");
    }

    let newShipping = {
      cepReceiver: postalCode.replace(/[^\d]+/g, ""),
      weight: product.weight,
      width: product.width,
      height: product.height,
      length: product.length,
    };
    dispatch(getShippingDetails(newShipping));
  };

  const maskCep = (e) => {
    let value = e.target.value;
    value = value.replace(/\D/g, "");
    value = value.replace(/^(\d{2})(\d)/, "$1.$2");
    value = value.replace(/\.(\d{3})(\d)/, ".$1-$2");
    e.target.value = value;
    // return value;
    setPostalCode(value);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(
      createProductReview(match.params.id, {
        rating,
        comment,
      })
    );
  };

  return (
    <>
      <Link className="btn btn-dark my-3" to="/">
        Voltar
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Meta title={product.name} />
          <Row>
            <Col md={6}>
              <Image src={product.image} alt={product.name} fluid />
            </Col>
            <Col md={3}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} avaliações`}
                  />
                </ListGroup.Item>
                <ListGroup.Item>
                  Preço: {currencyFormatter(product.price)}
                </ListGroup.Item>
                <ListGroup.Item>
                  Descrição: {product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>

            <Col md={3}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Preço:</Col>
                      <Col>
                        <strong>{currencyFormatter(product.price)}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        {product.countInStock > 0
                          ? "Em Estoque"
                          : "Indisponível"}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Qtde</Col>
                        <Col>
                          <Form.Control
                            as="select"
                            value={qty}
                            onChange={(e) => setQty(e.target.value)}
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}

                  <ListGroup.Item>
                    <Button
                      onClick={addToCartHandler}
                      className="btn-block"
                      type="button"
                      disabled={product.countInStock === 0}
                    >
                      Adicionar ao Carrinho
                    </Button>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Form onSubmit={calculateShipping}>
                      <Form.Group controlId="cep">
                        <Form.Control
                          type="text"
                          placeholder="Informe seu CEP"
                          value={postalCode}
                          autoComplete="off"
                          maxLength="10"
                          name="postalCode"
                          // required
                          onChange={(e) => maskCep(e)}
                          // onBlur={(e) => getCEPInfo(e)}
                        ></Form.Control>
                      </Form.Group>
                      <Button
                        onClick={calculateShipping}
                        className="btn-block"
                        variant="info"
                        type="button"
                        disabled={product.countInStock === 0}
                      >
                        Calcular Frete
                      </Button>
                    </Form>
                  </ListGroup.Item>

                  <Row>
                    <Col>
                      {shippingLoading ? (
                        <Loader />
                      ) : shippingError ? (
                        <Message variant="danger">{shippingError}</Message>
                      ) : (
                        shippingDetails !== null &&
                        shippingDetails !== undefined &&
                        shippingDetails.pac !== undefined && (
                          <ListGroup.Item>
                            <>
                              <Row>
                                <Col>
                                  {shippingDetails.pac.deliveryTime > 0 && (
                                    <Message>
                                      PAC: R${shippingDetails.pac.finalValue} -{" "}
                                      {shippingDetails.pac.deliveryTime} dias
                                      úteis
                                    </Message>
                                  )}
                                </Col>
                              </Row>
                              <Row>
                                <Col>
                                  {shippingDetails.sedex.deliveryTime > 0 && (
                                    <Message>
                                      SEDEX: R$
                                      {shippingDetails.sedex.finalValue} -{" "}
                                      {shippingDetails.sedex.deliveryTime} dias
                                      úteis
                                    </Message>
                                  )}
                                </Col>
                              </Row>
                              <Row>
                                <Col>
                                  {shippingDetails.sedexDoze.finalValue > 0 && (
                                    <Message>
                                      SEDEX 12: R$
                                      {
                                        shippingDetails.sedexDoze.finalValue
                                      } -{" "}
                                      {shippingDetails.sedexDoze.deliveryTime}{" "}
                                      dias úteis
                                    </Message>
                                  )}
                                </Col>
                              </Row>
                            </>
                          </ListGroup.Item>
                        )
                      )}
                    </Col>
                  </Row>
                </ListGroup>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <h2 className="my-3">Avaliações</h2>
              {product.reviews.length === 0 && (
                <Message>Esse produto ainda não tem nenhuma avaliação.</Message>
              )}
              <ListGroup variant="flush">
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    {/* <p>{review.createdAt.substring(0, 10)}</p> */}
                    <p>
                      <Moment format="DD/MM/YYYY">{review.createdAt}</Moment>
                    </p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item>
                  <h2>Escreva uma avaliação</h2>
                  {errorProductReview && (
                    <Message variant="danger">{errorProductReview}</Message>
                  )}
                  {userInfo ? (
                    <Form onSubmit={submitHandler}>
                      <Form.Group controlId="rating">
                        <Form.Label>Classificação</Form.Label>
                        <Form.Control
                          as="select"
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value="">Selecione...</option>
                          <option value="1">1 - Ruim</option>
                          <option value="2">2 - Medíocre</option>
                          <option value="3">3 - Bom</option>
                          <option value="4">4 - Muito Bom</option>
                          <option value="5">5 - Excelente</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group controlId="comment">
                        <Form.Label>Comentário</Form.Label>
                        <Form.Control
                          as="textarea"
                          row="3"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                      <Button type="submit" variant="primary">
                        Enviar
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      Por favor <Link to="/login">entre</Link> para escrever uma
                      avaliação{" "}
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProductScreen;
