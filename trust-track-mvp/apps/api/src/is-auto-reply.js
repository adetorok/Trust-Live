const AUTO_SUBMITTED_VALUES = new Set([
  'auto-generated',
  'auto-replied',
  'auto-notified'
]);

const AUTO_SUBJECT_PATTERNS = [
  /^\s*(automatic reply|auto reply|out of office|ooo)\b/i,
  /^\s*(delivery status notification|undeliverable|mail delivery failed)\b/i,
  /^\s*read\s*:/i,
  /^\s*read receipt\b/i
];

function normalizeHeaders(headers = {}) {
  return Object.fromEntries(
    Object.entries(headers).map(([key, value]) => [
      key.toLowerCase(),
      Array.isArray(value) ? value.join(', ') : String(value ?? '')
    ])
  );
}

function truthyMachineHeader(value) {
  if (!value) return false;
  return !['no', 'false', '0', 'none'].includes(value.trim().toLowerCase());
}

/**
 * Return true when a message is machine-generated and must not create work or
 * count as a human first reply.
 */
export function isAutoReply(headers = {}, subject = '') {
  const normalized = normalizeHeaders(headers);
  const autoSubmitted = normalized['auto-submitted']?.trim().toLowerCase();

  if (autoSubmitted && autoSubmitted !== 'no') {
    return AUTO_SUBMITTED_VALUES.has(autoSubmitted) || autoSubmitted.startsWith('auto-');
  }

  if (
    truthyMachineHeader(normalized['x-autoreply']) ||
    truthyMachineHeader(normalized['x-autorespond']) ||
    truthyMachineHeader(normalized['x-auto-response-suppress'])
  ) {
    return true;
  }

  const precedence = normalized.precedence?.trim().toLowerCase();
  if (['bulk', 'junk', 'list'].includes(precedence) && /reply|receipt|notification/i.test(subject)) {
    return true;
  }

  return AUTO_SUBJECT_PATTERNS.some((pattern) => pattern.test(subject));
}
