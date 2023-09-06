import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import {
  createProducts,
  selectIsLoading,
} from "../../redux/features/product/productSlice";
import Papa from "papaparse"; // Importa papaparse
import { RiFileUploadLine } from "react-icons/ri";

const initialState = {
  name: "",
  category: "",
  quantity: "",
  price: "",
};

const AddProductsFromCSV = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [csvFile, setCsvFile] = useState(null); // Nuevo estado para el archivo CSV

  const isLoading = useSelector(selectIsLoading);

  const handleCsvFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const convertCsvToJson = () => {
    if (!csvFile) {
      alert("Por favor, seleccione un archivo CSV.");
      return;
    }

    Papa.parse(csvFile, {
      complete: (result) => {

        // El resultado contiene los datos CSV en formato JSON
        const csvData = result.data;
  
        if (!csvData || csvData.length === 0) {
          alert("El archivo CSV está vacío o no tiene datos.");
          return;
        }
  
        // Mapea los campos del CSV a los nombres personalizados que deseas
        const customFieldMapping = {
          "order id": "amzorderid",
          "order date": "amzorderdate",
          "quantity": "quantity",
          "description": "name",
          "price": "price",
          "ASIN": "asin",
          "UBIC": "location",
          "subir":"pendingPublish",
          "publicado":"isPublished"
          // Agrega más mapeos según sea necesario
        };
  
        const jsonData = csvData.map((row) => {
          const rowData = {};
  
          // Itera sobre las columnas del CSV y asigna valores a campos personalizados
          for (const column in row) {
            if (customFieldMapping[column]) {
              rowData[customFieldMapping[column]] = row[column];
            }
          }
  
          return rowData;
        });
  
        // El resultado es jsonData, que contiene los datos CSV con nombres de campos personalizados
        console.log("Datos JSON mapeados:", jsonData);
        saveProduct(jsonData);
      },
      header: true, // Si la primera fila contiene encabezados
    });
  };
  

  const saveProduct = async (jsonData) => {

    console.log(...jsonData);
    const response = await dispatch(createProducts(jsonData));
    console.log(response)

    if(!response.error){
      navigate("/dashboard");
    }
  };

  return (
    <div className="container">
      {isLoading && <Loader />}
      <h3 className="--mt">Add New Product</h3>
      <div className="file-upload">
        <label className="file-label">
          <input
            type="file"
            id="csvFile"
            accept=".csv"
            onChange={handleCsvFileChange}
            className="file-input"
          />
          <RiFileUploadLine className="file-icon" /> Upload CSV File
        </label>
        <br></br>
        <br></br>
        <button className="--btn --btn-primary" onClick={convertCsvToJson}>
          Subir
        </button>
      </div>
      {/* Resto de tu contenido, incluyendo el formulario y la carga de producto */}
    </div>
  );
};

export default AddProductsFromCSV;
