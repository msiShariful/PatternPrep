window.BEHAVIORAL = {
  id: "behavioral",
  name: "Behavioral",
  intro: `Engineers routinely spend 200 hours on LeetCode and zero hours preparing stories — then lose the offer in a round they assumed was a formality. At FAANG the behavioral loop is real signal: at Amazon roughly half the loop is Leadership Principle questions (including the bar raiser, who can veto the hire), Google's hire committee reads written Googleyness & Leadership feedback alongside your coding scores, and Meta runs a dedicated behavioral round with its own rubric. A "no hire" on behavioral sinks a loop just as surely as a failed coding round — and unlike coding, it is the one round where borderline technical performance can still be rescued by strong leadership signal.

The good news: behavioral is the most preparable round in the loop. Interviewers are scoring you against known rubrics with known question banks, and a bank of 8-10 well-chosen, quantified stories covers essentially every question you will be asked. Prepare it with the same rigor you give algorithms — structured framework (STAR), deliberate practice out loud, and iteration — and it becomes your highest-ROI prep hour.`,
  topics: [
    {
      id: "why-behavioral-matters",
      title: "Why Behavioral Rounds Decide Offers",
      summary: `How FAANG loops actually weight behavioral signal, what interviewers write in feedback, and why the same question is scored differently at L4 versus L6.`,
      blocks: [
        { type: "p", text: `The most common FAANG rejection story is not "failed the hard graph problem." It is "solved everything, got rejected anyway." When that happens, the feedback packet almost always shows weak behavioral signal: vague stories, no ownership, no data. Understanding how each company actually weights this round is the first step to taking it seriously.` },
        { type: "h3", text: "How the big loops weight behavioral" },
        { type: "list", items: [
          `<strong>Amazon:</strong> every interviewer in the loop asks Leadership Principle questions — typically 2 LP questions per interview even in coding rounds — so behavioral is roughly <strong>50% of the entire loop</strong>. The <strong>bar raiser</strong>, an interviewer from outside the hiring team, runs an almost entirely behavioral interview and holds effective veto power over the hire.`,
          `<strong>Google:</strong> a dedicated <strong>Googleyness & Leadership (G&L)</strong> interview, scored separately from General Cognitive Ability. The interviewer's written feedback goes to a <strong>hire committee</strong> that never met you — your stories only count if they survive being summarized on paper.`,
          `<strong>Meta:</strong> a dedicated behavioral round (often called the "Jedi" round) with its own pass/fail signal covering motivation, conflict resolution, growth from feedback, and delivering impact fast. It is weighted equally with coding and design rounds in the debrief.`,
          `<strong>Everywhere:</strong> behavioral signal drives <strong>leveling</strong>. Two candidates with identical coding performance can come out one level apart based purely on the scope of their stories.`
        ] },
        { type: "h3", text: "Interviewers write signals, not vibes" },
        { type: "p", text: `Interviewers cannot write "seemed nice" in a feedback packet — it gets torn apart in the debrief. They must cite <strong>evidence mapped to rubric dimensions</strong>: "Candidate described identifying a data-loss bug, quantified customer impact (~3,000 orders), drove the fix across two teams without being asked — strong Ownership." Your job is to hand the interviewer sentences like that. If your story has no concrete decision you made, no number, and no outcome, there is literally nothing for them to write, and an empty feedback section reads as a fail.` },
        { type: "p", text: `This is also why <strong>"we" answers fail</strong>. "We migrated the service" gives the interviewer zero evidence about you. The rubric asks what <strong>you</strong> decided, built, argued for, or got wrong — the pronoun you use determines whether the interviewer has anything to score.` },
        { type: "h3", text: "The failure mode: strong coder, no stories" },
        { type: "list", items: [
          `Answers the first question with a rambling 6-minute story chosen on the spot, mostly context, no result.`,
          `Reuses the same one project for every question because nothing else comes to mind under pressure.`,
          `Freezes on "tell me about a failure" and offers a fake failure ("I work too hard") — an instant negative signal.`,
          `Cannot answer follow-up drilling ("what was the actual metric?", "what did your manager say?") because the story was never thought through to that depth.`
        ] },
        { type: "h3", text: "Leveling: the same question, scored differently" },
        { type: "p", text: `"Tell me about a technical decision you drove" is asked at every level — the bar moves. Interviewers explicitly assess whether your stories are at, below, or above your target level, and stories a level too small are one of the most common reasons senior candidates get down-leveled.` },
        { type: "table", headers: ["Level", "What a passing answer looks like"], rows: [
          ["L4 / E4 (mid)", "Owned a feature or component end-to-end; made sound technical choices within a defined scope; escalated appropriately."],
          ["L5 / E5 (senior)", "Owned an ambiguous problem across a team; influenced peers; made trade-offs with measurable business impact."],
          ["L6 / E6 (staff)", "Set direction across multiple teams; resolved org-level conflict; the outcome moved a metric a director cares about."]
        ] },
        { type: "p", text: `Practical takeaway: before the loop, decide your target level and audit every story against it. If you are interviewing for L5 and your best conflict story is "a teammate and I disagreed about a variable name," find a bigger story or reframe the stakes honestly.` }
      ]
    },
    {
      id: "star-framework",
      title: "The STAR Framework (Done Right)",
      summary: `Situation, Task, Action, Result — plus the Learning extension, the 2-3 minute time budget, and the four classic ways candidates ruin a perfectly good story.`,
      blocks: [
        { type: "p", text: `STAR is not a gimmick; it is the shape of the feedback form. Interviewers at Amazon are literally trained to probe for Situation, Task, Action, and Result, and a story delivered in that order writes itself into their notes. The framework: <strong>S</strong>ituation (context), <strong>T</strong>ask (your specific responsibility or goal), <strong>A</strong>ction (what <strong>you</strong> did, step by step), <strong>R</strong>esult (measurable outcome).` },
        { type: "p", text: `Add the <strong>L — Learning</strong> extension (STAR-L): one or two sentences on what you took away and how it changed your behavior since. It is the difference between "a thing happened to me" and "I grow from experience," and it is a scored signal at Amazon (Learn and Be Curious), Meta (growth through feedback), and Microsoft (growth mindset). For failure questions, the L is the answer.` },
        { type: "h3", text: "Time budget" },
        { type: "list", items: [
          `<strong>First pass: 2-3 minutes.</strong> Roughly 20% Situation+Task, 60% Action, 20% Result+Learning. If you talk for five minutes uninterrupted, you have burned a follow-up question the interviewer needed for signal.`,
          `<strong>Depth lives in follow-ups.</strong> A good interviewer will drill: "why that approach?", "what did the other engineer say?", "what was the number?". Keep detail in reserve for these — drilling well is where strong candidates separate.`,
          `Expect <strong>2-3 full stories per 45-minute behavioral round</strong>. Plan accordingly.`
        ] },
        { type: "h3", text: "The four classic failures" },
        { type: "list", items: [
          `<strong>Too much Situation.</strong> Three minutes of company org charts and project backstory before anything happens. Fix: one or two sentences of context — the interviewer will ask if they need more.`,
          `<strong>"We" instead of "I".</strong> "We decided, we built, we shipped" scores as zero personal signal. Fix: say "I" for your actions, credit the team explicitly for theirs — that contrast actually reads as honest.`,
          `<strong>No measurable Result.</strong> "It went well and everyone was happy" is not a result. Fix: latency, revenue, incidents avoided, adoption, time saved — a number, an honest estimate, or at minimum a concrete before/after.`,
          `<strong>Rehearsed-sounding delivery.</strong> A memorized monologue triggers authenticity doubts, especially at Google. Fix: memorize bullet points and numbers, never sentences; practice out loud until you can tell the story three different ways.`
        ] },
        { type: "h3", text: "Worked example: \"Tell me about a time you disagreed with a teammate\"" },
        { type: "code", lang: "text", text: `[S] On my payments team, we needed to rebuild the retry logic for failed
    charge webhooks — the old system double-charged customers about 40
    times a month.

[T] I was the engineer designing the fix. A senior teammate wanted to
    build a custom idempotency layer in our service; I believed we should
    use the payment provider's built-in idempotency keys instead.

[A] Rather than argue in the design review, I asked him to walk me
    through his concerns — he worried the provider's keys expired after
    24 hours, which our longest retry window exceeded. That was a real
    gap I had missed. I prototyped both approaches over two days and
    measured them: my version needed ~200 lines plus a small key-refresh
    job to handle the 24-hour expiry he'd flagged; the custom layer was
    ~2,000 lines with its own storage and failure modes. I presented the
    comparison with his concern addressed head-on, and proposed we adopt
    the provider keys but let him review the refresh job design.

[R] He agreed, and we shipped in one sprint instead of the three his
    design was scoped at. Double-charge incidents went from ~40/month to
    zero over the next quarter, and the on-call runbook for that flow
    shrank to half a page.

[L] I learned that the fastest way through a technical disagreement is
    to take the other person's strongest objection seriously enough to
    build the answer to it. I've since made "prototype both, measure,
    decide" my default for any design dispute that runs past one meeting.` },
        { type: "p", text: `Notice what makes this work: the disagreement is technical and substantive, the candidate <strong>listened and found merit in the objection</strong> (not "I was right all along"), the resolution used data instead of authority, and the result has two numbers. Every follow-up an interviewer might ask — "what if he hadn't agreed?", "what was the teammate's reaction?" — has a real answer because the story is real.` },
        { type: "p", text: `One more rule: <strong>never invent stories.</strong> Interviewers drill three levels deep precisely because fabricated stories collapse under "what did you do next?" A modest true story with real detail beats an impressive fake one every time.` }
      ]
    },
    {
      id: "story-bank",
      title: "Building Your Story Bank",
      summary: `The 8-10 story matrix: map a small set of real, quantified stories to the full space of behavioral themes instead of memorizing thirty answers.`,
      blocks: [
        { type: "p", text: `You cannot predict the exact questions, but you can cover the space. Nearly every behavioral question at any company maps to one of about ten themes. Build <strong>8-10 strong stories</strong>, know which themes each one covers, and in the interview you are retrieving and adapting — not inventing. Build a <strong>matrix, not 30 stories</strong>: one good story legitimately answers questions from three or four themes depending on which thread you pull.` },
        { type: "h3", text: "The theme matrix" },
        { type: "table", headers: ["Theme", "Example questions it covers"], rows: [
          ["Conflict", "Tell me about a conflict with a coworker. / A time you had to work with a difficult person. / A time your team disagreed on direction."],
          ["Failure", "Tell me about your biggest failure. / A time you missed a deadline. / A decision you regret."],
          ["Leadership", "A time you led without formal authority. / A time you took charge when no one asked you to. / A project you drove end-to-end."],
          ["Ambiguity", "A time you worked with unclear requirements. / A time you had to make a decision without enough data. / How you approached a vague problem."],
          ["Tight deadline", "A time you delivered under serious time pressure. / A time you had to cut scope. / A time you sacrificed quality for speed — was it right?"],
          ["Disagreement with manager", "A time you disagreed with your manager. / A time you pushed back on a decision from above. / A time you committed to a decision you disagreed with."],
          ["Mentoring", "A time you helped a struggling teammate. / How you onboarded a junior engineer. / A time you gave difficult feedback."],
          ["Biggest technical achievement", "The project you're most proud of. / The hardest technical problem you've solved. / A time you went above and beyond."],
          ["Receiving hard feedback", "The toughest feedback you've received. / A time you were wrong. / How you've grown in the last year."],
          ["Simplification", "A time you simplified a complex process or system. / A time you removed something instead of adding. / A time you found an easier way."]
        ] },
        { type: "h3", text: "Choosing the right stories" },
        { type: "list", items: [
          `<strong>Recent:</strong> within the last 2-3 years. A story from your first job eight years ago signals you have not done anything notable since — and at senior levels, old stories are usually under-leveled stories.`,
          `<strong>Quantified:</strong> every story needs at least one number — users, dollars, latency, incidents, weeks saved. Dig through old sprint reviews, dashboards, and perf packets to recover the real figures before the interview, not during it.`,
          `<strong>You as protagonist:</strong> the story must turn on a decision or action that was yours. If your honest role was "I was on the team that did X," it is not a bank story.`,
          `<strong>Mix of outcomes, including a genuine failure:</strong> at least one story where you were actually wrong and it actually cost something — a slipped launch, a bad architecture call, a production incident you caused. The fake-failure answer ("my weakness is perfectionism") is an automatic negative signal at Amazon and Meta.`,
          `<strong>Spread across projects and companies</strong> if you can — five stories from one project reads as thin experience.`
        ] },
        { type: "h3", text: "Worked story skeleton" },
        { type: "p", text: `For each story, write a skeleton like this on one index card — bullets and numbers, never prose, so it cannot come out memorized:` },
        { type: "list", items: [
          `<strong>Title:</strong> "Checkout latency migration" — a two-to-four word handle you can retrieve under pressure.`,
          `<strong>S/T (2 lines):</strong> checkout p99 at 4.2s, conversion dropping; I owned the fix with one sprint before peak season.`,
          `<strong>Actions (3-5 bullets):</strong> profiled and found N+1 queries in the cart service; proposed caching layer, manager wanted a full rewrite — pushed back with data; shipped cache behind a flag; wrote the load test that caught a stale-price bug pre-launch.`,
          `<strong>Result (with numbers):</strong> p99 4.2s to 900ms; conversion +1.8%; rewrite deferred and later cancelled, saving ~2 engineer-quarters.`,
          `<strong>Learning (1 line):</strong> incremental fix with measurement beats big-bang rewrite when the clock is real.`,
          `<strong>Themes it covers:</strong> tight deadline, disagreement with manager, simplification, technical achievement. <strong>Amazon LPs:</strong> Bias for Action, Dive Deep, Have Backbone, Frugality.`
        ] },
        { type: "p", text: `Final step: <strong>rehearse retrieval, not recitation</strong>. Have someone fire random questions at you; your job is to name which story you would use within five seconds. Mapping question to story under pressure is the skill — the telling follows from the skeleton.` }
      ]
    },
    {
      id: "amazon-leadership-principles",
      title: "Amazon: All 16 Leadership Principles",
      summary: `Every Amazon interview scores you against specific Leadership Principles — here is the full list, what each one actually tests, and how the loop and bar raiser use them.`,
      blocks: [
        { type: "p", text: `Amazon's behavioral process is the most structured in the industry. Before your loop, the hiring manager assigns each interviewer <strong>2-3 specific Leadership Principles</strong> to probe; each interviewer asks about two LP questions and writes feedback mapped to those LPs. That means across a 5-interview loop, most of the 16 principles get coverage — and you cannot tell from the question which LP is being scored, so you prepare stories that map to LPs, and tag your story bank accordingly.` },
        { type: "table", headers: ["Leadership Principle", "What it really tests", "One example question"], rows: [
          ["Customer Obsession", "Do you start from customer impact rather than technical interest or internal convenience?", "Tell me about a time you made a decision by working backwards from a customer need."],
          ["Ownership", "Do you act beyond your job description and never say \"that's not my job\"?", "Tell me about a time you took on something outside your responsibilities because it needed doing."],
          ["Invent and Simplify", "Do you find simpler or novel solutions instead of accepting complexity?", "Tell me about a time you simplified a complex process or invented a new approach."],
          ["Are Right, A Lot", "Is your judgment good under uncertainty — and do you seek disconfirming views?", "Tell me about a time you made a high-stakes call with incomplete information. Were you right?"],
          ["Learn and Be Curious", "Do you actively grow — new domains, skills, tech — without being told to?", "Tell me about something significant you taught yourself recently and why."],
          ["Hire and Develop the Best", "Do you raise the bar in hiring and grow the people around you?", "Tell me about a time you helped a struggling teammate become successful."],
          ["Insist on the Highest Standards", "Do you refuse to ship substandard work even under pressure?", "Tell me about a time you weren't satisfied with the quality of something and pushed for better."],
          ["Think Big", "Do you propose direction beyond the incremental — and get others to follow?", "Tell me about a time you proposed something bold that others thought wasn't possible."],
          ["Bias for Action", "Do you value calculated speed, knowing most decisions are reversible?", "Tell me about a time you made a decision quickly without waiting for complete data."],
          ["Frugality", "Can you deliver more with less — constraints breed resourcefulness?", "Tell me about a time you accomplished a goal with far fewer resources than you wanted."],
          ["Earn Trust", "Are you candid, self-critical, and respectful — do you admit mistakes openly?", "Tell me about a time you had to rebuild trust after a mistake, or tell a hard truth."],
          ["Dive Deep", "Do you operate at all levels and audit the details — no task beneath you?", "Tell me about a time you dug into the details and found something everyone else had missed."],
          ["Have Backbone; Disagree and Commit", "Do you challenge decisions respectfully, then commit fully once decided?", "Tell me about a time you strongly disagreed with your manager. What did you do after the decision?"],
          ["Deliver Results", "Do you ship despite setbacks — focused on the right inputs, on time, at quality?", "Tell me about a time you delivered a critical result despite major obstacles."],
          ["Strive to be Earth's Best Employer", "Do you make the work environment safer, more inclusive, and more growth-oriented?", "Tell me about a time you improved your team's work environment or someone's experience on the team."],
          ["Success and Scale Bring Broad Responsibility", "Do you consider the broader consequences of what you build — community, second-order effects?", "Tell me about a time you considered the wider impact of a technical decision beyond your team."]
        ] },
        { type: "h3", text: "How the loop actually runs" },
        { type: "list", items: [
          `<strong>LP assignment:</strong> each of your 4-6 interviewers owns 2-3 LPs. Even the coding and design rounds open or close with an LP question. Expect 10-14 LP questions across the loop — you need enough distinct stories to avoid repeating one to two different interviewers, because they compare notes in the debrief.`,
          `<strong>The bar raiser:</strong> a specially trained interviewer from a different org whose mandate is long-term hiring bar, not this team's headcount pressure. Their round is mostly behavioral, their drilling is the deepest, and a bar-raiser veto kills the hire regardless of other feedback.`,
          `<strong>Repeats are noticed:</strong> if you must reuse a story, pull a different thread of it and say so: "I mentioned this project earlier in a different context — here the relevant part is..."`
        ] },
        { type: "h3", text: "Data obsession and follow-up drilling" },
        { type: "p", text: `Amazon interviewers are trained to ask <strong>"how much? how many? what was the metric?"</strong> — vague results get drilled until a number appears or the story visibly runs out of substance. Recover real figures before the loop: percentage improvements, dollar or time savings, ticket volumes, customer counts. An honest "roughly 30%, I'd have to check the exact figure" is fine; "it improved a lot" is not.` },
        { type: "p", text: `Expect the standard follow-up battery on every story: <strong>"What would you do differently?"</strong> (have a real answer — "nothing" is a fail on Earn Trust), <strong>"What was the hardest part?"</strong>, <strong>"How did the other person react?"</strong>, and <strong>"What happened after?"</strong>. Amazon also loves failure questions — often two or three per loop — so bring at least two genuine failure stories, each with a concrete change in how you work since.` },
        { type: "p", text: `Preparation tactic: take your 8-10 bank stories and tag each with the 2-4 LPs it demonstrates best. Verify every LP in the table above has at least one story pointing at it — Customer Obsession, Ownership, Disagree and Commit, and Dive Deep are near-guaranteed to come up, so give those two stories each.` }
      ]
    },
    {
      id: "google-meta-and-beyond",
      title: "Google, Meta & the Rest",
      summary: `Googleyness and the hire committee, Meta's dedicated behavioral round and its four core signals, plus quick notes on Apple, Microsoft, and Netflix.`,
      blocks: [
        { type: "h3", text: "Google: Googleyness & Leadership" },
        { type: "p", text: `Google scores four attributes across the loop: General Cognitive Ability, Role-Related Knowledge, Leadership, and <strong>Googleyness</strong> — the last two carried mainly by a dedicated <strong>G&L behavioral interview</strong>. GCA is assessed separately (largely through how you reason in technical rounds), so do not expect brainteasers in the behavioral round; expect "tell me about a time" and hypothetical judgment questions.` },
        { type: "list", items: [
          `<strong>Googleyness in practice:</strong> comfort with ambiguity, intellectual humility (changing your mind on evidence), bias to collaborate, doing things for the team that were not your job. Questions like "Tell me about a time you had to start on something with almost no direction" and "Tell me about a time you were wrong and how you found out" are core.`,
          `<strong>Leadership without the title:</strong> Google explicitly probes "emergent leadership" — stepping up, then stepping back. Stories where you led as a peer land better than stories about wielding authority.`,
          `<strong>Memorized-feeling answers are penalized.</strong> G&L interviewers are told to probe past polish; a too-smooth answer invites harder drilling and reads as low authenticity. Conversational beats theatrical.`,
          `<strong>The hire committee reads paper, not you.</strong> Your interviewer's written summary is the only thing the committee sees. Give them quotable specifics — names of trade-offs, numbers, decision points — because "candidate told a nice story" cannot be defended in committee.`
        ] },
        { type: "h3", text: "Meta: the dedicated behavioral round" },
        { type: "p", text: `Meta's loop includes a stand-alone behavioral interview scored on its own rubric, and at senior levels it also carries leveling weight. The interviewer is probing four core signals:` },
        { type: "list", items: [
          `<strong>Motivation:</strong> why engineering, why Meta, what kind of problems energize you. Self-driven "I built/fixed it because it bothered me" stories score here.`,
          `<strong>Ability to be direct and handle conflict:</strong> can you disagree openly, address problems with people head-on, and stay effective in an unresolved situation? Avoid stories where your resolution was "I just let it go."`,
          `<strong>Growth through feedback:</strong> the hardest feedback you have received, what you did with it, and evidence you changed. This is a near-guaranteed question — prepare a real one.`,
          `<strong>Moving fast / impact focus:</strong> Meta's cultural core. Stories about shipping pragmatically, cutting scope intelligently, and choosing the highest-impact work over the most interesting work.`
        ] },
        { type: "h3", text: "Apple, Microsoft, Netflix — shorter notes" },
        { type: "list", items: [
          `<strong>Apple:</strong> interviews are team-specific and behavioral questions center on <strong>domain pride and craft</strong> — why this team's product, what excellence means to you, favorite Apple product and how you would improve it. Expect probing on <strong>secrecy and ownership</strong>: working on things you cannot discuss, owning quality obsessively, functional-org collaboration (you will work with many specialist teams).`,
          `<strong>Microsoft:</strong> the loop is framed around Satya Nadella's <strong>growth mindset</strong> culture — "learn-it-all over know-it-all." Failure and feedback questions dominate; the winning shape is honest mistake, concrete learning, changed behavior, later win. Also expect "model, coach, care"-flavored questions if interviewing at senior levels.`,
          `<strong>Netflix:</strong> read the <strong>culture memo</strong> before the loop — interviewers reference it directly. Key probes: <strong>radical candor</strong> (giving and receiving blunt feedback), high talent density ("we're a team, not a family"), freedom and responsibility (making big calls without approval chains), and comfort with the keeper test. Vague or conflict-avoidant answers fail hard here.`
        ] },
        { type: "h3", text: "What each behavioral round optimizes for" },
        { type: "table", headers: ["Company", "Round format", "Optimizes for", "Prepare especially"], rows: [
          ["Amazon", "LP questions in every interview + bar raiser", "Ownership, data-backed results, mechanisms", "2 stories per major LP, numbers for everything"],
          ["Google", "Dedicated G&L, committee reads written feedback", "Ambiguity tolerance, humility, emergent leadership", "Unpolished-but-specific stories; changing your mind"],
          ["Meta", "Dedicated behavioral round, four core signals", "Directness, speed, impact, growth from feedback", "A real hard-feedback story; conflict handled head-on"],
          ["Apple", "Team-driven, woven into technical rounds", "Craft, product passion, discretion", "Why this team; what quality means to you"],
          ["Microsoft", "Behavioral woven through loop", "Growth mindset, collaboration", "Failure-to-learning arcs"],
          ["Netflix", "Culture-memo-driven conversations", "Candor, judgment, autonomy", "Blunt feedback stories, big independent calls"]
        ] },
        { type: "p", text: `The efficient way to prepare all of these: your story bank does not change per company — the <strong>framing</strong> does. The same migration story is an Ownership story at Amazon, an ambiguity story at Google, and a move-fast story at Meta. Before each loop, re-tag your bank against that company's rubric and adjust which thread you lead with.` }
      ]
    },
    {
      id: "senior-signals",
      title: "Senior+ Behavioral: Scope Is the Signal",
      summary: `At L5/L6+ the behavioral bar shifts from "did you execute well" to "did you change outcomes across teams" — scope, influence, and blast radius are what get scored.`,
      blocks: [
        { type: "p", text: `The most common senior-candidate failure is telling excellent mid-level stories. The interviewer is not asking whether you are a good engineer — they are asking whether your <strong>unit of impact</strong> matches the level: L4 owns tasks and features, L5 owns team-sized problems, L6 owns problems that span teams and quarters. Every story you tell either supports your target level or argues for down-leveling you; there is no neutral story.` },
        { type: "h3", text: "What changes at L5/L6+" },
        { type: "list", items: [
          `<strong>Impact across teams, not tasks:</strong> "I shipped the feature" becomes "I identified that three teams were solving the same problem, drove a shared solution, and killed two redundant projects."`,
          `<strong>Influence without authority:</strong> the defining staff signal. You changed the roadmap of a team you do not manage, using evidence, relationships, and persistence — not escalation. Interviewers probe exactly how: who resisted, what you tried first, what finally moved them.`,
          `<strong>Conflict at org level:</strong> pushing back on a director's timeline with data, driving an unpopular migration through sustained resistance, mediating between two teams with incompatible incentives. Peer-to-peer squabbles no longer clear the bar.`,
          `<strong>Growing engineers:</strong> not "I answered their questions" but "I designed their growth: stretch project, sponsorship into visible work, and they were promoted / now lead the area." At L6, "who have you made senior?" is a fair question.`,
          `<strong>Failure with real blast radius:</strong> an outage that hit customers, an architecture bet that cost quarters, a hire that failed. Owning a big failure cleanly — impact, your specific error, the systemic fix you drove — is one of the strongest senior signals there is.`,
          `<strong>Strategic trade-offs:</strong> buy vs build with a real dollar comparison, tech debt vs feature velocity argued to leadership, deliberately choosing the boring technology. The signal is that you reason in business outcomes, not engineering preferences.`
        ] },
        { type: "h3", text: "Senior-specific questions to prepare" },
        { type: "list", items: [
          `Tell me about a time you influenced a decision on a team you had no authority over.`,
          `Tell me about the most significant technical direction you set. How did you get buy-in?`,
          `Tell me about a time you pushed back on your director or VP. What happened?`,
          `Tell me about an unpopular decision you drove to completion. How did you handle the resistance?`,
          `Tell me about a time you chose to take on tech debt deliberately — and a time you refused to.`,
          `Tell me about an engineer you grew. What specifically did you do, and where are they now?`,
          `Tell me about a failure that affected more than your own team. What did you change afterwards?`,
          `Tell me about a buy-versus-build decision you owned. How did you frame the trade-off?`,
          `Tell me about a time two teams you worked with had conflicting priorities. How did you resolve it?`,
          `What is the biggest thing you have deleted, killed, or deliberately not built?`
        ] },
        { type: "h3", text: "Quantify scope in four dimensions" },
        { type: "table", headers: ["Dimension", "Weak framing", "Senior framing"], rows: [
          ["People", "\"I worked with other teams.\"", "\"Coordinated 4 teams, ~25 engineers; I ran the working group and owned the decision log.\""],
          ["Systems", "\"An important service.\"", "\"The auth path for every request — 12M requests/day, 30+ downstream consumers.\""],
          ["Dollars", "\"It saved money.\"", "\"Cut infra spend ~$400K/yr; deferred a rewrite that was scoped at 6 engineer-quarters.\""],
          ["Duration", "\"A long project.\"", "\"An 18-month migration I kept funded across two reorgs and one leadership change.\""]
        ] },
        { type: "p", text: `Two cautions. First, <strong>scope inflation is tested</strong>: claim org-level impact and the interviewer will drill into meeting-level detail ("what was the pushback in that review? who disagreed?"). If you were adjacent to the impact rather than the cause of it, the drilling exposes it — pick the story where you were genuinely the engine. Second, keep the <strong>"I" discipline even at scale</strong>: senior stories involve many people, so be surgical about which decisions, artifacts, and conversations were yours. "My role specifically was X; the team did Y" is exactly the sentence interviewers want to hear.` }
      ]
    },
    {
      id: "questions-to-ask",
      title: "Questions to Ask (and Red Flags to Avoid)",
      summary: `Reverse questions that generate signal by audience, the answers that reliably sink candidates, and the in-room logistics nobody tells you are allowed.`,
      blocks: [
        { type: "p", text: `The last five minutes of every interview are yours, and they are scored more than candidates think — interviewers routinely note "asked thoughtful questions" or "asked nothing" in feedback. "Do you like working here?" wastes the slot: it invites a rehearsed positive answer, produces zero information, and signals you prepared nothing. Good reverse questions do two jobs at once: they extract information you actually need to evaluate the offer, and they demonstrate how you think.` },
        { type: "h3", text: "For a peer engineer" },
        { type: "list", items: [
          `What does the path from merged code to production look like — and how long does it take?`,
          `What was your last major incident, and what changed because of it?`,
          `What's the piece of tech debt everyone complains about, and is there a plan for it?`,
          `How are on-call and operational load actually distributed on the team?`,
          `What did the last engineer to onboard struggle with most?`
        ] },
        { type: "h3", text: "For a manager" },
        { type: "list", items: [
          `What would a great first six months look like for this role — what would I have shipped or changed?`,
          `Who was the last person promoted on the team, and what made the case?`,
          `How do you handle it when a project is clearly slipping — walk me through the last time.`,
          `What's the hardest problem the team faces in the next year that isn't technical?`,
          `How much of the roadmap comes from the team versus handed down?`
        ] },
        { type: "h3", text: "For a director or above" },
        { type: "list", items: [
          `How does this team's work connect to what the company is betting on over the next two years?`,
          `What would cause you to double this team's size — or shrink it?`,
          `What's a recent decision where you overrode consensus, and why?`,
          `Where does this org most need to get better, in your view?`
        ] },
        { type: "h3", text: "Answers that sink candidates" },
        { type: "list", items: [
          `<strong>Badmouthing past employers.</strong> "My last team was a mess and my manager was incompetent" — even if true, the interviewer hears "this person will say the same about us." Frame as neutral fact plus your response: "priorities shifted repeatedly, so I learned to get decisions in writing."`,
          `<strong>"I have no weaknesses"</strong> (or the disguised brag: "I care too much"). Reads as either zero self-awareness or zero honesty — both disqualifying. Give a real weakness plus the concrete mechanism you use to manage it.`,
          `<strong>Taking credit for team work.</strong> Claim an outcome as yours and the drilling starts: "which part did you build? what was your specific proposal?" If credit was shared, say so precisely — accuracy about your slice is itself an Earn Trust signal.`,
          `<strong>Vagueness under drilling.</strong> "What was the metric?" / "I don't remember, but it was significant." Twice in a row and the story is presumed embellished. Better: "I don't recall exactly — my estimate is around 20%, and here's what it was measured against."`,
          `<strong>Answering a question you weren't asked.</strong> Redirecting "tell me about a failure" into a thinly-disguised success ("we almost missed the deadline but I heroically saved it") signals evasiveness. Answer the question asked.`
        ] },
        { type: "h3", text: "In-room logistics" },
        { type: "list", items: [
          `<strong>It is fine to pause.</strong> "That's a good question — give me ten seconds to pick the right example" reads as composed, not slow. Ten silent seconds beats three rambling minutes every time.`,
          `<strong>It is fine to ask what they're looking for.</strong> "Would you rather hear about a technical conflict or an interpersonal one?" or "I have an example about cross-team influence and one about mentoring — which is more useful?" — interviewers appreciate it because it gets them their signal faster.`,
          `<strong>It is fine to course-correct.</strong> "Actually, a better example just came to mind — may I switch?" is fine within the first thirty seconds of an answer.`,
          `<strong>Check length as you go.</strong> After the first pass: "That's the summary — happy to go deeper on any part." It hands control back and shows you respect the interviewer's time budget.`,
          `<strong>Take notes across the loop.</strong> If interviewer three asks the same theme as interviewer one, lead with a different story; they compare notes in the debrief.`
        ] }
      ]
    }
  ]
};
