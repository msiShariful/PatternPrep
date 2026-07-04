// Beyond DSA content: System Design, Databases & SQL, CS Fundamentals.
// Plain browser script. Exposes window.BEYOND_DSA.

window.BEYOND_DSA = {
  systemDesign: {
    id: "system-design",
    name: "System Design",
    intro: `System design interviews test whether you can take a vague product requirement ("design Twitter") and turn it into a concrete architecture, reasoning out loud about scale, trade-offs, and failure modes. Unlike coding rounds there is no single correct answer — interviewers grade the process: clarifying requirements, estimating load, proposing a simple design first, then evolving it as you identify bottlenecks.

The topics below are the vocabulary of that conversation: horizontal scaling, load balancing, caching, storage choices, asynchronous processing, and consistency. Master each concept well enough to explain <strong>when</strong> you would use it and <strong>what it costs you</strong> — every system design answer is ultimately a trade-off argument.`,
    topics: [
      {
        id: "scalability-basics",
        title: "Scalability Basics",
        summary: `Vertical vs horizontal scaling, stateless services, and why statelessness is the prerequisite for scaling out.`,
        blocks: [
          { type: "p", text: `Scalability is a system's ability to handle growing load by adding resources. There are two directions: <strong>vertical scaling</strong> (scale up — a bigger machine) and <strong>horizontal scaling</strong> (scale out — more machines). Interviewers expect you to reach for horizontal scaling for web-scale systems, but to know why vertical scaling is often the right first move.` },
          { type: "h3", text: "Vertical vs horizontal" },
          { type: "table", headers: ["Dimension", "Vertical (scale up)", "Horizontal (scale out)"], rows: [
            ["How", "Add CPU/RAM/faster disk to one node", "Add more commodity nodes behind a load balancer"],
            ["Complexity", "Low — no code changes", "High — needs load balancing, service discovery, distributed state"],
            ["Limit", "Hard ceiling (biggest machine money can buy)", "Near-linear, practically unbounded"],
            ["Availability", "Single point of failure", "Survives individual node failures"],
            ["Cost curve", "Superlinear at the high end", "Roughly linear with commodity hardware"]
          ]},
          { type: "p", text: `A common interview line: "I'd start with a single well-provisioned server and a managed database; when we outgrow it or need redundancy, we scale the stateless tier horizontally." Databases are usually the hardest tier to scale horizontally, which is why the standard playbook is: scale app servers out, scale the database up first, then add read replicas, then shard.` },
          { type: "h3", text: "Stateless services" },
          { type: "p", text: `Horizontal scaling of the application tier only works if any server can handle any request — i.e., servers are <strong>stateless</strong>. Session state, uploaded files, and caches must live outside the app server: sessions in Redis or in a signed cookie/JWT, files in object storage like S3, shared cache in Redis/Memcached. The anti-pattern is "sticky sessions" (pinning a user to one server), which fights the load balancer, breaks on deploys, and turns a node failure into logged-out users.` },
          { type: "list", items: [
            `Stateless app tier + external session store → any node can die or be replaced (enables autoscaling and rolling deploys).`,
            `Keep state in purpose-built systems: Redis (sessions, counters), object storage (blobs), databases (records), queues (in-flight work).`,
            `Idempotent request handling matters once retries and multiple nodes exist — design write endpoints so a retried request doesn't double-charge.`
          ]},
          { type: "h3", text: "How to talk about it in an interview" },
          { type: "p", text: `When asked "how does this scale to 10x users?", walk the tiers: DNS/CDN → load balancer → stateless app servers (autoscaled) → cache → database (replicas, then shards). Name the first bottleneck explicitly — it is almost always the database or a hot cache key — rather than hand-waving "add more servers."` }
        ]
      },
      {
        id: "load-balancing",
        title: "Load Balancing",
        summary: `L4 vs L7 load balancers, distribution algorithms, health checks, and avoiding the LB as a single point of failure.`,
        blocks: [
          { type: "p", text: `A load balancer distributes incoming traffic across a pool of servers. It is the component that makes a fleet of stateless servers look like one endpoint, and it doubles as the health gatekeeper: unhealthy nodes are removed from rotation automatically.` },
          { type: "h3", text: "L4 vs L7" },
          { type: "table", headers: ["", "Layer 4 (transport)", "Layer 7 (application)"], rows: [
            ["Routes on", "IP address + TCP/UDP port", "HTTP contents: path, host header, cookies, method"],
            ["Sees payload?", "No — forwards packets/connections", "Yes — terminates the connection, parses HTTP"],
            ["Capabilities", "Very fast, protocol-agnostic", "Path-based routing (/api vs /static), TLS termination, retries, compression, sticky sessions via cookie"],
            ["Examples", "AWS NLB, IPVS, HAProxy in TCP mode", "AWS ALB, NGINX, Envoy, HAProxy in HTTP mode"]
          ]},
          { type: "p", text: `Typical answer: TLS terminates at an L7 load balancer, which routes <code>/api/*</code> to the API pool and serves as the entry point for retries and rate limiting. L4 is chosen when you need raw throughput, non-HTTP protocols, or end-to-end TLS.` },
          { type: "h3", text: "Distribution algorithms" },
          { type: "list", items: [
            `<strong>Round robin</strong> — rotate through servers in order; fine when requests are uniform and servers identical.`,
            `<strong>Weighted round robin</strong> — same, but bigger servers get proportionally more traffic; also used for canary deploys (send 5% to the new version).`,
            `<strong>Least connections</strong> — send to the server with the fewest active connections; better when request durations vary widely.`,
            `<strong>Latency/least response time</strong> — favor the fastest-responding backend.`,
            `<strong>Consistent hashing</strong> — hash a key (user ID, session) to a server so the same key lands on the same node; used for cache locality and stateful backends, and it minimizes remapping when nodes join or leave.`
          ]},
          { type: "h3", text: "Health checks and failure handling" },
          { type: "p", text: `Load balancers probe backends — either <strong>active</strong> checks (periodic <code>GET /healthz</code>, mark unhealthy after N consecutive failures) or <strong>passive</strong> checks (watch real traffic for connection errors/5xx). A good health endpoint verifies the process can actually serve (e.g., DB connectivity), but beware: if every node's check hits a struggling shared dependency, all nodes go "unhealthy" at once and the LB takes the whole service down — so deep checks should be used carefully.` },
          { type: "p", text: `The load balancer itself must not be a single point of failure: cloud LBs are managed and redundant; self-hosted setups run an active-passive pair with a floating IP (keepalived/VRRP), and DNS with multiple A records or anycast spreads traffic across LBs in different regions.` }
        ]
      },
      {
        id: "caching",
        title: "Caching",
        summary: `Cache-aside vs write-through, eviction policies, TTLs, CDNs, and defending against cache stampedes.`,
        blocks: [
          { type: "p", text: `Caching stores the result of expensive work (a DB query, a rendered page, an API call) in fast storage so repeated reads are cheap. It is usually the single highest-leverage answer to "the database is the bottleneck" — a cache with a 95% hit rate cuts database read traffic by 20x. The costs are the two hard problems: <strong>invalidation</strong> (serving stale data) and <strong>added failure modes</strong> (stampedes, cold caches).` },
          { type: "h3", text: "Caching strategies" },
          { type: "list", items: [
            `<strong>Cache-aside (lazy loading)</strong> — the app reads the cache first; on a miss it reads the DB and populates the cache with a TTL. Most common pattern. Writes go to the DB and <strong>invalidate</strong> (delete) the cache key rather than updating it, which avoids racing writers.`,
            `<strong>Write-through</strong> — writes go to the cache, which synchronously writes to the DB. Cache is always fresh; write latency increases; you may cache data never read.`,
            `<strong>Write-behind (write-back)</strong> — writes hit the cache and are flushed to the DB asynchronously. Great write throughput, but risks data loss if the cache node dies before flushing.`,
            `<strong>Read-through</strong> — like cache-aside but the cache library/tier itself loads from the DB on miss, so app code only talks to the cache.`
          ]},
          { type: "h3", text: "Eviction and expiry" },
          { type: "p", text: `Caches are bounded, so entries are evicted. <strong>LRU</strong> (least recently used) is the default and right most of the time; <strong>LFU</strong> keeps frequently-hit keys even if not recent; <strong>FIFO/random</strong> are simpler but cruder. Independently of eviction, every entry should have a <strong>TTL</strong> as a staleness backstop. Add small random jitter to TTLs so a batch of keys written together doesn't expire together.` },
          { type: "h3", text: "Where caches live" },
          { type: "list", items: [
            `<strong>Client/browser</strong> — HTTP caching via <code>Cache-Control</code>, <code>ETag</code>.`,
            `<strong>CDN</strong> — geographically distributed edge caches (CloudFront, Cloudflare) for static assets and cacheable API responses; cuts latency and origin load. Cache-bust with versioned URLs (<code>app.3f9a.js</code>).`,
            `<strong>Application tier</strong> — in-process (fastest, but per-node and inconsistent across the fleet) vs a shared distributed cache like Redis/Memcached (consistent view, one network hop).`,
            `<strong>Database</strong> — internal buffer pools and materialized views.`
          ]},
          { type: "h3", text: "Cache stampede (thundering herd)" },
          { type: "p", text: `When a hot key expires, thousands of concurrent requests all miss and hit the database simultaneously — this can take the DB down. Standard defenses, and a favorite interview follow-up:` },
          { type: "list", items: [
            `<strong>Request coalescing / per-key lock</strong> — only one request recomputes the value; others wait or briefly serve stale data.`,
            `<strong>Stale-while-revalidate</strong> — serve the expired value while one background refresh runs.`,
            `<strong>Probabilistic early refresh</strong> — refresh slightly before expiry with a probability that rises as TTL nears zero, spreading recomputation.`,
            `<strong>TTL jitter</strong> — prevents synchronized mass expiry across many keys.`
          ]},
          { type: "p", text: `Also mention <strong>hot keys</strong> (one celebrity's profile overwhelming a single Redis shard — mitigate by replicating the key or adding an in-process cache layer) and the <strong>cold start</strong> problem after a cache flush or deploy (warm the cache before shifting traffic).` }
        ]
      },
      {
        id: "databases-sql-vs-nosql",
        title: "Databases: SQL vs NoSQL",
        summary: `Choosing between relational and NoSQL stores, plus replication and sharding — the levers for scaling either one.`,
        blocks: [
          { type: "p", text: `The default answer in an interview should be a relational database (PostgreSQL/MySQL) unless you can articulate a specific reason otherwise: relational stores give you ACID transactions, ad-hoc queries with joins, and decades of tooling. NoSQL is a family of trade-offs, not an upgrade — you typically give up joins and cross-record transactions to gain horizontal write scalability, flexible schemas, or a data model that fits the access pattern better.` },
          { type: "h3", text: "When each fits" },
          { type: "table", headers: ["Store type", "Examples", "Sweet spot"], rows: [
            ["Relational", "PostgreSQL, MySQL", "Structured data, transactions, complex queries/joins, most business systems"],
            ["Key-value", "Redis, DynamoDB", "Sessions, caching, carts, counters — lookups by key at huge scale, single-digit-ms latency"],
            ["Document", "MongoDB, DynamoDB", "Semi-structured/evolving schemas, entity-per-document access (user profiles, catalogs)"],
            ["Wide-column", "Cassandra, HBase", "Massive write throughput, time-series/feeds, known query patterns, multi-DC replication"],
            ["Graph", "Neo4j", "Deeply connected data: social graphs, fraud rings, recommendations"],
            ["Search", "Elasticsearch", "Full-text search, log analytics — usually alongside a primary store"]
          ]},
          { type: "p", text: `Key interview point: NoSQL stores like Cassandra and DynamoDB require you to <strong>model data around queries</strong> (denormalized, one table per access pattern), whereas SQL lets you normalize and query flexibly later. If the requirements include flexible reporting or many join-heavy queries, that argues strongly for SQL.` },
          { type: "h3", text: "Replication" },
          { type: "p", text: `Replication copies data to multiple nodes for availability and read scaling. <strong>Leader-follower (primary-replica)</strong> is the standard: writes go to the leader, followers replicate and serve reads. <strong>Asynchronous</strong> replication is fast but a leader crash can lose recent writes, and reading a lagging replica yields stale data (the classic "user posts a comment then doesn't see it" — fix with read-your-writes routing). <strong>Synchronous</strong> replication guarantees durability on N nodes at the cost of write latency. <strong>Multi-leader</strong> and <strong>leaderless</strong> (Dynamo-style, quorum reads/writes with <code>R + W > N</code>) accept write conflicts to gain availability.` },
          { type: "h3", text: "Sharding / partitioning" },
          { type: "p", text: `When one machine can't hold the data or write load, you partition rows across nodes by a <strong>shard key</strong>. <strong>Hash-based</strong> sharding spreads load evenly but ruins range scans; <strong>range-based</strong> keeps ranges contiguous but risks hotspots (e.g., time-ordered keys pile onto the newest shard). Choose a shard key that (1) distributes load evenly and (2) keeps your most common queries on a single shard — e.g., shard a multi-tenant SaaS by <code>tenant_id</code>.` },
          { type: "list", items: [
            `Cross-shard queries and transactions become expensive (scatter-gather, two-phase commit) — design to avoid them.`,
            `Resharding is painful; consistent hashing or a directory service (lookup table mapping key ranges → shards) eases rebalancing.`,
            `Hotspot example to cite: sharding by user ID puts a celebrity's data and traffic on one shard; mitigate with key salting or caching.`,
            `Secondary indexes across shards require either local indexes (query all shards) or global indexes (extra write cost).`
          ]}
        ]
      },
      {
        id: "message-queues",
        title: "Message Queues & Async Processing",
        summary: `Decoupling with queues, pub/sub, delivery guarantees and idempotency, and Kafka vs RabbitMQ at a high level.`,
        blocks: [
          { type: "p", text: `A message queue lets a producer hand off work and respond to the user immediately while consumers process it asynchronously. This buys you: <strong>decoupling</strong> (producer and consumer scale and fail independently), <strong>buffering</strong> (absorb traffic spikes instead of dropping requests), and <strong>retry/durability</strong> (work survives consumer crashes). Classic uses: sending emails, resizing images, order processing, feed fan-out, event pipelines.` },
          { type: "h3", text: "Queues vs pub/sub" },
          { type: "list", items: [
            `<strong>Point-to-point queue</strong> — each message is consumed by exactly one worker from a competing-consumer pool; used to distribute work.`,
            `<strong>Publish/subscribe</strong> — each message is delivered to every subscriber (or every consumer group); used to broadcast events, e.g., an <code>OrderPlaced</code> event consumed independently by billing, inventory, and analytics.`
          ]},
          { type: "h3", text: "Delivery guarantees" },
          { type: "table", headers: ["Guarantee", "Meaning", "Cost"], rows: [
            ["At-most-once", "Fire and forget; messages may be lost, never duplicated", "Cheapest; OK for metrics/telemetry"],
            ["At-least-once", "Redelivered until acknowledged; duplicates possible", "Consumers must be idempotent — the practical default"],
            ["Exactly-once", "Each message processed once", "Hardest; needs transactions/dedup (Kafka offers it within its ecosystem via idempotent producers + transactional offsets)"]
          ]},
          { type: "p", text: `The interview-critical insight: in a distributed system a consumer can crash after processing but before acknowledging, so redelivery (and thus duplicates) is unavoidable under at-least-once. The fix is <strong>idempotent consumers</strong> — dedupe on a message ID, use upserts, or make the operation naturally idempotent ("set status = shipped" vs "increment counter").` },
          { type: "list", items: [
            `<strong>Ack + visibility timeout</strong> — a consumed message is hidden, not deleted; if the consumer doesn't ack in time it reappears for another worker.`,
            `<strong>Dead-letter queue (DLQ)</strong> — after N failed attempts, park the message for inspection instead of poisoning the queue with infinite retries.`,
            `<strong>Backpressure</strong> — monitor queue depth; scale consumers on lag, and shed or reject load when the queue grows unboundedly.`,
            `<strong>Ordering</strong> — global ordering doesn't scale; Kafka gives per-partition ordering (choose the partition key, e.g., user ID, to order the events that matter together).`
          ]},
          { type: "h3", text: "Kafka vs RabbitMQ (high level)" },
          { type: "p", text: `<strong>RabbitMQ</strong> is a traditional <strong>smart broker</strong>: it routes messages through exchanges to queues, pushes to consumers, deletes messages once acked. Great for task/work queues, complex routing, per-message priorities, and lower-latency RPC-ish patterns. <strong>Kafka</strong> is a <strong>distributed append-only log</strong>: messages persist for a retention period regardless of consumption, consumers pull and track their own offsets, and topics are split into partitions for parallelism. Great for event streaming, very high throughput (millions of msgs/sec), replay ("reprocess yesterday's events"), and feeding multiple independent consumer groups. Rule of thumb to say: <strong>RabbitMQ for background jobs, Kafka for event streams and pipelines.</strong>` }
        ]
      },
      {
        id: "consistency-and-cap",
        title: "Consistency & the CAP Theorem",
        summary: `CAP and PACELC, strong vs eventual consistency, quorums, and consistent hashing for data distribution.`,
        blocks: [
          { type: "p", text: `The <strong>CAP theorem</strong>: a distributed data store can provide at most two of <strong>C</strong>onsistency (every read sees the latest write), <strong>A</strong>vailability (every request gets a non-error response), and <strong>P</strong>artition tolerance (the system keeps working when the network splits). Because network partitions <strong>will</strong> happen, P is mandatory — so the real choice, made only <strong>during a partition</strong>, is C vs A: refuse some requests to stay correct (CP) or keep serving possibly-stale data (AP).` },
          { type: "p", text: `A strong candidate also mentions <strong>PACELC</strong>: during a Partition choose A or C, <strong>E</strong>lse (normal operation) choose between <strong>L</strong>atency and <strong>C</strong>onsistency. Even with no partition, synchronously replicating every write costs latency — that's the everyday trade-off.` },
          { type: "h3", text: "Consistency models" },
          { type: "list", items: [
            `<strong>Strong consistency / linearizability</strong> — a read always returns the most recent write, as if there were one copy. Needed for balances, inventory decrements, unique username claims. Costs latency and availability (coordination, e.g., Paxos/Raft consensus or single-leader synchronous writes).`,
            `<strong>Eventual consistency</strong> — replicas converge if writes stop; reads may be stale meanwhile. Fine for like counts, follower counts, timelines, DNS.`,
            `<strong>Read-your-writes</strong> — a user always sees their own updates (route their reads to the leader or a caught-up replica briefly after they write).`,
            `<strong>Monotonic reads</strong> — a user never sees data go "backwards in time" (pin a user to one replica).`,
            `<strong>Causal consistency</strong> — causally related writes (a reply after its parent comment) are seen in order everywhere.`
          ]},
          { type: "p", text: `Quorum systems (Dynamo/Cassandra style) tune this per request: with <code>N</code> replicas, <code>W</code> write acks and <code>R</code> read acks, choosing <code>R + W > N</code> guarantees a read overlaps the latest write; <code>R = W = 1</code> maximizes speed and availability at the price of staleness.` },
          { type: "h3", text: "Consistent hashing" },
          { type: "p", text: `Naive placement <code>server = hash(key) % N</code> is a trap: adding or removing one server changes N and remaps almost <strong>every</strong> key — a full cache wipe or massive data reshuffle. <strong>Consistent hashing</strong> places servers and keys on a hash ring; each key belongs to the first server clockwise from it. Adding/removing a server only moves the keys in its ring segment — about <code>1/N</code> of the data.` },
          { type: "list", items: [
            `<strong>Virtual nodes</strong> — each physical server owns many points on the ring, smoothing load imbalance and letting heterogeneous servers take proportional shares.`,
            `Used by Cassandra, DynamoDB, Riak, and distributed caches (Memcached client-side sharding).`,
            `Replication falls out naturally: store each key on the next R distinct servers clockwise.`
          ]},
          { type: "h3", text: "How this shows up in interviews" },
          { type: "p", text: `Expect "is your design CP or AP?" per component: payments and inventory lean CP (correctness over uptime); feeds, likes, and view counters lean AP (show something slightly stale rather than an error). Saying "different parts of the system get different consistency levels" is exactly the nuance interviewers want.` }
        ]
      }
    ],
    designProblems: [
      {
        id: "design-url-shortener",
        title: "Design a URL Shortener",
        summary: `Design a TinyURL-style service: generate short codes, redirect at low latency, and handle a heavily read-skewed workload.`,
        steps: [
          {
            title: "1. Clarify requirements",
            blocks: [
              { type: "p", text: `Start by pinning down scope with the interviewer. Functional: given a long URL, return a short one; visiting the short URL redirects (HTTP 301/302) to the original; optional custom aliases and expiration; basic click analytics. Non-functional: redirects must be very low latency and highly available (a broken redirect is a broken link across the internet), short codes should be hard to enumerate, and the system is massively <strong>read-heavy</strong>.` },
              { type: "list", items: [
                `Ask: custom aliases? expiration? analytics? delete/update support? — each changes the design.`,
                `Decide 301 (permanent, browsers cache — fewer hits to you, but you lose analytics) vs 302 (temporary — every click hits your service, enabling counting). Say the trade-off out loud.`
              ]}
            ]
          },
          {
            title: "2. Estimate scale",
            blocks: [
              { type: "p", text: `Assume 100M new URLs/month and a 100:1 read:write ratio.` },
              { type: "list", items: [
                `Writes: 100M / (30 × 86,400) ≈ <strong>40 URLs/sec</strong>.`,
                `Reads: 100 × 40 ≈ <strong>4,000 redirects/sec</strong> (plan for 3-5x peak ≈ 15-20K/sec).`,
                `Storage: ~500 bytes/record × 100M/month × 5 years ≈ <strong>3 TB</strong> — modest; the challenge is throughput and latency, not volume.`,
                `Code length: base62 (a-z, A-Z, 0-9). 62^7 ≈ 3.5 trillion — 7 characters is plenty.`
              ]}
            ]
          },
          {
            title: "3. API and data model",
            blocks: [
              { type: "code", lang: "text", text: `POST /api/v1/urls        { "longUrl": "...", "customAlias?": "...", "expiresAt?": "..." }
  -> 201 { "shortUrl": "https://sho.rt/aZ3kP9q" }

GET /{code}
  -> 302 Location: <longUrl>   (404 if unknown, 410 if expired)` },
              { type: "code", lang: "sql", text: `CREATE TABLE urls (
  id          BIGINT PRIMARY KEY,        -- numeric ID behind the code
  short_code  VARCHAR(10) UNIQUE NOT NULL,
  long_url    TEXT NOT NULL,
  user_id     BIGINT,
  created_at  TIMESTAMP NOT NULL,
  expires_at  TIMESTAMP NULL
);` },
              { type: "p", text: `The workload is simple key → value lookup with no joins, so either a relational DB or a key-value store (DynamoDB, Cassandra) works; say that SQL is fine at this size and a KV store is the natural choice at extreme scale.` }
            ]
          },
          {
            title: "4. Short code generation",
            blocks: [
              { type: "list", items: [
                `<strong>Counter + base62</strong> — encode an auto-increment ID. Simple, no collisions, but codes are sequential/guessable and a single counter is a bottleneck. Fix guessability by adding a random component or bijective scrambling; fix the bottleneck with a distributed ID scheme.`,
                `<strong>Random 7-char code</strong> — generate, insert with a unique constraint, retry on the (rare) collision. Simple and unguessable; collision probability stays tiny while the keyspace is sparsely used.`,
                `<strong>Key Generation Service (KGS)</strong> — pre-generate unused codes; app servers grab batches. No runtime collision checks; the KGS itself needs redundancy.`,
                `<strong>Hash the URL</strong> (MD5, take first 7 base62 chars) — same URL → same code (dedup for free), but collisions between different URLs must be detected and resolved.`
              ]},
              { type: "p", text: `A solid pick: random codes with a unique-constraint retry, or ranged counters (each app server leases a block of IDs from ZooKeeper/a ticket table) if you want zero collision handling.` }
            ]
          },
          {
            title: "5. The read path: caching and redirect flow",
            blocks: [
              { type: "p", text: `Reads dominate 100:1 and follow a power law (a small fraction of links get most clicks) — ideal for caching. Flow: LB → app server → Redis (cache-aside, keyed by code) → DB on miss. A cache holding the hottest 20% of recent links serves the vast majority of redirects; 4K/sec reads is trivial for Redis.` },
              { type: "list", items: [
                `Cache negative lookups briefly too, to blunt junk/enumeration traffic.`,
                `A CDN or edge workers can serve redirects even closer to users for global latency.`,
                `Analytics: never count clicks synchronously in the redirect path — drop an event onto a queue (Kafka) and aggregate asynchronously.`
              ]}
            ]
          },
          {
            title: "6. Scaling the storage tier",
            blocks: [
              { type: "p", text: `At 3 TB and growing, or at much higher write rates, shard by <strong>hash of the short code</strong> — every redirect is a single-key lookup, so it always hits exactly one shard; consistent hashing keeps resharding cheap. Add read replicas per shard for redundancy. Replication can be asynchronous: a freshly created link being unreadable on a replica for tens of milliseconds is acceptable (eventual consistency is fine here — say so explicitly).` }
            ]
          },
          {
            title: "7. Bottlenecks, failure modes, and trade-offs",
            blocks: [
              { type: "list", items: [
                `<strong>Hot links</strong> — a viral link hammers one cache shard; mitigate with in-process caching on app servers and CDN caching of the redirect.`,
                `<strong>301 vs 302</strong> — 301 offloads repeat clicks to browser caches but forfeits analytics and makes URL updates impossible; most real services use 302.`,
                `<strong>Enumeration/abuse</strong> — random codes, rate limiting on creation, and a safe-browsing check on submitted URLs (shorteners are a phishing vector).`,
                `<strong>Cache stampede</strong> on a hot key that expires — request coalescing / stale-while-revalidate.`,
                `<strong>Availability over consistency</strong> — this is an AP-leaning system: serving a redirect matters more than a globally instant view of new links.`
              ]}
            ]
          }
        ]
      },
      {
        id: "design-rate-limiter",
        title: "Design a Rate Limiter",
        summary: `Design a distributed rate limiter: compare token bucket, sliding window, and friends, then make it work across many servers.`,
        steps: [
          {
            title: "1. Clarify requirements",
            blocks: [
              { type: "p", text: `Functional: limit requests per client (per user ID, API key, or IP) to N per time window; reject excess with HTTP <code>429 Too Many Requests</code>, ideally with <code>Retry-After</code> and <code>X-RateLimit-Remaining</code> headers. Non-functional: extremely low added latency (it sits on every request), accurate enough to protect backends, works across a distributed fleet, and <strong>fail-open vs fail-closed</strong> is an explicit decision — if the limiter's store is down, do you let traffic through (protect UX) or block (protect the backend)?` },
              { type: "list", items: [
                `Ask where it lives: client-side (advisory only), API gateway/middleware (typical), or per-service.`,
                `Ask if limits differ per endpoint/tier (free vs paid) — implies a rules config, not hardcoded numbers.`
              ]}
            ]
          },
          {
            title: "2. Algorithm: fixed window and its flaw",
            blocks: [
              { type: "p", text: `<strong>Fixed window counter</strong>: keep a counter per key per window (e.g., <code>user123:12:05</code>), increment on each request, reject when it exceeds the limit. O(1) time and memory, trivial in Redis with <code>INCR</code> + <code>EXPIRE</code>.` },
              { type: "p", text: `The flaw: <strong>boundary burst</strong>. With a limit of 100/min, a client can send 100 requests at 11:59:59 and 100 more at 12:00:01 — 200 requests in ~2 seconds, double the intended rate. Naming this flaw unprompted is a strong signal.` }
            ]
          },
          {
            title: "3. Algorithm: token bucket",
            blocks: [
              { type: "p", text: `<strong>Token bucket</strong> — the industry workhorse (used by AWS API throttling, Stripe). A bucket holds up to <code>capacity</code> tokens and refills at <code>rate</code> tokens/sec. Each request consumes a token; empty bucket → reject. It permits short bursts up to the bucket size while enforcing the average rate — usually exactly the behavior you want.` },
              { type: "code", lang: "text", text: `state per key: tokens, last_refill_ts

on request:
  now = current_time()
  tokens = min(capacity, tokens + (now - last_refill_ts) * rate)
  last_refill_ts = now
  if tokens >= 1:  tokens -= 1;  ALLOW
  else:            REJECT (Retry-After = (1 - tokens) / rate)` },
              { type: "p", text: `Only two numbers per key, refill computed lazily on access — O(1) memory and time. Its sibling <strong>leaky bucket</strong> drains a queue at a fixed rate, producing a perfectly smooth outflow (good for traffic shaping) but no bursts and possible queueing delay.` }
            ]
          },
          {
            title: "4. Algorithm: sliding window log and sliding window counter",
            blocks: [
              { type: "p", text: `<strong>Sliding window log</strong> — store a timestamp per request (Redis sorted set), drop entries older than the window, count the rest. Perfectly accurate, but O(limit) memory per key — expensive at high limits.` },
              { type: "code", lang: "text", text: `# Redis, atomically via Lua:
ZREMRANGEBYSCORE key 0 (now - window)   # evict old timestamps
n = ZCARD key
if n < limit: ZADD key now now; ALLOW
else: REJECT` },
              { type: "p", text: `<strong>Sliding window counter</strong> — the pragmatic hybrid: keep counts for the current and previous fixed windows and weight the previous one by its overlap: <code>count = curr + prev × overlap_fraction</code>. If the last minute overlaps 30% of the previous window: <code>curr + 0.3 × prev</code>. O(1) memory, smooths the boundary-burst problem, tiny approximation error (assumes uniform distribution within the previous window). Cloudflare famously uses this.` },
              { type: "table", headers: ["Algorithm", "Memory", "Accuracy", "Bursts"], rows: [
                ["Fixed window", "O(1)", "Poor at boundaries (2x)", "Allows boundary bursts"],
                ["Token bucket", "O(1)", "Enforces average rate", "Allows controlled bursts (feature)"],
                ["Leaky bucket", "O(queue)", "Smooth output rate", "No bursts"],
                ["Sliding window log", "O(limit)", "Exact", "No"],
                ["Sliding window counter", "O(1)", "~Exact (approximation)", "Smoothed"]
              ]}
            ]
          },
          {
            title: "5. Making it distributed",
            blocks: [
              { type: "p", text: `With many gateway servers, per-server in-memory counters undercount (a client spraying requests across N servers gets N× the limit). Standard solution: <strong>centralized counters in Redis</strong>, with the check-and-update done atomically via a <strong>Lua script</strong> (a plain GET-then-SET has a race between two servers reading the same count). Shard Redis by key for scale; each rate-limit key lives on one shard, so no cross-shard coordination.` },
              { type: "list", items: [
                `Latency budget: one Redis round trip (~0.5-1 ms in-datacenter) per request; add a small local cache for keys already known to be hard-blocked.`,
                `If some inaccuracy is acceptable, use <strong>local buckets that sync asynchronously</strong> to the central store — lower latency, slightly loose enforcement. Say this trade-off explicitly.`,
                `Race condition question to preempt: "two requests read tokens=1 simultaneously" — answered by Lua/atomic ops.`
              ]}
            ]
          },
          {
            title: "6. Bottlenecks, failure modes, and trade-offs",
            blocks: [
              { type: "list", items: [
                `<strong>Redis down</strong> — fail-open (protect availability, accept abuse risk) vs fail-closed (protect backends, reject legit users). Most public APIs fail open with alerting; internal DDoS-protection layers may fail closed.`,
                `<strong>Hot keys</strong> — one abusive key hammering a shard; mitigate with a local negative cache for blocked keys.`,
                `<strong>Clock skew</strong> — lazy-refill token buckets use only the store's clock if you compute time in the Lua script (use Redis <code>TIME</code>), sidestepping app-server skew.`,
                `<strong>UX</strong> — return 429 with <code>Retry-After</code> and remaining-quota headers so well-behaved clients back off instead of retry-storming.`,
                `<strong>Rule management</strong> — limits per endpoint/tier live in config (pushed to gateways), not code.`
              ]}
            ]
          }
        ]
      },
      {
        id: "design-news-feed",
        title: "Design a News Feed",
        summary: `Design a Facebook/Twitter-style feed: the fan-out on write vs fan-out on read decision, celebrities, and ranking.`,
        steps: [
          {
            title: "1. Clarify requirements",
            blocks: [
              { type: "p", text: `Functional: users publish posts; users follow others; each user sees a feed of posts from people they follow, roughly reverse-chronological (or ranked); infinite scroll with pagination. Non-functional: feed load must be fast (p99 well under ~500 ms), the system is <strong>read-heavy</strong> (feed views vastly outnumber posts), eventual consistency is fine — a post appearing in followers' feeds a few seconds late is acceptable, and say so.` },
              { type: "list", items: [
                `Ask: chronological or ranked? media posts? follower counts up to what scale (celebrity problem)? ads/injected content?`
              ]}
            ]
          },
          {
            title: "2. Estimate scale",
            blocks: [
              { type: "list", items: [
                `Assume 300M DAU, each loading the feed ~5 times/day → ~1.5B feed reads/day ≈ <strong>17K reads/sec</strong> (peak 50K+).`,
                `~1 post per user per day → ~3,500 writes/sec of new posts.`,
                `The multiplier: average 200 followers means each post may touch 200 feeds → fan-out work of ~700K feed-insertions/sec. This asymmetry drives the whole design.`
              ]}
            ]
          },
          {
            title: "3. Data model and APIs",
            blocks: [
              { type: "code", lang: "text", text: `POST /posts                      { text, media_ids }
GET  /feed?cursor=...&limit=20   -> [post summaries], next_cursor

Tables/stores:
  users(id, ...)
  follows(follower_id, followee_id)          -- the social graph
  posts(id, author_id, text, created_at)     -- source of truth
  feed:{user_id} -> list of post IDs          -- precomputed per-user feed (Redis/Cassandra)` },
              { type: "p", text: `Store post <strong>IDs</strong> in feeds, not full posts — hydrate contents (and author info, like counts) at read time from a post cache. Use cursor-based pagination (e.g., "posts older than ID X"), not OFFSET, so the feed is stable while new posts arrive.` }
            ]
          },
          {
            title: "4. Fan-out on write vs fan-out on read",
            blocks: [
              { type: "p", text: `The central decision of this problem.` },
              { type: "p", text: `<strong>Fan-out on write (push)</strong>: when a user posts, asynchronously insert the post ID into every follower's precomputed feed list (via a queue of fan-out jobs). Reads are then a single fetch of <code>feed:{user_id}</code> — extremely fast. Cost: write amplification (200 inserts per post on average), wasted work for inactive users, and a disaster for celebrities.` },
              { type: "p", text: `<strong>Fan-out on read (pull)</strong>: store nothing per-user; on feed load, fetch the follow list, query recent posts from each followee, merge and sort. Writes are cheap; reads are expensive (a user following 1,000 accounts triggers a 1,000-way merge on every load) and hard to make fast at 17K reads/sec.` },
              { type: "table", headers: ["", "Fan-out on write (push)", "Fan-out on read (pull)"], rows: [
                ["Read latency", "Excellent — one list fetch", "Poor — N-way merge per load"],
                ["Write cost", "High — one insert per follower", "Minimal"],
                ["Celebrity with 50M followers", "50M inserts per post (unacceptable)", "No problem"],
                ["Inactive followers", "Wasted precomputation", "No wasted work"],
                ["Freshness", "Slight delay while fan-out runs", "Always current"]
              ]}
            ]
          },
          {
            title: "5. The hybrid approach and the celebrity problem",
            blocks: [
              { type: "p", text: `Real systems (Twitter's classic architecture) use a <strong>hybrid</strong>: push for normal users, pull for celebrities. Posts from accounts above a follower threshold (say 100K-1M) are <strong>not</strong> fanned out; instead, at read time the service fetches the user's precomputed feed <strong>and</strong> recent posts from the few celebrities they follow, then merges the two lists. Each user follows only a handful of mega-accounts, so the merge is cheap, while the fan-out queue is spared tens of millions of writes per celebrity post.` },
              { type: "list", items: [
                `Fan-out runs as async workers consuming a queue — a celebrity-sized job never blocks the posting user's request.`,
                `Skip fan-out to users inactive for N days; rebuild their feed via pull when they return.`,
                `Cap stored feed length (e.g., most recent 500-1,000 post IDs) — nobody scrolls further, and it bounds memory.`
              ]}
            ]
          },
          {
            title: "6. Read path, caching, and ranking",
            blocks: [
              { type: "p", text: `Feed read flow: gateway → feed service → fetch <code>feed:{user}</code> ID list from Redis/Cassandra → hydrate posts from a post cache (cache-aside over the posts DB) → merge celebrity posts → optionally rank → return a page. Every step is cache-friendly: post objects are immutable-ish and hot, social graph is cached, counters (likes) are eventually consistent and served from their own cached counters service.` },
              { type: "p", text: `For ranked feeds, fetch a few hundred candidate IDs, score them with a lightweight ML model (recency, affinity, engagement), and return the top N — mention this as a separable ranking service rather than designing the model.` }
            ]
          },
          {
            title: "7. Bottlenecks and trade-offs",
            blocks: [
              { type: "list", items: [
                `<strong>Fan-out queue lag</strong> is the main backpressure point — monitor it; posts appearing seconds late is the accepted trade-off (eventual consistency).`,
                `<strong>Hot post / hot author</strong> — viral content hammers the post cache; replicate hot keys and add in-process caches.`,
                `<strong>Feed storage choice</strong> — Redis lists (fast, memory-expensive, needs persistence strategy) vs Cassandra wide rows keyed by user (cheaper, durable, great write throughput). Either is defensible; justify one.`,
                `<strong>Deletes/edits</strong> — a deleted post's ID may sit in millions of feed lists; filter at hydration time (the source-of-truth lookup fails) instead of chasing every copy.`,
                `<strong>Consistency stance</strong> — the feed is AP end to end: availability and latency over instant global visibility.`
              ]}
            ]
          }
        ]
      }
    ]
  },

  database: {
    id: "database",
    name: "Databases & SQL",
    intro: `Nearly every backend interview loop includes database questions — sometimes a dedicated SQL screen, sometimes woven into system design ("what index makes this query fast?", "what isolation level prevents this bug?"). The material rewards precision: interviewers can tell immediately whether you've actually reasoned about a query plan or just memorized definitions.

This section covers the SQL you'll be asked to write (joins, aggregation, subqueries, and the classic interview problems), and the internals you'll be asked to explain: how B-tree indexes work and when they backfire, normalization and when to deliberately break it, and ACID transactions with the isolation anomalies each level permits.`,
    topics: [
      {
        id: "sql-fundamentals",
        title: "SQL Fundamentals",
        summary: `Joins, GROUP BY/HAVING, and subqueries — the core constructs behind almost every interview SQL question.`,
        blocks: [
          { type: "p", text: `Interview SQL revolves around three skills: combining tables (<strong>joins</strong>), aggregating (<strong>GROUP BY</strong>/<strong>HAVING</strong>), and nesting queries (<strong>subqueries</strong>/CTEs). Examples below use <code>employees(id, name, salary, dept_id)</code> and <code>departments(id, name)</code>.` },
          { type: "h3", text: "Joins" },
          { type: "table", headers: ["Join", "Returns"], rows: [
            ["INNER JOIN", "Only rows with a match in both tables"],
            ["LEFT JOIN", "All left rows; NULLs where the right side has no match"],
            ["RIGHT JOIN", "All right rows (rarely used — rewrite as LEFT)"],
            ["FULL OUTER JOIN", "All rows from both sides, matched where possible"],
            ["CROSS JOIN", "Cartesian product — every pair"],
            ["Self join", "A table joined to itself (managers, pairs of rows)"]
          ]},
          { type: "code", lang: "sql", text: `-- Employees with their department names (unmatched employees dropped)
SELECT e.name, d.name AS department
FROM employees e
INNER JOIN departments d ON d.id = e.dept_id;

-- Departments with no employees: LEFT JOIN + IS NULL is the classic idiom
SELECT d.name
FROM departments d
LEFT JOIN employees e ON e.dept_id = d.id
WHERE e.id IS NULL;

-- Self join: employees earning more than their manager
SELECT e.name
FROM employees e
JOIN employees m ON m.id = e.manager_id
WHERE e.salary > m.salary;` },
          { type: "p", text: `Trap worth naming: putting a right-table filter in <code>WHERE</code> after a <code>LEFT JOIN</code> silently turns it into an INNER JOIN (the NULL rows fail the filter). Put such conditions in the <code>ON</code> clause to preserve unmatched left rows.` },
          { type: "h3", text: "GROUP BY and HAVING" },
          { type: "code", lang: "sql", text: `-- Departments with more than 5 employees and their average salary
SELECT d.name,
       COUNT(*)      AS headcount,
       AVG(e.salary) AS avg_salary
FROM employees e
JOIN departments d ON d.id = e.dept_id
GROUP BY d.name
HAVING COUNT(*) > 5
ORDER BY avg_salary DESC;` },
          { type: "p", text: `<strong>WHERE filters rows before grouping; HAVING filters groups after aggregation</strong> — the single most common conceptual question. Also know the logical evaluation order: <code>FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT</code> (which is why a SELECT alias can't be used in WHERE). <code>COUNT(*)</code> counts rows; <code>COUNT(col)</code> skips NULLs; aggregates generally ignore NULLs.` },
          { type: "h3", text: "Subqueries and CTEs" },
          { type: "code", lang: "sql", text: `-- Scalar subquery: everyone above the company average
SELECT name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);

-- Correlated subquery: above their OWN department's average
SELECT e.name, e.salary
FROM employees e
WHERE e.salary > (SELECT AVG(e2.salary)
                  FROM employees e2
                  WHERE e2.dept_id = e.dept_id);

-- Same thing with a CTE — usually clearer
WITH dept_avg AS (
  SELECT dept_id, AVG(salary) AS avg_sal
  FROM employees
  GROUP BY dept_id
)
SELECT e.name, e.salary
FROM employees e
JOIN dept_avg a ON a.dept_id = e.dept_id
WHERE e.salary > a.avg_sal;` },
          { type: "list", items: [
            `A <strong>correlated</strong> subquery references the outer row and conceptually re-runs per row; optimizers often rewrite it, but be ready to discuss the cost.`,
            `Prefer <code>EXISTS</code> over <code>IN</code> with subqueries, and beware <code>NOT IN</code> with a NULL in the list — it returns no rows (three-valued logic). <code>NOT EXISTS</code> is the safe form.`,
            `NULL comparisons need <code>IS NULL</code> / <code>IS DISTINCT FROM</code>; <code>= NULL</code> is never true.`
          ]}
        ]
      },
      {
        id: "indexing",
        title: "Indexing",
        summary: `How B-tree indexes work, composite and covering indexes, and the cases where an index makes things worse.`,
        blocks: [
          { type: "p", text: `An index is a separate ordered structure that lets the database find rows without scanning the whole table — the difference between O(log n) and O(n), i.e., between 3-4 page reads and millions. The default and most important type is the <strong>B-tree</strong> (in practice a B+ tree).` },
          { type: "h3", text: "B-tree mechanics" },
          { type: "list", items: [
            `A balanced, wide tree: internal nodes hold sorted keys that route the search; <strong>leaf nodes hold the keys plus row pointers, linked left-to-right</strong> — which is why B-trees serve range scans (<code>BETWEEN</code>, <code><</code>, <code>ORDER BY</code>) and prefix <code>LIKE 'abc%'</code>, not just equality.`,
            `Fan-out is huge (hundreds of keys per page), so even billion-row tables are ~3-4 levels deep.`,
            `In MySQL/InnoDB the table itself is a B-tree ordered by primary key (a <strong>clustered index</strong>); secondary indexes store the primary key in their leaves, so a secondary lookup is two B-tree descents. This is also why fat primary keys (e.g., UUIDs) bloat every secondary index and why random UUID inserts fragment the tree.`,
            `Hash indexes: O(1) equality only — no ranges, no ordering. Full-text and GIN/GiST indexes serve text and containment queries.`
          ]},
          { type: "h3", text: "Composite indexes and the leftmost-prefix rule" },
          { type: "p", text: `An index on <code>(a, b, c)</code> is sorted by a, then b, then c. It serves queries filtering on <code>a</code>, on <code>a, b</code>, or on <code>a, b, c</code> — but <strong>not</strong> on <code>b</code> alone (the b values are scattered across all a groups). Also, once a column is used with a range predicate, columns after it in the index can't be used for seeking. Column-order heuristic: equality columns first, then the range/sort column.` },
          { type: "code", lang: "sql", text: `CREATE INDEX idx_orders_cust_date ON orders (customer_id, created_at);

-- Uses the index fully: equality on customer_id, range on created_at
SELECT * FROM orders
WHERE customer_id = 42 AND created_at >= '2026-01-01';

-- Cannot seek this index (skips the leftmost column):
SELECT * FROM orders WHERE created_at >= '2026-01-01';` },
          { type: "h3", text: "Covering indexes" },
          { type: "p", text: `If the index contains every column a query needs, the engine answers from the index alone — an <strong>index-only scan</strong> — never touching the table. E.g., <code>CREATE INDEX ... ON orders (customer_id, created_at, total)</code> covers <code>SELECT created_at, total WHERE customer_id = ?</code>. Postgres supports non-key payload columns via <code>INCLUDE (total)</code>. This is a go-to answer for "this hot query is still slow after indexing."` },
          { type: "h3", text: "When indexes hurt" },
          { type: "list", items: [
            `<strong>Write amplification</strong> — every INSERT/UPDATE/DELETE must maintain every index; a table with 8 indexes does ~9 structure updates per write. Heavy-write tables want few, deliberate indexes.`,
            `<strong>Low selectivity</strong> — an index on <code>gender</code> or a boolean is useless: matching 50% of rows via random index hops is slower than a sequential scan, and the planner will rightly ignore it.`,
            `<strong>Functions on the indexed column</strong> — <code>WHERE YEAR(created_at) = 2026</code> or <code>LOWER(email) = ...</code> defeats the index; rewrite as a range, or create an expression index on <code>LOWER(email)</code>.`,
            `Leading-wildcard <code>LIKE '%abc'</code>, implicit type casts, and OR across different columns also block index use.`,
            `Storage and cache cost: indexes compete with data for RAM (buffer pool).`
          ]},
          { type: "p", text: `Always mention <code>EXPLAIN</code>: the way you verify any of this is to read the query plan — seq scan vs index scan vs index-only scan, and estimated vs actual rows.` }
        ]
      },
      {
        id: "normalization",
        title: "Normalization & Denormalization",
        summary: `1NF, 2NF, and 3NF with a worked example, and when to deliberately denormalize.`,
        blocks: [
          { type: "p", text: `Normalization organizes tables to eliminate redundant data, so every fact is stored exactly once. The payoff is the prevention of <strong>anomalies</strong>: update anomalies (change a fact in one row, forget the other 50 copies), insert anomalies (can't record a course until a student enrolls), and delete anomalies (deleting the last enrollment erases the course's existence). The interview standard is "third normal form", summarized as: <strong>every non-key attribute depends on the key, the whole key, and nothing but the key.</strong>` },
          { type: "h3", text: "Worked example" },
          { type: "p", text: `Start with one messy enrollment table:` },
          { type: "table", headers: ["student_id", "student_name", "courses", "instructor", "instructor_office"], rows: [
            ["1", "Ava", "CS101, CS201", "Kim", "B-204"],
            ["2", "Ben", "CS101", "Kim", "B-204"]
          ]},
          { type: "p", text: `<strong>1NF — atomic values, no repeating groups.</strong> "CS101, CS201" in one cell breaks 1NF: you can't index, join, or constrain it. Split into one row per enrollment:` },
          { type: "table", headers: ["student_id", "student_name", "course_id", "instructor", "instructor_office"], rows: [
            ["1", "Ava", "CS101", "Kim", "B-204"],
            ["1", "Ava", "CS201", "Lee", "C-110"],
            ["2", "Ben", "CS101", "Kim", "B-204"]
          ]},
          { type: "p", text: `<strong>2NF — no partial dependencies.</strong> The key is <code>(student_id, course_id)</code>, but <code>student_name</code> depends only on <code>student_id</code>, and <code>instructor</code> only on <code>course_id</code> — facts about part of the key, duplicated per enrollment. Split them into their own tables: <code>students(student_id, name)</code>, <code>courses(course_id, instructor, instructor_office)</code>, <code>enrollments(student_id, course_id)</code>.` },
          { type: "p", text: `<strong>3NF — no transitive dependencies.</strong> In <code>courses</code>, <code>instructor_office</code> depends on <code>instructor</code>, not on the course (key → instructor → office). If Kim moves offices you'd update many course rows. Extract <code>instructors(name, office)</code> and reference it. (BCNF is a slightly stricter 3NF: <strong>every</strong> determinant must be a candidate key — worth naming if asked what's beyond 3NF.)` },
          { type: "code", lang: "sql", text: `CREATE TABLE students    (student_id INT PRIMARY KEY, name TEXT NOT NULL);
CREATE TABLE instructors (instructor_id INT PRIMARY KEY, name TEXT, office TEXT);
CREATE TABLE courses     (course_id TEXT PRIMARY KEY,
                          instructor_id INT REFERENCES instructors(instructor_id));
CREATE TABLE enrollments (student_id INT REFERENCES students(student_id),
                          course_id  TEXT REFERENCES courses(course_id),
                          PRIMARY KEY (student_id, course_id));` },
          { type: "h3", text: "Denormalization: breaking the rules on purpose" },
          { type: "p", text: `Normalization optimizes for write correctness; reads pay in joins. <strong>Denormalization</strong> deliberately reintroduces redundancy to make hot reads cheap, accepting that the application (or triggers/async jobs) must now keep copies consistent.` },
          { type: "list", items: [
            `Stored aggregates: <code>post.like_count</code> instead of <code>COUNT(*)</code> over a likes table on every render.`,
            `Snapshotted values: <code>order_items.price_at_purchase</code> — here duplication is actually <strong>required</strong> for correctness, since the catalog price changes later.`,
            `Duplicated display fields: <code>comments.author_name</code> to skip a users join on hot paths.`,
            `Whole read-optimized copies: materialized views, search indexes (Elasticsearch), NoSQL feed tables — denormalization at the architecture level.`
          ]},
          { type: "p", text: `The interview-ready stance: <strong>normalize by default (3NF), denormalize selectively with measurements in hand</strong>, and name the sync mechanism (transactional update, trigger, or async event) for every duplicated field.` }
        ]
      },
      {
        id: "transactions-acid",
        title: "Transactions & ACID",
        summary: `ACID guarantees, the read anomalies, and the four isolation levels with what each one actually prevents.`,
        blocks: [
          { type: "p", text: `A transaction groups statements into an all-or-nothing unit. The canonical example: transferring $100 between accounts must debit and credit together — never just one.` },
          { type: "list", items: [
            `<strong>Atomicity</strong> — all statements commit or none do; on failure the transaction rolls back (implemented via undo logs).`,
            `<strong>Consistency</strong> — a transaction moves the DB from one valid state to another; constraints (FKs, checks, uniques) hold at commit.`,
            `<strong>Isolation</strong> — concurrent transactions behave as if serialized to some degree — the tunable one, hence isolation levels.`,
            `<strong>Durability</strong> — once committed, the change survives crashes (write-ahead log flushed to disk before acknowledging commit).`
          ]},
          { type: "h3", text: "Concurrency anomalies" },
          { type: "list", items: [
            `<strong>Dirty read</strong> — reading another transaction's uncommitted change (which may roll back).`,
            `<strong>Non-repeatable read</strong> — re-reading the same row within one transaction returns different data because someone committed in between.`,
            `<strong>Phantom read</strong> — re-running the same <strong>query</strong> returns new rows that another transaction inserted (the range changed, not an existing row).`,
            `<strong>Lost update</strong> — two transactions read-modify-write the same row; the second write silently overwrites the first (both read balance=100, both write 90 — one debit vanishes).`,
            `<strong>Write skew</strong> — two transactions each read a condition and write different rows, jointly violating an invariant (two doctors both check "at least 2 on call" and both go off call). Only serializable isolation prevents it — a strong-signal example to volunteer.`
          ]},
          { type: "h3", text: "Isolation levels" },
          { type: "table", headers: ["Level", "Dirty read", "Non-repeatable read", "Phantom", "Notes"], rows: [
            ["READ UNCOMMITTED", "Possible", "Possible", "Possible", "Rarely used; Postgres treats it as Read Committed"],
            ["READ COMMITTED", "Prevented", "Possible", "Possible", "Default in PostgreSQL, Oracle, SQL Server"],
            ["REPEATABLE READ", "Prevented", "Prevented", "Possible*", "Default in MySQL/InnoDB; *largely prevented there via MVCC snapshot + gap locks"],
            ["SERIALIZABLE", "Prevented", "Prevented", "Prevented", "Full serial-equivalence; also stops write skew; costs throughput/aborts"]
          ]},
          { type: "p", text: `Modern engines implement isolation with <strong>MVCC</strong> (multi-version concurrency control): each transaction reads a consistent snapshot of row versions, so <strong>readers don't block writers and writers don't block readers</strong>. Postgres's Serializable (SSI) detects dangerous patterns optimistically and aborts a transaction rather than locking everything — retrying serialization failures is the application's job.` },
          { type: "h3", text: "Handling the lost update in practice" },
          { type: "code", lang: "sql", text: `-- Pessimistic: lock the row while working with it
BEGIN;
SELECT balance FROM accounts WHERE id = 1 FOR UPDATE;  -- blocks other writers
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
COMMIT;

-- Optimistic: version column; retry if someone else won
UPDATE accounts
SET balance = 400, version = version + 1
WHERE id = 1 AND version = 7;   -- 0 rows updated => conflict, re-read and retry

-- Simplest when applicable: make the write atomic
UPDATE accounts SET balance = balance - 100 WHERE id = 1 AND balance >= 100;` },
          { type: "p", text: `Rule of thumb to state: pessimistic locking (<code>SELECT ... FOR UPDATE</code>) when conflicts are frequent, optimistic versioning when they're rare (cheaper, no held locks). Follow-up you should expect: deadlocks — two transactions locking rows in opposite orders; databases detect and kill one, and the standard prevention is acquiring locks in a consistent global order and keeping transactions short.` }
        ]
      },
      {
        id: "common-query-problems",
        title: "Classic Interview SQL Problems",
        summary: `Second-highest salary, duplicate emails, department top earners, and consecutive events — with solutions and the reasoning behind them.`,
        blocks: [
          { type: "p", text: `These four problems cover the patterns behind most SQL screens: ranking, self-grouping, per-group top-N, and row-to-row comparison. For each, know both the window-function solution (usually cleanest) and a non-window fallback.` },
          { type: "h3", text: "1. Second-highest salary" },
          { type: "p", text: `<strong>Problem:</strong> from <code>employees(id, name, salary)</code>, return the second-highest distinct salary; return NULL if it doesn't exist.` },
          { type: "code", lang: "sql", text: `-- Subquery approach: "highest salary below the maximum"
SELECT MAX(salary) AS second_highest
FROM employees
WHERE salary < (SELECT MAX(salary) FROM employees);

-- Window approach — generalizes to Nth highest
SELECT salary AS second_highest
FROM (SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rk
      FROM employees) t
WHERE rk = 2
LIMIT 1;

-- LIMIT/OFFSET variant (wrap in a subquery so an empty result becomes NULL)
SELECT (SELECT DISTINCT salary FROM employees
        ORDER BY salary DESC LIMIT 1 OFFSET 1) AS second_highest;` },
          { type: "p", text: `Talking points: <code>DISTINCT</code> matters when salaries tie; <code>MAX</code> and the scalar-subquery form naturally yield NULL on a one-row table, while a bare LIMIT/OFFSET query yields zero rows — a classic gotcha. Know the rank trio: <code>ROW_NUMBER</code> (1,2,3,4), <code>RANK</code> (1,2,2,4), <code>DENSE_RANK</code> (1,2,2,3) — Nth-highest wants DENSE_RANK.` },
          { type: "h3", text: "2. Duplicate emails" },
          { type: "p", text: `<strong>Problem:</strong> from <code>users(id, email)</code>, find emails that appear more than once — then delete the duplicates, keeping the smallest id.` },
          { type: "code", lang: "sql", text: `-- Find duplicates: the canonical GROUP BY / HAVING pattern
SELECT email, COUNT(*) AS cnt
FROM users
GROUP BY email
HAVING COUNT(*) > 1;

-- Delete duplicates, keep lowest id per email
DELETE FROM users
WHERE id NOT IN (SELECT MIN(id) FROM users GROUP BY email);

-- Window-function form (Postgres)
DELETE FROM users
WHERE id IN (SELECT id
             FROM (SELECT id, ROW_NUMBER() OVER
                     (PARTITION BY email ORDER BY id) AS rn
                   FROM users) t
             WHERE rn > 1);` },
          { type: "p", text: `Note for MySQL: you can't directly reference the target table in the delete's subquery — wrap it in a derived table. Bonus point: after cleanup, add a unique index on <code>email</code> so duplicates can't return.` },
          { type: "h3", text: "3. Department top earners" },
          { type: "p", text: `<strong>Problem:</strong> from <code>employees(id, name, salary, dept_id)</code> and <code>departments(id, name)</code>, return each department's highest-paid employee(s) — including ties. Variant: top 3 per department.` },
          { type: "code", lang: "sql", text: `-- Window form: rank within each department
SELECT dept_name, name, salary
FROM (SELECT d.name AS dept_name, e.name, e.salary,
             DENSE_RANK() OVER (PARTITION BY e.dept_id
                                ORDER BY e.salary DESC) AS rk
      FROM employees e
      JOIN departments d ON d.id = e.dept_id) t
WHERE rk = 1;          -- rk <= 3 for "top three per department"

-- Non-window form: match against each department's max
SELECT d.name AS dept_name, e.name, e.salary
FROM employees e
JOIN departments d ON d.id = e.dept_id
WHERE (e.dept_id, e.salary) IN (SELECT dept_id, MAX(salary)
                                FROM employees
                                GROUP BY dept_id);` },
          { type: "p", text: `<code>PARTITION BY</code> + rank is <strong>the</strong> per-group top-N pattern — say why DENSE_RANK (ties both included) vs ROW_NUMBER (arbitrary single winner) matches the requirement.` },
          { type: "h3", text: "4. Consecutive events (bonus)" },
          { type: "p", text: `<strong>Problem:</strong> from <code>logins(user_id, login_date)</code>, find users who logged in on 3 or more consecutive days.` },
          { type: "code", lang: "sql", text: `-- Gaps-and-islands: date minus row_number is constant within a streak
WITH d AS (SELECT DISTINCT user_id, login_date FROM logins),
     grp AS (SELECT user_id, login_date,
                    login_date - CAST(ROW_NUMBER() OVER
                      (PARTITION BY user_id ORDER BY login_date)
                      AS INTEGER) AS streak_key
             FROM d)
SELECT DISTINCT user_id
FROM grp
GROUP BY user_id, streak_key
HAVING COUNT(*) >= 3;` },
          { type: "p", text: `The "gaps and islands" trick — consecutive dates minus an increasing row number yield a constant — separates strong SQL candidates; a simpler fallback for exactly-3 is self-joining on <code>date + 1</code> and <code>date + 2</code>. Deduplicate same-day logins first or streak detection breaks.` }
        ]
      }
    ]
  },

  csFundamentals: {
    id: "cs-fundamentals",
    name: "CS Fundamentals",
    intro: `Beyond algorithms and system design, interviewers probe the fundamentals underneath: how the network actually delivers a request, how the OS runs your code, and what your language runtime does with memory. These questions ("what happens when you type a URL?", "process vs thread?", "how would you prevent this deadlock?") are popular precisely because they expose whether your knowledge has depth or is a stack of framework-shaped abstractions.

The six topics here cover the networking stack (OSI, TCP/UDP, HTTP/DNS/TLS) and the systems side (processes and threads, concurrency primitives and deadlock, memory and garbage collection with a Java flavor). Aim to explain each at two altitudes: the crisp one-line answer, and the layer-deeper detail for the follow-up.`,
    topics: [
      {
        id: "osi-model",
        title: "The OSI Model",
        summary: `The seven layers, what actually lives at each one, and how they map to the real-world TCP/IP stack.`,
        blocks: [
          { type: "p", text: `The OSI model is a conceptual 7-layer stack for network communication. Each layer provides services to the layer above and uses the layer below; on send, each layer wraps the payload with its own header (<strong>encapsulation</strong>), and the receiver unwraps in reverse. Real networks run the simpler TCP/IP model, but OSI remains the shared vocabulary — "L4 load balancer", "L7 firewall".` },
          { type: "table", headers: ["#", "Layer", "Unit", "Responsibility", "Lives here"], rows: [
            ["7", "Application", "Data", "Protocols apps speak", "HTTP, DNS, SMTP, gRPC, WebSocket"],
            ["6", "Presentation", "Data", "Format, encoding, encryption", "TLS (roughly), JSON/serialization, compression"],
            ["5", "Session", "Data", "Dialog setup/teardown", "RPC session handling, sockets APIs (loosely)"],
            ["4", "Transport", "Segment", "End-to-end delivery between processes (ports)", "TCP, UDP, QUIC"],
            ["3", "Network", "Packet", "Routing between networks (IP addresses)", "IP, ICMP, routers, BGP/OSPF"],
            ["2", "Data link", "Frame", "Node-to-node on one link (MAC addresses)", "Ethernet, Wi-Fi (802.11), ARP, switches"],
            ["1", "Physical", "Bits", "Signals on the wire/air", "Cables, radio, NIC hardware, hubs"]
          ]},
          { type: "h3", text: "Key distinctions interviewers probe" },
          { type: "list", items: [
            `<strong>L2 vs L3</strong> — MAC addresses move frames one hop on a local network (switches); IP addresses route packets across networks (routers). The MAC header is rewritten at every hop; the IP addresses stay end-to-end (NAT aside).`,
            `<strong>L3 vs L4</strong> — IP gets a packet to a <strong>host</strong>; TCP/UDP ports get it to a <strong>process</strong> on that host. A connection is the 5-tuple (src IP, src port, dst IP, dst port, protocol).`,
            `<strong>L4 vs L7 devices</strong> — an L4 load balancer forwards based on IP/port without reading payloads; an L7 one terminates HTTP and routes on paths/headers.`,
            `ARP glues L3 to L2 ("who has IP 10.0.0.5? tell me your MAC"); DNS is an application-layer protocol even though it feels like infrastructure.`
          ]},
          { type: "h3", text: "Mapping to the TCP/IP model" },
          { type: "table", headers: ["TCP/IP layer", "OSI layers", "Contents"], rows: [
            ["Application", "7 + 6 + 5", "HTTP, TLS, DNS — OSI's top three collapse into one"],
            ["Transport", "4", "TCP, UDP, QUIC"],
            ["Internet", "3", "IP, ICMP"],
            ["Link (network access)", "2 + 1", "Ethernet, Wi-Fi, physical media"]
          ]},
          { type: "p", text: `Sharp observation to offer: layering is idealized — TLS sits awkwardly between transport and application, and QUIC deliberately merges transport and crypto (and runs over UDP) to escape TCP's constraints. Knowing where the model leaks is a senior-level signal.` }
        ]
      },
      {
        id: "tcp-vs-udp",
        title: "TCP vs UDP",
        summary: `The three-way handshake, what TCP's reliability actually costs, and when UDP is the right answer.`,
        blocks: [
          { type: "p", text: `Both are transport-layer protocols multiplexing by port number; the difference is what they promise. <strong>TCP</strong> is connection-oriented and reliable: a byte stream delivered in order, without loss or duplication, with congestion control. <strong>UDP</strong> is connectionless datagrams: no guarantees, no ordering, no connection state — just "send this packet" with near-zero overhead.` },
          { type: "h3", text: "The three-way handshake" },
          { type: "code", lang: "text", text: `Client                          Server
  | ---- SYN  (seq = x) ---------> |   "let's talk; my sequence starts at x"
  | <--- SYN-ACK (seq = y,         |   "agreed; mine starts at y; I got x"
  |         ack = x + 1) --------- |
  | ---- ACK  (ack = y + 1) ----> |   connection ESTABLISHED
  |  ... data flows both ways ...  |` },
          { type: "p", text: `The handshake synchronizes initial sequence numbers in both directions — that's what makes ordering and retransmission possible. It costs one full RTT before any data flows (TLS adds more). Teardown is a FIN/ACK exchange in each direction, with the closing side lingering in TIME_WAIT to absorb stray packets. Related follow-up: a <strong>SYN flood</strong> fills the half-open connection table; defenses include SYN cookies.` },
          { type: "h3", text: "How TCP delivers its guarantees" },
          { type: "list", items: [
            `<strong>Reliability</strong> — every byte is sequence-numbered; the receiver ACKs; unACKed data is retransmitted (timeout or fast retransmit on duplicate ACKs).`,
            `<strong>Ordering</strong> — out-of-order segments are buffered until the gap fills; the app always reads bytes in order. Consequence: one lost packet stalls everything behind it (<strong>head-of-line blocking</strong>).`,
            `<strong>Flow control</strong> — the receiver advertises a window (how much it can buffer) so a fast sender can't drown a slow receiver.`,
            `<strong>Congestion control</strong> — the sender probes network capacity (slow start, AIMD; modern variants CUBIC/BBR), backing off on loss so the network isn't collapsed. Flow control protects the <strong>receiver</strong>, congestion control protects the <strong>network</strong> — a classic distinction question.`
          ]},
          { type: "h3", text: "When to use which" },
          { type: "table", headers: ["", "TCP", "UDP"], rows: [
            ["Guarantees", "Reliable, ordered byte stream", "None — best-effort datagrams"],
            ["Setup", "3-way handshake (1 RTT)", "None"],
            ["Overhead", "20+ byte header, connection state, ACKs", "8-byte header, stateless"],
            ["Speed profile", "Throughput-friendly, latency pays for reliability", "Minimal latency, loss is the app's problem"],
            ["Used by", "HTTP/1.1 & 2, databases, SSH, email, gRPC", "DNS queries, video/voice (RTP), game state, DHCP, QUIC"]
          ]},
          { type: "p", text: `The reasoning to voice: choose UDP when <strong>late data is worthless</strong> — retransmitting a 200 ms-old voice packet is pointless, so codecs conceal the loss instead. Choose TCP when every byte must arrive (files, APIs, pages).` },
          { type: "h3", text: "Common follow-ups" },
          { type: "list", items: [
            `"Is UDP unreliable, meaning it corrupts data?" — No: it has a checksum, so damaged datagrams are dropped; "unreliable" means no delivery/ordering guarantee.`,
            `"Can you build reliability over UDP?" — Yes, in userspace, choosing which guarantees you need: that's exactly <strong>QUIC</strong> (HTTP/3), which gets TLS 1.3 encryption, multiplexed streams without TCP's head-of-line blocking, and 0/1-RTT setup.`,
            `"Why does DNS use UDP?" — one small request/response, no handshake worth paying for; it falls back to TCP for large responses and zone transfers.`
          ]}
        ]
      },
      {
        id: "http-and-dns",
        title: "HTTP, DNS & “What Happens When You Type a URL”",
        summary: `The classic end-to-end question: DNS resolution, TCP/TLS setup, the HTTP exchange, and rendering — with HTTPS at a useful depth.`,
        blocks: [
          { type: "p", text: `"What happens when you type <code>https://www.example.com</code> and press Enter?" is beloved because it traverses the whole stack. Structure the answer as five phases and go deep wherever the interviewer steers.` },
          { type: "h3", text: "1. DNS resolution — name to IP" },
          { type: "list", items: [
            `Check caches first: browser cache → OS resolver cache → (historically <code>/etc/hosts</code>).`,
            `Miss → query the configured <strong>recursive resolver</strong> (ISP, 8.8.8.8, 1.1.1.1). It walks the hierarchy: <strong>root servers</strong> → <strong>.com TLD servers</strong> → <strong>example.com's authoritative servers</strong>, caching each answer per its <strong>TTL</strong>.`,
            `Record types worth naming: <code>A</code>/<code>AAAA</code> (IPv4/IPv6), <code>CNAME</code> (alias), <code>NS</code>, <code>MX</code>, <code>TXT</code>. Big sites return different IPs by geography/load — DNS is itself a load-balancing layer (GeoDNS, anycast).`
          ]},
          { type: "h3", text: "2. TCP connection" },
          { type: "p", text: `The browser opens a TCP connection to the IP on port 443 — the three-way handshake (SYN, SYN-ACK, ACK), one round trip. En route, packets are routed hop-by-hop by IP; ARP resolves next-hop MACs on each local segment; NAT translates private addresses at the home router.` },
          { type: "h3", text: "3. TLS handshake — how HTTPS actually works" },
          { type: "list", items: [
            `Client sends <strong>ClientHello</strong>: supported TLS versions/ciphers, the <strong>SNI</strong> (server name, so one IP can host many certs), and its key-exchange share.`,
            `Server replies with its chosen cipher and its <strong>certificate</strong> — the server's public key signed by a certificate authority. The browser validates the chain up to a trusted root CA, plus hostname match and expiry. This is what defeats man-in-the-middle: an attacker can't produce a cert for your hostname that chains to a trusted CA.`,
            `Both sides run an <strong>ephemeral Diffie-Hellman (ECDHE)</strong> exchange to derive a shared session key — giving <strong>forward secrecy</strong> (a stolen server key later can't decrypt recorded traffic).`,
            `Key idea to state plainly: <strong>asymmetric crypto authenticates and bootstraps the key exchange; the actual traffic is encrypted symmetrically</strong> (AES-GCM/ChaCha20) because symmetric is orders of magnitude faster. TLS 1.3 does all this in one round trip (0-RTT on resumption).`
          ]},
          { type: "h3", text: "4. The HTTP exchange" },
          { type: "code", lang: "text", text: `GET / HTTP/1.1
Host: www.example.com
Accept: text/html
Cookie: session=...

HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Cache-Control: max-age=600
Content-Length: 5321

<!doctype html> ...` },
          { type: "list", items: [
            `Server side: the request typically hits a CDN edge or load balancer, then an app server; the response may come from cache at any layer.`,
            `Know your status classes: 2xx success, <code>301/302/304</code> redirects & not-modified, <code>401</code> unauthenticated vs <code>403</code> forbidden, <code>404</code>, <code>429</code> rate-limited, 5xx server errors.`,
            `Method semantics: GET is safe/idempotent; PUT and DELETE idempotent; POST is not — this drives retry policy and caching.`,
            `HTTP is stateless — cookies (session ID) or tokens (JWT in a header) carry identity across requests.`,
            `Versions: HTTP/1.1 = one request at a time per connection (keep-alive, ~6 parallel connections); HTTP/2 = multiplexed streams over one TCP connection (but TCP-level head-of-line blocking remains); HTTP/3 = QUIC over UDP, removing even that.`
          ]},
          { type: "h3", text: "5. Rendering" },
          { type: "p", text: `The browser parses HTML into the DOM, fetches subresources (CSS, JS, images — each possibly repeating DNS/TCP/TLS, mitigated by connection reuse and the CDN), builds the CSSOM, executes JS, then lays out and paints. A one-sentence version of this phase is fine unless the role is frontend.` },
          { type: "p", text: `Strong closers if time remains: where caching happened at every step (DNS TTL, browser cache via <code>Cache-Control</code>/<code>ETag</code>, CDN, server-side), and what changes on a repeat visit (cached DNS, resumed TLS session, <code>304 Not Modified</code>).` }
        ]
      },
      {
        id: "processes-vs-threads",
        title: "Processes vs Threads",
        summary: `Memory models, context-switch costs, IPC mechanisms, and when you'd choose processes over threads.`,
        blocks: [
          { type: "p", text: `A <strong>process</strong> is a running program with its own virtual address space, file descriptors, and OS bookkeeping. A <strong>thread</strong> is a unit of execution <strong>within</strong> a process: threads of one process share the address space (code, heap, globals, open files) while each has its own <strong>stack</strong>, program counter, and registers. One-liner: <strong>processes are the unit of isolation; threads are the unit of scheduling/concurrency.</strong>` },
          { type: "h3", text: "Memory model" },
          { type: "table", headers: ["Resource", "Between processes", "Between threads (same process)"], rows: [
            ["Address space (heap, globals, code)", "Separate — isolated by virtual memory/MMU", "Shared"],
            ["Stack, registers, program counter", "Separate", "Separate (per thread)"],
            ["Open files / sockets", "Separate (inherited copies on fork)", "Shared"],
            ["A crash / memory corruption", "Contained to that process", "Can take down or corrupt every thread"],
            ["Data exchange", "Explicit IPC required", "Just read/write shared memory (hence locks)"]
          ]},
          { type: "p", text: `This table is the whole trade-off: threads communicate for free but can corrupt each other and need synchronization; processes are safe bulkheads but pay for every byte exchanged. Chrome's process-per-site model chooses isolation (one tab's crash or exploit can't read another's memory); a database engine's worker threads choose shared memory for speed.` },
          { type: "h3", text: "Context switching" },
          { type: "p", text: `The OS scheduler preempts execution and switches to another thread: save registers, swap kernel state, restore the next thread. A <strong>process</strong> switch additionally changes the address space (page-table switch), which historically flushes TLB entries — making process switches costlier than same-process thread switches. Either way the real tax is often <strong>cache pollution</strong> afterward. Rough order: microseconds per switch — cheap once, ruinous at millions/sec, which is why thread-per-request designs give way to thread pools and event loops (and why user-space <strong>green threads</strong> like goroutines/Java virtual threads exist: switching without entering the kernel, at ~KB stack cost instead of ~MB).` },
          { type: "h3", text: "IPC — inter-process communication" },
          { type: "list", items: [
            `<strong>Pipes</strong> — unidirectional byte stream between related processes (<code>ls | grep</code>); <strong>named pipes/FIFOs</strong> work between unrelated ones.`,
            `<strong>Unix domain / TCP sockets</strong> — bidirectional, the general-purpose choice; TCP sockets also work across machines (microservices are IPC over the network).`,
            `<strong>Shared memory</strong> — map the same physical pages into both processes; fastest (no copying), but reintroduces the synchronization problem, so it's paired with semaphores.`,
            `<strong>Message queues / signals</strong> — structured messages; signals are tiny asynchronous pokes (<code>SIGTERM</code>, <code>SIGKILL</code>).`
          ]},
          { type: "h3", text: "Classic follow-ups" },
          { type: "list", items: [
            `<code>fork()</code> duplicates the calling process (copy-on-write pages make it cheap); <code>exec()</code> replaces the image with a new program — the shell's fork-then-exec is the canonical pair.`,
            `"Threads on multiple cores?" — yes, threads of one process run truly in parallel on different cores (Python's GIL being the famous exception for CPU-bound Python threads).`,
            `Concurrency (interleaving, even on one core) vs parallelism (simultaneous execution on multiple cores) — one crisp sentence expected.`,
            `I/O-bound work → many threads or async I/O; CPU-bound work → about one thread per core; isolation/fault-tolerance requirements → processes.`
          ]}
        ]
      },
      {
        id: "concurrency-basics",
        title: "Concurrency Basics",
        summary: `Race conditions, mutexes vs semaphores, the four deadlock conditions and how to break them — with Java examples.`,
        blocks: [
          { type: "p", text: `A <strong>race condition</strong> occurs when correctness depends on the timing of concurrent operations on shared state. The canonical example: <code>count++</code> is not atomic — it's read, add, write. Two threads both read 5, both write 6, and one increment is lost. The buggy region is a <strong>critical section</strong>, and it must be made mutually exclusive or atomic.` },
          { type: "code", lang: "java", text: `class Counter {
    private int count = 0;

    // BROKEN under concurrency: read-modify-write race
    void unsafeIncrement() { count++; }

    // Fix 1: mutual exclusion via the intrinsic lock (monitor)
    synchronized void increment() { count++; }

    // Equivalent block form, locking an explicit object
    private final Object lock = new Object();
    void incrementBlock() {
        synchronized (lock) { count++; }
    }
}

// Fix 2: lock-free atomic hardware instruction (compare-and-swap)
class AtomicCounter {
    private final java.util.concurrent.atomic.AtomicInteger count =
        new java.util.concurrent.atomic.AtomicInteger();
    void increment() { count.incrementAndGet(); }
}` },
          { type: "p", text: `Java notes worth voicing: <code>synchronized</code> provides both <strong>mutual exclusion</strong> and <strong>visibility</strong> (changes made inside the lock are visible to the next acquirer, per the Java Memory Model); <code>volatile</code> gives visibility <strong>only</strong> — it does not make <code>count++</code> safe. <code>ReentrantLock</code> is the explicit-lock alternative with tryLock/timeouts/fairness.` },
          { type: "h3", text: "Mutex vs semaphore" },
          { type: "table", headers: ["", "Mutex (lock)", "Semaphore"], rows: [
            ["Concept", "Ownership — one holder at a time", "A counter of available permits"],
            ["Count", "Binary (locked/unlocked)", "N permits (binary semaphore when N = 1)"],
            ["Who releases", "Only the thread that acquired it", "Any thread may release (signal) — it's a signaling tool"],
            ["Use for", "Protecting a critical section", "Bounding concurrency (connection pool of 10), producer-consumer signaling"],
            ["Java", "synchronized, ReentrantLock", "java.util.concurrent.Semaphore"]
          ]},
          { type: "p", text: `The distinction interviewers want: a mutex answers "who may enter this one-at-a-time section?"; a counting semaphore answers "how many may use this resource at once?" — e.g., <code>new Semaphore(10)</code> gating a pool of 10 DB connections. Also know <strong>condition variables</strong> (<code>wait/notify</code>) for "sleep until this predicate holds" — always call <code>wait()</code> in a loop re-checking the condition, to handle spurious wakeups.` },
          { type: "h3", text: "Deadlock: the four Coffman conditions" },
          { type: "p", text: `Deadlock requires <strong>all four</strong> simultaneously — so breaking any one prevents it:` },
          { type: "list", items: [
            `<strong>Mutual exclusion</strong> — resources can't be shared. (Break: lock-free/atomic structures, immutable data.)`,
            `<strong>Hold and wait</strong> — a thread holds one lock while waiting for another. (Break: acquire all locks upfront atomically, or release before re-acquiring.)`,
            `<strong>No preemption</strong> — locks can't be forcibly taken. (Break: <code>tryLock</code> with timeout — back off, release everything, retry.)`,
            `<strong>Circular wait</strong> — a cycle: T1 holds A wants B; T2 holds B wants A. (Break: <strong>global lock ordering</strong> — everyone acquires locks in the same canonical order. This is the standard practical answer.)`
          ]},
          { type: "code", lang: "java", text: `// Deadlock-prone: transfer(a, b) and transfer(b, a) lock in opposite orders.
// Fix: impose a global order — lock the lower-id account first.
void transfer(Account from, Account to, long amount) {
    Account first  = from.id < to.id ? from : to;
    Account second = from.id < to.id ? to   : from;
    synchronized (first) {
        synchronized (second) {
            from.debit(amount);
            to.credit(amount);
        }
    }
}` },
          { type: "h3", text: "Related terms to have ready" },
          { type: "list", items: [
            `<strong>Livelock</strong> — threads keep changing state in response to each other but make no progress (two people sidestepping in a hallway); fix with randomized backoff.`,
            `<strong>Starvation</strong> — a thread is perpetually denied the lock (unfair scheduling); fair locks/queues fix it at some throughput cost.`,
            `Detection in practice: <code>jstack</code> thread dumps report found Java-level deadlocks; databases detect wait-for cycles and kill a victim transaction.`,
            `Prefer high-level tools over raw locks: <code>ConcurrentHashMap</code>, <code>BlockingQueue</code>, <code>ExecutorService</code>, atomics — say this and interviewers relax.`
          ]}
        ]
      },
      {
        id: "memory-and-gc",
        title: "Memory & Garbage Collection",
        summary: `Stack vs heap, how tracing GC works (Java-flavored), generational collection, and memory leaks in a GC'd language.`,
        blocks: [
          { type: "p", text: `A process's memory is broadly: code, static/global data, the <strong>heap</strong> (dynamic allocations, grows upward), and one <strong>stack per thread</strong> (call frames, grows downward). In Java terms: local variables and references live in stack frames; every object created with <code>new</code> lives on the heap; the reference is on the stack, the object is not.` },
          { type: "h3", text: "Stack vs heap" },
          { type: "table", headers: ["", "Stack", "Heap"], rows: [
            ["Holds", "Call frames: locals, parameters, return addresses", "Objects, arrays — anything dynamically allocated"],
            ["Allocation", "Bump a pointer on call — effectively free", "Allocator/GC-managed (JVM TLAB allocation is also near-free)"],
            ["Lifetime", "Automatic — dies with the frame at return", "Until unreachable (GC) or freed (manual languages)"],
            ["Size", "Small, fixed per thread (~512KB-8MB) — overflow = StackOverflowError", "Large, bounded by -Xmx — exhaustion = OutOfMemoryError"],
            ["Sharing", "Private per thread", "Shared across threads (hence synchronization)"]
          ]},
          { type: "h3", text: "How tracing garbage collection works" },
          { type: "p", text: `The JVM never uses reference counting (which can't reclaim cycles); it uses <strong>tracing</strong>: start from the <strong>GC roots</strong> — thread stacks' local variables, static fields, JNI references — and walk every reference; whatever is reachable is live, everything else is garbage. The classic algorithm is <strong>mark-and-sweep</strong>, usually with <strong>compaction</strong> (sliding live objects together) to eliminate fragmentation and keep allocation a cheap pointer bump.` },
          { type: "h3", text: "Generational collection" },
          { type: "p", text: `The <strong>weak generational hypothesis</strong>: most objects die young. So the heap is split into a <strong>young generation</strong> (eden + two survivor spaces) and an <strong>old generation</strong>. New objects go to eden; frequent <strong>minor GCs</strong> copy the few survivors out and wipe eden wholesale (cost proportional to live data, not garbage — that's the trick). Objects surviving several minor GCs are <strong>promoted</strong> to the old generation, collected rarely by a <strong>major/full GC</strong>.` },
          { type: "list", items: [
            `<strong>Stop-the-world pauses</strong>: the collector must pause application threads at least briefly; GC engineering is about shrinking those pauses.`,
            `Modern collectors: <strong>G1</strong> (default; region-based, targets a pause goal, e.g. 200 ms), <strong>ZGC/Shenandoah</strong> (concurrent, sub-millisecond pauses on multi-TB heaps), Parallel GC (max throughput, batch jobs). Naming the trade-off — throughput vs latency vs footprint — is what matters.`,
            `The mention-worthy flags: <code>-Xmx/-Xms</code> heap size, and "we tuned pause times by switching to ZGC" is a credible war story.`
          ]},
          { type: "h3", text: "Memory leaks in a garbage-collected language" },
          { type: "p", text: `Follow-up you should expect: "Java has GC — can it still leak?" Yes: a leak in a GC'd language is <strong>unintentional reachability</strong> — objects you'll never use again but that something still references, so the GC must keep them.` },
          { type: "list", items: [
            `The classic: an ever-growing <code>static Map</code> used as a cache with no eviction — fix with bounded caches (LRU) or <code>WeakHashMap</code>/weak references.`,
            `Listeners/callbacks registered and never unregistered.`,
            `<code>ThreadLocal</code> values in thread pools — pool threads never die, so the values never become unreachable.`,
            `Diagnosis: heap dump + <code>jmap</code>/Eclipse MAT, find the dominator tree's biggest retainers; symptom is usually rising old-gen usage and lengthening full GCs ending in <code>OutOfMemoryError</code>.`
          ]},
          { type: "p", text: `Good contrast to close with: manual management (C/C++) risks use-after-free, double-free, and leaks; GC eliminates those but costs pause time, memory headroom, and less deterministic destruction — while Rust's ownership model gets safety without a runtime collector at the price of compile-time discipline. One sentence on this spectrum reads as depth.` }
        ]
      }
    ]
  }
};
