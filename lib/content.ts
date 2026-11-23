// All site copy lives here. Add a project by appending to `projects`;
// its images go in public/images/<slug>/.

export const profile = {
  name: 'Charlie Minney',
  role: 'Mechanical Engineer',
  location: 'Boston, MA',
  intro:
    "I'm an engineer who enjoys using my passions for engineering, design, and programming to construct technology that makes an impact.",
  email: 'minney.c@northeastern.edu',
  linkedin: 'https://www.linkedin.com/in/charlie-minney/',
  resume:
    'https://docs.google.com/document/d/1nEl97eYApu8INsRKnTFTHA6Q70rn9h5LJVLJ6ilZfRk/edit?usp=sharing',
  portrait: '/images/about/portrait.jpg',
  about: [
    'I am an undergraduate Mechanical Engineer at Northeastern University pursuing a masters in Mechatronics.',
    "I've always loved creating, whether it's a first-person-view drone or mechanically transforming shoes. I hope to create technology that makes a difference while centering the philosophy, I've come to love, of human centered design. I've pursued this passion primarily in school, work, and clubs through electronics, various CAD softwares, and lots of 3D printing.",
    'In addition to my academic pursuits, I enjoy spending time with my dog, drawing, connecting with nature through hiking and traveling, and finding peace through exercise like rowing.',
  ],
}

export type Image = { src: string; alt: string; caption?: string }
export type Pair = { title: string; text: string }

export type Project = {
  slug: string
  title: string
  summary: string
  tags: string[]
  facts: { label: string; value: string }[]
  cover: Image
  overview?: string
  challenges?: Pair[]
  solutions?: Pair[]
  gallery: Image[]
  link?: { label: string; href: string }
}

const img = (slug: string, file: string, alt: string, caption?: string): Image => ({
  src: `/images/${slug}/${file}`,
  alt,
  caption,
})

export const projects: Project[] = [
  {
    slug: 'rh-chamber',
    title: 'RH Chamber',
    summary:
      'A temperature and humidity controlled chamber which allows the user to precisely adjust temperature and humidity using PID parameters.',
    tags: ['Raspberry Pi', 'Python', 'PID control', 'SolidWorks'],
    facts: [
      { label: 'Context', value: 'E Ink co-op, 2024' },
      { label: 'Build time', value: '~4 months' },
      { label: 'Frame', value: '80/20 aluminum, ABS panels' },
      { label: 'Control', value: 'Python + PyQt5 GUI, PID loop' },
    ],
    cover: img('rh-chamber', '01.jpg', 'The finished RH chamber on a lab bench'),
    overview:
      'This project was for my 6 month coop at E Ink. It was built, from the ground up over the course of around 4 months, with an 80/20 aluminum frame and custom-sized extruded ABS plastic panels, this RH chamber box provides precise temperature and humidity control. Powered by a Raspberry Pi, it uses dry air, moist air, and heat inputs to regulate the environment. The control system, written in Python, features a custom GUI and employs a PID loop for accurate adjustments.',
    challenges: [
      { title: 'GUI Issues', text: 'The GUI was difficult to change and overly crowded.' },
      {
        title: 'Manufacturing Timeline',
        text: 'The process of actually building my design was taking longer than I anticipated.',
      },
      {
        title: 'Panel Overheating',
        text: 'A 150W IR heat source directly next to an ABS panel could easily soften or melt that panel.',
      },
    ],
    solutions: [
      {
        title: 'Utilized PyQt5',
        text: 'I was originally using the popular package of TKinter for the GUI layout, but saw that it had certain limitations including that all the element positions had to be hard coded. I then reached out to a programmer in my department for advice. He recommended that I use a Python package called PyQt5 which allows for much easier GUI design. I quickly learned how to use this Python package which allowed for much easier iterations since nothing was hard coded. I could quickly adjust and improve the layout based on feedback from coworkers.',
      },
      {
        title: 'Outsourcing',
        text: 'After noticing that I was behind my self-improved schedule for the physical construction of this project, I recruited help from another coworker who has a lot of experience building machinery. His expertise along with the second set of hands made the process go much faster.',
      },
      {
        title: 'Polycarbonate',
        text: 'After researching the material properties of ABS and discovering that it can soften and distort at under 200°F, I realized that the 150W heat source we were planning on using might cause issues. I then brainstormed solutions, as well as efficiently and extensively researched other materials which could protect the ABS panels. I settled on polycarbonate because of its good balance between heat resistance and cost. The polycarbonate panels could attach between the heat source and surrounding plastic panels which served to protect and insulate the ABS.',
      },
    ],
    gallery: [
      img('rh-chamber', '02.jpg', 'Hand sketch of the chamber box', 'My initial design for the box.'),
      img(
        'rh-chamber',
        '03.jpg',
        'Annotated photo of the chamber internals',
        'The internals and technology utilized to regulate the chamber.'
      ),
      img(
        'rh-chamber',
        '04.jpg',
        'Touchscreen GUI showing temperature and humidity readings',
        'Custom user interface written in Python running on a Raspberry Pi.'
      ),
    ],
  },
  {
    slug: 'rocket-test-stand',
    title: 'Rocket Engine Test Stand',
    summary:
      'Designed and sourced a rocket engine test stand for NUAero club that can withstand hotfires from a 500lbf engine. Performed analysis on all critical components to ensure sufficient safety factors.',
    tags: ['SolidWorks FEA', 'Structural analysis', 'Steel weldments'],
    facts: [
      { label: 'Rated thrust', value: '500 lbf' },
      { label: 'Build cost', value: '$1,068.25' },
      { label: 'Mode change', value: 'Under 30 seconds' },
      { label: 'Material', value: 'ASTM A500 steel tubing' },
    ],
    cover: img('rocket-test-stand', '01.jpg', 'CAD render of the rocket engine test stand'),
    overview:
      'This portable rocket engine test stand was a class project, designed for student aerospace teams as a cost-effective and mobile alternative to commercial, stationary systems. Built from ASTM A500 steel tubing, the stand comfortably supports 500 lbf of thrust, while remaining transportable via a power screw and caster wheel system. The frame transitions between testing and transport modes in under 30 seconds, enabling both stability and mobility.',
    challenges: [
      {
        title: 'High Thrust Loads',
        text: 'Needed to safely withstand 500 lbf of thrust without permanent deformation.',
      },
      {
        title: 'Mobility vs. Stability',
        text: 'Required both concrete-anchored rigidity during tests and portability for transport at ~3 mph.',
      },
      {
        title: 'Cost Constraints',
        text: 'The stand needed to remain around $1,000 to be viable for student teams compared to $10,000+ commercial solutions.',
      },
    ],
    solutions: [
      {
        title: 'Factor of Safety Calculations',
        text: 'Rigorously and meticulously performed hand calculations on each member, fastener, and weld to ascertain the factor of safety for that particular component under maximum load. These results were then verified using SolidWorks FEA.',
      },
      {
        title: 'Hybrid Frame System',
        text: 'Designed a dual-mode structure with retractable caster wheels using a 2" ACME lead screw for transport and anchored feet for testing.',
      },
      {
        title: 'Cost-Effective Material Selection',
        text: 'Optimized sourcing and material choices, ending with a total build cost of $1,068.25.',
      },
    ],
    gallery: [
      img('rocket-test-stand', '02.jpg', 'Side view, bolted down', 'Side view showing the bolted-down configuration.'),
      img('rocket-test-stand', '03.jpg', 'Side view, on casters', 'Side view showing the transportable configuration.'),
      img(
        'rocket-test-stand',
        '04.jpg',
        'FEA stress plot of the full weldment',
        'FEA in SolidWorks on the weldment structure as a whole.'
      ),
      img('rocket-test-stand', '05.jpg', 'FEA stress plot of a single beam', 'FEA in SolidWorks on an individual beam.'),
      img('rocket-test-stand', '06.jpg', '3D printed scale model of the stand', 'A scaled-down, 3D printed proof of concept.'),
    ],
    link: {
      label: 'Read the full report',
      href: 'https://drive.google.com/file/d/13wPNgSh4AqYUZecqCTlOf75lYhtTi2Li/view?usp=sharing',
    },
  },
  {
    slug: 'haptic-shirt',
    title: 'Haptic Feedback Shirt',
    summary:
      'The shirt uses vibrating coin motors and ultrasonic distance sensors to assist visually impaired individuals in foreign indoor settings.',
    tags: ['Arduino', 'Ultrasonic sensing', 'Wearables'],
    facts: [
      { label: 'Context', value: 'High school senior thesis' },
      { label: 'Controller', value: 'Arduino Uno' },
      { label: 'Sensors', value: '4 ultrasonic, 40 kHz' },
      { label: 'Feedback', value: '4 vibrating coin motors' },
    ],
    cover: img('haptic-shirt', '01.jpg', 'Prototype haptic feedback shirt with sensors and wiring'),
    overview:
      'This project was my high school "senior thesis" which was created out of a belief that technology is underserving people with disabilities. With this project I hoped to help visually impaired individuals navigate the world. Two prototypes were designed with four ultrasonic distance sensors strategically placed on the front, back, and each shoulder, which relay information to an onboard Arduino Uno. Below these sensors, four vibrational coin motors are positioned to provide haptic feedback, vibrating with varying intensity depending on the wearer\'s proximity to walls. To enhance the design, double-layered shirts are used, effectively concealing most wires and connections for a seamless and unobtrusive appearance.',
    challenges: [
      {
        title: 'Visual Appeal',
        text: "With so many wires connecting components all across the shirt, it's difficult to create in a visually appealing, inconspicuous way.",
      },
      {
        title: 'Preventing Ultrasonic Interference',
        text: "When first writing the code for the ultrasonic sensors, I experienced a lot of interference because they were all sending signals at the same time, and would receive each others' signals.",
      },
    ],
    solutions: [
      {
        title: 'Multi Layer Design',
        text: "I thought about who my user would be. It's likely to be a visually impaired individual, and my vision for this project was to give such an individual an easy and inconspicuous way to augment and improve their daily life. Having a shirt with lots of wires running up and down would generate a lot of unwanted attention and doesn't align with what I wanted for this project. Due to this, I chose to layer another shirt on top of the original one to hide all of the wires. I also sourced subtle ultrasonic sensors that could blend in with the outer shirt since they have to be on display in order to function.",
      },
      {
        title: 'Segmented Signal Transmission',
        text: 'I spent a significant amount of time problem solving and testing to figure out what was going wrong. After ascertaining that the ultrasonic sensors were interfering with each other I came up with a change to the code that would fix it. I made it so that each ultrasonic sensor would send and receive its 40 KHz sound wave before the next one fired.',
      },
    ],
    gallery: [],
    link: {
      label: 'Read the full write-up',
      href: 'https://docs.google.com/document/d/1LIQK3DQZBaNCAvTXOXM1Pt1OfCruoDxaAgdrvlHryNU/edit?usp=sharing',
    },
  },
  {
    slug: 'combat-robot',
    title: 'Combat Robot',
    summary:
      "An antweight combat robot with a powerful horizontal spinner and four-wheel drive. The design ended up winning our university's antweight division title!",
    tags: ['SolidWorks', 'DFMA', '3D printing', 'Team of 3'],
    facts: [
      { label: 'Result', value: 'University antweight champion' },
      { label: 'Weight class', value: 'Antweight, under 1 lb' },
      { label: 'Weapon', value: 'Brushless horizontal spinner' },
      { label: 'Drive', value: '4WD, belt and pulley' },
    ],
    cover: img('combat-robot', '01.jpg', 'Pink 3D printed antweight combat robot'),
    overview:
      'This antweight (a weight division where our combat robot had to be primarily made of plastic and weighing under one pound) combat robot features a horizontal spinner powered by a brushless motor for high-impact strikes. Its dual motor, four-wheel drive is enabled by a custom-designed pulley system and polyurethane belts, ensuring optimal maneuverability.',
    challenges: [
      {
        title: 'Team Management',
        text: 'With our team of three engineers all having busy schedules, it was difficult to coordinate and remain on the same page.',
      },
      {
        title: 'Un-optimized Design',
        text: "Our first couple rounds of CAD design looked good in SolidWorks, but weren't fully optimized to be 3D printed (our preferred method of manufacturing).",
      },
      {
        title: 'Wheel Slippage',
        text: 'The first designs of four wheel drive would begin to slip when throttled up.',
      },
    ],
    solutions: [
      {
        title: 'Shared Task List',
        text: "After noticing that work wasn't getting done due to team members not knowing what to work on, we brainstormed some solutions. We chose to implement a system of shared checkbox task lists, so that everyone could know what they were assigned and remain on the same page.",
      },
      {
        title: 'DFMA',
        text: "I had learned some tips from coop and independent research of ways we could optimize our design. We altered the designs using these tips including a chamfer on the first layer to reduce elephant's foot, adding slopes to print diagonally for strength and to save space, and reducing weight/material wherever possible with increased walls and decreased infill as most of the strength of 3D printed parts comes from the number of walls.",
      },
      {
        title: 'Improved Pulley Design',
        text: 'After noticing the slip, a teammate and I went to our local makerspace to prototype designs. We looked at inspiration and altered the pulley system design to allow the polyurethane belt to have more surface area touching each pulley, allowing for better traction.',
      },
    ],
    gallery: [
      img(
        'combat-robot',
        '02.jpg',
        'Open frame of the first prototype showing motors and wiring',
        "A view of the first prototype's internals and custom PLA+ 3D printed frame."
      ),
      img('combat-robot', '03.jpg', 'Fully assembled second prototype', 'External of the fully assembled second prototype.'),
    ],
  },
  {
    slug: 'transforming-shoes',
    title: 'All Weather Transforming Shoes',
    summary:
      'Prototype shoes that would allow the wearer to transition from summer settings to winter settings which include bolt action ice gripping claws and an automatically shifting sole texture.',
    tags: ['Mechanism design', 'Arduino', '3D printing'],
    facts: [
      { label: 'Mechanism', value: 'Bolt action ice claws' },
      { label: 'Sole', value: 'Arduino powered texture shifter' },
      { label: 'Process', value: 'Many printed iterations' },
    ],
    cover: img('transforming-shoes', '01.jpg', 'Boot standing on the transforming sole prototype'),
    gallery: [
      img('transforming-shoes', '02.jpg', 'SolidWorks assembly of the sole', 'Some of our initial CAD designs.'),
      img(
        'transforming-shoes',
        '03.jpg',
        '3D printed claw mechanism prototype',
        'An initial 3D printed prototype for the claw mechanism. We had to go through multitudes of prototypes and iterations to settle on a design that we were happy with.'
      ),
      img(
        'transforming-shoes',
        '04.jpg',
        'Assembled sole prototype with electronics',
        'The assembled prototype for the shoe sole, featuring bolt action extendable ice claws and an Arduino powered sole texture shifter.'
      ),
    ],
  },
  {
    slug: '3d-printing',
    title: 'Smaller 3D Printing and Design Projects',
    summary: "This project goes over any smaller 3D printing pursuits that I'm proud of.",
    tags: ['SolidWorks', 'Rendering', '3D printing'],
    facts: [
      { label: 'Earring rack', value: 'Designed, rendered, printed' },
      { label: 'Mouse shell', value: 'Fits HyperX Pulsefire Haste PCB' },
    ],
    cover: img('3d-printing', '01.jpg', 'Render of a pink earring rack'),
    overview:
      'I designed, rendered, and 3D printed a small closet rack for earrings. I also designed a super light mouse shell that attaches to an existing mouse PCB (HyperX Pulsefire Haste), complete with contoured finger rests and a reusable snap in place design.',
    gallery: [
      img('3d-printing', '02.jpg', 'Render of the earring rack in black', 'A SolidWorks render that shows what it would look like in a different color palette.'),
      img('3d-printing', '03.jpg', 'Printed earring rack in use', 'The final, assembled product in use.'),
      img('3d-printing', '04.jpg', 'Mouse shell iterations side by side', 'The many design iterations of the mouse shell, side by side.'),
      img('3d-printing', '05.jpg', 'SolidWorks model of the mouse shell', 'The SolidWorks 3D model.'),
      img('3d-printing', '06.jpg', 'Assembled lightweight mouse', 'The final, assembled mouse.'),
    ],
  },
]

export type Job = {
  role: string
  company: string
  years: string
  location: string
  about: string
  points: string[]
}

export const experience: Job[] = [
  {
    role: 'Mechanical Co-op',
    company: 'Notch Technologies',
    years: '2025 & 2026',
    location: 'Cambridge, MA',
    about:
      'Notch Technologies develops novel, high-performance antenna technologies. I served as a mechanical engineer for two six month cycles, rapidly designing, manufacturing, and refining antenna housings, mounts, test fixtures, and proprietary materials.',
    points: [
      'I designed multi-part, fully parametric antenna and PCB enclosures to protect and obfuscate core IP.',
      'I applied a wide range of manufacturing processes, including 3D printing, casting, thermoforming, laser cutting, waterjet cutting, and screen printing.',
      'I led R&D on proprietary materials, developing new materials and fabrication processes through rigorous research, experimentation, and iteration, with a focus on scalability, repeatability, and cost.',
    ],
  },
  {
    role: 'Mechanical Testing Engineer',
    company: 'E Ink',
    years: '2024',
    location: 'Billerica, MA',
    about:
      'E Ink Corporation specializes in the development and commercialization of electronic paper display technology.',
    points: [
      'I worked as a mechanical testing engineer at E Ink for six months. My primary responsibility was managing throughput and testing for hundreds of glass electronic ink samples daily that needed to be put in custom built spectrometer machines and have varying testing routines run on them.',
      'I also helped create solutions to any problems or aspects around the lab that I felt could be improved. This included designing and 3D printing a latch for one of the testing machine enclosures, designing a mount for a Surface Pro that would allow it to sit on some central racks to let us keep track of incoming samples more easily, and working on building a network of ESP32 loggers to keep track of the many environmental chambers that we used daily.',
      'Finally, I was in charge of my own project which was designing and building a constant humidity and temperature chamber from the ground up. I created a design and assembly in SolidWorks, and then used my assembly to source materials from McMaster-Carr and Interstate Plastics. This chamber utilized a Raspberry Pi and a program I wrote in Python to manage moist air, dry air, and temperature inputs. It was able to replicate the results of models ten times more expensive, and featured a custom GUI that would allow the user to change the temperature and humidity of the chamber using the integrated touchscreen.',
    ],
  },
  {
    role: 'Summer Intern',
    company: 'Twenty5 LLC',
    years: '2022 – 2023',
    location: 'Austin, TX',
    about:
      "Twenty5 provides intelligent project pricing and estimating tools for companies using SAP, Salesforce, or MS-Dynamics CRM, making project planning and budgeting faster and more accurate.",
    points: [
      'When interning at Twenty5, I was ready to help with whatever was needed, and this led to me learning a lot of new skills. For my first summer, I met weekly with a Procter & Gamble consultant to integrate their old legacy data into SAP-compatible data to be used in Twenty5\'s software. I noticed that a lot of what we were doing manually each week could be automated using Python (specifically the Pandas library), and created a program that could do around 60% of the work that took us months to complete in a matter of minutes. I handed this program off to my superiors at the end of my internship.',
      'When I went back the next summer, they needed professional looking reports for their demos when trying to win new customers and contracts, so I dedicated that summer to learning the data visualization tool Power BI, and integrating their databases in a way that would allow real data from past customers to be visualized in meaningful ways.',
    ],
  },
  {
    role: 'Software Engineer Intern',
    company: 'Delaware Consulting',
    years: '2021',
    location: 'Dallas, TX',
    about:
      'Delaware North America offers digital transformation and business consulting services, helping companies improve their operations using SAP, Microsoft, and Salesforce solutions.',
    points: [
      "In the summer of 2021, I got the opportunity to work at Delaware North America as a software engineering intern. I was hired to develop a front end warehouse management application to SAP's extended warehouse MGT module for the world's largest Caterpillar distributor, Finning. I came in with knowledge of programming, but never having developed an Android application before.",
      "I quickly taught myself the basics of Android Studio, learning both Java, and the software itself. Then, since I hadn't done much previous work in similar application layouts, I created several mockups inspired by existing applications that I had researched. Wanting to get a second opinion, I reached out virtually for feedback from coworkers. I also met weekly with a Delaware SAP consultant who offered valuable information about how the app should flow and how it would be used in the warehouse it was being designed for.",
      'After three months of development and design, I had a working front end prototype for the warehouse management application. I presented my design to the president of the company among others and it was later used to win a $500K contract for development of the full application.',
    ],
  },
  {
    role: 'Meat Preparation',
    company: 'Little Harbor Lobster',
    years: '2019',
    location: 'Marblehead, MA',
    about:
      'Little Harbor Lobster Company offers a variety of food and drinks, including their renowned lobster rolls, while supporting local fishermen.',
    points: [
      'Hoping to make a little extra pocket money one summer in middle school, I eagerly accepted a position at my local lobster roll spot. I would wake up at 5 am and bike to the restaurant in order to begin preparing lobsters with a coworker. We were tasked with killing, steaming, and then shucking around 40 lbs of lobster per day, and while I was uncomfortable with some parts at first, I adapted to my responsibilities. I learned quickly from our manager and became increasingly efficient throughout the summer, even taking on additional responsibilities like sorting the lobsters as they came in.',
    ],
  },
]

export const skills = [
  {
    name: 'SolidWorks / Onshape / Fusion',
    text: 'Creating professional 3D models for applications from engineering prototypes to full assemblies.',
  },
  {
    name: 'Python',
    text: 'Using programming for a wide variety of applications ranging from projects to games to professional applications.',
  },
  {
    name: 'Arduino',
    text: 'Utilizing microcontrollers (Arduino Uno, ESP32) as the driving processor for small projects.',
  },
  {
    name: 'Power BI & Excel',
    text: 'Displaying data in unique arrangements to draw previously unknown conclusions.',
  },
  {
    name: 'Spanish',
    text: 'Understanding of different cultures through knowing intermediate level Spanish which serves to diversify ideas.',
  },
]

export const artwork = {
  intro: "Some of the digital and non digital art I've done over the years.",
  pieces: [
    { src: '/images/artwork/01.jpg', alt: 'Portrait drawing of a dog' },
    { src: '/images/artwork/02.jpg', alt: 'Pencil drawing of an elephant holding an umbrella' },
    { src: '/images/artwork/03.jpg', alt: 'Charcoal still life of a skate, bottle and soccer ball' },
    { src: '/images/artwork/04.jpg', alt: 'Two painted portraits of a chocolate labrador' },
    { src: '/images/artwork/05.jpg', alt: 'Digital painting of a mushroom on a bench' },
    { src: '/images/artwork/06.jpg', alt: 'Drawing of a bird on a branch with berries' },
    { src: '/images/artwork/07.jpg', alt: 'Painting of a sea turtle under sunbeams' },
    { src: '/images/artwork/08.jpg', alt: 'Watercolour of a tree reflected in water' },
    { src: '/images/artwork/09.jpg', alt: 'Painting of a narwhal in deep blue water' },
  ] as Image[],
}
