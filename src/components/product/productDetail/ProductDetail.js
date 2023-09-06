import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import useRedirectLoggedOutUser from "../../../customHook/useRedirectLoggedOutUser";
import { selectIsLoggedIn } from "../../../redux/features/auth/authSlice";
import { getProduct } from "../../../redux/features/product/productSlice";
import Card from "../../card/Card";
import { SpinnerImg } from "../../loader/Loader";
import "./ProductDetail.scss";
import DOMPurify from "dompurify";

const ProductDetail = () => {
  useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch();

  const { id } = useParams();

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const { product, isLoading, isError, message } = useSelector(
    (state) => state.product
  );

  const stockStatus = (quantity) => {
    if (quantity > 0) {
      return <span className="--color-success">In Stock</span>;
    }
    return <span className="--color-danger">Out Of Stock</span>;
  };

  useEffect(() => {
    if (isLoggedIn === true) {
      dispatch(getProduct(id));
    }

    if (isError) {
      console.log(message);
    }
  }, [isLoggedIn, isError, message, dispatch]);

  return (
    <div className="product-detail">
      <h3 className="--mt">Detalle de producto</h3>
      <Card cardClass="card">
        {isLoading && <SpinnerImg />}
        {product && (
          <div className="detail">
            <Card cardClass="group">
              {product?.image ? (
                <img
                  src={product.image.filePath}
                  alt={product.image.fileName}
                  width="500" 
                  height="500"
                />
              ) : (
                <p>No hay imagen para este producto</p>
              )}
            </Card>
            <h4>Disponibilidad: {stockStatus(product.quantity)}</h4>
            <hr />
            <h4>
              <span className="badge">Name: </span> &nbsp; {product.name}
            </h4>
            <p>
              <b>&rarr; Amz Order ID : </b> {product.amzorderid}
            </p>
            <p>
              <b>&rarr; Amz Order Date : </b> {product.amzorderdate.toLocaleString("es-ES")}
            </p>
            <p>
              <b>&rarr; ASIN : </b> {product.asin}
            </p>
            <p>
              <b>&rarr; Ubicacion : </b> {product.location}
            </p>
            <p>
              <b>&rarr; Precio : </b> {"€"}
              {product.price}
            </p>
            <p>
              <b>&rarr; Cantidad: </b> {product.quantity}
            </p>
            <p>
              <b>&rarr; Valor total en stock : </b> {"€"}
              {product.price * product.quantity}
            </p>
            <hr />
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(product.description),
              }}
            ></div>
            <hr />
            <code className="--color-dark">
              Creado: {product.createdAt.toLocaleString("es-ES")}
            </code>
            <br />
            <code className="--color-dark">
              Última actualización: {product.updatedAt.toLocaleString("es-ES")}
            </code>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProductDetail;
