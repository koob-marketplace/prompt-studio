import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mail, Chrome, Apple } from 'lucide-react'
import { Footer } from '@/components/navigation/footer'
import { Navbar1 } from '@/components/navigation/nav-bar'

export default function Page() {
  const openEmailClient = (clientUrl: string) => {
    window.open(clientUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar at the top */}
      <Navbar1 />
      
      {/* Main content area that will expand and push footer down */}
      <main className="flex-grow flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Thank you for signing up!</CardTitle>
                <CardDescription>Check your email to confirm</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  You&apos;ve successfully signed up. Please check your email to confirm your account
                  before signing in.
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => openEmailClient('https://mail.google.com')}
                    aria-label="Open Gmail"
                    className="flex items-center justify-center gap-2"
                  >
                    <Chrome className="h-4 w-4" />
                    Gmail
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => openEmailClient('https://outlook.live.com/mail/')}
                    aria-label="Open Outlook"
                    className="flex items-center justify-center gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    Outlook
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => openEmailClient('https://www.icloud.com/mail')}
                    aria-label="Open iCloud Mail"
                    className="flex items-center justify-center gap-2"
                  >
                    <Apple className="h-4 w-4" />
                    iCloud
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      {/* Footer at the bottom */}
      <Footer />
    </div>
  )
}