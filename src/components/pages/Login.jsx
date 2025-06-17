import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff, Lock, ArrowRight, User } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
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
      navigate("/analytics")
    } catch (err) {
      console.error("Login error:", err)
      setError("Invalid username or password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-[#4bb3ba]/10 via-white to-[#18446a]/10">
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-r from-[#4bb3ba]/20 to-[#18446a]/20 -skew-y-6 transform-gpu" />
      <div className="absolute bottom-0 right-0 w-full h-64 bg-gradient-to-l from-[#18446a]/20 to-[#4bb3ba]/20 skew-y-6 transform-gpu" />

      <div className="absolute top-20 left-[20%] h-40 w-40 rounded-full border-2 border-[#4bb3ba]/30 opacity-60" />
      <div className="absolute top-40 left-[25%] h-20 w-20 rounded-full border-2 border-[#18446a]/30 opacity-60" />
      <div className="absolute bottom-20 right-[20%] h-40 w-40 rounded-full border-2 border-[#18446a]/30 opacity-60" />
      <div className="absolute bottom-40 right-[25%] h-20 w-20 rounded-full border-2 border-[#4bb3ba]/30 opacity-60" />

      <div className="absolute top-[10%] left-[10%] h-32 w-32 rounded-full bg-[#4bb3ba]/20 blur-xl" />
      <div className="absolute bottom-[10%] right-[10%] h-32 w-32 rounded-full bg-[#18446a]/20 blur-xl" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#18446a] tracking-tight">Admin Portal</h1>
          <p className="text-[#4bb3ba] mt-2">Secure access to dashboard</p>
        </div>

        <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.2)] rounded-2xl overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-[#4bb3ba] via-[#18446a] to-[#4bb3ba]"></div>

          <CardHeader className="px-6 pt-6 pb-0">
            <CardTitle className="text-2xl font-bold text-[#18446a]">Welcome back</CardTitle>
            <CardDescription className="text-[#4bb3ba]">Sign in to your account to continue</CardDescription>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#4bb3ba] transition-colors group-focus-within:text-[#18446a]" />
                  <Input
                    type="text"
                    placeholder="Username"
                    className="pl-12 h-14 bg-white border-[#4bb3ba]/30 focus-visible:ring-[#4bb3ba]/30 focus-visible:border-[#4bb3ba] transition-all rounded-xl text-base shadow-sm"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#4bb3ba] transition-colors group-focus-within:text-[#18446a]" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="pl-12 pr-12 h-14 bg-white border-[#4bb3ba]/30 focus-visible:ring-[#4bb3ba]/30 focus-visible:border-[#4bb3ba] transition-all rounded-xl text-base shadow-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4bb3ba] hover:text-[#18446a] transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm flex items-center border border-red-100 animate-fadeIn">
                  <div className="h-2 w-2 rounded-full bg-red-500 mr-3 flex-shrink-0"></div>
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-14 bg-gradient-to-r from-[#4bb3ba] to-[#18446a] hover:from-[#4bb3ba]/90 hover:to-[#18446a]/90 text-white rounded-xl transition-all shadow-md hover:shadow-lg text-base font-medium"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center justify-center group">
                    Sign in
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </Button>
            </form>

          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-3 text-sm text-[#18446a]">
            <span className="hover:text-[#4bb3ba] cursor-pointer transition-colors">Privacy Policy</span>
            <div className="h-1 w-1 rounded-full bg-[#4bb3ba]"></div>
            <span className="hover:text-[#4bb3ba] cursor-pointer transition-colors">Terms of Service</span>
            <div className="h-1 w-1 rounded-full bg-[#4bb3ba]"></div>
            <span className="hover:text-[#4bb3ba] cursor-pointer transition-colors">Help</span>
          </div>
          <div className="mt-4 text-xs text-[#18446a]/70">
            © {new Date().getFullYear()} Ongky Corp. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  )
}
