"use client"
import { Suspense, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setIsAuthenticated, setUser } = useAuth()

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get("token")
      const error = searchParams.get("error")

      if (error) {
        console.error("Auth error:", error)
        router.push(`/login?error=${error}`)
        return
      }

      if (token) {
        console.log("✅ Token received:", token)
        
        // Store the access token
        localStorage.setItem("accessToken", token)
        
        // Fetch user profile with the token
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            credentials: 'include',
          })

          if (response.ok) {
            const data = await response.json()
            console.log("✅ User profile:", data.user)
            
            // Update auth context
            setUser(data.user)
            setIsAuthenticated(true)
            
            // Redirect to home/dashboard
            router.push("/")
          } else {
            throw new Error("Failed to fetch user profile")
          }
        } catch (error) {
          console.error("Profile fetch error:", error)
          router.push("/login?error=profile_fetch_failed")
        }
      } else {
        router.push("/login?error=no_token")
      }
    }

    handleCallback()
  }, [searchParams, router, setIsAuthenticated, setUser])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold mb-2">Signing you in...</h2>
        <p className="text-muted-foreground">Please wait while we complete your authentication</p>
      </div>
    </div>
  )
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">Loading...</h2>
          <p className="text-muted-foreground">Please wait</p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
}