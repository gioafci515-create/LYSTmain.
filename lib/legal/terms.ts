// Terms of Service in Georgian, English and Russian. All versions must keep the same sections in the same order.
// If they differ, the Georgian version prevails (stated on the page: legal.prevails in messages/*.json).
// LEGAL REVIEW REQUIRED before relying on this text: see docs/legal/README.md for the open points.
// The "Content you share" section implements CLAUDE.md legal rules 3 and 4 ahead of uploads being built.
import type { Locale } from "@/i18n/routing";
import type { LegalDoc } from "./meta";

export const terms: Record<Locale, LegalDoc> = {
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
  ru: {
    title: "Условия использования",
    intro:
      "Эти условия регулируют использование сайта LYST и аккаунтов организаторов. Пользуясь сайтом или создавая аккаунт, вы соглашаетесь с ними.",
    sections: [
      {
        heading: "Кто мы",
        body: ["LYST — студия цифровых приглашений и впечатлений для мероприятий в Тбилиси, Грузия."],
      },
      {
        heading: "Что мы предлагаем",
        body: [
          {
            list: [
              "Информацию о наших услугах.",
              "Заявки на консультацию. Заявка — это ещё не подтверждённая запись: время мы согласуем с вами по электронной почте.",
              "Аккаунты организаторов. Создание мероприятий и управление гостями появятся позже.",
            ],
          },
          "Работа для конкретного мероприятия (дизайн, приглашения и всё остальное) согласуется с вами отдельно, в письменной форме.",
        ],
      },
      {
        heading: "Аккаунты организаторов",
        body: [
          {
            list: [
              "Чтобы создать аккаунт, вам должно быть 16 лет или больше.",
              "Указывайте точные данные и храните пароль в секрете.",
              "Вы отвечаете за всё, что происходит в вашем аккаунте.",
              "Вы можете закрыть аккаунт в любое время. Мы можем приостановить аккаунт, который используется с нарушением этих условий.",
            ],
          },
        ],
      },
      {
        heading: "Допустимое использование",
        body: [
          "Пользуясь сайтом, нельзя:",
          {
            list: [
              "публиковать что-либо незаконное, оскорбительное или нарушающее чужие права;",
              "выдавать себя за другого человека;",
              "пытаться обойти защиту сайта или нарушить его работу;",
              "использовать автоматические средства для массового доступа к сайту или сбора данных с него;",
              "распространять чужие персональные данные без согласия этих людей.",
            ],
          },
        ],
      },
      {
        heading: "Контент, которым вы делитесь",
        body: [
          "Когда LYST даёт возможность загружать фотографии, голосовые сообщения или текст:",
          {
            list: [
              "Контент остаётся вашим.",
              "Вы даёте LYST ограниченное разрешение хранить, обрабатывать и показывать его только организатору и гостям этого мероприятия, чтобы мы могли оказывать услугу. Это разрешение прекращается, когда контент удалён (резервные копии перезаписываются в течение 90 дней).",
              "Вы подтверждаете, что имеете право им делиться и получили согласие людей, которые на нём изображены; если это дети — согласие родителя или опекуна.",
              "У каждой загрузки будет кнопка, чтобы пожаловаться на неё. Организатор может удалить любую загрузку на своём мероприятии, а мы можем удалить всё, что нарушает эти условия.",
              "Мы не будем использовать ваш контент в рекламе LYST или в нашем портфолио без вашего письменного согласия; если на нём изображён ребёнок — без письменного согласия родителя или опекуна.",
            ],
          },
        ],
      },
      {
        heading: "Наш контент",
        body: [
          "Дизайн, тексты и фотографии сайта принадлежат LYST или тем, кто предоставил нам на них лицензию. Не копируйте и не используйте их повторно без разрешения.",
        ],
      },
      {
        heading: "Цены",
        body: [
          "Заявка на консультацию ни к какой покупке вас не обязывает. Цены на наши услуги согласуются с вами в письменной форме до начала любой работы.",
        ],
      },
      {
        heading: "Доступность",
        body: [
          "Мы стараемся, чтобы сайт был доступен, но можем приостанавливать или изменять его и не можем обещать, что он всегда будет работать без перебоев.",
        ],
      },
      {
        heading: "Ответственность",
        body: [
          "Сайт предоставляется «как есть». В пределах, допустимых законом, мы не несём ответственности за косвенные убытки, например упущенный доход. Ничто в этих условиях не ограничивает права, ограничение которых закон не допускает, включая ваши права потребителя.",
        ],
      },
      {
        heading: "Изменения этих условий",
        body: [
          "Когда мы меняем эти условия, мы обновляем версию и дату в начале этой страницы и сообщаем владельцам аккаунтов о важных изменениях по электронной почте. Продолжая пользоваться сайтом после изменений, вы принимаете обновлённые условия.",
        ],
      },
      {
        heading: "Право и споры",
        body: [
          "Эти условия регулируются законодательством Грузии. Споры рассматриваются судами Тбилиси, если только закон вашей страны не даёт вам как потребителю права обратиться в суд там.",
        ],
      },
    ],
  },
};
