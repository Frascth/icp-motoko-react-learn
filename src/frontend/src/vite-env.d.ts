/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly DFX_VERSION:string,
    readonly DFX_NETWORK:string,
    readonly CANISTER_ID_AUTHENTICATION:string,
    readonly CANISTER_ID_FRONTEND:string,
    readonly CANISTER_ID_VOTE:string,
    readonly CANISTER_ID:string,
    readonly CANISTER_CANDID_PATH:string,
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}