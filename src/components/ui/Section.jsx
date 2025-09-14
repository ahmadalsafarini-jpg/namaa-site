const Section = ({ id, title, subtitle, children }) => (
  <section id={id} className="mx-auto max-w-6xl px-4 py-16">
    <div className="mb-8">
      <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h2>
      {subtitle && <p className="mt-2 text-slate-600">{subtitle}</p>}
    </div>
    {children}
  </section>
);

export default Section;
