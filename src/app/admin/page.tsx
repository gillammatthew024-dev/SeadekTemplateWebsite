'use client';
import { useState, useEffect } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ProjectForm } from '../components/project-form';
import { ProjectList } from '../components/project-list';
import { Toaster } from '../components/ui/sonner';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import { Loader2, LogOut } from 'lucide-react';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(0);
  const [targetTable, setTargetTable] = useState<'main-portfolio' | 'seadek-portfolio'>('main-portfolio');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if user is authenticated but not admin
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/');
      toast.error('Unauthorized access');
    }
  }, [status, session, router]);

  const handleProjectCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        password,
        redirect: false,
        callbackUrl: '/admin'
      });

      if (result?.error) {
        toast.error('Incorrect password');
        setPassword('');
      } else if (result?.ok) {
        toast.success('Access granted!');
        console.log(session);
        // The session will automatically update, no need to manually set authentication state
      }
    } catch (error) {
      toast.error('An error occurred during authentication');
      console.error('Authentication error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    toast.success('Signed out successfully');
  };

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
          <p className="text-sm text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (status === 'unauthenticated') {
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
                disabled={isLoading}
                autoFocus
                required
              />
              <Button type="submit" className="w-full" disabled={isLoading || !password}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  'Access Dashboard'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show dashboard if authenticated as admin
  if (status === 'authenticated' && session?.user?.role === 'admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Toaster />

        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="mt-1 text-sm text-gray-600">
                  Manage your project posts and uploads
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* Table toggle */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 mr-2">Target table:</span>
                  <div className="inline-flex rounded-md shadow-sm" role="group">
                    <button
                      type="button"
                      onClick={() => setTargetTable('main-portfolio')}
                      className={`px-3 py-2 text-sm font-medium rounded-l-md transition-colors ${
                        targetTable === 'main-portfolio' 
                          ? 'bg-black text-white' 
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      Projects
                    </button>
                    <button
                      type="button"
                      onClick={() => setTargetTable('seadek-portfolio')}
                      className={`px-3 py-2 text-sm font-medium rounded-r-md transition-colors ${
                        targetTable === 'main-portfolio' 
                          ? 'bg-black text-white' 
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      Seadek
                    </button>
                  </div>
                </div>

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
              </div>
            </div>

            {/* Session info (optional - for debugging, remove in production) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-2 text-xs text-gray-500">
                Signed in as: {session.user?.email || 'Admin'} | 
                Session expires: {new Date(session.expires).toLocaleString()}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Create Project Form */}
            <div>
              <ProjectForm 
                key={`form-${refreshKey}`}
                onProjectCreated={handleProjectCreated} 
                targetTable={targetTable} 
              />
            </div>

            {/* Project List */}
            <div>
              <ProjectList 
                key={`list-${refreshKey}`}
                targetTable={targetTable} 
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback (should not reach here)
  return null;
}