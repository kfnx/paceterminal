export const ANALYTICS_EVENTS = {
  // User interactions
  BUTTON_CLICK: 'button_click',
  FORM_SUBMIT: 'form_submit',
  LINK_CLICK: 'link_click',
  MODAL_OPEN: 'modal_open',
  MODAL_CLOSE: 'modal_close',

  // Authentication
  LOGIN_ATTEMPT: 'login_attempt',
  LOGIN_SUCCESS: 'login_success',
  LOGIN_FAILURE: 'login_failure',
  REGISTER_ATTEMPT: 'register_attempt',
  REGISTER_SUCCESS: 'register_success',
  REGISTER_FAILURE: 'register_failure',
  LOGOUT: 'logout',

  // Wallet interactions
  WALLET_CONNECT: 'wallet_connect',
  WALLET_DISCONNECT: 'wallet_disconnect',
  TRANSACTION_INITIATED: 'transaction_initiated',
  TRANSACTION_SUCCESS: 'transaction_success',
  TRANSACTION_FAILURE: 'transaction_failure',

  // Feature usage
  FEATURE_ACCESS: 'feature_access',
  WIDGET_INTERACTION: 'widget_interaction',
  SEARCH_PERFORMED: 'search_performed',

  // Error tracking
  ERROR_OCCURRED: 'error_occurred',
  API_ERROR: 'api_error',

  // Performance
  PAGE_LOAD_TIME: 'page_load_time',
  COMPONENT_LOAD_TIME: 'component_load_time',
} as const;

export const ANALYTICS_CATEGORIES = {
  USER_INTERACTION: 'user_interaction',
  AUTHENTICATION: 'authentication',
  WALLET: 'wallet',
  FEATURE: 'feature',
  ERROR: 'error',
  PERFORMANCE: 'performance',
} as const;

export const ANALYTICS_LABELS = {
  // Button types
  PRIMARY_BUTTON: 'primary_button',
  SECONDARY_BUTTON: 'secondary_button',
  ICON_BUTTON: 'icon_button',

  // Form types
  LOGIN_FORM: 'login_form',
  REGISTER_FORM: 'register_form',
  RESET_PASSWORD_FORM: 'reset_password_form',

  // Modal types
  CONFIRMATION_MODAL: 'confirmation_modal',
  SETTINGS_MODAL: 'settings_modal',
  INFO_MODAL: 'info_modal',

  // Wallet types
  SOLANA_WALLET: 'solana_wallet',
  PHANTOM_WALLET: 'phantom_wallet',
  SOLFLARE_WALLET: 'solflare_wallet',

  // Feature types
  DASHBOARD: 'dashboard',
  TRANSACTIONS: 'transactions',
  WALLETS: 'wallets',
  SETTINGS: 'settings',
} as const;
