import { createSlice} from '@reduxjs/toolkit'


export const slice = createSlice({
  name:'E-learning-Slice',
  initialState:{},
  reducers:{
    setUser:(state,action)=>{
      state.user=action.payload;
    }
  }
})


