import api from "@/utils/api";

export const getAllPictures = async () => {
  try {
    const response = await api.get("upload/posts");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    throw error;
  }
};
