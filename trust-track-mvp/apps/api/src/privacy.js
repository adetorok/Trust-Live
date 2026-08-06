const REDACTION_PATTERNS = [
  {
    type: 'SUBJECT_REFERENCE',
    regex: /\b(?:SUBJ(?:ECT)?)[\s:#-]*[A-Z0-9-]{3,}\b/gi
  },
  {
    type: 'MRN',
    regex: /\bMRN\s*[:#-]?\s*[A-Za-z0-9-]{4,}\b/gi
  },
  {
    type: 'DOB',
    regex: /\bDOB\s*[:#-]?\s*\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b/gi
  },
  {
    type: 'SSN',
    regex: /\b\d{3}-\d{2}-\d{4}\b/g
  },
  {
    type: 'PHONE',
    regex: /\b(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}\b/g
  }
];

export function redactText(text = '') {
  const findings = [];
  let sanitizedText = text;

  for (const pattern of REDACTION_PATTERNS) {
    const matches = sanitizedText.match(pattern.regex) || [];
    if (matches.length) {
      findings.push({ type: pattern.type, count: matches.length });
    }
    sanitizedText = sanitizedText.replace(
      pattern.regex,
      `[REDACTED ${pattern.type}]`
    );
  }

  return { sanitizedText, findings };
}

/**
 * Redact the subject and body independently so prohibited identifiers cannot
 * leak through a subject line even when the body is clean.
 */
export function sanitizeMessage(message = {}) {
  const subject = redactText(message.subject ?? '');
  const body = redactText(message.body ?? '');
  const findings = [...subject.findings, ...body.findings];

  return {
    sanitizedSubject: subject.sanitizedText,
    sanitizedBody: body.sanitizedText,
    findings,
    potentialSensitiveData: findings.length > 0
  };
}
