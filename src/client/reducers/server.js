const defaultState = {
  results: {}
};

export default function reducer(state = defaultState, action) {
  console.log('action');
  console.log(action);
  const { type, data } = action;

  switch (type) {
    case 'json':
      return { ...state, json: data };
    default:
      return state;
  }
}
