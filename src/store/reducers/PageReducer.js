import * as Types from "../actions/types";


const PageReducer = (state = {
   faqs: [],
   singles: [],
   about: {},
   contact: {},
}, action) => {
   switch (action.type) {
      case Types.LOAD_FAQ: {
         return {...state, faqs: action.payload.faqs};
      }
      case Types.LOAD_SINGLE: {
         return {...state, singles: action.payload.singles};
      }
      case Types.LOAD_ABOUT: {
         return {...state, about: action.payload.about};
      }
      case Types.LOAD_CONTACT: {
         return {...state, contact: action.payload.contact};
      }
      default:
         return state;
   }
};

export default PageReducer;