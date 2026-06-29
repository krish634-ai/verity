'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Users, BookOpen, TrendingUp, Settings } from 'lucide-react';

export default function AdminPanel() {
  const [stats, setStats] = useState({
    totalUsers: 1234,
    activeInterviews: 42,
    avgScore: 7.2,
    totalInterviews: 5680
  });

  const [chartData] = useState([
    { name: 'Mon', interviews: 120, users: 45 },
    { name: 'Tue', interviews: 145, users: 52 },
    { name: 'Wed', interviews: 98, users: 38 },
    { name: 'Thu', interviews: 167, users: 61 },
    { name: 'Fri', interviews: 189, users: 73 },
    { name: 'Sat', interviews: 145, users: 49 },
    { name: 'Sun', interviews: 112, users: 42 }
  ]);

  const [domainStats] = useState([
    { domain: 'JavaScript', interviews: 1245, avgScore: 7.8 },
    { domain: 'Python', interviews: 987, avgScore: 7.5 },
    { domain: 'React', interviews: 856, avgScore: 7.9 },
    { domain: 'System Design', interviews: 742, avgScore: 6.9 },
    { domain: 'Database', interviews: 650, avgScore: 7.3 },
    { domain: 'DevOps', interviews: 480, avgScore: 6.8 }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-slate-400">Monitor interviews, users, and performance metrics</p>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700 hover:border-blue-500 transition">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Users className="w-4 h-4" /> Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-green-400 mt-1">+12% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700 hover:border-blue-500 transition">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> Active Interviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.activeInterviews}</div>
              <p className="text-xs text-blue-400 mt-1">Currently in progress</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700 hover:border-blue-500 transition">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> Avg Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.avgScore}/10</div>
              <p className="text-xs text-slate-400 mt-1">Overall performance</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700 hover:border-blue-500 transition">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Settings className="w-4 h-4" /> Total Interviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalInterviews.toLocaleString()}</div>
              <p className="text-xs text-slate-400 mt-1">All time</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="activity" className="mb-8">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="activity" className="text-slate-300">Weekly Activity</TabsTrigger>
            <TabsTrigger value="domains" className="text-slate-300">By Domain</TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Interview Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                    <Legend />
                    <Bar dataKey="interviews" fill="#3b82f6" />
                    <Bar dataKey="users" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="domains">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Performance by Domain</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={domainStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="domain" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                    <Legend />
                    <Line type="monotone" dataKey="avgScore" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Domain Stats Table */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Domain Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-slate-300">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 font-semibold">Domain</th>
                    <th className="text-right py-3 px-4 font-semibold">Total Interviews</th>
                    <th className="text-right py-3 px-4 font-semibold">Avg Score</th>
                    <th className="text-right py-3 px-4 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {domainStats.map((stat, idx) => (
                    <tr key={idx} className="border-b border-slate-700 hover:bg-slate-700/50 transition">
                      <td className="py-3 px-4">{stat.domain}</td>
                      <td className="text-right py-3 px-4">{stat.interviews.toLocaleString()}</td>
                      <td className="text-right py-3 px-4">
                        <span className="text-green-400 font-semibold">{stat.avgScore}/10</span>
                      </td>
                      <td className="text-right py-3 px-4">
                        <Button variant="outline" size="sm" className="text-xs">View</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
