/* eslint-disable react/no-unescaped-entities */
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react'
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Separator } from "../ui/separator"
import Rizz from "../../assets/images/rizz.jpg"
import { loginUser } from "@/api/apiUser"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await loginUser(username, password)
      navigate("/") 
    } catch (err) {
      console.error("Login error:", err)
      setError("Invalid username or password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl grid md:grid-cols-2 overflow-hidden shadow-xl border-0 rounded-2xl">
        <div className="p-8 sm:p-10">
          <CardHeader className="p-0 mb-8">
            <div className="mb-2">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Lock className="h-5 w-5 text-primary" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-primary-900">Welcome back</CardTitle>
            <CardDescription className="text-primary-500 mt-2 text-base">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0 space-y-6">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-400 transition-colors group-focus-within:text-primary" />
                  <Input
                    type="text"
                    placeholder="Username"
                    className="pl-10 h-12 bg-primary-50/50 border-primary-200 focus-visible:ring-primary-200 focus-visible:border-primary-300 transition-all rounded-xl"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-400 transition-colors group-focus-within:text-primary" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="pl-10 pr-10 h-12 bg-primary-50/50 border-primary-200 focus-visible:ring-primary-200 focus-visible:border-primary-300 transition-all rounded-xl"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-400 hover:text-primary-600 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm flex items-center">
                  <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-xl transition-all shadow-md hover:shadow-lg"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    Sign in
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>

            <div className="flex items-center gap-2 py-2">
              <Separator className="flex-1 bg-primary-200/50" />
              <span className="text-xs text-primary-400 font-medium">OR</span>
              <Separator className="flex-1 bg-primary-200/50" />
            </div>

            <div className="text-center pt-2">
              <p className="text-sm text-primary-500">
                Don't have an account?{" "}
                <Link to="/register" className="font-medium text-primary-700 hover:text-primary transition-colors hover:underline">
                  Create account
                </Link>
              </p>
            </div>
          </CardContent>
        </div>

        <div className="relative bg-primary-900 overflow-hidden hidden md:block">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-800/90 to-primary-900/90 z-10"></div>
          <img
            src={Rizz || "/placeholder.svg"}
            alt="Login illustration"
            className="h-full w-full object-cover"
          />
          <div className="absolute bottom-8 left-8 right-8 z-20">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
              <h3 className="text-white text-lg font-medium mb-2">Admin Dashboard</h3>
              <p className="text-white/80 text-sm">
                Secure access to your administration panel with enhanced features and controls.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
