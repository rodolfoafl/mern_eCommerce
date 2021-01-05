import React, { useState, useEffect } from "react";
import { Button, Row, Col, Form, Table } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { getUserDetails, updateUser } from "../actions/userActions";
import { listUserOrders as listOrders } from "../actions/orderActions";
import { USER_UPDATE_RESET } from "../constants/userConstans.js";

import Moment from "react-moment";
import currencyFormatter from "../utils/currencyFormatter";

const ProfileScreen = ({ location, history }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userUpdate = useSelector((state) => state.userUpdate);
  const { success } = userUpdate;

  const listUserOrders = useSelector((state) => state.listUserOrders);
  const { loading: loadingOrders, error: errorOrders, orders } = listUserOrders;

  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
    } else {
      if (!user || !user.name || success) {
        dispatch({ type: USER_UPDATE_RESET });
        dispatch(getUserDetails("profile"));
        dispatch(listOrders());
      } else {
        setName(user.name);
        setEmail(user.email);
      }
    }
  }, [history, userInfo, dispatch, user, success]);

  const submitHandler = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Senhas não são idênticas!");
    } else {
      dispatch(updateUser({ id: user._id, name, email, password }));
    }
  };

  return (
    <>
      {!userInfo ? (
        <Loader />
      ) : (
        <Row>
          <Col md={3}>
            <h2>Perfil de Usuário</h2>
            {message && <Message variant="danger">{message}</Message>}
            {error && <Message variant="danger">{error}</Message>}
            {success && <Message variant="success">Perfil Atualizado</Message>}
            {loading && <Loader />}
            <Form onSubmit={submitHandler}>
              <Form.Group controlId="name">
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type="name"
                  placeholder="Informe um nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="off"
                  required
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Informe um email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="off"
                  required
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="password">
                <Form.Label>Senha</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Informe uma senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="off"
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="confirmPassword">
                <Form.Label>Confirmação de Senha</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirmação de senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="off"
                ></Form.Control>
              </Form.Group>

              <Button variant="primary" type="submit">
                Atualizar
              </Button>
            </Form>
          </Col>
          <Col md={9}>
            <h2>Meus Pedidos</h2>
            {loadingOrders ? (
              <Loader />
            ) : errorOrders ? (
              <Message variant="danger">{errorOrders}</Message>
            ) : (
              <Table striped bordered hover responsive className="table-sm">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>DATA</th>
                    <th>TOTAL</th>
                    <th>PAGO</th>
                    <th>ENTREGUE</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {orders &&
                    orders.length > 0 &&
                    orders.map((order) => (
                      <tr key={order._id}>
                        <td>{order._id}</td>
                        {/* <td>{order.createdAt.substring(0, 10)}</td> */}
                        <td>
                          <Moment format="DD/MM/YYYY">{order.createdAt}</Moment>
                        </td>
                        <td>{currencyFormatter(order.totalPrice)}</td>
                        <td>
                          {order.isPaid ? (
                            // order.paidAt.substring(0, 10)
                            <Moment format="DD/MM/YYYY">{order.paidAt}</Moment>
                          ) : (
                            <i
                              className="fas fa-times"
                              style={{
                                color: "red",
                                display: "flex",
                                justifyContent: "center",
                              }}
                            ></i>
                          )}
                        </td>
                        <td>
                          {order.isDelivered ? (
                            // order.deliveredAt.substring(0, 10)
                            <Moment format="DD/MM/YYYY">
                              {order.deliveredAt}
                            </Moment>
                          ) : (
                            <i
                              className="fas fa-times"
                              style={{
                                color: "red",
                                display: "flex",
                                justifyContent: "center",
                              }}
                            ></i>
                          )}
                        </td>
                        <td>
                          <LinkContainer to={`/order/${order._id}`}>
                            <Button className="btn-sm" variant="light">
                              Detalhes
                            </Button>
                          </LinkContainer>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            )}
          </Col>
        </Row>
      )}
    </>
  );
};

export default ProfileScreen;
