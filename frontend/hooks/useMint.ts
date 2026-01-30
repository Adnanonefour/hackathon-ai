import axios from "axios";
import { useState } from "react";

export const useMint = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const mintStory = async (title: string, story: string) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/verify-and-mint`,
        {
          story_text: story, 
          title: title,
        },
      );

      setResult(response.data);
      return { success: true, data: response.data };
    } catch (error: any) {
      const errorDetail = error.response?.data?.detail || "Server logic error";
      console.error("Backend Error:", errorDetail);

      return {
        success: false,
        error: errorDetail,
      };
    } finally {
      setLoading(false);
    }
  };

  return { mintStory, loading, result };
};
