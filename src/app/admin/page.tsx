'use client';
import { useState } from 'react';
import { validateAdminPassword } from './actions';
import { ProjectForm } from '../components/project-form';
import { ProjectList } from '../components/project-list';
import { Toaster } from '../components/ui/sonner';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import { MultiSelectServiceList } from "../components/MultiSelectServiceList";
export default function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [targetTable, setTargetTable] = useState<'make-server-be0083bc' | 'clever-responder'>('make-server-be0083bc');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [isCheckingPassword, setIsCheckingPassword] = useState(false);

  const handleProjectCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCheckingPassword(true);

    const result = await validateAdminPassword(password);

    if (result.success) {
      setIsAuthenticated(true);
      setPassword('');
      toast.success('Access granted!');
    } else {
      toast.error(result.error || 'Incorrect password');
      setPassword('');
    }

    setIsCheckingPassword(false);
  };

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
              Manage your project posts and uploads
            </p>
          </div>

          {/* Table toggle */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 mr-2">Target table:</span>
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                type="button"
                onClick={() => setTargetTable('make-server-be0083bc')}
                className={`px-3 py-2 text-sm font-medium ${
                  targetTable === 'make-server-be0083bc' ? 'bg-black text-white' : 'bg-white text-gray-700 border'
                }`}
              >
                Projects
              </button>
              <button
                type="button"
                onClick={() => setTargetTable('clever-responder')}
                className={`px-3 py-2 text-sm font-medium ${
                  targetTable === 'clever-responder' ? 'bg-black text-white' : 'bg-white text-gray-700 border'
                }`}
              >
                Seadek
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Create Project Form */}
          <div>
            <ProjectForm onProjectCreated={handleProjectCreated} targetTable={targetTable} />
          </div>

          {/* Project List */}
          <div>
            <ProjectList targetTable={targetTable} />
          </div>
          <div>
            <MultiSelectServiceList onChange={(selected) => console.log(selected)} />
          </div>
        </div>
      </div>
    </div>
  );
}
