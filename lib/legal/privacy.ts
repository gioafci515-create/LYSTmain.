// Privacy Policy, English and Georgian. Both versions must keep the same sections in the same order.
// LEGAL REVIEW REQUIRED before relying on this text: see docs/legal/README.md for the open points.
// It describes what the site does today; update it whenever data collection, processors or
// retention change (and bump LEGAL_VERSION in ./meta.ts).
import { site } from "@/lib/site";
import type { Lang, LegalDoc } from "./meta";

const { email, phone } = site.contact;

export const privacy: Record<Lang, LegalDoc> = {
  en: {
    title: "Privacy Policy",
    intro:
      "This policy explains what personal information LYST collects when you use our website, why, who helps us process it, how long we keep it, and how you can ask us to see, correct or delete it.",
    sections: [
      {
        heading: "Who we are",
        body: [
          `LYST is a digital invitations and event-experience studio in Tbilisi, Georgia. We are responsible for the personal information described here (the "controller"). You can reach us at ${email} or ${phone}.`,
        ],
      },
      {
        heading: "What we collect",
        body: [
          {
            list: [
              "Consultation requests: your name, email, phone number (optional), what you tell us about your event, the date and time you choose, and how you found us (for example Instagram).",
              "Host accounts: your name, email, password (kept only as a secure, one-way code by our sign-in provider; we never see it), the date you confirmed you are 16 or older, and when you sign in.",
              "Visit statistics: the page you visited, the website or campaign that sent you, your type of device (phone, tablet or computer), and a visitor code that changes every day. The code is made from your IP address and browser details with a secret key. We do not store your IP address or full browser details, and we cannot follow you from one day to the next. No cookies are used for this, and if your browser sends a \"Do Not Track\" signal we do not count your visit at all.",
              "Security data: to stop abuse such as password guessing, we briefly count requests per IP address and per email. These counts are stored only as codes and are deleted within one hour.",
              "Messages: what you send us by email or phone.",
            ],
          },
        ],
      },
      {
        heading: "Why we use it",
        body: [
          {
            list: [
              "To answer your consultation request and plan your event, because you asked us to.",
              "To run your host account, because it is needed to provide the service.",
              "To keep the website secure and prevent abuse (our legitimate interest).",
              "To understand how the website is used overall (our legitimate interest). We do not build profiles of individual people.",
            ],
          },
          "We do not sell your information or use it for advertising. We only send you marketing emails if you have agreed to receive them.",
        ],
      },
      {
        heading: "Cookies",
        body: [
          "We only use cookies that are needed to keep you signed in to your account. We do not use cookies for statistics or advertising.",
        ],
      },
      {
        heading: "Who processes it for us",
        body: [
          {
            list: [
              "Supabase: our database and account sign-in.",
              "Vercel: hosting and delivering the website.",
              "Upstash: short-lived security counters.",
              "Google (Gmail): when you email us or we reply.",
            ],
          },
          "These companies may store information outside Georgia, for example in the European Union or the United States. We work with providers that commit by contract to protect it and to use it only on our instructions.",
        ],
      },
      {
        heading: "How long we keep it",
        body: [
          {
            list: [
              "Consultation requests: up to 24 months after our last contact. If you become a client, as long as needed for your event and for legal duties such as accounting.",
              "Host accounts: until you delete your account or ask us to. We then delete it within 30 days; backup copies are overwritten within 90 days.",
              "Visit statistics: 24 months.",
              "Security counters: up to one hour.",
              "Messages: as long as needed to deal with your request.",
            ],
          },
        ],
      },
      {
        heading: "Your rights",
        body: [
          "You can ask for a copy of your information, ask us to correct or delete it, ask us to limit or stop using it, ask for it in a form you can take elsewhere, and withdraw any consent you gave at any time.",
          `Email ${email} from the address the request is about. We will reply within 10 working days.`,
          "If you think we handle your information wrongly, you can complain to the Personal Data Protection Service of Georgia (personaldata.ge) or, if you live in the European Union, to the data protection authority in your country.",
        ],
      },
      {
        heading: "Children",
        body: [
          "Host accounts are for people aged 16 or older. If you think a child under 16 has created an account, contact us and we will delete it.",
        ],
      },
      {
        heading: "Security",
        body: [
          "The website only works over an encrypted connection (HTTPS). Sign-in sessions are kept in protected cookies that scripts in the browser cannot read, passwords are stored only as one-way codes, and only people who need it for their work can access your information.",
        ],
      },
      {
        heading: "Changes to this policy",
        body: [
          "When we change this policy, we update the version and date at the top of this page. We will tell account holders about important changes by email.",
        ],
      },
    ],
  },
  ka: {
    title: "კონფიდენციალურობის პოლიტიკა",
    intro:
      "ეს პოლიტიკა განმარტავს, რა პერსონალურ მონაცემებს აგროვებს LYST, როცა ჩვენს ვებსაიტს იყენებთ, რატომ, ვინ გვეხმარება მათ დამუშავებაში, რამდენ ხანს ვინახავთ მათ და როგორ შეგიძლიათ მოითხოვოთ მათი ნახვა, შესწორება ან წაშლა.",
    sections: [
      {
        heading: "ვინ ვართ ჩვენ",
        body: [
          `LYST არის ციფრული მოსაწვევებისა და ღონისძიებების გამოცდილების სტუდია თბილისში, საქართველოში. ჩვენ ვართ აქ აღწერილი პერსონალური მონაცემების დამმუშავებელი. დაგვიკავშირდით: ${email}, ${phone}.`,
        ],
      },
      {
        heading: "რა მონაცემებს ვაგროვებთ",
        body: [
          {
            list: [
              "კონსულტაციის მოთხოვნა: თქვენი სახელი, ელფოსტა, ტელეფონის ნომერი (სურვილისამებრ), ის, რასაც თქვენი ღონისძიების შესახებ გვწერთ, არჩეული თარიღი და დრო და საიდან გაიგეთ ჩვენ შესახებ (მაგალითად, Instagram-იდან).",
              "მასპინძლის ანგარიში: თქვენი სახელი, ელფოსტა, პაროლი (ჩვენი ავტორიზაციის პროვაიდერი მას ინახავს მხოლოდ დაცული, შეუქცევადი კოდის სახით; ჩვენ მას ვერ ვხედავთ), თარიღი, როცა დაადასტურეთ, რომ 16 წლის ან მეტის ხართ, და ანგარიშში შესვლის დრო.",
              "ვიზიტების სტატისტიკა: გვერდი, რომელიც ნახეთ, ვებსაიტი ან კამპანია, საიდანაც მოხვედით, მოწყობილობის ტიპი (ტელეფონი, პლანშეტი ან კომპიუტერი) და ვიზიტორის კოდი, რომელიც ყოველდღე იცვლება. ეს კოდი იქმნება თქვენი IP მისამართისა და ბრაუზერის მონაცემებისგან საიდუმლო გასაღების გამოყენებით. თავად IP მისამართს და ბრაუზერის სრულ მონაცემებს არ ვინახავთ და ერთი დღიდან მეორემდე თქვენს თვალყურის დევნებას ვერ ვახერხებთ. ამისთვის ქუქი-ფაილებს არ ვიყენებთ, ხოლო თუ თქვენი ბრაუზერი აგზავნის „Do Not Track“ სიგნალს, თქვენს ვიზიტს საერთოდ არ ვითვლით.",
              "უსაფრთხოების მონაცემები: ბოროტად გამოყენების (მაგალითად, პაროლის გამოცნობის მცდელობების) შესაჩერებლად მოკლე დროით ვითვლით მოთხოვნებს IP მისამართისა და ელფოსტის მიხედვით. ეს მონაცემები ინახება მხოლოდ კოდის სახით და იშლება ერთ საათში.",
              "წერილები: ის, რასაც ელფოსტით ან ტელეფონით გვიგზავნით.",
            ],
          },
        ],
      },
      {
        heading: "რატომ ვიყენებთ მათ",
        body: [
          {
            list: [
              "კონსულტაციის მოთხოვნაზე საპასუხოდ და თქვენი ღონისძიების დასაგეგმად, რადგან ეს თქვენ თავად გვთხოვეთ.",
              "თქვენი მასპინძლის ანგარიშის სამართავად, რადგან ეს საჭიროა მომსახურების გასაწევად.",
              "ვებსაიტის უსაფრთხოების დასაცავად და ბოროტად გამოყენების თავიდან ასაცილებლად (ჩვენი კანონიერი ინტერესი).",
              "იმის გასაგებად, ზოგადად როგორ იყენებენ ვებსაიტს (ჩვენი კანონიერი ინტერესი). ცალკეული ადამიანების პროფილებს არ ვქმნით.",
            ],
          },
          "თქვენს მონაცემებს არ ვყიდით და არ ვიყენებთ რეკლამისთვის. სარეკლამო წერილებს მხოლოდ მაშინ გამოგიგზავნით, თუ ამაზე თანხმობას მოგვცემთ.",
        ],
      },
      {
        heading: "ქუქი-ფაილები",
        body: [
          "ვიყენებთ მხოლოდ იმ ქუქი-ფაილებს, რომლებიც საჭიროა იმისთვის, რომ ანგარიშში შესული დარჩეთ. სტატისტიკისა და რეკლამისთვის ქუქი-ფაილებს არ ვიყენებთ.",
        ],
      },
      {
        heading: "ვინ ამუშავებს მონაცემებს ჩვენი სახელით",
        body: [
          {
            list: [
              "Supabase: ჩვენი მონაცემთა ბაზა და ანგარიშში შესვლა.",
              "Vercel: ვებსაიტის ჰოსტინგი და მიწოდება.",
              "Upstash: მოკლევადიანი უსაფრთხოების მთვლელები.",
              "Google (Gmail): როცა ელფოსტით გვწერთ ან გპასუხობთ.",
            ],
          },
          "ამ კომპანიებს შეუძლიათ მონაცემების შენახვა საქართველოს ფარგლებს გარეთ, მაგალითად, ევროკავშირში ან ამერიკის შეერთებულ შტატებში. ვთანამშრომლობთ პროვაიდერებთან, რომლებიც ხელშეკრულებით იღებენ ვალდებულებას, დაიცვან მონაცემები და გამოიყენონ ისინი მხოლოდ ჩვენი მითითებით.",
        ],
      },
      {
        heading: "რამდენ ხანს ვინახავთ",
        body: [
          {
            list: [
              "კონსულტაციის მოთხოვნები: ბოლო კონტაქტიდან არაუმეტეს 24 თვისა. თუ ჩვენი კლიენტი გახდებით, იმდენ ხანს, რამდენიც საჭიროა თქვენი ღონისძიებისა და კანონით დადგენილი ვალდებულებების (მაგალითად, ბუღალტრული აღრიცხვის) შესასრულებლად.",
              "მასპინძლის ანგარიშები: სანამ ანგარიშს არ წაშლით ან წაშლას არ მოგვთხოვთ. ამის შემდეგ ანგარიშს 30 დღეში ვშლით, სარეზერვო ასლები კი 90 დღეში გადაიწერება.",
              "ვიზიტების სტატისტიკა: 24 თვე.",
              "უსაფრთხოების მთვლელები: არაუმეტეს ერთი საათისა.",
              "წერილები: იმდენ ხანს, რამდენიც საჭიროა თქვენი მოთხოვნის დასამუშავებლად.",
            ],
          },
        ],
      },
      {
        heading: "თქვენი უფლებები",
        body: [
          "შეგიძლიათ მოითხოვოთ თქვენი მონაცემების ასლი, მათი შესწორება ან წაშლა, მათი დამუშავების შეზღუდვა ან შეწყვეტა, მათი მიღება ისეთი ფორმით, რომ სხვაგან გადაიტანოთ, ასევე ნებისმიერ დროს გამოიხმოთ მოცემული თანხმობა.",
          `მოგვწერეთ ${email}-ზე იმ ელფოსტიდან, რომელსაც მოთხოვნა ეხება. გიპასუხებთ 10 სამუშაო დღის განმავლობაში.`,
          "თუ ფიქრობთ, რომ თქვენს მონაცემებს არასწორად ვამუშავებთ, შეგიძლიათ მიმართოთ საქართველოს პერსონალურ მონაცემთა დაცვის სამსახურს (personaldata.ge), ხოლო თუ ევროკავშირში ცხოვრობთ, თქვენი ქვეყნის მონაცემთა დაცვის ორგანოს.",
        ],
      },
      {
        heading: "ბავშვები",
        body: [
          "მასპინძლის ანგარიში მხოლოდ 16 წლის და უფროსი ასაკის პირებისთვისაა. თუ ფიქრობთ, რომ ანგარიში 16 წლამდე ბავშვმა შექმნა, დაგვიკავშირდით და მას წავშლით.",
        ],
      },
      {
        heading: "უსაფრთხოება",
        body: [
          "ვებსაიტი მუშაობს მხოლოდ დაშიფრული კავშირით (HTTPS). შესვლის სესიები ინახება დაცულ ქუქი-ფაილებში, რომლებსაც ბრაუზერის სკრიპტები ვერ კითხულობენ, პაროლები ინახება მხოლოდ შეუქცევადი კოდის სახით, ხოლო თქვენს მონაცემებზე წვდომა მხოლოდ იმ ადამიანებს აქვთ, ვისაც ეს სამუშაოსთვის სჭირდებათ.",
        ],
      },
      {
        heading: "პოლიტიკის ცვლილებები",
        body: [
          "ამ პოლიტიკის შეცვლისას ვაახლებთ ვერსიასა და თარიღს ამ გვერდის თავში. მნიშვნელოვანი ცვლილებების შესახებ ანგარიშის მფლობელებს ელფოსტით შევატყობინებთ.",
        ],
      },
    ],
  },
};
