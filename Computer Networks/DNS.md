# How DNS Works --- Complete DNS Resolution Guide

This README explains DNS using the two included diagrams and the
complete discussion about recursive resolvers, Root servers, TLD
servers, authoritative name servers, caching, TTL, delegation, multiple
servers, and who actually performs DNS resolution.

## 1. Why do we need DNS?

Humans prefer names such as `github.com`, while network communication
ultimately uses IP addresses. DNS provides a distributed **name → DNS
record** lookup system.

DNS is useful because: - names are easier for humans than IP
addresses; - an IP can change while the domain stays the same; - DNS can
return different addresses for traffic distribution, geographic routing,
CDNs, etc.; - DNS can provide records other than IP addresses; - normal
DNS commonly uses UDP port 53, with TCP 53 also used when required.

DNS is better thought of as **name resolution**, not a magical permanent
conversion.

## 2. Understanding `api.example.com.`

Read a DNS name from right to left:

``` text
api.example.com.
│   │       │   └── root (`.`)
│   │       └────── TLD (`com`)
│   └────────────── domain (`example.com`)
└────────────────── subdomain/host label (`api`)
```

The final dot is the DNS root and is normally omitted when humans write
the name.

## 3. A record

An A record maps a DNS name to an IPv4 address:

``` text
example.com    A    14.10.10.1
```

Other common records include `AAAA` (IPv6), `NS` (name servers), `CNAME`
(alias), `MX` (mail), and `TXT`.

The authoritative mapping can change. The domain name can remain
unchanged.

![DNS basics](images/HOW%20DNS%20WORKS.png)

# 4. The DNS components

The important roles are:

1.  Client / laptop
2.  Browser and OS caches
3.  Recursive DNS resolver
4.  Root DNS servers
5.  TLD DNS servers
6.  Authoritative DNS servers

The **recursive resolver is the worker**: it performs the lookup on
behalf of the client.

## 5. Client, browser and OS cache

A lookup may first use local caches:

``` text
Browser cache
    ↓
OS DNS cache
    ↓
Recursive resolver
```

A valid local cache entry can avoid a DNS query entirely.

## 6. Recursive DNS resolver

Example: `8.8.8.8` (Google Public DNS).

The client asks:

``` text
What is the IP of github.com?
```

The resolver: - checks its cache; - starts at the Root if needed; -
follows referrals; - chooses appropriate servers; - gets the final DNS
record; - caches it according to TTL; - returns the answer to the
client.

It does **not** permanently contain every domain → IP mapping.

### How does it know where to start?

Recursive resolver software has **root hints** / root-server
information. Conceptually:

``` text
Root A
Root B
...
Root M
```

There are 13 logical root-server identities (A--M), with many anycast
instances worldwide.

The resolver therefore already knows how to reach the Root system.

## 7. Cache hit vs cache miss

If the resolver already has:

``` text
github.com → IP
```

and the TTL is still valid:

``` text
Client → Resolver → cache hit → IP
```

It does not need to contact Root, TLD, or authoritative DNS.

If the answer is missing or expired:

``` text
Client → Resolver → Root → TLD → Authoritative → Resolver → Client
```

## 8. TTL

A record may have:

``` text
github.com → 11.22.33.44
TTL = 300 seconds
```

TTL controls how long a resolver may use its cached copy.

After expiry, the resolver must refresh the information.

This is why DNS can be fast while still allowing records to change.

# 9. Root DNS server

The Root does **not** normally know the final IP of `github.com`.

Its job is to provide the next delegation.

For example:

``` text
.com → .com TLD name servers
.org → .org TLD name servers
.net → .net TLD name servers
.in  → .in TLD name servers
```

So the resolver asks:

> Who handles `.com`?

The Root replies, in effect:

> I do not have the final answer for `github.com`; here are the servers
> for `.com`.

This is a **referral/delegation**.

## Multiple Root servers

There are 13 logical Root server identities, A through M, but many
physical anycast instances.

The resolver does not query all of them. It can choose a suitable
reachable server based on information such as reachability, previous
success/failure and response performance.

The Root gives the resolver the **next level**; the resolver decides
which available server to query.

# 10. `.com` TLD DNS

After receiving the `.com` delegation, the resolver queries a `.com` TLD
server:

> Who is authoritative for `github.com`?

The `.com` TLD does not normally provide the final `github.com → IP`
answer.

Instead, it provides the delegation:

``` text
github.com → NS1
github.com → NS2
github.com → NS3
```

In other words:

> The TLD answers **"Who should I ask about github.com?"**

not:

> "What is the IP of github.com?"

# 11. Authoritative DNS

The authoritative name servers are the final source of the domain's
authoritative DNS records.

The resolver asks:

``` text
What is the A record for github.com?
```

The authoritative server can return:

``` text
github.com    A    <IPv4 address>
TTL = 300
```

This is where the authoritative `domain → DNS record` mapping is served.

The authoritative server may also serve:

``` text
A
AAAA
NS
CNAME
MX
TXT
...
```

## Who actually stores the mapping?

The **authoritative DNS infrastructure for the domain** is the source of
truth for the domain's DNS zone.

The recursive resolver may also have:

``` text
github.com → IP
```

but that is a **cached copy**, not the authoritative source.

So:

``` text
Authoritative DNS
    ↓
source of authoritative record

Recursive Resolver
    ↓
cached copy
```

# 12. Why are there multiple authoritative servers?

A domain can have multiple authoritative name servers:

``` text
github.com
   ├── NS1
   ├── NS2
   └── NS3
```

This provides redundancy and availability.

If:

``` text
NS1 ❌
```

the resolver can try:

``` text
NS2 ✓
```

The resolver normally does **not** ask every authoritative server for
the same answer.

It selects one suitable server and uses another if the first fails or is
unsuitable.

# 13. How does the resolver know the next server?

The key idea is that the resolver learns the next step dynamically.

``` text
START
  ↓
Root hints tell resolver how to reach Root
  ↓
Root says: "Here are .com servers"
  ↓
Resolver chooses a .com server
  ↓
TLD says: "Here are github.com's authoritative servers"
  ↓
Resolver chooses an authoritative server
  ↓
Authoritative server returns the actual record
```

The resolver is therefore not required to know every domain's
authoritative server beforehand.

## Glue records

A delegation can also include additional address information when
necessary.

For example, conceptually:

``` text
github.com NS ns1.github.com
ns1.github.com A 192.0.2.10
```

The additional A/AAAA information can act as **glue** when needed to
break a dependency where the resolver needs the name server's address in
order to contact that name server.

# 14. The complete lookup

Assume `github.com` is not cached:

``` text
Laptop
   │
   │ "What is the IP of github.com?"
   ↓
Recursive Resolver (8.8.8.8)
   │
   │ cache miss
   ↓
Root
   │
   │ ".com is handled by these TLD servers"
   ↓
.com TLD
   │
   │ "github.com is delegated to these NS"
   ↓
Authoritative DNS
   │
   │ "github.com A <IP>"
   ↓
Recursive Resolver
   │
   │ caches answer using TTL
   ↓
Laptop
```

![DNS resolution](images/DNS%20Resolution%20Diagram.png)

# 15. Who does all the work?

**The recursive resolver does the active resolution work.**

It: - receives the client's query; - checks its cache; - uses root hints
to reach the Root; - interprets the Root referral; - selects a TLD
server; - interprets the TLD delegation; - selects an authoritative
server; - retrieves the actual record; - caches the result; - returns it
to the client.

Think of it as a **detective**:

``` text
Resolver: "Where do I start?"
Root: "Ask .com."

Resolver: "Who handles github.com?"
TLD: "Ask these authoritative servers."

Resolver: "What is github.com's A record?"
Authoritative: "Here is the IP."

Resolver: "I'll cache it and return it."
```

# 16. Recursive vs iterative

From the **client's perspective**, the resolver provides a recursive
service:

``` text
Client → Resolver
"Find the answer for me."
```

The client does not need to contact Root, TLD and authoritative servers
itself.

Between the **resolver and the DNS hierarchy**, the resolver follows
referrals:

``` text
Resolver → Root → referral
Resolver → TLD → referral
Resolver → Authoritative → answer
```

So the resolver is doing the iterative work internally while presenting
a recursive service to the client.

# 17. What does each component know?

  -----------------------------------------------------------------------
  Component                           Main information / responsibility
  ----------------------------------- -----------------------------------
  Browser / OS cache                  Previously resolved records

  Recursive Resolver                  Cache + root hints + resolver
                                      logic; performs the lookup

  Root DNS                            Which name servers handle each TLD

  `.com` TLD DNS                      Which authoritative name servers
                                      handle each `.com` domain

  Authoritative DNS                   Actual DNS records for its zone

  Client                              Usually asks the recursive resolver
  -----------------------------------------------------------------------

The hierarchy is:

``` text
ROOT
  │
  │ .com → TLD servers
  ↓
TLD
  │
  │ github.com → authoritative NS
  ↓
AUTHORITATIVE
  │
  │ github.com → A → IP
  ↓
IP
```

# 18. The most important mental model

Do not memorize DNS only as:

``` text
Laptop → Resolver → Root → TLD → Authoritative
```

Memorize the **question answered at each level**:

### Recursive Resolver

> **"I'll find the answer for you."**

### Root

> **"Who handles `.com`?"**

``` text
.com → TLD servers
```

### `.com` TLD

> **"Who handles `github.com`?"**

``` text
github.com → authoritative NS
```

### Authoritative DNS

> **"What is the actual DNS record for `github.com`?"**

``` text
github.com → A → IP
```

### Recursive Resolver

> **"I'll cache that answer and return it to the client."**

# 19. Final picture

``` text
                  ┌─────────────────┐
                  │      ROOT       │
                  │                 │
                  │ .com → TLD NS   │
                  └────────┬────────┘
                           │
                           ↓
                  ┌─────────────────┐
                  │    .COM TLD     │
                  │                 │
                  │ github.com      │
                  │   → Auth NS     │
                  └────────┬────────┘
                           │
                           ↓
                  ┌─────────────────┐
                  │ AUTHORITATIVE   │
                  │      DNS        │
                  │                 │
                  │ github.com      │
                  │    → A → IP     │
                  └────────┬────────┘
                           │
                           ↓
                       IP address


       ┌─────────────────────────────────┐
       │       RECURSIVE RESOLVER        │
       │                                 │
       │ • starts with root hints        │
       │ • follows referrals             │
       │ • chooses DNS servers           │
       │ • gets final record             │
       │ • caches using TTL              │
       │ • returns answer to client      │
       └────────────────┬────────────────┘
                        │
                        ↓
                     CLIENT
```

## One sentence to remember for interviews

> **The recursive DNS resolver performs the resolution on behalf of the
> client: it starts with its root hints, follows referrals from the Root
> to the appropriate TLD and then to the authoritative name servers,
> obtains the final DNS record, caches it according to its TTL, and
> returns the result to the client.**

## The ownership distinction

``` text
ROOT
└── TLD → TLD name servers

TLD
└── domain → authoritative name servers

AUTHORITATIVE DNS
└── domain → actual DNS records

RECURSIVE RESOLVER
└── cached copies + lookup logic
```

That distinction is the foundation for understanding the entire DNS
resolution process.
