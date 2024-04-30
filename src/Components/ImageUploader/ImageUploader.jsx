import React, { useState } from 'react';
import axios from 'axios';
import ImageUploading from 'react-images-uploading';
import "./ImageUploader.css";
import imageCompression from 'browser-image-compression';
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';

export default function ImageUploader({ service_id, togglePropertyDrawer }) {
  const [images, setImages] = useState([]);
  const navigate = useNavigate();
  const maxNumber = 12;
  const [disableButton, setdisableButton] = useState(false);
  const onChange = (imageList, addUpdateIndex) => {
    setImages(imageList);
  };

  const handleUpdate = async () => {
    setdisableButton(true)
    try {
      for (let i = 0; i < images.length; i++) {
        const compressedImage = await compressImage(images[i].file);
        await uploadImage(service_id, compressedImage);
      }
      swal({
        title: 'Success',
        text: 'Property added Refresh page to see changes',
        icon: "success",
      }).then((ok) => {
        if (ok) {
          togglePropertyDrawer(false);
        }
      });
      setImages([]);
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('An error occurred while uploading the images. Please try again later.');
    }
  };
  

  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 0.2,
      maxWidthOrHeight: 500,
      useWebWorker: true,
    };
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  };

  const uploadImage = async (serviceId, image) => {
    try {
      const formData = new FormData();
      formData.append('service_id', serviceId);
      formData.append('image', image);
      await axios.post('http://localhost:8081/uploadImage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    } catch (error) {
      throw new Error('Error uploading image:', error);
    }
  };

  return (
    <ImageUploading
      multiple
      value={images}
      onChange={onChange}
      maxNumber={maxNumber}
      dataURLKey="data_url"
    >
      {({
        imageList,
        onImageUpload,
        onImageRemoveAll,
        isDragging,
        dragProps,
      }) => (
        <div className="upload__image-wrapper">
          <div className="Upload-buttons-wrapper">
            <button
              className="Upload-buttons"
              style={isDragging ? { color: 'red' } : undefined}
              onClick={onImageUpload}
              {...dragProps}
            >
              Click or Drop here
            </button>
            &nbsp;
            <button onClick={onImageRemoveAll} className="Upload-buttons">
              Remove all images
            </button>
            {images.length > 0 && (
              <button onClick={handleUpdate} className="Upload-buttons" disabled={disableButton} refresh="true">
                Upload Images
              </button>
            )}
          </div>
          <div className="selected-images">
            {imageList.map((image, index) => (
              <div key={index} className="image-item">
                <img src={image['data_url']} alt="" width="100" name='image'/>
              </div>
            ))}
          </div>
        </div>
      )}
    </ImageUploading>
  );
}
