import React from 'react';
import { Users, FileUser, Clock, CheckCircle2 } from 'lucide-react';
import Card from '../../../../components/Card';

const RecentActivities = () => {
    const activities = [
        { text: "New candidate registered", time: "Just now", icon: Users },
        { text: "Assessment completed", time: "2 hours ago", icon: FileUser },
        { text: "Interview scheduled", time: "5 hours ago", icon: Clock },
        { text: "Role vacancy updated", time: "Yesterday", icon: CheckCircle2 }
    ];

    return (
        <Card className="p-8 border-none ring-1 ring-slate-100 shadow-premium hover:shadow-2xl transition-all duration-300">
            <h3 className="font-bold text-slate-900 mb-8 uppercase tracking-tight text-sm">Recent Activities</h3>
            <div className="space-y-6">
                {activities.map((activity, i) => (
                    <div key={i} className="flex gap-4 group transition-transform">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0 group-hover:bg-[#ff6e00] transition-colors">
                            <activity.icon className="w-5 h-5 text-[#ff6e00] group-hover:text-white transition-colors" />
                        </div>
                        <div className="flex flex-col justify-center">
                            <p className="text-sm font-bold text-slate-900 group-hover:text-[#ff6e00] transition-colors">{activity.text}</p>
                            <p className="text-[10px] text-slate-400 font-medium mt-0.5">{activity.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default RecentActivities;
