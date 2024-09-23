// /analytics.js
const express = require('express');
const { Submission } = require('./db/db'); // Import the Submission model from the db
const router = express.Router();

// Helper function to calculate date differences in days and months
function getDayDifference(startDate, endDate) {
  const diffTime = Math.abs(endDate - startDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert from ms to days
}

function getMonthDifference(startDate, endDate) {
  return (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
}

// GET request for analytics by user_id
router.get('/:user_id', async (req, res) => {
  const userId = req.params.user_id;

  try {
    // Find all submissions for the given user_id
    const submissions = await Submission.find({ user_id: userId });

    if (submissions.length === 0) {
      return res.status(404).json({ message: 'No submissions found for this user' });
    }

    // Initialize statistics
    let totalExecutionTime = 0,
        totalExtraCredits = 0,
        totalWaitingTime = 0,
        countExecutionTime = 0,
        countExtraCredits = 0,
        countWaitingTime = 0,
        totalRequests = submissions.length,
        lockedCount = 0,
        pendingCount = 0,
        finishedCount = 0;

    const dayCounts = {};
    const monthCounts = {};

    const earliestTimestamp = new Date(Math.min(...submissions.map(s => new Date(s.timestamp)))); // Find the earliest submission

    submissions.forEach(submission => {
      // Average Execution Time
      if (submission.execution_time !== -1) {
        totalExecutionTime += submission.execution_time;
        countExecutionTime++;
      }

      // Average Extra Credits
      if (submission.extra_credits !== -1) {
        totalExtraCredits += submission.extra_credits;
        countExtraCredits++;
      }

      // Count based on status
      if (submission.status === 'locked') lockedCount++;
      if (submission.status === 'pending') pendingCount++;
      if (submission.status === 'finished') finishedCount++;

      // Average Requests per Day and Month
      const submissionDate = new Date(submission.timestamp);
      const dayKey = submissionDate.toISOString().split('T')[0]; // YYYY-MM-DD
      const monthKey = submissionDate.toISOString().split('T')[0].slice(0, 7); // YYYY-MM

      dayCounts[dayKey] = (dayCounts[dayKey] || 0) + 1;
      monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1;

      // Average Waiting Time
      if (submission.timestamp_end !== null && submission.execution_time !== -1) {
        const timestamp = new Date(submission.timestamp);
        const timestampEnd = new Date(submission.timestamp_end);
        const waitingTime = (timestampEnd - timestamp) / 1000 - submission.execution_time; // in seconds
        totalWaitingTime += waitingTime;
        countWaitingTime++;
      }
    });

    // Calculate averages
    const averageExecutionTime = countExecutionTime > 0 ? totalExecutionTime / countExecutionTime : 0;
    const averageExtraCredits = countExtraCredits > 0 ? totalExtraCredits / countExtraCredits : 0;
    const averageWaitingTime = countWaitingTime > 0 ? totalWaitingTime / countWaitingTime : 0;

    const totalDays = getDayDifference(earliestTimestamp, new Date());
    const totalMonths = getMonthDifference(earliestTimestamp, new Date());

    const averageRequestsPerDay = totalDays > 0 ? totalRequests / totalDays : 0;
    const averageRequestsPerMonth = totalMonths > 0 ? totalRequests / totalMonths : 0;

    // Return analytics data
    res.json({
      average_execution_time: averageExecutionTime,
      average_extra_credits: averageExtraCredits,
      average_waiting_time: averageWaitingTime,
      average_requests_per_day: averageRequestsPerDay,
      average_requests_per_month: averageRequestsPerMonth,
      number_locked: lockedCount,
      number_pending: pendingCount,
      number_finished: finishedCount,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
