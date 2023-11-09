import * as Types from "../actions/types";

const InitReducer = (
  state = {
    menus: [],
    categories: [],
    banners: [],
    general: "{}",
  },
  action
) => {
  switch (action.type) {
    case Types.LOAD_GENERAL: {
      return { ...state, general: action.payload.general };
    }
    case Types.LOAD_BANNER: {
      return { ...state, banners: action.payload.banners };
    }
    case Types.LOAD_CATEGORIES: {
      return { ...state, categories: action.payload.categories };
    }
    case Types.LOAD_MENUS: {
      return { ...state, menus: action.payload.menus };
    }
    default:
      return state;
  }
};

export default InitReducer;
