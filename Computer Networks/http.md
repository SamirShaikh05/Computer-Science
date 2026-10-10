# HTTP Evolution: From HTTP/0.9 to HTTP/1.1

> These notes follow the supplied diagrams in sequence. They explain how
> HTTP messages evolved, how HTTP uses TCP connections, how HTTP/1.1
> reuses connections, how conditional caching with ETags works, and why
> HTTP/1.1 pipelining can suffer from head-of-line blocking.
>
> **Scope:** This document ends at the limitations of HTTP/1.1. HTTP/2
> will be added later as a continuation.

## Contents

-   [1. What is HTTP?](#1-what-is-http)
-   [2. HTTP/0.9 --- The one-line
    protocol](#2-http09--the-one-line-protocol)
-   [3. HTTP/1.0 --- A new TCP connection for each
    exchange](#3-http10--a-new-tcp-connection-for-each-exchange)
-   [4. HTTP/1.0 Keep-Alive --- Reusing a
    connection](#4-http10-keep-alive--reusing-a-connection)
-   [5. HTTP/1.1 --- Persistent connections by
    default](#5-http11--persistent-connections-by-default)
-   [6. Anatomy of an HTTP request](#6-anatomy-of-an-http-request)
-   [7. Anatomy of an HTTP response](#7-anatomy-of-an-http-response)
-   [8. ETag and conditional requests](#8-etag-and-conditional-requests)
-   [9. HTTP/1.1 pipelining](#9-http11-pipelining)
-   [10. Head-of-line blocking: the
    limitation](#10-head-of-line-blocking-the-limitation)
-   [11. Summary and comparison](#11-summary-and-comparison)

------------------------------------------------------------------------

## 1. What is HTTP?

![Introduction to HTTP: client, server, and
database](images/01-http-introduction.png)

**HTTP (Hypertext Transfer Protocol)** is an application-layer protocol
used by clients and servers to exchange requests and responses. A
browser, mobile app, command-line client, or frontend application can
send an HTTP request to a server. The server interprets it, performs the
required work, and returns an HTTP response.

### The roles of HTTP and TCP

It helps to separate the responsibilities of the protocols:

-   **HTTP defines the conversation:** request methods such as `GET` and
    `POST`, resource paths, headers, status codes, and message bodies.
-   **TCP provides a reliable byte stream:** when HTTP is carried over
    TCP, TCP handles connection establishment, ordered delivery,
    retransmission of lost segments, and connection closure.
-   **IP moves packets between hosts:** it provides addressing and
    routing across networks.
-   **TLS protects the connection:** HTTPS is HTTP carried over a
    TLS-protected connection. HTTP itself does not encrypt data.

For traditional HTTP/1.0 and HTTP/1.1 over TCP, the simplified stack is:

``` text
HTTP message
    ↓
TCP connection (reliable, ordered byte stream)
    ↓
IP packets (routing and addressing)
    ↓
Network
```

HTTP/3 is a later exception to the TCP pattern: it uses QUIC over UDP.
That is outside the scope of this document.

### What does "stateless" mean?

HTTP is stateless at the protocol level: an individual request does not
inherently require the server to remember the previous request.
Applications can still maintain state using cookies, sessions,
authentication tokens, databases, and other mechanisms.

### Example: browser → backend → database

Imagine a browser asks for a profile:

``` http
GET /profile HTTP/1.1
Host: example.com
```

The backend receives the request, may query a database, and then returns
a response such as:

``` http
HTTP/1.1 200 OK
Content-Type: application/json

{"name":"Sam","role":"student"}
```

The database interaction is **not itself part of HTTP** in this example.
It is work the backend performs before constructing the HTTP response.

### Why can frontend code use `fetch()` without writing "HTTP" manually?

``` js
const response = await fetch("/api/users");
const users = await response.json();
```

`fetch()` is a browser API. The browser constructs and sends an HTTP
request for the URL, manages the underlying network connection, receives
the HTTP response, and exposes it through the `Response` object.

For a POST request, the method is specified in the options:

``` js
await fetch("/api/users", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ name: "Sam" })
});
```

You are still using HTTP in both examples. `fetch()` is the JavaScript
interface; HTTP is the protocol used for the request and response. On
the backend, a framework such as Express maps incoming HTTP requests to
route handlers.

------------------------------------------------------------------------

## 2. HTTP/0.9 --- The one-line protocol

![HTTP/0.9 one-line protocol
reference](images/02-http-0.9-one-line-protocol.png)

HTTP/0.9 was extremely simple. A request consisted of the `GET` method
and a resource path. It did not include the modern request line format
with an HTTP version, headers, or a request body.

A simplified request looked like:

``` http
GET /my-page.html
```

The client had already connected to the intended server before sending
this line. The server and port were selected as part of establishing the
connection, so the request did not need to repeat the full URL.

### How could the connection be made without a full URL?

A URL such as:

``` text
https://example.com/my-page.html
```

contains several pieces of information:

-   `https` --- the scheme
-   `example.com` --- the host
-   `/my-page.html` --- the path

The browser uses the scheme and host to determine how and where to
connect. For HTTPS, it also establishes TLS. Once the connection is made
to the selected server, the HTTP/0.9 request only needs the path:

``` http
GET /my-page.html
```

The path is meaningful because the destination server is already known
from the connection. A path by itself would not tell a client which
server to contact.

### What did the response look like?

The response was simply the resource content. It did not have the status
line and headers familiar from later HTTP versions. For example, the
server might return the HTML file itself.

### Limitations

HTTP/0.9 was suitable for fetching simple documents, but it lacked
important capabilities later versions added:

-   No status code such as `404 Not Found`
-   No request or response headers
-   No content-type metadata in the HTTP response
-   No general request body for sending data
-   Only the `GET` method

These limitations motivated a richer message format.

------------------------------------------------------------------------

## 3. HTTP/1.0 --- A new TCP connection for each exchange

![HTTP/1.0 default request-response
flow](images/03-http-1.0-request-response-flow.png)

HTTP/1.0 introduced a more recognizable request and response format,
including a version in the request line, response status lines, and
headers.

A request could look like:

``` http
GET /index.html HTTP/1.0
```

And the response could look like:

``` http
HTTP/1.0 200 OK
Content-Type: text/html

<html>...</html>
```

### The usual HTTP/1.0 connection pattern

In the common HTTP/1.0 behavior shown in the diagram:

1.  The client establishes a TCP connection using the three-way
    handshake.
2.  The client sends an HTTP request.
3.  The server returns the HTTP response.
4.  The TCP connection is closed.
5.  If the browser needs another resource, it establishes another TCP
    connection.

A web page may require HTML, CSS, JavaScript, images, and other
resources. If each exchange uses a new TCP connection, repeated
connection setup adds latency and overhead.

**Important nuance:** closing after each response describes the usual
HTTP/1.0 behavior, not an unbreakable rule for every implementation.
Keep-alive extensions allowed connections to be reused.

------------------------------------------------------------------------

## 4. HTTP/1.0 Keep-Alive --- Reusing a connection

![HTTP/1.0 keep-alive reuses one TCP
connection](images/04-http-1.0-keep-alive.png)

To avoid opening a new TCP connection for every resource, HTTP/1.0
implementations could negotiate persistent connections using the
`Connection: keep-alive` header.

For example:

``` http
GET /index.html HTTP/1.0
Host: example.com
Connection: keep-alive
```

The server could reply with the resource and indicate that it will keep
the connection open:

``` http
HTTP/1.0 200 OK
Content-Type: text/html
Connection: keep-alive

<html>...</html>
```

The client could then send another request over that same TCP
connection:

``` http
GET /image.jpg HTTP/1.0
Host: example.com
Connection: keep-alive
```

### Why does this help?

The TCP three-way handshake is not repeated for every request. Reusing
an established connection can reduce latency and resource overhead,
especially when the browser needs several resources from the same
server.

### What Keep-Alive does not mean

-   It does **not** merge multiple HTTP requests into one message.
-   It does **not** mean the connection stays open forever.
-   It does **not** guarantee the next request will use that connection.
-   It does **not** change what an HTTP request or response contains.

HTTP messages remain separate. Keep-alive changes the lifetime and reuse
of the underlying connection.

The connection may eventually close because of an idle timeout, server
policy, client policy, or a network failure.

------------------------------------------------------------------------

## 5. HTTP/1.1 --- Persistent connections by default

![HTTP/1.1 persistent connection with sequential request-response
exchanges](images/05-http-1.1-persistent-connections.png)

HTTP/1.1 made persistent connections the default. Unlike the optional
keep-alive approach commonly used with HTTP/1.0, HTTP/1.1 normally keeps
the TCP connection open for reuse unless a party closes it or
connection-management rules require closure.

A simplified exchange might be:

``` text
TCP handshake
    ↓
GET /index.html  ──────────────→
                 ←──────────────  200 OK + HTML
GET /image.jpg   ──────────────→
                 ←──────────────  200 OK + image
GET /about.html  ──────────────→
                 ←──────────────  200 OK + HTML
    ↓
Connection eventually closes
```

### One connection, separate HTTP messages

The same TCP connection can carry many HTTP request-response exchanges.
The requests are still distinct messages with their own methods, paths,
headers, and responses.

In the common non-pipelined HTTP/1.1 pattern shown above, the client
waits for the full response to one request before sending the next
request on that connection.

This is useful because it avoids repeating the TCP handshake, but the
waiting behavior can add delays when many resources need to be fetched.

### What if the connection times out or breaks?

Persistent does not mean permanent. For example:

1.  The browser requests `/users` and receives a response.
2.  The connection remains idle.
3.  The server closes it after an idle timeout.
4.  Later, the browser needs `/products`.
5.  The browser's networking layer establishes a new TCP connection if
    no suitable reusable connection is available, then sends the
    request.

Your JavaScript usually does not have to manage this manually:

``` js
const users = await fetch("/api/users");
const products = await fetch("/api/products");
```

Two calls to `fetch()` do not necessarily mean two TCP connections. The
browser manages a pool of connections and may reuse an appropriate one.
If a connection fails during a request, `fetch()` may reject with a
network error; automatic retry is not guaranteed.

------------------------------------------------------------------------

## 6. Anatomy of an HTTP request

![Example HTTP request and its
headers](images/06-http-request-structure.png)

An HTTP/1.1 request has a request line, headers, a blank line,
and---when needed---a message body.

A simplified example:

``` http
GET /api/v1/public/randomusers?page=1&limit=10 HTTP/1.1
Host: api.example.com
Accept: application/json
Accept-Language: en-US,en;q=0.9
Accept-Encoding: gzip, deflate, br
Connection: keep-alive
```

### 1. Request line

``` http
GET /api/users HTTP/1.1
```

-   `GET` is the method.
-   `/api/users` is the request target (the path, optionally with a
    query string).
-   `HTTP/1.1` is the HTTP version.

Common methods include `GET` to retrieve a representation, `POST` to
submit data or request processing, `PUT` to replace a resource
representation, `PATCH` to partially update a resource, and `DELETE` to
request deletion.

### 2. Headers

Headers carry metadata about the request. In the supplied example:

  -----------------------------------------------------------------------
  Header                              Purpose
  ----------------------------------- -----------------------------------
  `Host`                              Identifies the target host.
                                      Required in HTTP/1.1 requests.

  `Accept`                            Describes response media types the
                                      client can accept.

  `Accept-Language`                   Expresses language preferences.

  `Accept-Encoding`                   Lists supported content encodings,
                                      such as gzip or Brotli.

  `Connection`                        Communicates connection-management
                                      preferences in HTTP/1.x.

  `Cookie`                            Sends applicable cookies to the
                                      server.

  `User-Agent`                        Describes the client software,
                                      although details vary.

  `Referer`                           Indicates the referring URL when
                                      policy permits it.
  -----------------------------------------------------------------------

Browsers also add headers related to fetch metadata, client hints,
caching, authentication, and other features depending on the request.

### 3. Blank line

A blank line separates the headers from the message body.

### 4. Optional body

A `GET` request commonly has no body. A `POST` request may carry JSON or
other data:

``` http
POST /api/users HTTP/1.1
Host: api.example.com
Content-Type: application/json

{"name":"Sam","role":"student"}
```

The `Content-Type` header describes the format of the body being sent.
The server framework parses the body and passes the result to the
relevant handler.

**Remember:** `fetch()` is the API you call in JavaScript; the browser
turns that call into a network request with an HTTP method, headers, and
possibly a body.

------------------------------------------------------------------------

## 7. Anatomy of an HTTP response

![Example HTTP response and response
headers](images/07-http-response-structure.png)

A response has a status line, headers, a blank line, and---when the
response carries one---a message body.

Example:

``` http
HTTP/1.1 200 OK
Server: nginx/1.18.0
Content-Type: application/json; charset=utf-8
Content-Length: 10757
Connection: keep-alive
ETag: W/"2a05-xjkqHU4sNAeFPZX9uGNeI7XPn8E"

{"users":[...]}
```

### 1. Status line

``` http
HTTP/1.1 200 OK
```

-   `HTTP/1.1` is the protocol version.
-   `200` is the status code.
-   `OK` is the reason phrase.

Useful status codes include:

-   `200 OK` --- the request succeeded.
-   `201 Created` --- a resource was created.
-   `304 Not Modified` --- the client can reuse a valid cached
    representation.
-   `400 Bad Request` --- the request could not be handled as sent.
-   `401 Unauthorized` --- authentication is required or failed.
-   `403 Forbidden` --- the server refuses the request.
-   `404 Not Found` --- the requested resource was not found.
-   `500 Internal Server Error` --- the server encountered an unexpected
    error.

### 2. Response headers

  -----------------------------------------------------------------------
  Header                              Meaning
  ----------------------------------- -----------------------------------
  `Content-Type`                      Describes the media type of the
                                      response body.

  `Content-Length`                    Gives the body length in bytes when
                                      present and applicable.

  `Connection`                        Communicates connection-management
                                      behavior in HTTP/1.x.

  `ETag`                              Supplies a validator for a selected
                                      representation.

  `Cache-Control`                     Gives caching directives.

  `Date`                              Indicates when the message was
                                      generated.

  `Access-Control-Allow-Origin`       A CORS response header that
                                      controls which origins may access a
                                      response through browser CORS
                                      checks.
  -----------------------------------------------------------------------

`X-Powered-By: Express`, if present, is an implementation-identification
header rather than a requirement of HTTP.

### 3. Response body

For JSON APIs, the body often contains JSON. For a page, it may contain
HTML. For an image, it contains image bytes. HTTP is not limited to one
particular data format.

### What does `Content-Length: 10757` mean?

It indicates a body length of 10,757 bytes when the header applies. It
does not mean 10,757 characters: UTF-8 characters can take different
numbers of bytes. It also does not include the response headers
themselves.

### Why does the response have `Connection: keep-alive`?

It signals that the connection is intended to remain reusable under
HTTP/1.x connection-management rules. For HTTP/1.1, persistence is
already the default, so the header is generally unnecessary unless a
particular connection behavior is being indicated.

------------------------------------------------------------------------

## 8. ETag and conditional requests

![ETag generation, If-None-Match, 304 Not Modified, and cache
update](images/08-http-etag-conditional-requests.png)

An **ETag (entity tag)** is a validator associated with a particular
representation of a resource. A server may generate it using a content
hash, a version identifier, or another method. An ETag is **not
guaranteed to be a hash**.

ETags can help a browser validate a cached response without downloading
the same response body again when the representation has not changed.

### First request: fetch and cache the resource

The browser requests a resource:

``` http
GET /api/users HTTP/1.1
Host: api.example.com
```

The server responds with data and an ETag:

``` http
HTTP/1.1 200 OK
Content-Type: application/json
ETag: "users-v1"

{"users":[{"id":1,"name":"Sam"}]}
```

The browser may cache the response body and the ETag, subject to caching
rules. The example ETag `"users-v1"` is illustrative; real tags may look
quite different.

### Second request: ask whether the representation changed

When the browser needs to validate its cached copy, it can send the
saved ETag in `If-None-Match`:

``` http
GET /api/users HTTP/1.1
Host: api.example.com
If-None-Match: "users-v1"
```

The server compares the validator with the current representation.

#### Case A: The representation has not changed

The server can respond:

``` http
HTTP/1.1 304 Not Modified
ETag: "users-v1"
```

A `304 Not Modified` response has no response body. The browser can use
its stored representation rather than downloading the JSON again.

**The server does not send the old JSON back in the 304 response.** The
browser reuses the cached body it already has.

#### Case B: The representation has changed

If the validator no longer matches, the server sends a normal response
with the current data and a new validator:

``` http
HTTP/1.1 200 OK
Content-Type: application/json
ETag: "users-v2"

{"users":[{"id":1,"name":"Sam"},{"id":2,"name":"Aisha"}]}
```

The browser can then update its cached representation and validator.

### ETag versus cache storage

These are related but different things:

-   **ETag:** a validator that helps determine whether a representation
    has changed.
-   **Cached response:** the stored headers and response body that may
    be reused.
-   **`If-None-Match`:** a request header that sends a previously stored
    ETag for validation.
-   **`304 Not Modified`:** tells the client that its stored
    representation can be reused under the applicable caching rules.
-   **`Cache-Control`:** helps determine whether a response may be
    stored and when it needs validation.

ETag validation is not automatic for every `fetch()` call. It depends on
the browser's cache behavior, request options, response headers, and how
the resource is being fetched.

### Why is this useful?

When a representation has not changed, validation can avoid
retransferring a large response body. The browser still sends a request
and the server still does some work, but the response can be much
smaller than a full `200 OK` response containing the resource.

------------------------------------------------------------------------

## 9. HTTP/1.1 pipelining

![HTTP/1.1 pipelining: requests sent back-to-back and responses returned
in order](images/09-http-1.1-pipelining-hol-blocking.png)

HTTP/1.1 pipelining allows a client to send multiple requests over one
persistent connection without waiting for the response to each earlier
request.

For example, over a single TCP connection the client may send:

``` http
GET /large-video.mp4 HTTP/1.1
Host: example.com

GET /image.jpg HTTP/1.1
Host: example.com

GET /about.html HTTP/1.1
Host: example.com
```

This illustrates the idea, not a literal complete wire-format capture:
each request has its own message framing, and real requests would be
sent as distinct HTTP messages.

The key difference from the common non-pipelined pattern is that the
client does not wait for the first response before sending the second
and third requests.

### What benefit was intended?

Pipelining was intended to reduce the delays caused by waiting for one
response before sending the next request, while still reusing a
persistent TCP connection.

### The ordering restriction

In HTTP/1.1 pipelining, the server must send responses in the same order
as their corresponding requests. It cannot send the small `/image.jpg`
response first merely because it was processed more quickly if the
response for `/large-video.mp4` is still ahead of it in the pipeline.

That restriction leads to the main problem discussed next.

### Pipelining is not the same as multiplexing

-   **Persistent connection:** reuse one connection for multiple
    exchanges.
-   **Pipelining:** send multiple requests before receiving their
    corresponding responses, but preserve response order.
-   **Multiplexing:** interleave independent streams of data on one
    connection. HTTP/1.1 does not provide HTTP/2-style multiplexing.

Pipelining exists in the HTTP/1.1 specification, but it has not been
widely used by modern browsers and is generally disabled. Its ordering
behavior and implementation complications reduce its practical appeal.

------------------------------------------------------------------------

## 10. Head-of-line blocking: the limitation

### The example

Imagine the browser sends three pipelined requests over one HTTP/1.1
connection:

1.  `GET /large-video.mp4` --- a large response that takes a long time
    to produce or transmit.
2.  `GET /image.jpg` --- a small response that becomes ready quickly.
3.  `GET /about.html` --- another small response that becomes ready
    quickly.

The server may be able to prepare the image and HTML responses before
the video response has finished. However, HTTP/1.1 pipelined responses
must be sent in request order.

Therefore, the image and HTML responses wait behind the earlier video
response.

### What "head-of-line" means

The **head** is the first response in the ordered sequence. The **line**
is the queue of responses behind it. If the first response cannot
finish, later responses are held up even if they are ready.

``` text
Request order:
1. Large video  ───────────────────────────────→
2. Small image  ───── ready, but must wait ────→
3. Small HTML   ───── ready, but must wait ────→

Required response order:
1. Video response
2. Image response
3. HTML response
```

The user may wait for the image or HTML even though those smaller
resources were ready sooner.

### Why does this reduce performance?

-   A slow or large early response delays later responses.
-   The client cannot receive those later pipelined responses out of
    order.
-   The benefit expected from sending requests back-to-back may be
    reduced or lost.
-   The behavior makes pipelining less attractive in practice.

### Two different kinds of head-of-line blocking

It is useful to distinguish two related problems:

**1. HTTP-level head-of-line blocking**

This is the ordering issue shown in the supplied diagram. HTTP/1.1
pipelined responses must be returned in request order. A slow first
response delays later responses on that pipeline.

**2. TCP-level head-of-line blocking**

HTTP/1.1 messages share a TCP byte stream. TCP delivers bytes in order.
If a TCP segment is lost, later bytes may not be delivered to the
application until the missing bytes are retransmitted, even if later
segments arrived at the receiver. This can affect data later in that
same TCP connection.

These are distinct mechanisms. The supplied pipelining diagram primarily
illustrates HTTP response-order blocking; TCP's ordered byte stream
introduces a separate transport-level limitation.

### Why is pipelining usually disabled?

Pipelining allows requests to be sent without waiting, but its
response-order requirement can still delay useful content. In addition,
implementation and compatibility concerns made it difficult to use
broadly. As a result, ordinary HTTP/1.1 browser traffic commonly uses
persistent connections without pipelining, sending the next request
after the previous response has been received on that connection.

**Do not confuse this with persistent connections themselves.**
Keep-alive remains useful; pipelining is the optional feature with the
ordering limitation.

------------------------------------------------------------------------

## 11. Summary and comparison

  -----------------------------------------------------------------------
  Feature           HTTP/0.9          HTTP/1.0          HTTP/1.1
  ----------------- ----------------- ----------------- -----------------
  Request format    One-line `GET`    Versioned request Versioned request
                    plus path         line and headers  line and headers

  Response status   No                Yes               Yes
  line                                                  

  Headers           No                Yes               Yes

  Common connection Simple, early     Usually close     Persistent
  behavior          protocol          after each        connections by
                                      exchange          default

  Keep-alive        Not part of the   Optional          Persistence is
                    original model    extension /       the default
                                      negotiation       

  Multiple requests Not the modern    Possible with     Supported
  on a reused       model             keep-alive        
  connection                          implementations   

  Pipelining        No                No standard       Specified, but
                                      HTTP/1.0          not widely used
                                      pipelining model  

  Main limitation   Extremely limited Repeated TCP      Pipelining
  highlighted here  message format    setup without     response ordering
                                      reuse             can cause HOL
                                                        blocking
  -----------------------------------------------------------------------

### Key takeaways

1.  **HTTP defines messages; TCP manages the connection.** HTTP methods,
    headers, status codes, and bodies are not the same thing as TCP
    handshakes.
2.  **A URL and an HTTP request target are different.** The browser uses
    the URL to locate the server; once connected, the request can carry
    only the relevant path and query.
3.  **HTTP/1.0 commonly opened a connection for each exchange.**
    Keep-alive could allow reuse.
4.  **HTTP/1.1 made persistent connections the default.** A connection
    can be reused, but it can still close or time out.
5.  **ETag enables conditional validation.** If the representation is
    unchanged, `304 Not Modified` lets the browser reuse a cached body.
6.  **Pipelining and keep-alive are different.** Keep-alive reuses the
    connection; pipelining sends multiple requests before receiving
    their responses.
7.  **HTTP/1.1 pipelining can suffer from head-of-line blocking.**
    Responses must stay in request order, so a slow first response can
    delay smaller later responses.

### Where these notes stop

HTTP/1.1 improved connection reuse and introduced richer
request/response features, but pipelining did not provide independent,
out-of-order response delivery. That limitation is an important
motivation for studying what came next.

**HTTP/2 will be added as a separate continuation later.**
