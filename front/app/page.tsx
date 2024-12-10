import Image from "next/image"
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-8">
      <Card className="w-full max-w-md neon-border">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary neon-text text-center">CyberAuth</CardTitle>
          <CardDescription className="text-center">Next-gen Authentication System</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Welcome to CyberAuth, a futuristic authentication system built with Next.js and shadcn/ui.
          </p>
          <div className="flex justify-center">
            <Image
              src="/cyber-lock.png"
              alt="Cyber Lock"
              width={200}
              height={200}
              className="rounded-lg"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          <Button asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/register">Register</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

