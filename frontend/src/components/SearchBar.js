import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

const SearchBar = ({ history }) => {
  const [keyword, setKeyword] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();

    if (keyword.trim()) {
      history.push(`/search/${keyword}`);
    } else {
      history.push("/");
    }
  };

  return (
    <Form onSubmit={submitHandler} inline>
      <Form.Control
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Encontre Produtos..."
        className="mr-sm-2 ml-sm-5"
      ></Form.Control>
      {/* <Button type="submit" variant="outline-success" className="p-2"> */}
      <Button type="submit" variant="dark" className="p-2">
        Procurar
      </Button>
    </Form>
  );
};

export default SearchBar;
