import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { roomService } from '../../services/Api';

export const fetchRooms = createAsyncThunk('rooms/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const res = await roomService.getRooms(params);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchRoom = createAsyncThunk('rooms/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const res = await roomService.getRoom(id);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchFeaturedRooms = createAsyncThunk('rooms/featured', async (_, { rejectWithValue }) => {
  try {
    const res = await roomService.getFeatured();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const roomSlice = createSlice({
  name: 'rooms',
  initialState: {
    rooms: [],
    featuredRooms: [],
    currentRoom: null,
    pagination: null,
    loading: false,
    error: null,
    filters: {
      city: '',
      minPrice: '',
      maxPrice: '',
      roomType: '',
      capacity: '',
      search: '',
    },
  },
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters(state) {
      state.filters = { city: '', minPrice: '', maxPrice: '', roomType: '', capacity: '', search: '' };
    },
    clearCurrentRoom(state) {
      state.currentRoom = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRooms.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = action.payload.rooms;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchRoom.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRoom = action.payload.room;
      })
      .addCase(fetchRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchFeaturedRooms.fulfilled, (state, action) => {
        state.featuredRooms = action.payload.rooms;
      });
  },
});

export const { setFilters, clearFilters, clearCurrentRoom } = roomSlice.actions;
export default roomSlice.reducer;
