import Link from "next/link";

const services = [
  {
    number: "۰۱",
    title: "ثبت آگهی درگذشت",
    description:
      "اطلاع‌رسانی محترمانه درباره درگذشت عزیزان و اعلام زمان مراسم.",
  },
  {
    number: "۰۲",
    title: "صفحه یادبود",
    description:
      "ایجاد صفحه‌ای ماندگار برای یادبود، خاطرات و پیام‌های تسلیت.",
  },
  {
    number: "۰۳",
    title: "اطلاع‌رسانی مراسم",
    description:
      "نمایش زمان و مکان مراسم تشییع، خاکسپاری، ختم و یادبود.",
  },
];

export default function Home() {
  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#f8f7f4] text-slate-900"
    >
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight text-slate-900"
          >
            امواتگرام
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-slate-600 md:flex">
            <Link
              href="#services"
              className="transition hover:text-blue-700"
            >
              خدمات
            </Link>

            <Link href="#about" className="transition hover:text-blue-700">
              درباره ما
            </Link>

            <Link href="#contact" className="transition hover:text-blue-700">
              ارتباط با ما
            </Link>
          </nav>

          <Link
            href="#register"
            className="rounded-full bg-blue-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-800"
          >
            ثبت آگهی
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 pb-20 pt-20 lg:px-8 lg:pb-28 lg:pt-28">
        <div className="max-w-3xl">
          <p className="mb-5 text-sm font-semibold text-blue-700">
            سامانه جامع یادبود و اطلاع‌رسانی
          </p>

          <h1 className="text-4xl font-bold leading-[1.4] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            یاد عزیزان،
            <br />
            همیشه ماندگار است.
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-9 text-slate-600">
            امواتگرام فضایی محترمانه برای ثبت آگهی درگذشت، اطلاع‌رسانی مراسم و
            ساخت صفحه یادبود برای عزیزان شماست.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="#register"
              className="rounded-full bg-blue-700 px-7 py-3.5 text-center font-medium text-white transition hover:bg-blue-800"
            >
              ثبت آگهی جدید
            </Link>

            <Link
              href="#services"
              className="rounded-full border border-slate-300 bg-white px-7 py-3.5 text-center font-medium text-slate-700 transition hover:border-blue-700 hover:text-blue-700"
            >
              آشنایی با خدمات
            </Link>
          </div>
        </div>
      </section>

      <section id="services" className="bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-12 max-w-2xl">
            <p className="mb-3 text-sm font-semibold text-blue-700">
              خدمات ما
            </p>

            <h2 className="text-3xl font-bold text-slate-950">
              همراه شما در لحظات سخت
            </h2>

            <p className="mt-4 leading-8 text-slate-600">
              ابزارهایی ساده و محترمانه برای ثبت اطلاعات و اطلاع‌رسانی به
              خانواده، دوستان و آشنایان.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {services.map((service) => (
              <article
                key={service.number}
                className="rounded-2xl border border-slate-200 bg-[#f8f7f4] p-7 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <span className="text-sm font-bold text-blue-700">
                  {service.number}
                </span>

                <h3 className="mt-8 text-xl font-bold text-slate-950">
                  {service.title}
                </h3>

                <p className="mt-4 leading-8 text-slate-600">
                  {service.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div
          id="register"
          className="rounded-3xl bg-slate-900 px-7 py-12 text-white lg:px-14"
        >
          <p className="mb-4 text-sm font-semibold text-blue-300">
            امواتگرام
          </p>

          <h2 className="max-w-2xl text-3xl font-bold leading-relaxed">
            بستری ساده برای حفظ یاد و احترام به عزیزان
          </h2>

          <p className="mt-5 max-w-2xl leading-8 text-slate-300">
            هدف ما فراهم‌کردن فضایی آرام، قابل اعتماد و در شأن خانواده‌ها برای
            ثبت و به‌اشتراک‌گذاری اطلاعات مراسم است.
          </p>
        </div>
      </section>

      <footer id="contact" className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8 text-sm text-slate-500 lg:px-8">
          © ۱۴۰۵ امواتگرام — تمامی حقوق محفوظ است.
        </div>
      </footer>
    </main>
  );
}
