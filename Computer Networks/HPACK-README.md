# HPACK: Header Compression in HTTP/2

A detailed, beginner-friendly guide to how HPACK represents HTTP
headers, uses static and dynamic tables, optionally Huffman-encodes
literal strings, and lets a server reconstruct headers from binary data.

> **Primary reference:** [RFC 7541 --- HPACK: Header Compression for
> HTTP/2](https://www.rfc-editor.org/rfc/rfc7541.html)\
> This README follows the terminology and binary formats in RFC 7541,
> especially Sections 2--7 and Appendices A--C.

## Contents

-   [1. What is HPACK?](#1-what-is-hpack)
-   [2. Where HPACK fits in HTTP/2](#2-where-hpack-fits-in-http2)
-   [3. The two tables](#3-the-two-tables)
-   [4. The four important representation
    types](#4-the-four-important-representation-types)
-   [5. Integer and string encoding](#5-integer-and-string-encoding)
-   [6. Huffman coding, step by step](#6-huffman-coding-step-by-step)
-   [7. Worked example: the first
    request](#7-worked-example-the-first-request)
-   [8. How the server decodes the first
    request](#8-how-the-server-decodes-the-first-request)
-   [9. Worked example: the second
    request](#9-worked-example-the-second-request)
-   [10. Dynamic table state and
    indexing](#10-dynamic-table-state-and-indexing)
-   [11. The complete static table (Appendix
    A)](#11-the-complete-static-table-appendix-a)
-   [12. Security: without indexing vs never
    indexed](#12-security-without-indexing-vs-never-indexed)
-   [13. Common misunderstandings](#13-common-misunderstandings)
-   [14. Quick reference](#14-quick-reference)
-   [15. RFC links](#15-rfc-links)

------------------------------------------------------------------------

## 1. What is HPACK?

**HPACK is the header compression format used by HTTP/2.** It reduces
the amount of data needed to represent HTTP header fields.

Imagine the browser repeatedly sends requests to `ssw.in`. Many header
fields repeat:

``` http
:method: GET
:path: /index.html
:scheme: https
:authority: ssw.in
x-server: express
```

Sending every name and value as text every time would be wasteful. HPACK
gives the sender several ways to represent them more compactly:

1.  **Index a known header field.** Send a short number instead of
    repeating a complete name/value pair.
2.  **Reuse a known header name.** Send the name's table index and only
    transmit the new value.
3.  **Send a literal string.** If the required information is not
    available in a table, send it.
4.  **Optionally Huffman-encode literal strings.** This can reduce the
    number of bytes used by a name or value.

HPACK is not "ASCII compression." ASCII-compatible bytes may be used for
ordinary literal strings, but ASCII itself is a character encoding, not
a compression algorithm.

### The key idea

> **First use references when possible. If a string must be sent, it may
> be Huffman-encoded.**

These choices are made for each header field. HPACK does not require
every header to go through one fixed sequence of separate compression
algorithms.

## 2. Where HPACK fits in HTTP/2

A simplified view of sending a request is:

``` text
HTTP request headers
        |
        v
HPACK encoder
  - choose indexed or literal representation
  - optionally Huffman-encode literal strings
  - update the dynamic table when required
        |
        v
Encoded HPACK header block
        |
        v
HTTP/2 HEADERS frame (and possibly CONTINUATION frames)
        |
        v
Server's HPACK decoder
  - parse each representation
  - look up table indices
  - decode literal strings
  - update its matching dynamic table
        |
        v
Reconstructed HTTP header list
```

HPACK compresses the **header block**. HTTP/2 framing carries that
block. HPACK does not Huffman-encode the HTTP/2 stream ID or the entire
HTTP message body.

For bidirectional HTTP communication, the client-to-server and
server-to-client HPACK contexts are independent. The server maintains a
decoding table for requests it receives and a separate encoding context
for response headers it sends.

## 3. The two tables

HPACK uses a static table and a dynamic table. Together, they form one
index space.

### 3.1 Static table

-   Defined by RFC 7541 Appendix A.
-   Contains **61 fixed entries**, indexed from 1 through 61.
-   Is read-only and known to both endpoints.
-   Contains complete name/value pairs, including entries with empty
    values.
-   Does not change as requests are sent.

Some important entries:

    Static index Header name          Header value
  -------------- -------------------- -----------------
               1 `:authority`         *(empty)*
               2 `:method`            `GET`
               3 `:method`            `POST`
               4 `:path`              `/`
               5 `:path`              `/index.html`
               6 `:scheme`            `http`
               7 `:scheme`            `https`
               8 `:status`            `200`
              16 `accept-encoding`    `gzip, deflate`
              31 `content-type`       *(empty)*
              54 `server`             *(empty)*
              61 `www-authenticate`   *(empty)*

If the exact header field is present in the static table, HPACK can
represent the whole field by its index. If only the name matches, the
name index can be used and the value sent as a literal.

**Important:** index 1 is not the complete field `:authority: ssw.in`.
It is `:authority` with an empty value. It can therefore be used as a
*name reference* when sending the value `ssw.in`.

### 3.2 Dynamic table

-   Built as header fields are encoded with **incremental indexing**.
-   Is specific to an HPACK encoding/decoding context.
-   Stores complete header name/value pairs.
-   Is ordered newest first.
-   Has a size limit and can evict older entries.

For a simple example, suppose the client inserts these two fields in
this order:

1.  `:authority: ssw.in`
2.  `x-server: express`

After both insertions, the newest entry is at index 62:

    Index Dynamic-table entry
  ------- ----------------------
       62 `x-server: express`
       63 `:authority: ssw.in`

The second insertion becomes index 62, and the earlier entry shifts to
index 63. Dynamic indices are **not permanent IDs**; later insertions
and evictions can change which entry an index identifies.

### 3.3 How static and dynamic indices fit together

``` text
Index 1–61   -> Static table (fixed)
Index 62     -> Newest dynamic-table entry
Index 63     -> Next-newest dynamic-table entry
Index 64     -> Next dynamic entry
...          -> Older dynamic entries
```

The static table ends at 61. Entries 62 and above refer to the dynamic
table, provided those entries exist in the current table state.

### 3.4 Dynamic table size

RFC 7541 defines the size of a dynamic-table entry as:

``` text
entry size = length of name in octets
           + length of value in octets
           + 32
```

The extra 32 octets are a protocol-defined accounting overhead. The
table has a maximum size, and entries are evicted from the oldest end
when necessary to make room. An entry that cannot fit under the
permitted limit cannot remain in the table.

A dynamic table is not a permanent browser/server cache. It belongs to
its HPACK context and is useful while that context remains active.

### Diagram 1 --- Static and dynamic tables

![HPACK static and dynamic table
diagram](images/hpack-static-and-dynamic-table.png)

*This diagram shows the fixed static table ending at index 61 and custom
dynamic entries following it. The exact dynamic indices depend on the
insertion history.*

## 4. The four important representation types

RFC 7541 Section 6 defines the binary representations. Each header field
in a header block is encoded using a representation that tells the
decoder how to interpret the following bits and bytes.

The diagrams below label bits from 0 to 7, as in the RFC. The first bit
is the most significant bit of the first octet.

### 4.1 Indexed Header Field Representation --- RFC §6.1

Use this when the **complete name/value pair** is already in the static
or dynamic table.

``` text
     0   1   2   3   4   5   6   7
   +---+---------------------------+
   | 1 |        Index (7+)         |
   +---+---------------------------+
```

-   The leading `1` identifies an indexed representation.
-   The remaining 7 bits hold the index when the value fits in the 7-bit
    prefix.
-   Index 0 is invalid.
-   The decoder looks up the entry and appends the complete field to the
    decoded header list.
-   This representation does **not** insert a new dynamic-table entry.

Examples:

  Header                   Static index   Encoded byte Binary
  ---------------------- -------------- -------------- ------------
  `:method: GET`                      2         `0x82` `10000010`
  `:path: /index.html`                5         `0x85` `10000101`
  `:scheme: https`                    7         `0x87` `10000111`

For a one-octet indexed representation, the first bit is 1 and the
remaining seven bits contain the index. For larger integers, HPACK's
variable-length integer encoding in §5.1 is used.

### 4.2 Literal Header Field Representation --- RFC §6.2

A literal representation sends a header value as a string literal. The
header name can either:

-   refer to an existing static/dynamic table entry, or
-   be sent as a literal string if no matching name is available.

The value is represented as a string literal. The literal representation
type determines whether the decoded header is added to the dynamic
table.

RFC 7541 defines three literal forms:

1.  **With incremental indexing** --- §6.2.1
2.  **Without indexing** --- §6.2.2
3.  **Never indexed** --- §6.2.3

The distinction is important: all three can carry literal strings, but
their table and security semantics differ.

### 4.3 Literal Header Field with Incremental Indexing --- RFC §6.2.1

Use this when the decoded header should be inserted into the dynamic
table for possible reuse.

#### Case A: the header name already exists

``` text
     0   1   2   3   4   5   6   7
   +---+---+-----------------------+
   | 0 | 1 |      Name Index (6+)  |
   +---+---+-----------------------+
   | H |     Value Length (7+)     |
   +---+---------------------------+
   | Value String (Length octets)  |
   +-------------------------------+
```

-   The first two bits are `01`.
-   The remaining 6-bit prefix carries the name index.
-   The name index must be nonzero for this indexed-name form.
-   `H` is the Huffman flag for the value string.
-   The value length indicates the number of encoded octets, not the
    number of decoded characters.

Example: `:authority: ssw.in`

Static index 1 contains the name `:authority`, so the encoder can send
the name index and a literal value.

``` text
First byte:  01000001 = 0x41
             ^^
             01 = literal with incremental indexing
               000001 = name index 1

Value length byte with Huffman:
             10000101 = 0x85
             ^ 0000101
             | 5 encoded octets
             H = 1
```

The Huffman-encoded value follows the length byte. The decoder resolves
name index 1, decodes the value, reconstructs `:authority: ssw.in`, adds
it to the header list, and inserts it into the dynamic table.

#### Case B: the header name is new

``` text
     0   1   2   3   4   5   6   7
   +---+---+-----------------------+
   | 0 | 1 |           0           |
   +---+---+-----------------------+
   | H |     Name Length (7+)      |
   +---+---------------------------+
   | Name String (Length octets)   |
   +-------------------------------+
   | H |     Value Length (7+)     |
   +---+---------------------------+
   | Value String (Length octets)  |
   +-------------------------------+
```

The initial pattern is `01`, and the name index is zero. The name is
then sent as a literal string, followed by the literal value string.

Example: `x-server: express`

The name `x-server` is not in the static table. In this example, the
encoder uses incremental indexing, so both strings are sent and the
decoded pair is inserted into the dynamic table.

### 4.4 Literal Header Field without Indexing --- RFC §6.2.2

Use this when the header should be included in the decoded header list
but **should not be added to the dynamic table**.

#### Existing name

``` text
     0   1   2   3   4   5   6   7
   +---+---+---+---+---+-----------+
   | 0 | 0 | 0 | 0 |  Index (4+)   |
   +---+---+---+---+---------------+
   | H |     Value Length (7+)     |
   +---+---------------------------+
   | Value String (Length octets)  |
   +-------------------------------+
```

-   The representation starts with `0000`.
-   A nonzero name index is encoded using a 4-bit prefix.
-   The value follows as a literal string.
-   The decoded field is appended to the header list, but the dynamic
    table remains unchanged.

#### New name

``` text
     0   1   2   3   4   5   6   7
   +---+---+---+---+---+---+---+---+
   | 0 | 0 | 0 | 0 |       0       |
   +---+---+---+---+---+---+---+---+
   | H |     Name Length (7+)      |
   +---+---------------------------+
   | Name String (Length octets)   |
   +-------------------------------+
   | H |     Value Length (7+)     |
   +---+---------------------------+
   | Value String (Length octets)  |
   +-------------------------------+
```

Here the name index is zero, so the name itself is a literal string.
Neither the name nor the value causes a new dynamic-table entry.

### 4.5 Literal Header Field Never Indexed --- RFC §6.2.3

Use this for a field that should be represented in a way that tells
intermediaries not to convert it into an indexed representation when
forwarding it. It is intended for values that should not be exposed to
risks associated with compression-based indexing, such as certain
sensitive fields.

#### Existing name

``` text
     0   1   2   3   4   5   6   7
   +---+---+---+---+---+-----------+
   | 0 | 0 | 0 | 1 |  Index (4+)   |
   +---+---+---+---+---------------+
   | H |     Value Length (7+)     |
   +---+---------------------------+
   | Value String (Length octets)  |
   +-------------------------------+
```

-   The representation starts with `0001`.
-   A name index can refer to the static or dynamic table.
-   The value is sent as a literal string.
-   The decoded header is added to the header list, but not to the
    dynamic table.
-   Intermediaries must preserve the never-indexed representation when
    forwarding the field.

#### New name

``` text
     0   1   2   3   4   5   6   7
   +---+---+---+---+---+---+---+---+
   | 0 | 0 | 0 | 1 |       0       |
   +---+---+---+---+---+---+---+---+
   | H |     Name Length (7+)      |
   +---+---------------------------+
   | Name String (Length octets)   |
   +-------------------------------+
   | H |     Value Length (7+)     |
   +---+---------------------------+
   | Value String (Length octets)  |
   +-------------------------------+
```

This has the same string structure as a literal without indexing, but
its first nibble is `0001` rather than `0000`.

**Never indexed does not mean encrypted.** It is a representation
instruction, not a cryptographic protection mechanism. HTTPS/TLS
protects data in transit; the never-indexed representation addresses
HPACK indexing behavior.

## 5. Integer and string encoding

### 5.1 Prefix integers --- RFC §5.1

Many HPACK fields use an integer prefix occupying part of the first
byte. The remaining bits may encode the integer directly. If the value
is too large for the prefix, additional octets carry the remainder using
HPACK's variable-length integer rules.

For example, an indexed representation has a 7-bit integer prefix
because one bit is used to identify the representation.

Do not assume that every HPACK integer always fits in one byte. The
simple examples in this README use values that fit.

### 5.2 String literals --- RFC §5.2

A string literal begins with a byte that contains:

-   `H = 0`: the string is not Huffman-encoded.
-   `H = 1`: the string is Huffman-encoded.
-   The remaining prefix bits encode the number of octets in the encoded
    string, using HPACK's integer representation.

The string bytes follow the length field. When Huffman coding is used,
the length is the number of **encoded bytes**, not the number of
original characters.

ASCII-compatible literal strings are not an extra compression stage
before HPACK. They are simply one possible byte representation when the
string is sent without Huffman coding.

## 6. Huffman coding, step by step

HPACK defines one fixed Huffman code in RFC 7541 Appendix B. It was
designed using statistics from HTTP header data. The encoder does not
invent a new Huffman tree for every request.

Huffman coding assigns bit strings of different lengths to symbols. In
the HPACK code, common characters such as lowercase letters often have
relatively short codes. The codes for a string are concatenated bit by
bit, then padded to an octet boundary when necessary.

### 6.1 Example: encode `ssw.in`

Using the exact Appendix B codes:

  Character   HPACK Huffman code      Bit length
  ----------- -------------------- -------------
  `s`         `01000`                          5
  `s`         `01000`                          5
  `w`         `1111000`                        7
  `.`         `010111`                         6
  `i`         `00110`                          5
  `n`         `101010`                         6
  **Total**                          **34 bits**

Concatenate the codes:

``` text
01000 01000 1111000 010111 00110 101010
```

Without spaces:

``` text
0100001000111100001011100110101010
```

The code occupies 34 bits. HPACK strings are carried in whole octets, so
six padding bits are needed to reach 40 bits. HPACK pads with the most
significant bits of the EOS code; in this case, that means six `1` bits.

Group the final bits into octets:

``` text
01000010 00111100 00101110 01101010 10111111
   0x42     0x3C     0x2E     0x6A     0xBF
```

Thus, the Huffman-encoded value is:

``` text
42 3C 2E 6A BF
```

Its encoded length is 5 octets. The string-length byte has `H = 1` and
length 5:

``` text
10000101 = 0x85
```

### 6.2 Full representation for `:authority: ssw.in`

We choose a literal header with incremental indexing, using static index
1 for the name and Huffman coding for the value.

**Byte 1 --- representation and name index**

``` text
     0   1   2   3   4   5   6   7
   +---+---+-----------------------+
   | 0 | 1 |      Name Index = 1   |
   +---+---+-----------------------+
     0   1   0   0   0   0   0   1

Binary: 01000001
Hex:    0x41
```

**Byte 2 --- Huffman flag and encoded value length**

``` text
     0   1   2   3   4   5   6   7
   +---+---------------------------+
   | H |     Value Length (7+)     |
   +---+---------------------------+
     1   0   0   0   0   1   0   1

H = 1
Length = 5 octets
Binary: 10000101
Hex:    0x85
```

**Bytes 3--7 --- Huffman-coded value**

``` text
01000010 00111100 00101110 01101010 10111111
   0x42     0x3C     0x2E     0x6A     0xBF
```

**Complete encoded sequence:**

``` text
41 85 42 3C 2E 6A BF
```

Binary, grouped by octet:

``` text
01000001 10000101 01000010 00111100 00101110 01101010 10111111
```

Total: **7 octets = 56 transmitted bits** for this HPACK representation.

### 6.3 Example: Huffman-encode `x-server: express`

The name `x-server` and value `express` can each be Huffman-encoded when
they are sent as literal strings.

For `x-server`, Appendix B gives:

``` text
x = 1111001
- = 010110
s = 01000
e = 00101
r = 101100
v = 1110111
e = 00101
r = 101100
```

Concatenated and padded:

``` text
11110010 10110010 00001011 01100111 01110010 11011001
   0xF2     0xB2     0x0B     0x67     0x72     0xD9
```

This is 47 Huffman bits plus one padding bit = 48 bits, or 6 octets.

For `express`:

``` text
e = 00101
x = 1111001
p = 101011
r = 101100
e = 00101
s = 01000
s = 01000
```

Concatenated and padded:

``` text
00101111 10011010 11101100 00101010 00010001
   0x2F     0x9A     0xEC     0x2A     0x11
```

This is 39 Huffman bits plus one padding bit = 40 bits, or 5 octets.

With incremental indexing and a new name, the full representation
includes: - the `01` representation prefix with name index zero
(`0x40`); - a Huffman name-length byte (`0x86`) for 6 encoded octets; -
the six encoded name bytes; - a Huffman value-length byte (`0x85`) for 5
encoded octets; - the five encoded value bytes.

Complete sequence:

``` text
40 86 F2 B2 0B 67 72 D9 85 2F 9A EC 2A 11
```

Total: **14 octets**.

Without Huffman coding, the same new-name incremental-indexing
representation uses: - `0x40` for incremental indexing with name index
zero; - `0x08` for the 8-byte name length; - 8 bytes for `x-server`; -
`0x07` for the 7-byte value length; - 7 bytes for `express`.

Total: **18 octets**. In this example, Huffman coding saves 4 octets.

Huffman coding does not guarantee a smaller result for every possible
string. HPACK permits literal strings with or without Huffman coding.

## 7. Worked example: the first request

For clarity, assume a new HTTP/2 connection, an empty dynamic table, and
this request header list:

``` http
:method: GET
:path: /index.html
:scheme: https
:authority: ssw.in
x-server: express
```

The encoder can choose the following representations:

  -----------------------------------------------------------------------
  Header                  Representation choice   Why
  ----------------------- ----------------------- -----------------------
  `:method: GET`          Indexed static entry 2  Exact field exists in
                                                  static table

  `:path: /index.html`    Indexed static entry 5  Exact field exists in
                                                  static table

  `:scheme: https`        Indexed static entry 7  Exact field exists in
                                                  static table

  `:authority: ssw.in`    Incremental indexing,   Static table has the
                          name index 1, Huffman   name but not this
                          value                   complete value

  `x-server: express`     Incremental indexing,   Name is not in static
                          literal name and value, table
                          Huffman strings         
  -----------------------------------------------------------------------

For the first three fields, the encoded bytes are:

``` text
:method: GET       -> 82 -> 10000010
:path: /index.html -> 85 -> 10000101
:scheme: https     -> 87 -> 10000111
```

The next representation is the `:authority` example from Section 6.2.1:

``` text
41 85 42 3C 2E 6A BF
```

The `x-server` representation is:

``` text
40 86 F2 B2 0B 67 72 D9 85 2F 9A EC 2A 11
```

For this specific encoding choice, the concatenated HPACK header block
is:

``` text
82 85 87
41 85 42 3C 2E 6A BF
40 86 F2 B2 0B 67 72 D9 85 2F 9A EC 2A 11
```

These choices are illustrative and valid for the stated table state.
HPACK allows other valid representations, so an encoder is not required
to choose exactly this sequence.

### Diagram 2 --- First request and HPACK encoding

![HPACK first request encoding
diagram](images/hpack-first-request-encoding.png)

*The first request can use static indices for common fields and literal
representations for fields that need to be transmitted. With incremental
indexing, decoded literal fields are added to the dynamic table.*

## 8. How the server decodes the first request

The server doesn't guess at the meaning of the bytes. It processes the
encoded header block in order, identifying each representation from its
leading bits and following that representation's format.

### 8.1 Decode `82`

``` text
82 hex = 10000010 binary
```

-   First bit `1`: indexed representation.
-   Remaining seven bits encode index 2.
-   Static index 2 is `:method: GET`.
-   The server appends that field to the decoded header list.

### 8.2 Decode `85` and `87`

``` text
85 = 10000101 -> static index 5 -> :path: /index.html
87 = 10000111 -> static index 7 -> :scheme: https
```

The server resolves both from its predefined static table. No literal
string or Huffman decoding is required for these entries.

### 8.3 Decode `41 85 42 3C 2E 6A BF`

1.  `41` (`01000001`) starts with `01`, meaning literal with incremental
    indexing. The name index is 1.
2.  Static index 1 gives the name `:authority`.
3.  `85` indicates Huffman coding (`H = 1`) and a value length of 5
    encoded octets.
4.  The next five bytes are Huffman-decoded to `ssw.in`.
5.  The server reconstructs `:authority: ssw.in`, appends it to the
    decoded header list, and inserts the complete field into the dynamic
    table.

### 8.4 Decode the `x-server` representation

``` text
40 86 F2 B2 0B 67 72 D9 85 2F 9A EC 2A 11
```

1.  `40` starts with `01` and has a zero name index. This means a
    literal new name with incremental indexing.
2.  `86` indicates a Huffman-coded name of 6 encoded octets.
3.  The next six bytes decode to `x-server`.
4.  `85` indicates a Huffman-coded value of 5 encoded octets.
5.  The final five bytes decode to `express`.
6.  The server reconstructs `x-server: express`, appends it to the
    decoded header list, and inserts it into the dynamic table.

At the end of this block, the server has reconstructed all five headers
and has updated its dynamic table.

### 8.5 Dynamic-table result

Since `:authority: ssw.in` was inserted first and `x-server: express`
second, the newest entry is at index 62:

    Dynamic index Name           Value
  --------------- -------------- -----------
               62 `x-server`     `express`
               63 `:authority`   `ssw.in`

The decoder and encoder must maintain matching table state. Otherwise, a
dynamic index might resolve to the wrong entry.

## 9. Worked example: the second request

Now suppose a later request on the **same HTTP/2 connection** uses the
same five header fields, and neither dynamic entry has been evicted.

The client can encode them as:

``` text
:method: GET       -> 82 -> static index 2
:path: /index.html -> 85 -> static index 5
:scheme: https     -> 87 -> static index 7
x-server: express  -> BE -> dynamic index 62
:authority: ssw.in -> BF -> dynamic index 63
```

The dynamic references are one octet each:

``` text
BE = 10111110 -> indexed representation, index 62
BF = 10111111 -> indexed representation, index 63
```

### 9.1 How the server interprets `BE`

``` text
     0   1   2   3   4   5   6   7
   +---+---------------------------+
   | 1 |        Index = 62         |
   +---+---------------------------+
   1   0   1   1   1   1   1   0
```

The server:

1.  Sees the leading `1` and recognizes an indexed representation.
2.  Reads index 62.
3.  Looks up dynamic entry 62.
4.  Retrieves `x-server: express`.
5.  Appends that field to the decoded header list.

It does **not** decode Huffman data here. The byte is a table reference,
not a string.

For `BF`, the server follows the same process and retrieves index 63,
which is `:authority: ssw.in`.

The server does not insert new entries for indexed representations. It
simply references the existing entries.

### Diagram 3 --- Second request and dynamic-table reuse

![HPACK second request dynamic table reuse
diagram](images/hpack-second-request-decoding.png)

*On a later request, table references can replace the repeated custom
strings. The server resolves each index using its current dynamic
table.*

## 10. Dynamic table state and indexing

### 10.1 Does the server store dynamic entries too?

**Yes.** The encoder and decoder maintain corresponding dynamic-table
state.

When the client sends a literal with incremental indexing: - the
client-side encoder updates its table as it encodes; - the server-side
decoder reconstructs the field and inserts the same entry as it decodes.

This allows a later request to reference the entry using an index. The
server doesn't need a separate message saying "please cache this
string"; the representation itself instructs the decoder to add the
field.

### 10.2 Why newest entries are at index 62

The static table occupies indices 1--61. Dynamic index 62 refers to the
newest entry, index 63 to the next-newest, and so on.

If the client inserts another entry, the new entry becomes index 62 and
existing dynamic entries shift. If an entry is evicted, it can no longer
be referenced.

Therefore, **dynamic index 62 does not permanently mean
`x-server: express`**. It means whatever entry is currently newest in
the dynamic table.

### 10.3 Is the dynamic table a permanent cache?

No. It is a connection-specific compression table: - It can be changed
by incremental insertions and size limits. - Old entries can be
evicted. - Its state is not automatically carried into a new
connection. - The request and response compression contexts are
independent.

### 10.4 Table-size updates --- RFC §6.3

HPACK also defines a dynamic table size update instruction:

``` text
     0   1   2   3   4   5   6   7
   +---+---+---+-------------------+
   | 0 | 0 | 1 |   Max size (5+)   |
   +---+---+---+-------------------+
```

It starts with the three-bit pattern `001`, followed by the new maximum
size encoded as an integer with a 5-bit prefix. A size update is a
table-management instruction, not a header field. It must appear in the
appropriate position in a header block, according to RFC 7541.

## 11. The complete static table (Appendix A)

The static table is fixed and contains these 61 entries. An empty value
means the static entry contains the name with an empty value; it does
not mean that every possible value for that name is already stored.

    Index Header name                     Header value
  ------- ------------------------------- -----------------
        1 `:authority`                    *(empty)*
        2 `:method`                       `GET`
        3 `:method`                       `POST`
        4 `:path`                         `/`
        5 `:path`                         `/index.html`
        6 `:scheme`                       `http`
        7 `:scheme`                       `https`
        8 `:status`                       `200`
        9 `:status`                       `204`
       10 `:status`                       `206`
       11 `:status`                       `304`
       12 `:status`                       `400`
       13 `:status`                       `404`
       14 `:status`                       `500`
       15 `accept-charset`                *(empty)*
       16 `accept-encoding`               `gzip, deflate`
       17 `accept-language`               *(empty)*
       18 `accept-ranges`                 *(empty)*
       19 `accept`                        *(empty)*
       20 `access-control-allow-origin`   *(empty)*
       21 `age`                           *(empty)*
       22 `allow`                         *(empty)*
       23 `authorization`                 *(empty)*
       24 `cache-control`                 *(empty)*
       25 `content-disposition`           *(empty)*
       26 `content-encoding`              *(empty)*
       27 `content-language`              *(empty)*
       28 `content-length`                *(empty)*
       29 `content-location`              *(empty)*
       30 `content-range`                 *(empty)*
       31 `content-type`                  *(empty)*
       32 `cookie`                        *(empty)*
       33 `date`                          *(empty)*
       34 `etag`                          *(empty)*
       35 `expect`                        *(empty)*
       36 `expires`                       *(empty)*
       37 `from`                          *(empty)*
       38 `host`                          *(empty)*
       39 `if-match`                      *(empty)*
       40 `if-modified-since`             *(empty)*
       41 `if-none-match`                 *(empty)*
       42 `if-range`                      *(empty)*
       43 `if-unmodified-since`           *(empty)*
       44 `last-modified`                 *(empty)*
       45 `link`                          *(empty)*
       46 `location`                      *(empty)*
       47 `max-forwards`                  *(empty)*
       48 `proxy-authenticate`            *(empty)*
       49 `proxy-authorization`           *(empty)*
       50 `range`                         *(empty)*
       51 `referer`                       *(empty)*
       52 `refresh`                       *(empty)*
       53 `retry-after`                   *(empty)*
       54 `server`                        *(empty)*
       55 `set-cookie`                    *(empty)*
       56 `strict-transport-security`     *(empty)*
       57 `transfer-encoding`             *(empty)*
       58 `user-agent`                    *(empty)*
       59 `vary`                          *(empty)*
       60 `via`                           *(empty)*
       61 `www-authenticate`              *(empty)*

Source: [RFC 7541 Appendix A --- Static Table
Definition](https://www.rfc-editor.org/rfc/rfc7541.html#appendix-A).

## 12. Security: without indexing vs never indexed

These two representations can look similar because neither adds the
decoded field to the dynamic table, but they are not identical.

  -----------------------------------------------------------------------
  Property                Without indexing        Never indexed (§6.2.3)
                          (§6.2.2)                
  ----------------------- ----------------------- -----------------------
  Added to decoded header Yes                     Yes
  list                                            

  Added to dynamic table  No                      No

  Representation prefix   `0000`                  `0001`

  Intended purpose        Avoid retaining a field Signal that the field
                          in the dynamic table    must remain
                                                  never-indexed when
                                                  forwarded

  Huffman strings allowed Yes                     Yes
  -----------------------------------------------------------------------

The never-indexed form is useful for sensitive values, such as certain
credentials, where compression-related attacks may be a concern.
However, it does not encrypt the value. Use TLS for transport
confidentiality and follow the protocol's security guidance.

RFC 7541 §7 discusses security concerns involving dynamic-table state
and Huffman coding.

## 13. Common misunderstandings

### "Does ASCII compression happen before HPACK?"

No. ASCII is a character encoding, not a compression algorithm. HPACK
chooses a representation and can optionally Huffman-encode literal
strings.

### "Does every header use Huffman coding?"

No. A complete table entry can be represented by an index, and literal
strings may be sent with or without Huffman coding.

### "Does Huffman coding apply to the index?"

No. Huffman coding is used for string literals. An indexed
representation carries an integer index.

### "Does the server have to receive the dynamic table separately?"

No. It updates its decoder-side dynamic table while processing literal
fields marked for incremental indexing.

### "Does index 62 always mean `x-server: express`?"

No. Index 62 means the newest dynamic entry at that moment. Inserting or
evicting entries can change the mapping.

### "Does an indexed representation insert a new entry?"

No. It only resolves an existing entry and appends the corresponding
header to the decoded header list.

### "Is never indexed the same as encrypted?"

No. Never indexed controls how the field is represented and forwarded in
HPACK; it is not encryption.

## 14. Quick reference

  -----------------------------------------------------------------------
  Representation    Leading bits      Dynamic table     Typical use
                                      effect            
  ----------------- ----------------- ----------------- -----------------
  Indexed (§6.1)    `1`               No insertion      Complete header
                                                        already exists

  Literal with      `01`              Inserts entry     Header may be
  incremental                                           reused later
  indexing (§6.2.1)                                     

  Literal without   `0000`            No insertion      Header should not
  indexing (§6.2.2)                                     be retained

  Literal never     `0001`            No insertion;     Sensitive field
  indexed (§6.2.3)                    preserve form     representation
                                      when forwarding   

  Dynamic table     `001`             Changes permitted Manage table
  size update                         maximum size      capacity
  (§6.3)                                                
  -----------------------------------------------------------------------

### The whole process in one sentence

**HPACK compresses HTTP/2 headers by replacing known fields with table
indices, sending only missing strings when necessary, optionally
Huffman-encoding those strings, and maintaining matching dynamic-table
state at both endpoints.**

## 15. RFC links

-   [RFC 7541 --- Complete
    specification](https://www.rfc-editor.org/rfc/rfc7541.html)
-   [§2.3 --- Indexing
    tables](https://www.rfc-editor.org/rfc/rfc7541.html#section-2.3)
-   [§5.1 --- Integer
    representation](https://www.rfc-editor.org/rfc/rfc7541.html#section-5.1)
-   [§5.2 --- String literal
    representation](https://www.rfc-editor.org/rfc/rfc7541.html#section-5.2)
-   [§6.1 --- Indexed header field
    representation](https://www.rfc-editor.org/rfc/rfc7541.html#section-6.1)
-   [§6.2.1 --- Literal with incremental
    indexing](https://www.rfc-editor.org/rfc/rfc7541.html#section-6.2.1)
-   [§6.2.2 --- Literal without
    indexing](https://www.rfc-editor.org/rfc/rfc7541.html#section-6.2.2)
-   [§6.2.3 --- Literal never
    indexed](https://www.rfc-editor.org/rfc/rfc7541.html#section-6.2.3)
-   [§6.3 --- Dynamic table size
    update](https://www.rfc-editor.org/rfc/rfc7541.html#section-6.3)
-   [Appendix A --- Static
    table](https://www.rfc-editor.org/rfc/rfc7541.html#appendix-A)
-   [Appendix B --- Huffman
    code](https://www.rfc-editor.org/rfc/rfc7541.html#appendix-B)
-   [Appendix C ---
    Examples](https://www.rfc-editor.org/rfc/rfc7541.html#appendix-C)
