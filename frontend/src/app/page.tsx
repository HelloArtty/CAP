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
        </div>
      </div>
    </>
  );
}
