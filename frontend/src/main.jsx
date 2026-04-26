import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react'
import './index.css'
import App from './App.jsx'

/**
 * ============================================================================
 * SWITCHING BACK TO ORIGINAL AUTH0
 * ============================================================================
 * To switch between the testing Auth0 Sandbox and the the other Auth0 account,
 * you must complete these three steps:
 * * STEP 1: FRONTEND (main.jsx)
 * Update the 'domain' and 'clientId' in the <Auth0Provider> below.
 * * --- PRODUCTION KEYS (Groupmate) ---
 * Domain: dev-evpwqsgmn03lqsfk.us.auth0.com
 * ClientId: SeOofXeNJOUQSgA7uGbBnFSgl7pJhWej
 * 
 * 
 * * --- SANDBOX KEYS (Richard - Currently Active) ---
 * Domain: dev-xw5vht1v7asa2qsb.us.auth0.com
 * ClientId: lr6m3WjVxb2AjNbz8LDFSahjCszu8sED
 * * ----------------------------------------------------------------------------
 * STEP 2: BACKEND (Render Dashboard done by ME)
 * Go to Render -> Web Service -> Environment and update the variables:
 * 1. AUTH0_DOMAIN:   (Match the groupmates Domain above)
 * 2. AUTH0_AUDIENCE: https://api.syllabixtract.com
 * * ----------------------------------------------------------------------------
 * STEP 3: AUTH0 DASHBOARD (Must be done in the target account)
 * 1. APPLICATIONS -> Settings: Add "http://localhost:5173, https://syllabi-xtract.vercel.app" to:
 * - Allowed Callback URLs
 * - Allowed Logout URLs
 * - Allowed Web Origins
 * 2. APIs: Ensure an API exists with Identifier: "https://api.syllabixtract.com"
 * 3. APIs -> Authorized Applications: Toggle the Frontend App to "Authorized"
 * ============================================================================
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Auth0Provider
      domain="dev-xw5vht1v7asa2qsb.us.auth0.com"
      clientId="lr6m3WjVxb2AjNbz8LDFSahjCszu8sED"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: "https://api.syllabixtract.com"
      }}
    >
      <App />
    </Auth0Provider>
  </StrictMode>,
)