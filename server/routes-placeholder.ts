// Backend API placeholders for upcoming AutoTrack features

/*
 * Multi-Account Integration API
 * Endpoints for connecting and managing multiple financial accounts
 */
// POST /api/accounts/connect - Connect new bank/UPI/card/crypto account
// GET /api/accounts - List all connected accounts
// DELETE /api/accounts/:id - Disconnect an account
// PUT /api/accounts/:id/sync - Manually sync account data

/*
 * Smart Expense Categorization API
 * AI-powered automatic categorization of transactions
 */
// POST /api/transactions/categorize - Auto-categorize a transaction
// PUT /api/transactions/:id/category - Update transaction category
// GET /api/categories - Get list of expense categories
// POST /api/categories/custom - Create custom category

/*
 * AI Budget Planner API
 * Personalized budget recommendations and adjustments
 */
// POST /api/budget/generate - Generate AI-based budget plan
// GET /api/budget/current - Get current budget settings
// PUT /api/budget/update - Update budget amounts
// GET /api/budget/predictions - Get spending predictions

/*
 * Predictive Alerts & Smart Nudges API
 * Real-time spending alerts and warnings
 */
// GET /api/alerts - Get all active alerts
// POST /api/alerts/settings - Configure alert preferences
// GET /api/nudges - Get personalized spending nudges
// POST /api/alerts/dismiss/:id - Dismiss an alert

/*
 * AI Chat Assistant API
 * Natural language query interface for financial data
 */
// POST /api/chat/query - Send natural language question
// GET /api/chat/history - Get conversation history
// POST /api/chat/feedback - Provide feedback on AI response

/*
 * Insight Dashboard API
 * Aggregated financial insights and analytics
 */
// GET /api/insights/summary - Get spending summary
// GET /api/insights/trends - Get spending trends over time
// GET /api/insights/categories - Get category-wise breakdown
// GET /api/insights/savings - Get savings insights and goals

/*
 * Data Security & Privacy API
 * Security and data management endpoints
 */
// GET /api/security/status - Get encryption and security status
// POST /api/security/export - Export user data (GDPR compliance)
// DELETE /api/security/delete-account - Delete all user data
// GET /api/security/audit-log - View security audit log

export const PLACEHOLDER_ROUTES = {
  multiAccount: [
    'POST /api/accounts/connect',
    'GET /api/accounts',
    'DELETE /api/accounts/:id',
    'PUT /api/accounts/:id/sync',
  ],
  categorization: [
    'POST /api/transactions/categorize',
    'PUT /api/transactions/:id/category',
    'GET /api/categories',
    'POST /api/categories/custom',
  ],
  budgetPlanner: [
    'POST /api/budget/generate',
    'GET /api/budget/current',
    'PUT /api/budget/update',
    'GET /api/budget/predictions',
  ],
  alerts: [
    'GET /api/alerts',
    'POST /api/alerts/settings',
    'GET /api/nudges',
    'POST /api/alerts/dismiss/:id',
  ],
  chatAssistant: [
    'POST /api/chat/query',
    'GET /api/chat/history',
    'POST /api/chat/feedback',
  ],
  insights: [
    'GET /api/insights/summary',
    'GET /api/insights/trends',
    'GET /api/insights/categories',
    'GET /api/insights/savings',
  ],
  security: [
    'GET /api/security/status',
    'POST /api/security/export',
    'DELETE /api/security/delete-account',
    'GET /api/security/audit-log',
  ],
};
