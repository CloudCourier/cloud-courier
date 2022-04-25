import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Subject } from '@/types/subject';

interface State {
  logo: string | undefined;
  projectModalOpen: boolean;
  subjects: Subject[];
  modalModel: null;
  id: number;
  token: string;
}
const initialState: State = {
  logo: undefined,
  projectModalOpen: false,
  subjects: [],
  modalModel: null,
  id: undefined,
  token: undefined,
};

export const subjectSlice = createSlice({
  name: 'subjectSlice',
  initialState,
  reducers: {
    openProjectModal(state, action) {
      state.projectModalOpen = true;
      state.modalModel = action.payload;
    },
    closeProjectModal(state) {
      state.projectModalOpen = false;
      state.logo = undefined;
    },
    setProjectList(state, action: PayloadAction<Subject[]>) {
      state.subjects = action.payload;
    },
    setLogo(state, action) {
      state.logo = action.payload;
    },
    setSubjectId(state, action) {
      state.id = action.payload;
    },
    setToken(state, action) {
      state.token = action.payload;
    },
  },
});
export const {
  openProjectModal,
  closeProjectModal,
  setProjectList,
  setLogo,
  setSubjectId,
  setToken,
} = subjectSlice.actions;

export default subjectSlice.reducer;
