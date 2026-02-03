"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AuthFormProps {
  type: "login" | "signup"
}

export const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const router = useRouter()
  const { login, signup } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (type === "login") {
        await login(email, password)
      } else {
        await signup(email, password, name)
      }
      router.push("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="rounded-lg bg-destructive/10 p-3 text-destructive text-sm">{error}</div>}

      {type === "signup" && (
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            required
            className="mt-2"
          />
        </div>
      )}

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          className="mt-2"
        />
      </div>

      <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
        {loading ? "Loading..." : type === "login" ? "Login" : "Create Account"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {type === "login" ? "Don't have an account? " : "Already have an account? "}
        <a href={type === "login" ? "/signup" : "/login"} className="text-primary hover:underline">
          {type === "login" ? "Sign up" : "Login"}
        </a>
      </p>
    </form>
  )
}
