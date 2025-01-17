import axios from "axios";

import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_SAVE_PAYMENT_METHOD,
  CART_RESET_ITEMS,
} from "../constants/cartConstants";

export const addToCart = (id, qty) => async (dispatch, getState) => {
  const { data } = await axios.get(`/api/products/${id}`);

  dispatch({
    type: CART_ADD_ITEM,
    payload: {
      product: data._id,
      name: data.name,
      image: data.image,
      price: data.price,
      countInStock: data.countInStock,
      weight: data.weight,
      width: data.width,
      height: data.height,
      length: data.length,
      qty,
    },
  });

  sessionStorage.setItem(
    "cartItems",
    JSON.stringify(getState().cart.cartItems)
  );
};

export const removeFromCart = (id) => (dispatch, getState) => {
  dispatch({
    type: CART_REMOVE_ITEM,
    payload: id,
  });

  sessionStorage.setItem(
    "cartItems",
    JSON.stringify(getState().cart.cartItems)
  );
};

export const saveShippingAddress = (data) => (dispatch) => {
  dispatch({
    type: CART_SAVE_SHIPPING_ADDRESS,
    payload: data,
  });

  sessionStorage.setItem("shippingAddress", JSON.stringify(data));
};

export const savePaymentMethod = (data) => (dispatch) => {
  dispatch({
    type: CART_SAVE_PAYMENT_METHOD,
    payload: data,
  });

  sessionStorage.setItem("paymentMethod", JSON.stringify(data));
};

export const resetCart = () => (dispatch) => {
  dispatch({
    type: CART_RESET_ITEMS,
  });

  sessionStorage.removeItem("cartItems");
};
