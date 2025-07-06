/**
 * /api/submittedreports/stats
 * GET  –  returns an aggregated snapshot for the dashboard cards:
 *   {
 *     inProgress: <Number>,     // reports that are *not* completed
 *     completed:  <Number>,     // reports that are completed
 *     satisfaction: <Number>    // average satisfaction (0‑100) rounded – optional, `null` if none
 *     latestUpdate: <Date|null> // latest updatedAt of inProgress reports or null
 *   }
 *
 * The route uses the same Mongo connection helper the rest of the
 * project relies on (`lib/dbConnect`) and **never** creates models
 * twice thanks to the `mongoose.models` guard.
 */

import dbConnect from '@/lib/dbConnect';
import mongoose from 'mongoose';

const REPORT_COLLECTION = 'submittedreports';
const SATISFACTION_COLLECTION = 'satisfactions'; // adjust if your collection name differs

// a very thin, schema‑less model – all we need for count queries
const SubmittedReport =
  mongoose.models.SubmittedReport ||
  mongoose.model('SubmittedReport', new mongoose.Schema({}, { strict: false, collection: REPORT_COLLECTION }));

const Satisfaction =
  mongoose.models.Satisfaction ||
  mongoose.model('Satisfaction', new mongoose.Schema({}, { strict: false, collection: SATISFACTION_COLLECTION }));

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    await dbConnect();

    // 1) completed – documents that have `status` === "ดำเนินการเสร็จสิ้น"
    // 2) in progress – documents that have `status` === "อยู่ระหว่างดำเนินการ"
    const completedQuery = { status: 'ดำเนินการเสร็จสิ้น' };
    const inProgressQuery = { status: 'อยู่ระหว่างดำเนินการ' };
    const [completed, inProgress] = await Promise.all([
      SubmittedReport.countDocuments(completedQuery),
      SubmittedReport.countDocuments(inProgressQuery)
    ]);

    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfPreviousMonth = new Date(startOfCurrentMonth.getTime() - 1);

    const previousMonthCompleted = await SubmittedReport.countDocuments({
      status: 'ดำเนินการเสร็จสิ้น',
      createdAt: { $gte: startOfPreviousMonth, $lte: endOfPreviousMonth }
    });

    // // ─── DEBUG LOGS ────────────────────────────────────────────────────────────
    // console.log('✅ Completed (current all‑time):', completed);
    // console.log('📆 Completed previous month:', previousMonthCompleted);
    // // ───────────────────────────────────────────────────────────────────────────

    const completedChange = previousMonthCompleted > 0
      ? Math.round(((completed - previousMonthCompleted) / previousMonthCompleted) * 100)
      : null;

    const latestInProgressDoc = await SubmittedReport.findOne(inProgressQuery)
      .sort({ updatedAt: -1 })
      .select({ updatedAt: 1 });
    const latestUpdate = latestInProgressDoc?.updatedAt ?? null;

    // ---- satisfaction ------------------------------------------------------
    let satisfaction = null; // default – not enough data
    try {
      const stats = await Satisfaction.aggregate([
        {
          $group: {
            _id: '$complaintId',
            rating: { $first: '$rating' }
          }
        },
        {
          $group: {
            _id: null,
            avgRating: { $avg: '$rating' }
          }
        }
      ]);

      if (stats.length && typeof stats[0].avgRating === 'number') {
        satisfaction = Math.round((stats[0].avgRating / 5) * 100); // assume rating 1‑5 → convert to %
      }
    } catch {
      /* ignore if collection is missing – keep satisfaction = null */
    }

    return res.json({
      inProgress,
      completed,
      completedChange,
      satisfaction,
      latestUpdate
    });
  } catch (err) {
    console.error('📊 Stats API error:', err);
    return res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
}