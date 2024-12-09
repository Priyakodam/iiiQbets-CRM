import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { Modal, Button, Form, DropdownButton, Dropdown } from "react-bootstrap";
import { db } from "../../Firebase/FirebaseConfig" ;
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPen,
  faPlus,
  faTimes,faFileExport
} from "@fortawesome/free-solid-svg-icons";
import AddProducts from "./AddProduct";
import * as XLSX from "xlsx";
import Dashboard from "../Dashboard/Dashboard";
import "./AdminViewProduct.css";

const AdminProductTable = () => {
    const [collapsed, setCollapsed] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = products.slice(firstIndex, lastIndex);
  const npage = Math.ceil(products.length / recordsPerPage);
  const numbers = [...Array(npage + 1).keys()].slice(1);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [collectionType, setCollectionType] = useState("projects");


  const exportToExcel = () => {
    // Transform the data as before
    const dataForExport = paginatedProducts.map((product, index) => ({
      "S.No": index + 1 + firstIndex, // Adjust for pagination
      "Item Name": product.itemName,
      "Part No": product.partNo,
      "Group": product.group,
      "Unit": product.unit,
      "Price": product.price,
      "GST Applicable": product.gstApplicable ? "Yes" : "No",
      "GST Rate": product.gstRate,
      ...(collectionType === "products" && { "HSN Code": product.hsnCode }),
      ...(collectionType === "products" && { "Types of Supply": product.typesOfSupply }),
    }));
  
    // Create the worksheet from the transformed data
    const ws = XLSX.utils.json_to_sheet(dataForExport);
  
    // Specify column widths (optional, for better readability)
    const wscols = [
      { wch: 6 }, // "S.No" column
      { wch: 20 }, // "Item Name" column
      { wch: 15 }, // "Part No" column
      { wch: 10 }, // "Group" column
      { wch: 10 }, // "Unit" column
      { wch: 10 }, // "Price" column
      { wch: 15 }, // "GST Applicable" column
      { wch: 10 }, // "GST Rate" column
      { wch: 15 }, // "HSN Code" column, only for products
      { wch: 20 }, // "Types of Supply" column, only for products
    ];
  
    // Apply the column widths to the worksheet
    ws['!cols'] = wscols;
  
    // Create a new workbook and append the worksheet to it
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, collectionType.charAt(0).toUpperCase() + collectionType.slice(1));
  
    // Trigger the file download
    XLSX.writeFile(wb, `${collectionType}.xlsx`);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!collectionType) return;
      try {
        const querySnapshot = await getDocs(collection(db, collectionType));
        const productsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Sort productsData array based on the timestamp in descending order
        productsData.sort((a, b) => b.timestamp - a.timestamp);

        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [collectionType]);

  const openAddProductModal = () => {
    setShowAddProductModal(true);
  };

  const closeAddProductModal = () => {
    setShowAddProductModal(false);
  };

  const deleteProduct = async (productId) => {
    const userConfirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!userConfirmed) {
      return;
    }

    try {
      // Delete the product from the correct Firestore collection
      await deleteDoc(doc(db, collectionType, productId));
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );
      alert(
        `${
          collectionType.charAt(0).toUpperCase() + collectionType.slice(1)
        } deleted successfully!`
      );
    } catch (error) {
      console.error("Error deleting product: ", error);
      alert("Failed to delete product");
    }
  };
  const openEditProductModal = (product) => {
    setCurrentProduct({ ...product, collectionType: collectionType });
    setShowEditProductModal(true);
  };

  const closeEditProductModal = () => {
    setShowEditProductModal(false);
  };

  const saveEditedProduct = async () => {
    if (!currentProduct || !currentProduct.id) {
      alert("No product is selected or product ID is missing.");
      return;
    }

    // Validate the product details here (e.g., check if the name is not empty)
    if (currentProduct.itemName.trim() === "") {
      alert("Product name is required.");
      return;
    }

    // Add any other validation as necessary...

    try {
      await updateDoc(
        doc(db, currentProduct.collectionType, currentProduct.id),
        currentProduct
      );

      // Update the local state to reflect the changes
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === currentProduct.id ? currentProduct : product
        )
      );

      closeEditProductModal();
      alert(
        `${
          currentProduct.collectionType.charAt(0).toUpperCase() +
          currentProduct.collectionType.slice(1)
        } updated successfully!`
      );
    } catch (error) {
      console.error("Error updating product/service: ", error);
      alert("Failed to update product/service. Please try again.");
    }
  };
  const styles = {
    tableHeader: {
    //   padding: "8px",
      textAlign: "left",
    },
    tableCell: {
      padding: "8px",
      textAlign: "left",
    },
  };

  const filteredProducts = products.filter((product) => {
    const itemName = product.itemName ? product.itemName.toLowerCase() : "";
    const partNo = product.partNo ? product.partNo.toLowerCase() : "";
    const group = product.group ? product.partNo.toLowerCase() : "";
    const unit = product.unit ? product.partNo.toLowerCase() : "";
    const hsnCode = product.hsnCode ? product.partNo.toLowerCase() : "";
    const gstRate = product.gstRate ? product.partNo.toLowerCase() : "";
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    return (
      itemName.includes(lowerCaseSearchTerm) ||
      partNo.includes(lowerCaseSearchTerm) ||
      group.includes(lowerCaseSearchTerm) ||
      unit.includes(lowerCaseSearchTerm) ||
      hsnCode.includes(lowerCaseSearchTerm) ||
      gstRate.includes(lowerCaseSearchTerm)
      // Include additional fields in the return statement as needed
    );
  });
  const paginatedProducts = filteredProducts.slice(firstIndex, lastIndex);

  function prePage() {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  function changeCPage(id) {
    setCurrentPage(id);
  }
  function nextPage() {
    if (currentPage !== npage) {
      setCurrentPage(currentPage + 1);
    }
  }

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }
  const handleCollectionChange = (type) => {
    setCollectionType(type);
  };

  const onProductAdded = () => {
    setShowAddProductModal(false);
  };

  return (
    <div className="addproduct-container">
    <Dashboard onToggleSidebar={setCollapsed} />
    <div className={`addproduct-content ${collapsed ? 'collapsed' : ''}`}>
    <div className="container">
      <div className="mt-2">
        <Button variant="primary" onClick={openAddProductModal}>
          <FontAwesomeIcon icon={faPlus} /> Add Product/Services
        </Button>
        <div className="mt-2" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Dropdown>
            <Dropdown.Toggle variant="primary" id="dropdown-basic">
              {collectionType === "products"
                ? "Product"
                : collectionType === "services"
                ? "Service"
                : collectionType === "projects"
                ? "Project"
                : "Select"}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleCollectionChange("products")}>
                Product
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleCollectionChange("services")}>
                Service
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleCollectionChange("projects")}>
                Project
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          {/* Export Button */}
   <Button variant="info" onClick={exportToExcel}>
          <FontAwesomeIcon icon={faFileExport} /> Export to Excel
        </Button>
        </div>
      </div>

      <Modal size="lg" show={showAddProductModal} onHide={closeAddProductModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddProducts onProductAdded={onProductAdded} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeAddProductModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <h1 className="text-center">
        {" "}
        {collectionType === "products"
          ? "Product"
          : collectionType === "services"
          ? "Service"
          : collectionType === "projects"
          ? "Project"
          : "Projects/Products"}
        s{" "}
      </h1>
      <div
        style={{
          textAlign: "right",
          marginBottom: "10px",
          position: "relative",
        }}
      >
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "5px", paddingRight: searchTerm ? "25px" : "5px",width:'15%' }}
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            style={{
              position: "absolute",
              right: "5px",
              top: "5px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        )}
      </div>
      {collectionType && (
        <>
          <table className="styled-table">
            <thead>
              <tr>
                <th style={styles.tableHeader}>S.No</th>
                <th style={styles.tableHeader}>
                  {collectionType === "products"
                    ? "Product"
                    : collectionType === "services"
                    ? "Service"
                    : collectionType === "projects"
                    ? "Project"
                    : "Projects/Products"}{" "}
                  Name
                </th>
                <th style={styles.tableHeader}>Part No</th>
                <th style={styles.tableHeader}>Group</th>
                <th style={styles.tableHeader}>Unit</th>
                {/* <th style={styles.tableHeader}>Eff Date</th> */}
                <th style={styles.tableHeader}>Price</th>
                <th style={styles.tableHeader}>GST Applicable</th>
                {/* <th style={styles.tableHeader}>Applying Date</th> */}
                {collectionType === "products" && (
                  <th style={styles.tableHeader}>HSN Code</th>
                )}

                <th style={styles.tableHeader}>GST Rate</th>
                {collectionType === "products" && (
                  <th style={styles.tableHeader}>Types of Supply</th>
                )}
                <th style={styles.tableHeader}>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((product, index) => (
                <tr key={product.id} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={styles.tableCell}>{firstIndex + index + 1}</td>
                  <td style={styles.tableCell}>{product.itemName}</td>
                  <td style={styles.tableCell}>{product.partNo}</td>
                  <td style={styles.tableCell}>{product.group}</td>
                  <td style={styles.tableCell}>{product.unit}</td>
                  {/* <td style={styles.tableCell}>{product.effDate}</td> */}
                  <td style={styles.tableCell}>{product.price}</td>
                  <td style={styles.tableCell}>
                    {product.gstApplicable ? "Applicable" : "Non-Applicable"}
                  </td>
                  {/* <td style={styles.tableCell}>{product.applyingDate}</td> */}
                  {collectionType === "products" && (
                    <td style={styles.tableCell}>{product.hsnCode}</td>
                  )}

                  <td style={styles.tableCell}>{product.gstRate}</td>
                  {collectionType === "products" && (
                    <td style={styles.tableCell}>{product.typesOfSupply}</td>
                  )}
                  <td style={styles.tableCell}>
                    <Button
                      variant="primary"
                      onClick={() => openEditProductModal(product)}
                    >
                      <FontAwesomeIcon icon={faPen} />
                    </Button>{" "}
                    <Button
                      variant="danger"
                      onClick={() => deleteProduct(product.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {currentProduct && (
            <Modal show={showEditProductModal} onHide={closeEditProductModal}>
              <Modal.Header closeButton>
                <Modal.Title>Edit Product</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  {/* Product Name */}
                  <div className="row mb-3">
                    <Form.Group className="col-6">
                      <Form.Label>Product Name:</Form.Label>
                      <Form.Control
                        type="text"
                        name="itemName"
                        value={currentProduct.itemName}
                        onChange={(e) =>
                          setCurrentProduct({
                            ...currentProduct,
                            itemName: e.target.value,
                          })
                        }
                      />
                    </Form.Group>

                    {/* Part No */}
                    <Form.Group className="col-6">
                      <Form.Label>Part No:</Form.Label>
                      <Form.Control
                        type="text"
                        name="partNo"
                        value={currentProduct.partNo}
                        onChange={(e) =>
                          setCurrentProduct({
                            ...currentProduct,
                            partNo: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                  </div>

                  {/* Group and Unit */}
                  <div className="row mb-3">
                    <Form.Group className="col-6">
                      <Form.Label>Group:</Form.Label>
                      <Form.Control
                        type="text"
                        name="group"
                        value={currentProduct.group}
                        onChange={(e) =>
                          setCurrentProduct({
                            ...currentProduct,
                            group: e.target.value,
                          })
                        }
                      />
                    </Form.Group>

                    <Form.Group className="col-6">
                      <Form.Label>Unit:</Form.Label>
                      <Form.Control
                        type="text"
                        name="unit"
                        value={currentProduct.unit}
                        onChange={(e) =>
                          setCurrentProduct({
                            ...currentProduct,
                            unit: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                  </div>

                  {/* Price and GST Applicable */}
                  <div className="row mb-3">
                    <Form.Group className="col-6">
                      <Form.Label>Price:</Form.Label>
                      <Form.Control
                        type="number"
                        name="price"
                        value={currentProduct.price}
                        onChange={(e) =>
                          setCurrentProduct({
                            ...currentProduct,
                            price: parseFloat(e.target.value),
                          })
                        }
                      />
                    </Form.Group>

                    <Form.Group className="col-6">
                      <Form.Label>GST Applicable:</Form.Label>
                      <Form.Select
                        name="gstApplicable"
                        value={currentProduct.gstApplicable ? "true" : "false"}
                        onChange={(e) =>
                          setCurrentProduct({
                            ...currentProduct,
                            gstApplicable: e.target.value === "true",
                          })
                        }
                      >
                        <option value="true">Applicable</option>
                        <option value="false">Non-Applicable</option>
                      </Form.Select>
                    </Form.Group>
                  </div>

                  <div className="row mb-3">
                    {currentProduct.collectionType === "products" && (
                      <>
                        <Form.Group className="col-6">
                          <Form.Label>HSN Code:</Form.Label>
                          <Form.Control
                            type="text"
                            name="hsnCode"
                            value={currentProduct.hsnCode}
                            onChange={(e) =>
                              setCurrentProduct({
                                ...currentProduct,
                                hsnCode: e.target.value,
                              })
                            }
                          />
                        </Form.Group>
                      </>
                    )}
                    <Form.Group className="col-6">
                      <Form.Label>GST Rate (%):</Form.Label>
                      <Form.Control
                        type="number"
                        name="gstRate"
                        value={currentProduct.gstRate}
                        onChange={(e) =>
                          setCurrentProduct({
                            ...currentProduct,
                            gstRate: parseFloat(e.target.value),
                          })
                        }
                      />
                    </Form.Group>
                  </div>

                  {/* Types of Supply */}
                  {currentProduct.collectionType === "products" && (
                    <Form.Group>
                      <Form.Label>Types of Supply:</Form.Label>
                      <Form.Control
                        type="text"
                        name="typesOfSupply"
                        value={currentProduct.typesOfSupply}
                        onChange={(e) =>
                          setCurrentProduct({
                            ...currentProduct,
                            typesOfSupply: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                  )}
                </Form>
              </Modal.Body>

              <Modal.Footer>
                <Button variant="secondary" onClick={closeEditProductModal}>
                  Close
                </Button>
                <Button variant="primary" onClick={saveEditedProduct}>
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>
          )}
        </>
      )}
      <nav>
        <ul className="pagination mt-3 justify-content-end">
          <li className="page-item">
            <a
              className="page-link"
              style={{ cursor: "pointer" }}
              onClick={prePage}
            >
              Prev
            </a>
          </li>

          {numbers.map((n, i) => (
            <li
              className={`page-item ${currentPage === n ? "active" : ""}`}
              key={i}
            >
              <a
                className="page-link"
                style={{ cursor: "pointer" }}
                onClick={() => changeCPage(n)}
              >
                {n}
              </a>
            </li>
          ))}
          <li className="page-item">
            <a
              className="page-link"
              style={{ cursor: "pointer" }}
              onClick={nextPage}
            >
              Next
            </a>
          </li>
        </ul>
      </nav>
    </div>
    </div>
    </div>
  );
};

export default AdminProductTable;
