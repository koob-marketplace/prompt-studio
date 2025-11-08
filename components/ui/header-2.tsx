'use client';

import React from 'react';
import { Grid2x2PlusIcon, MenuIcon, User, LogOut } from 'lucide-react';
import { Sheet, SheetContent, SheetFooter } from '@/components/ui/sheet';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuthContext } from '@/components/auth/AuthProvider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

export function FloatingHeader() {
	const [open, setOpen] = React.useState(false);
	const { isAuthenticated, signOut, loading } = useAuthContext();

	const links = [
		{
			label: 'Home',
			href: '/',
		},
		{
			label: 'Studio',
			href: '/studio',
		},
		{
			label: 'Library',
			href: '/prompt-library',
		},
	];

	return (
		<header
			className={cn(
				'sticky top-8 z-50',
				'mx-auto w-full max-w-3xl rounded-lg border shadow',
				'bg-background/95 supports-[backdrop-filter]:bg-background/80 backdrop-blur-lg',
			)}
		>
			<nav className="mx-auto flex items-center justify-between p-1.5">
				<Link 
					href="/" 
					className="hover:bg-accent flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 duration-100"
				>
					<Grid2x2PlusIcon className="size-5" />
					<p className="font-mono text-base font-bold">Prompt Studio</p>
				</Link>
				<div className="hidden items-center gap-1 lg:flex">
					{links.map((link) => (
						<Link
							key={link.label}
							className={buttonVariants({ variant: 'ghost', size: 'sm' })}
							href={link.href}
						>
							{link.label}
						</Link>
					))}
				</div>
				<div className="flex items-center gap-2">
					{loading ? (
						<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
					) : isAuthenticated ? (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="sm" className="flex items-center gap-2">
									<User className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem asChild>
									<Link href="/studio" className="flex items-center gap-2">
										<Grid2x2PlusIcon className="h-4 w-4" />
										Studio
									</Link>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={signOut} className="flex items-center gap-2 text-red-600">
									<LogOut className="h-4 w-4" />
									Se déconnecter
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
						<Button size="sm" asChild>
							<Link href="/login">Login</Link>
						</Button>
					)}
					<Sheet open={open} onOpenChange={setOpen}>
						<Button
							size="icon"
							variant="outline"
							onClick={() => setOpen(!open)}
							className="lg:hidden"
						>
							<MenuIcon className="size-4" />
						</Button>
						<SheetContent
							className="bg-background/95 supports-[backdrop-filter]:bg-background/80 gap-0 backdrop-blur-lg"
							side="left"
						>
							<div className="grid gap-y-2 overflow-y-auto px-4 pt-12 pb-5">
								{links.map((link) => (
									<a
										key={link.label}
										className={buttonVariants({
											variant: 'ghost',
											className: 'justify-start',
										})}
										href={link.href}
									>
										{link.label}
									</a>
								))}
							</div>
							<SheetFooter>
								{isAuthenticated ? (
									<>
										<Button variant="outline" asChild>
											<Link href="/studio">Studio</Link>
										</Button>
										<Button onClick={signOut} variant="destructive">
											Se déconnecter
										</Button>
									</>
								) : (
									<>
										<Button variant="outline" asChild>
											<Link href="/login">Sign In</Link>
										</Button>
										<Button asChild>
											<Link href="/sign-up">Get Started</Link>
										</Button>
									</>
								)}
							</SheetFooter>
						</SheetContent>
					</Sheet>
				</div>
			</nav>
		</header>
	);
}
