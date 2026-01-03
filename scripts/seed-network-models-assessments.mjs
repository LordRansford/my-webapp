#!/usr/bin/env node
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const COURSE_VERSION = "2025.01";

function qid(prefix, n) {
  return `${prefix}-q${String(n).padStart(3, "0")}`;
}

function mcq({ id, bloomLevel, domain, tags, question, options, correctIndex, explanation, optionRationales }) {
  const versionedTags = [`domain:${domain}`, `v:${COURSE_VERSION}`, "published", tags].filter(Boolean).join(", ");
  const r = Array.isArray(optionRationales) ? optionRationales : options.map(() => "");
  if (r.length !== options.length) throw new Error(`OPTION_RATIONALES_LENGTH_MISMATCH ${id}`);
  if (r.some((x) => String(x || "").trim().length < 20)) throw new Error(`WEAK_RATIONALES ${id}`);
  return {
    id,
    type: "MCQ",
    bloomLevel,
    difficultyTarget: 0.6,
    discriminationIndex: null,
    question,
    options: JSON.stringify(options),
    correctAnswer: JSON.stringify(correctIndex),
    explanation,
    optionRationales: JSON.stringify(r),
    tags: versionedTags,
  };
}

function ensurePool(items, needed, label) {
  if (items.length < needed) throw new Error(`${label}_POOL_TOO_SMALL ${items.length} < ${needed}`);
  return items.slice(0, needed);
}

async function upsertAssessment({ courseId, levelId }) {
  return prisma.assessment.upsert({
    where: { courseId_levelId: { courseId, levelId } },
    create: { courseId, levelId, passThreshold: 80, timeLimit: 75 },
    update: { passThreshold: 80, timeLimit: 75 },
    select: { id: true },
  });
}

async function upsertQuestions(assessmentId, items) {
  for (const q of items) {
    await prisma.question.upsert({
      where: { id: q.id },
      create: { ...q, assessmentId },
      update: {
        assessmentId,
        type: q.type,
        bloomLevel: q.bloomLevel,
        difficultyTarget: q.difficultyTarget,
        discriminationIndex: q.discriminationIndex,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        optionRationales: q.optionRationales,
        tags: q.tags,
      },
    });
  }
}

function buildFoundations() {
  const out = [];
  let n = 1;

  // models domain
  const modelFacts = [
    {
      q: "What is a protocol in networking",
      options: ["A set of rules for exchanging messages", "A physical cable type", "A brand of router", "A file format for images"],
      correct: 0,
      why: "A protocol defines message formats, timing expectations, and error handling so two systems can interoperate.",
      rs: [
        "Correct. Protocols define how messages are formatted and exchanged.",
        "Wrong. Cables are part of the physical medium, not the rule set.",
        "Wrong. Vendor hardware is not the definition of a protocol.",
        "Wrong. Image formats are data encodings, not network protocols.",
      ],
    },
    {
      q: "What is the main purpose of a layered model like OSI",
      options: ["To separate responsibilities so you can reason and troubleshoot", "To define one fixed vendor implementation", "To replace protocols like IP", "To guarantee performance on all networks"],
      correct: 0,
      why: "Layering is a thinking tool. It separates responsibilities so you can isolate faults and communicate clearly.",
      rs: [
        "Correct. Layering helps you isolate boundaries and reason about behaviour.",
        "Wrong. OSI is conceptual. It is not a single vendor implementation.",
        "Wrong. Models do not replace protocols. They help describe protocol responsibilities.",
        "Wrong. Models do not guarantee performance. They help structure diagnosis.",
      ],
    },
    {
      q: "Peer to peer communication in a layered model means",
      options: ["A layer talks to the same layer on the remote host using a protocol", "Only physical cables are used", "The application skips transport and IP", "Two devices must be the same brand"],
      correct: 0,
      why: "Each layer has a peer concept on the remote system, even though data moves through lower layers to get there.",
      rs: [
        "Correct. Layers have peer protocols that appear to communicate across the network.",
        "Wrong. Peer to peer here is conceptual. It is not only about cabling.",
        "Wrong. Applications still rely on transport and network delivery in practice.",
        "Wrong. Interoperability is the goal. Brands do not need to match.",
      ],
    },
  ];
  for (let i = 0; i < 25; i += 1) {
    const f = modelFacts[i % modelFacts.length];
    out.push(
      mcq({
        id: qid("net-foundations-models", n++),
        bloomLevel: 2,
        domain: "models",
        tags: "network-models,foundations",
        question: f.q,
        options: f.options,
        correctIndex: f.correct,
        explanation: f.why,
        optionRationales: f.rs,
      }),
    );
  }

  // encapsulation domain
  const encFacts = [
    {
      q: "In a typical stack, what carries an IP packet on a local link",
      options: ["A frame", "A segment", "An application message", "A domain name"],
      correct: 0,
      why: "Link layer frames carry network layer packets on a local link such as Ethernet or Wi Fi.",
      rs: [
        "Correct. Frames are the link layer PDU that carry IP packets.",
        "Wrong. Segments are transport layer PDUs such as TCP segments.",
        "Wrong. Application messages are payload before transport encapsulation.",
        "Wrong. Domain names are identifiers, not a data container.",
      ],
    },
    {
      q: "Which term is correct for TCP data plus its header",
      options: ["Segment", "Packet", "Frame", "Symbol"],
      correct: 0,
      why: "A TCP segment is the transport layer unit that includes a TCP header and payload.",
      rs: [
        "Correct. TCP uses segments as its PDU term in most teaching materials.",
        "Wrong. Packet usually refers to IP at the network layer.",
        "Wrong. Frame usually refers to link layer delivery.",
        "Wrong. Symbols are a physical layer signalling concept, not TCP framing.",
      ],
    },
    {
      q: "Encapsulation means",
      options: ["Adding headers and sometimes trailers as data moves down the stack", "Encrypting all traffic by default", "Turning IP into MAC addresses", "Deleting application data"],
      correct: 0,
      why: "Encapsulation wraps data with layer specific headers so each layer can do its job.",
      rs: [
        "Correct. Headers and sometimes trailers are added as you go down the stack.",
        "Wrong. Encryption is one possible function. It is not the definition of encapsulation.",
        "Wrong. Address resolution is separate from encapsulation.",
        "Wrong. Encapsulation does not delete data. It wraps it for transport.",
      ],
    },
  ];
  for (let i = 0; i < 25; i += 1) {
    const f = encFacts[i % encFacts.length];
    out.push(
      mcq({
        id: qid("net-foundations-encapsulation", n++),
        bloomLevel: 2,
        domain: "encapsulation",
        tags: "pdu,encapsulation",
        question: f.q,
        options: f.options,
        correctIndex: f.correct,
        explanation: f.why,
        optionRationales: f.rs,
      }),
    );
  }

  // layers domain
  const layerFacts = [
    {
      q: "In OSI, routing between networks is primarily associated with which layer",
      options: ["Network layer", "Transport layer", "Session layer", "Presentation layer"],
      correct: 0,
      why: "Routing decisions use logical addressing and forwarding across networks, which is the network layer responsibility.",
      rs: [
        "Correct. Layer 3 focuses on routing and logical addressing.",
        "Wrong. Layer 4 handles end to end transport such as TCP and UDP.",
        "Wrong. Session is about managing sessions, not routing.",
        "Wrong. Presentation is about encoding, compression, and some security functions.",
      ],
    },
    {
      q: "In OSI, a MAC address is most closely associated with which layer",
      options: ["Data link layer", "Network layer", "Application layer", "Session layer"],
      correct: 0,
      why: "MAC addresses identify interfaces on a local link and are used for frame delivery in the data link layer.",
      rs: [
        "Correct. Data link uses MAC addresses for local delivery.",
        "Wrong. Network layer uses IP addresses for routing between networks.",
        "Wrong. Application layer uses protocols such as HTTP and DNS.",
        "Wrong. Session layer is not where MAC addressing is defined.",
      ],
    },
    {
      q: "When people map TLS into OSI, it is often placed in the presentation layer because",
      options: ["It transforms and protects application data representation", "It assigns IP addresses", "It decides routing paths", "It replaces TCP sequence numbers"],
      correct: 0,
      why: "Presentation concerns encoding and protection of data. TLS performs encryption and integrity protection for application payloads.",
      rs: [
        "Correct. TLS changes how data is represented on the wire and protects it.",
        "Wrong. IP addressing is a network layer responsibility.",
        "Wrong. Routing is a network layer responsibility.",
        "Wrong. TCP sequence numbers are transport layer mechanisms.",
      ],
    },
  ];
  for (let i = 0; i < 25; i += 1) {
    const f = layerFacts[i % layerFacts.length];
    out.push(
      mcq({
        id: qid("net-foundations-layers", n++),
        bloomLevel: 3,
        domain: "layers",
        tags: "osi,tcpip",
        question: f.q,
        options: f.options,
        correctIndex: f.correct,
        explanation: f.why,
        optionRationales: f.rs,
      }),
    );
  }

  // addressing domain
  const addrFacts = [
    {
      q: "Which identifier is used for routing across networks",
      options: ["IP address", "MAC address", "Port number", "SSID"],
      correct: 0,
      why: "Routers forward packets based on destination IP addresses.",
      rs: [
        "Correct. IP addresses are used for routing between networks.",
        "Wrong. MAC addresses are used for local link delivery of frames.",
        "Wrong. Ports identify services on a host, not a routable destination.",
        "Wrong. SSID is a Wi Fi network name, not a routing identifier.",
      ],
    },
    {
      q: "A port number primarily identifies",
      options: ["A service on a host", "A router on the Internet", "A Wi Fi network name", "A physical cable type"],
      correct: 0,
      why: "Ports help the transport layer deliver data to the correct process or service on the destination host.",
      rs: [
        "Correct. Ports identify which service or process should receive the traffic.",
        "Wrong. Routers are not identified by port numbers.",
        "Wrong. SSID is a Wi Fi network label.",
        "Wrong. Cable types are physical layer concerns.",
      ],
    },
    {
      q: "A domain name is best described as",
      options: ["A human friendly identifier that maps to records via DNS", "A transport header field", "A MAC address alias", "A routing algorithm"],
      correct: 0,
      why: "Domain names map to records such as A and AAAA through DNS queries and responses.",
      rs: [
        "Correct. DNS maps names to records including IP addresses.",
        "Wrong. Transport headers are part of TCP or UDP, not a domain name concept.",
        "Wrong. MAC addresses are link local identifiers and are not what DNS resolves.",
        "Wrong. Routing algorithms do not define domain name mapping.",
      ],
    },
  ];
  for (let i = 0; i < 25; i += 1) {
    const f = addrFacts[i % addrFacts.length];
    out.push(
      mcq({
        id: qid("net-foundations-addressing", n++),
        bloomLevel: 2,
        domain: "addressing",
        tags: "addresses,names",
        question: f.q,
        options: f.options,
        correctIndex: f.correct,
        explanation: f.why,
        optionRationales: f.rs,
      }),
    );
  }

  // dns domain
  const dnsFacts = [
    {
      q: "A recursive resolver is responsible for",
      options: ["Resolving a name by querying other DNS servers and returning an answer", "Encrypting HTTP traffic", "Assigning MAC addresses", "Switching Ethernet frames"],
      correct: 0,
      why: "A recursive resolver performs lookups on behalf of a client, following referrals until it can return an answer.",
      rs: [
        "Correct. Recursive resolvers query root, TLD, and authoritative servers as needed.",
        "Wrong. HTTPS encryption is handled by TLS, not by DNS resolvers.",
        "Wrong. MAC addressing is link layer behaviour and not assigned by DNS.",
        "Wrong. Switching frames is a data link function.",
      ],
    },
    {
      q: "A TTL on a DNS record controls",
      options: ["How long caches can keep the answer before rechecking", "How long a TCP connection stays open", "How large an Ethernet frame can be", "How routers choose the next hop"],
      correct: 0,
      why: "TTL is a cache lifetime. It affects how quickly changes propagate and how much query load exists.",
      rs: [
        "Correct. TTL is a cache duration for DNS answers.",
        "Wrong. TCP connection lifetime is not defined by DNS TTL.",
        "Wrong. Frame size is MTU related, not TTL in DNS.",
        "Wrong. Routing decisions are made using routing tables, not DNS TTL.",
      ],
    },
    {
      q: "NXDOMAIN means",
      options: ["The name does not exist in DNS", "The server refused the TCP connection", "The certificate is expired", "The network cable is unplugged"],
      correct: 0,
      why: "NXDOMAIN is a DNS response code that indicates the queried domain name does not exist.",
      rs: [
        "Correct. It indicates the name does not exist.",
        "Wrong. TCP refusal is a transport level behaviour.",
        "Wrong. Certificate expiry is a TLS issue.",
        "Wrong. Cable issues are physical layer problems.",
      ],
    },
  ];
  for (let i = 0; i < 25; i += 1) {
    const f = dnsFacts[i % dnsFacts.length];
    out.push(
      mcq({
        id: qid("net-foundations-dns", n++),
        bloomLevel: 3,
        domain: "dns",
        tags: "dns,resolution",
        question: f.q,
        options: f.options,
        correctIndex: f.correct,
        explanation: f.why,
        optionRationales: f.rs,
      }),
    );
  }

  // subnetting domain
  const subnetSpecs = [
    { prefix: 24, usable: 254 },
    { prefix: 26, usable: 62 },
    { prefix: 27, usable: 30 },
    { prefix: 30, usable: 2 },
  ];
  for (let i = 0; i < 25; i += 1) {
    const s = subnetSpecs[i % subnetSpecs.length];
    const opts = [s.usable, s.usable + 2, s.usable + 1, Math.max(0, s.usable - 2)];
    out.push(
      mcq({
        id: qid("net-foundations-subnetting", n++),
        bloomLevel: 3,
        domain: "subnetting",
        tags: "cidr,ipv4",
        question: `In IPv4, how many usable host addresses are in a /${s.prefix} subnet`,
        options: opts.map(String),
        correctIndex: 0,
        explanation: `A /${s.prefix} subnet has ${2 ** (32 - s.prefix)} total addresses. For typical host subnets you subtract network and broadcast, so usable hosts is ${s.usable}.`,
        optionRationales: [
          "Correct. This matches the usable host count after excluding network and broadcast.",
          "Wrong. This is the total addresses including network and broadcast for this prefix.",
          "Wrong. This is not the correct total or usable count for this prefix.",
          "Wrong. This undercounts usable hosts and does not match the prefix math.",
        ],
      }),
    );
  }

  return out;
}

function buildApplied() {
  const out = [];
  let n = 1;

  // tcp domain
  const tcpFacts = [
    {
      q: "The TCP three way handshake establishes",
      options: ["A shared connection state so both sides can send reliably", "A DNS cache entry", "A MAC address mapping", "A TLS certificate chain"],
      correct: 0,
      why: "The handshake synchronises sequence numbers and establishes state so reliable delivery can begin.",
      rs: [
        "Correct. The handshake establishes connection state and sequence number context.",
        "Wrong. DNS caching is separate from TCP connection setup.",
        "Wrong. MAC mapping is done via ARP or NDP at the link boundary.",
        "Wrong. Certificates are exchanged during TLS, not TCP handshake.",
      ],
    },
    {
      q: "A TCP acknowledgement number represents",
      options: ["The next byte the receiver expects", "The number of routers in the path", "The DNS record TTL", "The Wi Fi channel number"],
      correct: 0,
      why: "ACK is cumulative. It indicates the next byte expected, which implies all previous bytes were received.",
      rs: [
        "Correct. It acknowledges receipt up to a byte position and signals what is expected next.",
        "Wrong. Router count is a path property, not TCP acknowledgement.",
        "Wrong. TTL is a DNS cache control, not a TCP field.",
        "Wrong. Wi Fi channel is a radio configuration, not TCP.",
      ],
    },
  ];
  for (let i = 0; i < 25; i += 1) {
    const f = tcpFacts[i % tcpFacts.length];
    out.push(
      mcq({
        id: qid("net-applied-tcp", n++),
        bloomLevel: 4,
        domain: "tcp",
        tags: "tcp,reliability",
        question: f.q,
        options: f.options,
        correctIndex: f.correct,
        explanation: f.why,
        optionRationales: f.rs,
      }),
    );
  }

  // udp domain
  const udpFacts = [
    {
      q: "UDP is best described as",
      options: ["Connectionless transport without ordering guarantees", "A routing protocol", "A certificate format", "A link layer framing method"],
      correct: 0,
      why: "UDP provides best effort datagram delivery. Ordering and retransmission are not provided by UDP itself.",
      rs: [
        "Correct. UDP does not establish a connection state and does not guarantee ordering.",
        "Wrong. Routing protocols operate at the network control plane, not transport.",
        "Wrong. Certificates are part of TLS and PKI, not UDP.",
        "Wrong. Frames are link layer delivery units, not UDP.",
      ],
    },
    {
      q: "A realistic reason to choose UDP is",
      options: ["Lower latency requirements where the application can tolerate loss", "You need reliable in order delivery", "You want built in congestion control visibility", "You want DNS names to resolve"],
      correct: 0,
      why: "UDP can be used when timeliness is preferred and the application handles reliability or can tolerate loss.",
      rs: [
        "Correct. Some applications prefer timeliness and handle loss themselves.",
        "Wrong. Reliable ordered delivery is a TCP feature, not a UDP feature.",
        "Wrong. Congestion control is not a user visible UDP property in the same way.",
        "Wrong. DNS resolution is an application layer function that may use UDP but is not the reason to choose UDP generally.",
      ],
    },
  ];
  for (let i = 0; i < 25; i += 1) {
    const f = udpFacts[i % udpFacts.length];
    out.push(
      mcq({
        id: qid("net-applied-udp", n++),
        bloomLevel: 4,
        domain: "udp",
        tags: "udp,tradeoffs",
        question: f.q,
        options: f.options,
        correctIndex: f.correct,
        explanation: f.why,
        optionRationales: f.rs,
      }),
    );
  }

  // dns domain
  const dnsFacts = [
    {
      q: "DNS may use TCP when",
      options: ["The response is too large for UDP or for some operations like zone transfer", "The client needs TLS encryption", "The router needs to decrement TTL", "The Wi Fi password is wrong"],
      correct: 0,
      why: "DNS commonly starts on UDP. Large answers or certain operations can use TCP.",
      rs: [
        "Correct. Truncation or specific operations can cause a TCP based exchange.",
        "Wrong. TLS is separate from DNS. DNS over HTTPS is HTTP over TLS, not DNS over TCP by default.",
        "Wrong. TTL decrement is IP routing behaviour, not DNS.",
        "Wrong. Wi Fi credentials are unrelated to DNS transport choice.",
      ],
    },
    {
      q: "If two users see different IP answers for the same name, a common reason is",
      options: ["They are using different resolvers or caches", "TCP and UDP swapped roles", "Their MAC addresses are identical", "The OSI model changed"],
      correct: 0,
      why: "Different resolvers and different cache states can return different answers, especially with geo routing and TTL windows.",
      rs: [
        "Correct. Resolver choice, geo DNS, and caching can vary across users.",
        "Wrong. TCP and UDP do not swap roles as a cause of different DNS answers.",
        "Wrong. MAC addresses do not drive public DNS answers.",
        "Wrong. Models do not change how DNS answers are computed.",
      ],
    },
  ];
  for (let i = 0; i < 25; i += 1) {
    const f = dnsFacts[i % dnsFacts.length];
    out.push(
      mcq({
        id: qid("net-applied-dns", n++),
        bloomLevel: 4,
        domain: "dns",
        tags: "dns,caching",
        question: f.q,
        options: f.options,
        correctIndex: f.correct,
        explanation: f.why,
        optionRationales: f.rs,
      }),
    );
  }

  // routing domain
  const routingFacts = [
    {
      q: "Routing is best described as",
      options: ["Choosing the next hop for a destination", "Delivering frames by MAC address", "Encrypting application payloads", "Assigning port numbers to services"],
      correct: 0,
      why: "Routing selects the next hop. Forwarding moves the packet based on that decision.",
      rs: [
        "Correct. Routing chooses the next hop for a destination network or host.",
        "Wrong. MAC based delivery is a link layer behaviour within a local network.",
        "Wrong. Encryption is not routing. It is a security function such as TLS.",
        "Wrong. Port assignment relates to transport and application services.",
      ],
    },
    {
      q: "A default route is used when",
      options: ["No more specific route matches the destination", "The DNS answer is NXDOMAIN", "A TCP handshake fails", "The Ethernet cable is disconnected"],
      correct: 0,
      why: "Default routes are catch all paths used when no specific prefix matches the destination.",
      rs: [
        "Correct. It is a fallback route for unknown destinations.",
        "Wrong. NXDOMAIN is a DNS error, not a routing table rule.",
        "Wrong. TCP handshake failure is a transport symptom, not a routing rule.",
        "Wrong. Cable issues are physical layer problems.",
      ],
    },
  ];
  for (let i = 0; i < 25; i += 1) {
    const f = routingFacts[i % routingFacts.length];
    out.push(
      mcq({
        id: qid("net-applied-routing", n++),
        bloomLevel: 4,
        domain: "routing",
        tags: "routing,forwarding",
        question: f.q,
        options: f.options,
        correctIndex: f.correct,
        explanation: f.why,
        optionRationales: f.rs,
      }),
    );
  }

  // nat domain
  const natFacts = [
    {
      q: "A common form of home NAT is",
      options: ["Many private hosts sharing one public IP using different source ports", "Encrypting traffic between browser and server", "Assigning hostnames to IPs", "Routing based on MAC addresses"],
      correct: 0,
      why: "Port address translation maps many internal flows to one public IP by rewriting source ports and keeping state.",
      rs: [
        "Correct. This is the typical PAT behaviour in home routers.",
        "Wrong. Browser to server encryption is TLS, not NAT.",
        "Wrong. Name mapping is DNS, not NAT.",
        "Wrong. MAC addressing is link local, not a NAT function.",
      ],
    },
    {
      q: "A NAT table exists mainly because",
      options: ["The device must remember which internal flow maps to which public port", "TCP needs a certificate", "DNS needs a root server list", "OSI requires seven layers"],
      correct: 0,
      why: "NAT rewriting requires state so return traffic can be mapped back to the correct internal host and port.",
      rs: [
        "Correct. Without state the NAT device cannot demultiplex return traffic.",
        "Wrong. Certificates relate to TLS, not NAT.",
        "Wrong. Root server lists relate to DNS, not NAT.",
        "Wrong. OSI is a model and does not require NAT state.",
      ],
    },
  ];
  for (let i = 0; i < 25; i += 1) {
    const f = natFacts[i % natFacts.length];
    out.push(
      mcq({
        id: qid("net-applied-nat", n++),
        bloomLevel: 4,
        domain: "nat",
        tags: "nat,state",
        question: f.q,
        options: f.options,
        correctIndex: f.correct,
        explanation: f.why,
        optionRationales: f.rs,
      }),
    );
  }

  // tls domain
  const tlsFacts = [
    {
      q: "TLS provides",
      options: ["Confidentiality and integrity for data in transit", "IP routing between networks", "MAC address resolution", "A guarantee that an application is bug free"],
      correct: 0,
      why: "TLS encrypts and authenticates traffic between endpoints. It does not fix application logic flaws.",
      rs: [
        "Correct. TLS protects data in transit with encryption and integrity checks.",
        "Wrong. Routing is a network layer responsibility using IP and routing tables.",
        "Wrong. MAC resolution is link local behaviour such as ARP.",
        "Wrong. TLS does not make applications safe from logic and authorisation bugs.",
      ],
    },
    {
      q: "SNI in TLS is used to",
      options: ["Indicate the intended hostname during the handshake", "Choose a Wi Fi channel", "Set the IP TTL value", "Assign a MAC address to the client"],
      correct: 0,
      why: "Server Name Indication lets the client tell the server which hostname it wants, enabling multiple certificates on one IP.",
      rs: [
        "Correct. SNI carries the hostname so the server can choose the right certificate.",
        "Wrong. Wi Fi channels are radio settings, not TLS fields.",
        "Wrong. TTL is an IP header field, not TLS SNI.",
        "Wrong. MAC addressing is unrelated to TLS SNI.",
      ],
    },
  ];
  for (let i = 0; i < 25; i += 1) {
    const f = tlsFacts[i % tlsFacts.length];
    out.push(
      mcq({
        id: qid("net-applied-tls", n++),
        bloomLevel: 4,
        domain: "tls",
        tags: "tls,https",
        question: f.q,
        options: f.options,
        correctIndex: f.correct,
        explanation: f.why,
        optionRationales: f.rs,
      }),
    );
  }

  return out;
}

function buildPractice() {
  const out = [];
  let n = 1;

  const mk = (domain, items) => {
    for (let i = 0; i < 25; i += 1) {
      const f = items[i % items.length];
      out.push(
        mcq({
          id: qid(`net-practice-${domain}`, n++),
          bloomLevel: 5,
          domain,
          tags: `practice,${domain}`,
          question: f.q,
          options: f.options,
          correctIndex: f.correct,
          explanation: f.why,
          optionRationales: f.rs,
        }),
      );
    }
  };

  mk("security", [
    {
      q: "Which statement is most accurate about TLS and application security",
      options: ["TLS protects data in transit but does not enforce authorisation", "TLS replaces access control checks", "TLS prevents all data leakage by design", "TLS is a firewall feature"],
      correct: 0,
      why: "TLS protects confidentiality and integrity in transit. Authorisation is still an application responsibility.",
      rs: [
        "Correct. TLS is necessary for transport protection but not sufficient for authorisation.",
        "Wrong. Access control still must be enforced by the application and services.",
        "Wrong. Data can still leak through application bugs even with TLS.",
        "Wrong. Firewalls enforce traffic policy. TLS is an encryption protocol.",
      ],
    },
    {
      q: "Segmentation primarily reduces",
      options: ["Blast radius after compromise", "Certificate expiry risk", "DNS TTL values", "Wi Fi channel interference"],
      correct: 0,
      why: "Segmentation limits which systems can communicate, which reduces lateral movement and impact after compromise.",
      rs: [
        "Correct. Limiting connectivity reduces lateral movement paths.",
        "Wrong. Certificate expiry is handled by monitoring and renewal processes.",
        "Wrong. DNS TTL is unrelated to segmentation goals.",
        "Wrong. Wi Fi interference is a physical and radio issue.",
      ],
    },
  ]);

  mk("observability", [
    {
      q: "A good reason to track retransmissions is that",
      options: ["They can indicate loss or instability that makes apps feel slow", "They prove DNS is correct", "They guarantee that TLS is misconfigured", "They only occur on UDP"],
      correct: 0,
      why: "Retransmissions are a transport symptom. They often point to loss, congestion, or path issues.",
      rs: [
        "Correct. Retransmissions correlate with loss and degraded user experience.",
        "Wrong. DNS correctness is separate and must be tested directly.",
        "Wrong. TLS misconfiguration can occur without retransmissions.",
        "Wrong. Retransmissions are a TCP mechanism. UDP does not retransmit at the transport layer.",
      ],
    },
    {
      q: "If a user reports a slow site, the best first step is to",
      options: ["Separate DNS time, connect time, and server response time", "Assume the database is down", "Restart the router immediately", "Change the domain name"],
      correct: 0,
      why: "Separating phases makes the problem measurable and prevents guessing.",
      rs: [
        "Correct. Phase separation isolates where time is spent and guides the next test.",
        "Wrong. Databases can be a cause but you need evidence first.",
        "Wrong. Restarting hardware can hide the problem and does not isolate a boundary.",
        "Wrong. Changing domains does not address the underlying performance cause.",
      ],
    },
  ]);

  mk("captures", [
    {
      q: "Packet capture is best described as",
      options: ["Observation of traffic to confirm protocol behaviour and timing", "An exploitation technique by default", "A replacement for access control", "A method to decrypt TLS without keys"],
      correct: 0,
      why: "Captures are an evidence source. They help you confirm sequence, retries, and failures at boundaries.",
      rs: [
        "Correct. Captures are primarily an observation and debugging method.",
        "Wrong. Capture can be used responsibly for troubleshooting. It is not inherently exploitation.",
        "Wrong. Captures do not enforce policy. They observe what happened.",
        "Wrong. TLS payload decryption requires keys and proper authorisation.",
      ],
    },
    {
      q: "A safe principle for captures in this course is to",
      options: ["Capture only traffic you own or are authorised to inspect", "Capture any nearby Wi Fi traffic", "Publish captures publicly for feedback", "Disable encryption to make inspection easier"],
      correct: 0,
      why: "Authorisation is required. Capturing traffic you do not own can be unethical and illegal.",
      rs: [
        "Correct. Only capture traffic you are authorised to inspect.",
        "Wrong. Capturing nearby traffic without permission is not acceptable.",
        "Wrong. Captures can contain sensitive data and should be treated carefully.",
        "Wrong. Disabling encryption creates risk and is not a safe training approach.",
      ],
    },
  ]);

  mk("segmentation", [
    {
      q: "A common high risk segmentation mistake is",
      options: ["Exposing the management plane to broad networks", "Using a private IP range", "Using DNS caching", "Using TCP instead of UDP"],
      correct: 0,
      why: "Management access paths are high value. Broad exposure increases attack surface and impact.",
      rs: [
        "Correct. Management plane exposure increases attack surface and blast radius.",
        "Wrong. Private ranges are normal and do not imply exposure by themselves.",
        "Wrong. DNS caching is not a segmentation mistake.",
        "Wrong. TCP versus UDP choice is an application and transport trade off, not segmentation.",
      ],
    },
    {
      q: "Segmentation is easiest to verify using",
      options: ["Tests that confirm intended paths work and forbidden paths fail", "A slide deck only", "A promise in a meeting", "A new router logo"],
      correct: 0,
      why: "Verification needs evidence. You must test allowed paths and confirm blocked paths are truly blocked.",
      rs: [
        "Correct. Tests provide evidence of actual enforcement.",
        "Wrong. Slides are not evidence that controls are enforced.",
        "Wrong. Meetings do not verify controls in reality.",
        "Wrong. Branding does not change network policy enforcement.",
      ],
    },
  ]);

  mk("operations", [
    {
      q: "Why does time synchronisation matter for security and operations",
      options: ["Logs and tokens depend on correct time", "It increases Wi Fi range", "It changes DNS TTL values", "It replaces encryption"],
      correct: 0,
      why: "Many systems rely on time for token validity and for correlating logs during investigations.",
      rs: [
        "Correct. Time drift breaks correlation and can break authentication flows.",
        "Wrong. Range is a physical issue. Time sync does not improve it.",
        "Wrong. DNS TTL is a record property, not controlled by local clocks in this sense.",
        "Wrong. Time sync does not replace encryption or access control.",
      ],
    },
    {
      q: "A certificate expiry outage is best prevented by",
      options: ["Monitoring expiry and having a renewal runbook", "Using UDP instead of TCP", "Disabling TLS", "Changing the MAC address"],
      correct: 0,
      why: "Expiry is predictable. Monitoring plus a runbook prevents avoidable outages.",
      rs: [
        "Correct. Monitoring gives early warning and runbooks make response consistent.",
        "Wrong. Transport choice does not prevent certificate expiry.",
        "Wrong. Disabling TLS is unsafe and does not solve operational discipline issues.",
        "Wrong. MAC addresses do not affect certificate expiry.",
      ],
    },
  ]);

  mk("troubleshooting", [
    {
      q: "A repeatable troubleshooting approach starts by",
      options: ["Stating the symptom and testing one boundary at a time", "Changing multiple settings at once", "Assuming rare causes first", "Skipping evidence and going straight to a fix"],
      correct: 0,
      why: "One boundary at a time prevents confusion and produces evidence that supports a correct conclusion.",
      rs: [
        "Correct. Isolate boundaries and use evidence to update hypotheses.",
        "Wrong. Changing many variables hides causality.",
        "Wrong. Rare causes should come after common causes are disproved.",
        "Wrong. Skipping evidence leads to accidental fixes and repeat incidents.",
      ],
    },
    {
      q: "If DNS lookup is fast but connect is slow, a reasonable next hypothesis is",
      options: ["Path or transport issues before the server responds", "The domain name is wrong", "The MAC address is invalid on the Internet", "The OSI model is incorrect"],
      correct: 0,
      why: "DNS is resolved. The next measurable step is connection establishment and transport behaviour.",
      rs: [
        "Correct. Connection phase points to routing, loss, middleboxes, or server accept backlog.",
        "Wrong. The domain name is already resolved and is less likely the issue in this case.",
        "Wrong. MAC addresses are local link identifiers and are not used across the Internet.",
        "Wrong. The model is a tool. The issue is in the system behaviour, not the model.",
      ],
    },
  ]);

  return out;
}

async function main() {
  const courseId = "network-models";

  const a1 = await upsertAssessment({ courseId, levelId: "foundations" });
  const f = buildFoundations();
  await upsertQuestions(a1.id, ensurePool(f, 150, "FOUNDATIONS"));

  const a2 = await upsertAssessment({ courseId, levelId: "applied" });
  const ap = buildApplied();
  await upsertQuestions(a2.id, ensurePool(ap, 150, "APPLIED"));

  const a3 = await upsertAssessment({ courseId, levelId: "practice" });
  const pr = buildPractice();
  await upsertQuestions(a3.id, ensurePool(pr, 150, "PRACTICE"));

  console.log("Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

