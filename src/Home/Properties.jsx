import React, { useEffect, useState } from 'react'
import './Home.css'
import axios from 'axios';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBIcon } from "mdb-react-ui-kit";
import { Link } from 'react-router-dom';

export default function Properties() {
  const userId = window.sessionStorage.getItem('UserId');
  const Role = window.sessionStorage.getItem('Role');
const [PropertyDetails, setPropertyDetails] = useState([]);
  useEffect(() => {
    loadProperties();
  }, []);

  async function loadProperties() {
    if(Role === 'Landlord')
    {
      await axios.get('http://localhost:8081/getProperties',{params: {LandlordID: userId}})
      .then(result=>{
        setPropertyDetails(result.data.Result);
      })
      .catch(err=>{
        console.error(err);
      })
    }
  }
  
  return (
    <div className="properties">
    <p className='properties-title'>Properties</p>
    {PropertyDetails.length > 0 && (
    <div className="properties-list">
    {PropertyDetails.map((ele, index) => (
              <MDBContainer fluid className="my-5 category-details" key={index}>
                <MDBRow className="justify-content-center">
                  <MDBCol md="6">
                    <Link to={`/detail/${ele.PropertyID}`} style={{ textDecoration: 'none' }}>
                      <MDBCard className="text-black">
                        <MDBIcon fab icon="apple" size="lg" className="px-3 pt-3 pb-2" />
                        <div className="service-image-container">
                          <MDBCardImage
                           src={ele.image_data ? `data:image/png;base64,${ele.image_data}` : 'assets/house.png'}
                            position="top"
                            alt={`image${index}`}
                            className='service-image'
                          />
                        </div>
                        <MDBCardBody className='category-details-body'>
                          <div className="service-title">
                            <MDBCardTitle>{ele.Name}</MDBCardTitle>
                            <p className="text-muted mb-4">{ele.Address}</p>
                          </div>
                          <div className="details-container">
                            <div>
                            <div>Rent</div>
                            </div>
                            <div><div>{ele.Price}</div>
                              
                            </div>
                          </div>
                        </MDBCardBody>
                      </MDBCard>
                    </Link>
                  </MDBCol>
                </MDBRow>
                {/* {window.sessionStorage.getItem('UserType') === 'admin' && (
                  <div className="crud-buttons">
                    <AiFillDelete onClick={() => handleDeleteService(ele)} />
                    <AiFillEdit onClick={() => navigate(`/updateService/${ele.id}`)}/>
                  </div>
                )} */}
              </MDBContainer>
            ))}
    </div>
    )}
    {PropertyDetails.length === 0 && <div className="no-loadProperties">
        No properties Available
    </div>
    }
    </div>
  )
}
