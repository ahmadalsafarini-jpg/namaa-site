import { StrictMode } from 'react'
import { hydrateRoot, createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'

function ConfigErrorScreen({ message }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl border-2 border-amber-200 p-8">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 text-2xl">
            ⚠️
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 mb-2">Configuration required</h1>
            <p className="text-slate-700 mb-4">{message}</p>
            <div className="text-sm text-slate-600 space-y-2">
              <p><strong>Local:</strong> Copy <code className="bg-slate-100 px-1 rounded">env-template.txt</code> to <code className="bg-slate-100 px-1 rounded">.env</code>, fill in values, then restart <code className="bg-slate-100 px-1 rounded">npm run dev</code>.</p>
              <p><strong>Vercel:</strong> Add the same variables in Project → Settings → Environment Variables, then redeploy. See <code className="bg-slate-100 px-1 rounded">VERCEL_ENV_SETUP.md</code>.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const rootElement = document.getElementById('root')

async function bootstrap() {
  let App
  try {
    App = (await import('./App.jsx')).default
  } catch (err) {
    const msg = err?.message || String(err)
    if (msg.includes('Missing required Firebase') || msg.includes('env vars')) {
      const root = createRoot(rootElement)
      root.render(<ConfigErrorScreen message={msg} />)
      return
    }
    throw err
  }

  const app = (
    <StrictMode>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </StrictMode>
  )

  if (rootElement.hasChildNodes()) {
    hydrateRoot(rootElement, app)
  } else {
    createRoot(rootElement).render(app)
  }
}

bootstrap().catch((err) => {
  console.error('App failed to load:', err)
  if (rootElement) {
    createRoot(rootElement).render(
      <ConfigErrorScreen message={err?.message || 'Application failed to start.'} />
    )
  }
})
