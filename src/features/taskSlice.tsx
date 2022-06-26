import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { RootState, AppThunk } from '../../app/store';


export interface TaskState {
    id: string,
    text: string,
    status: 'new' | 'done'
}

const initialState: TaskState[] = []

export const taskSlice = createSlice({
    name: 'task',
    initialState: initialState,
    reducers: {
        submitTask: (state, action: PayloadAction<TaskState>) => {
            state.push(action.payload);
            return state;
        },
        doneTask: (state, action: PayloadAction<TaskState>) => {
            const objIndex = state.findIndex((item: TaskState) => item.id === action.payload.id);
            state[objIndex].status = 'done';
            return state;
        },
        removeTask: (state, action: PayloadAction<TaskState>) => {
            const newState = state.filter((item: TaskState) => {
                return item.id !== action.payload.id
            });
            return newState;
        }
    }

});

export const { submitTask, doneTask, removeTask } = taskSlice.actions;
export default taskSlice.reducer;