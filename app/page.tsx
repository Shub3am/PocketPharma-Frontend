"use client";
import Link from "next/link";
import React, { useState } from "react";

export default function GenericMedicineFinder() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [mime, setMime] = useState("");
  const [displayGeneric, setGeneric] = useState([]);
  const [nonGeneric, setNonGeneric] = useState({});
  const [genericMedicine, setGenericMedicine] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setMime(file.type);
      console.log(file);
    }
  };
  //shubham backend url change kardena
  const findGenericMedicine = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "https://pocketpharma-backend.shubhamvishwakarma0604.workers.dev/",
        {
          method: "POST",
          body: JSON.stringify({
            image: uploadedImage,
            mime: mime,
          }),
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await response.json();

      console.log(data);
      if (response.ok && !data?.message) {
        let nonGeneric = {};
        Object.keys(JSON.parse(data)).forEach((item) => {
          if (item.toLowerCase().includes("generic")) {
            setGeneric(item);
          } else {
            nonGeneric[item] = JSON.parse(data)[item];
          }
        });
        setNonGeneric(nonGeneric);
        setGenericMedicine(JSON.parse(data));
      } else {
        throw new Error(data.message || "Failed to find generic medicine");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };
  // Eklavya use this to develop frontend
  const demoMedicine = {
    brandName: "PainAway Plus",
    brandImage: "/placeholder.svg?height=200&width=200",
    brandPrice: 79.99,
    genericName: "Ibuprofen 400mg",
    genericImage: "/placeholder.svg?height=200&width=200",
    genericPrice: 12.99,
    genericLink: "https://example.com/generic-ibuprofen",
  };
  // Eklavya use this to develop frontend

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        <div className="bg-blue-600 text-white p-6">
          <h1 className="text-3xl font-bold">
            PocketPharma AI: Generic Medicine Finder
          </h1>
          <p className="text-lg">
            Find affordable alternatives to expensive medications using AI
          </p>
        </div>
        <div className="p-6">
          <div className="flex mb-6 gap-2">
            <button
              className={` py-2 px-4 text-center ${"bg-blue-600 text-white"}`}>
              Medicine Finder
            </button>
            <Link
              href="https://github.com/Shub3am/PocketPharma-Frontend"
              className="py-2 px-4 text-center text-black border-black border-2">
              <button>Github: Frontend</button>
            </Link>
            <Link
              href="https://github.com/Shub3am/PocketPharma-Backend"
              className="py-2 px-4 text-center text-black border-black border-2">
              <button>Github: Backend</button>
            </Link>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">How it works:</h3>
              <ol className="list-decimal list-inside space-y-2">
                <li>Upload a photo of your medicine</li>
                <li>Our AI analyzes the image</li>
                <li>We find a generic alternative</li>
                <li>Save money on your prescription!</li>
              </ol>
            </div>
            <div>
              <label
                htmlFor="medicine-photo"
                className="block text-lg font-semibold mb-2">
                Upload Medicine Photo
              </label>
              <div className="flex items-center space-x-4">
                <input
                  id="medicine-photo"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  onClick={() =>
                    document.getElementById("medicine-photo")?.click()
                  }
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200">
                  Choose File
                </button>
                <button
                  onClick={() =>
                    document.getElementById("medicine-photo")?.click()
                  }
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition duration-200">
                  Take Photo
                </button>
              </div>
            </div>

            {uploadedImage && (
              <div className="mt-4 bg-gray-100 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Uploaded Image:</h3>
                <img
                  src={uploadedImage}
                  alt="Uploaded Medicine"
                  className="w-48 h-48 object-cover rounded-lg mx-auto"
                />
              </div>
            )}

            {uploadedImage && (
              <button
                onClick={findGenericMedicine}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200 disabled:bg-gray-400">
                {isLoading ? "Searching..." : "Find Generic Alternative"}
              </button>
            )}

            {error && (
              <p className="text-red-500 bg-red-100 p-3 rounded-lg">{error}</p>
            )}

            {Object.keys(nonGeneric).length ? (
              <div className="mt-4 space-y-4 bg-gray-100 p-4 rounded-lg">
                <h3 className="text-xl font-semibold">Original Medicine</h3>
                <div className="block items-center ">
                  {Object.keys(nonGeneric).map((item) => {
                    return (
                      <p key={item}>
                        {item.replace("_", " ")} is {String(nonGeneric[item])}{" "}
                        {isNaN(nonGeneric[item]) ? "," : "₹"}
                      </p>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {genericMedicine ? (
              <div className="mt-4 space-y-4 bg-gray-100 p-4 rounded-lg">
                <h3 className="text-xl font-semibold">
                  Generic Alternative Found!
                </h3>
                <div className="block items-center ">
                  {genericMedicine["generic_medicine"].map((item) => {
                    return (
                      <div className="flex" key={JSON.stringify(item)}>
                        {Object.keys(item).map((i) => {
                          return (
                            <p className="mr-1" key={i}>
                              {i.replace("_", " ")} is {item[i]}
                              {isNaN(item[i]) ? "," : "₹"}
                            </p>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
        </div>
        <div className="bg-gray-100 p-4">
          <div className="w-full text-center">
            <p className="text-sm text-gray-600">
              This project has been made by AlphaTauri
            </p>
            <p className="text-sm font-medium">
              Team Members: Shubham and Eklavya
            </p>
            <p className="text-sm text-gray-600">For Live The Code 3.0</p>
          </div>
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Important Information
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>
              Generic medicines are FDA-approved and meet the same quality
              standards as brand-name drugs.
            </li>
            <li>
              Generic drugs are typically 80-85% cheaper than brand-name
              equivalents.
            </li>
            <li>
              Always consult with your healthcare provider before switching
              medications.
            </li>
            <li>
              This tool is for informational purposes only and does not
              constitute medical advice.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
