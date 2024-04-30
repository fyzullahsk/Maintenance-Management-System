import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Detail.css';
import axios from 'axios';
import { IoChevronBackOutline } from "react-icons/io5";
import Navbar from '../Components/LandingNav/Navbar';
export default function Detail() {
  let navigate = useNavigate();
  const [serviceDetails, setServiceDetails] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { propertyId } = useParams();
  const [tenantDetails, settenantDetails] = useState([]);
  const [PropertyDetails, setPropertyDetails] = useState({});
  useEffect(() => {
    loadPropertyData();
    loadPropertyDetails();
  }, [propertyId]);

  async function loadPropertyData() {
    try {
      const result = await axios.get('http://localhost:8081/PropertyDetails', { params: { PropertyID: propertyId } });
      settenantDetails(result.data.tenantDetails);
      setServiceDetails(result.data.images);
      setMainImage(result.data.images[0]);
    } catch (error) {
      console.error(error);
    }
  }
  async function loadPropertyDetails() {
    try {
      const result = await axios.get('http://localhost:8081/getSelectedProperty', { params: { PropertyID: propertyId } });
      setPropertyDetails(result.data.Result[0]);
    } catch (error) {
      console.error(error);
    }
  }

  const handleImageClick = (image, index) => {
    setMainImage(image);
    setSelectedImageIndex(index);
  };
  // function handleDeleteTenant(TenantID) {
  //   console.log('deleting tenant id',TenantID);
  // }

  return (
    // style={{ backgroundImage: `url(data:image/png;base64,${mainImage.image_data})` }}

    <>
    <Navbar/>
      <IoChevronBackOutline className='back-button' onClick={()=>{navigate(-1)}}/>
      <div className="detail-outer-container" >

        {mainImage && (
          <div className="detail-page-container">
            <div className="image-grid">
              {serviceDetails.map((image, index) => (
                <img
                  key={index}
                  src={`data:image/png;base64,${image.image_data}`}
                  alt={`${index}`}
                  onClick={() => handleImageClick(image, index)}
                  className={selectedImageIndex === index ? 'selected-image' : ''}
                />
              ))}
            </div>
            <div>
              <div className="main-container">
                <div className="main-image-container">
                  <img src={`data:image/png;base64,${mainImage.image_data}`} alt="Main" />
                </div>
              </div>
              <div className="property-details-page">
                <center style={{ marginTop: '20px' }}>
                  <table className="gridTable">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Property Name</th>
                        <th>Property Address</th>
                        <th>Property Rent</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Property Details</td>
                        <td>{PropertyDetails.Name}</td>
                        <td>{PropertyDetails.Address}</td>
                        <td>{PropertyDetails.Price}</td>
                      </tr>
                    </tbody>
                  </table>
                </center>

              </div>
              {tenantDetails.length > 0 && (
                <center style={{ marginTop: '20px' }}>
                  <table className="gridTable">
                    <thead>
                      <tr>
                        <th>Tenant Name</th>
                        <th>Tenant Email</th>
                        <th>Tenant Phone Number</th>
                        {/* <th></th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {tenantDetails.map((element) => (
                        <tr key={element.TenantID}>
                          <td>{element.Name}</td>
                          <td>{element.Email}</td>
                          <td>{element.PhoneNumber}</td>
                          {/* <td><DeleteIcon onClick={()=>handleDeleteTenant(element.TenantID)} style={{cursor:'pointer'}}/></td> */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </center>
              )}
              {tenantDetails.length === 0 && <div className="no-loadProperties">
                Currently there are no Tenants Living
              </div>}
              {/* <div className="property-details-container">
      {PropertyDetails.Name} <br />
      {PropertyDetails.Address}
    </div> */}
            </div>
          </div>
        )}
      </div>
      {/* {tenantDetails.length > 0 && (
  <center style={{ marginTop: '20px' }}>
    <table className="gridTable">
      <thead>
        <tr>
          <th>Tenant Name</th>
          <th>Tenant Email</th>
          <th>Tenant Phone Number</th>
        </tr>
      </thead>
      <tbody>
        {tenantDetails.map((element) => (
          <tr key={element.TenantID}>
            <td>{element.Name}</td>
            <td>{element.Email}</td>
            <td>{element.PhoneNumber}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </center>
)} */}

    </>
  );
}
