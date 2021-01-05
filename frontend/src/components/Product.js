import React from "react";
import { Card } from "react-bootstrap";
import Rating from "./Rating";
import { Link } from "react-router-dom";
import currencyFormatter from "../utils/currencyFormatter";

const Product = ({ product }) => {
  return (
    <Card className="my-3 p-3 rounded">
      <Link to={`/product/${product._id}`}>
        <Card.Img src={product.image} variant="top" />
      </Link>

      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title as="div">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as="div">
          <Rating
            value={product.rating}
            text={`${product.numReviews} avaliações`}
          />
        </Card.Text>

        {product.countInStock > 0 ? (
          <Card.Text as="h3">{currencyFormatter(product.price)}</Card.Text>
        ) : (
          <Card.Text as="h4">Produto Indisponível</Card.Text>
        )}
      </Card.Body>
    </Card>
  );
};

export default Product;
