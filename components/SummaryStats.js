import { useEffect, useState } from "react";
import axios from "axios";
import {
  Construction,
  Smile,
  BadgeCheck,
} from "lucide-react";

const SummaryStats = () => {
  const [stats, setStats] = useState({
    inProgress: 0,
    completed: 0,
    completedChange: null,
    satisfaction: 0,
    latestUpdate: null,
  });
  const [loading, setLoading] = useState(true);

  const formatDateDesc = (dateStr) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'อัปเดตล่าสุดวันนี้';
    if (diffDays === 1) return 'อัปเดตล่าสุดเมื่อวานนี้';

    return `อัปเดตล่าสุดวันที่ ${date.toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })}`;
  };

  useEffect(() => {
    axios
      .get("/api/submittedreports/stats")
      .then((res) => {
        setTimeout(() => {
          setStats(res.data);
          setLoading(false);
        }, 1000); // 2 second delay
      })
      .catch((err) => {
        console.error("Failed to fetch stats:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="w-full text-center">
        <span className="loading loading-bars loading-sm mx-auto my-4 block"></span>
      </div>
    );
  }

  return (
    <div className="w-full mt-2">
      {/* Mobile view: stacked stats */}
      <div className="grid grid-cols-2 gap-2 shadow bg-base-400 border border-base-300 rounded-lg w-full sm:hidden">
        {/* กำลังดำเนินการ */}
        <div className="stat p-2">
          <div className="stat-title text-xs">อยู่ระหว่างดำเนินการ</div>
          <div className="stat-value text-warning text-base">{`${stats.inProgress} เรื่อง`}</div>
          <div className="stat-desc text-[10px]">{formatDateDesc(stats.latestUpdate)}</div>
          <div className="stat-figure text-warning">
            <Construction className="w-6 h-6" />
          </div>
        </div>

        {/* เสร็จสิ้น */}
        <div className="stat p-2">
          <div className="stat-title text-xs">ดำเนินการเสร็จสิ้น</div>
          <div className="stat-value text-success text-base">{`${stats.completed} เรื่อง`}</div>
          <div className="stat-desc text-[10px]">
            {stats.completedChange !== null ? (
              <span>
                เปลี่ยนแปลง{' '}
                <span className={stats.completedChange > 0 ? 'text-green-500' : 'text-red-500'}>
                  {stats.completedChange > 0 ? '↑' : '↓'} {Math.abs(stats.completedChange)}%
                </span>
              </span>
            ) : (
              '⚠️ไม่มีข้อมูลเดือนก่อน'
            )}
          </div>
          <div className="stat-figure text-success">
            <BadgeCheck className="w-6 h-6" />
          </div>
        </div>

        {/* ความพึงพอใจ */}
        <div className="stat p-2 col-span-2 flex items-center">
          <div>
            <div className="stat-title text-xs">ความพึงพอใจรวม</div>
            <div className="stat-value text-info text-base">{`${stats.satisfaction}%`}</div>
            <div className="stat-desc text-[10px]">เฉลี่ยจากแบบประเมิน</div>
          </div>
          <div className="stat-figure text-info">
            <Smile className="w-6 h-6 stroke-current" />
          </div>
        </div>
      </div>

      {/* Desktop view: horizontal stats */}
      <div className="stats shadow-xl bg-base-400 border border-base-300 rounded-lg w-full flex-row flex-nowrap justify-between items-stretch gap-4 hidden sm:flex">
        {/* กำลังดำเนินการ */}
        <div className="stat min-w-0 flex-1">
          <div className="stat-title text-sm font-semibold">อยู่ระหว่างดำเนินการ</div>
          <div className="stat-value text-warning text-2xl">{`${stats.inProgress} เรื่อง`}</div>
          <div className="stat-desc text-xs">{formatDateDesc(stats.latestUpdate)}</div>
          <div className="stat-figure text-warning">
            <Construction className="w-8 h-8 stroke-current" />
          </div>
        </div>

        {/* เสร็จสิ้น */}
        <div className="stat min-w-0 flex-1">
          <div className="stat-title text-sm font-semibold">ดำเนินการเสร็จสิ้น</div>
          <div className="stat-value text-success text-2xl">{`${stats.completed} เรื่อง`}</div>
          <div className="stat-desc text-xs">
            {stats.completedChange !== null ? (
              <span>
                เปลี่ยนแปลง{' '}
                <span className={stats.completedChange > 0 ? 'text-green-500' : 'text-red-500'}>
                  {stats.completedChange > 0 ? '↑' : '↓'} {Math.abs(stats.completedChange)}%
                </span>
              </span>
            ) : (
              '⚠️ไม่มีข้อมูลเดือนก่อน'
            )}
          </div>
          <div className="stat-figure text-success">
            <BadgeCheck className="w-8 h-8" />
          </div>
        </div>

        {/* ความพึงพอใจ */}
        <div className="stat min-w-0 flex-1">
          <div className="stat-title text-sm font-semibold">ความพึงพอใจรวม</div>
          <div className="stat-value text-info text-2xl">{`${stats.satisfaction}%`}</div>
          <div className="stat-desc text-xs">เฉลี่ยจากแบบประเมิน</div>
          <div className="stat-figure text-info">
            <Smile className="w-8 h-8" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryStats;