# Copy review: Georgian and Russian

**For:** native speakers of Georgian and Russian. **Status:** waiting for review.

Every Georgian (ka) and Russian (ru) text on the public site, next to the English. Georgian was written natively (not translated word for word); Russian follows the English. Mark anything that sounds unnatural, too formal, or wrong for a premium studio, and write the better version next to it. Changes go into `messages/ka.json` and `messages/ru.json` (same keys).

Generated from the message files on 2026-11-01. Things in curly braces, like `{email}`, are filled in by the site; text inside `<link>…</link>`, `<terms>…</terms>` or `<privacy>…</privacy>` becomes a link.

## Decisions to confirm

1. **Wording rules** (CLAUDE.md): never "RSVP". Georgian uses „დასწრების დადასტურება“, Russian «подтверждение присутствия». "Invite Smarter." stays English everywhere.
2. **"Host"** (the person who plans the event and has an account): Georgian **მასპინძელი**, Russian **организатор**. Is that the word your clients use?
3. **Formal "you":** Georgian uses **თქვენ**, Russian **вы** throughout.
4. **Uppercase labels:** Georgian has no capital letters for the small spaced labels (e.g. "03 / შესაძლებლობები"), so on Georgian pages they are shown in normal letters with almost no letter-spacing. Alternative: Mtavruli capitals (ᲨᲔᲡᲐᲫᲚᲔᲑᲚᲝᲑᲔᲑᲘ). Which looks right to you?
5. **Capabilities, item 3:** the English used to say "voice messages, polls"; it now says "Guest photos, messages and more" in all three languages, because voice messages and polls don't exist yet (only real features are named).
6. **Legal pages:** `/privacy` and `/terms` exist in all three languages (`lib/legal/privacy.ts`, `lib/legal/terms.ts`). Each says the Georgian version prevails. The Russian texts are new and need the same review as the rest, ideally together with the lawyer review in `docs/legal/README.md`.
7. **Dates:** browsers don't all know Georgian date names, so the site spells them out itself (`lib/intl.ts`): months იანვარი … დეკემბერი, weekdays ორშაბათი … კვირა, one-letter calendar headings ო ს ო ხ პ შ კ, and dates written like "კვირა, 1 ნოემბერი, 2026". Please check these too.
8. **Main call to action** (header, menu, island): „დაგეგმე მოსაწვევი“ was set in the plan, but it uses the informal "you" while the rest of the site uses **თქვენ** (formal would be „დაგეგმეთ მოსაწვევი“). Keep it, or switch to formal? Russian «Спланировать приглашение» is neutral.
9. **Short call to action** in the small floating header on phones: EN "Plan", KA „დაგეგმე“, RU **«Начать»** ("Start"), because «Спланировать» doesn't fit there. A better short Russian word of up to about 8 letters is welcome.
10. **"Client login"** in the footer: KA „კლიენტის შესვლა“, RU «Вход для клиентов». The log-in page itself still says "Host log in" („მასპინძლის შესვლა“, «Вход для организаторов»). Should both use the same word?
11. **Russian "The experience"** is «Как это работает» ("How it works"), in the section label and the header link. Phase 4 adds a real "How it works" section, so this one will need a different Russian name then.

## meta

| Key | English | ქართული | Русский |
|---|---|---|---|
| `homeTitle` | LYST \| Beyond the invitation | LYST \| მოსაწვევის მიღმა | LYST \| За гранью приглашения |
| `homeDescription` | Bespoke digital invitations and connected event experiences. | ციფრული მოსაწვევები ინდივიდუალური დიზაინით და ღონისძიების ერთიანი გამოცდილება. | Индивидуальные цифровые приглашения и единый опыт вашего мероприятия. |
| `login` | Log in \| LYST | შესვლა \| LYST | Вход \| LYST |
| `signup` | Sign up \| LYST | რეგისტრაცია \| LYST | Регистрация \| LYST |
| `forgot` | Forgot password \| LYST | პაროლის აღდგენა \| LYST | Восстановление пароля \| LYST |
| `reset` | Choose a new password \| LYST | ახალი პაროლი \| LYST | Новый пароль \| LYST |
| `account` | Your account \| LYST | თქვენი ანგარიში \| LYST | Ваш аккаунт \| LYST |
| `privacyTitle` | Privacy Policy \| LYST | კონფიდენციალურობის პოლიტიკა \| LYST | Политика конфиденциальности \| LYST |
| `privacyDescription` | What personal information LYST collects, why, who processes it, how long it is kept and how to ask for its deletion. | რა პერსონალურ მონაცემებს აგროვებს LYST, რატომ, ვინ ამუშავებს მათ, რამდენ ხანს ინახება და როგორ მოითხოვოთ მათი წაშლა. | Какие персональные данные собирает LYST, зачем, кто их обрабатывает, как долго они хранятся и как запросить их удаление. |
| `termsTitle` | Terms of Service \| LYST | მომსახურების პირობები \| LYST | Условия использования \| LYST |
| `termsDescription` | The terms for using the LYST website and host accounts. | LYST-ის ვებსაიტისა და მასპინძლის ანგარიშების გამოყენების პირობები. | Условия использования сайта LYST и аккаунтов организаторов. |
| `notFound` | Page not found \| LYST | გვერდი ვერ მოიძებნა \| LYST | Страница не найдена \| LYST |

## common

| Key | English | ქართული | Русский |
|---|---|---|---|
| `skipToContent` | Skip to content | მთავარ შინაარსზე გადასვლა | Перейти к содержанию |
| `backToTop` | LYST, back to top | LYST, გვერდის თავში დაბრუნება | LYST, наверх |
| `backToWebsite` | ← Back to website | ← ვებსაიტზე დაბრუნება | ← Вернуться на сайт |
| `close` | Close | დახურვა | Закрыть |
| `newTab` | (opens in a new tab) | (იხსნება ახალ ჩანართში) | (откроется в новой вкладке) |
| `privacyPolicy` | Privacy Policy | კონფიდენციალურობის პოლიტიკა | Политика конфиденциальности |
| `terms` | Terms of Service | მომსახურების პირობები | Условия использования |
| `language` | Language | ენა | Язык |
| `slogan` | Invite Smarter. | Invite Smarter. | Invite Smarter. |

## nav

| Key | English | ქართული | Русский |
|---|---|---|---|
| `main` | Main | მთავარი | Основная |
| `quickNavigation` | Quick navigation | სწრაფი ნავიგაცია | Быстрая навигация |
| `about` | About | ჩვენ შესახებ | О нас |
| `capabilities` | Capabilities | შესაძლებლობები | Возможности |
| `experience` | The experience | გამოცდილება | Как это работает |
| `cta` | Plan your invitation | დაგეგმე მოსაწვევი | Спланировать приглашение |
| `ctaShort` | Plan | დაგეგმე | Начать |
| `menu` | Menu | მენიუ | Меню |

## sections

| Key | English | ქართული | Русский |
|---|---|---|---|
| `about` | 02 / About | 02 / ჩვენ შესახებ | 02 / О нас |
| `capabilities` | 03 / Capabilities | 03 / შესაძლებლობები | 03 / Возможности |
| `experience` | 04 / The experience | 04 / გამოცდილება | 04 / Как это работает |
| `consultation` | 05 / Consultation | 05 / კონსულტაცია | 05 / Консультация |

## hero

| Key | English | ქართული | Русский |
|---|---|---|---|
| `headline.0` | Beyond the | მოსაწვევის | За гранью |
| `headline.1` | invitation. | მიღმა. | приглашения. |
| `intro` | Bespoke digital invitations and connected event experiences. | ციფრული მოსაწვევები ინდივიდუალური დიზაინით და ღონისძიების ერთიანი გამოცდილება. | Индивидуальные цифровые приглашения и единый опыт вашего мероприятия. |
| `photoAlt` | Friends gathered around a dining table in a Mediterranean home | მეგობრები სასადილო მაგიდასთან ხმელთაშუაზღვისპირულ სახლში | Друзья за обеденным столом в средиземноморском доме |

## about

| Key | English | ქართული | Русский |
|---|---|---|---|
| `headline.0` | More than | მეტი, ვიდრე | Больше, |
| `headline.1` | an invitation. | უბრალოდ მოსაწვევი. | чем приглашение. |
| `intro` | We create bespoke digital invitations and connected event experiences for life's most meaningful moments. | ვქმნით ციფრულ მოსაწვევებს ინდივიდუალური დიზაინით და ღონისძიების ერთიან გამოცდილებას ცხოვრების ყველაზე მნიშვნელოვანი მომენტებისთვის. | Мы создаём индивидуальные цифровые приглашения и цельный опыт мероприятия для самых важных моментов в жизни. |
| `features.0.title` | Bespoke design | ინდივიდუალური დიზაინი | Индивидуальный дизайн |
| `features.0.body` | Every invitation is a custom creation, thoughtfully designed around your story, your people and your occasion. | ყოველი მოსაწვევი ცალკე იქმნება და ეფუძნება თქვენს ისტორიას, თქვენს ადამიანებსა და თქვენს ღონისძიებას. | Каждое приглашение создаётся заново, вокруг вашей истории, ваших близких и вашего события. |
| `features.1.title` | Connected experience | ერთიანი გამოცდილება | Всё в одном месте |
| `features.1.body` | Invitations, guest responses and every detail of your event, kept together in one place. | მოსაწვევი, სტუმრების პასუხები და ღონისძიების ყველა დეტალი ერთ სივრცეში. | Приглашения, ответы гостей и все детали мероприятия собраны в одном месте. |
| `tableAlt` | Linen-covered table with olive branches, wine glass and lemons | სელის სუფრით გადაფარებული მაგიდა ზეთისხილის ტოტებით, ღვინის ჭიქითა და ლიმონებით | Стол с льняной скатертью, оливковыми ветвями, бокалом вина и лимонами |
| `windowAlt` | Stone interior with a vase and olive branches by a tall window | ქვის ინტერიერი ლარნაკითა და ზეთისხილის ტოტებით მაღალ ფანჯარასთან | Каменный интерьер с вазой и оливковыми ветвями у высокого окна |

## capabilities

| Key | English | ქართული | Русский |
|---|---|---|---|
| `headline.0` | One invitation. | ერთი მოსაწვევი. | Одно приглашение. |
| `headline.1` | More possibilities. | მეტი შესაძლებლობა. | Больше возможностей. |
| `intro` | A more connected way to bring people together: before, during and after the event. | ადამიანების ერთად შეკრების თანამედროვე გზა: ღონისძიებამდე, მის დროს და მის შემდეგ. | Современный способ собрать людей вместе: до, во время и после мероприятия. |
| `items.0.title` | Bespoke invitations | ინდივიდუალური მოსაწვევები | Индивидуальные приглашения |
| `items.0.body` | Unique designs that set the tone for your event, crafted around your story. | უნიკალური დიზაინი, რომელიც ღონისძიების განწყობას ქმნის და თქვენს ისტორიას ეფუძნება. | Уникальный дизайн, который задаёт настроение событию и рассказывает вашу историю. |
| `items.0.alt` | Phone showing a digital invitation on a stone table with olives | ტელეფონი ციფრული მოსაწვევით ქვის მაგიდაზე, ზეთისხილის გვერდით | Телефон с цифровым приглашением на каменном столе рядом с оливками |
| `items.1.title` | Guest management | სტუმრების მართვა | Управление гостями |
| `items.1.body` | Send, track and manage with ease, all in one place. | გაგზავნეთ, თვალი ადევნეთ და მართეთ მარტივად, ერთ სივრცეში. | Отправляйте, отслеживайте и управляйте легко, всё в одном месте. |
| `items.1.alt` | Guests mingling at an evening reception | სტუმრები საღამოს მიღებაზე | Гости общаются на вечернем приёме |
| `items.2.title` | Interactive experiences | ინტერაქტიული გამოცდილება | Интерактивные возможности |
| `items.2.body` | Guest photos, messages and more, for a more engaging event. | სტუმრების ფოტოები, შეტყობინებები და სხვა, უფრო ცოცხალი ღონისძიებისთვის. | Фотографии гостей, сообщения и многое другое, чтобы событие стало живее. |
| `items.2.alt` | Friends laughing around a table by the sea | მეგობრები იცინიან ზღვისპირა მაგიდასთან | Друзья смеются за столом у моря |
| `items.3.title` | Real-time updates | განახლებები რეალურ დროში | Обновления в реальном времени |
| `items.3.body` | Share changes, important details and last-minute information instantly. | ცვლილებები, მნიშვნელოვანი დეტალები და ბოლო წუთის ინფორმაცია მყისიერად ყველასთან. | Изменения, важные детали и информация в последний момент сразу у всех гостей. |
| `items.3.alt` | Crowd at an outdoor festival at sunset | ხალხი ღია ცის ქვეშ ფესტივალზე მზის ჩასვლისას | Толпа на фестивале под открытым небом на закате |
| `items.4.title` | Lasting memories | დაუვიწყარი მოგონებები | Воспоминания |
| `items.4.body` | A shared space to relive and keep the moments that matter. | საერთო სივრცე, სადაც მნიშვნელოვანი მომენტები ინახება და მათი ხელახლა განცდა შეიძლება. | Общее пространство, где можно сохранить важные моменты и вернуться к ним. |
| `items.4.alt` | Printed event photographs on a stone table | ღონისძიების დაბეჭდილი ფოტოები ქვის მაგიდაზე | Напечатанные фотографии с мероприятия на каменном столе |

## experience

| Key | English | ქართული | Русский |
|---|---|---|---|
| `headline.0` | From the first invitation | პირველი მოსაწვევიდან | От первого приглашения |
| `headline.1` | to the last memory. | ბოლო მოგონებამდე. | до последнего воспоминания. |
| `intro` | The invitation, replies, updates and shared photos stay together, before, during and after your event. | მოსაწვევი, პასუხები, განახლებები და საერთო ფოტოები ერთად რჩება: ღონისძიებამდე, მის დროს და მის შემდეგ. | Приглашение, ответы, обновления и общие фотографии остаются вместе: до, во время и после мероприятия. |
| `photoAlt` | Friends laughing together on a terrace at sunset above a harbour | მეგობრები ერთად იცინიან ტერასაზე ნავსადგურის თავზე, მზის ჩასვლისას | Друзья смеются на террасе над гаванью на закате |
| `steps.0.title` | Invite | მოწვევა | Приглашение |
| `steps.0.body` | A personal invitation, crafted for your event. | პერსონალური მოსაწვევი, შექმნილი თქვენი ღონისძიებისთვის. | Личное приглашение, созданное для вашего события. |
| `steps.1.title` | Respond | დასწრების დადასტურება | Подтверждение присутствия |
| `steps.1.body` | Guests confirm their attendance. | სტუმრები ადასტურებენ, მოვლენ თუ არა. | Гости подтверждают, придут ли они. |
| `steps.2.title` | Prepare | მზადება | Подготовка |
| `steps.2.body` | Details, guidance and updates in one place. | დეტალები, მითითებები და განახლებები ერთ სივრცეში. | Детали, советы и обновления в одном месте. |
| `steps.3.title` | Participate | მონაწილეობა | Участие |
| `steps.3.body` | Shared moments and guest interaction. | საერთო მომენტები და სტუმრების ჩართულობა. | Общие моменты и вовлечённость гостей. |
| `steps.4.title` | Remember | მოგონება | Память |
| `steps.4.body` | A lasting home for the memories. | მოგონებების მუდმივი სახლი. | Постоянный дом для воспоминаний. |

## consultation

| Key | English | ქართული | Русский |
|---|---|---|---|
| `headline.0` | Your moment | თქვენი მომენტი | Ваш момент |
| `headline.1` | starts here. | აქ იწყება. | начинается здесь. |
| `intro` | Every extraordinary experience begins with a conversation. | ყოველი განსაკუთრებული ღონისძიება საუბრით იწყება. | Каждое особенное событие начинается с разговора. |
| `cta` | Book a consultation | კონსულტაციაზე ჩაწერა | Записаться на консультацию |
| `photoAlt` | Guests dancing on a beach at sunset beside a DJ booth | სტუმრები ცეკვავენ სანაპიროზე მზის ჩასვლისას, დიჯეის პულტთან | Гости танцуют на пляже на закате рядом с диджейским пультом |
| `noscript` | Booking online needs JavaScript. You can also email us at <link>{email}</link>. | ონლაინ ჩაწერისთვის საჭიროა JavaScript. ასევე შეგიძლიათ მოგვწეროთ: <link>{email}</link>. | Для онлайн-записи нужен JavaScript. Вы также можете написать нам: <link>{email}</link>. |

## footer

| Key | English | ქართული | Русский |
|---|---|---|---|
| `tagline` | Bespoke digital invitations and connected event experiences. | ციფრული მოსაწვევები ინდივიდუალური დიზაინით და ღონისძიების ერთიანი გამოცდილება. | Индивидуальные цифровые приглашения и единый опыт вашего мероприятия. |
| `contact` | Contact | კონტაქტი | Контакты |
| `legal` | Legal | სამართლებრივი ინფორმაცია | Правовая информация |
| `follow` | Follow | გამოგვყევით | Мы в соцсетях |
| `address` | Tbilisi, Georgia | თბილისი, საქართველო | Тбилиси, Грузия |
| `clientLogin` | Client login | კლიენტის შესვლა | Вход для клиентов |

## form

| Key | English | ქართული | Русский |
|---|---|---|---|
| `required` | required | სავალდებულო | обязательно |
| `optional` | optional | არასავალდებულო | необязательно |
| `error` | Error: {message} | შეცდომა: {message} | Ошибка: {message} |
| `change` | Change | შეცვლა | Изменить |
| `changeLabel` | Change {item} | შეცვლა: {item} | Изменить: {item} |
| `checkDetails` | Please check your details | გადაამოწმეთ მონაცემები | Проверьте данные |
| `needAttention` | Please check: {fields}. | შესამოწმებელია: {fields}. | Проверьте: {fields}. |

## booking

| Key | English | ქართული | Русский |
|---|---|---|---|
| `eyebrow` | Consultation | კონსულტაცია | Консультация |
| `title` | Book a consultation | კონსულტაციაზე ჩაწერა | Запись на консультацию |
| `titleDone` | Request received | მოთხოვნა მიღებულია | Запрос получен |
| `progress` | Progress | ეტაპები | Шаги |
| `stepDate` | Date | თარიღი | Дата |
| `stepTime` | Time | დრო | Время |
| `stepDetails` | Details | მონაცემები | Данные |
| `stepReview` | Review | გადამოწმება | Проверка |
| `completed` | completed | დასრულებულია | готово |
| `dateIntro` | Choose the day you would like to talk. No account is required. | აირჩიეთ დღე, როცა გსურთ საუბარი. ანგარიში საჭირო არ არის. | Выберите день для разговора. Регистрация не нужна. |
| `dateSelected` | {date} selected. | არჩეულია: {date}. | Выбрано: {date}. |
| `noDate` | No date selected. | თარიღი არ არის არჩეული. | Дата не выбрана. |
| `continueToTime` | Continue to time → | შემდეგი: დრო → | Далее: время → |
| `chooseDateToContinue` | Choose a date to continue | გასაგრძელებლად აირჩიეთ თარიღი | Выберите дату, чтобы продолжить |
| `timeIntro` | Choose a preferred time in Tbilisi (GMT+4). We will confirm availability by email. | აირჩიეთ სასურველი დრო თბილისის დროით (GMT+4). ხელმისაწვდომობას ელფოსტით დაგიდასტურებთ. | Выберите удобное время по Тбилиси (GMT+4). Мы подтвердим его по электронной почте. |
| `preferredTime` | Preferred time | სასურველი დრო | Удобное время |
| `yourTime` | {time} your time | {time} თქვენი დროით | {time} по вашему времени |
| `selected` | ✓ Selected | ✓ არჩეულია | ✓ Выбрано |
| `localNote` | Your own time ({zone}) is shown under each slot. | თქვენი დრო ({zone}) მითითებულია ყოველი ვარიანტის ქვეშ. | Ваше время ({zone}) указано под каждым вариантом. |
| `continueToDetails` | Continue to details → | შემდეგი: მონაცემები → | Далее: данные → |
| `backToDate` | Back to date | თარიღზე დაბრუნება | Назад к дате |
| `detailsIntro` | Your consultation details. No account is required. | თქვენი საკონტაქტო მონაცემები. ანგარიში საჭირო არ არის. | Ваши контактные данные. Регистрация не нужна. |
| `checkContact` | Please check your contact details | გადაამოწმეთ საკონტაქტო მონაცემები | Проверьте контактные данные |
| `name` | Name | სახელი | Имя |
| `namePlaceholder` | Your name | თქვენი სახელი | Ваше имя |
| `email` | Email | ელფოსტა | Эл. почта |
| `emailPlaceholder` | Your email | თქვენი ელფოსტა | Ваш адрес эл. почты |
| `phone` | Phone | ტელეფონი | Телефон |
| `phonePlaceholder` | Your phone number | თქვენი ტელეფონის ნომერი | Ваш номер телефона |
| `context` | Event context | ღონისძიების შესახებ | О мероприятии |
| `contextPlaceholder` | A little about your occasion | მოკლედ თქვენი ღონისძიების შესახებ | Коротко о вашем событии |
| `continueToReview` | Continue to review → | შემდეგი: გადამოწმება → | Далее: проверка → |
| `backToTime` | Back to time | დროზე დაბრუნება | Назад ко времени |
| `reviewIntro` | Check your details, then send your request. We will reply by email to confirm. | გადაამოწმეთ მონაცემები და გაგზავნეთ მოთხოვნა. დასადასტურებლად ელფოსტით გიპასუხებთ. | Проверьте данные и отправьте запрос. Мы ответим по электронной почте и подтвердим время. |
| `contactDetails` | Contact details | საკონტაქტო მონაცემები | Контактные данные |
| `sending` | Sending… | იგზავნება… | Отправка… |
| `send` | Send request | მოთხოვნის გაგზავნა | Отправить запрос |
| `backToDetails` | Back to details | მონაცემებზე დაბრუნება | Назад к данным |
| `failedEyebrow` | Something went wrong | რაღაც შეფერხდა | Что-то пошло не так |
| `failedTitle` | Your request could not be sent. | მოთხოვნის გაგზავნა ვერ მოხერხდა. | Не удалось отправить запрос. |
| `failedDefault` | Please check your connection and try again. Nothing has been saved. | შეამოწმეთ ინტერნეტკავშირი და სცადეთ ხელახლა. არაფერი შენახულა. | Проверьте подключение к интернету и попробуйте ещё раз. Ничего не сохранено. |
| `tryAgain` | Try again | ხელახლა ცდა | Попробовать ещё раз |
| `editDetails` | Edit details | მონაცემების შეცვლა | Изменить данные |
| `doneEyebrow` | Thank you | გმადლობთ | Спасибо |
| `doneTitle` | We have your request. | თქვენი მოთხოვნა მიღებულია. | Мы получили ваш запрос. |
| `doneBody` | We will email {email} to confirm a time. Until then, your slot is a request, not a confirmed booking. | დროის დასადასტურებლად მოგწერთ მისამართზე {email}. მანამდე ეს მხოლოდ მოთხოვნაა და არა დადასტურებული ჩაწერა. | Мы напишем на {email}, чтобы подтвердить время. До этого момента это запрос, а не подтверждённая запись. |
| `requestedDate` | Requested date | მოთხოვნილი თარიღი | Желаемая дата |
| `requestedTime` | Requested time | მოთხოვნილი დრო | Желаемое время |
| `contact` | Contact | კონტაქტი | Контакт |
| `timeLabel` | {time} Tbilisi time | {time}, თბილისის დროით | {time} по Тбилиси |
| `timeLabelLocal` | {time} Tbilisi time ({local} your time) | {time}, თბილისის დროით ({local} თქვენი დროით) | {time} по Тбилиси ({local} по вашему времени) |
| `noteTitle` | Your details | თქვენი მონაცემები | Ваши данные |
| `noteBody` | We use these details only to respond to your request. How we handle them: <link>Privacy Policy</link>. | ამ მონაცემებს მხოლოდ თქვენს მოთხოვნაზე საპასუხოდ ვიყენებთ. როგორ ვამუშავებთ მათ: <link>კონფიდენციალურობის პოლიტიკა</link>. | Мы используем эти данные только для ответа на ваш запрос. Как мы с ними обращаемся: <link>Политика конфиденциальности</link>. |
| `errors.nameRequired` | Enter your name. | შეიყვანეთ თქვენი სახელი. | Введите ваше имя. |
| `errors.emailInvalid` | Enter a complete email address. | შეიყვანეთ ელფოსტის სრული მისამართი. | Введите полный адрес эл. почты. |
| `errors.dateRequired` | Choose a date. | აირჩიეთ თარიღი. | Выберите дату. |
| `errors.dateRange` | Choose a date in the coming months. | აირჩიეთ თარიღი უახლოესი თვეების ფარგლებში. | Выберите дату в ближайшие месяцы. |
| `errors.timeRequired` | Choose a time. | აირჩიეთ დრო. | Выберите время. |
| `errors.rateLimited` | Too many requests. Please try again later. | ძალიან ბევრი მოთხოვნაა. სცადეთ მოგვიანებით. | Слишком много запросов. Попробуйте позже. |
| `errors.tooLarge` | Request too large. | მოთხოვნა ზედმეტად დიდია. | Слишком большой запрос. |
| `errors.saveFailed` | We could not save your request. Please try again. | მოთხოვნის შენახვა ვერ მოხერხდა. სცადეთ ხელახლა. | Не удалось сохранить запрос. Попробуйте ещё раз. |
| `errors.timeout` | The server took too long to answer. Please try again. Nothing has been saved. | სერვერი დიდხანს არ პასუხობს. სცადეთ ხელახლა. არაფერი შენახულა. | Сервер слишком долго не отвечает. Попробуйте ещё раз. Ничего не сохранено. |

## auth

| Key | English | ქართული | Русский |
|---|---|---|---|
| `eyebrow` | Host access only | მხოლოდ მასპინძლებისთვის | Только для организаторов |
| `loginTitle` | Host log in | მასპინძლის შესვლა | Вход для организаторов |
| `signupTitle` | Host sign up | მასპინძლის რეგისტრაცია | Регистрация организатора |
| `forgotTitle` | Forgot password? | დაგავიწყდათ პაროლი? | Забыли пароль? |
| `resetTitle` | Choose a new password | ახალი პაროლის არჩევა | Новый пароль |
| `accountTitle` | Your account | თქვენი ანგარიში | Ваш аккаунт |
| `linkInvalid` | That link is invalid or has expired. Log in, or request a new link. | ბმული არასწორია ან მისი ვადა ამოიწურა. შედით ანგარიშში ან მოითხოვეთ ახალი ბმული. | Ссылка недействительна или устарела. Войдите или запросите новую ссылку. |
| `loginIntro` | Log in with the email and password you registered with. | შედით იმ ელფოსტითა და პაროლით, რომლითაც დარეგისტრირდით. | Войдите с адресом эл. почты и паролем, указанными при регистрации. |
| `signupIntro` | Create your host account. Guests do not need an account. | შექმენით მასპინძლის ანგარიში. სტუმრებს ანგარიში არ სჭირდებათ. | Создайте аккаунт организатора. Гостям аккаунт не нужен. |
| `forgotIntro` | Enter your email and we will send you a link to choose a new password. | შეიყვანეთ ელფოსტა და გამოგიგზავნით ბმულს ახალი პაროლის ასარჩევად. | Введите адрес эл. почты, и мы отправим ссылку для выбора нового пароля. |
| `name` | Name | სახელი | Имя |
| `namePlaceholder` | Your name | თქვენი სახელი | Ваше имя |
| `email` | Email | ელფოსტა | Эл. почта |
| `emailPlaceholder` | Your email | თქვენი ელფოსტა | Ваш адрес эл. почты |
| `password` | Password | პაროლი | Пароль |
| `passwordPlaceholder` | Your password | თქვენი პაროლი | Ваш пароль |
| `passwordPlaceholderNew` | At least 8 characters | მინიმუმ 8 სიმბოლო | Не менее 8 символов |
| `ageConfirm` | I confirm I am 16 or older. | ვადასტურებ, რომ 16 წლის ან მეტის ვარ. | Подтверждаю, что мне 16 лет или больше. |
| `ageConfirmation` | Age confirmation | ასაკის დადასტურება | Подтверждение возраста |
| `consent` | By signing up, you agree to the <terms>Terms of Service</terms> and confirm you have read the <privacy>Privacy Policy</privacy>. | რეგისტრაციით ეთანხმებით <terms>მომსახურების პირობებს</terms> და ადასტურებთ, რომ გაეცანით <privacy>კონფიდენციალურობის პოლიტიკას</privacy>. | Регистрируясь, вы принимаете <terms>Условия использования</terms> и подтверждаете, что ознакомились с <privacy>Политикой конфиденциальности</privacy>. |
| `loggingIn` | Logging in… | შესვლა… | Вход… |
| `logIn` | Log in | შესვლა | Войти |
| `creatingAccount` | Creating account… | ანგარიში იქმნება… | Создаём аккаунт… |
| `signUp` | Sign up | რეგისტრაცია | Зарегистрироваться |
| `sendingLink` | Sending… | იგზავნება… | Отправка… |
| `sendLink` | Send recovery link | აღდგენის ბმულის გაგზავნა | Отправить ссылку для восстановления |
| `forgotLink` | Forgot password? | დაგავიწყდათ პაროლი? | Забыли пароль? |
| `newHost` | New host? Sign up | ახალი მასპინძელი ხართ? დარეგისტრირდით | Впервые здесь? Зарегистрируйтесь |
| `alreadyHost` | Already a host? Log in | უკვე გაქვთ ანგარიში? შედით | Уже есть аккаунт? Войти |
| `backToLogin` | Back to log in | შესვლაზე დაბრუნება | Назад ко входу |
| `resetSent` | If an account exists for that email, a reset link is on its way. Check your inbox and spam folder. | თუ ამ ელფოსტით ანგარიში არსებობს, აღდგენის ბმული უკვე გზაშია. შეამოწმეთ შემოსულები და სპამის საქაღალდე. | Если аккаунт с этим адресом существует, ссылка для восстановления уже отправлена. Проверьте входящие и папку «Спам». |
| `almostDone` | Almost done | თითქმის მზადაა | Почти готово |
| `confirmEmail` | Confirm your email. | დაადასტურეთ ელფოსტა. | Подтвердите адрес эл. почты. |
| `confirmSent` | We sent a confirmation link to {email}. Open it on this device to activate your host account. If you do not see it, check your spam folder. | დადასტურების ბმული გავგზავნეთ მისამართზე {email}. გახსენით იგი ამავე მოწყობილობაზე, რომ მასპინძლის ანგარიში გააქტიურდეს. თუ წერილს ვერ ხედავთ, შეამოწმეთ სპამის საქაღალდე. | Мы отправили ссылку для подтверждения на {email}. Откройте её на этом же устройстве, чтобы активировать аккаунт организатора. Если письма нет, проверьте папку «Спам». |
| `goToLogin` | Go to log in | შესვლაზე გადასვლა | Перейти ко входу |
| `network` | We could not reach the server. Check your connection, refresh the page and try again. | სერვერთან დაკავშირება ვერ მოხერხდა. შეამოწმეთ ინტერნეტკავშირი, განაახლეთ გვერდი და სცადეთ ხელახლა. | Не удалось связаться с сервером. Проверьте подключение, обновите страницу и попробуйте ещё раз. |
| `minChars` | Use at least {count} characters. | გამოიყენეთ მინიმუმ {count} სიმბოლო. | Используйте не менее {count} символов. |

## errors

| Key | English | ქართული | Русский |
|---|---|---|---|
| `busy` | Too many attempts. Please wait a few minutes and try again. | ძალიან ბევრი მცდელობაა. დაელოდეთ რამდენიმე წუთს და სცადეთ ხელახლა. | Слишком много попыток. Подождите несколько минут и попробуйте снова. |
| `invalid_login` | Email or password is incorrect. | ელფოსტა ან პაროლი არასწორია. | Неверный адрес эл. почты или пароль. |
| `email_not_confirmed` | Please confirm your email first. Check your inbox for our message. | ჯერ დაადასტურეთ ელფოსტა. ჩვენი წერილი შემოსულებში მოძებნეთ. | Сначала подтвердите адрес эл. почты. Проверьте наше письмо во входящих. |
| `already_registered` | An account with this email already exists. Log in instead. | ამ ელფოსტით ანგარიში უკვე არსებობს. შედით ანგარიშში. | Аккаунт с этим адресом уже существует. Войдите. |
| `weak_password` | Choose a stronger password: at least 8 characters, and not one you use elsewhere. | აირჩიეთ უფრო ძლიერი პაროლი: მინიმუმ 8 სიმბოლო, რომელსაც სხვაგან არ იყენებთ. | Выберите пароль надёжнее: не менее 8 символов и не тот, что вы используете где-то ещё. |
| `generic` | Something went wrong. Please try again. | რაღაც შეფერხდა. სცადეთ ხელახლა. | Что-то пошло не так. Попробуйте ещё раз. |
| `missing_credentials` | Enter your email and password. | შეიყვანეთ ელფოსტა და პაროლი. | Введите адрес эл. почты и пароль. |
| `check_details` | Please check your details. | გადაამოწმეთ მონაცემები. | Проверьте данные. |
| `age` | Host accounts are for people aged 16 or older. | მასპინძლის ანგარიში 16 წლის და უფროსი ასაკის პირებისთვისაა. | Аккаунт организатора доступен с 16 лет. |
| `invalid_email` | Enter a complete email address. | შეიყვანეთ ელფოსტის სრული მისამართი. | Введите полный адрес эл. почты. |
| `short_password` | Use at least 8 characters. | გამოიყენეთ მინიმუმ 8 სიმბოლო. | Используйте не менее 8 символов. |
| `reset_expired` | This reset link has expired. Request a new one from the log-in screen. | აღდგენის ბმულს ვადა გაუვიდა. მოითხოვეთ ახალი შესვლის გვერდიდან. | Срок действия ссылки истёк. Запросите новую на странице входа. |
| `name_required` | Enter your name. | შეიყვანეთ თქვენი სახელი. | Введите ваше имя. |
| `password_required` | Enter your password. | შეიყვანეთ პაროლი. | Введите пароль. |

## account

| Key | English | ქართული | Русский |
|---|---|---|---|
| `failed` | We could not load your account. Please refresh the page. | ანგარიშის ჩატვირთვა ვერ მოხერხდა. განაახლეთ გვერდი. | Не удалось загрузить аккаунт. Обновите страницу. |
| `loading` | Loading your account… | ანგარიში იტვირთება… | Загружаем аккаунт… |
| `name` | Name | სახელი | Имя |
| `email` | Email | ელფოსტა | Эл. почта |
| `type` | Account type | ანგარიშის ტიპი | Тип аккаунта |
| `admin` | Admin | ადმინისტრატორი | Администратор |
| `host` | Host | მასპინძელი | Организатор |
| `since` | Member since | რეგისტრაციის თარიღი | С нами с |
| `notYet` | Creating events and managing guests from your account is not available yet. To plan an event, book a consultation from the home page. | ღონისძიებების შექმნა და სტუმრების მართვა ანგარიშიდან ჯერ ხელმისაწვდომი არ არის. ღონისძიების დასაგეგმად ჩაეწერეთ კონსულტაციაზე მთავარ გვერდზე. | Создание мероприятий и управление гостями в аккаунте пока недоступны. Чтобы спланировать событие, запишитесь на консультацию на главной странице. |
| `openAdmin` | Open admin | ადმინისტრირების პანელის გახსნა | Открыть панель администратора |
| `loggingOut` | Logging out… | გამოსვლა… | Выход… |
| `logOut` | Log out | გამოსვლა | Выйти |

## reset

| Key | English | ქართული | Русский |
|---|---|---|---|
| `newPassword` | New password | ახალი პაროლი | Новый пароль |
| `saving` | Saving… | ინახება… | Сохраняем… |
| `save` | Save new password | ახალი პაროლის შენახვა | Сохранить новый пароль |
| `updated` | Your password has been updated. | პაროლი განახლებულია. | Пароль обновлён. |
| `goToAccount` | Go to your account | ანგარიშზე გადასვლა | Перейти в аккаунт |

## notFound

| Key | English | ქართული | Русский |
|---|---|---|---|
| `eyebrow` | Error 404 | შეცდომა 404 | Ошибка 404 |
| `title` | This page does not exist. | ეს გვერდი არ არსებობს. | Такой страницы нет. |
| `body` | The link may be old or mistyped. Everything about LYST starts on the home page. | ბმული შესაძლოა ძველია ან შეცდომით არის აკრეფილი. LYST-თან დაკავშირებული ყველაფერი მთავარი გვერდიდან იწყება. | Возможно, ссылка устарела или в ней опечатка. Всё о LYST начинается с главной страницы. |
| `home` | Go to the home page | მთავარ გვერდზე გადასვლა | На главную |
| `book` | Book a consultation | კონსულტაციაზე ჩაწერა | Записаться на консультацию |

## legal

| Key | English | ქართული | Русский |
|---|---|---|---|
| `version` | Version | ვერსია | Версия |
| `updated` | Last updated | ბოლო განახლება | Последнее обновление |
| `contact` | Contact | კონტაქტი | Контакты |
| `prevails` | This document is available in Georgian, English and Russian. If the versions differ, the Georgian version prevails. | ეს დოკუმენტი ხელმისაწვდომია ქართულ, ინგლისურ და რუსულ ენებზე. ვერსიებს შორის განსხვავების შემთხვევაში უპირატესობა ქართულ ვერსიას ენიჭება. | Этот документ доступен на грузинском, английском и русском языках. В случае расхождений между версиями преимущественную силу имеет грузинская версия. |
| `otherDocPrivacy` | Privacy Policy | კონფიდენციალურობის პოლიტიკა | Политика конфиденциальности |
| `otherDocTerms` | Terms of Service | მომსახურების პირობები | Условия использования |

