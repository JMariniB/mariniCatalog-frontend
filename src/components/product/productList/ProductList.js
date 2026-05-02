import React, { useEffect, useState } from "react";
import { SpinnerImg } from "../../loader/Loader";
import "./productList.scss";
import { AiFillAmazonSquare, AiFillDelete, AiFillDollarCircle } from "react-icons/ai";
import { HiSearch } from "react-icons/hi";
import { MdViewColumn, MdViewList, MdPriceChange } from "react-icons/md";
import Loader from "../../loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import {
  FILTER_PRODUCTS,
  selectFilteredProducts,
} from "../../../redux/features/product/filterSlice";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import {
  deleteProduct,
  getProducts,
  updateProduct,
  updatePrices,
  updateSinglePrice,
} from "../../../redux/features/product/productSlice";
import ReactDataGrid from "@inovua/reactdatagrid-community";
import "@inovua/reactdatagrid-community/index.css";
import SelectEditor from "@inovua/reactdatagrid-community/SelectEditor";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import NumberFilter from "@inovua/reactdatagrid-community/NumberFilter";
import NumberEditor from "@inovua/reactdatagrid-community/NumberEditor";
import BoolFilter from "@inovua/reactdatagrid-community/BoolFilter";
import BoolEditor from "@inovua/reactdatagrid-community/BoolEditor";
import getFixedLocations from "../../../data/locations";
import moment from "moment";

const MOBILE_BP = 768;

const ProductList = ({ products, isLoading }) => {
  const [search, setSearch] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_BP);
  const [compactMode, setCompactMode] = useState(false);
  const [updatingPrices, setUpdatingPrices] = useState(false);
  const [updatingPriceId, setUpdatingPriceId] = useState(null);
  const locations = getFixedLocations();

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < MOBILE_BP);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const filteredProducts = useSelector(selectFilteredProducts);
  const dispatch = useDispatch();

  const delProduct = async (id) => {
    await dispatch(deleteProduct(id));
    await dispatch(getProducts());
  };

  const confirmDelete = (id) => {
    confirmAlert({
      title: "Eliminar producto",
      message: "¿Estás seguro de que quieres eliminar este producto?",
      buttons: [
        { label: "Eliminar", onClick: () => delProduct(id) },
        { label: "Cancelar" },
      ],
    });
  };

  const updProduct = async (id, column, value) => {
    const formData = new FormData();
    formData.append(column, value);
    await dispatch(updateProduct({ id, formData }));
    await dispatch(getProducts());
  };

  // Pagination (all items shown)
  const [currentItems, setCurrentItems] = useState([]);

  useEffect(() => {
    setCurrentItems(filteredProducts);
  }, [filteredProducts]);

  useEffect(() => {
    dispatch(FILTER_PRODUCTS({ products, search }));
  }, [products, search, dispatch]);

  const coreFilters = [
    { name: "amzorderid", operator: "contains", type: "string", value: "" },
    { name: "amzorderdate", operator: "contains", type: "string", value: "" },
    { name: "name", operator: "contains", type: "string", value: "" },
    { name: "location", operator: "contains", type: "string", value: "" },
  ];

  const isCompact = isMobile || compactMode;

  const filterValue = isCompact
    ? coreFilters
    : [
        ...coreFilters,
        { name: "price", operator: "gte", type: "number", value: "" },
        { name: "quantity", operator: "gte", type: "number", value: "" },
        { name: "pendingPublish", operator: "eq", type: "bool", value: undefined },
        { name: "isPublished", operator: "eq", type: "bool", value: undefined },
      ];

  const defaultSortInfo = [{ name: "amzorderdate", dir: -1 }];

  const priceCell = ({ value, data }) => {
    const { _id, location } = data;
    const canFetchPrice = location && location !== "PEND" && location !== "SOLD";
    const isFetchingThis = updatingPriceId === _id;
    return (
      <div className="price-cell">
        <span>{value != null ? `${value} €` : "—"}</span>
        {canFetchPrice && (
          <button
            className="price-cell__btn"
            title="Actualizar precio desde Amazon"
            onClick={() => handleUpdateSinglePrice(_id)}
            disabled={isFetchingThis}
          >
            <MdPriceChange size={15} />
          </button>
        )}
      </div>
    );
  };

  const actionCell = (value, data) => {
    const { _id, quantity, asin } = data.cellProps.data;
    return (
      <div className="action-icons">
        <a
          href={`https://www.amazon.es/dp/${asin}`}
          target="_blank"
          rel="noopener noreferrer"
          className="icon-amazon"
          title="Ver en Amazon"
        >
          <AiFillAmazonSquare size={22} />
        </a>
        {quantity > 0 && (
          <button
            className="icon-sell"
            title="Marcar como vendido"
            onClick={() => {
              updProduct(_id, "quantity", 0);
              updProduct(_id, "location", "SOLD");
            }}
          >
            <AiFillDollarCircle size={22} />
          </button>
        )}
        <button
          className="icon-delete"
          title="Eliminar"
          onClick={() => confirmDelete(_id)}
        >
          <AiFillDelete size={22} />
        </button>
      </div>
    );
  };

  // Columnas visibles siempre (escritorio + móvil)
  const coreColumns = [
    { name: "_id", header: "_id", defaultVisible: false },
    { name: "amzorderid", header: "Order ID", defaultFlex: 1.2, editable: false },
    {
      name: "amzorderdate",
      header: "Fecha",
      defaultFlex: 0.8,
      editable: false,
      render: ({ value }) => moment(value).format("DD/MM/YY"),
    },
    { name: "name", header: "Artículo", defaultFlex: 4, editable: false },
    {
      name: "location",
      header: "Ubicación",
      defaultFlex: 0.9,
      filterEditor: SelectFilter,
      filterEditorProps: { placeholder: "Todas", dataSource: locations },
      renderEditor: (props) => <SelectEditor {...props} />,
      editorProps: { dataSource: locations },
    },
    {
      name: "action",
      header: "Acciones",
      editable: false,
      defaultFlex: 0.8,
      render: actionCell,
    },
  ];

  // Columnas extra solo en escritorio
  const desktopOnlyColumns = [
    {
      name: "price",
      header: "Precio",
      defaultFlex: 0.85,
      filterEditor: NumberFilter,
      editor: NumberEditor,
      render: priceCell,
    },
    {
      name: "quantity",
      header: "Ctd.",
      defaultFlex: 0.55,
      filterEditor: NumberFilter,
      editor: NumberEditor,
    },
    {
      name: "pendingPublish",
      header: "Pendiente",
      defaultFlex: 0.7,
      filterEditor: BoolFilter,
      editable: true,
      render: ({ value }) => (value ? "Sí" : "No"),
      editor: BoolEditor,
    },
    {
      name: "isPublished",
      header: "Publicado",
      defaultFlex: 0.7,
      editable: true,
      filterEditor: BoolFilter,
      render: ({ value }) => (value ? "Sí" : "No"),
      editor: BoolEditor,
    },
  ];

  // Modo compacto (móvil o botón toggle): solo 5 columnas core
  const columns = isCompact
    ? coreColumns
    : [
        ...coreColumns.slice(0, -1), // todo excepto "action"
        ...desktopOnlyColumns,
        coreColumns[coreColumns.length - 1], // "action" al final
      ];

  const handleUpdateSinglePrice = async (id) => {
    setUpdatingPriceId(id);
    const result = await dispatch(updateSinglePrice(id));
    if (result.meta.requestStatus === "fulfilled") {
      await dispatch(getProducts());
      // toast shown by caller
    }
    setUpdatingPriceId(null);
  };

  const handleUpdatePrices = () => {
    const pending = products.filter(
      (p) => p.location && p.location !== "PEND" && p.location !== "SOLD" &&
             (p.price == null || p.price <= 1)
    );
    confirmAlert({
      title: "Actualizar precios",
      message: `Se buscarán precios en Amazon para ${pending.length} artículo${pending.length !== 1 ? "s" : ""} sin precio. ¿Continuar?`,
      buttons: [
        {
          label: "Actualizar",
          onClick: async () => {
            setUpdatingPrices(true);
            await dispatch(updatePrices());
            await dispatch(getProducts());
            setUpdatingPrices(false);
          },
        },
        { label: "Cancelar" },
      ],
    });
  };

  const onEditComplete = async ({ value, columnId, rowId }) => {
    updProduct(rowId, columnId, value);
    if (columnId === "isPublished" && value === true) {
      updProduct(rowId, "pendingPublish", "false");
    }
  };

  const gridStyle = { minHeight: 560 };

  return (
    <div className="product-list">
      {isLoading && <Loader />}

      <div className="list-card">
        {/* Header */}
        <div className="list-header">
          <div>
            <h3 className="list-header__title">Inventario</h3>
            <p className="list-header__subtitle">
              {filteredProducts.length} artículo{filteredProducts.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="list-header__right">
            <div className="list-search">
              <HiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Buscar artículos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              className={`col-toggle-btn ${compactMode ? "col-toggle-btn--active" : ""}`}
              onClick={() => setCompactMode((prev) => !prev)}
              title={compactMode ? "Ver todas las columnas" : "Vista compacta"}
            >
              {compactMode ? (
                <><MdViewColumn size={18} /> <span>Completo</span></>
              ) : (
                <><MdViewList size={18} /> <span>Compacto</span></>
              )}
            </button>
            <button
              className={`col-toggle-btn ${updatingPrices ? "col-toggle-btn--active" : ""}`}
              onClick={handleUpdatePrices}
              disabled={updatingPrices}
              title="Actualizar precios desde Amazon"
            >
              <MdPriceChange size={18} />
              <span>{updatingPrices ? "Actualizando..." : "Precios"}</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="list-body">
          {isLoading && <SpinnerImg />}

          {!isLoading && products.length === 0 ? (
            <div className="empty-state">
              <span className="empty-state__icon">📦</span>
              <p className="empty-state__text">No hay productos. Añade el primero.</p>
            </div>
          ) : (
            <ReactDataGrid
              idProperty="_id"
              style={gridStyle}
              dataSource={currentItems}
              onEditComplete={onEditComplete}
              columns={columns}
              editable={true}
              defaultFilterValue={filterValue}
              defaultSortInfo={defaultSortInfo}
              pagination
              defaultLimit={25}
              scrollThreshold={0.7}
              navigationMode="none"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
