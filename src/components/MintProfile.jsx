/* eslint-disable consistent-return */
/* eslint-disable no-use-before-define */
/* eslint-disable no-shadow */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import axios from "axios";
import Web3Modal from "web3modal";
import Waste from "../utils/Waste.json";
import { wastemarketplaceAddress } from "../../config";

const APIKEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7Im1zZyI6IntcIm1ldGhvZFwiOlwiZ29vZ2xlLW9hdXRoMlwiLFwiaWRcIjpcIjEwMzU3MDIzNjI0MTk1NDAyNzkyMVwiLFwicHVycG9zZVwiOlwiQ2hlcnR5IEFQSSBrZXlcIixcInRpbWVfZ2VuZXJhdGVkXCI6XCIyMDI0LTExLTA2VDEzOjQwOjE4LjEwOFpcIixcImR1cmF0aW9uX2hvdXJzXCI6ODc2MH0iLCJzaWciOm51bGwsIm1ldGhvZCI6Imp3dF9jaGVydHlfYXBpX2tleV92MSJ9LCJpYXQiOjE3MzA5MDA0MTgsImV4cCI6MTc2MjQzNjQxOH0.QvyneqqRaLyJu8FNaQSdJI88q6_Cg53vFUFabFyDdwk";

const MintWaste = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);
  const [uploadedFile, setUploadedFile] = useState();
  const [imageView, setImageView] = useState();
  const [metaDataURL, setMetaDataURl] = useState();
  const [txURL, setTxURL] = useState();
  const [txStatus, setTxStatus] = useState();
  const [formInput, updateFormInput] = useState({
    name: "plastic",
    description: "",
    country: "",
    weight: "",
    collectionPoint: "",
    price: ""
  });

  const handleFileUpload = (event) => {
    setUploadedFile(event.target.files[0]);
    setTxStatus("");
    setImageView("");
    setMetaDataURl("");
    setTxURL("");
  };

  // Convert file to Uint8Array and upload to Cherty
  const uploadNFTContent = async (inputFile) => {
    const { name, description, country, weight, collectionPoint, price } = formInput;
    if (!name || !description || !country || !weight || !collectionPoint || !inputFile) return;

    try {
      setTxStatus("Uploading Item to IPFS via Cherty.");

      // Convert file to Uint8Array
      const fileArrayBuffer = await inputFile.arrayBuffer();
      const fileUint8Array = new Uint8Array(fileArrayBuffer);

      const response = await fetch('https://cherty.io/api/get_account_info', {
        headers: {
          Authorization: `Bearer ${APIKEY}`,
        },
      });
    const data = await response.json();
    console.log(data);

      const uploadResponse = await axios.post(
        `https://cherty.io/api/binary_data_upload`,
        fileUint8Array,
        {
          headers: {
            Authorization: `Bearer ${APIKEY}`,
            "Content-Type": "application/octet-stream"
          }
        }
      );

      const fileCID = uploadResponse.data.cid;
      const metaData = {
        name,
        description,
        image: `ipfs://${fileCID}`,
        properties: { country, collectionPoint, weight, price }
      };
      setMetaDataURl(`https://cherty.io/api/${fileCID}`);
      return { ...metaData, cid: fileCID };
    } catch (error) {
      setErrorMessage("Could not save Waste to Cherty - Aborted minting Waste.");
      console.log("Error uploading content to Cherty:", error);
    }
  };

  const sendTxToBlockchain = async (metadata) => {
    try {
      setTxStatus("Adding transaction to KEVM Polygon Testnet Blockchain.");
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);

      const price = ethers.utils.parseUnits(formInput.price, "ether");
      const connectedContract = new ethers.Contract(wastemarketplaceAddress, Waste.abi, provider.getSigner());
      
      const mintNFTTx = await connectedContract.createToken(`ipfs://${metadata.cid}`, price);
      return mintNFTTx;
    } catch (error) {
      setErrorMessage("Failed to send tx to ZKEVM Polygon Testnet.");
      console.log(error);
    }
  };

  const previewNFT = (metaData, mintNFTTx) => {
    const imgViewString = getIPFSGatewayURL(metaData.image);
    setImageView(imgViewString);
    setMetaDataURl(getIPFSGatewayURL(`ipfs://${metaData.cid}`));
    setTxURL(`https://testnet-zkevm.polygonscan.com/tx/${mintNFTTx.hash}`);
    setTxStatus("Waste registration was successful!");
  };

  const mintNFTToken = async (e, uploadedFile) => {
    e.preventDefault();
    const metaData = await uploadNFTContent(uploadedFile);
    const mintNFTTx = await sendTxToBlockchain(metaData);
    previewNFT(metaData, mintNFTTx);
    navigate("/explore");
  };

  const getIPFSGatewayURL = (ipfsURL) => {
    return ipfsURL.replace(/^ipfs:\/\//, "https://cherty.io/api/");
  };

  return (
    <>
      <div className="text-4xl text-center text-white font-bold mt-10">
        <h1> Register a waste</h1>
      </div>
      <div className="flex justify-center">
        <div className="w-1/2 flex flex-col pb-12 ">
          <select
            className="mt-5 border rounded p-4 text-xl"
            // value={this.state.value}
            onChange={(e) => updateFormInput({ ...formInput, name: e.target.value })}
          ><option value="select">Click to select type of waste</option>
            <option value="plastic">Plastic</option>
            <option value="paper">Paper</option>
            <option value="glass">Glass</option>
            <option value="electronics">Electronics</option>
            <option value="metals">Metals</option>
            <option value="batteries">Batteries</option>
            <option value="tyres">Tyres</option>
            <option value="clothing">Clothing</option>
            <option value="organic">Organic Materials</option>
            <option value="medical">Medical Waste</option>
          </select>
          <textarea
            placeholder="Description of waste"
            className="mt-5 border rounded p-4 text-xl"
            onChange={(e) => updateFormInput({ ...formInput, description: e.target.value })}
            rows={2}
          />
          <input
            placeholder="Enter your Country / Region"
            className="mt-5 border rounded p-4 text-xl"
            onChange={(e) => updateFormInput({ ...formInput, country: e.target.value })}
          />
          <input
            placeholder="Enter Address of Collecetion Point"
            className="mt-5 border rounded p-4 text-xl"
            onChange={(e) => updateFormInput({ ...formInput, collectionPoint: e.target.value })}
          />
          <input
            placeholder="Weight in Kg"
            className="mt-5 border rounded p-4 text-xl"
            onChange={(e) => updateFormInput({ ...formInput, weight: e.target.value })}
          />
          <input
            placeholder="Price in ETH, if free put 0"
            className="mt-5 border rounded p-4 text-xl"
            onChange={(e) => updateFormInput({ ...formInput, price: e.target.value })}
          />
          <br />

          <div className="MintNFT text-white text-xl">
            <form>
              <h3>Select a picture of the waste</h3>
              <input type="file" onChange={handleFileUpload} className="mt-5 border rounded p-4 text-xl" />
            </form>
            {txStatus && <p>{txStatus}</p>}
            <br />
            {metaDataURL && <p className="text-blue"><a href={metaDataURL} className="text-blue">Metadata on IPFS</a></p>}
            <br />
            {txURL && <p><a href={txURL} className="text-blue">See the mint transaction</a></p>}
            <br />
            {errorMessage}

            <br />
            {imageView && (
            <iframe
              className="mb-10"
              title="Ebook "
              src={imageView}
              alt="NFT preview"
              frameBorder="0"
              scrolling="auto"
              height="50%"
              width="100%"
            />
            )}

          </div>

          <button type="button" onClick={(e) => mintNFTToken(e, uploadedFile)} className="font-bold mt-20 bg-green-500 text-white text-2xl rounded p-4 shadow-lg">
            Register Item
          </button>
        </div>
      </div>
    </>

  );
};
export default MintWaste;
