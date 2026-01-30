import { useState, useEffect, useCallback } from "react";
import { ethers, JsonRpcProvider, Contract } from "ethers";
import contractAbi from "../abi.json";

const CONTRACT_ADDRESS = "0x8539b95152A3A2F4EAaFff17F1613396997bD6f2";
const RPC_URL = "https://rpc-amoy.polygon.technology";

export const useGallery = () => {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStories = useCallback(async () => {
    setLoading(true);
    try {
      const provider = new JsonRpcProvider(RPC_URL);
      const contract = new Contract(CONTRACT_ADDRESS, contractAbi, provider);

      const code = await provider.getCode(CONTRACT_ADDRESS);
      if (code === "0x") {
        console.error(
          "No contract found at this address. Check your CONTRACT_ADDRESS!",
        );
        setLoading(false);
        return;
      }

      const totalCount = await contract.nextTokenId();
      const total = Number(totalCount);

      let items = [];
      for (let i = 0; i < total; i++) {
        try {
          const uri = await contract.tokenURI(i);
          const metadataUrl = uri.replace(
            "ipfs://",
            "https://gateway.pinata.cloud/ipfs/",
          );

          const response = await fetch(metadataUrl);
          const meta = await response.json();

          items.push({
            id: i,
            name: meta.name || `Story #${i}`,
            description: meta.description,
            content: meta.content,
            image: `https://api.dicebear.com/7.x/bottts/svg?seed=${i}`,
          });
        } catch (innerErr) {
          console.error(`Error fetching metadata for ID ${i}:`, innerErr);
        }
      }
      setStories(items.reverse());
    } catch (err) {
      console.error("Gallery Sync Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  return { stories, loading, refresh: fetchStories };
};
