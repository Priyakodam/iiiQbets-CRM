import React, { useState } from "react";
import { doc, setDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../Firebase/FirebaseConfig";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS


const AddProduct = (Props) => {
    
  const [selection, setSelection] = useState(""); // New state for product or service selection
  const [itemName, setItemName] = useState("");
  const [partNo, setPartNo] = useState("");
  const [group, setGroup] = useState("");
  const [unit, setUnit] = useState("");
  const [effDate, setEffDate] = useState("");
  const [price, setPrice] = useState("");
  const [gstApplicable, setGstApplicable] = useState(false);
  const [applyingDate, setApplyingDate] = useState("");
  const [hsnCode, setHsnCode] = useState("");
  const [gstRate, setGstRate] = useState("");
  const [typesOfSupply, setTypesOfSupply] = useState("");
  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Determine the collection name based on the selection
      const collectionName =
        selection === "product" ? "products" : selection === "service" ? "services" : "projects";
  
      // Common data structure for products, services, and projects
      const data = {
        itemName,
        partNo,
        group,
        unit,
        effDate,
        price,
        gstApplicable,
        applyingDate,
        hsnCode,
        gstRate,
        typesOfSupply,
       // Additional field specific to Project
        timestamp: serverTimestamp(),
      };
  
      // Write the document to the appropriate collection
      const docRef = await setDoc(doc(collection(db, collectionName)), data);
  
      // Alert message based on the selection
      alert(`${selection.charAt(0).toUpperCase() + selection.slice(1)} added successfully!!!`);
  
      // Reset form fields
      setItemName("");
      setPartNo("");
      setGroup("");
      setUnit("");
      setEffDate("");
      setPrice("");
      setGstApplicable(false);
      setApplyingDate("");
      setHsnCode("");
      setGstRate("");
      setTypesOfSupply("");
      
    } catch (error) {
      console.error("Error adding item:", error);
    }
    Props.onProductAdded();
  };

 
  


  const renderFormFields = () => (
    <>
      <div className="row mb-3">
        <div className="col">
          <label>
            {selection.charAt(0).toUpperCase() + selection.slice(1)} Name:
          </label>
          <input
            type="text"
            className="form-control"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            required
          />
        </div>
        <div className="col">
          <label>Part No:</label>
          <input
            type="text"
            className="form-control"
            value={partNo}
            onChange={(e) => setPartNo(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col">
          <label>Group:</label>
          <input
            type="text"
            className="form-control"
            value={group}
            onChange={(e) => setGroup(e.target.value)}
            required
          />
        </div>
        <div className="col">
          <label>Unit:</label>
          <input
            type="text"
            className="form-control"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col">
          <label>Price:</label>
          <input
            type="number"
            className="form-control"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="col">
          <label>GST Applicable:</label>
          <select
            className="form-control"
            value={gstApplicable ? "applicable" : "nonapplicable"}
            onChange={(e) => setGstApplicable(e.target.value === "applicable")}
          >
            <option value="applicable">Applicable</option>
            <option value="nonapplicable">Non-Applicable</option>
          </select>
        </div>
        <div className="col">
          <label>GST Rate:</label>
          <input
            type="number"
            className="form-control"
            value={gstRate}
            onChange={(e) => setGstRate(e.target.value)}
            required
          />
        </div>
      </div>

      {selection === "product" && (
        <>
          <div className="row mb-3">
            <div className="col">
              <label>HSN Code:</label>
              <input
                type="text"
                className="form-control"
                value={hsnCode}
                onChange={(e) => setHsnCode(e.target.value)}
                required
              />
            </div>
            <div className="col">
              <label>Types of Supply:</label>
              <input
                type="text"
                className="form-control"
                value={typesOfSupply}
                onChange={(e) => setTypesOfSupply(e.target.value)}
                required
              />
            </div>
          </div>
        </>
      )}

      <button type="submit" className="btn btn-primary mt-3">
        Add {selection.charAt(0).toUpperCase() + selection.slice(1)}
      </button>
    </>
  );

  return (
   
    <div className="container mt-4">
      <div className="card">
        {/* <div className="card-header">
          <h2>Add Product/Service</h2>
        </div> */}
        <div className="card-body">
          <form onSubmit={handleFormSubmit}>
            <div className="form-group mb-3">
            <label>Select Type:</label>
        <select
          className="form-control"
          value={selection}
          onChange={(e) => setSelection(e.target.value)}
        >
          <option value="" disabled>Select</option>
          <option value="product">Product</option>
          <option value="service">Service</option>
          <option value="project">Project</option>
        </select>
      </div>
            

            {selection && renderFormFields()}
          </form>
        </div>
      </div>
    </div>
    
  );
};

export default AddProduct;
