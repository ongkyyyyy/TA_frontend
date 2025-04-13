/* eslint-disable react/no-unescaped-entities */
import { useState } from "react"
import { Image } from "lucide-react"
import { Link } from "react-router-dom"
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Separator } from "../ui/separator"

import Rizz from "../../assets/images/rizz.jpg"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl grid md:grid-cols-2 overflow-hidden shadow-xl">
        <div className="p-6 sm:p-8">
          <CardHeader className="p-0 mb-6">
            <CardTitle className="text-2xl font-bold text-slate-900">Welcome back</CardTitle>
            <CardDescription className="text-slate-500 mt-2">Sign in to your account to continue</CardDescription>
          </CardHeader>

          <CardContent className="p-0 space-y-4">
            <form className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    type="email"
                    placeholder="Email address"
                    className="pl-10 bg-slate-50 border-slate-200 focus-visible:ring-slate-200"
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
                <div className="text-right">
                  <Link
                    href="#"
                    className="text-xs text-slate-500 hover:text-slate-900 hover:underline transition-colors"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white">
                Sign in
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <div className="flex items-center gap-2 py-2">
              <Separator className="flex-1" />
              <span className="text-xs text-slate-400 font-medium">OR</span>
              <Separator className="flex-1" />
            </div>

            <Button variant="outline" className="w-full border-slate-200 hover:bg-slate-50 hover:text-slate-900">
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
                alt="Google Logo"
                width={18}
                height={18}
                className="mr-2"
              />
              Continue with Google
            </Button>

            <div className="text-center pt-4">
              <p className="text-sm text-slate-500">
                Don't have an account?{" "}
                <Link href="#" className="font-medium text-slate-900 hover:underline">
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
