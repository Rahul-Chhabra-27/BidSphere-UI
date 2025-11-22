import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

export interface Category {
  id: number;
  name: string;
}

const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const res = await axios.get(`${API_BASE_URL}/categories/`);
    return res.data.data ?? res.data;
  },
};

export default categoryService;
