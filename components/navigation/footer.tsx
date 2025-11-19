import { FacebookIcon, InstagramIcon, TwitterIcon, YoutubeIcon } from 'lucide-react'

import { Separator } from '@/components/ui/separator'
import { ThemeToggle } from '@/components/theme-toggle'

const Footer = () => {
  return (
    <footer>
      <div className='mt-32 mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 max-md:flex-col sm:px-6 sm:py-6 md:gap-6 md:py-8'>
        <div className='flex items-center gap-5 whitespace-nowrap'>
          <a href='/'>Home</a>
          <a href='/prompt-library'>Library</a>
          <a href='/studio'>Studio</a>
          <a href='/blog'>Blog</a>
          <ThemeToggle />
        </div>

        <div className='flex items-center gap-4'>
          <a href='#'>
            <FacebookIcon className='size-5' />
          </a>
          <a href='#'>
            <InstagramIcon className='size-5' />
          </a>
          <a href='#'>
            <TwitterIcon className='size-5' />
          </a>
          <a href='#'>
            <YoutubeIcon className='size-5' />
          </a>
        </div>
      </div>

      <Separator />

      <div className='mx-auto flex max-w-7xl justify-center px-4 py-8 sm:px-6'>
        <p className='text-center font-medium text-balance'>
          {`©${new Date().getFullYear()}`} <a href='#'>Prompt Studio</a>, Made with ❤️ for better AI prompts.
        </p>
      </div>
    </footer>
  )
}

export { Footer };
