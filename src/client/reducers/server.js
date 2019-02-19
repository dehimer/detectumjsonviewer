const defaultState = {
  results: {}
};

export default function reducer(state = defaultState, action) {
  const { type, data } = action;

  switch (type) {
    case 'json':
      return { ...state, json: data };
    default:
      return state;
  }
}
