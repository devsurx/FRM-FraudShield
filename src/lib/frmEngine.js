const analystPool = ["A. Patel", "S. Rao", "V. Iyer", "Meera Joshi", "Rohan Shah"];
const alertReasons = [
  "Velocity breach",
  "New payee",
  "New device",
  "Geo deviation",
  "Fraud keyword",
  "Night profile mismatch",
];

export function scoreTransaction(input) {
  let risk = 8;
  const ruleHits = [];

  if (input.amount >= 100000) {
    risk += 45;
    ruleHits.push("Critical amount");
  } else if (input.amount >= 50000) {
    risk += 28;
    ruleHits.push("High amount");
  } else if (input.amount >= 15000) {
    risk += 14;
    ruleHits.push("Elevated value");
  }

  if (input.isNewPayee) {
    risk += 18;
    ruleHits.push("New payee");
  }

  if (input.isNewDevice) {
    risk += 16;
    ruleHits.push("New device");
  }

  if (input.isVelocitySpike) {
    risk += 18;
    ruleHits.push("Velocity breach");
  }

  if (input.isGeoDeviation) {
    risk += 14;
    ruleHits.push("Location deviation");
  }

  if (input.hasFraudKeyword) {
    risk += 12;
    ruleHits.push("Fraud keyword");
  }

  if (input.isNightProfileMismatch) {
    risk += 10;
    ruleHits.push("Night profile mismatch");
  }

  const boundedRisk = Math.max(0, Math.min(100, risk));

  return {
    risk: boundedRisk,
    ruleHits: ruleHits.length > 0 ? ruleHits : ["Routine pattern"],
    status: getTransactionStatus(boundedRisk),
  };
}

export function getRiskLabel(score) {
  if (score >= 75) return "High";
  if (score >= 40) return "Medium";
  return "Low";
}

export function getTransactionStatus(score) {
  if (score >= 90) return "Blocked";
  if (score >= 75) return "Under Review";
  if (score >= 40) return "Alerted";
  return "Approved";
}

export function buildAlertFromTransaction(transaction, index) {
  if (transaction.risk < 40) return null;

  return {
    id: `ALT-${3200 + index}`,
    severity: transaction.risk >= 75 ? "High" : "Medium",
    score: transaction.risk,
    transactionId: transaction.id,
    reason: transaction.ruleHits.join(" + "),
    assignee: transaction.risk >= 75 ? analystPool[index % analystPool.length] : "Unassigned",
    queue: transaction.risk >= 75 ? "Priority UPI" : "Behavioral",
    age: "Just now",
    status: transaction.risk >= 75 ? "Open" : "Monitoring",
  };
}

export function buildCaseFromAlert(alert, transaction, index) {
  return {
    id: `CASE-${2050 + index}`,
    customer: transaction.user,
    priority: alert.severity === "High" ? "Critical" : "High",
    linkedAlert: alert.id,
    disposition: transaction.risk >= 90 ? "Temporary hold applied" : "Analyst review initiated",
    investigator: alert.assignee === "Unassigned" ? "Fraud Desk" : alert.assignee,
    status: alert.severity === "High" ? "Investigating" : "Awaiting Customer Callback",
    updatedAt: transaction.time,
    nextAction:
      alert.severity === "High"
        ? "Verify customer intent and decide on hold or block"
        : "Confirm beneficiary relationship and payment purpose",
  };
}

export function generateSimulatedTransaction(kind, index) {
  const customers = [
    {
      user: "Priya Malhotra",
      upiId: "priya@okhdfcbank",
      bank: "HDFC Bank",
      city: "Delhi",
    },
    {
      user: "Arjun Verma",
      upiId: "arjun@oksbi",
      bank: "SBI",
      city: "Jaipur",
    },
    {
      user: "Sneha Iqbal",
      upiId: "sneha@okaxis",
      bank: "Axis Bank",
      city: "Hyderabad",
    },
    {
      user: "Dev Kapoor",
      upiId: "dev@okicici",
      bank: "ICICI Bank",
      city: "Chennai",
    },
  ];

  const riskyPayees = [
    "fast-settlement@ibl",
    "reward-claim@paytm",
    "merchant-onboard@ybl",
    "newcontact@oksbi",
  ];
  const safePayees = [
    "supermart@axis",
    "metrocard@ibl",
    "coffeehouse@ybl",
    "electricity@oksbi",
  ];

  const base = customers[index % customers.length];
  const timestamp = new Date();
  const time = timestamp.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const traits =
    kind === "risky"
      ? {
          amount: 45000 + (index % 4) * 18000,
          payee: riskyPayees[index % riskyPayees.length],
          device: index % 2 === 0 ? "New Android Device" : "New Browser Session",
          channel: index % 2 === 0 ? "UPI P2P" : "UPI P2M",
          isNewPayee: true,
          isNewDevice: true,
          isVelocitySpike: true,
          isGeoDeviation: index % 3 !== 0,
          hasFraudKeyword: index % 2 === 1,
          isNightProfileMismatch: index % 3 === 0,
        }
      : {
          amount: 350 + (index % 5) * 450,
          payee: safePayees[index % safePayees.length],
          device: "Known Mobile Device",
          channel: "UPI P2M",
          isNewPayee: false,
          isNewDevice: false,
          isVelocitySpike: false,
          isGeoDeviation: false,
          hasFraudKeyword: false,
          isNightProfileMismatch: false,
        };

  const scored = scoreTransaction(traits);

  return {
    id: `TXN-${903000 + index}`,
    time,
    amount: traits.amount,
    user: base.user,
    upiId: base.upiId,
    payee: traits.payee,
    bank: base.bank,
    city: base.city,
    device: traits.device,
    risk: scored.risk,
    status: scored.status,
    ruleHits: scored.ruleHits,
    channel: traits.channel,
  };
}

export function buildRiskDistribution(transactions) {
  const ranges = [
    { band: "0-25", count: 0 },
    { band: "26-50", count: 0 },
    { band: "51-75", count: 0 },
    { band: "76-100", count: 0 },
  ];

  transactions.forEach((txn) => {
    if (txn.risk <= 25) ranges[0].count += 1;
    else if (txn.risk <= 50) ranges[1].count += 1;
    else if (txn.risk <= 75) ranges[2].count += 1;
    else ranges[3].count += 1;
  });

  return ranges;
}

export function buildFraudTrend(transactions, alerts) {
  const hours = {};

  transactions.forEach((txn) => {
    const hour = txn.time.slice(0, 2) + ":00";
    if (!hours[hour]) {
      hours[hour] = { hour, alerts: 0, blocked: 0 };
    }
    if (txn.risk >= 40) hours[hour].alerts += 1;
    if (txn.status === "Blocked") hours[hour].blocked += 1;
  });

  alerts.forEach((alert) => {
    const transaction = transactions.find((txn) => txn.id === alert.transactionId);
    if (!transaction) return;
    const hour = transaction.time.slice(0, 2) + ":00";
    if (!hours[hour]) {
      hours[hour] = { hour, alerts: 0, blocked: 0 };
    }
    hours[hour].alerts += 0;
  });

  return Object.values(hours).sort((a, b) => a.hour.localeCompare(b.hour));
}

export function buildRulePerformance(transactions) {
  const counters = {};

  transactions.forEach((txn) => {
    txn.ruleHits.forEach((rule) => {
      if (!counters[rule]) {
        counters[rule] = { name: rule, hits: 0, conversion: 0 };
      }
      counters[rule].hits += 1;
      if (txn.risk >= 75) counters[rule].conversion += 1;
    });
  });

  return Object.values(counters)
    .sort((a, b) => b.hits - a.hits)
    .slice(0, 5)
    .map((item) => ({
      ...item,
      conversion: item.hits === 0 ? 0 : Math.round((item.conversion / item.hits) * 100),
    }));
}

export function findTransactionByAlert(alert, transactions) {
  return transactions.find((txn) => txn.id === alert.transactionId);
}

export function getOpenQueues(alerts) {
  return [
    { name: "Priority UPI", open: alerts.filter((item) => item.queue === "Priority UPI" && item.status !== "Closed").length },
    { name: "Behavioral", open: alerts.filter((item) => item.queue === "Behavioral" && item.status !== "Closed").length },
    { name: "Mule Activity", open: alerts.filter((item) => item.queue === "Mule Activity" && item.status !== "Closed").length },
    { name: "Customer Verification", open: alerts.filter((item) => item.status === "Escalated").length },
  ];
}

export function nextCaseStatus(status) {
  const flow = {
    Investigating: "Pending Bank Action",
    "Pending Bank Action": "Awaiting Customer Callback",
    "Awaiting Customer Callback": "Closed",
    Closed: "Closed",
  };

  return flow[status] || "Investigating";
}

export function pickAnalyst(index) {
  return analystPool[index % analystPool.length];
}

export function randomReason(index) {
  return alertReasons[index % alertReasons.length];
}
