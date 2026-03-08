import { STATUS_FLOW } from '../constants';

export function formatDate(d = new Date()) {
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

export function nextStatus(s) {
  const i = STATUS_FLOW.indexOf(s);
  return STATUS_FLOW[Math.min(i + 1, STATUS_FLOW.length - 1)];
}

export function progressForStatus(s) {
  return ((STATUS_FLOW.indexOf(s) + 1) / STATUS_FLOW.length) * 100;
}

export function getAuthErrorMessage(error) {
  if (!error) return 'An unexpected error occurred. Please try again.';
  
  switch (error) {
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection and try again.';
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please check your credentials.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Please try signing in instead.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled.';
    default:
      if (typeof error === 'string') {
        if (error.includes('password')) return 'Incorrect password. Please try again.';
        if (error.includes('email') || error.includes('user') || error.includes('already'))
          return 'An account with this email already exists. Please try signing in instead.';
      }
      return 'Authentication failed. Please try again.';
  }
}

export function getStatusColor(status) {
  const colors = {
    "Overview": "bg-slate-100 text-slate-800",
    "Under Review": "bg-blue-100 text-blue-800",
    "Matched": "bg-purple-100 text-purple-800",
    "Approved": "bg-green-100 text-green-800",
    "In Execution": "bg-orange-100 text-orange-800",
    "Completed": "bg-emerald-100 text-emerald-800"
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}

