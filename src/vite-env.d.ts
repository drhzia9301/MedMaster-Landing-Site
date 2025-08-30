/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_FIREBASE_API_KEY: string
  readonly VITE_FIREBASE_AUTH_DOMAIN: string
  readonly VITE_FIREBASE_PROJECT_ID: string
  readonly VITE_FIREBASE_STORAGE_BUCKET: string
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string
  readonly VITE_FIREBASE_APP_ID: string
  readonly VITE_APP_ENV: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Trusted Types API declarations
interface TrustedHTML {
  readonly __brand: 'TrustedHTML'
}

interface TrustedScript {
  readonly __brand: 'TrustedScript'
}

interface TrustedScriptURL {
  readonly __brand: 'TrustedScriptURL'
}

interface TrustedTypePolicyOptions {
  createHTML?: (input: string) => string
  createScript?: (input: string) => string
  createScriptURL?: (input: string) => string
}

interface TrustedTypePolicy {
  readonly name: string
  createHTML(input: string): TrustedHTML
  createScript(input: string): TrustedScript
  createScriptURL(input: string): TrustedScriptURL
}

interface TrustedTypePolicyFactory {
  createPolicy(policyName: string, policyOptions?: TrustedTypePolicyOptions): TrustedTypePolicy
  isHTML(value: any): value is TrustedHTML
  isScript(value: any): value is TrustedScript
  isScriptURL(value: any): value is TrustedScriptURL
  readonly emptyHTML: TrustedHTML
  readonly emptyScript: TrustedScript
  getAttributeType(tagName: string, attribute: string): string | null
  getPropertyType(tagName: string, property: string): string | null
  readonly defaultPolicy: TrustedTypePolicy | null
}

interface Window {
  trustedTypes?: TrustedTypePolicyFactory
}