import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { getProductDetails, updateProduct } from "../actions/productActions";
import { PRODUCT_UPDATE_RESET } from "../constants/productConstants";

const ProductEditScreen = ({ match, history }) => {
  const productId = match.params.id;

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [weight, setWeight] = useState(0);
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [length, setLength] = useState(0);

  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const productUpdate = useSelector((state) => state.productUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate;

  useEffect(() => {
    if (successUpdate) {
      console.log("successUpdate");
      dispatch({ type: PRODUCT_UPDATE_RESET });
      history.push("/admin/productslist");
    } else {
      if (!product.name || product._id !== productId) {
        dispatch(getProductDetails(productId));
      } else {
        setName(product.name);
        setPrice(product.price);
        setImage(product.image);
        setBrand(product.brand);
        setCategory(product.category);
        setDescription(product.description);
        setCountInStock(product.countInStock);
        setWeight(product.weight);
        setHeight(product.height);
        setWidth(product.width);
        setLength(product.length);
      }
    }
  }, [dispatch, productId, product, history, successUpdate]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();

    formData.append("image", file);
    setUploading(true);
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const { data } = await axios.post("/api/upload", formData, config);
      setImage(data);
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();

    console.log("submiHandler");

    dispatch(
      updateProduct({
        _id: productId,
        name,
        price,
        image,
        brand,
        category,
        description,
        countInStock,
        weight,
        height,
        width,
        length,
      })
    );
  };

  return (
    <>
      <Link to="/admin/productslist" className="btn btn-light my-3">
        Voltar
      </Link>
      <FormContainer>
        <h1>Editar Produto</h1>
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
                placeholder="Informe o nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="off"
                required
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="price">
              <Form.Label>Preço</Form.Label>
              <Form.Control
                type="number"
                placeholder="Informe o preço"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                autoComplete="off"
                required
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="image">
              <Form.Label>Imagem</Form.Label>
              <Form.Control
                type="text"
                placeholder="Informe um link para a imagem"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                autoComplete="off"
              ></Form.Control>

              <Form.File
                id="image-file"
                label="Selecione um arquivo"
                custom
                onChange={uploadFileHandler}
              ></Form.File>
              {uploading && <Loader />}
            </Form.Group>

            <Form.Group controlId="brand">
              <Form.Label>Marca</Form.Label>
              <Form.Control
                type="text"
                placeholder="Informe a marca"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                autoComplete="off"
                required
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="category">
              <Form.Label>Categoria</Form.Label>
              <Form.Control
                type="text"
                placeholder="Informe a categoria"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                autoComplete="off"
                required
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="description">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                type="text"
                placeholder="Informe a descrição"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                autoComplete="off"
                required
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="countInStock">
              <Form.Label>Qtde em Estoque</Form.Label>
              <Form.Control
                type="number"
                placeholder="Informe a quantidade em estoque"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
                autoComplete="off"
                required
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="weight">
              <Form.Label>
                Peso (kg) (mínimo exigido por correios = 1kg)
              </Form.Label>
              <Form.Control
                type="number"
                placeholder="Informe o peso"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                autoComplete="off"
                min="1"
                required
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="height">
              <Form.Label>
                Altura (cm) (mínimo exigido por correios = 2cm)
              </Form.Label>
              <Form.Control
                type="number"
                placeholder="Informe a altura"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                autoComplete="off"
                min="2"
                required
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="width">
              <Form.Label>
                Largura (cm) (mínimo exigido por correios = 11cm)
              </Form.Label>
              <Form.Control
                type="number"
                placeholder="Informe a largura"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                autoComplete="off"
                min="11"
                required
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="length">
              <Form.Label>
                Comprimento (cm) (mínimo exigido por correios = 16cm)
              </Form.Label>
              <Form.Control
                type="number"
                placeholder="Informe o comprimento"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                autoComplete="off"
                min="16"
                required
              ></Form.Control>
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

export default ProductEditScreen;
