import { ethers, BrowserProvider } from "ethers";
import contractAbi from "../abi.json";

const CONTRACT_ADDRESS = "0x8539b95152A3A2F4EAaFff17F1613396997bD6f2";

export const useBuy = () => {
  const buyStory = async (tokenId: number, price: string) => {
    try {
      if (!(window as any).ethereum) throw new Error("MetaMask not found");

      const provider = new BrowserProvider((window as any).ethereum);
    
      await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
      
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi, signer);

      const tx = await contract.buyStory(tokenId, {
        value: ethers.parseEther(price)
      });

      await tx.wait();
      alert("Purchase successful!");
    } catch (error: any) {
      if (error.code === 4001) {
        alert("Transaction canceled. Please connect your wallet to buy.");
      } else {
        console.error("Buy error:", error);
      }
    }
  };

  return { buyStory };
};