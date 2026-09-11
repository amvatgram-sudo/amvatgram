export default function Home(){
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-salte-900">
      <div className="mx-auto max-w-5xl">
        <header className="mb-16">
          <p className="mb-3 text-sm font-medium text-700">
            نسخه 0.1.0
          </p>

          <h1 className="mb-4 text-4xl font-bold">امواتگرام</h1>

          <p className="max-w-2xl text-lg leading-8 text-slate-600">
            سامانه جامع ثبت آگهی درگذشت اطلاع رسانی مراسم صفحه یادبود و خدمات مرتبط با مراسم ترحیم
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="mb-3 text-xl font-semibold">ثبت آگهی</h2>
            <p className="leading-7 text-slate-600">
              ثبت و مدیریت اطلاعات آگهی درگذشت و مراسم
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="mb-3 text-xl font-semibold">صفحه یادبود</h2>
            <p className="leading-7 text-slate-600">
              ایجاد صفحه ای برای یاد بود و دریافت پیام های تسلیت
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="mb-3 text-xl font-semibold">محتوای مذهبی</h2>
            <p className="leading-7 text-slate-600">
              نمایش محتوای متناسب با مذاهب انتخاب شده توسط کاربر
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}