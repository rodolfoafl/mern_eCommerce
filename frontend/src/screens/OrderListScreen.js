import React, { useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { listOrders } from "../actions/orderActions";

import Moment from "react-moment";

const OrderListScreen = ({ history }) => {
  const dispatch = useDispatch();

  const orderList = useSelector((state) => state.orderList);
  const { loading, error, orders } = orderList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listOrders());
    } else {
      history.push("/login");
    }
  }, [dispatch, history, userInfo]);

  return (
    <>
      <h1>Pedidos</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <th>ID</th>
            <th>USUÁRIO</th>
            <th>DATA</th>
            <th>TOTAL</th>
            <th>PAGO</th>
            <th>ENTREGUE</th>
            <th></th>
          </thead>
          <tbody>
            {orders &&
              orders.length > 0 &&
              orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.user && order.user.name}</td>
                  {/* <td>{order.createdAt.substring(0, 10)}</td> */}
                  <td>
                    {" "}
                    <Moment format="DD/MM/YYYY">{order.createdAt}</Moment>
                  </td>
                  <td>R${order.totalPrice}</td>
                  <td>
                    {order.isPaid ? (
                      <Moment format="DD/MM/YYYY">{order.paidAt}</Moment>
                    ) : (
                      // order.paidAt.substring(0, 10)
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
                      <Moment format="DD/MM/YYYY">{order.deliveredAt}</Moment>
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
                      <Button
                        variant="light"
                        className="btn-sm"
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        Detalhes
                      </Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default OrderListScreen;
