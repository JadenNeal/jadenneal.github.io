export type Author = {
  name: string;
  self: boolean;
  equal: boolean;
};

export type Publication = {
  number: number;
  title: string;
  venue: string;
  year: string;
  date: string;
  href?: string;
  ranking?: string;
  authors: Author[];
};

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requiredString(record: UnknownRecord, field: string, context: string) {
  const value = record[field];

  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${context}: \"${field}\" must be a non-empty string.`);
  }

  return value;
}

function optionalBoolean(record: UnknownRecord, field: string) {
  const value = record[field];

  if (value === undefined) {
    return false;
  }

  if (typeof value !== "boolean") {
    throw new Error(`Author field \"${field}\" must be true or false.`);
  }

  return value;
}

function parseAuthor(value: unknown, publicationTitle: string): Author {
  if (!isRecord(value)) {
    throw new Error(`${publicationTitle}: each author must be a mapping.`);
  }

  return {
    name: requiredString(value, "name", publicationTitle),
    self: optionalBoolean(value, "self"),
    equal: optionalBoolean(value, "equal"),
  };
}

function parsePublication(value: unknown, sourceIndex: number) {
  if (!isRecord(value)) {
    throw new Error(`Publication ${sourceIndex + 1} must be a mapping.`);
  }

  const title = requiredString(value, "title", `Publication ${sourceIndex + 1}`);
  const date = requiredString(value, "date", title);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date))) {
    throw new Error(`${title}: \"date\" must use YYYY-MM-DD format.`);
  }

  if (!Array.isArray(value.authors) || value.authors.length === 0) {
    throw new Error(`${title}: \"authors\" must contain at least one author.`);
  }

  const href = value.href;
  if (href !== undefined && (typeof href !== "string" || href.trim() === "")) {
    throw new Error(`${title}: \"href\" must be a non-empty string when provided.`);
  }

  const ranking = value.ranking;
  if (
    ranking !== undefined &&
    (typeof ranking !== "string" || ranking.trim() === "")
  ) {
    throw new Error(
      `${title}: \"ranking\" must be a non-empty string when provided.`,
    );
  }

  return {
    sourceIndex,
    title,
    date,
    venue: requiredString(value, "venue", title),
    year: requiredString(value, "year", title),
    href,
    ranking,
    authors: value.authors.map((author) => parseAuthor(author, title)),
  };
}

/**
 * Validates the single Markdown publication list, sorts it newest-first, and
 * assigns stable display numbers with the earliest publication numbered 1.
 */
export function preparePublications(input: unknown): Publication[] {
  if (!Array.isArray(input)) {
    throw new Error('publications.md: "publications" must be a list.');
  }

  const sorted = input
    .map(parsePublication)
    .sort(
      (left, right) =>
        right.date.localeCompare(left.date) || left.sourceIndex - right.sourceIndex,
    );

  return sorted.map(({ sourceIndex: _sourceIndex, ...publication }, index) => ({
    ...publication,
    number: sorted.length - index,
  }));
}
