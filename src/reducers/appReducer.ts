import { Recipe, Category } from '../types';

export type ViewType = 'intro' | 'main' | 'categories' | 'list' | 'detail';

export type AppState = {
  view: ViewType;
  layoutMode: 'grid' | 'list';
  isPrinting: boolean;
  selectedRecipe: Recipe | null;
  searchTerm: string;
  selectedCategory: Category | 'All' | 'Favorites';
  showAddModal: boolean;
  editingRecipe: Recipe | null;
  mobileMenuOpen: boolean;
  showSuccessToast: boolean;
  isSearchFocused: boolean;
  activeSuggestion: number;
  showDataExport: boolean;
  searchResults: Recipe[] | null;
  error: string | null;
};

export const initialState: AppState = {
  view: 'intro',
  layoutMode: 'grid',
  isPrinting: false,
  selectedRecipe: null,
  searchTerm: '',
  selectedCategory: 'All',
  showAddModal: false,
  editingRecipe: null,
  mobileMenuOpen: false,
  showSuccessToast: false,
  isSearchFocused: false,
  activeSuggestion: -1,
  showDataExport: false,
  searchResults: null,
  error: null,
};

export type AppAction =
  | { type: 'SET_VIEW'; payload: ViewType }
  | { type: 'SET_LAYOUT_MODE'; payload: AppState['layoutMode'] }
  | { type: 'SET_IS_PRINTING'; payload: AppState['isPrinting'] }
  | { type: 'SET_SELECTED_RECIPE'; payload: AppState['selectedRecipe'] }
  | { type: 'SET_SEARCH_TERM'; payload: AppState['searchTerm'] }
  | { type: 'SET_SELECTED_CATEGORY'; payload: AppState['selectedCategory'] }
  | { type: 'SET_SHOW_ADD_MODAL'; payload: AppState['showAddModal'] }
  | { type: 'SET_EDITING_RECIPE'; payload: AppState['editingRecipe'] }
  | { type: 'SET_MOBILE_MENU_OPEN'; payload: AppState['mobileMenuOpen'] }
  | { type: 'SET_SHOW_SUCCESS_TOAST'; payload: AppState['showSuccessToast'] }
  | { type: 'SET_IS_SEARCH_FOCUSED'; payload: AppState['isSearchFocused'] }
  | { type: 'SET_ACTIVE_SUGGESTION'; payload: AppState['activeSuggestion'] }
  | { type: 'SET_SHOW_DATA_EXPORT'; payload: AppState['showDataExport'] }
  | { type: 'SET_SEARCH_RESULTS'; payload: AppState['searchResults'] }
  | { type: 'SET_ERROR'; payload: AppState['error'] }
  | { type: 'SELECT_CATEGORY'; payload: Category | 'All' | 'Favorites' }
  | { type: 'DELETE_RECIPE' }
  | { type: 'CHANGE_SEARCH'; payload: string };



export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, view: action.payload, mobileMenuOpen: false };
    case 'SET_LAYOUT_MODE':
      return { ...state, layoutMode: action.payload };
    case 'SET_IS_PRINTING':
      return { ...state, isPrinting: action.payload };
    case 'SET_SELECTED_RECIPE':
      return { ...state, selectedRecipe: action.payload };
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    case 'SET_SELECTED_CATEGORY':
    case 'SELECT_CATEGORY':
      return { ...state, selectedCategory: action.payload, mobileMenuOpen: false };
    case 'SET_SHOW_ADD_MODAL':
      return { ...state, showAddModal: action.payload };
    case 'SET_EDITING_RECIPE':
      return { ...state, editingRecipe: action.payload, showAddModal: action.payload !== null };
    case 'SET_MOBILE_MENU_OPEN':
      return { ...state, mobileMenuOpen: action.payload };
    case 'SET_SHOW_SUCCESS_TOAST':
      return { ...state, showSuccessToast: action.payload };
    case 'SET_IS_SEARCH_FOCUSED':
      return { ...state, isSearchFocused: action.payload };
    case 'SET_ACTIVE_SUGGESTION':
      return { ...state, activeSuggestion: action.payload };
    case 'SET_SHOW_DATA_EXPORT':
      return { ...state, showDataExport: action.payload };
    case 'SET_SEARCH_RESULTS':
      return { ...state, searchResults: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'DELETE_RECIPE':
      return { ...state, selectedRecipe: null };
    case 'CHANGE_SEARCH':
      return { ...state, searchTerm: action.payload, activeSuggestion: -1, searchResults: null };
    default:
      return state;
  }
}