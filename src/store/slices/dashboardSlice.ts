import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

interface DashboardState {
  comments: Comment[];
  filteredComments: Comment[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
  };
  search: string;
  sort: {
    field: keyof Comment | null;
    direction: "asc" | "desc" | null;
  };
}

const initialState: DashboardState = {
  comments: [],
  filteredComments: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    pageSize: parseInt(sessionStorage.getItem("pageSize") || "10"),
    totalPages: 0,
  },
  search: sessionStorage.getItem("search") || "",
  sort: {
    field: sessionStorage.getItem("sortField") as keyof Comment | null,
    direction: sessionStorage.getItem("sortDirection") as "asc" | "desc" | null,
  },
};

// Fetch comments
export const fetchComments = createAsyncThunk(
  "dashboard/fetchComments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/comments"
      );
      if (!response.ok) throw new Error("Failed to fetch comments");
      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.pagination.currentPage = action.payload;
      sessionStorage.setItem("currentPage", action.payload.toString());
    },
    setPageSize: (state, action) => {
      state.pagination.pageSize = action.payload;
      state.pagination.currentPage = 1;
      sessionStorage.setItem("pageSize", action.payload.toString());
    },
    setSearch: (state, action) => {
      state.search = action.payload;
      state.pagination.currentPage = 1;
      sessionStorage.setItem("search", action.payload);
    },
    setSort: (state, action) => {
      const { field } = action.payload;

      if (state.sort.field === field) {
        // Cycle through sort states
        if (state.sort.direction === "asc") {
          state.sort.direction = "desc";
        } else if (state.sort.direction === "desc") {
          state.sort.field = null;
          state.sort.direction = null;
        } else {
          state.sort.direction = "asc";
        }
      } else {
        state.sort.field = field;
        state.sort.direction = "asc";
      }

      if (state.sort.field && state.sort.direction) {
        sessionStorage.setItem("sortField", state.sort.field);
        sessionStorage.setItem("sortDirection", state.sort.direction);
      } else {
        sessionStorage.removeItem("sortField");
        sessionStorage.removeItem("sortDirection");
      }
    },
    applyFilters: (state) => {
      let filtered = [...state.comments];

      // Apply search
      if (state.search) {
        const searchLower = state.search.toLowerCase();
        filtered = filtered.filter(
          (comment) =>
            comment.name.toLowerCase().includes(searchLower) ||
            comment.email.toLowerCase().includes(searchLower) ||
            comment.body.toLowerCase().includes(searchLower)
        );
      }

      // Apply sort
      if (state.sort.field && state.sort.direction) {
        filtered.sort((a, b) => {
          const aValue = a[state.sort.field!];
          const bValue = b[state.sort.field!];

          if (typeof aValue === "string" && typeof bValue === "string") {
            return state.sort.direction === "asc"
              ? aValue.localeCompare(bValue)
              : bValue.localeCompare(aValue);
          }

          return state.sort.direction === "asc"
            ? (aValue as number) - (bValue as number)
            : (bValue as number) - (aValue as number);
        });
      }

      state.filteredComments = filtered;
      state.pagination.totalPages = Math.ceil(
        filtered.length / state.pagination.pageSize
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchComments.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchComments.fulfilled, (state, action) => {
      state.loading = false;
      state.comments = action.payload;
      state.filteredComments = action.payload;
      state.pagination.totalPages = Math.ceil(
        action.payload.length / state.pagination.pageSize
      );
    });
    builder.addCase(fetchComments.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { setPage, setPageSize, setSearch, setSort, applyFilters } =
  dashboardSlice.actions;
export default dashboardSlice.reducer;
