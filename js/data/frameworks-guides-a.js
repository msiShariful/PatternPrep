/* Spring Boot guides — part A: Spring vs Boot + The Core (the exemplar all
   framework guides follow). Schema matches structures guides plus `fw`. */
window.FRAMEWORK_TOPICS = window.FRAMEWORK_TOPICS || [];

window.FRAMEWORK_TOPICS.push({
  fw: "spring-boot",
  id: "spring-vs-boot",
  order: 1,
  title: "Spring vs Spring Boot",
  hue: "slate",
  tagline: "Why the roadmap says 'skip Spring' — and what Boot really is",
  minutes: 7,
  summary: "Spring is the engine, Spring Boot is the assembled car. What each one actually is, what Boot automates away, and why starting with Boot teaches you Spring anyway.",
  blocks: [
    { type: "p", text: "Two names, one framework — and the single most common beginner mistake is spending weeks on \"Spring\" tutorials full of XML files before ever touching Spring Boot. Here is the honest relationship: <strong>Spring</strong> is a huge toolkit for building Java applications, and <strong>Spring Boot</strong> is Spring with all the tedious setup decisions already made. Boot is not a different framework, a wrapper, or a lite version. Every Boot app <strong>is</strong> a Spring app. That is why the roadmap crosses out \"Spring\" as a separate stop: you will learn every Spring concept that matters — beans, dependency injection, MVC — from inside Boot, without the ceremony." },
    { type: "callout", variant: "analogy", title: "Engine parts vs the assembled car", text: "Spring is a warehouse of excellent engine parts: a container, a web layer, a transaction manager, a security system. Classic Spring made <strong>you</strong> assemble them — pick versions, bolt parts together in XML, configure a server to run it all. Spring Boot hands you the assembled car with sensible factory settings. You can still open the hood and swap any part; you just don't have to build the car to drive it." },
    { type: "h3", text: "What Spring actually is" },
    { type: "p", text: "At its heart, Spring is an <strong>IoC container</strong>: a runtime that creates your objects, wires them together, and manages their lifecycles (that whole story is the next guide). Around that core grew a family of modules — Spring MVC for web endpoints, Spring Data for databases, Spring Security for auth, and many more. Powerful, but historically it came with real pain: every project began with pages of XML or Java configuration, an external Tomcat server to install and deploy WAR files into, and a version-compatibility puzzle across dozens of libraries." },
    { type: "h3", text: "What Spring Boot adds" },
    { type: "list", items: [
      "<strong>Auto-configuration</strong> — Boot inspects your classpath and configures beans for what it finds. Add the JPA starter and a MySQL driver, and a connection pool, an <code>EntityManager</code>, and a transaction manager appear without a line of config.",
      "<strong>Starters</strong> — one dependency like <code>spring-boot-starter-web</code> pulls in a whole tested, version-aligned stack. No more matching library versions by hand.",
      "<strong>Embedded server</strong> — Tomcat lives <strong>inside</strong> your jar. <code>java -jar app.jar</code> starts a web server; nothing to install or deploy into.",
      "<strong>Production plumbing</strong> — health checks, metrics, and monitoring endpoints via Actuator, ready on day one.",
      "<strong>Zero XML</strong> — configuration is a couple of annotations plus one <code>application.yml</code> file."
    ] },
    { type: "table", headers: ["", "Classic Spring", "Spring Boot"], rows: [
      ["Configuration", "You write it — XML or long Java config", "Auto-configured; you override only what you must"],
      ["Dependencies", "Hand-picked, version-matched one by one", "Curated starters, versions managed for you"],
      ["Server", "External Tomcat/Jetty; deploy a WAR into it", "Embedded; the app <strong>is</strong> the server, runs as a jar"],
      ["First endpoint", "Hours of setup", "Minutes — one class, two annotations"],
      ["Focus", "Assembling the framework", "Writing business logic"]
    ] },
    { type: "h3", text: "A complete Spring Boot application" },
    { type: "p", text: "This is not a snippet of a bigger project — this <strong>is</strong> the whole project. One class, one starter dependency, and you have a running web server with a JSON endpoint:" },
    { type: "code", lang: "java", text: "@SpringBootApplication            // turns on auto-configuration + component scanning\n@RestController                   // this class also answers HTTP requests\npublic class App {\n\n  public static void main(String[] args) {\n    SpringApplication.run(App.class, args);   // starts the container AND the server\n  }\n\n  @GetMapping(\"/hello\")\n  public String hello() {\n    return \"Hello from Spring Boot\";          // http://localhost:8080/hello\n  }\n}" },
    { type: "callout", variant: "rule", title: "Skip the setup, not the concepts", text: "\"Skip Spring\" means skip the <strong>legacy setup</strong>: XML bean files, <code>web.xml</code>, external server deployment. It does not mean skip Spring's <strong>ideas</strong> — IoC, dependency injection, beans, MVC are exactly what interviews and real work test, and Boot is the fastest place to learn them because you see them working immediately." },
    { type: "callout", variant: "pitfall", title: "The 2010 tutorial trap", text: "If a tutorial starts with <code>applicationContext.xml</code>, <code>web.xml</code>, or \"first install Tomcat\", it is teaching you archaeology. Modern Spring — including everything companies actually run — is Boot. The concepts transfer; the ceremony does not." },
    { type: "callout", variant: "pro", title: "Auto-configuration is not magic", text: "Boot's auto-config is ordinary <code>@Configuration</code> classes shipped in the starters, each guarded by conditions like <code>@ConditionalOnClass</code> (\"only if this library is present\") and <code>@ConditionalOnMissingBean</code> (\"only if the user didn't define their own\"). That last guard is why overriding is trivial: declare your own bean and the default silently backs off. Run with <code>--debug</code> and Boot prints a report of every condition that matched or didn't." },
    { type: "check", items: [
      { q: "Is Spring Boot a different framework from Spring?", a: "No. Boot <strong>is</strong> Spring plus opinionated defaults: auto-configuration, starters, and an embedded server. Every bean, annotation, and concept underneath is plain Spring." },
      { q: "What problem do starters solve?", a: "Dependency hell. A starter like <code>spring-boot-starter-web</code> is one line that pulls in a complete, version-compatible stack, instead of you hand-matching a dozen library versions." },
      { q: "Why does <code>java -jar app.jar</code> start a web server?", a: "The server (Tomcat by default) is embedded — it's a library inside your jar that Boot starts from <code>main()</code>. The app owns the server, not the other way round." },
      { q: "How does Boot decide what to auto-configure — and how do you beat it?", a: "Conditions on classpath contents and existing beans. Because most defaults use <code>@ConditionalOnMissingBean</code>, defining your own bean of that type makes Boot's version step aside." }
    ] },
    { type: "ladder", steps: [
      { t: "Learn", d: "Be able to say the engine-vs-car sentence from memory, and name the four things Boot adds on top of Spring." },
      { t: "Drill", d: "Generate a project at start.spring.io with the web starter, run it, and hit your first endpoint. Then move to the container that makes it all work.", href: "#/frameworks/spring-boot/core", link: "Spring Boot Core" },
      { t: "Interview-ready", d: "Answer \"What does Spring Boot actually do?\" with auto-configuration, starters, and the embedded server — with one concrete example of each." },
      { t: "Master", d: "Run any Boot app with --debug and read the auto-configuration report: which conditions matched, which backed off, and why.", href: "#/frameworks/spring-boot", link: "Roadmap map" }
    ] }
  ]
});

window.FRAMEWORK_TOPICS.push({
  fw: "spring-boot",
  id: "core",
  order: 2,
  title: "Spring Boot Core",
  hue: "indigo",
  tagline: "IoC, dependency injection, beans, scopes, and configuration",
  minutes: 14,
  summary: "The container is the whole game: why Spring creates your objects for you, the three flavors of dependency injection, what a bean's life looks like, and how <code>application.yml</code> reshapes an app without recompiling.",
  blocks: [
    { type: "p", text: "Strip away every starter and annotation, and Spring is one idea: <strong>you stop creating your own objects</strong>. Instead of <code>new</code> scattered through the codebase, a container builds the important objects once, wires them into each other, and hands them to whoever declares a need. Every other Spring feature — transactions, security, REST endpoints — is built on top of that container. Understand this guide and the rest of the roadmap becomes details." },
    { type: "callout", variant: "analogy", title: "The restaurant kitchen", text: "In a restaurant you don't walk into the kitchen and cook (<code>new</code>) your own meal — you declare what you need on an order slip, and the kitchen prepares it, with all its own suppliers and pans, and brings it out. Spring's container is the kitchen: your class writes an order slip (a constructor parameter), and a fully prepared object arrives. You never see how it was made, and you never have to." },
    { type: "h3", text: "IoC — Inversion of Control" },
    { type: "p", text: "In a plain program, <strong>your code is in control</strong> of construction: it decides when to build each object and what to pass in. The problem shows up at scale — if <code>OrderService</code> builds its own <code>PaymentClient</code>, then every class that wants an <code>OrderService</code> must know how to build a <code>PaymentClient</code> too, and swapping in a test fake means editing source. IoC <strong>inverts</strong> that: control over construction moves to the container. Your classes only state what they depend on; the container decides how everything is built and shared." },
    { type: "code", lang: "java", text: "// WITHOUT IoC — OrderService controls construction, and is welded to real classes\nclass OrderService {\n  private PaymentClient payments = new PaymentClient(\"https://pay.example\", 30);\n  // hard to test (real HTTP calls!), hard to swap, config leaks in here\n}\n\n// WITH IoC — OrderService declares a need; the container supplies it\n@Service\nclass OrderService {\n  private final PaymentClient payments;\n\n  OrderService(PaymentClient payments) {   // \"I need one of these\"\n    this.payments = payments;              // container passes it in\n  }\n}" },
    { type: "h3", text: "Dependency Injection — the three flavors" },
    { type: "p", text: "Dependency injection (DI) is simply <strong>how</strong> the container delivers what a class asked for. There are three delivery routes, and one clear winner:" },
    { type: "code", lang: "java", text: "// 1. CONSTRUCTOR injection — the recommended default\n@Service\nclass ReportService {\n  private final UserRepository users;      // can be final: set once, never null\n  ReportService(UserRepository users) {    // one constructor ⇒ @Autowired not even needed\n    this.users = users;\n  }\n}\n\n// 2. SETTER injection — for genuinely optional dependencies\n@Service\nclass ExportService {\n  private Formatter formatter = Formatter.PLAIN;   // sensible default\n  @Autowired(required = false)\n  void setFormatter(Formatter f) { this.formatter = f; }\n}\n\n// 3. FIELD injection — works, but don't\n@Service\nclass LegacyService {\n  @Autowired\n  private AuditLog audit;   // can't be final, invisible in tests, hides bloat\n}" },
    { type: "table", headers: ["", "Constructor", "Setter", "Field"], rows: [
      ["Immutable (<code>final</code>)", "✓ yes", "✗ no", "✗ no"],
      ["Object valid on creation", "✓ guaranteed", "✗ partially built", "✗ partially built"],
      ["Plain unit test (no Spring)", "✓ just call <code>new</code>", "△ call setters", "✗ needs reflection"],
      ["Hides too many dependencies", "✗ constructor bloat is visible — good!", "△", "✓ silently grows"],
      ["Use it for", "everything, by default", "optional extras", "avoid"]
    ] },
    { type: "callout", variant: "rule", title: "Constructor injection, final fields, always", text: "One constructor with <code>final</code> fields. You get compile-time safety, objects that are never half-built, and unit tests that just call <code>new</code> with mocks — no Spring required. If the constructor gets embarrassingly long, that's not an argument for field injection; it's the design telling you the class does too much." },
    { type: "h3", text: "Beans and the ApplicationContext" },
    { type: "p", text: "A <strong>bean</strong> is nothing exotic — it's any object the container creates and manages. The <strong>ApplicationContext</strong> is the container itself: a big registry mapping names and types to live objects, plus the machinery that built them. At startup, Boot performs <strong>component scanning</strong>: starting from your <code>@SpringBootApplication</code> class's package, it walks down through sub-packages looking for <code>@Component</code>-family classes (<code>@Service</code>, <code>@Repository</code>, <code>@Controller</code> — same thing, different labels), registers a definition for each, then constructs them in dependency order." },
    { type: "callout", variant: "pitfall", title: "The invisible-bean bug", text: "Scanning starts at your main class's package and only goes <strong>down</strong>. Put a <code>@Service</code> in a sibling or parent package and it is silently never registered — until an injection fails at startup with <code>NoSuchBeanDefinitionException</code>. Keep the main class in the root package of your project and this never happens." },
    { type: "h3", text: "The bean lifecycle" },
    { type: "p", text: "Every singleton bean walks the same road at startup, and knowing the stops explains many mysteries — why <code>@PostConstruct</code> exists, why constructors shouldn't do heavy work, and where cleanup goes on shutdown:" },
    { type: "steps", title: "Life of a bean, from scan to shutdown", frames: [
      { d: "Component scan finds the class and registers a bean definition — a recipe, not an object yet.", cells: { cells: [{ v: "scan", hl: 1 }, { v: "new", dim: true }, { v: "inject", dim: true }, { v: "init", dim: true }, { v: "ready", dim: true }, { v: "destroy", dim: true }] } },
      { d: "The container calls the constructor. Dependencies the constructor asks for are created first — recursively.", cells: { cells: [{ v: "scan", hl: 2 }, { v: "new", hl: 1 }, { v: "inject", dim: true }, { v: "init", dim: true }, { v: "ready", dim: true }, { v: "destroy", dim: true }] } },
      { d: "Remaining injections happen (setter/field). The object exists but isn't open for business yet.", cells: { cells: [{ v: "scan", hl: 2 }, { v: "new", hl: 2 }, { v: "inject", hl: 1 }, { v: "init", dim: true }, { v: "ready", dim: true }, { v: "destroy", dim: true }] } },
      { d: "@PostConstruct runs — the right place for warm-up work: open connections, load caches, validate config. Everything is injected and safe to use here.", cells: { cells: [{ v: "scan", hl: 2 }, { v: "new", hl: 2 }, { v: "inject", hl: 2 }, { v: "init", hl: 1 }, { v: "ready", dim: true }, { v: "destroy", dim: true }], pointers: [{ i: 3, t: "@PostConstruct" }] } },
      { d: "The bean serves requests for the whole life of the application — one shared instance (see scopes below).", cells: { cells: [{ v: "scan", hl: 2 }, { v: "new", hl: 2 }, { v: "inject", hl: 2 }, { v: "init", hl: 2 }, { v: "ready", hl: 1 }, { v: "destroy", dim: true }] } },
      { d: "On graceful shutdown, @PreDestroy runs — close pools, flush buffers, say goodbye. Then the context closes.", cells: { cells: [{ v: "scan", hl: 2 }, { v: "new", hl: 2 }, { v: "inject", hl: 2 }, { v: "init", hl: 2 }, { v: "ready", hl: 2 }, { v: "destroy", hl: 1 }], pointers: [{ i: 5, t: "@PreDestroy" }] } }
    ] },
    { type: "h3", text: "Bean scopes — how many instances exist" },
    { type: "table", headers: ["Scope", "Instances", "When to use"], rows: [
      ["<code>singleton</code> (default)", "one per container, shared by everyone", "Almost everything — services, repositories are stateless, so sharing is free"],
      ["<code>prototype</code>", "a fresh one per injection/request to the container", "Rare: stateful helper objects"],
      ["<code>request</code>", "one per HTTP request", "Web apps: per-request state like the current user"],
      ["<code>session</code>", "one per HTTP session", "Classic server-rendered apps: shopping carts"],
      ["<code>application</code>", "one per ServletContext", "Effectively singleton for web concerns"]
    ] },
    { type: "callout", variant: "pitfall", title: "Singletons are shared — so keep them stateless", text: "One <code>@Service</code> instance may be running on fifty request threads at once. A mutable field on it is a race condition waiting for production traffic. Keep state in method parameters and local variables — or, if a bean truly must hold per-request state, give it <code>request</code> scope. Related trap: injecting a <code>prototype</code> into a <code>singleton</code> freezes one prototype instance forever — the singleton was built once, so its injection happened once." },
    { type: "h3", text: "Configuration classes — beans you build by hand" },
    { type: "p", text: "Component scanning only works on <strong>your</strong> classes — you can't slap <code>@Component</code> on a library's <code>ObjectMapper</code>. For third-party types, or when construction needs logic, declare a <code>@Configuration</code> class with <code>@Bean</code> methods. The method body is yours; the returned object becomes a managed bean exactly as if it had been scanned:" },
    { type: "code", lang: "java", text: "@Configuration\nclass HttpConfig {\n\n  @Bean                                   // method name = bean name\n  RestClient payClient(@Value(\"${pay.base-url}\") String baseUrl) {\n    return RestClient.builder()           // full control over construction\n        .baseUrl(baseUrl)\n        .requestInterceptor(new RetryInterceptor(3))\n        .build();\n  }\n}\n// Rule of thumb: your classes → @Component/@Service;\n// someone else's classes → @Bean method." },
    { type: "h3", text: "Externalized configuration — properties, YAML, profiles" },
    { type: "p", text: "Hard-coding a database URL means recompiling to change environments. Boot instead reads settings from the outside world into one consistent property space — from <code>application.properties</code> or <code>application.yml</code> in your resources, and from environment variables and command-line flags at run time. The same jar then runs against H2 on your laptop and PostgreSQL in production, purely by changing configuration:" },
    { type: "code", lang: "yaml", text: "# application.yml — the shared defaults\nserver:\n  port: 8080\nspring:\n  datasource:\n    url: jdbc:h2:mem:dev          # laptop default\napp:\n  greeting: \"Hello\"\n\n---\n# application-prod.yml — only the overrides for production\nspring:\n  datasource:\n    url: jdbc:postgresql://db.internal:5432/shop" },
    { type: "p", text: "Reading values in code: <code>@Value(\"${app.greeting}\")</code> injects a single property; for anything structured, <code>@ConfigurationProperties(prefix = \"app\")</code> binds a whole section onto a typed class — validated at startup, refactor-safe, and discoverable in the IDE. <strong>Profiles</strong> select which override file joins in: start the app with <code>--spring.profiles.active=prod</code> and <code>application-prod.yml</code> layers on top of the defaults. Beans can join the game too: <code>@Profile(\"prod\")</code> on a bean means it only exists in production." },
    { type: "callout", variant: "pro", title: "Who wins when settings collide", text: "Boot's property sources are an ordered stack, and closer-to-the-launch wins: command-line args beat environment variables, which beat profile-specific files, which beat <code>application.yml</code>, which beats code defaults. That ordering is the whole twelve-factor deployment story — bake defaults into the jar, let each environment override from outside. Ops never edits your jar; you never hard-code their passwords." },
    { type: "check", items: [
      { q: "What does the \"inversion\" in Inversion of Control actually invert?", a: "Who controls object construction. Normally your code decides when and how to <code>new</code> things; with IoC the container constructs and wires everything, and your classes merely declare what they need." },
      { q: "Why is constructor injection preferred over field injection?", a: "Fields can be <code>final</code>, the object is complete the moment it exists, plain unit tests just call <code>new</code> with mocks, and a bloated constructor makes over-coupling visible instead of hiding it behind a stack of <code>@Autowired</code> fields." },
      { q: "Why must a singleton bean avoid mutable fields?", a: "One instance is shared across all threads — concurrent requests reading and writing the same field is a race condition. Singletons should be stateless; per-request state belongs in locals or a request-scoped bean." },
      { q: "Constructor vs <code>@PostConstruct</code> — where does warm-up work go?", a: "In <code>@PostConstruct</code>. When the constructor runs, only constructor-injected dependencies exist and proxies may not be ready; <code>@PostConstruct</code> runs after all injection completes, so everything is safe to touch." },
      { q: "Same jar, different database per environment — how?", a: "Externalized config plus profiles: defaults in <code>application.yml</code>, overrides in <code>application-prod.yml</code>, activated with <code>--spring.profiles.active=prod</code>. Higher-priority sources (env vars, command line) can override anything without touching the jar." }
    ] },
    { type: "ladder", steps: [
      { t: "Learn", d: "Re-tell the kitchen analogy in your own words, then walk the six lifecycle stops from memory: scan, construct, inject, init, ready, destroy." },
      { t: "Drill", d: "Build a two-bean app: a @Service injected into a @RestController via constructor. Break it on purpose — move the service out of the scanned package and read the startup error you get." },
      { t: "Interview-ready", d: "Explain constructor-vs-field injection with the testability argument, and the singleton-statelessness rule with the fifty-threads picture. These two are asked constantly.", href: "#/frameworks/spring-boot/web-mvc", link: "Web: MVC & REST" },
      { t: "Master", d: "Wire a third-party client as a @Bean, bind its settings with @ConfigurationProperties, and swap its config per profile — the everyday trio of real Boot work.", href: "#/frameworks/spring-boot", link: "Roadmap map" }
    ] }
  ]
});
