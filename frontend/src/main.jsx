import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react'
import './index.css'
import App from './App.jsx'

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