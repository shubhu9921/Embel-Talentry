import React from 'react';
import { Users, FileUser, Clock, CheckCircle2, ShieldAlert } from 'lucide-react';
import Card from '../../../../components/Card';

const RecentActivities = ({ activities = [] }) => {
    // If no activities provided, use a placeholder or empty state
    const displayActivities = activities.length > 0 ? activities : [
        { text: "No recent activities", time: "-", icon: Clock }
    ];

    const iconMap = {
        users: Users,
        file: FileUser,
        clock: Clock,
        check: CheckCircle2,
        alert: ShieldAlert
    };

    return (
        <Card className="p-8 ring-1 ring-slate-100">
            <h3 className="font-bold text-[#19325c] mb-8 uppercase tracking-tight text-sm">Recent Activities</h3>
            <div className="space-y-6">
                {displayActivities.map((activity, i) => {
                    const IconComponent = iconMap[activity.icon] || Clock;
                    return (
                        <div key={i} className="flex gap-4 group transition-transform">
                            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0 group-hover:bg-[#ff6e00] transition-colors">
                                <IconComponent className="w-5 h-5 text-[#ff6e00] group-hover:text-white transition-colors" />
                            </div>
                            <div className="flex flex-col justify-center">
                                <p className="text-sm font-bold text-slate-900 group-hover:text-[#ff6e00] transition-colors">{activity.text}</p>
                                <p className="text-[10px] text-slate-400 font-medium mt-0.5">{activity.time}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
};

export default RecentActivities;
