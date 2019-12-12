import queryAPI from '../z_utils/queryAPI';

//----------------------------------------------------------------
const BEGIN = 'names___/BEGIN';
const SUCCESS = 'names___/SUCCESS';
const FAILURE = 'names___/FAILURE';

//----------------------------------------------------------------
const initialState = {
  names: [],
  isLoading: false,
  error: null
};

//----------------------------------------------------------------
export default (state = initialState, action) => {
  //console.log('names___', action, state);
  switch (action.type) {
    case BEGIN:
      return {
        ...state,
        isLoading: true
      };

    case SUCCESS:
      return {
        ...state,
        names: action.payload,
        isLoading: false,
        error: null
      };

    case FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.e
      };

    default:
      return state;
  }
};

//----------------------------------------------------------------
export const dispatcher_Names = () => {
  return (dispatch, getState) => {
    dispatch({
      type: BEGIN
    });

    return queryAPI(getState().getSettings.apiProvider, 'names', 'custom&expand')
      .then(async (res) => {
        let json = await res.json();
        console.log(json);
        dispatch({
          type: SUCCESS,
          payload: json
        });
        return json;
      })
      .catch((e) => {
        dispatch({
          type: FAILURE,
          e
        });
      });
  };
};