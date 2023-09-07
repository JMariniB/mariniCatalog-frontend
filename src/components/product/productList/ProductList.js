import React, { useEffect, useState } from "react";
import { SpinnerImg } from "../../loader/Loader";
import "./productList.scss";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { AiOutlineEye, AiFillAmazonSquare,AiFillDelete, AiFillDollarCircle } from "react-icons/ai";
import { BiDollar} from "react-icons/bi";
import Search from "../../search/Search";
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
} from "../../../redux/features/product/productSlice";
import { Link } from "react-router-dom";
import ReactDataGrid from '@inovua/reactdatagrid-community';
import '@inovua/reactdatagrid-community/index.css'
import SelectEditor from '@inovua/reactdatagrid-community/SelectEditor';
import SelectFilter from '@inovua/reactdatagrid-community/SelectFilter';
import NumberFilter from '@inovua/reactdatagrid-community/NumberFilter';
import NumberEditor from '@inovua/reactdatagrid-community/NumberEditor';
import BoolFilter from '@inovua/reactdatagrid-community/BoolFilter';
import BoolEditor from '@inovua/reactdatagrid-community/BoolEditor';
import getFixedLocations from "../../../data/locations";
import moment from 'moment';

const ProductList = ({ products, isLoading }) => {
  const [search, setSearch] = useState("");
  const locations = getFixedLocations();

  const filteredProducts = useSelector(selectFilteredProducts);

  const dispatch = useDispatch();

  const delProduct = async (id) => {
    console.log(id);
    await dispatch(deleteProduct(id));
    await dispatch(getProducts());
  };

  const confirmDelete = (id) => {
    confirmAlert({
      title: "Delete Product",
      message: "Are you sure you want to delete this product.",
      buttons: [
        {
          label: "Delete",
          onClick: () => delProduct(id),
        },
        {
          label: "Cancel",
          // onClick: () => alert('Click No')
        },
      ],
    });
  };

  const updProduct = async (id, column, value) => {
    //console.log(id);
    const formData = new FormData();
    formData.append(column, value);
    await dispatch(updateProduct({ id, formData }));
    await dispatch(getProducts());
  };

  //   Begin Pagination
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 999999;

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;

    setCurrentItems(filteredProducts.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(filteredProducts.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, filteredProducts]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % filteredProducts.length;
    setItemOffset(newOffset);
  };
  //   End Pagination

  useEffect(() => {
    dispatch(FILTER_PRODUCTS({ products, search }));
  }, [products, search, dispatch]);

  //Define los valores de filtros por defecto
  const filterValue = [
    { name: 'amzorderid', operator: 'contains', type: 'string', value: '' },
    { name: 'name', operator: 'contains', type: 'string', value: '' },
    { name: 'location', operator: 'contains', type: 'string', value: ''},
    {
      name: 'amzorderdate',
      operator: 'contains',
      type: 'string',
      value: ''
  },
    { name: 'price', operator: 'gte', type: 'number', value: '' },
    { name: 'quantity', operator: 'gte', type: 'number', value: '' },
    { name: 'pendingPublish', operator: 'eq', type: 'bool', value: undefined },
    { name: 'isPublished', operator: 'eq', type: 'bool', value: undefined  },
  ];

  //Define la ordenación por defecto
  const defaultSortInfo = [{ name: 'amzorderdate', dir: -1 }];

  // Define las columnas para ReactDataGrid
  const columns = [
    { name: '_id', header: '_id', defaultVisible: false, defaultWidth: 8},
    { name: "amzorderid", header: "OrderID", defaultFlex: 1, editable: false  },
    { name: "amzorderdate", editable: false, 
      header: "Fecha Pedido", 
      defaultFlex: 1, 
      render: ({ value, cellProps }) => {
          return moment(value).format('MM-DD-YYYY')
        } 
    },
    { name: "name", header: "Artículo", defaultFlex: 4 , editable: false },
    { name: "location", header: "Ubicación", defaultFlex: 0.7,
    filterEditor: SelectFilter,
    filterEditorProps: {
      placeholder: 'All',
      dataSource: locations
    },
      renderEditor: (props) => {
          return <SelectEditor {...props} />;
      },
      editorProps: {
        dataSource: locations
      } 
    },
    { name: "price", header: "Precio", defaultFlex: 0.6,filterEditor: NumberFilter, editor:NumberEditor },
    { name: "quantity", header: "Ctd.", defaultFlex: 0.5,filterEditor: NumberFilter, editor:NumberEditor },
    { name: "pendingPublish", header: "Pdte", defaultFlex: 0.5,filterEditor: BoolFilter,
      editable: true,
      render: ({ value }) => (value ? "si" : "no"),
      editor: BoolEditor},
    { name: "isPublished",
      header: "Public.",
      defaultFlex: 0.7,
      editable: true,
      filterEditor: BoolFilter,
      render: ({ value }) => (value ? "si" : "no"),
      editor: BoolEditor},
    {
      name: "action",
      header: "Action", editable: false, 
      render: (value, data) => {
        const { _id, quantity, asin } = data.cellProps.data; // Extrae _id y quantity de data
        return (
          <span>
            <a
              href={`https://www.amazon.es/dp/${asin}`} // Reemplaza 'https://www.amazon.es/dp/' por la URL base de tu enlace de Amazon
              target="_blank"
              rel="noopener noreferrer"
            >
              <AiFillAmazonSquare size={25} color={"black"} />
            </a>
            {quantity > 0 && ( // Condición para mostrar el botón BiDollar
              <AiFillDollarCircle
                size={25}
                color={"green"}
                onClick={() => {
                  updProduct(_id, "quantity", 0);
                  updProduct(_id, "location", "SOLD");
                }}
              />
            )}
            {/*<Link to={`/product-detail/${_id}`}>
              <AiOutlineEye size={25} color={"purple"} />
            </Link>
            <Link to={`/edit-product/${_id}`}>
              <FaEdit size={20} color={"green"} />
            </Link>*/}
            <AiFillDelete
              size={25}
              color={"red"}
              onClick={() => confirmDelete(_id)}
            />
          </span>
        )},
    },
  ];

  const onEditComplete = async ({ value, columnId, rowId }) => {
    console.log(value)
    console.log(columnId);
    console.log(rowId);
    
    updProduct(rowId, columnId, value);
    if(columnId=="isPublished" && value==true){
      updProduct(rowId, "pendingPublish", "false");
    }
  };

  const gridStyle = { minHeight: 600 };

  return (
    <div className="product-list">
      {isLoading && <Loader />}
      <hr />
      <div className="table">
        <div className="--flex-between --flex-dir-column">
          <span>
            <h3>Inventory Items</h3>
          </span>
          <span>
            <Search
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </span>
        </div>

        {isLoading && <SpinnerImg />}

        <div>
          {!isLoading && products.length === 0 ? (
            <p>-- No product found, please add a product...</p>
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
              defaultLimit={10}
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
