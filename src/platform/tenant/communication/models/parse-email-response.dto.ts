// Type definitions for mailparser 3.4 copied from corresponding package

/**
 * Structured object for headers with arguments.
 *
 * `content-type: text/plain; CHARSET="UTF-8"` =>
 * ```
 * {
 *     "value": "text/plain",
 *     "params": {
 *         "charset": "UTF-8"
 *     }
 * }
 * ```
 */
interface StructuredHeader {
  /**
   * The main value.
   */
  value: string;
  /**
   * Additional arguments.
   */
  params: { [key: string]: string };
}

/**
 * Possible types of a header value.
 */
type HeaderValue = string | string[] | AddressObject | Date | StructuredHeader;

/**
 * A Map object with lowercase header keys.
 */
type Headers = Map<string, HeaderValue>;
/**
 * An array of raw header lines
 */
type HeaderLines = ReadonlyArray<{
  key: string;
  line: string;
}>;
/**
 * Address details.
 */
interface EmailAddress {
  /**
   * The email address.
   */
  address?: string | undefined;
  /**
   * The name part of the email/group.
   */
  name: string;
  /**
   * An array of grouped addresses.
   */
  group?: EmailAddress[] | undefined;
}

/**
 * Address object.
 */
interface AddressObject {
  /**
   * An array with address details.
   */
  value: EmailAddress[];
  /**
   * A formatted address string for HTML context.
   */
  html: string;
  /**
   * A formatted address string for plaintext context.
   */
  text: string;
}

/**
 * Attachment object.
 */
interface Attachment {
  /**
   * Message type.
   */
  type: 'attachment';
  /**
   * A Buffer that contains the attachment contents.
   */
  content: Buffer;
  /**
   * MIME type of the message.
   */
  contentType: string;
  /**
   * Content disposition type for the attachment,
   * most probably `'attachment'`.
   */
  contentDisposition: string;
  /**
   * File name of the attachment.
   */
  filename?: string | undefined;
  /**
   * A Map value that holds MIME headers for the attachment node.
   */
  headers: Headers;
  /**
   * An array of raw header lines for the attachment node.
   */
  headerLines: HeaderLines;
  /**
   * A MD5 hash of the message content.
   */
  checksum: string;
  /**
   * Message size in bytes.
   */
  size: number;
  /**
   * The header value from `Content-ID`.
   */
  contentId?: string | undefined;
  /**
   * `contentId` without `<` and `>`.
   */
  cid?: string | undefined;   // e.g. '5.1321281380971@localhost'
  /**
   * If true then this attachment should not be offered for download
   * (at least not in the main attachments list).
   */
  related: boolean;
}

/**
 * Parsed mail object.
 */
export interface ParsedMail {
  /**
   * An array of attachments.
   */
  attachments: Attachment[];
  /**
   * A Map object with lowercase header keys.
   *
   * - All address headers are converted into address objects.
   * - `references` is a string if only a single reference-id exists or an
   *    array if multiple ids exist.
   * - `date` value is a Date object.
   */
  headers: Headers;
  /**
   * An array of raw header lines
   */
  headerLines: HeaderLines;
  /**
   * The HTML body of the message.
   *
   * Sets to `false` when there is no HTML body.
   *
   * If the message included embedded images as cid: urls then these are all
   * replaced with base64 formatted data: URIs.
   */
  html: string | false;
  /**
   * The plaintext body of the message.
   */
  text?: string | undefined;
  /**
   * The plaintext body of the message formatted as HTML.
   */
  textAsHtml?: string | undefined;
  /**
   * The subject line.
   */
  subject?: string | undefined;
  /**
   * Either an array of two or more referenced Message-ID values or a single Message-ID value.
   *
   * Not set if no reference values present.
   */
  references?: string[] | string | undefined;
  /**
   * A Date object for the `Date:` header.
   */
  date?: Date | undefined;
  /**
   * An address object or array of address objects for the `To:` header.
   */
  to?: AddressObject | AddressObject[] | undefined;
  /**
   * An address object for the `From:` header.
   */
  from?: AddressObject | undefined;
  /**
   * An address object or array of address objects for the `Cc:` header.
   */
  cc?: AddressObject | AddressObject[] | undefined;
  /**
   * An address object or array of address objects for the `Bcc:` header.
   * (usually not present)
   */
  bcc?: AddressObject | AddressObject[] | undefined;
  /**
   * An address object for the `Reply-To:` header.
   */
  replyTo?: AddressObject | undefined;
  /**
   * The Message-ID value string.
   */
  messageId?: string | undefined;
  /**
   * The In-Reply-To value string.
   */
  inReplyTo?: string | undefined;
  /**
   * Priority of the e-mail.
   */
  priority?: 'normal' | 'low' | 'high' | undefined;
}
