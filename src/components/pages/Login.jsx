/* eslint-disable react/no-unescaped-entities */
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Eye, EyeOff, Mail, Lock, ArrowRight} from "lucide-react"
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
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl grid md:grid-cols-2 overflow-hidden shadow-xl">
        <div className="p-6 sm:p-8">
          <CardHeader className="p-0 mb-6">
            <CardTitle className="text-2xl font-bold text-slate-900">Welcome back</CardTitle>
            <CardDescription className="text-slate-500 mt-2">Sign in to your account to continue</CardDescription>
          </CardHeader>

          <CardContent className="p-0 space-y-4">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    type="test"
                    placeholder="Username"
                    className="pl-10 bg-slate-50 border-slate-200 focus-visible:ring-slate-200"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="pl-10 pr-10 bg-slate-50 border-slate-200 focus-visible:ring-slate-200"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white" disabled={loading}>
                {loading ? "Signing in..." : (
                  <>
                    Sign in
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="flex items-center gap-2 py-2">
              <Separator className="flex-1" />
              <span className="text-xs text-slate-400 font-medium">OR</span>
              <Separator className="flex-1" />
            </div>

            <div className="text-center pt-4">
              <p className="text-sm text-slate-500">
                Don't have an account?{" "}
                <Link to="/register" className="font-medium text-slate-900 hover:underline">
                  Create account
                </Link>
              </p>
            </div>
          </CardContent>
        </div>

        <div className="hidden md:block relative bg-slate-900">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800/80 to-slate-900/90 z-10" />
          <img
            src={Rizz}
            alt="Login illustration"
            width={600}
            height={800}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col justify-center p-10 z-20">
            <blockquote className="text-white">
              <p className="text-xl font-medium italic mb-4">
                "The application has streamlined our workflow and increased productivity by 50%."
              </p>
              <footer className="text-sm text-slate-300">
                <strong>Sarah Johnson</strong> — Product Manager
              </footer>
            </blockquote>
          </div>
        </div>
      </Card>
    </div>
  )
}