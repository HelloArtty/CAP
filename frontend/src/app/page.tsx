"use client";

import AxiosLib from '@/app/lib/axiosInstance';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { faCamera, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      uploadImage(file);
      console.log("File selected:", file);
    }
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      const response = await AxiosLib.post("/user-api/posts-img", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

<<<<<<< HEAD
      console.log("Upload response:", response);
      const categoryId = response.data.cate_id;
      console.log("Category ID:", categoryId);

      if (categoryId) {
        window.location.href = `/search?category=${encodeURIComponent(
          categoryId
        )}`;
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
=======
      console.log('Upload response:', response);
    } catch (error) {
      console.error('Upload error:', error);
>>>>>>> parent of e403b50 (search filter , image  work)
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Search form submitted:", e.currentTarget);
    const inputElement = e.currentTarget[0] as HTMLInputElement;
    const searchTerm = inputElement.value;
    console.log("Search initiated:", searchTerm);
    window.location.href = `/search?search=${encodeURIComponent(searchTerm)}`;
  };



  return (
    <>
<<<<<<< HEAD
      <div className="bg-blue-main h-screen flex flex-col items-center justify-center">
        <div className="flex flex-col justify-center items-center w-full px-4">
          <div className="p-4 rounded">
            <h1 className="text-white font-bold text-8xl md:text-9xl">Finder</h1>
          </div>
          <div className="w-full flex justify-center pt-10">
            <div className="rounded w-full max-w-screen-md">
              <form className="flex flex-col items-center w-full " onSubmit={handleSearch}>
                <div className="flex w-full mb-2">
                  <div className="px-4 py-2 bg-white rounded-l-lg cursor-pointer">
                    <FontAwesomeIcon icon={faSearch} size="2x" className="text-gray-600" />
                  </div>
                  <input
                    type="text"
                    placeholder="Find what you're looking for right here....."
                    className="flex-grow p-2 focus:outline-none"
                  />
                  <div className="px-4 py-2 bg-white rounded-r-lg cursor-pointer" onClick={() => document.getElementById('fileInput')?.click()}>
                    <FontAwesomeIcon icon={faCamera} size="2x" className="text-gray-600" />
                    <input
                      id="fileInput"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
=======
      <div className="bg-blue-700 h-screen flex flex-col items-center justify-center">
        <div className="flex flex-col justify-center items-center">
          <div className="bg-red-600 p-4 rounded">
            <h1 className="text-white text-4xl">Finder</h1>
          </div>
          <div className="bg-green-600 p-4 rounded mt-4 w-full max-w-md">
            <form className="flex flex-col items-center" onSubmit={handleSearch}>
              <div className="flex w-full mb-2">
                <input
                  type="text"
                  placeholder="Search"
                  className="flex-grow p-2 rounded-l-lg border border-gray-300 focus:outline-none"
                />
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-r-lg">Search</button>
              </div>
              <div
                className="flex items-center justify-center w-full h-full bg-blue-500 p-2 rounded-lg cursor-pointer"
                onClick={() => document.getElementById('fileInput')?.click()}
              >
                <FontAwesomeIcon icon={faUpload} size="2x" className="text-white" />
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </form>
          </div>
          {selectedImage && (
            <div className="mt-4">
              <img src={selectedImage} alt="Selected" className="max-w-full max-h-64 rounded" />
              {uploading && <p className="text-white">Uploading...</p>}
            </div>
          )}
>>>>>>> parent of e403b50 (search filter , image  work)
        </div>
      </div>
    </>
  );
}
