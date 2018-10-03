// actions constants
export const LOAD_DATA = 'LOAD_DATA';

export const ADD_WORDGROUP = 'ADD_WORDGROUP';

export const DELETE_WORDGROUP = 'DELETE_WORDGROUP';

export const TOGGLE_STATUS = 'TOGGLE_STATUS';

export const EDIT_WORDGROUP = 'EDIT_WORDGROUP';

// component constants

export const errWordGroupName = 'Please enter a valid word group name';
export const errServerConnection = 'The server connection failed';
export const existingGroupNameErr = 'This group name already exists!';
export const newWordGroupName = 'New group 1';

// user const from local storage
export const user = JSON.parse(localStorage.getItem('userInfo'));
