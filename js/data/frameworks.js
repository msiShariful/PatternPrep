/* Frameworks — roadmap mind maps (#/frameworks).
   Node shape matches PATTERN_MAP: { t, kids? }; top-level branches also carry
   a hue. Rendered by the same atlas engine as the Pattern map. */
window.FRAMEWORK_TOPICS = window.FRAMEWORK_TOPICS || [];

window.FRAMEWORKS = {
  items: [
    {
      id: "spring-boot",
      name: "Spring Boot",
      root: "Spring Boot Roadmap",
      tagline: "Beans, JPA, security, actuators — the whole Boot landscape",
      blurb: "The complete Spring Boot learning path as an explorable mind map: the core container, MVC & REST, data access with JPA and Hibernate, every annotation that matters, security with JWT and OAuth2, testing, and production features — organized the way you should learn them.",
      credit: "Adapted from CodeWithNishchal's Spring Boot roadmap",
      branches: [
        {
          t: "Spring ❌ — skip it", hue: "graphite", learn: "spring-vs-boot", kids: [
            { t: "Jump straight to Spring Boot — without learning Spring first" }
          ]
        },
        { t: "Difference between Spring & Spring Boot", hue: "slate", learn: "spring-vs-boot" },
        {
          t: "Spring Boot Core", hue: "indigo", learn: "core", kids: [
            {
              t: "Dependency Injection", kids: [
                { t: "Constructor Injection" },
                { t: "Setter Injection" },
                { t: "Field Injection" }
              ]
            },
            { t: "IoC (Inversion of Control)" },
            { t: "Bean Creation & Bean Lifecycle" },
            { t: "Bean Scopes" },
            { t: "Configuration Classes" },
            {
              t: "Externalized Configuration", kids: [
                { t: "application.properties" },
                { t: "application.yml" },
                { t: "Profiles" }
              ]
            },
            { t: "ApplicationContext" }
          ]
        },
        {
          t: "Spring Boot Web (MVC & REST)", hue: "blue", learn: "web-mvc", kids: [
            { t: "Spring MVC in Boot" },
            { t: "Controller Layer" },
            { t: "Service Layer" },
            { t: "Repository Layer" },
            { t: "DTO Layer" },
            {
              t: "Exception Handling", kids: [
                { t: "@ControllerAdvice" },
                { t: "@ExceptionHandler" }
              ]
            },
            { t: "Filters" },
            { t: "Interceptors" }
          ]
        },
        {
          t: "Spring Boot Data Access", hue: "green", learn: "data-jpa", kids: [
            {
              t: "Spring Data JPA", kids: [
                { t: "JpaRepository" },
                { t: "CRUD operations" },
                { t: "Derived query methods" },
                { t: "Pagination & Sorting" },
                { t: "Projections" }
              ]
            },
            {
              t: "Hibernate Essentials", kids: [
                { t: "Entity lifecycle" },
                { t: "Lazy & Eager Loading" },
                { t: "Cascading" },
                { t: "Connection pooling" }
              ]
            },
            {
              t: "Database Support", kids: [
                { t: "H2 Database" },
                { t: "MySQL / PostgreSQL configuration" }
              ]
            },
            {
              t: "Transaction Management", kids: [
                { t: "ACID properties" },
                { t: "@Transactional usage" },
                { t: "Isolation levels" }
              ]
            },
            {
              t: "JDBC ❌ — not needed", kids: [
                { t: "JdbcTemplate" },
                { t: "RowMapper" }
              ]
            }
          ]
        },
        {
          t: "Spring Boot Annotations", hue: "magenta", learn: "annotations", kids: [
            {
              t: "Core / Stereotype", kids: [
                { t: "@SpringBootApplication" },
                { t: "@Component" },
                { t: "@Service" },
                { t: "@Repository" },
                { t: "@Controller" },
                { t: "@RestController" }
              ]
            },
            {
              t: "Configuration", kids: [
                { t: "@Configuration" },
                { t: "@Bean" },
                { t: "@Primary" },
                { t: "@DependsOn" },
                { t: "@Lazy" },
                { t: "@Value" },
                { t: "@ConfigurationProperties" },
                { t: "@EnableConfigurationProperties" }
              ]
            },
            {
              t: "Dependency Injection", kids: [
                { t: "@Autowired" },
                { t: "@Qualifier" },
                { t: "@Scope" }
              ]
            },
            {
              t: "Web / REST", kids: [
                { t: "@RequestMapping" },
                { t: "@GetMapping" },
                { t: "@PostMapping" },
                { t: "@PutMapping" },
                { t: "@DeleteMapping" },
                { t: "@PatchMapping" },
                { t: "@RequestBody" },
                { t: "@ResponseBody" },
                { t: "@PathVariable" },
                { t: "@RequestParam" },
                { t: "@RequestHeader" }
              ]
            },
            {
              t: "Validation", kids: [
                { t: "@Valid" },
                { t: "@NotNull" },
                { t: "@NotBlank" },
                { t: "@NotEmpty" },
                { t: "@Size" },
                { t: "@Email" },
                { t: "@Pattern" }
              ]
            },
            {
              t: "JPA / Hibernate", kids: [
                { t: "@Entity" },
                { t: "@Table" },
                { t: "@Id" },
                { t: "@GeneratedValue" },
                { t: "@Column" },
                { t: "@OneToOne" },
                { t: "@OneToMany" },
                { t: "@ManyToOne" },
                { t: "@ManyToMany" },
                { t: "@JoinColumn" },
                { t: "@JoinTable" }
              ]
            },
            {
              t: "Transaction", kids: [
                { t: "@Transactional" },
                { t: "@EnableTransactionManagement" }
              ]
            },
            {
              t: "AOP", kids: [
                { t: "@Aspect" },
                { t: "@Before" },
                { t: "@After" },
                { t: "@AfterReturning" },
                { t: "@AfterThrowing" },
                { t: "@Around" },
                { t: "@EnableAspectJAutoProxy" }
              ]
            },
            {
              t: "Scheduling / Async", kids: [
                { t: "@EnableScheduling" },
                { t: "@Scheduled" },
                { t: "@EnableAsync" },
                { t: "@Async" }
              ]
            },
            {
              t: "Testing", kids: [
                { t: "@SpringBootTest" },
                { t: "@WebMvcTest" },
                { t: "@DataJpaTest" },
                { t: "@MockBean" },
                { t: "@BeforeEach / @AfterEach" }
              ]
            }
          ]
        },
        {
          t: "Hibernate (ORM)", hue: "amber", learn: "hibernate", kids: [
            { t: "ORM Fundamentals" },
            { t: "SessionFactory lifecycle" },
            { t: "Hibernate caching (L1, L2)" },
            { t: "Lazy vs Eager Loading" },
            { t: "Hibernate Query Language (HQL)" },
            { t: "Hibernate Criteria API" },
            { t: "N+1 Select Problem" },
            { t: "Fetch strategies" }
          ]
        },
        {
          t: "Embedded Servers", hue: "brown", learn: "build-run-deploy", kids: [
            { t: "Tomcat" },
            { t: "Jetty" }
          ]
        },
        {
          t: "Spring Boot Security", hue: "red", learn: "security", kids: [
            { t: "Basics of Spring Security" },
            { t: "Authentication" },
            { t: "Authorization" },
            { t: "Password Encoders" },
            { t: "Security Filters" },
            { t: "Stateless Authentication" },
            {
              t: "JWT Authentication", kids: [
                { t: "Token creation" },
                { t: "Token validation" },
                { t: "Stateless authentication" }
              ]
            },
            {
              t: "OAuth2", kids: [
                { t: "OAuth2 login" },
                { t: "Social login (Google)" },
                { t: "Resource server" }
              ]
            }
          ]
        },
        {
          t: "Build Tools", hue: "orange", learn: "build-run-deploy", kids: [
            { t: "Maven" },
            { t: "Gradle" },
            { t: "Spring Boot plugin" },
            { t: "Packaging (JAR / WAR)" },
            { t: "Running with profiles" }
          ]
        },
        {
          t: "RESTful Web Services", hue: "teal", learn: "rest-apis", kids: [
            {
              t: "HTTP Methods", kids: [
                { t: "GET" },
                { t: "POST" },
                { t: "PUT" },
                { t: "PATCH" },
                { t: "DELETE" }
              ]
            },
            { t: "API Design" },
            { t: "JSON / XML data exchange" },
            { t: "Swagger / OpenAPI docs · Postman" }
          ]
        },
        {
          t: "Spring Boot Testing", hue: "purple", learn: "testing", kids: [
            { t: "Unit Testing (JUnit + Mockito)" },
            { t: "@SpringBootTest" },
            { t: "Web layer testing" },
            { t: "JPA testing" },
            { t: "MockMvc" }
          ]
        },
        {
          t: "Deployment Basics", hue: "graphite", learn: "build-run-deploy", kids: [
            { t: "Fat JAR" },
            { t: "Environment variables" },
            { t: "External config folders" }
          ]
        },
        {
          t: "Spring Boot Advanced Features", hue: "indigo", learn: "advanced", kids: [
            {
              t: "Actuator", kids: [
                { t: "Health" },
                { t: "Info" },
                { t: "Metrics" }
              ]
            },
            { t: "Custom Actuator Endpoints" },
            {
              t: "Caching", kids: [
                { t: "@Cacheable" },
                { t: "@CacheEvict" }
              ]
            },
            { t: "Scheduling" },
            { t: "Async processing" },
            { t: "File uploads" },
            { t: "WebClient / RestTemplate" }
          ]
        }
      ]
    }
  ]
};
