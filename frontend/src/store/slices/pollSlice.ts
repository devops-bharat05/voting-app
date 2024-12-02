import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Poll {
  id: string;
  title: string;
  options: Array<{
    id: string;
    text: string;
    votes: number;
  }>;
  createdBy: string;
  endDate: string;
}

interface PollState {
  polls: Poll[];
  activePoll: Poll | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: PollState = {
  polls: [],
  activePoll: null,
  isLoading: false,
  error: null,
};

const pollSlice = createSlice({
  name: 'polls',
  initialState,
  reducers: {
    setPolls: (state, action: PayloadAction<Poll[]>) => {
      state.polls = action.payload;
    },
    setActivePoll: (state, action: PayloadAction<Poll>) => {
      state.activePoll = action.payload;
    },
    addPoll: (state, action: PayloadAction<Poll>) => {
      state.polls.push(action.payload);
    },
    updatePoll: (state, action: PayloadAction<Poll>) => {
      const index = state.polls.findIndex(poll => poll.id === action.payload.id);
      if (index !== -1) {
        state.polls[index] = action.payload;
      }
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { setPolls, setActivePoll, addPoll, updatePoll, setError, clearError } = pollSlice.actions;
export default pollSlice.reducer;