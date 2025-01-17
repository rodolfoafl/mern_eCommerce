import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import {
  getUserDetails,
  adminUpdateUser as updateUser,
} from "../actions/userActions";
import { ADMIN_USER_UPDATE_RESET } from "../constants/userConstans";

const UserEditScreen = ({ match, history }) => {
  const userId = match.params.id;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const adminUpdateUser = useSelector((state) => state.adminUpdateUser);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = adminUpdateUser;

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: ADMIN_USER_UPDATE_RESET });
      history.push("/admin/userslist");
    } else {
      if (!user.name || user._id !== userId) {
        dispatch(getUserDetails(userId));
      } else {
        setName(user.name);
        setEmail(user.email);
        setIsAdmin(user.isAdmin);
      }
    }
  }, [dispatch, userId, user, successUpdate, history]);

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(updateUser({ _id: userId, name, email, isAdmin }));
  };

  return (
    <>
      <Link to="/admin/userslist" className="btn btn-light my-3">
        Voltar
      </Link>
      <FormContainer>
        <h1>Editar Usuário</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
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

            <Form.Group controlId="isadmin">
              <Form.Check
                type="checkbox"
                label="É Admin?"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              ></Form.Check>
            </Form.Group>

            <Button variant="primary" type="submit">
              Atualizar
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default UserEditScreen;
