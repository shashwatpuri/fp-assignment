import { useState } from "react"
import { useAuthContext } from "../contexts/authContext"
import { CheckCircle2Icon, Eye, EyeOff } from "lucide-react"
import { Navigate } from "react-router-dom"

function Signup() {
  const { isAuthenticated, loading } = useAuthContext()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSignupSuccessMessage, setShowSignupSuccessMessage] = useState(false)
  const [error, setError] = useState("")

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-fixed" style={{ backgroundImage: `url('/backdrop.png')` }}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  )

  if (isAuthenticated)
    return <Navigate to={"/music"} replace />

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch(`${apiBaseUrl}/api/unauth/signup`, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, name }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Signup failed")
      }

      setShowSignupSuccessMessage(true)
      setTimeout(() => {
        window.location.href = "/signin"
      }, 3000);

    } catch (err: any) {
      setError(err.message || "An error occurred during signin")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isAuthenticated)
    return <Navigate to={"/music"} replace />

  return (
    <div className="px-2 min-h-screen flex items-center justify-center bg-cover bg-center bg-fixed" style={{ backgroundImage: `url('/backdrop.png')` }}>
      <div className="max-w-md w-full bg-black/30 backdrop-blur-lg rounded-2xl border border-white/10 shadow-lg p-8">
        <div>
          <h2 className="mt-2 text-center text-3xl font-bold text-white drop-shadow">Create your account</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-transparent transition-all"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-transparent transition-all"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 pr-10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/80 mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 pr-10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-transparent transition-all"
                  placeholder="Confirm your password"
                />
              </div>
            </div>
          </div>
          {error && (
            <div className="rounded-md bg-red-500/10 p-4 border border-red-500/20 text-red-400 text-center">
              <h3 className="text-sm font-medium">{error}</h3>
            </div>
          )}
          {showSignupSuccessMessage && (
            <div className="rounded-md p-4 bg-green-500/10 border border-green-500/20 text-green-400 text-center w-full flex gap-2 items-center justify-center">
              <CheckCircle2Icon className="size-5" />
              <h3 className="text-sm">Signup successful. Redirecting</h3>
            </div>
          )}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-black/30 text-white font-semibold py-2 px-4 shadow hover:bg-black/50 border border-white/20 transition-all disabled:opacity-60"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing up...
                </div>
              ) : (
                "Sign up"
              )}
            </button>
          </div>
          <div className="text-center mt-2">
            <p className="text-sm text-white/60">
              Already have an account?{' '}
              <a href="/signin" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">Sign in</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Signup