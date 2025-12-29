import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getMenuCategories,
  createMenuCategory,
  deleteMenuCategory,
  createMenuDish,
  deleteMenuDish,
} from "../../https";

const mapCategory = (category) => ({
  id: category.id,
  name: category.name,
  bgColor: category.bgColor ?? "#f4f4f5",
  icon: category.icon ?? "*",
  items: (category.items || []).map((dish) => ({
    id: dish.id,
    name: dish.name,
    price: dish.price,
    type: dish.type,
    image: dish.image,
  })),
});

export const fetchMenuCategories = createAsyncThunk(
  "menu/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await getMenuCategories();
      return data.data.map(mapCategory);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "No se pudieron cargar las categorías");
    }
  }
);

export const createCategory = createAsyncThunk(
  "menu/createCategory",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await createMenuCategory(payload);
      return mapCategory(data.data);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "No se pudo crear la categoría");
    }
  }
);

export const removeCategoryById = createAsyncThunk(
  "menu/removeCategory",
  async (categoryId, { rejectWithValue }) => {
    try {
      await deleteMenuCategory(categoryId);
      return categoryId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "No se pudo eliminar la categoría");
    }
  }
);

export const createDish = createAsyncThunk(
  "menu/createDish",
  async ({ categoryId, name, price, type, image }, { rejectWithValue }) => {
    try {
      const { data } = await createMenuDish({ categoryId, name, price, type, image });
      return {
        categoryId: data.data.categoryId,
        dish: {
          id: data.data.id,
          name: data.data.name,
          price: data.data.price,
          type: data.data.type,
          image: data.data.image,
        },
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "No se pudo crear el plato");
    }
  }
);

export const removeDishById = createAsyncThunk(
  "menu/removeDish",
  async ({ categoryId, dishId }, { rejectWithValue }) => {
    try {
      await deleteMenuDish({ categoryId, dishId });
      return { categoryId, dishId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "No se pudo eliminar el plato");
    }
  }
);

const menuSlice = createSlice({
  name: "menu",
  initialState: {
    categories: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenuCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMenuCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchMenuCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push({ ...action.payload, items: [] });
      })
      .addCase(removeCategoryById.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          (category) => category.id !== action.payload
        );
      })
      .addCase(createDish.fulfilled, (state, action) => {
        const category = state.categories.find((cat) => cat.id === action.payload.categoryId);
        if (category) {
          category.items.push(action.payload.dish);
        }
      })
      .addCase(removeDishById.fulfilled, (state, action) => {
        const { categoryId, dishId } = action.payload;
        const category = state.categories.find((cat) => cat.id === categoryId);
        if (category) {
          category.items = category.items.filter((dish) => dish.id !== dishId);
        }
      });
  },
});

export default menuSlice.reducer;
