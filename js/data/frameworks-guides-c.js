/* Spring Boot guides — part C: Hibernate, Annotations, Security. */
window.FRAMEWORK_TOPICS = window.FRAMEWORK_TOPICS || [];

window.FRAMEWORK_TOPICS.push({
  fw: "spring-boot",
  id: "hibernate",
  order: 6,
  title: "Hibernate Under the Hood",
  hue: "amber",
  tagline: "Sessions, caches, lazy proxies, and the N+1 problem",
  minutes: 13,
  summary: "The engine below your repositories: how object–table mapping really works, what the Session and its caches do, why lazy loading throws that famous exception, and how to spot and kill the N+1 query problem.",
  blocks: [
    { type: "p", text: "Spring Data JPA is a very polite interface over a very opinionated machine. When queries mysteriously multiply, when an update happens that you never wrote, when <code>LazyInitializationException</code> appears at 2am — the answers are all one layer down, in Hibernate. You don't need to configure Hibernate by hand anymore; you absolutely need to understand what it's doing, because the difference between a fast data layer and a slow one is almost never the database. It's how the ORM was used." },
    { type: "callout", variant: "analogy", title: "The interpreter with a notebook", text: "Hibernate is an interpreter standing between two people who think differently: Java thinks in <strong>object graphs</strong> (a User <em>has</em> a list of Orders), SQL thinks in <strong>flat tables and joins</strong>. The interpreter carries a notebook — the Session — where it writes down every object it has translated this conversation. Ask for the same one twice and it reads from the notebook instead of asking the database again; change an object and the interpreter quietly notes the edit to replay it later. Most Hibernate surprises are just notebook behavior you didn't know about." },
    { type: "h3", text: "ORM fundamentals — the impedance mismatch" },
    { type: "p", text: "Objects and tables disagree about almost everything: objects have references and inheritance, tables have foreign keys and joins; objects live in a graph you traverse, rows live in sets you query. An <strong>ORM</strong> (object-relational mapper) is the translation layer — you annotate classes (<code>@Entity</code>, <code>@OneToMany</code>), and it generates the SQL to load and store them. The win is enormous: no hand-written mapping code, automatic change tracking, portability across databases. The cost is that the translation has behavior — caching, laziness, flush timing — and pretending it's invisible is how projects end up with a thousand accidental queries per page." },
    { type: "h3", text: "SessionFactory and Session — one heavy, one cheap" },
    { type: "p", text: "Two objects run the show. The <strong>SessionFactory</strong> is built once at startup: it parses all your entity mappings, prepares SQL, and sets up pooling — expensive to create, thread-safe, one per application. A <strong>Session</strong> (in JPA terms, an <code>EntityManager</code>) is the opposite: cheap, short-lived, <em>not</em> thread-safe — you open one per unit of work, typically per transaction, and throw it away. In Boot you rarely see either by name: the factory is auto-configured behind the scenes, and each <code>@Transactional</code> service method gets a Session bound to it automatically. But the lifecycle knowledge matters, because the Session's boundaries are exactly where lazy loading stops working." },
    { type: "h3", text: "Caching — L1 always, L2 on request" },
    { type: "p", text: "The Session's notebook is the <strong>first-level cache (L1)</strong>: within one Session, every loaded entity is remembered by id. Call <code>findById(7)</code> twice in one transaction and the second call does no SQL at all — you even get the <em>same Java object</em> back (an identity map), which is also what makes dirty checking possible. L1 is always on and not optional. The <strong>second-level cache (L2)</strong> is a different animal: a shared, cross-session cache (backed by Ehcache, Caffeine, Redis…) that you opt into per entity with <code>@Cacheable</code> annotations. It shines for read-mostly reference data — countries, categories, plans — and bites for anything written frequently or written by other applications, because a stale cache serves confidently wrong answers. Default to no L2; add it entity by entity with a reason." },
    { type: "h3", text: "Lazy vs eager — and the exception everyone meets" },
    { type: "p", text: "When Hibernate loads an <code>Author</code>, what about their 400 <code>books</code>? Loading everything reachable would pull half the database, so collections default to <strong>LAZY</strong>: the <code>books</code> field is filled with a lightweight <strong>proxy</strong> — a stand-in that knows how to fetch the real data <em>if</em> someone touches it, using the Session it came from. Which explains the rite of passage: touch that field after the transaction ended (say, in Jackson serialization inside the controller), the proxy reaches for its Session, finds it closed, and throws <code>LazyInitializationException</code>. The exception isn't random — it's the proxy telling you \"you asked me to load data outside any unit of work.\" The fixes are all versions of \"decide the fetch inside the transaction\": fetch what the use case needs explicitly (join fetch, below), or map to DTOs before leaving the service layer. Marking everything <code>EAGER</code> is the non-fix — it trades a visible exception for invisible over-fetching on every query forever." },
    { type: "callout", variant: "rule", title: "LAZY by default, fetch by use case", text: "Keep relationships LAZY (JPA already defaults collections to LAZY; set <code>@ManyToOne(fetch = FetchType.LAZY)</code> yourself — its default is EAGER, a spec-level mistake). Then, per query, state what that screen actually needs with <code>join fetch</code> or an <code>@EntityGraph</code>. Fetching is a per-use-case decision, not a per-field one." },
    { type: "h3", text: "The N+1 problem — the classic ORM performance bug" },
    { type: "p", text: "Here is the innocent code that has melted a thousand dashboards: load all authors, loop, and touch each author's lazy <code>books</code> collection. One query becomes one <em>plus one per author</em> — 1 + N. With 200 authors that's 201 round trips to the database for what one join could have returned:" },
    { type: "code", lang: "java", text: "List<Author> authors = authorRepo.findAll();      // 1 query\nfor (Author a : authors) {\n  System.out.println(a.getBooks().size());        // +1 query PER author (lazy load)\n}" },
    { type: "code", lang: "text", text: "select ... from authors                          -- 1\nselect ... from books where author_id = 1        -- 2\nselect ... from books where author_id = 2        -- 3\nselect ... from books where author_id = 3        -- 4\n...                                              -- 201 queries for 200 authors" },
    { type: "steps", title: "Watch N+1 happen — then die", frames: [
      { d: "findAll() runs one tidy query and returns 3 authors. So far, one round trip.", cells: { cells: [{ v: "authors", hl: 1 }, { v: "books 1", dim: true }, { v: "books 2", dim: true }, { v: "books 3", dim: true }, { v: "join", dim: true }] } },
      { d: "The loop touches author #1's lazy books collection — the proxy fires query #2.", cells: { cells: [{ v: "authors", hl: 2 }, { v: "books 1", hl: 1 }, { v: "books 2", dim: true }, { v: "books 3", dim: true }, { v: "join", dim: true }] } },
      { d: "Author #2 — query #3. The database is being interviewed one row at a time.", cells: { cells: [{ v: "authors", hl: 2 }, { v: "books 1", hl: 2 }, { v: "books 2", hl: 1 }, { v: "books 3", dim: true }, { v: "join", dim: true }] } },
      { d: "Author #3 — query #4. With N authors this is 1+N queries; latency scales with your data.", cells: { cells: [{ v: "authors", hl: 2 }, { v: "books 1", hl: 2 }, { v: "books 2", hl: 2 }, { v: "books 3", hl: 1 }, { v: "join", dim: true }] } },
      { d: "The fix: ask for authors WITH their books in one join-fetch query. 201 round trips become 1.", cells: { cells: [{ v: "authors", hl: 2 }, { v: "books 1", hl: 2 }, { v: "books 2", hl: 2 }, { v: "books 3", hl: 2 }, { v: "join", hl: 1 }], pointers: [{ i: 4, t: "1 query" }] } }
    ] },
    { type: "code", lang: "java", text: "// Fix 1 — JPQL join fetch: load the graph you need, in one query\n@Query(\"select distinct a from Author a join fetch a.books\")\nList<Author> findAllWithBooks();\n\n// Fix 2 — @EntityGraph: same effect, keeps the derived method\n@EntityGraph(attributePaths = \"books\")\nList<Author> findAll();" },
    { type: "h3", text: "HQL — querying objects, not tables" },
    { type: "p", text: "<strong>HQL</strong> (and its JPA-standard twin JPQL — what <code>@Query</code> uses) looks like SQL but speaks the object model: <code>select a from Author a where a.publisher.name = :name</code> navigates the <em>relationship</em>, and Hibernate derives the join. You query entities and fields, never tables and columns — rename a column and only the <code>@Column</code> mapping changes, not fifty query strings. When you genuinely need database-specific SQL, <code>@Query(nativeQuery = true)</code> is the labeled escape hatch." },
    { type: "h3", text: "Criteria API — queries built by code" },
    { type: "p", text: "Search screens are the string-query killer: five optional filters means dozens of possible WHERE combinations, and concatenating query strings is a bug farm. The <strong>Criteria API</strong> builds queries programmatically — conditions are objects you add to a list, and the compiler checks types along the way. It's verbose, so use it where it earns its keep: dynamic filtering. In Spring Data the ergonomic wrapper is <code>Specification</code>:" },
    { type: "code", lang: "java", text: "static Specification<User> nameContains(String q) {\n  return (root, query, cb) ->\n      q == null ? null : cb.like(cb.lower(root.get(\"name\")), \"%\" + q.toLowerCase() + \"%\");\n}\n// compose per request: repo.findAll(where(nameContains(q)).and(activeIs(true)))" },
    { type: "h3", text: "Fetch strategies — the whole toolbox" },
    { type: "table", headers: ["Tool", "What it does", "Reach for it when"], rows: [
      ["<code>FetchType.LAZY / EAGER</code>", "The <strong>default</strong> plan mapped on the field", "Set LAZY everywhere; treat EAGER as a smell"],
      ["<code>join fetch</code> (JPQL)", "One query loads parent + children", "A specific use case needs the graph"],
      ["<code>@EntityGraph</code>", "join fetch without writing JPQL", "Derived methods that need eager loading"],
      ["<code>@BatchSize(size = 50)</code>", "Loads lazy collections in IN-clause batches", "Softens N+1 to N/50+1 when a join explodes rows"],
      ["DTO projection", "Skips entities entirely — select straight into a shape", "Read-only screens; often the fastest honest answer"]
    ] },
    { type: "callout", variant: "pitfall", title: "join fetch two collections and enjoy the cartesian product", text: "Join-fetching <em>one</em> collection is the N+1 cure. Join-fetching <strong>two</strong> collections in one query multiplies their rows (10 books × 10 awards = 100 rows per author) and Hibernate may refuse outright with <code>MultipleBagFetchException</code>. Split into two queries, use <code>@BatchSize</code>, or switch that screen to a DTO projection." },
    { type: "callout", variant: "pro", title: "Make query counts a test assertion", text: "Turn on SQL logging in development and read your logs once per feature — N+1 announces itself as a wall of near-identical selects. Teams that stay fast go further: libraries like Hypersistence Utils can <em>assert</em> \"this endpoint runs ≤ 3 queries\" in an integration test, so a teammate's innocent lazy-touch fails CI instead of production." },
    { type: "check", items: [
      { q: "SessionFactory vs Session — lifespan and thread-safety?", a: "SessionFactory: one per app, expensive, thread-safe, built at startup. Session/EntityManager: one per transaction, cheap, NOT thread-safe — in Boot it's bound to your @Transactional method automatically." },
      { q: "What exactly causes LazyInitializationException?", a: "A lazy proxy is touched after its Session closed — typically an entity leaking out of the service layer and getting serialized. The proxy has no live Session to load through, so it throws." },
      { q: "Explain N+1 and name two fixes.", a: "Loading N parents (1 query) then touching a lazy collection per parent (N more). Fixes: JPQL <code>join fetch</code> or <code>@EntityGraph</code> to load the graph in one query; <code>@BatchSize</code>/projections as alternatives." },
      { q: "When is the L2 cache a bad idea?", a: "Frequently-written data or data other systems write too — a shared cache then serves stale entities with total confidence. L2 is for read-mostly reference data, enabled per entity, with an invalidation story." },
      { q: "Why does findById(7) twice in one transaction hit the DB once?", a: "The first load stored the entity in the Session's L1 cache (an identity map); the second call returns the same managed instance without SQL." }
    ] },
    { type: "ladder", steps: [
      { t: "Learn", d: "Retell the interpreter-with-a-notebook analogy, then explain to a rubber duck why LazyInitializationException is the proxy's fault — and yours." },
      { t: "Drill", d: "Reproduce N+1 on purpose: Author/Book on H2, findAll + loop, count the queries in the log. Then fix it with join fetch and count again." },
      { t: "Interview-ready", d: "N+1 (cause + two fixes), lazy vs eager, L1 vs L2 — these three are the entire Hibernate interview 80% of the time. Next, the annotation vocabulary that ties it together.", href: "#/frameworks/spring-boot/annotations", link: "The Annotation Reference" },
      { t: "Master", d: "Take a real list endpoint and make its query count constant (independent of row count) using the fetch toolbox — then write the test that keeps it that way.", href: "#/frameworks/spring-boot", link: "Roadmap map" }
    ] }
  ]
});

window.FRAMEWORK_TOPICS.push({
  fw: "spring-boot",
  id: "annotations",
  order: 7,
  title: "The Annotation Reference",
  hue: "magenta",
  tagline: "Every annotation that matters, grouped and explained",
  minutes: 17,
  summary: "The sixty-odd annotations of daily Spring Boot life, organized into ten families — what each one does in a sentence, code for the patterns worth memorizing, and a decision list for \"which one do I reach for?\".",
  blocks: [
    { type: "p", text: "An annotation is not magic — it's a <strong>label the container reads and acts on</strong>. Your class compiles to the same bytecode with or without <code>@Service</code>; the difference is that at startup, Spring scans for labels and responds: register this bean, wrap that method in a transaction, bind this parameter from the URL. Learn to read every annotation as a sentence — <em>\"container, please do X with this\"</em> — and the whole vocabulary stops being memorization and starts being grammar. This guide is the lookup table: ten families, every member explained, code where a pattern is worth copying." },
    { type: "callout", variant: "analogy", title: "Sticky notes for the container", text: "Imagine handing your code to a very literal assistant along with sticky notes: \"manage this one\" (<code>@Service</code>), \"wrap this in a transaction\" (<code>@Transactional</code>), \"this value comes from the URL\" (<code>@PathVariable</code>). The assistant does exactly what the notes say, at startup or per request. Annotations are those notes — declarative requests, not executable code." },
    { type: "h3", text: "Core & stereotype — \"manage this class\"" },
    { type: "table", headers: ["Annotation", "In one sentence"], rows: [
      ["<code>@SpringBootApplication</code>", "The launcher badge: combines <code>@Configuration</code> + <code>@EnableAutoConfiguration</code> + <code>@ComponentScan</code> — put it on the main class, once"],
      ["<code>@Component</code>", "The generic \"make this a bean\" label — all stereotypes below are specializations of it"],
      ["<code>@Service</code>", "A component that holds business logic — same mechanics, clearer intent"],
      ["<code>@Repository</code>", "A component for data access — also translates persistence exceptions into Spring's DataAccessException family"],
      ["<code>@Controller</code>", "A component that handles web requests, returning view names (server-rendered pages)"],
      ["<code>@RestController</code>", "<code>@Controller</code> + <code>@ResponseBody</code>: return values become the HTTP response body (JSON) — the API default"]
    ] },
    { type: "p", text: "The middle four are <strong>functionally the same annotation</strong> with different names — so why bother? Because the label carries meaning to humans (instant architecture documentation), to Spring (<code>@Repository</code> adds exception translation), and to tooling (slice tests like <code>@WebMvcTest</code> load <em>only</em> controllers). Pick the honest one." },
    { type: "h3", text: "Configuration — \"build beans my way\"" },
    { type: "table", headers: ["Annotation", "In one sentence"], rows: [
      ["<code>@Configuration</code>", "Marks a class as a source of bean definitions — the Java replacement for XML config"],
      ["<code>@Bean</code>", "On a method inside a configuration class: \"the return value is a bean\" — the way to register third-party classes you can't annotate"],
      ["<code>@Primary</code>", "When several beans match one injection point, this one wins by default"],
      ["<code>@DependsOn(\"other\")</code>", "Forces creation order when there's no injection edge to imply it (rare — a design smell if frequent)"],
      ["<code>@Lazy</code>", "Don't build this bean at startup; wait until first use — for expensive, rarely-used objects"],
      ["<code>@Value(\"${app.key}\")</code>", "Injects one property (or SpEL expression) into a field or parameter"],
      ["<code>@ConfigurationProperties(prefix = \"app\")</code>", "Binds a whole config section onto a typed class — validated, refactorable, IDE-discoverable"],
      ["<code>@EnableConfigurationProperties</code>", "Registers such a properties class when it isn't itself a scanned component"]
    ] },
    { type: "h3", text: "Dependency injection — \"give me my collaborators\"" },
    { type: "table", headers: ["Annotation", "In one sentence"], rows: [
      ["<code>@Autowired</code>", "\"Inject here\" — optional on a class's single constructor (Spring injects it automatically), which is why modern code barely shows it"],
      ["<code>@Qualifier(\"name\")</code>", "Disambiguates when several beans share a type: \"I want <em>that</em> one specifically\""],
      ["<code>@Scope(\"prototype\")</code>", "Changes how many instances exist — singleton (default), prototype, request, session"]
    ] },
    { type: "h3", text: "Web & REST — \"bind HTTP to this method\"" },
    { type: "table", headers: ["Annotation", "In one sentence"], rows: [
      ["<code>@RequestMapping(\"/api\")</code>", "Maps a URL prefix (and optionally method/headers) — on classes, with the shortcuts below on methods"],
      ["<code>@GetMapping</code>", "Shorthand for GET — reads"],
      ["<code>@PostMapping</code>", "Shorthand for POST — creates"],
      ["<code>@PutMapping</code>", "Shorthand for PUT — full replacement"],
      ["<code>@DeleteMapping</code>", "Shorthand for DELETE — removal"],
      ["<code>@PatchMapping</code>", "Shorthand for PATCH — partial update"],
      ["<code>@RequestBody</code>", "Deserialize the request body (JSON → object) into this parameter"],
      ["<code>@ResponseBody</code>", "Serialize the return value into the response body — implied by <code>@RestController</code>"],
      ["<code>@PathVariable</code>", "Bind a URL segment: <code>/users/{id}</code> → method parameter"],
      ["<code>@RequestParam</code>", "Bind a query parameter: <code>?page=2</code> → method parameter (defaults, required-ness configurable)"],
      ["<code>@RequestHeader</code>", "Bind an HTTP header value — e.g. <code>Authorization</code>"]
    ] },
    { type: "code", lang: "java", text: "// several bindings working together in one endpoint:\n@PostMapping(\"/users/{id}/orders\")                      // POST /users/7/orders?dryRun=true\nResponseEntity<OrderDto> create(\n    @PathVariable long id,                              // 7, from the URL path\n    @RequestParam(defaultValue = \"false\") boolean dryRun, // from the query string\n    @RequestHeader(\"X-Request-Id\") String requestId,    // from a header\n    @Valid @RequestBody NewOrder body) {                // from the JSON body, validated\n  ...\n}" },
    { type: "h3", text: "Validation — \"reject bad input at the door\"" },
    { type: "table", headers: ["Annotation", "In one sentence"], rows: [
      ["<code>@Valid</code>", "The trigger: validate this object (typically a <code>@RequestBody</code>) against its field constraints — failures become a 400"],
      ["<code>@NotNull</code>", "Must not be null — but <code>\"\"</code> and <code>\" \"</code> pass"],
      ["<code>@NotEmpty</code>", "Not null AND not empty — but <code>\" \"</code> (whitespace) still passes"],
      ["<code>@NotBlank</code>", "Not null, not empty, not just whitespace — the one you want for user-entered strings"],
      ["<code>@Size(min = 2, max = 50)</code>", "Length/size bounds for strings and collections"],
      ["<code>@Email</code>", "Syntactically valid email format"],
      ["<code>@Pattern(regexp = \"…\")</code>", "Must match the regex — for everything else"]
    ] },
    { type: "callout", variant: "pitfall", title: "The @NotNull / @NotEmpty / @NotBlank trap", text: "Interviewers love this one, and so do bugs: <code>@NotNull</code> happily accepts <code>\"\"</code>; <code>@NotEmpty</code> happily accepts <code>\"   \"</code>. For human-typed text, <code>@NotBlank</code> is almost always the correct pick — the other two exist for non-string types and genuine only-null checks. And remember: no <code>@Valid</code> on the parameter, no validation at all — the constraints sit there decoratively." },
    { type: "h3", text: "JPA & Hibernate — \"map this to tables\"" },
    { type: "table", headers: ["Annotation", "In one sentence"], rows: [
      ["<code>@Entity</code>", "This class maps to a table; instances are rows"],
      ["<code>@Table(name = \"users\")</code>", "Overrides the table name (and indexes/constraints)"],
      ["<code>@Id</code>", "Marks the primary-key field"],
      ["<code>@GeneratedValue</code>", "The DB (or a sequence) assigns the id — IDENTITY and SEQUENCE are the strategies you'll meet"],
      ["<code>@Column(nullable = false)</code>", "Column-level details: name, nullability, length, uniqueness"],
      ["<code>@OneToOne</code>", "One row ↔ one row (user–profile)"],
      ["<code>@OneToMany</code>", "Parent → collection of children (author–books); pair with <code>mappedBy</code>"],
      ["<code>@ManyToOne</code>", "Child → parent — the side that owns the foreign key, and the side to set on save"],
      ["<code>@ManyToMany</code>", "Both sides have many (student–course) — needs a join table"],
      ["<code>@JoinColumn(name = \"author_id\")</code>", "Names the foreign-key column on the owning side"],
      ["<code>@JoinTable</code>", "Names the link table (and its columns) for many-to-many"]
    ] },
    { type: "code", lang: "java", text: "@Entity\nclass Author {\n  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)\n  private Long id;\n\n  @OneToMany(mappedBy = \"author\",            // \"the Book.author field owns this\"\n             cascade = CascadeType.ALL, orphanRemoval = true)\n  private List<Book> books = new ArrayList<>();\n}\n\n@Entity\nclass Book {\n  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)\n  private Long id;\n\n  @ManyToOne(fetch = FetchType.LAZY)          // owning side: this table has author_id\n  @JoinColumn(name = \"author_id\")\n  private Author author;\n}\n// The OWNING side (Book.author) is the one Hibernate reads to write the FK —\n// always set book.setAuthor(a) when linking, not just a.getBooks().add(book)." },
    { type: "h3", text: "Transactions — \"all or nothing\"" },
    { type: "table", headers: ["Annotation", "In one sentence"], rows: [
      ["<code>@Transactional</code>", "Wraps the method in a database transaction: commit on success, rollback on unchecked exceptions — put it on service methods"],
      ["<code>@EnableTransactionManagement</code>", "Turns the machinery on — Boot already does this for you; you'll only write it in bare-Spring code"]
    ] },
    { type: "h3", text: "AOP — \"run this around other code\"" },
    { type: "p", text: "<strong>Aspect-oriented programming</strong> answers one question: where do you put logic that applies to <em>hundreds</em> of methods — timing, auditing, retry — without pasting it into each one? You write it once as an <em>aspect</em> and declare where it applies. This is exactly how <code>@Transactional</code> itself works under the hood: a proxy wraps your bean and runs begin/commit around the call. The vocabulary:" },
    { type: "table", headers: ["Annotation", "In one sentence"], rows: [
      ["<code>@Aspect</code>", "This class contains cross-cutting advice"],
      ["<code>@Before</code>", "Run before matching methods"],
      ["<code>@After</code>", "Run after them — success or failure (the finally)"],
      ["<code>@AfterReturning</code>", "Run only after normal returns (can see the result)"],
      ["<code>@AfterThrowing</code>", "Run only when they throw (can see the exception)"],
      ["<code>@Around</code>", "Full control: run code before AND after, or skip/replace the call — the power tool"],
      ["<code>@EnableAspectJAutoProxy</code>", "Enables the proxying — Boot auto-configures it when aspects are present"]
    ] },
    { type: "h3", text: "Scheduling & async — \"run this later / elsewhere\"" },
    { type: "table", headers: ["Annotation", "In one sentence"], rows: [
      ["<code>@EnableScheduling</code>", "Master switch for scheduled tasks — once, on a configuration class"],
      ["<code>@Scheduled(cron = \"0 0 3 * * *\")</code>", "Run this method on a schedule: cron, fixedRate, or fixedDelay"],
      ["<code>@EnableAsync</code>", "Master switch for async execution"],
      ["<code>@Async</code>", "Run this method on a background thread; return void or <code>CompletableFuture&lt;T&gt;</code>"]
    ] },
    { type: "h3", text: "Testing — \"load only what this test needs\"" },
    { type: "table", headers: ["Annotation", "In one sentence"], rows: [
      ["<code>@SpringBootTest</code>", "Boots the entire application context — the heavyweight, for true integration tests"],
      ["<code>@WebMvcTest(UserController.class)</code>", "Loads only the web slice: that controller, advice, converters — services must be mocked"],
      ["<code>@DataJpaTest</code>", "Loads only the JPA slice: entities + repositories on an in-memory DB, each test rolled back"],
      ["<code>@MockBean</code>", "Replaces a real bean in the context with a Mockito mock — the bridge between slices and mocks"],
      ["<code>@BeforeEach / @AfterEach</code>", "Plain JUnit 5: run before/after every test method — setup and cleanup"]
    ] },
    { type: "h3", text: "Which annotation do I reach for?" },
    { type: "list", items: [
      "<strong>My class should be a bean</strong> → <code>@Service</code> / <code>@Repository</code> / <code>@RestController</code> by role; <code>@Component</code> if none fits",
      "<strong>Someone else's class should be a bean</strong> → <code>@Bean</code> method in a <code>@Configuration</code> class",
      "<strong>Two beans match, wrong one injected</strong> → <code>@Primary</code> on the default, or <code>@Qualifier</code> at the injection point",
      "<strong>I need a config value</strong> → one value: <code>@Value</code>; a structured section: <code>@ConfigurationProperties</code>",
      "<strong>Input must be sane</strong> → constraints on the DTO + <code>@Valid</code> on the parameter — and <code>@NotBlank</code> for human text",
      "<strong>Several DB writes must succeed together</strong> → <code>@Transactional</code> on the service method",
      "<strong>Same logic around many methods</strong> → an <code>@Aspect</code> with <code>@Around</code>",
      "<strong>Nightly job / background work</strong> → <code>@Scheduled</code> / <code>@Async</code> (plus their Enable switches)",
      "<strong>Test one layer fast</strong> → <code>@WebMvcTest</code> or <code>@DataJpaTest</code> with <code>@MockBean</code>; whole app → <code>@SpringBootTest</code>"
    ] },
    { type: "callout", variant: "pro", title: "Annotations compose — read the source once", text: "Ctrl-click <code>@RestController</code> and you'll find it's annotated with <code>@Controller</code>, which is annotated with <code>@Component</code> — <em>meta-annotations</em> all the way down. This is why component scan picks all of them up, and it's a power you own too: define <code>@interface IdempotentEndpoint</code> combining <code>@PostMapping</code> + your own marker, and your team's conventions become one word. Frameworks aren't doing anything you can't." },
    { type: "callout", variant: "rule", title: "Annotations declare intent — they don't execute", text: "An annotation with nobody scanning for it does exactly nothing (constraints without <code>@Valid</code>, <code>@Scheduled</code> without <code>@EnableScheduling</code>, <code>@Transactional</code> called from the same class). When a label \"doesn't work\", the question is never \"is the annotation broken\" — it's \"who was supposed to read this note, and did the call actually pass through them?\"" },
    { type: "check", items: [
      { q: "What's the actual difference between @Component, @Service, and @Repository?", a: "Mechanically almost none — all register a bean. The names document intent, slice tests filter on them, and @Repository adds persistence-exception translation. Pick the honest label." },
      { q: "@NotNull vs @NotEmpty vs @NotBlank for a username field?", a: "@NotBlank. @NotNull lets <code>\"\"</code> through, @NotEmpty lets <code>\"   \"</code> through; only @NotBlank demands real content. And none fire without @Valid on the parameter." },
      { q: "In a bidirectional @OneToMany/@ManyToOne, which side must you set — and why?", a: "The owning side — the @ManyToOne with the @JoinColumn (the table holding the FK). Hibernate writes the FK from that side; only adding to the parent's collection won't persist the link." },
      { q: "What three annotations hide inside @SpringBootApplication?", a: "@Configuration (bean definitions), @EnableAutoConfiguration (Boot's defaults), and @ComponentScan (find your beans from this package down)." },
      { q: "Why does @Scheduled sometimes silently never run?", a: "Nobody is reading the note: @EnableScheduling was never declared, or the method's class isn't a bean. Annotations are requests to the container — no container involvement, no behavior." }
    ] },
    { type: "ladder", steps: [
      { t: "Learn", d: "Cover each table and recite the one-liners for the stereotype, web, and validation families — the three you'll type daily." },
      { t: "Drill", d: "Write one endpoint using @PathVariable, @RequestParam, @RequestHeader, and a @Valid body together, and watch each binding fail correctly with bad input." },
      { t: "Interview-ready", d: "Own the trap questions: NotNull-vs-NotBlank, the owning side, what @SpringBootApplication expands to, and why self-invocation breaks @Transactional. Then lock the API down.", href: "#/frameworks/spring-boot/security", link: "Security, JWT & OAuth2" },
      { t: "Master", d: "Ctrl-click three framework annotations to their meta-annotation roots, then compose one custom annotation for a convention your code repeats.", href: "#/frameworks/spring-boot", link: "Roadmap map" }
    ] }
  ]
});

window.FRAMEWORK_TOPICS.push({
  fw: "spring-boot",
  id: "security",
  order: 8,
  title: "Security, JWT & OAuth2",
  hue: "red",
  tagline: "The filter chain, password hashing, tokens, and social login",
  minutes: 14,
  summary: "How Spring Security guards every request before your code runs: authentication vs authorization, BCrypt passwords, going stateless with JWTs — creation, validation, the full round trip — and OAuth2 for \"Sign in with Google\" and resource servers.",
  blocks: [
    { type: "p", text: "Add <code>spring-boot-starter-security</code> to a project and restart: every endpoint now returns 401, a login page exists, and a generated password is printed in the logs. You wrote nothing. That aggressive default teaches the model in one gesture — security in Spring is a <strong>wall in front of everything</strong>, and your job is to open specific doors deliberately, not to remember to lock each room. This guide walks the wall: the filter chain, who-are-you versus what-may-you-do, password storage that survives a database leak, JWTs for stateless APIs, and OAuth2 when someone else does the authenticating." },
    { type: "callout", variant: "analogy", title: "Airport security, not door locks", text: "A naive app checks permissions inside each endpoint — like giving every shop in the airport its own security guard and hoping none forgets. Spring Security is the airport model: <strong>one checkpoint</strong> everyone passes before reaching any gate. Identity check (authentication) happens at the checkpoint; which lounge you may enter (authorization) is checked at each door against the badge you were issued. Controllers never see an unscreened request." },
    { type: "h3", text: "The filter chain — security before Spring MVC" },
    { type: "p", text: "Spring Security is implemented as a chain of <strong>servlet filters</strong> — which means it runs <em>before</em> the DispatcherServlet, before routing, before any controller. Every request walks through a pipeline of specialized filters in a fixed order: CORS handling, then authentication filters (each looks for its kind of credential — a session cookie, a Basic header, a Bearer token — and if found, establishes an identity), then the authorization filter at the end, which compares that identity against your rules and either lets the request through or stops it with 401 (no credible identity) or 403 (identity fine, permission missing). You configure the whole pipeline as one bean:" },
    { type: "code", lang: "java", text: "@Configuration\n@EnableWebSecurity\nclass SecurityConfig {\n\n  @Bean\n  SecurityFilterChain filterChain(HttpSecurity http) throws Exception {\n    return http\n      .csrf(csrf -> csrf.disable())                       // token APIs: CSRF off\n      .sessionManagement(s ->\n          s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))  // no HTTP session\n      .authorizeHttpRequests(auth -> auth\n          .requestMatchers(\"/auth/**\", \"/actuator/health\").permitAll()  // open doors\n          .requestMatchers(\"/admin/**\").hasRole(\"ADMIN\")               // role-gated\n          .anyRequest().authenticated())                               // the wall\n      .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)\n      .build();\n  }\n\n  @Bean\n  PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }\n}" },
    { type: "cells", title: "The chain, in order", cells: [
      { v: "CORS" }, { v: "authn", hl: 1 }, { v: "authz", hl: 1 }, { v: "MVC", hl: 2 }, { v: "controller", hl: 2 }
    ], pointers: [{ i: 1, t: "who are you" }, { i: 2, t: "may you" }], caption: "Identity is established, then permission is checked — only then does routing even begin. UsernamePasswordAuthenticationFilter is one of the authn stations; custom JWT filters slot in beside it." },
    { type: "h3", text: "Authentication vs authorization — two different questions" },
    { type: "p", text: "The words blur together until an interviewer asks; keep them surgically apart. <strong>Authentication</strong>: <em>who are you?</em> — verifying credentials (password, token, Google account) and attaching an identity to the request. Failure is <code>401 Unauthorized</code>. <strong>Authorization</strong>: <em>given who you are, may you do this?</em> — comparing that identity's roles/authorities against the resource's requirements. Failure is <code>403 Forbidden</code>. The status codes are the tell: 401 means \"I don't believe you\"; 403 means \"I believe you, and no.\"" },
    { type: "h3", text: "Password encoders — plan for the leak" },
    { type: "p", text: "Store passwords assuming your database <em>will</em> someday leak. Plaintext is instant catastrophe; fast hashes like MD5/SHA-256 are barely better, because attackers hash billions of guesses per second on a GPU and precomputed rainbow tables reverse common passwords instantly. <strong>BCrypt</strong> — Spring's default — is built to be attack-resistant in two ways: it generates a random <strong>salt</strong> per password (same password → different hash, rainbow tables dead) and it is <strong>deliberately slow</strong>, with a tunable cost factor you can raise as hardware improves. Verification never decrypts anything — <code>encoder.matches(raw, storedHash)</code> re-hashes the attempt with the stored salt and compares:" },
    { type: "code", lang: "java", text: "PasswordEncoder enc = new BCryptPasswordEncoder();\n\nString stored = enc.encode(\"hunter2\");      // \"$2a$10$N9qo8uLO…\" — salt is inside\nenc.matches(\"hunter2\", stored);             // true — re-hash and compare\nenc.matches(\"hunter3\", stored);             // false\n// encode(\"hunter2\") twice → two DIFFERENT hashes. That's the salt working." },
    { type: "h3", text: "Stateless authentication — why APIs drop the session" },
    { type: "p", text: "Classic web login is <strong>stateful</strong>: the server keeps a session in memory and hands the browser a cookie pointing at it. That works until you scale — two servers behind a load balancer don't share memory, so you need sticky sessions or a session store, and mobile/SPA clients handle cookies badly anyway. The <strong>stateless</strong> alternative: the server keeps <em>nothing</em>; instead, at login it issues a signed token containing the identity, and the client presents it on every request. Any server instance can verify the signature independently — no shared state, no lookup, horizontal scaling for free. That's what <code>SessionCreationPolicy.STATELESS</code> declares: never create a session; every request must carry its own proof." },
    { type: "h3", text: "JWT — the signed passport" },
    { type: "p", text: "A <strong>JSON Web Token</strong> is three Base64 parts joined by dots: <code>header.payload.signature</code>. The header names the signing algorithm; the <strong>payload</strong> carries claims — subject (user id), roles, issued-at, and crucially <code>exp</code> (expiry); the <strong>signature</strong> is a cryptographic seal over the first two parts, made with a key only the server holds. Two properties follow: anyone can <em>read</em> a JWT (it's encoded, <strong>not encrypted</strong> — never put secrets in claims), but nobody can <em>alter</em> one — change a single character of the payload and the signature no longer matches. Validation is pure math: recompute the signature, compare, check the expiry. No database, no session store." },
    { type: "steps", title: "The JWT round trip", frames: [
      { d: "Client POSTs credentials to /auth/login — the one endpoint that accepts a password.", cells: { cells: [{ v: "login", hl: 1 }, { v: "sign", dim: true }, { v: "store", dim: true }, { v: "send", dim: true }, { v: "verify", dim: true }, { v: "serve", dim: true }] } },
      { d: "Server checks the password with BCrypt, then signs a JWT: user id + roles + expiry, sealed with the secret key.", cells: { cells: [{ v: "login", hl: 2 }, { v: "sign", hl: 1 }, { v: "store", dim: true }, { v: "send", dim: true }, { v: "verify", dim: true }, { v: "serve", dim: true }] } },
      { d: "Client stores the token (memory, or an HttpOnly cookie) — the server remembers nothing.", cells: { cells: [{ v: "login", hl: 2 }, { v: "sign", hl: 2 }, { v: "store", hl: 1 }, { v: "send", dim: true }, { v: "verify", dim: true }, { v: "serve", dim: true }] } },
      { d: "Every later request carries it: Authorization: Bearer eyJhbGci… — no cookies, no session.", cells: { cells: [{ v: "login", hl: 2 }, { v: "sign", hl: 2 }, { v: "store", hl: 2 }, { v: "send", hl: 1 }, { v: "verify", dim: true }, { v: "serve", dim: true }] } },
      { d: "A JWT filter in the chain recomputes the signature and checks expiry. Valid → identity goes into the SecurityContext. Invalid → 401, controller never runs.", cells: { cells: [{ v: "login", hl: 2 }, { v: "sign", hl: 2 }, { v: "store", hl: 2 }, { v: "send", hl: 2 }, { v: "verify", hl: 1 }, { v: "serve", dim: true }], pointers: [{ i: 4, t: "signature + exp" }] } },
      { d: "The request proceeds with an authenticated identity — any server instance could have done this, which is the whole point of stateless.", cells: { cells: [{ v: "login", hl: 2 }, { v: "sign", hl: 2 }, { v: "store", hl: 2 }, { v: "send", hl: 2 }, { v: "verify", hl: 2 }, { v: "serve", hl: 1 }] } }
    ] },
    { type: "callout", variant: "pitfall", title: "You cannot un-issue a JWT", text: "Statelessness cuts both ways: a stolen token is valid until it expires, and \"log out\" can't reach into clients to delete copies. Mitigate by design: <strong>short expiry</strong> (minutes, not days) plus a refresh token that CAN be revoked server-side; and never store JWTs in <code>localStorage</code> where any XSS can read them — prefer memory or HttpOnly cookies. If you find yourself building a \"token blacklist\" table checked on every request, notice what happened: you've reinvented sessions." },
    { type: "h3", text: "OAuth2 — outsourcing the login" },
    { type: "p", text: "OAuth2 answers a different question: <em>what if someone else verifies the user?</em> \"Sign in with Google\" means your app never sees a password — the user authenticates at Google, and Google hands your app a signed proof of identity. Spring Security packages the whole dance: add <code>spring-boot-starter-oauth2-client</code>, register your app with Google to get a client id and secret, and configuration is genuinely this small:" },
    { type: "code", lang: "yaml", text: "spring:\n  security:\n    oauth2:\n      client:\n        registration:\n          google:\n            client-id: ${GOOGLE_CLIENT_ID}\n            client-secret: ${GOOGLE_CLIENT_SECRET}\n# + http.oauth2Login() in the filter chain — Google's login page does the rest" },
    { type: "p", text: "Two roles, one distinction worth memorizing. <code>oauth2Login()</code> makes your app a <strong>client</strong>: it sends users to Google and consumes the identity that comes back — social login. <code>oauth2ResourceServer()</code> makes your app a <strong>resource server</strong>: it doesn't log anyone in; it just validates <code>Bearer</code> tokens that some authorization server (Google, Keycloak, Auth0, your own) issued — the standard setup for APIs sitting behind a separate identity provider. Point it at the issuer and Spring fetches the public keys and validates signatures automatically:" },
    { type: "code", lang: "yaml", text: "spring:\n  security:\n    oauth2:\n      resourceserver:\n        jwt:\n          issuer-uri: https://accounts.google.com\n# every request's Bearer token is now verified against Google's published keys" },
    { type: "callout", variant: "rule", title: "Don't build what you can validate", text: "Rolling your own login, password reset, MFA, and token issuance is months of security-critical work. The mature pattern: let an identity provider (Google, Auth0, Keycloak, Cognito) do authentication, and make your API a resource server that merely validates tokens. You write almost no security code — and the code you didn't write is code that can't be wrong." },
    { type: "callout", variant: "pro", title: "Method security is the second lock", text: "URL rules are coarse. Add <code>@EnableMethodSecurity</code> and you can gate individual service methods: <code>@PreAuthorize(\"hasRole('ADMIN') or #userId == authentication.name\")</code> — \"admins, or the owner themselves.\" Defense in depth: even if a controller route is misconfigured someday, the service method still refuses. Auditors love it; so do future-you." },
    { type: "check", items: [
      { q: "401 vs 403 — which is which?", a: "401 Unauthorized = authentication failed: no credible identity. 403 Forbidden = authenticated fine, but this identity lacks permission. \"I don't believe you\" vs \"I believe you, and no.\"" },
      { q: "Why BCrypt instead of SHA-256 for passwords?", a: "BCrypt salts every hash (rainbow tables useless, identical passwords hash differently) and is deliberately slow with a tunable cost — turning billions of GPU guesses per second into thousands." },
      { q: "Can a client read what's inside its JWT? Can it change it?", a: "Read: yes — Base64 is encoding, not encryption, so no secrets in claims. Change: no — any edit breaks the signature, which the server recomputes on every request." },
      { q: "Why does stateless auth scale better than sessions?", a: "No server-side session state: any instance can validate a token by signature alone, so there's nothing to share, replicate, or sticky-route between servers." },
      { q: "oauth2Login vs oauth2ResourceServer?", a: "oauth2Login makes the app a client that sends users to a provider to authenticate (social login). oauth2ResourceServer makes it an API that validates Bearer tokens issued elsewhere — it never logs anyone in itself." }
    ] },
    { type: "ladder", steps: [
      { t: "Learn", d: "Walk the six JWT round-trip stations from memory, and state the 401/403 distinction in one breath each." },
      { t: "Drill", d: "Add the security starter, write the SecurityFilterChain above, and verify: /auth open, everything else 401, an ADMIN route 403 for normal users." },
      { t: "Interview-ready", d: "Authn vs authz, why BCrypt, JWT anatomy and its revocation weakness, sessions vs stateless — then prove the whole setup with tests.", href: "#/frameworks/spring-boot/testing", link: "Testing Spring Boot" },
      { t: "Master", d: "Wire real Google login with oauth2Login, then convert the API to a resource server against the same issuer — and explain when you'd choose each.", href: "#/system-design", link: "System Design" }
    ] }
  ]
});
