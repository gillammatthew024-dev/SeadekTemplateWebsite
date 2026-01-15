'use client';
import { use, useEffect, useState } from 'react';
import { validateAdminPassword } from '../actions';
import { ServiceForm } from '../../components/service-form';
import { ServiceList } from '../../components/service-list';
import { Toaster } from '../../components/ui/sonner';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { toast } from 'sonner';
import { LogIn, LogOut, Router } from 'lucide-react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function App() {
  const { data: session, status } = useSession();
  const [refreshKey, setRefreshKey] = useState(0);
  const [targetTable, setTargetTable] = useState<'make-server-be0083bc' | 'clever-responder'>('make-server-be0083bc');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [isCheckingPassword, setIsCheckingPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/');
      toast.error('Unauthorized access');
    }
  }, [status, session, router]);

  const handleProjectCreated = () => {
    setRefreshKey(prev => prev + 1);
  };
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await signIn('credentials', {
        password,
        redirect: false,
        callbackUrl: '/admin/service'
      });
      if (result?.error) {
        toast.error('Incorrect password');
        setPassword('');
      } else if (result?.ok) {
        toast.success('Access granted!');
        setIsAuthenticated(true);
      }
    }catch (error) {
      toast.error('An error occurred during authentication');
      console.error('Authentication error:', error);
    } finally {
      setIsCheckingPassword(false);
    }
  };
  const handleSignOut = async (e: React.FormEvent) => {
    await signOut({redirect: false});
    toast.success('Signed out successfully');
  }
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Toaster />
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Access</CardTitle>
            <CardDescription>Enter the admin password to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isCheckingPassword}
                autoFocus
              />
              <Button type="submit" className="w-full" disabled={isCheckingPassword}>
                {isCheckingPassword ? 'Checking...' : 'Access Dashboard'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage your available services; these will be keys in your database, meaning that projects/posts will be associated with these services, giving a pseudo search functionality.
              Navigating with the service links will show projects which are associated with this service. 
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {status === "authenticated" && 
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Create Project Form */}
          <div>
            <ServiceForm onProjectCreated={handleProjectCreated} />
          </div>

          {/* Project List */}
          <div>
            {/* Sign out button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
            <ServiceList />
          </div>
        </div>
      </div>
  }
    </div>
  );
}
