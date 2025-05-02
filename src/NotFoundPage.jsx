import { AlertTriangle } from "lucide-react"
import { Link } from "react-router-dom"

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="flex flex-col items-center text-center max-w-md">
        <div className="rounded-full bg-amber-100 p-4 mb-6">
          <AlertTriangle className="h-10 w-10 text-amber-600" />
        </div>

        <h1 className="text-4xl font-bold tracking-tight mb-2">404 - Page Not Found</h1>

        <p className="text-muted-foreground text-lg mb-8">
          The page you are looking for doesnt exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
        <Link to="/" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-primary/90">
          Return Home
        </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
