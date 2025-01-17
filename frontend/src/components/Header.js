import React from "react";
import { Route } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import SearchBar from "./SearchBar";
import { logout } from "../actions/userActions";

const Header = () => {
  const dispatch = useDispatch();

  let history = useHistory();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const logoutHandler = () => {
    dispatch(logout());
    history.push("/");
  };

  return (
    <header>
      <Navbar bg="light" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            {/* <Navbar.Brand>YAM Naturais</Navbar.Brand> */}
            <Navbar.Brand>
              <img
                src="https://i.ibb.co/hyZ1R5G/logo-yam.png"
                alt="Logo Yam Naturais"
                className="shop-logo"
              />
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Route render={({ history }) => <SearchBar history={history} />} />
            <Nav className="ml-auto">
              {!userInfo || !userInfo.isAdmin ? (
                <LinkContainer to="/cart">
                  <Nav.Link>
                    <i className="fas fa-shopping-cart"></i> Carrinho
                  </Nav.Link>
                </LinkContainer>
              ) : null}
              {userInfo ? (
                <NavDropdown title={userInfo.name.split(" ")[0]} id="username">
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>Perfil</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Sair
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link>
                    <i className="fas fa-user"></i> Entrar
                  </Nav.Link>
                </LinkContainer>
              )}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown title="Admin Menu" id="adminmenu">
                  <LinkContainer to="/admin/userslist">
                    <NavDropdown.Item>Usuários</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/productslist">
                    <NavDropdown.Item>Produtos</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/orderlist">
                    <NavDropdown.Item>Pedidos</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
