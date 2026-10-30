// Terms of Service, English and Georgian. Both versions must keep the same sections in the same order.
// LEGAL REVIEW REQUIRED before relying on this text: see docs/legal/README.md for the open points.
// The "Content you share" section implements CLAUDE.md legal rules 3 and 4 ahead of uploads being built.
import type { Lang, LegalDoc } from "./meta";

export const terms: Record<Lang, LegalDoc> = {
  en: {
    title: "Terms of Service",
    intro:
      "These terms cover your use of the LYST website and host accounts. By using the website or creating an account, you agree to them.",
    sections: [
      {
        heading: "Who we are",
        body: ["LYST is a digital invitations and event-experience studio in Tbilisi, Georgia."],
      },
      {
        heading: "What we offer",
        body: [
          {
            list: [
              "Information about our services.",
              "Consultation requests. A request is not a confirmed booking: we confirm the time with you by email.",
              "Host accounts. Creating events and managing guests will be added later.",
            ],
          },
          "Work for a specific event (design, invitations and anything else) is agreed with you separately, in writing.",
        ],
      },
      {
        heading: "Host accounts",
        body: [
          {
            list: [
              "You must be 16 or older to create an account.",
              "Give accurate information and keep your password secret.",
              "You are responsible for what happens through your account.",
              "You can close your account at any time. We may suspend an account that is used in breach of these terms.",
            ],
          },
        ],
      },
      {
        heading: "Acceptable use",
        body: [
          "When using the website, you must not:",
          {
            list: [
              "share anything illegal, abusive, or that breaks someone else's rights;",
              "pretend to be someone else;",
              "try to break the website's security or disrupt how it works;",
              "use automated tools to access the website in bulk or to collect data from it;",
              "share other people's personal information without their permission.",
            ],
          },
        ],
      },
      {
        heading: "Content you share",
        body: [
          "When LYST lets you upload photos, voice messages or text:",
          {
            list: [
              "The content stays yours.",
              "You give LYST a limited permission to store, process and show it only to the host and guests of that event, so we can provide the service. This permission ends when the content is deleted (backup copies are overwritten within 90 days).",
              "You confirm that you have the right to share it and the consent of the people in it; for children, the consent of a parent or guardian.",
              "Every upload will have a button to report it. A host can remove any upload on their event, and we can remove anything that breaks these terms.",
              "We will not use your content in LYST marketing or our portfolio without your written consent; for anything showing a child, without the written consent of a parent or guardian.",
            ],
          },
        ],
      },
      {
        heading: "Our content",
        body: [
          "The website's design, text and photographs belong to LYST or the people who licensed them to us. Do not copy or reuse them without permission.",
        ],
      },
      {
        heading: "Prices",
        body: [
          "Requesting a consultation does not commit you to buying anything. Prices for our services are agreed with you in writing before any work starts.",
        ],
      },
      {
        heading: "Availability",
        body: [
          "We work to keep the website available, but we may pause or change it, and we cannot promise it will always work without interruption.",
        ],
      },
      {
        heading: "Liability",
        body: [
          "The website is provided as it is. As far as the law allows, we are not responsible for indirect losses such as lost income. Nothing in these terms limits rights that the law does not allow to be limited, including your rights as a consumer.",
        ],
      },
      {
        heading: "Changes to these terms",
        body: [
          "When we change these terms, we update the version and date at the top of this page and tell account holders about important changes by email. Using the website after a change means you accept the updated terms.",
        ],
      },
      {
        heading: "Law and disputes",
        body: [
          "These terms are governed by the laws of Georgia. Disputes are settled by the courts of Tbilisi, unless the law of your country gives you, as a consumer, the right to go to court there.",
        ],
      },
    ],
  },
  ka: {
    title: "მომსახურების პირობები",
    intro:
      "ეს პირობები არეგულირებს LYST-ის ვებსაიტისა და მასპინძლის ანგარიშების გამოყენებას. ვებსაიტით სარგებლობით ან ანგარიშის შექმნით თქვენ ეთანხმებით ამ პირობებს.",
    sections: [
      {
        heading: "ვინ ვართ ჩვენ",
        body: ["LYST არის ციფრული მოსაწვევებისა და ღონისძიებების გამოცდილების სტუდია თბილისში, საქართველოში."],
      },
      {
        heading: "რას გთავაზობთ",
        body: [
          {
            list: [
              "ინფორმაციას ჩვენი მომსახურების შესახებ.",
              "კონსულტაციის მოთხოვნას. მოთხოვნა არ არის დადასტურებული ჯავშანი: დროს ელფოსტით შეგითანხმებთ.",
              "მასპინძლის ანგარიშს. ღონისძიებების შექმნისა და სტუმრების მართვის ფუნქციები მოგვიანებით დაემატება.",
            ],
          },
          "კონკრეტული ღონისძიებისთვის სამუშაო (დიზაინი, მოსაწვევები და სხვა) თქვენთან ცალკე, წერილობით შეთანხმდება.",
        ],
      },
      {
        heading: "მასპინძლის ანგარიში",
        body: [
          {
            list: [
              "ანგარიშის შექმნა შეგიძლიათ მხოლოდ 16 წლის ან მეტი ასაკისას.",
              "მიუთითეთ სწორი ინფორმაცია და პაროლი საიდუმლოდ შეინახეთ.",
              "პასუხისმგებელი ხართ ყველაფერზე, რაც თქვენი ანგარიშით ხდება.",
              "ანგარიშის დახურვა ნებისმიერ დროს შეგიძლიათ. ჩვენ შეგვიძლია შევაჩეროთ ანგარიში, რომელიც ამ პირობების დარღვევით გამოიყენება.",
            ],
          },
        ],
      },
      {
        heading: "დაუშვებელი გამოყენება",
        body: [
          "ვებსაიტის გამოყენებისას დაუშვებელია:",
          {
            list: [
              "უკანონო, შეურაცხმყოფელი ან სხვისი უფლებების დამრღვევი შინაარსის გაზიარება;",
              "სხვა პირად წარდგენა;",
              "ვებსაიტის უსაფრთხოების დარღვევის ან მისი მუშაობის შეფერხების მცდელობა;",
              "ვებსაიტზე ავტომატური საშუალებებით მასობრივი წვდომა ან მონაცემების შეგროვება;",
              "სხვა ადამიანების პერსონალური მონაცემების გაზიარება მათი ნებართვის გარეშე.",
            ],
          },
        ],
      },
      {
        heading: "თქვენ მიერ გაზიარებული შინაარსი",
        body: [
          "როცა LYST საშუალებას მოგცემთ, ატვირთოთ ფოტოები, ხმოვანი შეტყობინებები ან ტექსტი:",
          {
            list: [
              "შინაარსი თქვენი რჩება.",
              "LYST-ს აძლევთ შეზღუდულ ნებართვას, შეინახოს, დაამუშაოს და აჩვენოს ეს შინაარსი მხოლოდ შესაბამისი ღონისძიების მასპინძელსა და სტუმრებს, რათა მომსახურება გაგიწიოთ. ნებართვა წყდება შინაარსის წაშლისას (სარეზერვო ასლები 90 დღეში გადაიწერება).",
              "ადასტურებთ, რომ გაქვთ შინაარსის გაზიარების უფლება და მასზე გამოსახული ადამიანების თანხმობა, ბავშვების შემთხვევაში კი მშობლის ან მეურვის თანხმობა.",
              "ყველა ატვირთულ მასალასთან იქნება ღილაკი დარღვევის შესატყობინებლად. მასპინძელს შეუძლია წაშალოს ნებისმიერი მასალა თავის ღონისძიებაზე, ჩვენ კი ნებისმიერი მასალა, რომელიც ამ პირობებს არღვევს.",
              "თქვენს შინაარსს LYST-ის რეკლამაში ან ჩვენს პორტფოლიოში არ გამოვიყენებთ თქვენი წერილობითი თანხმობის გარეშე, ხოლო ბავშვის გამოსახულების შემთხვევაში მშობლის ან მეურვის წერილობითი თანხმობის გარეშე.",
            ],
          },
        ],
      },
      {
        heading: "ჩვენი შინაარსი",
        body: [
          "ვებსაიტის დიზაინი, ტექსტები და ფოტოები ეკუთვნის LYST-ს ან მათ, ვინც მათი გამოყენების უფლება მოგვცა. მათი კოპირება ან ხელახლა გამოყენება ნებართვის გარეშე დაუშვებელია.",
        ],
      },
      {
        heading: "ფასები",
        body: [
          "კონსულტაციის მოთხოვნა არ გავალდებულებთ რაიმეს შეძენას. ჩვენი მომსახურების ფასი თქვენთან წერილობით შეთანხმდება სამუშაოს დაწყებამდე.",
        ],
      },
      {
        heading: "ვებსაიტის ხელმისაწვდომობა",
        body: [
          "ვცდილობთ, ვებსაიტი ყოველთვის ხელმისაწვდომი იყოს, თუმცა შეიძლება დროებით შევაჩეროთ ან შევცვალოთ იგი და ვერ დაგპირდებით, რომ ის ყოველთვის შეუფერხებლად იმუშავებს.",
        ],
      },
      {
        heading: "პასუხისმგებლობა",
        body: [
          "ვებსაიტი მოწოდებულია ისეთი, როგორიც არის. კანონით დაშვებულ ფარგლებში არ ვართ პასუხისმგებელი არაპირდაპირ ზიანზე, მაგალითად, მიუღებელ შემოსავალზე. ეს პირობები არ ზღუდავს იმ უფლებებს, რომელთა შეზღუდვაც კანონით დაუშვებელია, მათ შორის მომხმარებლის უფლებებს.",
        ],
      },
      {
        heading: "პირობების ცვლილებები",
        body: [
          "ამ პირობების შეცვლისას ვაახლებთ ვერსიასა და თარიღს ამ გვერდის თავში, მნიშვნელოვანი ცვლილებების შესახებ კი ანგარიშის მფლობელებს ელფოსტით შევატყობინებთ. ცვლილების შემდეგ ვებსაიტით სარგებლობა ნიშნავს, რომ ეთანხმებით განახლებულ პირობებს.",
        ],
      },
      {
        heading: "მოქმედი სამართალი და დავები",
        body: [
          "ამ პირობებზე ვრცელდება საქართველოს კანონმდებლობა. დავებს განიხილავს თბილისის სასამართლო, გარდა იმ შემთხვევისა, როცა თქვენი ქვეყნის კანონმდებლობა, როგორც მომხმარებელს, უფლებას გაძლევთ, სასამართლოს თქვენს ქვეყანაში მიმართოთ.",
        ],
      },
    ],
  },
};
